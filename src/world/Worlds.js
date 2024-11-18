import {Registries, Registry} from "/src/registry/Registry.js";
import {Constants, KaplayLogger} from "/src/client/Client.js";
import {WorldLevel} from "/src/level/WorldLevel.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {World} from "/src/world/World.js";
import {Scene} from "/src/gui/Scene.js";

export class Worlds {
    static CODECS = [];
    static currentOpenedWorld;
    static currentOpenedWorldId;
    static init() {
        Worlds.initCodecs("/resources/data/worlds.json");
        window.Worlds = Worlds;
    }
    static initCodecs(input) {
        Worlds.CODECS.push(new JsonCodecs(input).apply((object =>{
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let type = object["type"];
                    let identifier = object["identifier"];
                    let resources = object["resources"] || {"texture": null, "background":null};
                    let texture = resources["texture"];
                    let background = resources["background"];
                    let tTextureKey = `${type}/${identifier}`;
                    let bTextureKey = `${type}/${identifier}_bg`;
                    try {
                        loadSprite(tTextureKey, texture, {});
                        loadSprite(bTextureKey, background, {});
                        KaplayLogger.log("TextureManager",`Texture ${key}::${value} was loaded successfully`);
                    } catch (error) {
                        loadSprite(tTextureKey, `/resources/textures/lostTexture.png`, {});
                        loadSprite(bTextureKey, `/resources/textures/lostTexture.png`, {});
                        KaplayLogger.warn("TextureManager",`Unable to load Texture ${key}, cause type is not Texture`);
                        KaplayLogger.warn("TextureManager",value);
                    }
                    Registries.CODECS.get(Registries.WORLD).register(identifier,object);
                    Worlds.registerWorld(identifier, () => {
                        return new World(object);
                    })
                });
            });
        })));
    }
    static jumpToWorldLevel(levelKey) {
        if(Constants.debugMode == true) {
            KaplayLogger.debug(`Going to level key ${levelKey}`)
        }
        let levelWorld = Registries.WORLD_LEVEL.get(levelKey);
        if(levelWorld != null) {
            levelWorld = levelWorld();
            WorldLevel.currentWorldLevel = levelWorld;
            WorldLevel.currentWorldLevelIdentifier = levelKey;
            go("n_index");
        } else {
            KaplayLogger.error("LEVEL_WORLD",`Registration does not exist key ${levelKey}`)
        }
    }
    static jumpToWorld(worldId) {
        if(Constants.debugMode == true) {
            KaplayLogger.debug(`Going to scene key ${worldId}`)
        }
        let world = Worlds.getWorld(worldId);
        if(world != null) {
            world = world();
            Worlds.currentOpenedWorld = world;
            Worlds.currentOpenedWorldId = worldId;
            go("w_index");
        } else {
            KaplayLogger.error("SCENE",`Registration does not exist key ${worldId}`)
        }
    }
    static getWorld(key) {
        let ctx = Registry.get(Registries.WORLD, key);
        if(ctx == null) {
            ctx = () => {return new Scene()};
        }
        return Registry.get(Registries.WORLD, key);
    }
    static registerWorld(worldId, world) {
        Registries.WORLD.register(worldId, world);
    }
}