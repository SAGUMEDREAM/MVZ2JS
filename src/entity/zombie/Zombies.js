import {Registries, Registry} from "/src/registry/Registry.js";
import {NZombie} from "/src/entity/zombie/NZombie.js";
import {randomInt} from "/src/util/Math.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {ClassMapping} from "/src/util/ClassMapping.js";
import {Constants, KaplayLogger} from "/src/client/Client.js";
import {CardCanvasPC} from "../../util/CardCanvas.js";
import {Items} from "../../item/Items.js";

export class Zombies {
    static CODECS = [];
    static init() {
        Zombies.initCodecs("/resources/data/zombies.json");
    }
    static initCodecs(input) {
        Zombies.CODECS.push(new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    key = identifier;
                    let srcName = object["class"];
                    let resourcesKey = object["resources"];
                    let displayTexture = resourcesKey["display"] || "/resources/textures/lostTexture.png";
                    {
                        CardCanvasPC.createCardImage("/resources/textures/item/card.png", displayTexture, "", {
                            font: '35px Microsoft Yahei',
                            color: 'black',
                            align: 'center',
                            baseline: 'middle'
                        },(result, error) => {
                            Items.PC_ZOMBIE_CARD_IMAGE_URL.set(identifier,result);
                        });
                    }
                    Registries.CODECS.get(Registries.ZOMBIE).register(identifier,object);
                    Zombies.registerZombie(identifier, (line) => {return new (ClassMapping.get(srcName))(object,line);});
                });
            });
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    let cost = object["cost"] || 100;
                    let weight = object["weight"] || 1000;
                    let obj = { cost: cost, weight: weight };
                    Constants.weights.set(identifier, obj);
                });
            });
        }));
    }
    static spawn(identifier,line) {
        if(Registry.get(Registries.ZOMBIE, identifier) == null) {
            KaplayLogger.warn("CLASS/Zombies",`It is not exist in zombie registries which is ${identifier}`);
            return null;
        }
        if(line==-1) {
            let aArray = [];
            let aMax,aMin;
            let pbArray = get("place_block");
            let rLine = 1;
            pbArray.forEach(pBlock => {
                if(pBlock.block_instance != null) if(pBlock.block_instance.y != null){
                    aArray.push(pBlock.block_instance.y);
                }
            });
            aMax = Math.max(...aArray) + 1;
            aMin = Math.min(...aArray) - 1;
            rLine = randomInt(aMax,aMin);
            return Registry.get(Registries.ZOMBIE, identifier)(rLine);
        } else {
            return Registry.get(Registries.ZOMBIE, identifier)(line);
        }
    }
    static registerZombie(key,value) {
        return Registries.ZOMBIE.register(key, value);
    }
}