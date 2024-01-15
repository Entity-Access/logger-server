import { ServiceCollection } from "@entity-access/entity-access/dist/di/di.js";
import ServerPages from "@entity-access/server-pages/dist/ServerPages.js";
import { globalServices } from "./globalServices.js";
import AppWorkflowContext from "./model/WorkflowContext.js";
import AppContextEvents from "./model/AppContextEvents.js";
import AppContext from "./model/AppContext.js";

export default class WebServer {

    async create(seed = true) {
        globalServices.resolve(AppWorkflowContext);
        this.register();

        await this.seed();

        if (seed) {
            return;
        }

        const server = ServerPages.create();
        server.registerEntityRoutes();

        const app = server.build();
        app.listen(process.env.PORT ?? 8080);
    }

    register() {
        ServiceCollection.register("Singleton", AppContextEvents);
    }

    async seed() {
        using scope = globalServices.createScope();
        const db = scope.resolve(AppContext);

        await db.connection.ensureDatabase();
        await db.connection.automaticMigrations().migrate(db);

        db.raiseEvents = false;
        db.verifyFilters = false;
        
    }
}