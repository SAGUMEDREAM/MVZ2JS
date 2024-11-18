import {Zombie} from "/src/entity/Entity.js";
import {Bullets} from "../Bullets.js";
import {SoundLoader} from "../../sound/SoundLoader.js";
import {Arrow0} from "../bullet/Arrow0.js";

export class Skeleton extends Zombie {
    moving_tick = 0;
    attacking_tick = 0;
    existTarget = false;

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
        let vec = vec2(-41,-40);
        this.weaponInstance = this.entity_instance.add([
            sprite("bow"),
            pos(vec),
            scale(0.8),
            opacity(1.0),
            area(),
            z(9),
        ]);
        this.loopTask[0] = loop(0.1, () => {
            if(this.moving_tick < 70) this.moving_tick++;
            if(this.existTarget == true) this.attacking_colddown++;
        });
        this.loopTask[1] = onUpdate(() => {
            this.existTarget = false;
            let plants = get("plant");
            plants.forEach((plant) => {
                if(plant.instance != null) if(plant.instance.entity_instance != null) if(plant.instance.isDisplayMode == false) {
                    if(plant.vector.isIn(2) && plant.instance.plbY == this.spawnLine) if(this.entity_instance.pos.x >= plant.pos.x) {
                        this.existTarget = true;
                    }
                }
            });

            if(this.existTarget == true) {
                if(this.moving_tick >= 70) {
                    this.attack(null);
                    if(this.entity_instance.state != "normal") {
                        this.entity_instance.state = "normal";
                        this.entity_instance.play("normal");
                    }
                } else {
                    if(this.entity_instance != null) if(this.entity_instance.pos != null) {
                        this.entity_instance.pos.x -= (this.moving_speed * 0.097);
                    }
                }
            } else {
                if(this.entity_instance != null) if(this.entity_instance.pos != null) {
                    this.entity_instance.pos.x -= (this.moving_speed * 0.097);
                }
                if(this.entity_instance.state != "walking") {
                    this.entity_instance.state = "walking";
                    this.entity_instance.play("walking");
                }
            }
        });
        this.entity_instance.play("walking");
    }
    attack() {
        if(this.attacking_colddown > this.attacking_colddown_timer - 2) {
            this.attacking_colddown = 0;
            Bullets.spawnBullet(this,"arrow0",{})
        }
    }

    onCollidePlant() {
        //this.entity_instance.play("attacking");
    }
    onCollideEndPlant() {
        //this.entity_instance.play("walking");
    }
    onDeath() {
        //this.entity_instance.play("death");
    }
}