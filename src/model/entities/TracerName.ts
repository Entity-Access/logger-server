import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import type Trace from "./Trace.js";

@Table("TracerNames")
@Index({
    name: "IX_TracerNames_Unique",
    unique: true,
    columns: [
        { name: (x) => x.type, descending: false },
        { name: (x) => x.name, descending: false }
    ]
})
export class TracerName {

    @Column({ dataType: "BigInt", key: true, generated: "identity"})
    public nameID: number;

    @Column({ dataType: "Char", length: 200})
    public type: string;

    @Column({ dataType: "Char", length: 200})
    public name: string;

    serverTraces: Trace[];
    appTraces: Trace[];
    sessionTraces: Trace[];
    hostTraces: Trace[];
    userTraces: Trace[];


}