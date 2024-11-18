import {Item} from "/src/item/Item.js";
import {free, moveTo, scaleTo} from "/src/util/Utils.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Constants} from "/src/client/Client.js";
import {ProfileManager} from "/src/util/GameProfile.js";
import {randomInt} from "/src/util/Math.js";

export class GemStone extends Item {
    texture;
    value = 0;
    itemInstance;
    eventArray = [];
    lock = false;
    constructor(x,y,type) {
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        switch (this.type) {
            case 0: this.texture = "emerald";       this.value = 10;    break;
            case 1: this.texture = "ruby";          this.value = 50;    break;
            case 2: this.texture = "gold_emerald";  this.value = 100;   break;
            case 3: this.texture = "diamond";       this.value = 1000;  break;
        }
    }
    spawn() {
        if(this.texture == null) return;
        this.itemInstance = add([
            sprite(`${this.texture}`),
            pos(vec2(this.x,this.y)),
            anchor("center"),
            scale(0.2),
            opacity(1.0),
            color(255, 255, 255),
            z(15),
            area(),
            "emerald",
            {
                instance: this
            }
        ]);
        scaleTo(this.itemInstance,1.0,0.5,null);
        this.eventArray[0] = this.itemInstance.onClick(() => {
            this.getClick();
        });
        SoundLoader.playSound("money_fall");
        let ranX = randomInt(-14,14) +  this.itemInstance.pos.x;
        let ranY = randomInt(+5,13) + this.itemInstance.pos.y;
        moveTo(this.itemInstance, vec2(ranX,ranY), "easeOutCubic");
        return this;
    }
    getClick() {
        if(this.lock == false) {
            this.lock = true;
            SoundLoader.playSound("coin");
            moveTo(this.itemInstance, vec2(150, 698), "easeOutCubic");
            let pfc = ProfileManager.manager.getData()["game_data"]["currency"];
            ProfileManager.manager.getData()["game_data"]["currency"] = pfc + this.value;
            wait(0.75, () => {
                this.endThread();
            });
        }
    }
    endThread() {
        if(this.itemInstance != null) destroy(this.itemInstance);
        this.eventArray.forEach(item => {
            if(item.cancel) {
                item.cancel();
            }
        });
        if(this.eventArray.length) this.eventArray.length = 0;
        free(this);
    }

}