import {Zombie} from "/src/entity/Entity.js";
import {getBlock} from "/src/util/Utils.js";
import {Registries, Registry} from "/src/registry/Registry.js";

export class GargoyleStatue extends Zombie {
    spawnX;
    spawnY;
    constructor(codecObject, line, spawnX, spawnY) {
        super(codecObject, line);
        this.initZombie();
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.spawnToBlock(this.spawnX,this.spawnY);
        let block = getBlock(this.spawnX, this.spawnY);
        if(block != null) block["instance"].canPlace = false;
    }
    initCode() {}
    releaseGargoyleStatue() {
        let gargoyle = Registry.get(Registries.ZOMBIE, "gargoyle")(this.spawnY+1);
        gargoyle.spawnToBlock(this.spawnX,this.spawnY);
        this.death();
    }
    onDeath() {
        let block = getBlock(this.spawnX, this.spawnY);
        if(block != null) block["instance"].canPlace = true;
    }
    static spawn(x,y) {
        let codecsObject = Registries.getCodec(Registries.ZOMBIE,"gargoyle_statue");
        if(codecsObject != null) {
            return new GargoyleStatue(codecsObject,y+1,x,y);
        }
    }
}