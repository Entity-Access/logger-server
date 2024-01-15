import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import { IgnoreJsonProperty, JsonProperty } from "@entity-access/server-pages/dist/services/ModelService.js";
import { User } from "./User.js";

const authMethods = ["totp", "hotp", "fido2", "one-time"] as const;
export type authMethodTypes = typeof authMethods[number];

@Table("UserAuthFactor")
export default class UserAuthFactor {

    @Column({ key: true, generated: "identity", dataType: "BigInt"})
    authFactorID: number;

    @Column({ dataType: "BigInt"})
    @RelateTo(User, {
        property: (uaf) => uaf.user,
        inverseProperty: (u) => u.authFactors
    })
    userID: number;

    @Column({ dataType: "Char", length: 10, enum: authMethods})
    method: authMethodTypes;

    @Column({ dataType: "Char", nullable: true })
    @IgnoreJsonProperty
    secret: string;

    @Column({ dataType: "Char", length: 100, nullable: true })
    hint: string;

    @Column({ dataType: "Boolean"})
    verified: boolean;

    @Column({})
    dateUpdated: DateTime;

    user: User;

    @JsonProperty()
    qrCodeDataUrl: string;

    @JsonProperty()
    token: string;

    @JsonProperty()
    displaySecret: string;
}
