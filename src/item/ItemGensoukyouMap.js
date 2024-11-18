import {Item} from "/src/item/Item.js";
import {Constants} from "/src/client/Client.js";
import {randomInt} from "/src/util/Math.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {getEndItem, moveTo} from "/src/util/Utils.js";
import {World} from "/src/world/World.js";
import {Worlds} from "/src/world/Worlds.js";
import {Levels} from "/src/level/Levels.js";
import {Scenes} from "/src/gui/Scenes.js";
import {addButton} from "/src/util/Button.js";
import {ProfileManager} from "../util/GameProfile.js";

export class ItemGensoukyouMap extends Item {
    identifier;
    fn;
    constructor() {
        super();
        this.initCodecs();
        this.spawn();
    }
    initCodecs() {
        this.identifier = "gensoukyou_map";
    }
    clickLock = false;
    spawn() {
        this.item_instance = add([
            sprite("map_paper"),
            pos(center()),
            anchor("center"),
            scale(0.48),
            opacity(1.0),
            color(255, 255, 255),
            z(25),
            area(),
        ]);
        this.white_screen = add([
            sprite("white_screen"),
            pos(center()),
            anchor("center"),
            scale(1.25),
            opacity(0),
            color(255, 255, 255),
            z(20),
            area(),
        ]);
        moveTo(this.item_instance, vec2(center().x+randomInt(-64,64),center().y+randomInt(-4,64)), "easeOutCubic");
        this.item_instance.onClick(() => {
            if(this.clickLock == false) {
                this.clickLock = true;
                SoundLoader.stopSingleMusic();
                SoundLoader.playSound("win");
                getEndItem();
                moveTo(this.item_instance, vec2(center().x,center().y), "easeOutCubic");
                tween(
                    this.item_instance.scale.x,
                    1.35,
                    2.0,
                    (val0) => this.item_instance.scale.x = val0,
                    easings["easeOutCubic"],
                );
                tween(
                    this.item_instance.scale.y,
                    1.35,
                    2.0,
                    (val0) => this.item_instance.scale.y = val0,
                    easings["easeOutCubic"],
                );
                wait(0.5, () => {
                    tween(
                        this.white_screen.opacity,
                        1,
                        5.0,
                        (val0) => this.white_screen.opacity = val0,
                        easings["easeOutCubic"],
                    );
                });
                wait(2, () => {
                    let data = ProfileManager.manager;
                    if(ProfileManager.manager.getData()["game_data"]["has_map"] == false) {
                        ProfileManager.manager.getData()["game_data"]["has_map"] = true;
                        data.saveData();
                    }

                    wait(4, () => {
                        Scenes.jumpTo("paper0");
                    });
                });
            }
        });
    }
}