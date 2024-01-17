import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import { TracerName } from "../entities/TracerName.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class TraceNameEvents extends AuthenticatedEvents<TracerName> {
    filter(query: IEntityQuery<TracerName>) {
        if (!this.verify) {
            return query;
        }
        const user = this.sessionUser;
        user.ensureLoggedIn();
        return query;

    }
}