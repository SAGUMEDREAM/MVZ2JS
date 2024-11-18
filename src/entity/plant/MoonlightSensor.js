import {Plant} from "/src/entity/Entity.js";
import {Redstone} from "/src/item/Redstone.js";
import {random, randomInt} from "/src/util/Math.js";
import {WorldLevel} from "../../level/WorldLevel.js";
import {Constants} from "../../client/Client.js";

export class MoonlightSensor extends Plant {
    timer_s = 0;
    fpr = 1;
    canProduce = false;
    growLock = false;
    constructor(source, object) {
        super(source, object);
        this.initPlant();
    }
    onPlace() {
        this.loopTask.push(loop(1, () => {
            if(this.growLock == false) {
                this.timer_s++
                if(this.timer_s>this.timer_const) {
                    this.growLock = true;
                    this.entity_instance.play("update");
                    this.fpr = 2;
                }
            }
        }));
        this.canProduce = function(){
            let cwl = WorldLevel.currentWorldLevel;
            if(cwl != null) {
                let level = cwl.getLevel();
                if(level != null) return !level.isDayTime();
                return true;
            }
            return true;
        }();
        this.loopTask.push(loop(1.25, () => {
            if(this.canProduce == true) {
                let s = Constants.gameState.getStat().getObj("redstone");
                Constants.gameState.getStat().setObj("redstone",(this.fpr + s));
            }
        }));
    }
    define() {
        this.timer_const = 0;
    }
}