import Inject from "@entity-access/entity-access/dist/di/di.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Workflow, { Activity } from "@entity-access/entity-access/dist/workflows/Workflow.js";
import WorkflowContext from "@entity-access/entity-access/dist/workflows/WorkflowContext.js";
import AppDbContext from "../../model/AppDbContext.js";
import sleep from "@entity-access/server-pages/dist/sleep.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";

export default class PendingWorkflow extends Workflow {

    public static startSyncing(context: WorkflowContext) {
        return context.queue(PendingWorkflow, null, {
            id: `process-pending`,
            taskGroup: "batch"
        });
    }

    run(): Promise<any> {
        return this.process();
    }

    @Activity
    async process(
        @Inject db?: AppDbContext
    ) {
        const now = DateTime.now;

        const till = now.addMinutes(14).msSinceEpoch;
        while(Date.now() < till) {

            const old = now.addDays(-30);

            // deleting old ones..
            await db.traces.asQuery()
                .delete({ old }, (p) => (x) => x.dateCreated < p.old);

            const list = await db.traces.where(void 0, (p) => (x) => x.pending === true)
                .limit(50)
                .orderBy(void 0, (p) => (x) => x.traceID)
                .toArray();

            if (!list.length) {
                return;
            }

            for (const iterator of list) {
                try {
                    const { host, path, app, session, server } = JSON.parse(iterator.json);
                    iterator.hostID = await this.createName(db,"host", host);
                    iterator.appID = await this.createName(db,"app", app);
                    iterator.serverID = await this.createName(db,"server", server);
                    iterator.sessionID = await this.createName(db,"session", session);
                    iterator.path = path;
                } catch (error) {
                    console.error(error);
                }
                iterator.pending = false;
            }

            await db.saveChangesWithoutEvents();

        }
    }

    async createName(db: AppDbContext, type: string, name: string) {
        if (!name) {
            return;
        }
        const item = await db.traceNames.saveDirect({
            mode: "selectOrInsert",
            keys: {
                name,
                type
            },
            changes: {
                type,
                name
            }
        })
        return item.nameID;
    }


}