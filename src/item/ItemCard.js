import {Item} from "/src/item/Item.js";
import {Constants} from "/src/client/Client.js";
import {randomInt} from "/src/util/Math.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {getEndItem, moveTo} from "/src/util/Utils.js";
import {World} from "/src/world/World.js";
import {Worlds} from "/src/world/Worlds.js";
import {Levels} from "/src/level/Levels.js";
import {Scenes} from "/src/gui/Scenes.js";
import {ProfileManager} from "/src/util/GameProfile.js";

export class ItemCard extends Item {
    identifier;
    constructor(codecObject,srcObject,textures) {
        super();
        this.codecObject = codecObject;
        this.srcObject = srcObject;
        this.textures = textures;
        this.initCodecs();
        this.spawn();
    }
    initCodecs() {
        this.identifier = this.codecObject["identifier"];
        this.placeTexture = this.textures["laptop"];
    }
    clickLock = false;
    spawn() {
        this.item_instance = add([
            sprite(this.placeTexture),
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
                    let data = ProfileManager.manager.getData();
                    if(!data["game_data"]["plants"].includes(this.identifier)) {
                        ProfileManager.manager.getData()["game_data"]["plants"].push(this.identifier);
                        ProfileManager.manager.saveData();
                    }
                    wait(2, () => {
                        tween(
                            this.item_instance.opacity,
                            0,
                            1,
                            (val0) => this.item_instance.opacity = val0,
                            easings["easeOutCubic"],
                        );
                    });
                    wait(2, () => {
                        tween(
                            this.item_instance.opacity,
                            0,
                            1,
                            (val0) => this.item_instance.opacity = val0,
                            easings["easeOutCubic"],
                        );
                    })

                    wait(5, () => {
                        let cWorld = World.currentWorld;
                        if(cWorld != null) {
                            Worlds.jumpToWorld(cWorld);
                        } else {
                            Levels.MUSIC_PLAYER = SoundLoader.playSingleMusic("grazy_dave");
                            Scenes.jumpTo("menu_state0");
                        }
                    });
                });
            }
        });
    }
}