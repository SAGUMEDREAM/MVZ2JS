import {Plant} from "/src/entity/Entity.js";
import {moveTo, moveTo_Timer, selectRange} from "../../util/Utils.js";
import {SoundLoader} from "../../sound/SoundLoader.js";

export class Piston extends Plant {
    launch = false;
    timer_s = 0;
    lock = false;
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onPlace() {
        this.loopTask.push(loop(0.1, () => {
            if(this.launch == true) {
                this.timer_s = this.timer_s + 0.1;
            }
            if(this.timer_s >= this.time) {
                this.timer_s = 0;
                this.launch = false;
            }
        }));
        this.loopTask.push(onUpdate(() => {
            if(this.entity_instance != null) {
                if(this.launch == true) {
                    this.entity_instance.play("normal");
                } else {
                    this.entity_instance.play("start");
                }
                if(this.launch == false) {
                    let x0 = this.entity_instance.pos.x;
                    let y0 = this.entity_instance.pos.y;
                    let vec = vec2(x0,y0);
                    let arr0 = selectRange(vec,100, "zombie");
                    if(arr0.length>0) {
                        if(this.lock) return;
                        this.lock = true;
                        wait(0.12,() => {
                            arr0 = selectRange(vec,100, "zombie");
                            let arr1 = [];
                            arr0.forEach(entity => {
                                if(entity.instance) {
                                    if(this.plbY == entity.instance.spawnLine && entity.boss_type != true) {
                                        arr1.push(entity);
                                    }
                                }
                            });
                            this.attack(arr1);
                        });
                    }
                }
            }
        }));
    }
    attack(arr) {
        let e;
        arr.forEach((entity) => {
            if(entity.is("gargoyle") || entity.is("gargoyle_statue")) {
                entity.instance.death();
            } else {
                let x0 = entity.pos.x;
                let y0 = entity.pos.y;
                let vec = vec2(x0+150,y0)
                moveTo_Timer(entity,vec,"easeOutCubic",2.5);
            }
            e = entity;
            this.launch = true;
        });
        if(e) SoundLoader.playSound("piston_out");
        this.lock = false;
    }
    define() {
        this.time = 15;
    }
}