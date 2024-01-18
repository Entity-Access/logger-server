import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import SourceKey from "../entities/SourceKey.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";
import { randomUUID } from "crypto";
import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";

export default class SourceKeyEvents extends AuthenticatedEvents<SourceKey> {

    filter(query: IEntityQuery<SourceKey>) {
        if (!this.verify) {
            return query;
        }

        if (this.sessionUser.isAdmin) {
            return query;
        }
        return query.where(this.sessionUser, (p) => (x) => x.source.sourceUsers.some((u) => u.userID === p.userID));
    }

    beforeInsert(entity: SourceKey, entry: ChangeEntry<SourceKey>) {
        entity.key = randomUUID();
    }

}