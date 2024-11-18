import {Registries, Registry} from "/src/registry/Registry.js";
import {Card} from "/src/item/Card.js";
import {Dispenser} from "/src/entity/plant/Dispenser.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {ClassMapping} from "/src/util/ClassMapping.js";
import {CardCanvasPC, CardCanvasV2} from "/src/util/CardCanvas.js";
import {ItemCard} from "./ItemCard.js";

export class Items {
    static CARD_CODECS = [];
    static PC_CARD_IMAGE_URL = new Map();
    static LAPTOP_CARD_IMAGE_URL = new Map();
    static PC_ZOMBIE_CARD_IMAGE_URL = new Map();
    static LAPTOP_ZOMBIE_CARD_IMAGE_URL = new Map();
    static init() {
        Items.initCodecsCard("/resources/data/plants.json");
    }
    static initCodecsCard(input) {
        Items.CARD_CODECS.push(new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    key = identifier;
                    let resourcesKey = object["resources"];
                    let resourcesTexture = resourcesKey["texture"] || "/resources/textures/lostTexture.png";
                    let displayTexture = resourcesKey["display"] || "/resources/textures/lostTexture.png";
                    let textures = function() {
                        let lpKey = `card_${identifier}_laptop`;
                        let cbLpKey = `card_${identifier}_cb_laptop`;
                        let valueLp;
                        let valueLpCb;
                        let cardBackground = null;
                        let cardInfo = object["card"];
                        let type = cardInfo["type"] || "normal";
                        let price = (cardInfo["redstone"] != null) ? cardInfo["redstone"] : 0;
                        if(type == "normal") {
                            cardBackground = "/resources/textures/item/card_laptop.png";
                        }
                        CardCanvasV2.createCardImage(cardBackground, displayTexture, price, {
                            font: '35px Microsoft Yahei',
                            color: 'black',
                            align: 'center',
                            baseline: 'middle'
                        },(result, error) => {
                            valueLp = result;
                            loadSprite(lpKey, result, {});
                            Items.LAPTOP_CARD_IMAGE_URL.set(identifier,result);
                        });
                        CardCanvasV2.createCardImage(cardBackground, displayTexture, "", {
                            font: '35px Microsoft Yahei',
                            color: 'black',
                            align: 'center',
                            baseline: 'middle'
                        },(result, error) => {
                            valueLpCb = result;
                            loadSprite(cbLpKey, result, {});
                        });
                        CardCanvasPC.createCardImage("/resources/textures/item/card.png",displayTexture, price, {
                            font: '35px Microsoft Yahei',
                            color: 'black',
                            align: 'center',
                            baseline: 'middle'
                        },(result, error) => {
                            Items.PC_CARD_IMAGE_URL.set(identifier,result);
                        });
                        return {"desktop": null, "desktop_cb": null, "laptop": lpKey, "laptop_cb": cbLpKey};
                    }();
                    let srcName = object["class"];
                    let srcResult = srcName.split(" -> ");
                    let [packageName, exportName] = srcResult;
                    import(packageName)
                        .then((module) => {
                            let srcObject = module[exportName];
                            Registries.CODECS.get(Registries.ITEM_CARD).register(identifier, object);
                            Items.registerItem(identifier, () => {
                                return new ItemCard(object, srcObject, textures);
                            });
                            Items.registerCard(identifier, (posY) => {
                                return new Card(object, srcObject, textures, posY);
                            });
                        });
                });
            });
        }));
    }
    static spawnItem(itemId) {
        let result = Registries.ITEM.get(itemId);
        if(result) {
            return result();
        } else {
            return null;
        }
    }
    static registerItem(itemId,item) {
        return Registries.ITEM.register(itemId, item);
    }
    static registerCard(itemId,item) {
        return Registries.ITEM_CARD.register(itemId, item);
    }
}