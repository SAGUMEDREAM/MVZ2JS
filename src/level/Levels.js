import {Registries, Registry} from "/src/registry/Registry.js";
import {LevelProperties, WorldProperties} from "/src/util/Properties.js";
import {ScriptLevel} from "/src/level/ScriptLevel.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {DynamicLevel} from "/src/level/DynamicLevel.js";
import {WorldLevel} from "/src/level/WorldLevel.js";
import {Scenes} from "/src/gui/Scenes.js";
import {Constants} from "../client/Client.js";
import {ProfileManager} from "../util/GameProfile.js";
export class Levels {
    static CODECS;
    static THREAD_CODECS;
    static MUSIC_PLAYER;
    static init() {
        Levels.initCodecs("/resources/data/levels.json");
        Levels.initCodecsWorldLevel("/resources/data/world_levels.json");
        window.Levels = Levels;
    }
    static initCodecsWorldLevel(input) {
        Levels.THREAD_CODECS = new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    let properties = object["properties"];
                    let sceneType = properties["scene"];
                    let levelType = properties["level"];
                    let featureType = properties["feature"];
                    let dialogType = properties["dialog"];
                    let music = properties["music"];
                    //console.log(sceneType,levelType,featureType,dialogType);
                    let wt = 0;
                    let wl = loop(0.2,() => { // 处理异步问题
                        if(Scenes.getScene(sceneType) != null) {
                            let scene = Scenes.getScene(sceneType);
                            let level = Registries.LEVEL.get(levelType);
                            let feature = Registries.WORLD_FEATURE.get(featureType);
                            let dialog = Registries.DIALOG.get(dialogType) || (() => {});
                            Levels.registerWorldLevel(identifier,() => {return new WorldLevel(scene(),feature(),level(),music,dialog())});
                            wl.cancel();
                        }
                        if(wt>=125 && wl.cancel != null) {
                            wl.cancel();
                        }
                    })
                });
            });
        });
    }
    static initCodecs(input) {
        Levels.CODECS = new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    key = identifier;
                    Registries.CODECS.get(Registries.LEVEL).register(identifier,object);
                    Levels.registerLevel(identifier, () => {return new DynamicLevel(object);});
                });
            })
        });
    }
    static passLevel(levelId) {
        let data = ProfileManager.manager.getData();
        if(!data["game_data"]["levels"].includes(levelId)) {
            data["game_data"]["levels"].push(levelId);
        }
        ProfileManager.manager.saveData();
    }
    static registerWorldLevel(levelId, level) {
        return Registries.WORLD_LEVEL.register(levelId, level);
    }
    static registerLevel(levelId, level) {
        return Registry.register(Registries.LEVEL, levelId, level);
    }
}