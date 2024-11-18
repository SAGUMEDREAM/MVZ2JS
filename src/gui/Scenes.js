import {Registries, Registry} from "/src/registry/Registry.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {Constants, KaplayLogger} from "/src/client/Client.js";
import {Scene} from "/src/gui/Scene.js";
import {WorldLevel} from "/src/level/WorldLevel.js";

export class Scenes {
    static SCENE = () => {};
    static currentSceneIdentifier = "";
    static SCENE_CODECS = [];
    static init() {
        Scenes.initCodecs("/resources/data/scenes.json");
        window.Scenes = Scenes;
    }
    static initCodecs(input) {
        Scenes.SCENE_CODECS.push(new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            for (const regObj of registries) {
                let key = regObj["key"];
                let value = regObj["value"];
                let srcFilter = value.split(" -> ");
                let [packageName, exportName] = srcFilter;

                try {
                    import(packageName).then(module => {
                        let exportedValue = module[exportName];
                        Scenes.registerScene(key, () => {return new exportedValue()});
                    });
                } catch (error) {
                    console.error(`Failed to import ${packageName}:`, error);
                }
            }
        }));
    }
    static jumpTo(scene) {
        if(Constants.debugMode == true) {
            KaplayLogger.debug(`Going to scene key ${scene}`)
        }
        Scenes.SCENE = Scenes.getScene(scene);
        if(Scenes.SCENE != null) {
            Scenes.currentSceneIdentifier = scene;
            go("index");
        } else {
            KaplayLogger.error("SCENE",`Registration does not exist key ${scene}`)
        }
    }
    static getScene(key) {
        let ctx = Registry.get(Registries.SCENE, key);
        if(ctx == null) {
            ctx = () => {return new Scene()};
        }
        return Registry.get(Registries.SCENE, key);
    }
    static registerScene(key, value) {
        return Registries.SCENE.getKey().register(key, value);
    }
}