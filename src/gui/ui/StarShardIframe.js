import {Constants} from "../../client/Client.js";
import {addConfetti, getRowColumn} from "../../util/Utils.js";
import {Block} from "../../entity/Block.js";
import {SoundLoader} from "../../sound/SoundLoader.js";
import {WorldLevel} from "../../level/WorldLevel.js";
import {ProfileManager} from "../../util/GameProfile.js";

export class StarShardIframe {
    texture;
    uiInstance;
    uiPointInstance;
    itemInstance;
    eventArray = [];
    using = false;
    constVec2 = vec2(532,698);
    controllerEvent = [];
    minNumber;
    blockPlace;
    collideIframe = false;
    constructor(texture) {
        this.texture = texture;
    }
    init() {
        this.uiInstance = add([
            sprite("star_shard_frame0"),
            pos(vec2(514,698)),
            scale(1.25),
            anchor("left"),
            area(),
            z(15),
        ]);
        this.uiPointInstance = add([
            sprite("star_shard_frame5"),
            pos(vec2(514,698)),
            scale(1.25),
            anchor("left"),
            area(),
            z(16),
        ]);
        this.itemInstance = add([
            sprite(`${this.texture}`),
            pos(this.constVec2),
            scale(1.25),
            anchor("center"),
            area(),
            opacity(0),
            z(17),
        ]);
        this.eventArray.push(
            onUpdate(() => {
                if(this.using == true) {
                    let mouse_pos = mousePos();
                    this.itemInstance.pos = mousePos();
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
                    this.itemInstance.pos = this.constVec2;
                }
            })
        );
        this.eventArray.push(this.uiInstance.onClick((m) => {
            this.getClick();
        }));
        this.eventArray.push(this.itemInstance.onCollide("delete_slot",() => {
            this.collideIframe = true;
        }));
        this.eventArray.push(this.itemInstance.onCollideEnd("delete_slot",() => {
            this.collideIframe = false;
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
                                    plant.instance.drive();
                                    SoundLoader.playSound("spell_card");
                                    StarShardIframe.removeStarShard(1);
                                }
                            }
                        });
                        this.cancel();
                    }
                } else if(WorldLevel.starShardUI != null) {
                    if(this.collideIframe == true) {
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
                                    let x0 = plant.pos.x;
                                    let y0 = plant.pos.y;
                                    plant.instance.drive();
                                    addConfetti({ pos: vec2(x0, y0) });
                                    SoundLoader.playSound("spell_card");
                                    StarShardIframe.removeStarShard(1);
                                }
                            }
                        });
                        this.cancel();
                    }
                } else if(WorldLevel.deleteSlot != null) {
                    if(this.collideIframe == true) {
                        this.cancel();
                    }
                }
            }
        });
        this.eventArray.push(onUpdate(() => {
            this.itemInstance.opacity = 1;
            let c = StarShardIframe.getStarShard();
            if(c > 0) {
                this.itemInstance.opacity = 1;
            } else {
                this.itemInstance.opacity = 0;
            }
            switch (c) {
                case 0: {
                    this.uiPointInstance.use(sprite("star_shard_frame5"))
                    break;
                }
                case 1: {
                    this.uiPointInstance.use(sprite("star_shard_frame6"))
                    break;
                }
                case 2: {
                    this.uiPointInstance.use(sprite("star_shard_frame7"))
                    break;
                }
                case 3: {
                    this.uiPointInstance.use(sprite("star_shard_frame8"))
                    break;
                }
                case 4: {
                    this.uiPointInstance.use(sprite("star_shard_frame9"))
                    break;
                }
                case 5: {
                    this.uiPointInstance.use(sprite("star_shard_frame10"))
                    break;
                }
                case 6: {
                    this.uiPointInstance.use(sprite("star_shard_frame11"))
                    break;
                }
            }
        }));
    }
    getClick() {
        let c = StarShardIframe.getStarShard();
        if(c > 0) {
            SoundLoader.playSound("tap");
            this.using = !this.using;
        } else {
            SoundLoader.playSound("buzzer");
        }
    }
    cancel() {
        this.using = false;
        this.blockPlace = null;
    }
    use() {
        this.using = true;
    }
    static getMaxStick() {
        return ProfileManager.manager.getData()["game_data"]["star_shard_max_stack"];
    }
    static getStarShard() {
        return Constants.gameState.getStat().getObj("star_shard");
    }
    static addStarShard(value) {
        let oldValue = Constants.gameState.getStat().getObj("star_shard");
        Constants.gameState.getStat().setObj("star_shard",(oldValue + value));
    }
    static removeStarShard(value) {
        let oldValue = Constants.gameState.getStat().getObj("star_shard");
        Constants.gameState.getStat().setObj("star_shard",(oldValue - value));
    }
}