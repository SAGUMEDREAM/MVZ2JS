import {Plant} from "/src/entity/Entity.js";
import {selectRange} from "/src/util/Utils.js";

export class Glowstone extends Plant {
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onPlace() {
        this.loopTask.push(onUpdate(() => {
            if(this.entity_instance != null) {
                let range_plants = selectRange(this.entity_instance.pos,200,"plant");
                let range_zombies = selectRange(this.entity_instance.pos,200,"zombie");
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