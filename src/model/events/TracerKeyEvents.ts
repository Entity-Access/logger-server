import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import TracerKey from "../entities/TracerKey.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";
import { randomUUID } from "crypto";
import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";

export default class TracerKeyEvents extends AuthenticatedEvents<TracerKey> {

    filter(query: IEntityQuery<TracerKey>) {
        if (!this.verify) {
            return query;
        }
        return query.where(this.sessionUser, (p) => (x) => x.source.userID === p.userID);
    }

    beforeInsert(entity: TracerKey, entry: ChangeEntry<TracerKey>) {
        entity.key = randomUUID();
    }

}