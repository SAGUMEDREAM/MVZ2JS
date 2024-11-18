import {Zombie} from "/src/entity/Entity.js";

export class NZombie extends Zombie {
    constructor(codecObject, line) {
        super(codecObject, line);
        this.initZombie();
    }
    initCode() {
        this.entity_instance.play("walking");
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