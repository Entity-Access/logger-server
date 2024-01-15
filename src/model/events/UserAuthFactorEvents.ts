import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import UserAuthFactor from "../entities/UserAuthFactor.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";
import EntityAccessError from "@entity-access/entity-access/dist/common/EntityAccessError.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Inject from "@entity-access/entity-access/dist/di/di.js";
import { randomUUID } from "crypto";
import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import MultiAuthFactorService from "../../services/MultiAuthFactorService.js";


export default class UserAuthFactorEvents extends AuthenticatedEvents<UserAuthFactor> {

    @Inject
    multiAuthFactorService: MultiAuthFactorService;

    filter(query: IEntityQuery<UserAuthFactor>): IEntityQuery<UserAuthFactor> {
        if (this.verify) {
            this.sessionUser.ensureLoggedIn();
            if (this.sessionUser.isAdmin) {
                return query;
            }
        }
        const { userID } = this.sessionUser;
        return query.where({ userID }, (p) => (x) => x.userID === p.userID);
    }

    modify(query: IEntityQuery<UserAuthFactor>): IEntityQuery<UserAuthFactor> {
        return this.filter(query);
    }

    delete(query: IEntityQuery<UserAuthFactor>) {
        return this.filter(query);
    }

    async beforeInsert(entity: UserAuthFactor, entry: ChangeEntry<UserAuthFactor>) {

        if (this.verify) {
            this.sessionUser.ensureLoggedIn();
        }

        if (entity.method === "one-time") {
            entity.secret =  `sm-otp-${randomUUID()}`;
            entity.displaySecret = entity.secret;
            entity.hint = entity.secret.substring(0, 10);
            entity.verified = true;
            return;
        }

        const name = this.sessionUser.userName;

        if (entity.method !== "totp") {
            throw new EntityAccessError("Method not supported");
        }

        const { secret , dataUrl, service } = await this.multiAuthFactorService.create(name);

        entity.secret = secret;
        entity.hint = service;
        entity.qrCodeDataUrl = dataUrl;

        entity.dateUpdated = DateTime.now;
    }

    async beforeUpdate(entity: UserAuthFactor, entry: ChangeEntry<UserAuthFactor>) {
        if(entry.isModified("verified")) {
            throw new EntityAccessError(`Cannot modify verified`);
        }
        if (!entity.verified) {
            await this.multiAuthFactorService.verify({ id: 0, token: entity.token, secret: entity.secret});
            entity.verified = true;
        }
    }

}
