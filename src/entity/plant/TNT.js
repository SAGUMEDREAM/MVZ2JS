import {Plant} from "/src/entity/Entity.js";
import {selectRange} from "/src/util/Utils.js";
import {SoundParser} from "/src/sound/SoundParser.js";

export class TNT extends Plant {
    timer = null;
    timer_s = 0;
    canBoom = false;
    launchLock = false;
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onDrive() {
        let x = this.entity_instance.pos.x;
        let y = this.entity_instance.pos.y;
        let vec = vec2(x,y);
        let targets = selectRange(vec,480,"zombies");
        wait(0.5,() => {
            SoundParser.playSound(SoundParser.SoundTypes.EXPLOSION);
            shake(35);
            targets.forEach((target) => {
                if(target != null) {
                    if (target.instance != null) {
                        if (target.instance.damageBy != null) {
                            target.instance.damageBy(this.source,this.attacking_damage);
                        }
                    }
                }
            });
            this.freeBlock();
            this.endThread();
        });
    }
    onBoot() {
        this.timer = loop(1, () => {
            if(this.timer_s < this.waitTime) {
                this.timer_s++
            }
        });
        this.loopTask.push(onUpdate(() => {
            if(this.timer_s >= this.waitTime && this.launchLock == false) {
                if(this.timer != null) if(this.timer.cancel) {
                    this.timer.cancel();
                }
                this.canBoom = true;
                this.entity_instance.play("start");
                this.timer = null;
                this.launchLock = true;
                let x = this.entity_instance.pos.x;
                let y = this.entity_instance.pos.y;
                let vec = vec2(x,y);
                let targets = selectRange(vec,240,"zombies");
                wait(1,() => {
                    SoundParser.playSound(SoundParser.SoundTypes.EXPLOSION);
                    shake(15)
                    targets.forEach((target) => {
                        if(target != null) {
                            if (target.instance != null) {
                                if (target.instance.damageBy != null) {
                                    target.instance.damageBy(this.source,this.attacking_damage);
                                }
                            }
                        }
                    });
                    this.freeBlock();
                    this.endThread();
                });
            }
        }));
    }
    onPlace() {
        this.canBoom = false;
        this.entity_instance.play("wait");
    }
    define() {
        this.waitTime = 5;
    }
}