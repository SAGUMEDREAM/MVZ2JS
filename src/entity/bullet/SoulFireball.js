import {Bullet} from "/src/entity/Bullet.js";
import {Bullets} from "/src/entity/Bullets.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";

export class SoulFireball extends Bullet {
    target;
    c = 0;
    rFunc1 = () => {};
    constructor(codecObject, source, props) {
        super(codecObject, source, props);
    }
    onRun() {
        this.line = "ALL";
        this.target = "NULL";
        this.rFunc = () => {};
        this.rFunc1 = () => {};
        if(this.props["type"]) {
            this.propsType = this.props["type"];
            if(this.propsType == "UP") {
                this.rFunc = () => {
                    this.bullet_instance.move(0, 300 * this.speed);
                    //this.bullet_instance.pos.y -= 40;
                };
            } else if(this.propsType == "DOWN") {
                this.rFunc = () => {
                    this.bullet_instance.move(0, -300 * this.speed);
                    //this.bullet_instance.pos.y += 40;
                };
            } else {
                this.rFunc = () => {};
            }
        }
        this.base_angle = this.props.angle || 0;
        if (this.props["angle"]) {
            this.rFunc1 = () => {
                let radians = this.base_angle * Math.PI / 180;
                //this.bullet_instance.pos.x += speed * Math.cos(radians);
                this.bullet_instance.pos.y += 2.5 * Math.sin(radians);
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
                    this.bullet_instance.move(300 * this.speed, 0);
                    if(this.rFunc) this.rFunc();
                    if(this.rFunc1) this.rFunc1();
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
                        this.collide(targetInstance);
                        if(this.c>2 || this.propsType == "MID") this.endThread();
                    }
                }
            })
        );
    }
    onCollide(target) {
        let instance = target.instance;
        if(instance != null) if(instance.damageBy != null) {
            instance.damageBy(this.source,this.attacking_damage,true,null);
            SoundLoader.playSound("fire");
            if(this.propsType != "UP" && this.propsType != "DOWN") {
                Bullets.spawnBulletIn(this.source,"soul_fireball",this.getVec(),{
                    "type": "UP"
                });
                Bullets.spawnBulletIn(this.source,"soul_fireball",this.getVec(),{
                    "type": "DOWN"
                });
            }
            ++this.c;
        }
    }
}