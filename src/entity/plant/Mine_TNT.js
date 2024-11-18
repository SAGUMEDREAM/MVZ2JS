import {Plant} from "/src/entity/Entity.js";
import {selectRange} from "/src/util/Utils.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {generateUniqueCoordinates} from "/src/event/level/randomGStatue.js";
import {GargoyleStatue} from "../zombie/GargoyleStatue.js";
import {Registries} from "../../registry/Registry.js";

export class Mine_TNT extends Plant {
    timer = null;
    timer_s = 0;
    canBoom = false;
    launchLock = false;
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onDrive() {
        this.timer_s = this.waitTime;
        let posArray = generateUniqueCoordinates([4, 8], [0, 4], 2);
        posArray.forEach(result => {
            let x = result.x;
            let y = result.y;
            let codecsObject = Registries.getCodec(Registries.PLANT,"mine_tnt");
            if(codecsObject != null) {
                let mine_tnt = new Mine_TNT(null,codecsObject);
                mine_tnt.toPlace(x,y);
                mine_tnt.timer_s = mine_tnt.waitTime;
            }
        });

    }
    onPlace() {
        this.canBoom = false;
        this.entity_instance.play("wait");
        this.timer = loop(1, () => {
            //console.log(`${this.timer_s}/${this.waitTime}`);
            if(this.timer_s < this.waitTime) {
                this.timer_s++
            }
        })
        this.loopTask.push(onUpdate(() => {
            if(this.timer_s >= this.waitTime && this.canBoom == false) {
                if(this.timer != null) if(this.timer.cancel) {
                    this.timer.cancel();
                }
                SoundLoader.playSound("dirt_rise");
                this.canBoom = true;
                this.entity_instance.play("start");
                this.timer = null;
            }
        }));
        this.entity_instance.onCollideUpdate("zombies" ,(zombie) => {
            if(this.canBoom == true && zombie.instance != null && this.launchLock == false) {
                if(this.plbY == zombie.instance.spawnLine) {
                    this.launchLock = true;
                    let x = this.entity_instance.pos.x;
                    let y = this.entity_instance.pos.y;
                    let vec = vec2(x,y)
                    let targets = selectRange(vec,120,"zombies");
                    wait(1,() => {
                        let g = add([
                            sprite("exploded_dirt"),
                            pos(this.entity_instance.pos),
                            scale(1),
                            opacity(1.0),
                            z(10),
                        ]);
                        SoundLoader.playSound("mine_explosion");
                        shake(10)
                        targets.forEach((target) => {
                            if(target != null) {
                                if (target.instance != null) {
                                    if (target.instance.damageBy != null) {
                                        target.instance.damageBy(this,this.attacking_damage);
                                    } else {}
                                } else {}
                            } else {}
                        });
                        this.freeBlock();
                        this.endThread();
                        wait(2, () => {
                            destroy(g);
                        })
                    });
                }
            }
        });
    }
    define() {
        this.waitTime = 15;
    }
}