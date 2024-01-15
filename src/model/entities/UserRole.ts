import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import ForeignKey from "@entity-access/entity-access/dist/decorators/ForeignKey.js";
import { UserRoleType } from "./UserRoleType.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import { User } from "./User.js";

@Table("UserRoles")
export class UserRole {

    @Column({ dataType: "BigInt", key: true, order: 1})
    @RelateTo(User, {
        property: (ur) => ur.user,
        inverseProperty: (user) => user.roles
    })
    public userID: number;

    @Column({ dataType: "Char", length: 200, key: true, order : 2 })
    @RelateTo(UserRoleType, {
        property: (ur) => ur.role,
        inverseProperty: (ar) => ar.roles
    })
    public roleName: string;

    public role: UserRoleType;
    public user: User;

}
