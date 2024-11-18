import {Constants, KaplayLogger} from "/src/client/Client.js";
import {Registries, Registry} from "/src/registry/Registry.js";

export class ModLauncher {
    codecObject;
    launcherJson = {};
    entrypoints = {};
    #locker = false;
    constructor(codecObject) {
        this.codecObject = codecObject;
        this.launcherJson = {};
        this.launcherJson["id"] = codecObject["id"];
        this.launcherJson["name"] = codecObject["name"];
        this.launcherJson["version"] = codecObject["version"];
        this.launcherJson["license"] = codecObject["license"];
        this.launcherJson["entrypoints"] = codecObject["entrypoints"];
        this.launcherJson["license"] = codecObject["license"];
        this.launcherJson["authors"] = codecObject["authors"];
        this.launcherJson["depends"] = codecObject["depends"];
        this.launcherJson["description"] = codecObject["description"];
    }

    async load() {
        if (this.#locker) {
            KaplayLogger.error(`Do not call the mod initialization entry repeatedly ${this.launcherJson["name"]}`);
            return;
        }

        this.#locker = true; // 设置锁

        return new Promise((resolve, reject) => {
            try {
                this.entrypoints["main"] = this.launcherJson["entrypoints"]["main"];
                let srcResult = this.entrypoints["main"].split(" -> ");
                let [packageName, exportName] = srcResult;

                import(packageName).then((module) => {
                    let main = module[exportName];
                    let instance = new main();
                    instance.load().then(() => {
                        resolve();
                    }).catch((error) => {
                        KaplayLogger.error(`Error in loading the main entrypoint: ${error}`);
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
    }

    static compareSemanticVersions(version, range) {
        const op = range[0];
        const ver = version.split('.').map(Number);
        const rangeVer = range.slice(1).split('.').map(Number);

        for (let i = 0; i < Math.max(ver.length, rangeVer.length); i++) {
            const num1 = ver[i] || 0;
            const num2 = rangeVer[i] || 0;

            if (num1 > num2) {
                return op === '~' || op === '<=' ? 1 : -1;
            } else if (num1 < num2) {
                return op === '~' || op === '>=' ? -1 : 1;
            }
        }

        return op === '~' ? 0 : 0;
    }
    static isCompatible(version1, version2) {
        let versionMethod = ModLoader.compareSemanticVersions(version1, version2);
        if(versionMethod >= 0) {
            return true;
        } else {
            return false;
        }
    }
}