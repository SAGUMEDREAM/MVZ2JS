import {Registries} from "/src/registry/Registry.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {Dialog} from "/src/level/Dialog.js";

export class Dialogs {
    static DIALOG_CODECS = [];
    static init() {
        Dialogs.initCodecs("/resources/data/dialogs.json");
    }
    static initCodecs(input) {
        Dialogs.DIALOG_CODECS.push(new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    Registries.CODECS.get(Registries.DIALOG).register(identifier, object);
                    Dialogs.registerDialog(identifier, () => {return new Dialog(object);});
                });
            });
        }));
    }
    static runDialog(dialogType) {
        let dialog = Registries.DIALOG.get(dialogType);
        if (dialog != null) {
            return dialog();
        }
        return null;
    }
    static registerDialog(key, value) {
        return Registries.DIALOG.register(key,value);
    }
}