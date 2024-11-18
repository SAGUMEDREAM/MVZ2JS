import {Zombie} from "/src/entity/Entity.js";
import {BoneWall} from "/src/entity/zombie/BoneWall.js";

export class Necromancer extends Zombie {
    timer0 = 0;
    max_timer0 = 110;
    constructor(codecObject, line) {
        super(codecObject, line);
        this.initZombie();
    }
    initCode() {
        this.entity_instance.play("walking");
        let boneWall = BoneWall.spawn(this.entity_instance.pos.x-150,this.entity_instance.pos.y-15);
        boneWall.spawnLine = this.spawnLine;
        this.loopTask.push(loop(0.1,() => {
            this.timer0++;
        }));
        this.loopTask.push(onUpdate(() => {
            if(this.timer0>this.max_timer0) {
                this.timer0 = 0;
                let boneWall = BoneWall.spawn(this.entity_instance.pos.x-100,this.entity_instance.pos.y-15);
                boneWall.spawnLine = this.spawnLine;
            }
        }));
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