/* eslint-disable no-console */
import { ServiceProvider } from "@entity-access/entity-access/dist/di/di.js";
import seedAdminRole from "./seed-admin-role.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import AppDbContext from "../../model/AppDbContext.js";
import CryptoService from "../../services/CryptoService.js";

export default async function seedAdminUser(scope: ServiceProvider, context: AppDbContext) {

    const role = await seedAdminRole(context);

    const adminUser = await context.users.where({ userName: "admin"}, (p) => (x) => x.userName === p.userName).first();
    if (!adminUser) {
        const cs = scope.resolve(CryptoService);
        const passwordSalt = cs.generateSalt();
        context.users.add({
            userName: "admin",
            displayName: "Administrator",
            passwordSalt,
            dateUpdated: DateTime.now,
            passwordHash: cs.hash(passwordSalt, process.env.TRACER_ADMIN_PASSWORD || "tracer-admin"),
            multiFactor: false,
            roles: [
                context.userRoles.add({
                    role
                })
            ]
        });

        await context.saveChanges();
        console.log(`Admin User Created...`);
    } else {
        console.log(`Admin User exists ${adminUser.userName}, no need to create any user.`);
    }
}