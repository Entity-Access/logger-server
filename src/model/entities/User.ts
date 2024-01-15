import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import type { UserRole } from "./UserRole.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import type LoginSession from "./LoginSession.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import type UserAuthFactor from "./UserAuthFactor.js";
import { JsonProperty, IgnoreJsonProperty, ReadOnlyJsonProperty } from "@entity-access/server-pages/dist/services/ModelService.js";

export class ChangePassword {

    @JsonProperty()
    public oldPassword?: string;

    @JsonProperty()
    public newPassword: string;

    @JsonProperty()
    public forceChangePasswordOnLogin: boolean;
}

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
export class User {

    @Column({ key: true, dataType: "BigInt" , generated: "identity" })
    public userID: number;

    @Column({ dataType: "Char" , length: 200 })
    public userName: string;

    @Column({ dataType: "Char" , length: 200 })
    public displayName: string;

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

    @Column({ })
    @JsonProperty({ readonly: true })
    public multiFactor: boolean;

    @Column({})
    public dateUpdated: DateTime;

    @JsonProperty({ help: "Save this to change password"})
    public changePassword: ChangePassword;

    @JsonProperty({})
    public createFolder: boolean;

    public roles: UserRole[];

    public sessions: LoginSession[];

    public authFactors: UserAuthFactor[];

    // [GraphService.toGraph]() {
    //     return {
    //         ... this,
    //         password: void 0,
    //         passwordHash: void 0,
    //         passwordSalt: void 0
    //     };
    // }
}


