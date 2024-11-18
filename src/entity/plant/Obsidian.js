import {Plant} from "/src/entity/Entity.js";
import {isInRange} from "/src/util/Math.js";

export class Obsidian extends Plant {
    isBall = false;
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onDrive() {
        this.health = this.stage5;
    }
    onPlace() {
        this.entity_instance.play("s1");
        this.health = this.max_health;
        if(this.isBall == false) {
            this.loopTask.push(onUpdate(() => {
                if(isInRange(-Infinity,this.health,this.stage0)) {
                    this.entity_instance.play("s2");
                } else if(isInRange(this.stage0,this.health,this.stage1)) {
                    this.entity_instance.play("s1");
                } else if(isInRange(this.stage1,this.health,this.stage2)) {
                    this.entity_instance.play("s0");
                } else if(isInRange(this.stage2,this.health,this.stage3)) {
                    this.entity_instance.play("s5");
                } else if(isInRange(this.stage3,this.health,this.stage4)) {
                    this.entity_instance.play("s4");
                } else if(isInRange(this.stage4,this.health,this.stage5)) {
                    this.entity_instance.play("s3");
                } else {
                    this.entity_instance.play("s3");
                }
            }));
        } else {
            this.canIgnoring = true;
        }
    }
    define() {
        this.stage5 = 4000+4000;
        this.stage4 = 4000+2666;
        this.stage3 = 4000+1333;
        this.stage2 = 4000;
        this.stage1 = 2666;
        this.stage0 = 1333;
    }
}