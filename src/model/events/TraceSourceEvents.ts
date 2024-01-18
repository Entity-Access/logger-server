import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import TraceSource from "../entities/TraceSource.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";
import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import Inject from "@entity-access/entity-access/dist/di/di.js";
import AppDbContext from "../AppDbContext.js";
import { ForeignKeyFilter } from "@entity-access/entity-access/dist/model/events/EntityEvents.js";

export default class TraceSourceEvents extends AuthenticatedEvents<TraceSource> {

    @Inject
    db: AppDbContext;

    filter(query: IEntityQuery<TraceSource>) {
        if (!this.verify) {
            return query;
        }
        if (this.sessionUser.isAdmin) {
            return query;
        }
        const user = this.sessionUser;
        return query.where(user, (p) => (x) => x.sourceUsers.some((u) => u.userID === p.userID));
    }

    beforeInsert(entity: TraceSource, entry: ChangeEntry<TraceSource>) {
        entity.sourceUsers ??= [];
        if (this.verify) {
            const { userID } = this.sessionUser;
            entity.sourceUsers.push(this.db.sourceUsers.add({
                userID
            }));
        }
    }

}