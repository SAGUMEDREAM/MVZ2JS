import {JsonCodecs} from "/src/registry/Codecs.js";
import {ModLauncher} from "/src/modloader/ModLauncher.js";
import {Constants, KaplayLogger} from "/src/client/Client.js";
import {ModRegistries} from "./registry/ModRegistries.js";

export class ModLoader {
    modCodec;
    threadLocker = false;
    registryMap = new Map();
    modRegistries;
    constructor() {
        Constants.modLoader = this;
        this.init();
        this.run();
    }
    init() {
        if(this.threadLocker == true) {
            throw new Error("Don't call the mod-loader repeatedly");
        }
        this.modCodec = new JsonCodecs("/mods/mods.json");
        this.modCodec.apply((object) => {
            let mods = object["mods"];
            let disabled = object["disabled"];
            mods = mods.filter(mod => disabled.indexOf(mod) === -1);
            mods.forEach((modIdentifier) => {
                let adrString = ModLoader.getAddress(modIdentifier);
                new JsonCodecs(adrString).apply((codecObject) => {
                    if(this.registryMap.has(codecObject["id"])) {
                        throw new Error(`ModLoader installed a duplicate mod in ${modIdentifier} :: ${adrString}`)
                    }
                    let instance = new ModLauncher(codecObject);
                    this.registryMap.set(codecObject["id"], instance);
                });
            });
        });
    }
    run() {
        if(this.threadLocker == true) {
            throw new Error("Don't call the mod-loader repeatedly");
        }
        (async () => {
            for (const [key, value] of this.registryMap) {
                await value.load();
                KaplayLogger.log("ModLoader",`MOD ${value["id"]} Installation Completed`);
            }
            this.modRegistries = new ModRegistries();
            this.modRegistries.bootstrap();
        })();
        this.threadLocker = true;
    }
    isInstalled(id) {
        return this.registryMap.has(id);
    }
    getModInstance(id) {
        return this.registryMap.get(id);
    }
    static getModLoader() {
        return Constants.modLoader;
    }
    static getAddress(modIdentifier) {
        return `/mods/${modIdentifier}/modlauncher.json`;
    }
}