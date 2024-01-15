export const globalEnv = {
    host: process.env.TRACER_HOST,
    port: Number(process.env.PORT ?? 8080)
};