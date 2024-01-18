import Inject, { RegisterScoped } from "@entity-access/entity-access/dist/di/di.js";
import SessionUser from "@entity-access/server-pages/dist/core/SessionUser.js";
import { IAuthCookie } from "@entity-access/server-pages/dist/services/TokenService.js";
import USP from "@entity-access/server-pages/dist/services/UserSessionProvider.js"
import AppDbContext from "../model/AppDbContext.js";

@RegisterScoped
export default class UserSessionProvider extends USP {

    @Inject
    db: AppDbContext;

    async getUserSession({ userID, id: sessionID, expiry }: IAuthCookie) {
        const session = await this.db.loginSessions.where({ userID, sessionID }, (p) => (x) => x.userID === p.userID
            && x.sessionID === p.sessionID && x.invalid === false)
            .include((x) => x.user.roles)
            .firstOrFail();
        return {
            userID,
            sessionID,
            userName: session.user.userName,
            roles: [],
            expiry: session.expiry
            // roles: user.roles?.map((r) => r.roleName)
        };
    }

}