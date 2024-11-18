import {Plant} from "/src/entity/Entity.js";
import {Bullets} from "/src/entity/Bullets.js";
import {chooseArrayElement} from "/src/util/Utils.js";
import {SoundLoader} from "../../sound/SoundLoader.js";
import {Knife} from "../bullet/Knife.js";

export class Silvenser extends Plant {
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onPlace() {
        this.loopTask.push(loop(0.1, () => {
            if(this.attacking_colddown<=this.attacking_colddown_timer) {
                this.attacking_colddown += 0.1;
            }
        }));
        this.loopTask.push(onUpdate(() => {
            this.existZInLine = false;
            let zombies = get("zombies");
            zombies.forEach((zombie) => {
                if(zombie.instance != null) if(zombie.instance.entity_instance != null) if(this.plbY == zombie.instance.spawnLine || zombie.instance.spawnLine == "ALL") {
                    if(zombie.pos != null && this.entity_instance.pos != null) {
                        if (zombie.pos.x > this.entity_instance.pos.x) {
                            this.existZInLine = true;
                        }
                    }
                }
            });
            if(this.attacking_colddown >= this.attacking_colddown_timer && this.existZInLine) {
                this.attack();
                this.attacking_colddown = 0;
            } else {
                //console.log(`${this.attacking_colddown}/${this.attacking_colddown_timer} ${this.existZInLine}`)
            }
        }));
    }
    onDrive() {
        (async () => {
            for (let j = 0; j < 3; j++) {
                let x1 = this.entity_instance.pos.x, y1 = this.entity_instance.pos.y;
                let radius = 550;
                let numBullets = 45;

                for (let i = 0; i < numBullets; i++) {
                    let angle = (i / numBullets) * 360;
                    let radian = angle * Math.PI / 180;

                    let bulletX = x1 + radius * Math.cos(radian);
                    let bulletY = y1 + radius * Math.sin(radian);

                    let bulletAngle = Math.atan2(y1 - bulletY, x1 - bulletX) * 180 / Math.PI;
                    Bullets.spawnBulletIn(this, "knife2", vec2(bulletX, bulletY), {
                        angle: bulletAngle
                    });
                }
                await wait(0.3);
            }
        })();
    }


    onAttack() {
        Bullets.spawnBullet(this,"knife",{});
        SoundLoader.playSound("throw");
        //console.log("attacking!");
    }
    initCode() {}
}