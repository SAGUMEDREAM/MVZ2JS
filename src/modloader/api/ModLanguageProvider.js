import {Registries} from "/src/registry/Registry.js";
import {KaplayLogger} from "/src/client/Client.js";

export class ModLanguageProvider {
    // 参数： 注册键名 / JSON 路径
    key;
    value;
    registryMap;
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.registryMap = Registries.LANGUAGE.get(key);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', value, false);
        xhr.send(null);
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                Object.keys(data).forEach(k => {
                    this.registryMap.set(k, data[k]);
                });
            } catch (error) {
                KaplayLogger.error(`Parsing JSON failed: ${error}`);
            }
        } else {
            KaplayLogger.error(`Request failed with status ${xhr.status}`);
        }
        KaplayLogger.log("main",`Successfully loaded language file ${value}`)
    }
}