import { availableParallelism } from "node:os";


const isTestMode = (process.env.LOGGER_SERVER ?? "false") === "true";

export const globalEnv = {
    host: process.env.TRACER_HOST,
    port: Number(process.env.PORT ?? 8080),
    isTestMode,
    db: {
        database: process.env["TRACER_DB_DATABASE"] ?? "Tracer",
        host: process.env["TRACER_DB_HOST"] ?? "localhost",
        port: Number(process.env["TRACER_DB_PORT"] ?? 5432),
        ssl: JSON.parse(process.env["TRACER_DB_SSL"] ?? "true"),
        user: process.env["TRACER_DB_USER"] ?? "postgres",
        password: process.env["TRACER_DB_PASSWORD"] ?? "abcd123",
    },
    numCPUs: isTestMode
        ? 2
        : (process.env.TRACER_CLUSTER_WORKERS
            ? Number(process.env.TRACER_CLUSTER_WORKERS)
            : availableParallelism())
};
