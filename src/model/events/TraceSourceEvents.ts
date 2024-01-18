import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import TraceSource from "../entities/TraceSource.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class TraceSourceEvents extends AuthenticatedEvents<TraceSource> {

    filter(query: IEntityQuery<TraceSource>) {
        if (!this.verify) {
            return query;
        }
        const user = this.sessionUser;
        return query.where(user, (p) => (x) => x.sourceUsers.some((u) => u.userID === p.userID));
    }

    

}