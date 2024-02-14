import Content from "@entity-access/server-pages/dist/Content.js";
import Page from "@entity-access/server-pages/dist/Page.js";
import AppDbContext from "../../../model/AppDbContext.js";
import TimedCache from "@entity-access/entity-access/dist/common/cache/TimedCache.js";
import { globalServices } from "../../../globalServices.js";
import { Prepare } from "@entity-access/server-pages/dist/decorators/Prepare.js";
import AppSocketService from "../../../socket/SocketService.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";

const cache = new TimedCache<string,number>();

const getSourceID = (key: string) =>
    cache.getOrCreateAsync(key, async (k) => {
        const scope = globalServices.createScope();
        const db = scope.resolve(AppDbContext);
        const q = db.sourceKeys
            .where({ k}, (p) => (x) => x.key === p.k);
        const user = await q.firstOrFail();
        await q.update(void 0, (p) => (x) => ({ lastUsed: Sql.date.now()}));
        return user.sourceID;
    });

@Prepare.parseJsonBody
export default class extends Page {

    async run() {

        const key = this.request.headers["x-key"] || this.childPath[0];
        if (!key) {
            return Content.json({}, 401);
        }

        const sourceID = await getSourceID(key);

        const db = this.resolve(AppDbContext);
        db.raiseEvents = false;
        db.verifyFilters = false;
        const ipAddress = this.request.remoteIPAddress;

        const { type = "log" } = this.body;

        const { traceID } = await db.traces.saveDirect({
            mode: "insert",
            changes: {
                sourceID,
                type,
                ipAddress,
                json: JSON.stringify(this.body)
            }
        });

        const ss = this.resolve(AppSocketService);
        ss.live.send(sourceID, { traceID });
        ss.live.send("*", { traceID });

        return Content.json({ traceID });
    }

}