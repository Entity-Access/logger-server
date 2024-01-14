import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import type TraceTag from "./TraceTags.js";

@Table("Traces")
export default class Trace {

    @Column({ dataType: "BigInt", generated: "identity", key: true })
    public traceID: number;

    @Column({})
    public dateCreated: DateTime;


    public traceTags: TraceTag[];


}