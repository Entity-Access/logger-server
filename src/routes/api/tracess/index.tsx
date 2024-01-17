import Content from "@entity-access/server-pages/dist/Content.js";
import Page from "@entity-access/server-pages/dist/Page.js";
import AppDbContext from "../../../model/AppDbContext.js";
import TimedCache from "@entity-access/entity-access/dist/common/cache/TimedCache.js";
import { globalServices } from "../../../globalServices.js";
import { Prepare } from "@entity-access/server-pages/dist/decorators/Prepare.js";

const cache = new TimedCache<string,number>();

const getSourceID = (key: string) =>
    cache.getOrCreateAsync(key, async (k) => {
        const scope = globalServices.createScope();
        const db = scope.resolve(AppDbContext);
        const user = await db.traceSources
            .where({ k}, (p) => (x) => x.keySources.some((ks) => ks.key === p.k))
            .first();
        return user.sourceID;
    });

@Prepare.parseJsonBody
export default class extends Page {

    async run() {

        const key = this.request.headers["x-key"];
        if (!key) {
            return Content.json({}, 401);
        }

        const sourceID = await getSourceID(key);

        const db = this.resolve(AppDbContext);
        db.raiseEvents = false;
        db.verifyFilters = false;
        const ipAddress = this.request.remoteIPAddress;

        const { type = "log" } = this.body;

        await db.traces.saveDirect({
            mode: "insert",
            keys: {},
            changes: {
                sourceID,
                type,
                ipAddress,
                json: JSON.stringify(this.body)
            }
        });
    }

}