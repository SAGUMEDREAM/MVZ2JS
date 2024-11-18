import {Zombie} from "/src/entity/Entity.js";

export class FlagZombie extends Zombie {
    constructor(codecObject, line) {
        super(codecObject, line);
        this.initZombie();
    }
    initCode() {
        this.entity_instance.play("walking");
        let vec = vec2(-41,-50);
        this.flagInstance = this.entity_instance.add([
            sprite("flag"),
            pos(vec),
            scale(1),
            opacity(1.0),
            area(),
            z(6),
            state("s0", ["s0","s1"]),
        ]);
        this.loopTask.push(onUpdate(() => {
            if(this.flagInstance != null) {
                if(this.health <= 0) {
                    destroy(this.flagInstance);
                    this.flagInstance = null;
                } else if(this.health <= 100) {
                    this.flagInstance.play("s1");
                } else {
                    this.flagInstance.play("s0");
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