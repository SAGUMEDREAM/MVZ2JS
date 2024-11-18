import {Item} from "/src/item/Item.js";
import {free} from "/src/util/Utils.js";
import {Constants} from "/src/client/Client.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {GemStone} from "./GemStone.js";
export class Trolley extends Item {
    identifier;
    instance;
    eventArray = [];
    launchMode = false;
    speed = 1.0;
    constructor(texture,line) {
        super();
        this.setId("trolley");
        this.texture = texture;
        this.line = line;
    }
    initCodecs() {}
    build() {
        this.y = function () {
            let mapValue = Constants.blockPosMap.get({x: 5, y: this.line});
            if(mapValue != null) {
                return mapValue.blockY;
            }
            return (196 + ((this.line - 1) * 103.3));
        }.bind(this)();
        this.instance = add([
            sprite(`${this.texture}`),
            anchor("center"),
            pos(235,this.y),
            scale(1.0),
            area(),
            z(14),
            `trolley`,
            {
                instance: this,
            }
        ]);
        this.eventArray.push(this.instance.onCollide("zombie", (entity) => {
            if(entity.instance != null) {
                if(entity.boss_type == false && entity.instance.spawnLine == this.line && entity.ignoring_calculate == false) {
                    if(this.launchMode == false) {
                        SoundLoader.playSound("weeder");
                    }
                    this.launchMode = true;
                    entity.instance.damageBy(null,65536 * (entity.instance.max_health || 65536));
                }
            }
        }));
        this.eventArray.push(onUpdate(() => {
            if(this.instance != null) {
                if(Math.abs(this.instance.pos.x) >= 1300) {
                    this.endThread();
                }
            }
            if(this.launchMode == true) {
                this.instance.pos.x += this.speed * 2.5;
            }
        }));
    }
    getClick() {
        let gemStone = new GemStone(this.instance.pos.x,this.instance.pos.y,1);
        gemStone.spawn();
        this.endThread();
    }
    endThread() {
        if(this.instance != null) {
            destroy(this.instance);
        }
        if(this.eventArray != null) {
            this.eventArray.forEach((task) => {
                if(task.cancel != null) {
                    task.cancel();
                }
            });
        }
        free(this);
    }
}