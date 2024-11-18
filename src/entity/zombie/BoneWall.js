import {Zombie} from "/src/entity/Entity.js";
import {getBlock, scaleTo} from "/src/util/Utils.js";
import {Registries, Registry} from "/src/registry/Registry.js";

export class BoneWall extends Zombie {
    constructor(codecObject, line, spawnX, spawnY) {
        super(codecObject, line);
        this.initZombie();
        this.spawnTo(spawnX, spawnY);
    }
    initCode() {
        wait(8,() => {
            if(this.entity_instance != null) {
                this.endThread();
            }
        });
    }
    static spawn(x,y) {
        let codecsObject = Registries.getCodec(Registries.ZOMBIE,"bone_wall");
        if(codecsObject != null) {
            let boneWall = new BoneWall(codecsObject,"ALL",x,y);
            scaleTo(boneWall.entity_instance,1.0,0.75,"easeOutCubic");
            return boneWall;
        }
    }
}