import ClusterInstance, { RecycledWorker } from "@entity-access/server-pages/dist/ClusterInstance.js";
import { isTestMode } from "./isTestMode.js";
import { availableParallelism } from "node:os";
import sleep from "@entity-access/server-pages/dist/sleep.js";
import WebServer from "./WebServer.js";

const numCPUs = isTestMode ? 2
    : (process.env.TRACER_CLUSTER_WORKERS
        ? Number(process.env.LOGGER_CLUSTER_WORKERS)
        : availableParallelism());

export default class WebCluster extends ClusterInstance<typeof WebServer> {

    public static start() {
        const cluster = new WebCluster();
        cluster.run(void 0);
    }

    protected async runPrimary(arg: typeof WebServer) {

        // seed...
        const ws = new arg();
        await ws.create(true);

        while(true) {
            const workers = [] as RecycledWorker[];
            for (let index = 0; index < numCPUs; index++) {
                workers.push(this.fork());
            }

            for (const worker of workers) {
                worker.destroy();
            }

            await sleep(15000);
        }
    }

    protected async runWorker(arg: typeof WebServer) {
        const ws = new arg();
        await ws.create();
    }

}