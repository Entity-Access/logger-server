import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import Trace from "../entities/Trace.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class TraceEvents extends AuthenticatedEvents<Trace> {

    filter(query: IEntityQuery<Trace>) {
        if (!this.verify) {
            return query;
        }
        if (this.sessionUser.isAdmin) {
            return query;
        }
        const user = this.sessionUser;
        return query.where(user, (p) => (x) => x.source.sourceUsers.some((u) => u.userID === p.userID));
    }

}