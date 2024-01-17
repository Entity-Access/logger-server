import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import type TracerKey from "./TracerKey.js";
import type Trace from "./Trace.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import { User } from "./User.js";

@Table("TracerSources")
export default class TracerSource {

    @Column({ dataType: "BigInt", key: true, generated: "identity"})
    public sourceID: number;

    @Column({ dataType:"BigInt" })
    @RelateTo(User, {
        property: (x) => x.user,
        inverseProperty: (x) => x.sources
    })
    public userID: number;

    @Column({ dataType:"Char", length: 400 })
    public name: string;

    user: User;

    keySources: TracerKey[];

    traces: Trace[];

}
