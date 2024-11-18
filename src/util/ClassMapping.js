import {JsonCodecs} from "/src/registry/Codecs.js";

export class ClassMapping {
    static mapping = new Map();
    static codecsMapping = [];
    static init() {
        ClassMapping.initCodecsMapping("/resources/data/plants.json");
        ClassMapping.initCodecsMapping("/resources/data/zombies.json");
    }
    static initCodecsMapping(input) {
        ClassMapping.codecsMapping.push(
            {
                key: input,
                value: new JsonCodecs(input)
                    .apply((object) => {
                        let registryKey = object["registry_key"];
                        let registries = object["registries"];
                        registries.forEach((regObj) => {
                            let key = regObj["key"];
                            let value = regObj["value"];
                            new JsonCodecs(value).apply((object) => {
                                let srcName = object["class"];
                                let srcResult = srcName.split(" -> ");
                                let [packageName, exportName] = srcResult;
                                import(packageName)
                                    .then(module => {
                                        let value = module[exportName];
                                        ClassMapping.addMap(srcName, value);
                                    });
                            });
                        });
                    })
            }
        );
    }
    static addMap(src,value) {
        ClassMapping.mapping.set(src,value);
        return ClassMapping;
    }
    static get(srcName) {
        return ClassMapping.mapping.get(srcName);
    }
}