import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import Tag from "./Tag.js";
import Trace from "./Trace.js";

@Table("TraceTags")
export default class TraceTag {

    @Column({ dataType: "BigInt", key: true })
    @RelateTo(Trace, {
        property: (x) => x.trace,
        inverseProperty: (x) => x.traceTags
    })
    public traceID: number;

    @Column({ dataType: "BigInt", key: true })
    @RelateTo(Tag, {
        property: (x) => x.tag,
        inverseProperty: (x) => x.traceTags
    })
    public tagID: number;

    @Column({ dataType: "Char", length: 400, nullable: true})
    public value: string;

    public tag: Tag;

    public trace: Trace;
}