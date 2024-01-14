import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";

export const userStatuses = ["active", "blocked", "locked", "change-password", "external"] as const;
export type userStatusType = typeof userStatuses[number];

@Table("Users")
@Index({
    name: "IX_Unique_UserName",
    columns: [{
        name: (x) => x.userName,
        descending: false
    }]
})

export default class User {

    @Column({ dataType: "BigInt", key: true, generated: "identity" })
    public userID: number;

    @Column({ dataType: "Char", length: 50})
    public userName: string;

    @Column({ dataType: "Char" })
    @IgnoreJsonProperty
    public passwordHash: string;

    @Column({ dataType: "Char" , length: 20})
    @IgnoreJsonProperty
    public passwordSalt: string;

    @Column({ dataType: "AsciiChar", length: 15, default: () => "active", enum: userStatuses})
    @ReadOnlyJsonProperty
    public status: userStatusType;

    @Column({ dataType: "Boolean", default: () => false})
    public isExternal: boolean;
}