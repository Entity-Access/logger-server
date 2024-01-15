import { availableParallelism } from "node:os";


const isTestMode = (process.env.LOGGER_SERVER ?? "false") === "true";

export const globalEnv = {
    host: process.env.TRACER_HOST,
    port: Number(process.env.PORT ?? 8080),
    isTestMode,
    numCPUs: isTestMode
        ? 2
        : (process.env.TRACER_CLUSTER_WORKERS
            ? Number(process.env.TRACER_CLUSTER_WORKERS)
            : availableParallelism())
};
