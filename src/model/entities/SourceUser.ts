import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import { User } from "./User.js";
import TraceSource from "./TraceSource.js";

@Table("SourceUsers")
export default class SourceUser {

    @Column({ dataType:"BigInt", key: true })
    @RelateTo(User, {
        property: (x) => x.user,
        inverseProperty: (x) => x.sourceUsers
    })
    public userID: number;

    @Column({ dataType: "BigInt", key: true})
    @RelateTo(TraceSource, {
        property: (x) => x.source,
        inverseProperty: (x) => x.sourceUsers
    })
    public sourceID: number;


    @Column({ dataType: "Boolean", default: () => false })
    public readonly: boolean;

    user: User;

    public source: TraceSource;

}