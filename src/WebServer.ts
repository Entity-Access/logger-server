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
import SocketService from "@entity-access/server-pages/dist/socket/SocketService.js";
import AppSocketService from "./socket/SocketService.js";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";


export default class WebServer {

    async create(seedDb = false, runServer = false) {

        const dbServer = (process.env["TRACER_DB_SERVER"] ?? "postgres").toLowerCase();
        if (dbServer !== "postgres") {
            throw new Error("Only postgres server supported in this edition");
        }

        const driver = new PostgreSqlDriver({
            ... globalEnv.db,
            /** Since we are going to use cluster, a single worker should not hold more than 10 connections */
            poolSize: 10
        });

        globalServices.add(BaseDriver, driver);

        this.register();

        globalServices.resolve(AppWorkflowContext);

        if (seedDb) {
            await seed();
            if (!runServer) {
                return;
            }
        }

        const server = ServerPages.create(globalServices);
        server.registerEntityRoutes();
        server.registerRoutes(join(dirname(fileURLToPath(import.meta.url)), "./routes"));

        await server.build(void 0, { port: globalEnv.port});
    }

    register() {
        ServiceCollection.register("Singleton", AppSocketService);
        ServiceCollection.register("Singleton", AppDbContextEvents);
    }
}