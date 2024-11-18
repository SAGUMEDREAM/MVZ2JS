import {Zombie} from "/src/entity/Entity.js";
import {getRange} from "/src/util/Math.js";

export class Ghost extends Zombie {
    constructor(codecObject, line) {
        super(codecObject, line);
        this.initZombie();
    }
    initCode() {
        let defaultEvents = [this.loopTask[0], this.loopTask[1], this.loopTask[2], this.loopTask[3], this.loopTask[4]];
        defaultEvents.forEach((event) => {
            if(event != null) if(event.cancel != null) {
                event.cancel();
            }
        });
        this.loopTask[0] = this.entity_instance.onCollide("plant", (e) => {
            if(this.isInGlowArea) {
                if(e.instance != null) {
                    if (e.instance.isDisplayMode == false) {
                        this.onCollidePlant();
                    }
                }
            }
        });
        this.loopTask[1] = this.entity_instance.onCollideUpdate("plant", (e) => {
            if(this.isInGlowArea) {
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
            }
        });
        this.loopTask[2] = this.entity_instance.onCollideEnd("plant", () => {
            if(this.isInGlowArea) {
                this.isAttacking = false;
                this.attacking_target = null;
                this.collideLock = false;
                this.onCollideEndPlant();
            }
        });
        this.loopTask[3] = onUpdate(() => {
            if (this.entity_instance != null && this.entity_instance.pos != null) {
                if (!this.isAttacking) {
                    if (this.attacking_target != null) {
                        if (!this.isInGlowArea || this.attacking_target.entity_instance.bypassLineAttacking || this.spawnLine == this.attacking_target.y) {
                            //console.log(this.attacking_target.y)
                            this.entity_instance.pos.x -= (this.moving_speed * 0.097);
                        }
                    } else {
                        this.entity_instance.pos.x -= (this.moving_speed * 0.097);
                    }
                }
            }
            if(this.entity_instance != null) if(this.entity_instance.opacity !== null) {
                if(this.isInGlowArea == false) {
                    this.entity_instance.opacity = 0.5;
                } else {
                    this.entity_instance.opacity = 1.0;
                }
            }
        });
        this.loopTask[4] = loop(0.1, () => {
            if(this.isInGlowArea) if(this.isAttacking == true && this.attacking_target != null) {
                this.attack(this.attacking_target);
            }
        });
    }
}