import {Zombie} from "/src/entity/Entity.js";

export class Mummy extends Zombie {
    constructor(codecObject, line) {
        super(codecObject, line);
        this.initZombie();
    }
    damageBy(source, value, mute, isSourceTarget) {
        if(this.isDisplayMode == true) return;
        if(source == null) {
            this.damage(source,value,mute);
            return;
        }
        let object_attribute = source.object_attribute;
        if(object_attribute.getType() == "FIRE") {
            super.damageBy(source, value*4, mute, isSourceTarget);
        } else {
            super.damageBy(source, value, mute, isSourceTarget);
        }
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