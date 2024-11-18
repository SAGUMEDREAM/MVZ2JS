import {Plant} from "/src/entity/Entity.js";
import {Bullets} from "/src/entity/Bullets.js";
import {chooseArrayElement, selectRange} from "/src/util/Utils.js";
import {SoundLoader} from "../../sound/SoundLoader.js";
import {WorldLevel} from "../../level/WorldLevel.js";

export class SoulForge extends Plant {
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onPlace() {
        if(WorldLevel.currentWorldLevel != null) {
            if(WorldLevel.currentWorldLevel.getLevel().day_time == false) {
                this.entity_instance.play("on");
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
                    }
                    if(this.entity_instance != null) {
                        let range_plants = selectRange(this.entity_instance.pos,225,"plant");
                        let range_zombies = selectRange(this.entity_instance.pos,225,"zombie");
                        [range_plants,range_zombies].forEach(entities => {
                            if(entities != null) entities.forEach(entity => {
                                if(entity.instance != null) {
                                    entity.instance.isInGlowArea = true;
                                }
                            });
                        });
                        range_plants.length = 0;
                        range_zombies.length = 0;
                        range_plants = null;
                        range_zombies = null;
                    }
                }));
            }
        }
    }
    onDrive() {
        (async () => {
            for (let i = 0; i < 60; i++) {
                await wait(0.04);
                let angle;

                let cycle = Math.floor(i / 12);
                let progress = (i % 12) / 11;

                if (cycle % 2 === 0) {
                    angle = -45 + (90 * progress);
                } else {
                    angle = 45 - (90 * progress);
                }

                Bullets.spawnBullet(this, "soul_fireball", {
                    "angle": angle
                });
            }

        })();
    }

    onAttack() {
        Bullets.spawnBullet(this,"soul_fireball",{
            "type": "MID"
        });
        SoundLoader.playSoundByVolume("fireball",0.4);
        //console.log("attacking!");
    }
    initCode() {}
}