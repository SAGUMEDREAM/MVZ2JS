import {Bullet} from "/src/entity/Bullet.js";
import {moveTo, scaleTo} from "/src/util/Utils.js";

export class BigSnowball extends Bullet {
    tick = 0;
    base_attacking_damage = 0;
    constructor(codecObject, source, props) {
        super(codecObject, source, props);
    }
    onRun() {
        this.base_attacking_damage = this.attacking_damage;
        this.bullet_instance.pos.x += 20;
        this.line = "ALL";
        if(this.source != null) {
            this.line = this.source.plbY || "ALL";
        }
        if(this.source != null) {
            if(this.source.entity_type == "plant") {
                this.target = "zombie";
                this.bullet_instance.pos.x += 40;

            } else if(this.source.entity_type == "zombie") {
                this.bullet_instance.scale.x = -this.bullet_instance.scale.x;
                this.target = "plant";
                this.bullet_instance.pos.x -= 40;
                this.speed = -this.speed;
            }
        }
        this.taskLoops.push(
            onUpdate(() => {
                if(this.bullet_instance != null && this.bullet_instance.pos != null) {
                    this.bullet_instance.z = 20;
                    this.attacking_damage = (0.75 * this.bullet_instance.angle) + this.base_attacking_damage;
                    if(this.bullet_instance.angle != null) {
                        this.bullet_instance.angle += 1.5;
                    }
                    this.bullet_instance.move(300 * this.speed, 0);
                    if(this.bullet_instance.pos.x >= 1300) {
                        this.endThread();
                    }
                }
            })
        );
        this.taskLoops.push(
            this.bullet_instance.onCollide(this.target, (targetInstance) => {
                if(targetInstance.pos != null && targetInstance.instance != null && this.bullet_instance.pos != null) {
                    let x0 = targetInstance.pos.x;
                    let y0 = targetInstance.pos.y;
                    let x1 = this.bullet_instance.pos.x;
                    let y1 = this.bullet_instance.pos.y;
                    let dist = Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));
                    if(targetInstance.vector.isIn(this.vector) == true && (this.line == targetInstance.instance.spawnLine || targetInstance.instance.spawnLine == "ALL" || this.line == "ALL")) {
                        if(targetInstance.is("ghost")) {
                            if(targetInstance.instance) if(targetInstance.instance.isInGlowArea) {
                                this.collide(targetInstance);
                            }
                        } else {
                            this.collide(targetInstance);
                        }
                    }
                }
            })
        );
        scaleTo(this.bullet_instance,6.5,2.5,null);
    }
    onCollide(target) {
        let instance = target.instance;
        if(instance != null) if(instance.damageBy != null) {
            if(target.instance.boss_type == false) {
                instance.damageBy(this,this.attacking_damage);
            } else {
                instance.damageBy(this,500);
            }
        }
    }
}