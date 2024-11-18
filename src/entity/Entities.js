import {Plants} from "/src/entity/plant/Plants.js";
import {Zombie} from "/src/entity/Entity.js";
import {Zombies} from "/src/entity/zombie/Zombies.js";
import {Bosses} from "/src/entity/boss/Bosses.js";
import {Bullets} from "/src/entity/Bullets.js";
import {Constants} from "/src/client/Client.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {Registries} from "/src/registry/Registry.js";
import {ClassMapping} from "/src/util/ClassMapping.js";

export class Entities {
    static WEIGHTS_CODECS;
    static init() {
        Plants.init();
        Zombies.init();
        Bosses.init();
        Bullets.init();
    }
    static fixWeights() {
        let registryKeys = Array.from(Registries.ZOMBIE.getRegistry().keys());
        registryKeys.forEach(item => {
            if (!Constants.weights.has(item)) {
                Constants.weights.set(item, { cost: 100, weight: 1000 });
            }
        });
    }
}