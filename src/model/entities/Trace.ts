import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import type TraceTag from "./TraceTags.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import { TraceName } from "./TraceName.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";
import TraceSource from "./TraceSource.js";

@Table("Traces")
export default class Trace {

    @Column({ dataType: "BigInt", generated: "identity", key: true })
    public traceID: number;

    @Column({ dataType: "BigInt"})
    @RelateTo(TraceSource, {
        property: (x) => x.source,
        inverseProperty: (x) => x.traces
    })
    public sourceID: number;

    @Column({ default: () => Sql.date.now() })
    public dateCreated: DateTime;

    @Column({ dataType: "Char", length: 50, default: () => "log" })
    public type: string;

    @Column({ dataType: "BigInt", nullable: true })
    @RelateTo(TraceName, {
        property: (x) => x.server,
        inverseProperty: (x) => x.serverTraces
    })
    public serverID: number;

    @Column({ dataType: "BigInt", nullable: true })
    @RelateTo(TraceName, {
        property: (x) => x.app,
        inverseProperty: (x) => x.appTraces
    })
    public appID: number;

    @Column({ dataType: "BigInt", nullable: true })
    @RelateTo(TraceName, {
        property: (x) => x.session,
        inverseProperty: (x) => x.sessionTraces
    })
    public sessionID: number;

    @Column({ dataType: "BigInt", nullable: true })
    @RelateTo(TraceName, {
        property: (x) => x.host,
        inverseProperty: (x) => x.hostTraces
    })
    public hostID: number;

    @Column({ dataType: "Char", length: 400, nullable: true })
    public path: string;

    @Column({ dataType: "Char", length: 100, nullable: true })
    public ipAddress: string;

    @Column({ dataType: "BigInt", nullable: true })
    @RelateTo(TraceName, {
        property: (x) => x.user,
        inverseProperty: (x) => x.userTraces
    })
    public userID: number;

    @Column({ dataType: "Char", nullable: true })
    public json: string;

    public traceTags: TraceTag[];

    public server: TraceName;

    public app: TraceName;

    public session: TraceName;

    public host: TraceName;

    public user: TraceName;

    public source: TraceSource;


}