import {JsonCodecs} from "/src/registry/Codecs.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {Component} from "/src/component/Component.js";

export class Components {
    static CODECS;
    static init() {
        Components.codecsComponents("/resources/data/components.json");
    }
    static codecsComponents(input) {
        Components.CODECS = new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    Registries.CODECS.get(Registries.COMPONENT).register(identifier,object);
                    Components.registerComponents(identifier, () => {return new Component(object);});
                });
            });
        });
    }
    static registerComponents(key, value) {
        return Registry.register(Registries.COMPONENT, key, value)
    }
}