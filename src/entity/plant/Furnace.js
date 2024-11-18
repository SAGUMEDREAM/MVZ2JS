import {Plant} from "/src/entity/Entity.js";
import {Redstone} from "/src/item/Redstone.js";
import {random, randomInt} from "/src/util/Math.js";
import {selectRange} from "../../util/Utils.js";
export class Furnace extends Plant {
    timer_s = 0;
    timer_const = 0;
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    makeRedstone() {
        return new Redstone(1,true, this.plbX, this.plbY);
    }
    onDrive() {
        (async () => {
            for (let i = 0; i < 12; i++) {
                await wait(0.2);
                this.makeRedstone();
            }
        })();
    }
    onPlace() {
        this.entity_instance.play("start");
        this.timer_const = random(3,12.5);
        this.loopTask.push(loop(1, () => {
            this.timer_s++
        }));
        this.loopTask.push(onUpdate(() => {
            if(this.timer_s >= this.timer_const) {
                this.timer_s = 0;
                this.timer_const = random(24,26);
                this.makeRedstone();
            }
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