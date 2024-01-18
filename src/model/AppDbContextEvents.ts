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
import Trace from "./entities/Trace.js";
import TraceEvents from "./events/TraceEvents.js";
import { TraceName } from "./entities/TraceName.js";
import TraceNameEvents from "./events/TraceNameEvents.js";
import SourceKey from "./entities/SourceKey.js";
import SourceKeyEvents from "./events/SourceKeyEvents.js";
import TraceSource from "./entities/TraceSource.js";
import TraceSourceEvents from "./events/TraceSourceEvents.js";
import Tag from "./entities/Tag.js";
import TagEvents from "./events/TagEvents.js";
import TraceTag from "./entities/TraceTags.js";
import TraceTagEvents from "./events/TraceTagEvents.js";
import SourceUser from "./entities/SourceUser.js";
import SourceUserEvents from "./events/SourceUserEvents.js";

@RegisterSingleton
export default class AppDbContextEvents extends EntityContextEvents {

    constructor() {
        super();
        this.register(Configuration, ConfigurationEvents);
        this.register(LoginSession, LoginSessionEvents);
        this.register(Trace, TraceEvents);
        this.register(TraceName, TraceNameEvents);
        this.register(TraceSource, TraceSourceEvents);
        this.register(SourceKey, SourceKeyEvents);
        this.register(SourceUser, SourceUserEvents);
        this.register(Tag, TagEvents);
        this.register(TraceTag, TraceTagEvents);
        this.register(User, UserEvents);
        this.register(UserRole, UserRoleEvents);
        this.register(UserRoleType, UserRoleTypeEvents);
        this.register(UserAuthFactor, UserAuthFactorEvents);
    }


}