import {Item} from "/src/item/Item.js";
import {getRowColumn} from "../util/Utils.js";
import {Block} from "../entity/Block.js";
import {SoundLoader} from "../sound/SoundLoader.js";
import {WorldLevel} from "../level/WorldLevel.js";

export class IronPickaxe extends Item {
    item_instance;
    pickaxe_slot_instance;
    eventArray = [];
    controllerEvent = [];
    constVec2 = vec2(400,32);
    using = false;
    minNumber;
    blockPlace;
    collideDeleteSlot = false;
    constructor() {
        super("pickaxe");
        this.setId("pickaxe");
        this.initCodecs();
    }
    initCodecs() {}
    build() {
        this.item_instance = add([
            sprite("pickaxe"),
            pos(this.constVec2),
            anchor("center"),
            scale(1),
            opacity(1.0),
            color(255, 255, 255),
            z(12),
            area(),
        ]);
        this.pickaxe_slot_instance = add([
            sprite("pickaxe_slot"),
            pos(this.constVec2),
            anchor("center"),
            scale(1),
            opacity(1.0),
            color(255, 255, 255),
            z(10),
            area(),
        ]);
        this.eventArray.push(onUpdate(() => {
            if(this.using == true) {
                let mouse_pos = mousePos();
                this.item_instance.pos = mousePos();
                this.minNumber = Infinity;
                this.blockPlace = null;
                let bpArray = get("place_block");
                let entityPosX = mouse_pos.x;
                let entityPosY = mouse_pos.y;
                bpArray.forEach(bp => {
                    let bpPosX = bp.pos.x;
                    let bpPosY = bp.pos.y;
                    let posDist = Math.sqrt(Math.pow((entityPosX - bpPosX), 2) + Math.pow((entityPosY - bpPosY), 2));
                    if (posDist < this.minNumber) {
                        this.minNumber = posDist;
                        this.blockPlace = bp;
                    }
                });
                if(this.blockPlace != null) {
                    let bX = this.blockPlace.block_instance.x;
                    let bY = this.blockPlace.block_instance.y;
                    let arr = getRowColumn(Block.mapArray,bX,bY).removed;
                    bpArray.forEach(bp => {
                        if(arr.includes(bp.block_instance)) {
                            bp.opacity = 0.3;
                        } else {
                            bp.opacity = 0;
                        }
                    });
                }
                bpArray.length = 0;
            } else {
                this.item_instance.pos = this.constVec2;
            }
        }));
        this.eventArray.push(this.pickaxe_slot_instance.onClick((m) => {
            SoundLoader.playSound("tap");
            this.getClick();
        }));
        this.eventArray.push(this.item_instance.onCollide("delete_slot",() => {
            this.collideDeleteSlot = true;
        }));
        this.eventArray.push(this.item_instance.onCollideEnd("delete_slot",() => {
            this.collideDeleteSlot = false;
        }));
        this.controllerEvent[0] = onMousePress((m) => {
            let bpArray = get("place_block");
            bpArray.forEach(bp => {
                bp.color.r = 255;
                bp.color.g = 255;
                bp.color.b = 255;
                bp.opacity = 0;
            });
            if((m==="right" || m==="middle" || m==="back" || m==="forward")) {
                this.cancel();
            } else {
                if(this.blockPlace && this.minNumber <= 60) {
                    if(this.blockPlace.canPlace && this.blockPlace.isPlanting && this.using == true) {
                        get("plant").forEach((plant) => {
                            if(plant.instance != null) {
                                let plbX = plant.instance.plbX;
                                let plbY = plant.instance.plbY;
                                if(this.blockPlace.block_instance.x == plbX && this.blockPlace.block_instance.y == plbY) {
                                    this.blockPlace.isPlanting = false;
                                    plant.instance.endThread();
                                    SoundLoader.playSound("shovel");
                                }
                            }
                        });
                        this.cancel();
                    }
                } else if(WorldLevel.deleteSlot != null) {
                    if(this.collideDeleteSlot == true) {
                        this.cancel();
                    }
                }
            }
        });
        this.controllerEvent[1] = onTouchEnd((m) => {
            let bpArray = get("place_block");
            bpArray.forEach(bp => {
                bp.color.r = 255;
                bp.color.g = 255;
                bp.color.b = 255;
                bp.opacity = 0;
            });
            if((m==="right" || m==="middle" || m==="back" || m==="forward")) {
                this.cancel();
            } else {
                if(this.blockPlace && this.minNumber <= 60) {
                    if(this.blockPlace.canPlace && this.blockPlace.isPlanting && this.using == true) {
                        get("plant").forEach((plant) => {
                            if(plant.instance != null) {
                                let plbX = plant.instance.plbX;
                                let plbY = plant.instance.plbY;
                                if(this.blockPlace.block_instance.x == plbX && this.blockPlace.block_instance.y == plbY) {
                                    this.blockPlace.isPlanting = false;
                                    plant.instance.endThread();
                                    SoundLoader.playSound("shovel");
                                }
                            }
                        });
                        this.cancel();
                    }
                } else if(WorldLevel.deleteSlot != null) {
                    if(this.collideDeleteSlot == true) {
                        this.cancel();
                    }
                }
            }
        });
    }
    cancel() {
        this.using = false;
        this.blockPlace = null;
    }
    getClick() {
        this.using = !this.using;
    }
    use() {
        this.using = true;
    }
    endThread() {

    }
}