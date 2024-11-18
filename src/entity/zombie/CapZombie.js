import {Zombie} from "/src/entity/Entity.js";

export class CapZombie extends Zombie {
    armorInstance;
    constructor(codecObject, line) {
        super(codecObject, line);
        this.initZombie();
    }
    initCode() {
        let vec = vec2(-30,-50);
        this.armorInstance = this.entity_instance.add([
            sprite("caps"),
            pos(vec),
            scale(1),
            opacity(1.0),
            area(),
            z(9),
            state("s0", ["s0","s1","s2"]),
        ]);
        this.entity_instance.play("walking");
        this.loopTask.push(onUpdate(() => {
            if(this.armorInstance != null) {
                if(this.armor_health <= 125) {
                    this.armorInstance.play("s2");
                } else if(this.armor_health <= 248) {
                    this.armorInstance.play("s1");
                } else {
                    this.armorInstance.play("s0");
                }
                if(this.armor_health <= 0) {
                    this.soundDamage = ["hit1","hit2","hit3"];
                    destroy(this.armorInstance);
                    this.armorInstance = null;
                }
            }
        }));
    }
    onCollidePlant() {
        this.entity_instance.play("attacking");
    }
    onCollideEndPlant() {
        this.entity_instance.play("walking");
    }
    onDeath() {
        this.entity_instance.play("death");
    }
}