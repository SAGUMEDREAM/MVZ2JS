import {Registries, Registry} from "/src/registry/Registry.js";
import {KaplayLogger, Constants} from "/src/client/Client.js";

export class LanguageProvider {
    constructor(key) {
        this.languageName = key;
        this.languageId = "/resources/lang/"+key+".json";
        this.languageMap = new Map();
        let xhr = new XMLHttpRequest();
        xhr.open('GET', this.languageId, false);
        xhr.send(null);
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                Object.keys(data).forEach(k => {
                    this.languageMap.set(k, data[k]);
                });
            } catch (error) {
                KaplayLogger.error(`Parsing JSON failed: ${error}`);
            }
        } else {
            KaplayLogger.error(`Request failed with status ${xhr.status}`);
        }
        KaplayLogger.log("main",`Successfully loaded language file ${this.languageName}`)
        return this.languageMap;
    }
    getString(key) {
        let str = this.languageMap.get(key)
        if(str) {
            return str;
        } else {
            return key;
        }
    }
}
export class Text {
    static of(...string) {
        return string;
    }
    static translation(key) {
        let string = Registry.get(Registries.LANGUAGE, Constants.language).get(key);
        if(!string) {
            string = key;
        }
        return string;
    }
}