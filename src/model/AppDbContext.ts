import { RegisterScoped } from "@entity-access/entity-access/dist/di/di.js";
import EntityContext from "@entity-access/entity-access/dist/model/EntityContext.js";
import { User } from "./entities/User.js";
import { UserRoleType } from "./entities/UserRoleType.js";
import { UserRole } from "./entities/UserRole.js";
import LoginSession from "./entities/LoginSession.js";
import UserAuthFactor from "./entities/UserAuthFactor.js";
import Configuration from "./entities/Configuration.js";

@RegisterScoped
export default class AppDbContext extends EntityContext {

    public configurations = this.model.register(Configuration);

    public loginSessions = this.model.register(LoginSession);

    public users = this.model.register(User);

    public userAuthFactors = this.model.register(UserAuthFactor);

    public userRoles = this.model.register(UserRole);

    public roleTypes = this.model.register(UserRoleType);

}