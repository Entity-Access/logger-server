import { RegisterScoped } from "@entity-access/entity-access/dist/di/di.js";
import EntityContext from "@entity-access/entity-access/dist/model/EntityContext.js";
import { User } from "./entities/User.js";
import { UserRoleType } from "./entities/UserRoleType.js";
import { UserRole } from "./entities/UserRole.js";
import LoginSession from "./entities/LoginSession.js";
import UserAuthFactor from "./entities/UserAuthFactor.js";
import Configuration from "./entities/Configuration.js";
import Trace from "./entities/Trace.js";
import SourceKey from "./entities/SourceKey.js";
import TraceSource from "./entities/TraceSource.js";
import Tag from "./entities/Tag.js";
import TraceTag from "./entities/TraceTags.js";
import { TraceName } from "./entities/TraceName.js";
import SourceUser from "./entities/SourceUser.js";

@RegisterScoped
export default class AppDbContext extends EntityContext {

    public configurations = this.model.register(Configuration);

    public loginSessions = this.model.register(LoginSession);

    public traces = this.model.register(Trace);

    public traceNames = this.model.register(TraceName);

    public sourceKeys = this.model.register(SourceKey);

    public sourceUsers = this.model.register(SourceUser);

    public traceSources = this.model.register(TraceSource);

    public traceTags = this.model.register(TraceTag);

    public tags = this.model.register(Tag);

    public users = this.model.register(User);

    public userAuthFactors = this.model.register(UserAuthFactor);

    public userRoles = this.model.register(UserRole);

    public roleTypes = this.model.register(UserRoleType);

}