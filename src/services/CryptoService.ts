import { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import crypto, { KeyFormat, generateKeyPair } from "node:crypto";
import { Stream } from "node:stream";

@RegisterSingleton
export default class CryptoService {

    public generateSalt() {
        return Date.now() + "sm1";
    }

    public hash(salt: string, password: string) {
        const key = `social-mail-${salt}-${password}-${salt}`;
        const sha256 = crypto.createHash("sha256");
        return sha256.update(key).digest("hex");
    }

    public md5Buffer(buffer: Buffer | Stream, encode: crypto.BinaryToTextEncoding = "base64") {
        const sha256 = crypto.createHash("md5");
        if (buffer instanceof Stream) {
            return new Promise<string>((resolve, reject) => {
                buffer.on("end", () => {
                    sha256.end(() => {
                        resolve(sha256.digest(encode));
                    });
                });
                buffer.pipe(sha256);
            });
        }
        return sha256.update(buffer).digest(encode);
    }

    public hashBuffer(buffer: Buffer | Stream, encode: crypto.BinaryToTextEncoding = "hex") {
        const sha256 = crypto.createHash("sha256");
        if (buffer instanceof Stream) {
            return new Promise<string>((resolve, reject) => {
                buffer.on("end", () => {
                    sha256.end(() => {
                        resolve(sha256.digest(encode));
                    });
                });
                buffer.pipe(sha256);
            });
        }
        return sha256.update(buffer).digest(encode);
    }

    public generateKey() {
        return new Promise<{ publicKey, privateKey }>((resolve, reject) => {
            generateKeyPair("rsa", {
                modulusLength: 2048,
                publicKeyEncoding: {
                  type: 'spki',
                  format: "der"
                },
                privateKeyEncoding: {
                  type: 'pkcs8',
                  format: "pem"
                }
            },
               (error, publicKey, privateKey) => {
                resolve({
                    publicKey: publicKey.toString("base64"),
                    privateKey
                });
            });
        });
    }

}
