import { BaseDriver } from "@entity-access/entity-access/dist/drivers/base/BaseDriver.js";
import { ServiceCollection } from "@entity-access/entity-access/dist/di/di.js";
import ServerPages from "@entity-access/server-pages/dist/ServerPages.js";
import { globalServices } from "./globalServices.js";
import AppWorkflowContext from "./model/WorkflowContext.js";
import AppDbContextEvents from "./model/AppDbContextEvents.js";
import AppDbContext from "./model/AppDbContext.js";
import PostgreSqlDriver from "@entity-access/entity-access/dist/drivers/postgres/PostgreSqlDriver.js";
import seed from "./seed/seed.js";
import { globalEnv } from "./globalEnv.js";


export default class WebServer {

    async create(seedDb = false) {

        const dbServer = (process.env["TRACER_DB_SERVER"] ?? "postgres").toLowerCase();
        if (dbServer !== "postgres") {
            throw new Error("Only postgres server supported in this edition");
        }

        const driver = new PostgreSqlDriver({
            host: process.env["TRACER_DB_HOST"] ?? "localhost",
            port: Number(process.env["TRACER_DB_PORT"] ?? 5432),
            ssl: JSON.parse(process.env["TRACER_DB_SSL"] ?? "true"),
            database: process.env["TRACER_DB_DATABASE"] ?? "Tracer",
            user: process.env["TRACER_DB_USER"] ?? "postgres",
            password: process.env["TRACER_DB_PASSWORD"] ?? "abcd123",
            /** Since we are going to use cluster, a single worker should not hold more than 10 connections */
            poolSize: 10
        });

        globalServices.add(BaseDriver, driver);

        this.register();

        globalServices.resolve(AppWorkflowContext);

        if (seedDb) {
            await seed();
            return;
        }

        const server = ServerPages.create();
        server.registerEntityRoutes();

        const app = server.build();

        const port = globalEnv.port;

        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }

    register() {
        ServiceCollection.register("Singleton", AppDbContextEvents);
    }
}