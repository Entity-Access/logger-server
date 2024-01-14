import { ServiceCollection } from "@entity-access/entity-access/dist/di/di.js";
import { globalServices } from "./globalServices.js";
import AppWorkflowContext from "./model/WorkflowContext.js";
import AppContextEvents from "./model/AppContextEvents.js";
import AppContext from "./model/AppContext.js";

export default class WebServer {
    create() {
        globalServices.resolve(AppWorkflowContext);
        this.register();
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