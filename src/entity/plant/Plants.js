import {Registries, Registry} from "/src/registry/Registry.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {ClassMapping} from "/src/util/ClassMapping.js";

export class Plants {
    static CODECS = [];
    static init() {
        Plants.initCodecs("/resources/data/plants.json");
    }
    static initCodecs(input) {
        Plants.CODECS.push(new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    key = identifier;
                    let srcName = object["class"];
                    Registries.CODECS.get(Registries.PLANT).register(identifier,object);
                    Plants.registerPlant(identifier, (source) => {return new (ClassMapping.get(srcName))(source, object);});
                });
            });
        }));
    }
    static registerPlant(key,value) {
        return Registries.PLANT.register(key,value);
    }
}