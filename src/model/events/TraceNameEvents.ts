import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import { TraceName } from "../entities/TraceName.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class TraceNameEvents extends AuthenticatedEvents<TraceName> {
    filter(query: IEntityQuery<TraceName>) {
        if (!this.verify) {
            return query;
        }
        const user = this.sessionUser;
        user.ensureLoggedIn();
        return query;

    }
}