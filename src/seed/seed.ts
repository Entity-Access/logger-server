/* eslint-disable no-console */
import seedAdminUser from "./user/seed-admin-user.js";
import seedUI from "./ui/seed-ui.js";
import { globalServices } from "../globalServices.js";
import AppDbContext from "../model/AppDbContext.js";
import DBConfig from "../model/DBConfig.js";

export default async function seed() {

    const scope = globalServices.createScope();
    try {
        const context = scope.resolve(AppDbContext);
        await context.connection.ensureDatabase();
        await context.connection.automaticMigrations().migrate(context);

        context.verifyFilters = false;
        context.raiseEvents = false;


        await seedAdminUser(scope, context);
        const configService = scope.resolve(DBConfig);
        await seedUI(configService);
        // await seedTags(context);
    } finally {
        scope.dispose();
    }
}
