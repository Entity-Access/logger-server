import { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import EntityContextEvents from "@entity-access/entity-access/dist/model/events/ContextEvents.js";
import LoginSession from "./entities/LoginSession.js";
import { User } from "./entities/User.js";
import UserAuthFactor from "./entities/UserAuthFactor.js";
import { UserRole } from "./entities/UserRole.js";
import LoginSessionEvents from "./events/LoginSessionEvents.js";
import UserAuthFactorEvents from "./events/UserAuthFactorEvents.js";
import UserEvents from "./events/UserEvents.js";
import UserRoleEvents from "./events/UserRoleEvents.js";
import { UserRoleType } from "./entities/UserRoleType.js";
import UserRoleTypeEvents from "./events/UserRoleTypeEvents.js";
import Configuration from "./entities/Configuration.js";
import ConfigurationEvents from "./events/ConfigurationEvents.js";

@RegisterSingleton
export default class AppDbContextEvents extends EntityContextEvents {

    constructor() {
        super();
        this.register(Configuration, ConfigurationEvents);
        this.register(LoginSession, LoginSessionEvents);
        this.register(User, UserEvents);
        this.register(UserRole, UserRoleEvents);
        this.register(UserRoleType, UserRoleTypeEvents);
        this.register(UserAuthFactor, UserAuthFactorEvents);
    }


}