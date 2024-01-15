import EntityEvents, { ForeignKeyFilter } from "@entity-access/entity-access/dist/model/events/EntityEvents.js";
import LoginSession from "../entities/LoginSession.js";
import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import Inject from "@entity-access/entity-access/dist/di/di.js";
import CryptoService from "../../services/CryptoService.js";
import EntityAccessError from "@entity-access/entity-access/dist/common/EntityAccessError.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import ErrorModel from "@entity-access/entity-access/dist/common/ErrorModel.js";
import AppDbContext from "../AppDbContext.js";
import SessionUser from "@entity-access/server-pages/dist/core/SessionUser.js";
import { ChangePassword } from "../entities/User.js";
import MultiAuthFactorService from "../../services/MultiAuthFactorService.js";

export default class LoginSessionEvents extends EntityEvents<LoginSession> {

    @Inject
    private db: AppDbContext;

    @Inject
    private cryptoService: CryptoService;

    @Inject
    private sessionUser: SessionUser;

    @Inject
    private multiAuthFactorService: MultiAuthFactorService;

    currentUser() {
        const { sessionID = 0, userID = 0 } = this.sessionUser;
        return this.db.loginSessions
            .where({ sessionID, userID}, (p) => (x) => x.sessionID === p.sessionID
                && x.userID === p.userID)
            .include((x) => x.user.roles);
    }

    filter(query: IEntityQuery<LoginSession>): IEntityQuery<LoginSession> {
        const { userID } = this.sessionUser;
        if (!userID) {
            throw new EntityAccessError();
        }
        return query.where({ userID }, (p) => (x) => x.userID === p.userID);
    }

    modify(query: IEntityQuery<LoginSession>): IEntityQuery<LoginSession> {

        const { userID, sessionID } = this.sessionUser;

        if (!userID) {
            // this is special case when login is not successful
            // as we still need to verify totp and complete change password.
            return query.where({ sessionID}, (p) => (x) => x.sessionID === p.sessionID);
        }

        return query.where({ userID, sessionID }, (p) => (x) => x.userID === p.userID && x.sessionID === p.sessionID);
    }

    delete(query: IEntityQuery<LoginSession>): IEntityQuery<LoginSession> {
        throw new EntityAccessError();
    }

    async beforeInsert(entity: LoginSession, entry: ChangeEntry) {

        await this.updateSessionForRealUser(entity);

    }

    async updateSessionForRealUser(entity: LoginSession) {
        // check if password is valid or not..
        const user = await this.db.users
            .where({ userName: entity.userName }, (p) => (x) => x.userName === p.userName )
            .firstOrFail();


        const { checkPassword } = entity;
        const now = DateTime.now;

        const hash = this.cryptoService.hash(user.passwordSalt, checkPassword);
        if (hash !== user.passwordHash) {
            throw new EntityAccessError("Invalid password");
        }
        entity.userID = user.userID;
        entity.start = now.asJSDate;
        entity.expiry = now.addDays(7).asJSDate;
        entity.dateUpdated = now;
        entity.invalid = false;
        entity.status = "created";

        if (user.multiFactor) {
            if (!entity.timeToken) {
                entity.invalid = true;
                entity.status = "totp";
                return;
            }
        }
        if (user.status === "change-password") {
            if (!entity.newPassword) {
                entity.invalid = true;
                entity.status = "change-password";
                return;
            }
            user.dateUpdated = DateTime.now;
            user.changePassword = new ChangePassword();
            user.changePassword.oldPassword = entity.checkPassword;
            user.changePassword.newPassword = entity.newPassword;
        }
    }

    async afterInsert(entity: LoginSession, entry: ChangeEntry) {
        if (entity.status !== "created") {
            await this.sessionUser.setAuthCookie({
                id: entity.sessionID,
                expiry: entity.expiry,
                version: "1.1",
                active: false
            });
            return;
        }

        // set the cookie...
        await this.sessionUser.setAuthCookie({
            id: entity.sessionID,
            expiry: entity.expiry,
            version: "1.1",
            active: true
        });
    }

    beforeDelete(entity: LoginSession, entry: ChangeEntry): Promise<void> {
        throw new EntityAccessError();
    }

    async beforeUpdate(entity: LoginSession, entry: ChangeEntry<LoginSession>) {

        if (entry.modified.size === 1 && entry.isModified("dateUpdated")) {
            return;
        }

        if (entry.isModified("deviceToken") && entry.isModified("deviceTokenType")) {
            if (!entity.invalid) {
                entity.dateUpdated = DateTime.now;
                return;
            }
        }

        if (entry.isModified("invalid")) {
            if(entity.invalid) {
                entity.dateUpdated = DateTime.now;
            }
            return;
        }

        if(!(entry.isModified("dateUpdated"))) {
            throw new EntityAccessError(`Cannot modify anything except invalid, dateUpdated`);
        }
        const user = await this.db.users
            .where({ userName: entity.userName }, (p) => (x) => x.userName === p.userName )
            .firstOrFail();
        if (entity.status === "totp") {
            if (entity.timeToken) {
                // verify...
                await this.multiAuthFactorService.verify({ token: entity.timeToken, id: user.userID });
                if(user.status === "change-password") {
                    entity.status = "change-password";
                    entity.invalid = true;
                    return;
                }
                entity.status = "created";
                entity.invalid = false;
            }
            if (entity.oneTimePassword) {
                const otp = await this.db.userAuthFactors.where({
                    userID: user.userID,
                    otp: entity.oneTimePassword
                }, (p) => (x) => x.userID === p.userID && x.secret === p.otp)
                .first();
                if (!otp) {
                    throw new EntityAccessError(`Invalid One time password`);
                }
                this.db.userAuthFactors.delete(otp);
                if(user.status === "change-password") {
                    entity.status = "change-password";
                    entity.invalid = true;
                    return;
                }
                entity.status = "created";
                entity.invalid = false;
            }
        }
        if (user.status === "change-password") {
            if (!entity.newPassword) {
                entity.status = "change-password";
                throw new EntityAccessError(`New password is required`);
            }
            user.dateUpdated = DateTime.now;
            user.changePassword = new ChangePassword();
            user.changePassword.oldPassword = entity.checkPassword;
            user.changePassword.newPassword = entity.newPassword;
            if (user.multiFactor) {
                entity.status = "totp";
            } else {
                entity.status = "created";
                entity.invalid = false;
            }
        }
        return Promise.resolve();
    }

    async afterUpdate(entity: LoginSession, entry: ChangeEntry<LoginSession>) {
        if (entity.status === "created") {

            if (entity.invalid) {
                this.sessionUser.clearAuthCookie();
                return;
            }

            await this.sessionUser.setAuthCookie({
                id: entity.sessionID,
                expiry: entity.expiry,
                version: "1.1",
                active: true
            });
        }
    }

    onForeignKeyFilter(filter: ForeignKeyFilter<LoginSession, any>): IEntityQuery<any> {
        // before login there may not be any relations set
        // so we need to ignore userID set on loginSession
        if (filter.is((x) => x.userID)) {
            return null;
        }
        return filter.modify();
    }

}