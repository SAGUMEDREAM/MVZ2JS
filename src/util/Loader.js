import {Registries, Registry} from "/src/registry/Registry.js";
import {LanguageProvider} from "/src/registry/LanguageProvider.js";
import {CardTexture, Texture} from "/src/util/Texture.js";
import {KaplayLogger} from "/src/client/Client.js";

export class ResourcesLoader {
    static CODECS = [];

    constructor() {
    }

    init() {
        Registries.SOUND.getRegistry().forEach((value, key) => {
            try {
                loadSound(key, `/resources/sounds/${value}`)
                KaplayLogger.log("SoundManager", `Sound ${key}::${value} was loaded successfully`);
            } catch (error) {
                KaplayLogger.error("SoundManager", `Unable to load Sound ${key}`);
                KaplayLogger.error("SoundManager", value);
            }
        });
        Registries.TEXTURE.getRegistry().forEach((value, key) => {
            try {
                if (!(value instanceof Texture)) {
                    KaplayLogger.warn("TextureManager", `Unable to load Texture ${key}, cause type is not Texture`);
                    KaplayLogger.warn("TextureManager", value);
                    loadSprite(key, `/resources/textures/lostTexture.png`, {});
                } else {
                    KaplayLogger.log("TextureManager", `Texture ${key}::${value.texture} was loaded successfully`);
                    loadSprite(key, `/resources/textures/${value.texture}`, value.props);
                }
            } catch (error) {
                KaplayLogger.warn("TextureManager", `Unable to load Texture ${key}, cause type is not Texture`);
                KaplayLogger.warn("TextureManager", value);
                loadSprite(key, `/resources/textures/lostTexture.png`, {});
            }
        });
    }

    initCodecs(input) {

    }

    initDynamicResource(dynamicRegistry) {
        if (dynamicRegistry instanceof Map) {
            dynamicRegistry.forEach((value, key) => {
                try {

                } catch (error) {

                }
            })
        }
    }
}

export class LanguageLoader {
    constructor() {
    }

    init() {
        Registry.register(Registries.LANGUAGE, "zh_cn", new LanguageProvider("zh_cn"));
    }
}

