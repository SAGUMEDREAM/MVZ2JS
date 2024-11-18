import {KaplayLogger} from "/src/client/Client.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {ModLoader} from "/src/modloader/ModLoader.js";
import {ModLauncher} from "../ModLauncher.js";

export class MixinLoader {
    static VERSION = '0.1.1';
    CODECS;
    constructor() {
        KaplayLogger.printf("main/INFO",`Mixin Version=0.0.1`);
        this.initCodecs();
    }
    initCodecs() {
        this.CODECS = new JsonCodecs("/mods/mods.json");
        this.CODECS.apply((object) => {
            let mods = object["mods"];
            let disabled = object["disabled"];
            mods = mods.filter(mod => disabled.indexOf(mod) === -1);
            mods.forEach((modIdentifier) => {
                let adrString = ModLoader.getAddress(modIdentifier);
                new JsonCodecs(adrString).apply((codecObject) => {
                    let entrypoints = codecObject["entrypoints"]
                    if(entrypoints != null) {
                        let mixinLoader = entrypoints["mixin"];
                        if (mixinLoader != '' && mixinLoader != null) {
                            (async () => {
                                await new Promise((resolve, reject) => {
                                    try {
                                        let srcResult = mixinLoader.split(" -> ");
                                        let [packageName, exportName] = srcResult;

                                        import(packageName).then((module) => {
                                            let main = module[exportName];
                                            let instance = new main();
                                            instance.load().then(() => {
                                                resolve();
                                            }).catch((error) => {
                                                KaplayLogger.error(`Error in loading the mixin entrypoint: ${error}`);
                                                reject(error);
                                            });
                                        }).catch((error) => {
                                            KaplayLogger.error(`Error in importing package: ${error}`);
                                            reject(error);
                                        });
                                    } catch (error) {
                                        KaplayLogger.error(`Unexpected error: ${error}`);
                                        reject(error);
                                    }
                                });
                            })()
                        }
                    }
                });
            });
        });
    }
}