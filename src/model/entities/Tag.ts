import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";
import type LogTag from "./LogTags.js";

@Table("Tags")
@Index({
    name: "IX_Tags_UniqueName",
    unique: true,
    columns: [
        { name: (x) => x.name, descending: false }
    ]
})
export default class Tag {

    @Column({ key: true, generated: "identity", dataType: "BigInt"})
    public tagID: number;

    @Column({ dataType: "Char", length: 200 })
    public name: string;

    public logTags: LogTag[];

}