import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import TraceTag from "../entities/TraceTags.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class TraceTagEvents extends AuthenticatedEvents<TraceTag> {

    filter(query: IEntityQuery<TraceTag>) {
        if (!this.verify) {
            return query;
        }
        return query.where(this.sessionUser, (p) => (x) => x.trace.source.sourceUsers.some((u) => u.userID === p.userID));
    }
}