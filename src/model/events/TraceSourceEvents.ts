import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import TracerSource from "../entities/TracerSource.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class TraceSourceEvents extends AuthenticatedEvents<TracerSource> {

    filter(query: IEntityQuery<TracerSource>) {
        if (!this.verify) {
            return query;
        }
        const user = this.sessionUser;
        return query.where(user, (p) => (x) => x.userID === p.userID);
    }

}