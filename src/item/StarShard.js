import {Item} from "/src/item/Item.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {free, moveTo} from "/src/util/Utils.js";
import {Constants} from "/src/client/Client.js";
import {StarShardIframe} from "/src/gui/ui/StarShardIframe.js";
import {ProfileManager} from "/src/util/GameProfile.js";

export class StarShard extends Item {
    static texture = "";

    static setTexture(texture) {
        return StarShard.texture = texture;
    }

    static spawnStarShard(blockX, blockY) {
        if (this.texture == null || !ProfileManager.manager.getData()["game_data"]["levels"].includes("level1_1")) return null;
        return new StarShard(blockX, blockY).spawn();
    }

    blockX;
    blockY;
    itemInstance;
    eventArray = [];
    lock = false;

    constructor(blockX, blockY) {
        super();
        this.blockX = blockX;
        this.blockY = blockY;
        this.setId("star_shard");
    }

    spawn() {
        let vec = vec2(this.blockX, this.blockY);
        this.itemInstance = add([
            sprite(`${StarShard.texture}`),
            pos(vec),
            anchor("center"),
            scale(1.0),
            opacity(0),
            color(255, 255, 255),
            z(15),
            area(),
            `star_shard`
        ]);
        this.eventArray[0] = this.itemInstance.onClick(() => {
            if (this.lock == false) {
                this.lock = true;
                SoundLoader.playSound("star_shard_use");
                if (StarShardIframe.getStarShard() <= StarShardIframe.getMaxStick()) {
                    moveTo(this.itemInstance, vec2(532, 698), "easeOutCubic");
                    StarShardIframe.addStarShard(1);
                    wait(0.75, () => {
                        this.endThread();
                    })
                }
            }
        });
        if (this.itemInstance != null) {
            this.itemInstance.opacity = 1;
            this.eventArray.push(wait(8, () => {
                if (this.itemInstance != null && this.lock == false) {
                    tween(
                        this.itemInstance.opacity,
                        0,
                        0.5,
                        (val0) => this.itemInstance.opacity = val0,
                        easings["easeOutCubic"],
                    );
                    this.lock = true;
                    let wt = wait(0.54, () => {
                        this.endThread();
                    })
                    if (wt.cancel) wt.cancel();
                }
            }))
        }
        SoundLoader.playSound("star_shard_appear");
        return this;
    }

    endThread() {
        if (this.itemInstance != null) destroy(this.itemInstance);
        this.eventArray.forEach(task => {
            if (task.cancel) {
                task.cancel();
            }
        });
        if (this.eventArray.length) this.eventArray.length = 0;
        free(this);
    }
}
