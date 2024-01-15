import Inject, { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import SocketService from "@entity-access/server-pages/dist/socket/SocketService.js";

import pg from "pg";
import LiveTraceNamespace from "./namespaces/LiveTraceNamespace.js";
const { Pool } = pg;

const pool = new Pool({
    host: process.env["TRACER_DB_HOST"] ?? "localhost",
    port: Number(process.env["TRACER_DB_PORT"] ?? 5432),
    ssl: JSON.parse(process.env["TRACER_DB_SSL"] ?? "true"),
    database: process.env["TRACER_DB_DATABASE"] ?? "SocialMails",
    user: process.env["TRACER_DB_USER"] ?? "postgres",
    password: process.env["TRACER_DB_PASSWORD"] ?? "abcd123",
});

await pool.query(`
    CREATE TABLE IF NOT EXISTS socket_io_attachments (
        id          bigserial UNIQUE,
        created_at  timestamptz DEFAULT NOW(),
        payload     bytea
    );
`);

@RegisterSingleton
export default class AppSocketService extends SocketService {

    @Inject
    public live: LiveTraceNamespace;

}
