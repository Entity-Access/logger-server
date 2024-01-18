import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import type SourceKey from "./SourceKey.js";
import type Trace from "./Trace.js";
import type SourceUser from "./SourceUser.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";

@Table("TraceSources")
export default class TraceSource {

    @Column({ dataType: "BigInt", key: true, generated: "identity"})
    public sourceID: number;

    @Column({ dataType:"Char", length: 400 })
    public name: string;

    @Column({ dataType: "DateTime", default: () => Sql.date.now()})
    dateCreated: DateTime;

    keySources: SourceKey[];

    traces: Trace[];

    sourceUsers: SourceUser[];
}
