import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import SourceUser from "../entities/SourceUser.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class SourceUserEvents extends AuthenticatedEvents<SourceUser> {

    filter(query: IEntityQuery<SourceUser>) {
        if (!this.verify) {
            return query;
        }
        const user = this.sessionUser;
        return query.where(user, (p) => (x) => x.userID === p.userID);
    }
}