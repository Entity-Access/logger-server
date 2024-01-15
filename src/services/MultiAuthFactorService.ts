import Inject, { RegisterScoped } from "@entity-access/entity-access/dist/di/di.js";

import { generateSecret, generateUri, validateToken } from "@sunknudsen/totp";

import qrcode from "qrcode";
import EntityAccessError from "@entity-access/entity-access/dist/common/EntityAccessError.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import AppDbContext from "../model/AppDbContext.js";
import { globalEnv } from "../globalEnv.js";

const host =  globalEnv.host;

@RegisterScoped
export default class MultiAuthFactorService {

    @Inject
    private db: AppDbContext;

    async verify({ id, secret, token }: { id: number, token: string, secret? }) {
        if(!secret) {
            const now = DateTime.now;
            const auth = await this.db.userAuthFactors
                .where({ id }, (p) => (x) => x.userID === p.id && x.method === "totp")
                .toArray();
            for (const iterator of auth) {
                if(validateToken(iterator.secret, token, 1, now.msSinceEpoch)) {
                    return true;
                }
            }
            throw new EntityAccessError(`Invalid code`);
        }
        if(!validateToken(secret, token)) {
            throw new EntityAccessError(`Invalid code`);
        }
    }

    async create(name: string, service = `SocialMail(${host})`) {
        const secret = generateSecret();

        const uri = generateUri(service, name, secret, service);
        const dataUrl = await qrcode.toDataURL(uri);

        if (service.length > 100) {
            service = service.substring(0, 99);
        }

        return { secret, dataUrl, service };
    }

}