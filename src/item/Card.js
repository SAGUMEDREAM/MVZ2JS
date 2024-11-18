import {Item} from "/src/item/Item.js";
import {Constants, KaplayLogger} from "/src/client/Client.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {ClassMapping} from "/src/util/ClassMapping.js";
import {Text} from "/src/registry/LanguageProvider.js";
import {free} from "/src/util/Utils.js";

export class Card extends Item {
    codecObject;
    price = 0;
    colddown_max_time = 0;
    colddown_timer = 0;
    srcObject;
    textures;
    placeTexture;
    item_instance;
    name;
    description;
    textBox;
    textName;
    textDescription;
    eventArray = [];
    static isPicking = false;
    constructor(codecObject,srcObject,textures,posY) {
        super();
        this.codecObject = codecObject;
        this.srcObject = srcObject;
        this.textures = textures;
        this.posY = posY || 0;
        this.initCodecs();
    }
    initCodecs() {
        this.name = `${this.codecObject["type"]}.${this.codecObject["identifier"]}.name`;
        this.description = `${this.codecObject["type"]}.${this.codecObject["identifier"]}.description`;
        let cardInfo = this.codecObject["card"];
        this.type = cardInfo["type"] || "normal";
        this.price = (cardInfo["redstone"] != null) ? cardInfo["redstone"] : 0;
        this.colddown_max_time = cardInfo["colddown_time"] * 10;
        this.first_no_colddown = cardInfo["first_no_colddown"] || true;
        if(this.first_no_colddown == true) {
            this.colddown_timer = this.colddown_max_time;
        }
        if(Constants.device && (Constants.gameState.getObj("conveyor") == false)) {
            this.placeTexture = this.textures["laptop"];
        } else if(Constants.device && (Constants.gameState.getObj("conveyor") == true)) {
            this.placeTexture = this.textures["laptop_cb"];
        }
    }
    init() {
        let vPosY = 34 + (this.posY * 72);
        this.remainColddownTime = 0;
        this.item_instance = add([
            sprite(this.placeTexture),
            pos(vec2(90,vPosY)),
            anchor("center"),
            scale(0.48),
            opacity(1.0),
            color(255, 255, 255),
            z(5),
            area(),
        ]);
        this.colddownText = add([
            text(`${this.remainColddownTime}`,{ size: 75, font: "monospace", align: "center" }),
            anchor("left"),
            pos(vec2(100,vPosY)),
            scale(0.5),
            opacity(1),
            color(255, 255, 255),
            z(6),
            outline(1),
        ]);
        this.textBox = add([
            rect(300, 140, { radius: 10 }),
            anchor("left"),
            pos(vec2(90 + 70,vPosY)),
            scale(0.5),
            opacity(0),
            color(209, 198, 103),
            z(20),
            outline(1),
        ]);
        this.textName = add([
            text(`${Text.translation(`${this.name}`)}`,{ size: 35, font: "monospace", align: "center" }),
            anchor("left"),
            pos(vec2(180,vPosY)),
            scale(0.5),
            opacity(0),
            color(0, 0, 0),
            z(20),
            outline(1),
        ]);
        /*this.textDescription = add([
            text(`${Text.translation(`${this.description}`)}`,{ size: 35, font: "monospace", align: "center" }),
            anchor("left"),
            pos(vec2(180,vPosY+5)),
            scale(0.5),
            opacity(0),
            color(0,0,0),
            z(6),
            outline(1),
        ]);*/
        this.eventArray[0] = this.item_instance.onClick(() => {
            this.use();
        })
        this.eventArray[1] = loop(0.1, () => {
            if(this.colddown_timer<=this.colddown_max_time) {
                this.colddown_timer++;
            }
        });
        this.eventArray[2] = this.item_instance.onUpdate(() => {
            {
                if(this.colddownText != null) {
                    let isConveyorLevel = Constants.gameState.getStat().getObj("conveyor");
                    let redstoneCount = Constants.gameState.getStat().getObj("redstone");
                    if (isConveyorLevel == false) {
                        if (this.colddown_timer < this.colddown_max_time) {
                            this.colddownText.text = parseFloat(((this.colddown_max_time - this.colddown_timer) / 10).toFixed(1));
                            this.colddownText.opacity = 1;
                        } else {
                            this.colddownText.opacity = 0;
                        }
                    }
                }
            }
            {
                let isConveyorLevel = Constants.gameState.getStat().getObj("conveyor");
                let redstoneCount = Constants.gameState.getStat().getObj("redstone");
                if (isConveyorLevel == false) {
                    if (redstoneCount < this.price || this.colddown_timer < this.colddown_max_time) {
                        this.item_instance.color.r = 128;
                        this.item_instance.color.g = 128;
                        this.item_instance.color.b = 128;
                    } else {
                        this.item_instance.color.r = 255;
                        this.item_instance.color.g = 255;
                        this.item_instance.color.b = 255;
                    }
                }

            }
            /*{
                let colddown = 0;
                if (this.colddown_max_time === 0) {
                    colddown = 1;
                } else {
                    colddown = (this.colddown_timer / this.colddown_max_time).toFixed(2);
                }
                this.item_instance.opacity = 0.5 + (0.5 * colddown);
            }*/
            {
                if(Constants.gameState.getStat().getObj("conveyor") === true) {

                }
            }
        });
        this.eventArray[3] = this.item_instance.onHover(() => {
            this.textBox.opacity = 1;
            this.textName.opacity = 1;
            setCursor("pointer");
            //this.textDescription.opacity = 1;
        });
        this.eventArray[4] = this.item_instance.onHoverEnd(() => {
            this.textBox.opacity = 0;
            this.textName.opacity = 0;
            setCursor("auto");
            //this.textDescription.opacity = 0;
        });
        /*loop(0.1, () => {
            console.log(`${this.name}`)
            console.log(`${this.colddown_timer}/${this.colddown_max_time}`)
        });*/
    }
    use() {
        if(this.srcObject !== null) {
            if(Card.isPicking == false) {
                try {
                    if (Constants.gameState.getStat().getObj("conveyor") === true) {
                        this.toPlace();
                    } else {
                        if (this.colddown_timer >= this.colddown_max_time && (Constants.gameState.getStat().getObj("redstone") >= this.price)) {
                            this.toPlace();
                        } else {
                            //console.log(`price: ${this.price}/${Constants.gameState.getStat().getObj("redstone")}`);
                            SoundLoader.playSound("buzzer");
                        }
                    }
                } catch (error) {
                    KaplayLogger.error("Card", `Error in ${this}`);
                }
            }
        } else {
            KaplayLogger.error("Card",`Unknown card object in ${this}`);
        }
    }
    cancelPlace() {
        Card.isPicking = false;
    }
    placed() {
        Card.isPicking = false;
        let remainValue = Constants.gameState.getStat().getObj("redstone");
        remainValue -= this.price;
        this.colddown_timer = 0;
        Constants.gameState.getStat().setObj("redstone", remainValue);
    }
    toPlace() {
        Card.isPicking = true;
        SoundLoader.playSound("picking_plant");
        if(this.srcObject != null) {
            if(typeof this.srcObject == 'function') {
                let object = new this.srcObject(this, this.codecObject);
            }
        }
    }
    endThread() {
        this.eventArray.forEach(item => {
            if(item.cancel) {
                item.cancel();
            }
        });
        free(this);
    }
}