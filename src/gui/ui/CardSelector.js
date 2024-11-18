import {ProfileManager} from "/src/util/GameProfile.js";
import {Registries} from "/src/registry/Registry.js";
import {free, moveTo, scaleTo, vec2Sum} from "/src/util/Utils.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {WorldLevel} from "/src/level/WorldLevel.js";
import {Text} from "/src/registry/LanguageProvider.js";

export const cardYPos = [];
export var page = 0;

export class CardObject {
    codecObject;
    texture;
    cardInstance;
    cardBoardInstance;
    vec;
    slot;
    eventArray = [];
    isPicked = false;
    lock = false;
    constructor(codecObject,page,x,y) {
        this.codecObject = codecObject;
        this.page = page;
        this.x = x;
        this.y = y;
        this.initProperties();
    }
    init() {
        this.vec = vec2(206+(this.x * 114),100+(this.y * 56));
        this.vec2 = vec2(128,0);
        this.vec3 = vec2Sum(this.vec,this.vec2);
        this.name = `${this.codecObject["type"]}.${this.codecObject["identifier"]}.name`;
        this.cardInstance = add([
            sprite(`${this.texture}`),
            pos(this.vec),
            anchor("left"),
            scale(0.38),
            opacity(0),
            area(),
            z(13),
            {
                ignoreCam: true
            }
        ]);
        this.cardBoardInstance = add([
            sprite(`card_laptop`),
            pos(this.vec),
            anchor("left"),
            scale(0.38),
            opacity(1),
            color(rgb(75,75,75)),
            area(),
            z(12),
            {
                ignoreCam: true
            }
        ]);
        this.textBox = add([
            rect(300, 140, { radius: 10 }),
            anchor("left"),
            pos(this.vec3),
            scale(0.5),
            opacity(0),
            color(209, 198, 103),
            z(25),
            outline(1),
        ]);
        this.textName = add([
            text(`${Text.translation(`${this.name}`)}`,{ size: 35, font: "monospace", align: "center" }),
            anchor("left"),
            pos(this.vec3),
            scale(0.5),
            opacity(0),
            color(0, 0, 0),
            z(25),
            outline(1),
        ]);
        this.eventArray.push(
            this.cardInstance.onClick(() => {
                if(this.lock) return;
                this.click();
            })
        );
        this.eventArray.push(
            this.cardInstance.onHover(() => {
                if(this.lock) return;
                setCursor("pointer");
                this.cardInstance.color = rgb(225,225,225);
            })
        );
        this.eventArray.push(
            this.cardInstance.onHoverEnd(() => {
                if(this.lock) return;
                setCursor("auto");
                this.cardInstance.color = rgb();
            })
        );
        this.eventArray.push(
            onUpdate(() => {
                if(this.isPicked == true && this.slot != null) {
                    if(this.slot >= 1) {
                        if(CardSelector.selectedCards[this.slot - 1] == null) {
                            this.slot = this.slot - 1;
                            moveTo(this.cardInstance,vec2(25,cardYPos[this.slot]),"easeOutCubic");
                            scaleTo(this.cardInstance,0.48,1,"easeOutCubic");
                            CardSelector.selectedCards[this.slot] = this;
                            CardSelector.selectedCards[this.slot + 1] = null;
                        }
                    }
                }
                if(this.page == page) {
                    this.cardInstance.opacity = 1;
                } else {
                    this.cardInstance.opacity = 0;
                }
            })
        );
        this.eventArray.push(this.cardInstance.onHover(() => {
            this.textBox.opacity = 1;
            this.textName.opacity = 1;
            //this.textDescription.opacity = 1;
        }));
        this.eventArray.push(this.cardInstance.onHoverEnd(() => {
            this.textBox.opacity = 0;
            this.textName.opacity = 0;
            //this.textDescription.opacity = 0;
        }));
        return this;
    }
    click() {
        if(this.page == page) {
            SoundLoader.playSound("picking_plant");
            if(this.isPicked == true) {
                if(this.slot != null) {
                    this.isPicked = false;
                    CardSelector.selectedCards[this.slot] = null;
                    moveTo(this.cardInstance,this.vec,"easeOutCubic");
                    scaleTo(this.cardInstance,0.38,1,"easeOutCubic");
                    this.slot = null;
                }
            } else if(this.isPicked == false) {
                let max_card_stick = ProfileManager.manager.getData()["game_data"]["card_slot"];
                if(CardSelector.selectedCards.length < max_card_stick) {
                    for (let i = 0; i < 10; i++) {
                        let target = CardSelector.selectedCards[i];
                        if(target == null) {
                            this.isPicked = true;
                            this.slot = i;
                            moveTo(this.cardInstance,vec2(25,cardYPos[i]),"easeOutCubic");
                            scaleTo(this.cardInstance,0.48,1,"easeOutCubic");
                            CardSelector.selectedCards[i] = this;
                            break;
                        }
                    }
                }
            }
        }
        wait(0.1,() => {
            CardSelector.selectedCards = CardSelector.selectedCards.filter(card => card !== null);
        })
    }

    initProperties() {
        this.identifier = this.codecObject["identifier"];
        this.texture = `card_${this.identifier}_laptop`;
    }
    getIdentifier() {
        return this.identifier;
    }
    endThread() {
        if(this.eventArray != null) {
            this.eventArray.forEach(task => {
                if(task.cancel != null) {
                    task.cancel();
                }
            });
        }
        if(this.cardInstance != null) {
            destroy(this.cardInstance);
        }
        if(this.cardBoardInstance != null) {
            destroy(this.cardBoardInstance);
        }
        free(this);
    }
}
export class CardSelector {
    cards = [];
    tmpCardBoard = [];
    selectorUI;
    callF;
    xCount = 0;
    yCount = 0;
    pageCount = 0;
    maxPageCount = 0;
    btnArray = [];
    objectArray = [];
    startBtn;
    startBtnString;
    nextPageBtn;
    beforePageBtn;
    static selectedCards = [];
    static {
        for (let i = 0; i < 10; i++) {
            cardYPos[i] = 34 + (i * 72);
        }
    }
    constructor() {
    }
    init() {
        let max_card_stick = ProfileManager.manager.getData()["game_data"]["card_slot"];
        (async () => {
            CardSelector.selectedCards = [];
            CardSelector.selectedCards.length = 0
            this.cards = ProfileManager.manager.getData()["game_data"]["plants"];
            this.selectorUI = add([
                sprite("card_selector"),
                pos(vec2(center().x-450,center().y+800)),
                anchor("left"),
                scale(1.35),
                area(),
                z(12),
                {
                    ignoreCam: true
                }
            ]);
            this.initButton();
            await moveTo(this.selectorUI,vec2(center().x-450,center().y),"easeOutCubic");
            for (let i = 0; i < max_card_stick; i++) {
                let y0 = cardYPos[i];
                let cardBoard = add([
                    sprite(`card_laptop`),
                    pos(vec2(25-256,y0)),
                    anchor("left"),
                    scale(0.48),
                    opacity(1),
                    color(rgb(75,75,75)),
                    area(),
                    z(12),
                    {
                        ignoreCam: true
                    }
                ]);
                moveTo(cardBoard,vec2(25,y0),"easeOutCubic");
                this.tmpCardBoard.push(cardBoard);
            }
            this.generateCard();
        })();
    }
    initButton() {
        this.nextPageBtn = this.selectorUI.add([
            sprite("page_button_off"),
            anchor("center"),
            pos(vec2(485,200)),
            scale(1.75),
            area(),
            z(14)
        ]);
        this.beforePageBtn = this.selectorUI.add([
            sprite("page_button_off"),
            anchor("center"),
            pos(vec2(445,200)),
            scale(1.75),
            area(),
            z(14)
        ]);
        this.beforePageBtn.scale.x = -1.75;
        this.startBtn = this.selectorUI.add([
            sprite("MCButton"),
            anchor("center"),
            pos(vec2(115,200)),
            scale(0.8,2),
            area(),
            z(14)
        ]);
        this.startBtn.onClick(() => {
            SoundLoader.playSound("click");
            (async () => {
                let card_stick = ProfileManager.manager.getData()["game_data"]["plants"].length;
                let max_card_stick = ProfileManager.manager.getData()["game_data"]["card_slot"];
                if(CardSelector.selectedCards.length == max_card_stick || card_stick < max_card_stick) {
                    this.getSelectStick().forEach(stick => {
                        let identifier = stick.getIdentifier();
                        stick.lock = true;
                        WorldLevel.cardArray.push(identifier);
                    });
                    this.endThread();
                    this.runCall();
                }
            })();
        });
        this.startBtn.onHoverUpdate(() => {
            this.startBtn.color = hsl2rgb(0.6, 0.6, 0.8);
            setCursor("pointer");
        })
        this.startBtn.onHoverEnd(() => {
            this.startBtn.color = rgb();
            setCursor("auto");
        });
        this.startBtnString = this.startBtn.add([
            text("开始", { font: "monospace" }),
            anchor("center"),
            pos(vec2(0,0)),
            scale(0.5/0.8,0.5/2),
            area(),
            z(14)
        ]);
        this.nextPageBtn.onClick(() => {
            this.addPage();
        });
        this.beforePageBtn.onClick(() => {
            this.removePage();
        });
        this.btnArray = [this.nextPageBtn,this.beforePageBtn];
        this.btnArray.forEach((btn) => {
            btn.onClick(() => {
                SoundLoader.playSound("click");
            });
            btn.onHoverUpdate(() => {
                btn.use(sprite("page_button_on"))
                setCursor("pointer");
            })
            btn.onHoverEnd(() => {
                btn.use(sprite("page_button_off"))
                setCursor("auto");
            });
        });
    }
    addPage() {
        if(page < this.maxPageCount) {
            page++;
        }
    }
    removePage() {
        if(page > 0) {
            page--;
        }
    }
    generateCard() {
        for (const key of this.cards) {
            let registryObject = Registries.getCodec(Registries.PLANT, key);
            let cardObject = new CardObject(registryObject, this.pageCount, this.xCount, this.yCount).init();
            this.objectArray.push(cardObject);
            this.xCount++;

            if (this.xCount % 6 == 0) {
                this.xCount = 0;
                this.yCount++;

                if (this.yCount % 8 == 0) {
                    this.yCount = 0;
                    this.pageCount++;
                    if(this.pageCount > this.maxPageCount) {
                        this.maxPageCount = this.pageCount;
                    }
                }
            }
        }
    }

    getSelectStick() {
        return CardSelector.selectedCards;
    }
    runCall() {
        return this.callF();
    }
    setCall(callF) {
        this.callF = callF;
    }
    endThread() {
        let arr0 = this.objectArray;
        arr0.forEach(object => {
            object.cardBoardInstance.opacity = 0;
            if(object.isPicked) {
                moveTo(object.cardInstance,vec2(object.cardInstance.pos.x-256,object.cardInstance.pos.y),"easeOutCubic");
                wait(1.5, () => {
                    object.endThread()
                });
            } else {
                object.endThread();
            }
        });
        this.tmpCardBoard.forEach(object => {
            moveTo(object,vec2(object.pos.x-256,object.pos.y),"easeOutCubic");
            destroy(object);
        });
        moveTo(this.selectorUI,vec2(center().x-450, center().y+800),"easeOutCubic");
        wait(1.5, () => {
            destroy(this.selectorUI);
            free(this);
        });
    }
}