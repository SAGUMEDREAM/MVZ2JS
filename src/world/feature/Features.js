import {Registries, Registry} from "/src/registry/Registry.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {Feature} from "/src/world/feature/Feature.js";
import {KaplayLogger} from "/src/client/Client.js";
export class Features {
    static CODECS = [];
    static init() {
        //Features.registerFeature("world0", new WorldFeature0())
        Features.initCodecs("/resources/data/world_features.json");
    }
    static initCodecs(input) {
        Features.CODECS.push(new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    let background = object["background"] || {"texture": "", "offset": {"x": 100,"y": 0}};
                    let texture = background["texture"] || "/resources/textures/lostTexture.png";
                    key = identifier;
                    try {
                        loadSprite(identifier, texture, {});
                        KaplayLogger.log("TextureManager",`Texture ${key}::${value} was loaded successfully`);
                    } catch (error) {
                        KaplayLogger.warn("TextureManager",`Unable to load Texture ${key}, cause type is not Texture`);
                        KaplayLogger.warn("TextureManager",value);
                    }

                    Registries.CODECS.get(Registries.WORLD_FEATURE).register(identifier,object);
                    Features.registerFeature(identifier, () => {return new Feature(object);});
                });
            })
        }));
    }
    static registerFeature(featureId, feature) {
        Registry.register(Registries.WORLD_FEATURE, featureId, feature);
    }
}