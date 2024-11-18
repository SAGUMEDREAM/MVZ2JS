import {Plant} from "/src/entity/Entity.js";
import {moveTo, moveTo_Timer, scaleTo, selectRange} from "../../util/Utils.js";
import {SoundLoader} from "../../sound/SoundLoader.js";
import {StarShard} from "../../item/StarShard.js";

export class MagicChest extends Plant {
    lock = false;
    lock2 = false;
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onPlace() {
        this.entity_instance.pos.x -= 20;
        this.entity_instance.pos.y -= 20;
        this.loopTask.push(onUpdate(() => {
            if(this.entity_instance != null) {
                if(this.lock == false) {
                    this.entity_instance.play("normal");
                }
                if(this.lock == false) {
                    let x0 = this.entity_instance.pos.x;
                    let y0 = this.entity_instance.pos.y;
                    let vec = vec2(x0,y0);
                    let arr0 = selectRange(vec,125, "zombie");
                    let arr1 = [];
                    arr0.forEach(entity => {
                        if(entity.instance) {
                            if(this.plbY == entity.instance.spawnLine && entity.boss_type != true) {
                                arr1.push(entity);
                            }
                        }
                    });
                    if(arr1.length>0) {
                        this.lock = true;
                        this.entity_instance.play("update");
                    }
                }
                if(this.lock == true) {
                    let x0 = this.entity_instance.pos.x;
                    let y0 = this.entity_instance.pos.y;
                    let vec = vec2(x0,y0);
                    let arr0 = selectRange(vec,100, "zombie");
                    let arr1 = [];
                    arr0.forEach(entity => {
                        if(entity.instance) {
                            if(this.plbY == entity.instance.spawnLine && entity.boss_type != true) {
                                arr1.push(entity);
                            }
                        }
                    });
                    if(arr1.length>0) {
                        if(this.lock2) return;
                        this.attack(arr1[0]);
                    }
                }
            }
        }));
    }
    attack(entity) {
        (async () => {
            let instance = entity.instance;
            this.lock2 = true;
            if(instance) {
                let x0 = this.entity_instance.pos.x;
                let y0 = this.entity_instance.pos.y;
                scaleTo(entity,0,1.5,"easeOutCubic");
                moveTo(entity,this.entity_instance.pos,1.5,"easeOutCubic");
                SoundLoader.playSound("magucal");
                await wait(1.5);
                entity.instance.death();
                await wait(1);
                scaleTo(this.entity_instance,0,1.5,"easeOutCubic");
                this.entity_instance.play("normal");
                SoundLoader.playSound("chest_close");
                await wait(1.5);
                StarShard.spawnStarShard(x0,y0);
                SoundLoader.playSound("star_shard_appear");
                this.endThread();
                this.lock = false;
                this.lock2 = false;
            }
        })();
    }
    define() {

    }
}