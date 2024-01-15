import EntityEvents from "@entity-access/entity-access/dist/model/events/EntityEvents.js";
import { User } from "../entities/User.js";
import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import Inject from "@entity-access/entity-access/dist/di/di.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";
import EntityAccessError from "@entity-access/entity-access/dist/common/EntityAccessError.js";
import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import CryptoService from "../../services/CryptoService.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";
import AppDbContext from "../AppDbContext.js";

export default class UserEvents extends AuthenticatedEvents<User> {

    @Inject
    private db: AppDbContext;

    @Inject
    private cryptoService: CryptoService;

    filter(query: IEntityQuery<User>): IEntityQuery<User> {

        if (this.sessionUser.isAdmin) {
            return query;
        }

        const active = ["active", "locked", "change-password"];
        const q = query.where({ active }, (p) => (x) => Sql.in(x.status, p.active));
        return q;
    }

    modify(query: IEntityQuery<User>): IEntityQuery<User> {
        if (this.sessionUser.isAdmin) {
            return query;
        }

        const { userID } = this.sessionUser;
        return query.where({ userID }, (p) => (x) => x.userID === p.userID);
    }

    async beforeInsert(entity: User, entry: ChangeEntry) {
        this.sessionUser.ensureIsAdmin();
        const { userName } = entity;
        const now = DateTime.now;
        entity.dateUpdated = now;
        const existing = await this.db.users.where({ userName }, (p) => (x) => x.userName === p.userName).first();
        if (existing) {
            throw new EntityAccessError("Username already exists");
        }
        if (!entity.changePassword) {
            throw new EntityAccessError("Password must be specified... in changePassword field");
        }
        const { newPassword, forceChangePasswordOnLogin } = entity.changePassword;
        if (forceChangePasswordOnLogin) {
            entity.status = "change-password";
        } else {
            entity.status = "active";
        }
        this.updatePassword(entity, newPassword);

    }

    async beforeUpdate(entity: User, entry: ChangeEntry<User>) {
        const { userName, userID } = entity;
        entity.dateUpdated = DateTime.now;
        const existing = await this.db.users.where({ userName, userID }, (p) => (x) => x.userName === p.userName && x.userID !== p.userID).first();
        if (existing) {
            throw new EntityAccessError("Username already exists");
        }
        if (entry.isModified("passwordHash") || entry.isModified("passwordSalt")) {
            throw new EntityAccessError("Password cannot be modified, please enter new password to change.");
        }

        if (entry.isModified("status")) {
            if (this.verify && !this.sessionUser.isAdmin) {
                throw new EntityAccessError("Only administrator can modify the status");
            }
        }

        if (entry.isModified("multiFactor")) {
            if (entity.multiFactor) {
                const hasTOTP = await this.db.userAuthFactors.where({ userID }, (p) => (x) => x.userID === p.userID
                    && x.method === "totp"
                    && x.verified === true)
                    .first();
                if (!hasTOTP) {
                    throw new EntityAccessError("Authenticator is not set");
                }
                const otp = await this.db.userAuthFactors.where({ userID }, (p) => (x) => x.userID === p.userID
                    && x.method === "one-time")
                    .count();
                if (otp < 8) {
                    throw new EntityAccessError("OTPs are not generated yet");
                }
            }
        }

        const { oldPassword , newPassword, forceChangePasswordOnLogin } = entity.changePassword ?? {};

        if (newPassword) {
            if (oldPassword) {
                if (newPassword === oldPassword) {
                    throw new EntityAccessError("Password cannot be same as old password");
                }
                const existingUser = await this.db.users.where({ userID }, (p) => (x) => x.userID === p.userID).first();
                if( existingUser.passwordHash !== this.cryptoService.hash(existingUser.passwordSalt, oldPassword)) {
                    throw new EntityAccessError(`Incorrect old password`);
                }
            } else {
                this.sessionUser.ensureIsAdmin();
                if (forceChangePasswordOnLogin) {
                    entity.status = "change-password";
                }
            }
            this.updatePassword(entity, newPassword);
        }
    }

    async afterUpdate(entity: User, entry: ChangeEntry<User>) {
        if (entry.isUpdated("status")) {
            if (entity.status === "blocked") {
                const now = new Date();
                const { userID } = entity;
                const sessions = await this.db.loginSessions.where({ userID, now }, (p) => (x) => x.userID
                    && x.invalid === false
                    && x.expiry > p.now)
                    .select(void 0, () => (x) => ({ sessionID: x.sessionID })).toArray();
                for (const keys of sessions) {
                    await this.db.loginSessions.saveDirect({ mode: "update", keys, changes: { invalid: true } });
                }
            }
        }
    }

    private updatePassword(entity: User, password: string) {
        const passwordSalt = this.cryptoService.generateSalt();
        entity.passwordSalt = passwordSalt;
        entity.passwordHash = this.cryptoService.hash(entity.passwordSalt, password);
    }

}