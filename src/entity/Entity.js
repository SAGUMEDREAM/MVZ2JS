import {Constants, KaplayLogger} from "/src/client/Client.js";
import {free, freeBlock, getBlock, getRowColumn} from "/src/util/Utils.js";
import {Block} from "/src/entity/Block.js";
import {getRange} from "/src/util/Math.js";
import {SoundParser} from "/src/sound/SoundParser.js";
import {WorldLevel} from "/src/level/WorldLevel.js";
import {Feature} from "/src/world/feature/Feature.js";
import {StarShard} from "/src/item/StarShard.js";
import {GemStone} from "/src/item/GemStone.js";
import {Vector} from "/src/entity/Vector.js";
import {ProfileManager} from "/src/util/GameProfile.js";
import {ObjectMaterial} from "/src/entity/ObjectMaterial.js";
import {ObjectAttribute} from "/src/entity/ObjectAttribute.js";
import {Tag} from "/src/entity/Tag.js";
import {Bullet} from "./Bullet.js";

export class Entity {
    source;
    entity_id = "default";
    entity_type = "entity";
    max_health = 100;
    health;
    isInGlowArea = false;
    attacking_damage = 0;
    attacking_target = null;
    attacking_colddown = 0;
    attacking_colddown_timer = 50;
    armor_health = 0;
    armor_type = null;
    blockPlace;
    bypassLineAttacking = false;
    object_attribute;
    object_material;
    moving_speed = 0;
    canIgnoring = false;
    ignoring_calculate;
    boss_type;
    isAttacking = false;
    isGodMode = false;
    isDisplayMode = false;
    isBetray = false;
    existZInLine = false;
    properties = null;
    sounds;
    vector;
    entity_instance = null;
    loopTask = [];
    controllerEvent = [];
    tags = [];
    stateArray = [ "normal" ];
    minNumber = Infinity;
    texture = null;
    size = 1.0;

    constructor(codecObject) {
        this.codecObject = codecObject;
        this.initProperties();
        Constants.entityInstance.push(this);
    }
    initProperties() {
        this.initBefore();
        this.entity_type = this.codecObject["type"] || "entity";
        this.entity_id = this.codecObject["identifier"] || "default";
        this.max_health = this.codecObject["max_health"] || 300;
        this.armor_health = this.codecObject["armor_health"] || 0;
        this.armor_type = this.codecObject["armor_type"] || null;
        this.attacking_damage = this.codecObject["attacking_damage"] != null ? this.codecObject["attacking_damage"] : 1.0;
        this.attacking_colddown_timer = this.codecObject["attacking_colddown"] || 50;
        this.moving_speed = this.codecObject["moving_speed"] != null ? this.codecObject["moving_speed"] : 1.0;
        this.ignoring_calculate = this.codecObject["ignoring_calculate"] || false;
        this.boss_type = this.codecObject["boss_type"] || false;
        this.size = this.codecObject["size"] || 1.0;
        this.vector = this.codecObject["vector"] || {"max": 1, "min": 2};
        this.resourcesKey = this.codecObject["resources"] || {};
        this.texture = `${this.entity_type}/${this.entity_id}` || "";
        this.cost = this.codecObject["cost"] || 100;
        this.weight = this.codecObject["weight"] || 1000;
        this.bypassLineAttacking = this.codecObject["bypassLineAttacking"] || 0;
        this.tags = this.codecObject["tags"] || [];
        this.stateArray = this.codecObject["states"] || [];
        this.sounds = this.codecObject["sounds"] || {"damage": null, "death": null, "block_sound": null}
        this.soundDamage = this.sounds["damage"];
        this.soundDeath = this.sounds["death"];
        this.block_sound = this.sounds["block_sound"];

        const attr = this.codecObject["object_attribute"];
        const material = this.codecObject["object_material"];
        this.object_attribute_type = (attr || attr == 0) ? attr : "COMMON";
        this.object_material_type = (material || material == 0) ? material : "FLESH";
        this.object_attribute = new ObjectAttribute(this.object_attribute_type);
        this.object_material = new ObjectMaterial(this.object_material_type);

        let objects = this.codecObject["objects"];
        if (objects) Object.assign(this, objects);

        this.health = this.max_health;
        this.vector = Vector.createVector(this.vector);
    }
    getSpriteProperties() {
        return [];
    }
    initBefore() {}
    attack() {
        this.onAttack();
    }
    death() {
        this.onDeath();
        this.endThread();
    }
    onAttack() {}
    onDeath() {}
    initPlant() {this.initCode();}
    initZombie() {this.initCode();}
    initCode() {}
    endThread() {
        if(this.entity_instance != null) destroy(this.entity_instance);
        this.entity_instance = null;
        if(this.loopTask != null) this.loopTask.forEach(item => {
            if(item.cancel) {
                item.cancel();
            }
        });
        if(this.controllerEvent != null) this.controllerEvent.forEach(item => {
            if(item.cancel) {
                item.cancel();
            }
        });
        if(this.loopTask != null) {
            this.loopTask.length = 0;
            this.loopTask = null;
        }
        free(this);
    }
    animation() {}
    define() {
        // 使字段在 IDE 可见
    }
    damage(source,value,mute) {
        //console.log(source)
        if(this.entity_instance != null) {
            this.entity_instance.color.r = 255;
            this.entity_instance.color.g = 150;
            this.entity_instance.color.b = 150;
            wait(0.1, () => {
                if(this.entity_instance != null) if(this.entity_instance.color != null){
                    this.entity_instance.color.r = 255;
                    this.entity_instance.color.g = 255;
                    this.entity_instance.color.b = 255;
                }
            });
        }
        if (this.armor_health >= 0) {
            this.armor_health -= value;
            if (this.armor_health < 0) {
                let remainingDamage = Math.abs(this.armor_health);
                this.health -= remainingDamage;
                this.armor_health = 0;
            }
        } else {
            this.health -= value;
        }
        if(mute != true) {
            if(this.entity_type == "zombie" || this.entity_type == "zombies") SoundParser.playSound(this.soundDamage);
            if(this.entity_type == "plant") SoundParser.playSound(this.block_sound);
        }
    }
    damageBy(source,value,mute,isSourceTarget) {
        if(this.isDisplayMode == true) return;
        if(source == null) {
            this.damage(source,value,mute);
            return;
        }
        let object_attribute = source.object_attribute;
        let object_material = this.object_material;
        let sourceObject = function(){
            if(source instanceof Bullet) {
                if(isSourceTarget) {
                    return source.source;
                } else {
                    return source;
                }
            } else if(source instanceof Entity) {
                return source;
            }
            return source;
        }();
        let result = Tag.damageResult(object_attribute,object_material);
        switch (result) {
            case Tag.RESULT.SUCCESS: {
                this.damage(sourceObject,value,mute);
                break;
            }
            case Tag.RESULT.FAIL: {
                if(this.entity_type == "zombie" || this.entity_type == "zombies") SoundParser.playSound(this.soundDamage);
                if(this.entity_type == "plant") SoundParser.playSound(this.block_sound);
                if(sourceObject != null) if(sourceObject.endThread != null) {
                    sourceObject.endThread();
                }
                break;
            }
            case Tag.RESULT.BIG_DAMAGE: {
                value = value * parseFloat((1 + Math.random() * 1.5).toFixed(3));
                this.damage(sourceObject,value,mute);
                break;
            }
            case Tag.RESULT.INSTANT_KILL: {
                if(this.boss_type == true) {
                    this.damage(sourceObject,value,mute);
                } else {
                    this.damage(sourceObject,this.max_health * value * 100,mute);
                }
                break;
            }
            default: {
                this.damage(sourceObject,value,mute);
                KaplayLogger.warn("Entity",`Unknown result ${result}`);
                break;
            }
        }
    }
    isAlive() {
        return this.health > 0;
    }
    getVector() {
        return this.vector;
    }
    getSize() {
        return this.size;
    }
    getTexture() {
        return this.texture;
    }
    getEntity() {
        return this;
    }
    getHealth() {
        return this.health;
    }
    getMaxHealth() {
        return this.max_health;
    }
}
export class Plant extends Entity {
    state = 0;
    plbX = 0;
    plbY = 0;
    collideDeleteSlot = false;
    constructor(source, codecObject) {
        super(codecObject);
        this.source = source;
    }
    getSpriteProperties() {
        return [
            sprite(`${this.getTexture()}`),
            pos(center()),
            anchor("center"),
            scale(this.getSize()),
            color(),
            area(),
            z(6),
            `entity`,
            `plant`,
            `${this.entity_id}`,
            state("normal", this.stateArray),
            {
                instance: this,
                vector: this.vector,
                getInstance: () => { return this },
            }
        ];
    }
    initPlant() {
        this.entity_type = "plant";
        this.isDisplayMode = true;
        this.spriteProperties = this.getSpriteProperties();
        this.tags.forEach(tag => {
            this.spriteProperties.push(tag);
        })
        this.entity_instance = add(this.spriteProperties);
        this.loopTask[0] = onUpdate(() => {
            if(this.entity_instance!=null && this.isDisplayMode) {
                let mouse_pos = mousePos();
                this.entity_instance.pos = mousePos();
                this.minNumber = Infinity;
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
            }
            if(WorldLevel.deleteSlot != null) {
                WorldLevel.deleteSlot.opacity = 0;
                if(this.isDisplayMode == true) {
                    WorldLevel.deleteSlot.opacity = 1;
                }
            }
        });
        this.loopTask[1] = onUpdate(() => {
            if(this.health<=0) {
                this.death();
            }
        });
        this.loopTask[2] = this.entity_instance.onCollide("delete_slot",() => {
            this.collideDeleteSlot = true;
        });
        this.loopTask[3] = this.entity_instance.onCollideEnd("delete_slot",() => {
            this.collideDeleteSlot = false;
        });
        this.controllerEvent[0] = onMousePress((m) => {
            let bpArray = get("place_block");
            bpArray.forEach(bp => {
                bp.color.r = 255;
                bp.color.g = 255;
                bp.color.b = 255;
                bp.opacity = 0;
            });
            if((m==="right" || m==="middle" || m==="back" || m==="forward") && this.isDisplayMode) {
                this.cancelPlant();
            } else {
                if(this.blockPlace && this.minNumber <= 60 && this.isDisplayMode) {
                    if(this.blockPlace.canPlace && !this.blockPlace.isPlanting) {
                        this.blockPlace.isPlanting = true;
                        this.entity_instance.pos = this.blockPlace.pos;
                        this.plbX = this.blockPlace.block_instance.x;
                        this.plbY = this.blockPlace.block_instance.y;
                        this.isDisplayMode = false;
                        this.place();
                        this.runCardScript();
                    }
                } else if(WorldLevel.deleteSlot != null) {
                    if(this.collideDeleteSlot == true) {
                        this.cancelPlant();
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
            if((m==="right" || m==="middle" || m==="back" || m==="forward") && this.isDisplayMode) {
                this.cancelPlant();
            } else {
                if(this.blockPlace && this.minNumber <= 60) {
                    if(this.blockPlace.canPlace && !this.blockPlace.isPlanting) {
                        this.blockPlace.isPlanting = true;
                        this.entity_instance.pos = this.blockPlace.pos;
                        this.plbX = this.blockPlace.block_instance.x;
                        this.plbY = this.blockPlace.block_instance.y;
                        this.isDisplayMode = false;
                        this.place();
                        this.runCardScript();
                    }
                } else if(WorldLevel.deleteSlot != null) {
                    if(this.collideDeleteSlot == true) {
                        this.cancelPlant();
                    }
                }
            }
        });
        this.loopTask.push(onUpdate(() => {
            this.isInGlowArea = false;
        }));
        this.initCode();
    }
    onBoot() {}
    onAttack() {}
    onDeath() {}
    onDrive() {}
    onPlace() {}
    onDamage(source,value,mute) {}
    animation() {}
    boot() {
        this.onBoot()
    }
    damage(source,value,mute) {
        super.damage(source,value,mute)
        this.onDamage(source,value,mute);
    }
    runCardScript() {
        if(this.source !== null) {
            if(this.source.placed !== null) {
                this.source.placed();
            }
        }
    }
    freeBlock() {
        if(this.blockPlace != null) if(this.blockPlace.isPlanting != null) {
            this.blockPlace.isPlanting = false;
        }
    }
    death() {
        SoundParser.playSound(this.soundDeath);
        this.onDeath();
        this.freeBlock();
        this.endThread();
    }
    drive() {
        this.onDrive();
    }
    toPlace(x,y) {
        let blockObj = Constants.blockPosMap.get(Feature.getPosKey(x,y));
        if(blockObj != null) {
            let x0 = blockObj["blockX"];
            let y0 = blockObj["blockY"];
            let block_instance = blockObj["instance"];
            block_instance.isPlanting = true;
            this.entity_instance.pos = block_instance.pos;
            this.plbX = block_instance.block_instance.x;
            this.plbY = block_instance.block_instance.y;
            this.isDisplayMode = false;
        }
        this.onPlace();
    }
    place() {
        SoundParser.playSound(this.block_sound);
        if(WorldLevel.deleteSlot != null) {
            WorldLevel.deleteSlot.opacity = 0;
        }
        this.onPlace();
    }
    cancelPlant() {
        if(WorldLevel.deleteSlot != null) {
            WorldLevel.deleteSlot.opacity = 0;
        }
        if(this.source !== null) {
            if(this.source.cancelPlace !== null) {
                this.source.cancelPlace();
            }
        }
        this.endThread();
    }
}
export class Zombie extends Entity {
    spawnLine;
    collideLock = false;
    drop_star_shard = false;
    constructor(codecObject,spawnLine) {
        super(codecObject);
        this.spawnLine = spawnLine;
        Constants.entityInstance.push(this);
    }
    getSpriteProperties() {
        if(Math.random() <= 0.134 && !ProfileManager.manager.getData()["game_data"]["levels"].includes("level1_1")) {
            this.drop_star_shard = true;
        }
        return [
            sprite(`${this.getTexture()}`),
            pos(vec2(1330, this.getY())),
            anchor("center"),
            scale(this.getSize()),
            opacity(1.0),
            color(255,255,255),
            area(),
            z(8),
            state("normal", this.stateArray),
            `entity`,
            `${this.entity_type}`,
            `${this.entity_id}`,
            `zombies`,
            {
                instance: this,
                ignoring_calculate: this.ignoring_calculate,
                boss_type: this.boss_type,
                vector: this.vector,
                getInstance: () => { return this },
            },
        ];
    }
    initZombie() {
        this.entity_type = "zombie";
        if(this.getTexture() == null) return;
        this.spriteProperties = this.getSpriteProperties();
        this.tags.forEach(tag => {
            this.spriteProperties.push(tag);
        })
        this.entity_instance = add(this.spriteProperties);
        /*onUpdate(() => {
            if(this.entity_instance != null) {
                console.log(this.entity_instance.state)
            }
        });*/
        this.loopTask[0] = this.entity_instance.onCollide("plant", (e) => {
            if(e.instance != null) {
                if (e.instance.isDisplayMode == false) {
                    this.onCollidePlant();
                }
            }
        });
        this.loopTask[1] = this.entity_instance.onCollideUpdate("plant", (e) => {
            this.collideLock = true;
            if (e != null) if(e.instance != null) if(!e.instance.canIgnoring) {
                let x1 = e.pos.x;
                let y1 = e.pos.y;
                let x2 = this.entity_instance.pos.x;
                let y2 = this.entity_instance.pos.y;
                let state = e.instance.isDisplayMode;
                if(getRange(x1,y1,x2,y2).toFixed(2) <= 45 && state == false) {
                    this.attacking_target = e;
                    this.isAttacking = true;
                }
            }
        });
        this.loopTask[2] = this.entity_instance.onCollideEnd("plant", () => {
            this.isAttacking = false;
            this.attacking_target = null;
            this.collideLock = false;
            this.onCollideEndPlant();
        });
        this.loopTask[3] = onUpdate(() => {
            if (this.entity_instance != null && this.entity_instance.pos != null) {
                if (!this.isAttacking) {
                    if (this.attacking_target != null) {
                        if (this.attacking_target.entity_instance.bypassLineAttacking || this.spawnLine == this.attacking_target.y) {
                            //console.log(this.attacking_target.y)
                            this.entity_instance.pos.x -= (this.moving_speed * 0.097);
                        }
                    } else {
                        this.entity_instance.pos.x -= (this.moving_speed * 0.097);
                    }
                }
            }
        });
        this.loopTask[4] = loop(0.1, () => {
            if(this.isAttacking == true && this.attacking_target != null) {
                this.attack(this.attacking_target);
            }
        });
        this.loopTask[5] = onUpdate(() => {
            if (this.health <= 0) {
                SoundParser.playSound(this.soundDeath);
                this.death();
            }
            if(this.entity_instance != null && this.stopLock == false) {
                if(this.entity_instance.pos.x<=190) {
                    let worldLevel = WorldLevel.currentWorldLevel;
                    if(worldLevel != null) {
                        this.stopLock = true;
                        let zombies = get("zombie");
                        if(zombies != null) zombies.forEach(z => {
                            if(z.paused != null) z.paused = true;
                            if(z.instance != null) if(z.instance.loopTask != null) {
                                z.instance.loopTask.forEach(task => {
                                    if(task.paused != null) task.paused = true;
                                });
                            }
                        })
                        let plants = get("plant");
                        if(plants != null) plants.forEach(p => {
                            if(p.paused != null) p.paused = true;
                            if(p.instance != null) if(p.instance.loopTask != null) {
                                p.instance.loopTask.forEach(task => {
                                    if(task.paused != null) task.paused = true;
                                });
                            }
                        })
                        this.entity_instance.paused = false;
                        this.loopTask.forEach(task => {
                            if(task.paused != null) task.paused = false;
                        });
                        worldLevel.initFailure();
                    }
                }
            }
        });
        this.loopTask.push(onUpdate(() => {
            this.isInGlowArea = false;
        }));
        if(this.drop_star_shard == true) {
            this.loopTask.push(onUpdate(() => {
                if(this.entity_instance != null) {
                    this.entity_instance.color.r = 150;
                    this.entity_instance.color.g = 255;
                    this.entity_instance.color.b = 150;
                }
            }));
        }
        this.initCode();
    }
    stopLock = false;
    spawnTo(x,y) {
        this.spawnLine = "ALL";
        this.entity_instance.pos.x = x;
        this.entity_instance.pos.y = y;
    }
    spawnToBlock(x,y) {
        let block = getBlock(x, y);
        if(block != null) {
            this.entity_instance.pos.x = block.blockX;
            this.entity_instance.pos.y = block.blockY;
        }
    }
    attack(e) {
        this.attacking_colddown++;
        //console.log(`${this.attacking_colddown}/${this.attacking_colddown_timer}`)
        if(e!=null) {
            if(this.attacking_colddown > this.attacking_colddown_timer - 2) {
                this.attacking_colddown = 0;
                if(e.instance != null) {
                    e.instance.damageBy(this,this.attacking_damage,false);
                }
            }
        }
        this.onAttack(e);
    }
    onCollidePlant() {}
    onCollideEndPlant() {}
    onDamage(source,value,mute) {}
    death() {
        this.onDeath();
        if(Math.random() <= 0.17 * Math.random() * additionalCoinMultiplier) {
            let gemStone;
            let x0 = this.entity_instance.pos.x;
            let y0 = this.entity_instance.pos.y;
            let random = Math.random();
            if(random <= 0.02) {
                gemStone = new GemStone(x0,y0,3);
            } else if(random <= 0.28) {
                gemStone = new GemStone(x0,y0,2);
            } else if(random <= 0.60) {
                gemStone = new GemStone(x0,y0,1);
            } else {
                gemStone = new GemStone(x0,y0,0);
            }
            gemStone.spawn();
        }
        if(this.drop_star_shard == true && this.entity_instance != null) {
            let x0 = this.entity_instance.pos.x;
            let y0 = this.entity_instance.pos.y;
            StarShard.spawnStarShard(x0, y0);
        }
        this.endThread();
    }

    damage(source,value,mute) {
        super.damage(source,value,mute);
        this.onDamage(source,value,mute);
    }
    animation() {}
    betray() {
        this.isBetray = !this.isBetray;
        this.moving_speed = (-(this.moving_speed));
    }
    getY() {
        let mapValue = Constants.blockPosMap.get({x: 5, y: this.spawnLine});
        if(mapValue != null) {
            return mapValue.blockY;
        }
        return (196 + ((this.spawnLine - 1) * 103.3));
    }
    getSize() {
        return this.size || 1.0;
    }
}
export var additionalCoinMultiplier = 1.0;