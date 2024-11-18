import {Item} from "/src/item/Item.js";
import {random, randomInt} from "/src/util/Math.js";
import {free, moveTo} from "/src/util/Utils.js";
import {Constants} from "/src/client/Client.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";

export class Redstone extends Item {
    static bigger = 150;
    static middle = 50
    static lite = 25;
    static low = 15;
    redstoneNum;
    redstone_instance;
    eventArray = [];
    redstoneArray = [];
    lock = false;
    constructor(sunLevel,isSpawn,blockX,blockY) {
        super();
        switch (sunLevel) {
            case 0: {
                this.redstoneNum = Redstone.low;
                break;
            }
            case 1: {
                this.redstoneNum = Redstone.lite;
                break;
            }
            case 2: {
                this.redstoneNum = Redstone.middle;
                break;
            }
            case 3: {
                this.redstoneNum = Redstone.bigger;
                break;
            }
        }
        if(isSpawn) {
            this.spawnRedstone(blockX,blockY);
        } else {
            this.spawnInMine();
            this.initRandom();
        }
        this.init()
    }
    init() {
        if(this.redstone_instance != null) {
            this.redstone_instance.opacity = 1;
            this.eventArray.push(wait(8, () => {
                if(this.redstone_instance != null && this.lock == false) {
                    tween(
                        this.redstone_instance.opacity,
                        0,
                        0.5,
                        (val0) => this.redstone_instance.opacity = val0,
                        easings["easeOutCubic"],
                    )
                    this.lock = true;
                    let wt = wait(0.54, () => {
                        this.endThread();
                    })
                    if(wt.cancel) wt.cancel();
                }
            }))
        }
        SoundLoader.playSound("throw");
    }
    initRandom() {
        this.eventArray[0] = this.redstone_instance.onClick(() => {
            if(this.lock == false) {
                this.lock = true;
                SoundLoader.playSound("redstone_click");
                moveTo(this.redstone_instance, vec2(265,31), "easeOutCubic");
                let s = Constants.gameState.getStat().getObj("redstone");
                Constants.gameState.getStat().setObj("redstone",(this.redstoneNum + s));
                wait(0.75, () => {
                    this.endThread();
                })
            }
        });
    }
    spawnRedstone(blockX, blockY) {
        let vecZ = vec2(340,700);
        let blockObjs = get("place_block")
        blockObjs.forEach((item) => {
            if(item.x == blockX - 1 && item.y == blockY - 1) {
                vecZ = vec2(item.pos.x,item.pos.y+5);
            }
        })
        this.redstone_instance = add([
            sprite("redstone"),
            pos(vecZ),
            anchor("center"),
            scale(1.0),
            opacity(0),
            color(255, 255, 255),
            z(7),
            area(),
            "random_redstone",
            "redstone",
        ]);
        this.eventArray[0] = this.redstone_instance.onClick(() => {
            if(this.lock == false) {
                this.lock = true;
                SoundLoader.playSound("redstone_click");
                moveTo(this.redstone_instance, vec2(265,31), "easeOutCubic");
                let s = Constants.gameState.getStat().getObj("redstone");
                Constants.gameState.getStat().setObj("redstone",(this.redstoneNum + s));
                wait(0.75, () => {
                    this.endThread();
                })
            }
        });
        let ranX = randomInt(-14,14) +  this.redstone_instance.pos.x;
        let ranY = randomInt(+5,13) + this.redstone_instance.pos.y;
        moveTo(this.redstone_instance, vec2(ranX,ranY), "easeOutCubic");
        return this;
    }
    spawnInMine() {
        let vecZ = vec2(340,700);
        this.redstone_instance = add([
            sprite("redstone"),
            pos(vecZ),
            anchor("center"),
            scale(1.0),
            opacity(0),
            color(255, 255, 255),
            z(7),
            area(),
            "random_redstone",
            "redstone",
        ]);
        let ranX = randomInt(-28,28) + 340;
        let ranY = randomInt(-28,-10) + 700;
        moveTo(this.redstone_instance, vec2(ranX,ranY), "easeOutCubic")
        return this;
    }
    endThread() {
        if(this.redstone_instance != null) destroy(this.redstone_instance);
        this.eventArray.forEach(item => {
            if(item.cancel) {
                item.cancel();
            }
        });
        if(this.eventArray.length) this.eventArray.length = 0;
        free(this);
    }
}