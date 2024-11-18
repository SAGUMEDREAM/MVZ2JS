import {Bullet} from "/src/entity/Bullet.js";

export class Knife2 extends Bullet {
    target;
    constructor(codecObject, source, props) {
        super(codecObject, source, props);
    }
    onRun() {
        this.line = "ALL";
        this.target = "NULL";
        this.base_angle = this.props.angle || 0;
        if (this.props["angle"]) {
            this.bullet_instance.angle = this.base_angle;
            this.rFunc = () => {
                let radians = this.base_angle * Math.PI / 180;
                this.bullet_instance.pos.x += 8.5 * Math.cos(radians);
                this.bullet_instance.pos.y += 8.5 * Math.sin(radians);
            };
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
                    if(this.rFunc) this.rFunc();
                    if(Math.abs(this.bullet_instance.pos.x) >= 1300 + 550) {
                        this.endThread();
                    } else if(Math.abs(this.bullet_instance.pos.y) >= 1000 + 550) {
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
    }
    onCollide(target) {
        let instance = target.instance;
        if(instance != null) if(instance.damageBy != null) {
            instance.damageBy(this,this.attacking_damage,true);
        }
    }
}