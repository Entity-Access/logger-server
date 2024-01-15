import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import { UserRole } from "../entities/UserRole.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class UserRoleEvents extends AuthenticatedEvents<UserRole> {

    filter(query: IEntityQuery<UserRole>): IEntityQuery<UserRole> {
        if (this.verify) {
            this.sessionUser.ensureLoggedIn();
        }
        if (this.sessionUser.isAdmin) {
            return query;
        }
        const { userID } = this.sessionUser;
        return query.where({ userID }, (p) => (x) => x.userID === p.userID);
    }

    includeFilter(query: IEntityQuery<UserRole>, type?: any, key?: string): IEntityQuery<UserRole> {
        return null;
    }
}
