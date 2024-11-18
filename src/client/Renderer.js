import {Scenes} from "/src/gui/Scenes.js";
import {Registries} from "../registry/Registry.js";
import {Entities} from "../entity/Entities.js";

export class Renderer {
    static rl;
    static renderingMain() {
        Renderer.rl = loop(0.2,() => {
            if(Scenes.getScene("title") != null) {
                Scenes.jumpTo("title");
                Renderer.rl.cancel();
                Renderer.rl = null;
                Entities.fixWeights();
                Registries.freeze();
            }
        })
    }
}