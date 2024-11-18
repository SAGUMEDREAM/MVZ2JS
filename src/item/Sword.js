import {Item} from "/src/item/Item.js";
import {selectRange} from "/src/util/Utils.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";

export class Sword extends Item {
    itemInstance;
    constructor() {
        super("sword");
        this.init();
    }
    init() {
        this.itemInstance = add([
            pos("center"),
            sprite("sword"),
            area(),
            scale(2),
            rotate(45),
            anchor("center"),
            z(18)
        ]);
        this.itemInstance.onUpdate(() => {
            if(isset(this.itemInstance)) {
                this.itemInstance.pos = mousePos();
            }
        });
        this.itemInstance.onClick(async () => {
            if(isset(this.itemInstance)) this.itemInstance.angle = -45;
            let arr = selectRange(this.itemInstance.pos,50,"zombie")
            if(isset(arr)) if(isset(arr[0])) {
                let entity = arr[0];
                if(entity.instance != null) {
                    entity.instance.damageBy(null,200,false,null);
                }
            }
            SoundLoader.playSound("swing");
            await this.anim(0.05,-35);
            await this.anim(0.03,-20);
            await this.anim(0.03,-4);
            await this.anim(0.01,0);
            await this.anim(0.01,5);
            await this.anim(0.01,18);
            await this.anim(0.02,20);
            await this.anim(0.03,36);
            await this.anim(0.03,45);
        });
    }
    anim(t = 0.1,a = 0) {
        wait(t,() => {
            if(isset(this.itemInstance)) {
                this.itemInstance.angle = a;
            }
        });
    }
}