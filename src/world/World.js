import {free} from "/src/util/Utils.js";
import {Worlds} from "/src/world/Worlds.js";
import {SoundLoader} from "../sound/SoundLoader.js";
import {Registries} from "../registry/Registry.js";
import {Levels} from "../level/Levels.js";
import {Scenes} from "../gui/Scenes.js";
import {Constants, KaplayLogger} from "../client/Client.js";
import {ProfileManager} from "../util/GameProfile.js";
export class World {
    offset;
    instance;
    backgroundInstance;
    instanceArray = [];
    curDraggin = false;
    events = [];
    codecsObject;
    type;
    identifier;
    name;
    resources;
    texture;
    background;
    buttonArray;
    musicType;
    static currentWorld;
    constructor(codecsObject) {
        this.codecsObject = codecsObject;
        this.initProperties();
        Worlds.currentOpenedWorld = this;
    }
    initProperties() {
        this.type = this.codecsObject["type"];
        this.identifier = this.codecsObject["identifier"];
        this.name = this.codecsObject["name"];
        this.resources = this.codecsObject["resources"];
        this.texture = `${this.type}/${this.identifier}`;
        this.background = `${this.type}/${this.identifier}_bg`;
        this.buttonArray = this.codecsObject["buttons"];
        this.musicType = this.codecsObject["music"];
    }
    jump() {
        World.currentWorld = this.identifier;
        SoundLoader.stopSingleMusic();
        if(this.musicType != null && this.musicType != "") {
            SoundLoader.playSingleMusic(this.musicType);
        }
        this.instance = add([
            sprite(this.texture),
            pos(center()),
            scale(2),
            area(),
            anchor("center"),
            z(5),
            "map",
            body({ isStatic: true })
        ]);
        this.backgroundInstance = add([
            sprite(this.background),
            pos(center()),
            scale(2),
            area(),
            anchor("center"),
            z(4),
            "bg"
        ]);
        this.events.push(
            onMousePress(() => {
                if (this.curDraggin) {
                    return;
                }
                for (const obj of get("map").reverse()) {
                    if (obj.isHovering()) {
                        this.pick();
                        break;
                    }
                }
            })
        );
        this.events.push(onMouseRelease(() => {
            if (this.curDraggin) {
                this.curDraggin = null;
            }
        }));
        this.events.push(onUpdate(() => {
            if (this.curDraggin === this.instance) {
                this.instance.pos = mousePos().sub(this.offset);
            }
        }));
        this.events.push(onScroll((d) => {
            this.scroll(d);
        }));
        if(this.buttonArray != null) this.buttonArray.forEach(button => {
            let x = button["x"];
            let y = button["y"];
            let notes = button["notes"];
            let world_level = button["world_level"];
            let condition = button["condition"];
            let boss = button["boss"];
            let mini_game = button["mini_game"];
            let btnTex = function(){
                if(boss == true) {
                    return 'map_button_4';
                } else if(mini_game == true) {
                    return 'map_button_3';
                }
                return "map_button_0";
            }();
            let btn = this.instance.add([
                sprite(btnTex),
                pos(vec2(x,y)),
                scale(1),
                area(),
                anchor("center"),
                z(6),
                "map_button",
            ]);
            let title = this.instance.add([
                text(`${notes}`,{ size: 20, font: "monospace", align: "center" }),
                pos(vec2(x,y-10)),
                scale(1),
                area(),
                anchor("center"),
                z(6),
                "map_button",
            ]);
            if(btn.pos && this.instance.pos) {
                btn.pos.x = this.instance.pos.x + x - width() / 2;
                btn.pos.y = this.instance.pos.y + y - height() / 2;
            }
            this.events.push(onUpdate(() => {
                if(condition == "NOT_CONDITION" && !ProfileManager.manager.getData()["game_data"]["levels"].includes(world_level)) {
                    btn.use(sprite("map_button_0"));
                    return;
                }
                if(ProfileManager.manager.getData()["game_data"]["levels"].includes(world_level) == true) {
                    btn.use(sprite("map_button_1"));
                } else if(ProfileManager.manager.getData()["game_data"]["levels"].includes(condition) == false) {
                    btn.use(sprite("map_button_2"));
                } else if(ProfileManager.manager.getData()["game_data"]["levels"].includes(condition) && boss == true) {
                    btn.use(sprite("map_button_4"));
                } else if(ProfileManager.manager.getData()["game_data"]["levels"].includes(condition) && mini_game == true) {
                    btn.use(sprite("map_button_3"));
                } else {
                    btn.use(sprite("map_button_0"));
                }
            }));
            btn.onClick(() => {
                if(world_level == null) {
                    KaplayLogger.warn("WorldLevel",`The WorldLevel is null or empty`)
                    SoundLoader.playSound("buzzer");
                    return;
                }
                if(condition == "NOT_CONDITION") {
                    SoundLoader.playSound("click");
                    Worlds.jumpToWorldLevel(world_level);
                } else if(ProfileManager.manager.getData()["game_data"]["levels"].includes(condition)) {
                    SoundLoader.playSound("click");
                    Worlds.jumpToWorldLevel(world_level);
                } else {
                    SoundLoader.playSound("buzzer");
                }
            });
            //console.log(x,y,world_level,condition);
        });
        this.instanceArray.push(this.instance);
        this.instanceArray.push(this.backgroundInstance);
        this.initGui();
    }
    backBtnInstance;
    bookBtnInstance;
    initGui() {
        {
            this.backBtnInstance = add([
                sprite("back_button_off"),
                pos(vec2(50,40)),
                scale(1.25),
                area(),
                anchor("center"),
                z(6),
                "back_button",
            ]);
            this.backBtnInstance.onClick(() => {
                SoundLoader.playSound("click");
                SoundLoader.stopSingleMusic();
                SoundLoader.playSingleMusic("grazy_dave")
                Scenes.jumpTo("menu_state0");
            });
            this.backBtnInstance.onHoverUpdate(() => {
                this.backBtnInstance.use(sprite("back_button"));
            });
            this.backBtnInstance.onHoverEnd(() => {
                this.backBtnInstance.use(sprite("back_button_off"))
            });
        }
        {
            this.settingsBtnInstance = add([
                sprite("settings_button_off"),
                pos(vec2(1230,40)),
                scale(1.25),
                area(),
                anchor("center"),
                z(6),
                "settings_button",
            ]);
            this.settingsBtnInstance.onClick(() => {
                SoundLoader.playSound("click");
                window.option.display();
            });
            this.settingsBtnInstance.onHoverUpdate(() => {
                this.settingsBtnInstance.use(sprite("settings_button"));
            });
            this.settingsBtnInstance.onHoverEnd(() => {
                this.settingsBtnInstance.use(sprite("settings_button_off"))
            });
        }
        if(ProfileManager.manager.getData()["game_data"]["has_book"] == true || Constants.debugMode) {
            this.bookBtnInstance = add([
                sprite("almanac_button_off"),
                pos(vec2(125,40)),
                scale(1.25),
                area(),
                anchor("center"),
                z(6),
                "back_button",
            ]);
            this.bookBtnInstance.onClick(() => {
                SoundLoader.playSound("click");
                Scenes.jumpTo("book_menu");
            });
            this.bookBtnInstance.onHoverUpdate(() => {
                this.bookBtnInstance.use(sprite("almanac_button"));
            });
            this.bookBtnInstance.onHoverEnd(() => {
                this.bookBtnInstance.use(sprite("almanac_button_off"))
            });
        }
    }
    scroll(delta) {
        let I = this.instance.scale;
        I.x += (delta.y / 1000);
        I.y += (delta.y / 1000);
        I.x = Math.abs(I.x);
        I.y = Math.abs(I.y);
        //console.log(this.instance);
    }
    pick() {
        this.curDraggin = this.instance;
        this.offset = mousePos().sub(this.instance.pos);
    }
    endThread() {
        this.events.forEach(event => {
            if(event.cancel) event.cancel();
        });
        free(this);
    }
}