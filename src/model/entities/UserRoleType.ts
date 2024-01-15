import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import type { UserRole } from "./UserRole.js";

@Table("UserRoleTypes")
export class UserRoleType {

    @Column({ key: true, dataType: "Char", length: 100 })
    public roleName: string;

    public roles: UserRole[];

}