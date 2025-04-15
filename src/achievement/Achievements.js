import {Registries} from "/src/registry/Registry.js";
import {ProfileManager} from "/src/util/GameProfile.js";
import {Achievement} from "/src/achievement/Achievement.js";
import {JsonCodecs} from "/src/registry/Codecs.js";

export class Achievements {
    static CODECS = [];

    static init() {
        Achievements.initCodecs("/resources/data/achievements.json");
    }

    static initCodecs(input) {
        Achievements.CODECS.push(new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    key = identifier;
                    Registries.CODECS.get(Registries.ACHIEVEMENT).register(identifier, object);
                    Achievements.registerAchievement(identifier, object);
                });
            });
        }));
    }

    static addAchievement(identifier) {
        let data = ProfileManager.manager.getData();
        let achievements = data["game_data"]["achievements"];
        if (!achievements.includes(identifier)) {
            achievements.push(identifier);
        }
    }

    static removeAchievement(identifier) {
        let data = ProfileManager.manager.getData();
        let achievements = data["game_data"]["achievements"];
        let index = achievements.indexOf(identifier);
        if (index !== -1) {
            achievements.splice(index, 1);
        }
    }

    static registerAchievement(key, codecsObject) {
        return Registries.ACHIEVEMENT.register(key, new Achievement(codecsObject));
    }
}