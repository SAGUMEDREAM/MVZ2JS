import {JsonCodecs} from "/src/registry/Codecs.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {KaplayLogger} from "/src/client/Client.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";

export class Bullets {
    static CODECS = [];
    static init() {
        Bullets.initCodecs("/resources/data/bullets.json");
    }
    static initCodecs(input) {
        Bullets.CODECS.push(new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    let srcName = object["class"];
                    let srcFilter = srcName.split(" -> ");
                    let [packageName, exportName] = srcFilter;
                    let resourcesKey = object["resources"];
                    if(resourcesKey != null) {
                        let props = resourcesKey["props"] || {};
                        if(resourcesKey["texture"] != null) {
                            try {
                                loadSprite(`bullet/${identifier}`, resourcesKey["texture"], props);
                            } catch (error) {
                                KaplayLogger.warn("TextureManager",`Unable to load Texture ${key}, cause type is not Texture`);
                                KaplayLogger.warn("TextureManager", value);
                                loadSprite(`bullet/${identifier}`, `/resources/textures/lostTexture.png`, {});
                            }
                        }
                    }
                    try {
                        import(packageName).then(module => {
                            let exportedValue = module[exportName];
                            Registries.CODECS.get(Registries.BULLET).register(identifier, object);
                            Bullets.registerBullet(identifier, (source, props) => {return new exportedValue(object, source, props)});
                        });
                    } catch (error) {
                        console.error(`Failed to register ${packageName}:`, error);
                    }
                });
            })
        }));
    }
    static spawnBullet(source,identifier,props) {
        let bullet = Bullets.getBullet(identifier);
        if (bullet != null) {
            bullet = bullet(source, props);
            if(bullet.run != null) bullet.run();
        }
        return bullet;
    }
    static spawnBulletIn(source,identifier,vec = center(),props) {
        let bullet = Bullets.getBullet(identifier);
        if (bullet != null) {
            bullet = bullet(source, props);
            if(bullet.run != null) {
                bullet.run();
                bullet.bullet_instance.pos = vec;
            }
        }
        return bullet;
    }
    static getBullet(identifier) {
        return Registry.get(Registries.BULLET, identifier);
    }
    static registerBullet(key, value) {
        return Registries.BULLET.register(key, value);
    }
}