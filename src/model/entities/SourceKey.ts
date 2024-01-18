import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import TraceSource from "./TraceSource.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";

@Table("SourceKeys")
@Index({
    name: "IX_SourceKey_Key",
    unique: true,
    columns: [
        { 
            name: (x) => x.key,
            descending: false
        }
    ]
})
@Index({
    name: "IX_SourceKey_Sources",
    unique: true,
    columns: [
        { 
            name: (x) => x.sourceID,
            descending: true
        }
    ]
})
export default class SourceKey {

    @Column({ dataType: "BigInt", key: true, generated: "identity"})
    public keyID: number;

    @Column({ dataType: "BigInt"})
    @RelateTo(TraceSource, {
        property: (x) => x.source,
        inverseProperty: (x) => x.keySources
    })
    public sourceID: number;

    @Column({ dataType: "Char", length: 400 })
    public key: string;

    public source: TraceSource;

}