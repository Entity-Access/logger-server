import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import type LogTag from "./LogTags.js";

@Table("LogItems")
export default class LogItem {

    @Column({ dataType: "BigInt", generated: "identity", key: true })
    public itemID: number;

    @Column({})
    public dateCreated: DateTime;


    public logTags: LogTag[];


}