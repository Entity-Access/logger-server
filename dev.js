import WebServer from "./dist/WebServer.js";
const ws = new WebServer();
await ws.create(true, true);