import {Plant} from "/src/entity/Entity.js";
import {Bullets} from "/src/entity/Bullets.js";
import {chooseArrayElement} from "/src/util/Utils.js";
import {SoundLoader} from "../../sound/SoundLoader.js";

export class Dispenser extends Plant {
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
            for (let i = 0; i < 60; i++) {
                await wait(0.04);
                this.onAttack();
            }
        })();
    }

    onAttack() {
        Bullets.spawnBullet(this,"arrow0",{});
        SoundLoader.playSound("throw");
        //console.log("attacking!");
    }
    initCode() {}
}