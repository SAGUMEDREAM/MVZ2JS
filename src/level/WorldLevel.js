import {free, moveCameraTo, scaleTo} from "/src/util/Utils.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {IronPickaxe} from "/src/item/IronPickaxe.js";
import {random, randomInt} from "/src/util/Math.js";
import {SoundParser} from "/src/sound/SoundParser.js";
import {StarShardIframe} from "/src/gui/ui/StarShardIframe.js";
import {Trolley} from "/src/item/Trolley.js";
import {StarShard} from "/src/item/StarShard.js";
import {GemBar} from "/src/gui/ui/GemBar.js";
import {ProfileManager} from "/src/util/GameProfile.js";
import {CardSelector} from "/src/gui/ui/CardSelector.js";
import {Constants} from "../client/Client.js";
export class WorldLevel {
    world;
    worldFeature;
    dynamicLevel;
    threadLock = false;
    keyboardManager = [];
    pause_ui;
    pickaxe;
    title;
    menuBtn_instance;
    menuBtnText_instance;
    cardSelector;
    static cardArray = [];
    static currentWorldLevel;
    static currentWorldLevelIdentifier;

    constructor(scene,worldFeature,dynamicLevel,music,dialog) {
        this.world = scene;
        this.worldFeature = worldFeature;
        this.dynamicLevel = dynamicLevel;
        this.music = music;
        this.dialog = dialog;
        this.threadLock = false;
    }
    run() {
    }
    jump() {
        if(this.threadLock == true) {
            return;
        }
        this.threadLock = true;
        this.world.jump();
        this.worldFeature.run();
        this.dynamicLevel.run();
        if(this.getDialog() != null) {
            SoundLoader.playSingleMusic("grazy_dave");
            let dialog = this.getDialog().setCall(
                () => {
                    this.init();
                }
            ).run();
        } else {
            this.init();
        }
    }
    init() {
        this.keyboardManager.push(
            onKeyPress("space",() => {
                this.pauseGame();
            })
        );
        this.keyboardManager.push(
            onKeyPress("escape",() => {
                if(debug.paused == true) {
                    window.option.hidden();
                    SoundLoader.playSound("pause");
                } else {
                    window.option.display();
                }
                debug.paused = !debug.paused;
            })
        );
        this.menuBtn_instance = add([
            sprite("MCButton"),
            pos(vec2(1180,30)),
            anchor("center"),
            area(),
            scale(0.85,2.4),
            opacity(0),
            z(15),
            {
                ignoreCam: true
            }
        ]);
        this.menuBtnText_instance = this.menuBtn_instance.add([
            text("暂停", { font: "monospace" }),
            pos(vec2(0,0)),
            anchor("center"),
            area(),
            scale(1.176*0.65, 0.417*0.65),
            opacity(0),
            z(15)
        ]);
        (async () => {
            let card_stick = JSON.parse(JSON.stringify(ProfileManager.manager.getData()["game_data"]["plants"]));
            let card_stick_count = card_stick.length;
            let max_card_stick = ProfileManager.manager.getData()["game_data"]["card_slot"];

            WorldLevel.cardArray.length = 0;
            let cardTag = this.dynamicLevel.codecObject["cards"];
            let fixed = cardTag["fixed"] || false;

            this.initZombieDisplay();
            SoundLoader.playSingleMusic("choose_your_seeds");
            await wait(1);
            moveCameraTo(vec2(-250, 0), "easeOutCubic", 2.0);
            await wait(2);
            this.menuBtn_instance.opacity = 1;
            this.menuBtnText_instance.opacity = 1;
            this.menuBtn_instance.onClick(() => {
                window.option.display();
                debug.paused = true;
            });
            this.menuBtn_instance.onHoverUpdate(() => {
                if(this.menuBtn_instance) {
                    setCursor("pointer");
                    this.menuBtn_instance.color = hsl2rgb(0.6, 0.6, 0.8);
                }
            });
            this.menuBtn_instance.onHoverEnd(() => {
                if(this.menuBtn_instance) {
                    setCursor("auto");
                    this.menuBtn_instance.color = rgb();
                }
            });
            let callFunc = async () => {
                this.menuBtn_instance.opacity = 0;
                this.menuBtnText_instance.opacity = 0;
                moveCameraTo(vec2(250, 0), "easeOutCubic", 2.0);
                await wait(2);
                let ready;
                SoundLoader.playSound("ready");
                ready = add([
                    sprite("ready_3"),
                    anchor("center"),
                    scale(2),
                    pos(center().x, center().y),
                    z(7)
                ]);
                await wait(0.5);
                ready.use(sprite("ready_2"));
                await wait(0.5);
                ready.use(sprite("ready_1"));
                await wait(1);
                destroy(ready);
                this.getLevel().start();
                this.getLevel().init_debug();
                this.initCard();
                this.initPickaxe();
                this.initCancelPlantBtn();
                this.initStarShardUI();
                this.initGemBar();
                this.initTrolley();
                this.initTitle();
                this.displayedZombies.forEach(zombie => {
                    if (zombie != null) {
                        try { destroy(zombie) } catch (e) { }
                    }
                })
                this.menuBtn_instance.opacity = 1;
                this.menuBtnText_instance.opacity = 1;
                await wait(0.2);
                SoundLoader.stopSingleMusic();
                if (this.music != null && this.music != "") {
                    SoundLoader.playSingleMusic(this.music);
                }
            };

            if (fixed == false) {
                if (card_stick_count > max_card_stick) {
                    this.cardSelector = new CardSelector();
                    this.cardSelector.setCall(callFunc);
                    this.cardSelector.init();
                } else {
                    WorldLevel.cardArray = card_stick;
                    callFunc();
                }
            } else {
                callFunc();
            }
        })();

        this.pause_ui = add([
            sprite("ui_pause"),
            pos(center()),
            anchor("center"),
            scale(1.5),
            opacity(0),
            z(20),
            area(),
            `ui_pause`,
            {
                ignoreCam: true
            }
        ]);
    }
    initTrolley() {
        let texture = this.getFeature().trolley;
        if(texture == null) return;
        let aArray = [];
        let aMax,aMin;
        let pbArray = get("place_block");
        pbArray.forEach(pBlock => {
            if(pBlock.block_instance != null) if(pBlock.block_instance.y != null){
                aArray.push(pBlock.block_instance.y);
            }
        });
        aMax = Math.max(...aArray) + 1;
        aMin = Math.min(...aArray);
        for (let i = aMin; i < aMax; i++) {
            let trolley = new Trolley(texture,i);
            trolley.build();
        }
    }
    static gemBar;
    initGemBar() {
        WorldLevel.gemBar = new GemBar();
        WorldLevel.gemBar.init();
    }
    static starShardUI;
    initStarShardUI() {
        let texture = this.getFeature().star_shard;
        if(texture == null) return;
        WorldLevel.starShardUI = new StarShardIframe(texture);
        WorldLevel.starShardUI.init();
        StarShard.setTexture(texture);
        onKeyPress("w",() => {
            WorldLevel.starShardUI.getClick();
        });
    }
    static deleteSlot;
    initCancelPlantBtn() {
        WorldLevel.deleteSlot = add([
            sprite("delete_slot"),
            pos(vec2(475,32)),
            anchor("center"),
            scale(1),
            opacity(0),
            color(255, 255, 255),
            z(5),
            area(),
            `delete_slot`
        ]);
    }
    displayedZombies;
    initZombieDisplay() {
        const level = this.getLevel();
        this.displayedZombies = [];
        if(level.allTypePool != null) {
            for (const identifier of level.allTypePool) {
                const displayValue = this.spawnDisplayedZombie(identifier);
                this.displayedZombies.push(displayValue);
            }
            while (this.displayedZombies.length < 11) {
                const randomIndex = Math.floor(Math.random() * level.allTypePool.length);
                const randomIdentifier = level.allTypePool[randomIndex];
                const displayValue = this.spawnDisplayedZombie(randomIdentifier);
                this.displayedZombies.push(displayValue);
            }
        }
    }
    spawnDisplayedZombie(identifier) {
        let codecsObject = Registries.CODECS.get(Registries.ZOMBIE).get(identifier);
        let x0 = random(1000+325,1200+350);
        let y0 = random(185,610);
        if(codecsObject != null) {
            let size = codecsObject["size"];
            let resources = codecsObject["resources"];
            let type = codecsObject["type"];
            let spriteTile = resources["texture"];
            let properties = resources["properties"];
            let anims = properties["anims"];
            let zombieInstance = add([
                sprite(`displayed/${type}/${identifier}`),
                pos(vec2(x0,y0)),
                anchor("center"),
                scale(size),
                color(),
                area(),
                z(6),
                `displayed_zombie`
            ]);
            return zombieInstance;
        } else {
            return null;
        }
    }
    initCard() {
        let cards = this.dynamicLevel.codecObject["cards"];
        let fixed = cards["fixed"] || false;
        let cardList = cards["list"] || [];
        if(fixed == true) {
            let max = cardList.length;
            for (let i = 0; i < max; i++) {
                let cardId = cardList[i];
                let card = Registries.ITEM_CARD.get(cardId);
                if(card != null) {
                    let key = i + 1;
                    if(key == 10) key = 0;
                    let instance = card(i);
                    instance.init();
                    onKeyPress(`${key}`,() => {
                        instance.use();
                    });
                }
            }
        } else if(fixed == false) {
            let arr = WorldLevel.cardArray;
            let max = arr.length;
            for (let i = 0; i < max; i++) {
                let cardId = arr[i];
                let card = Registries.ITEM_CARD.get(cardId);
                if(card != null) {
                    let key = i + 1;
                    if(key == 10) key = 0;
                    let instance = card(i);
                    instance.init();
                    onKeyPress(`${key}`,() => {
                        instance.use();
                    });
                }
            }
        }
    }
    initPickaxe() {
        this.pickaxe = new IronPickaxe();
        this.pickaxe.build();
        onKeyPress("q",() => {
            this.pickaxe.getClick();
        });
    }
    initTitle() {
        let title = this.dynamicLevel["levelSettings"]["name"];
        this.initTitle = add([
            text(`${title}`, {
                size: 28,
                font: "sans-serif",
                align: "center",
                width: 200,
                weight: "bold", // 加粗
                outline: { // 添加描边
                    color: rgb(0, 0, 0), // 描边颜色
                    width: 2, // 描边宽度
                },
            }),
            pos(vec2(940, 695)),
            color(56, 68, 185),
            anchor("right"),
            z(9),
        ]);
    }
    failLock = false;
    initFailure() {
        (async () => {
            if(this.failLock == true) return;
            this.failLock = true;
            let title;
            let feature = this.getFeature();
            let offsetX = feature.backgroundOffsetX;
            let xDelta = (function (offsetX) {
                const a = -0.9333;
                const b = 263.33;
                return a * offsetX + b;
            })(offsetX);
            SoundLoader.stopSingleMusic();
            this.endThread();
            moveCameraTo(vec2(xDelta, 0), "easeOutCubic", 3.1);
            SoundLoader.playSound("lose");
            await wait(5.2);
            SoundParser.playSound(SoundParser.SoundTypes.HIT);
            await wait(0.5);
            SoundParser.playSound(SoundParser.SoundTypes.HIT);
            await wait(0.5);
            SoundParser.playSound(SoundParser.SoundTypes.HIT);
            await wait(0.5);
            SoundLoader.playSound("nooooo");
            shake(20);
            title = add([
                sprite("lose"),
                anchor("center"),
                scale(2.5),
                pos(center().x, center().y),
                z(25)
            ]);
            scaleTo(title,1.8,1.5,"easeOutCubic");
            await wait(3);
            window.loseLevel.init();
        })();
    }
    pauseGame() {
        if(debug.paused == true) {
            this.pause_ui.opacity = 0;
            SoundLoader.playSound("pause");
        } else {
            this.pause_ui.opacity = 1.0;
        }
        debug.paused = !debug.paused;
    }
    stopMusic() {
        SoundLoader.stopSingleMusic();
    }
    getDialog() {
        return this.dialog;
    }
    getFeature() {
        return this.worldFeature;
    }
    getLevel() {
        return this.dynamicLevel;
    }
    endThread() {
        this.threadLock = false;
        if(this.keyboardManager != null) {
            this.keyboardManager.forEach(key => {
                if(key.cancel) {
                    key.cancel();
                }
            });
        }
        this.worldFeature.endThread();
        this.dynamicLevel.endThread();
        free(this);
    }
}