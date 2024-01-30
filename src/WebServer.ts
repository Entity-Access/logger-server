import { BaseDriver } from "@entity-access/entity-access/dist/drivers/base/BaseDriver.js";
import { ServiceCollection } from "@entity-access/entity-access/dist/di/di.js";
import ServerPages from "@entity-access/server-pages/dist/ServerPages.js";
import { globalServices } from "./globalServices.js";
import AppWorkflowContext from "./model/AppWorkflowContext.js";
import AppDbContextEvents from "./model/AppDbContextEvents.js";
import AppDbContext from "./model/AppDbContext.js";
import PostgreSqlDriver from "@entity-access/entity-access/dist/drivers/postgres/PostgreSqlDriver.js";
import seed from "./seed/seed.js";
import { globalEnv } from "./globalEnv.js";
import SocketService from "@entity-access/server-pages/dist/socket/SocketService.js";
import AppSocketService from "./socket/SocketService.js";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import EntityContext from "@entity-access/entity-access/dist/model/EntityContext.js";
import UserInfoProvider from "./services/UserInfoProvider.js";


export default class WebServer {

    public runWorkflows() {
        globalServices.resolve(AppWorkflowContext).start({
            taskGroups: [ "default", "sync", "background", "daily", "batch"]
        }).catch((error) => console.error(error));
    }

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

        await server.build({
            host: globalEnv.host,
            createSocketService: true,
            port: 443,
            protocol: "http2",
            acmeOptions: {
                mode: globalEnv.isTestMode ? "self-signed" : globalEnv.ssl.acme.mode,
                emailAddress: globalEnv.ssl.emailAddress,
                endPoint: globalEnv.ssl.acme.endPoint,
                eabKid: globalEnv.ssl.acme.eabKid,
                eabHmac: globalEnv.ssl.acme.eabHmac
            }
        });

        await this.runWorkflows();
    }

    register() {
        ServiceCollection.register("Scoped", AppDbContext);
        ServiceCollection.register("Scoped", UserInfoProvider);
        ServiceCollection.register("Singleton", AppSocketService);
        ServiceCollection.register("Singleton", AppDbContextEvents);
    }
}