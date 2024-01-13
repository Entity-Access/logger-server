import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import Tag from "./Tag.js";
import LogItem from "./LogItem.js";

@Table("LogTags")
export default class LogTag {

    @Column({ dataType: "BigInt", key: true })
    @RelateTo(LogItem, {
        property: (x) => x.logItem,
        inverseProperty: (x) => x.logTags
    })
    public logItemID: number;

    @Column({ dataType: "BigInt", key: true })
    @RelateTo(Tag, {
        property: (x) => x.tag,
        inverseProperty: (x) => x.logTags
    })
    public tagID: number;

    public tag: Tag;

    public logItem: LogItem;
}