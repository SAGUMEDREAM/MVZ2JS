import {Scene} from "/src/gui/Scene.js";
import {Dialogs} from "/src/level/Dialogs.js";
import {addButton} from "/src/util/Button.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Worlds} from "/src/world/Worlds.js";

export class Paper0 extends Scene {
    constructor() {
        super();
    }
    jump() {
        let dialog = Dialogs.runDialog("level0_1_end");
        add([
            sprite("gsk_paper"),
            pos(center()),
            scale(1),
            opacity(1),
            anchor("center"),
            area(),
        ]);
        dialog.setCall(
            () => {
                let [btn, btnStr] = addButton("MCButton",vec2(center().x,center().y+300),"继续");
                btn.onClick(() => {
                    setCursor("auto");
                    SoundLoader.playSound("click");
                    Worlds.jumpToWorldLevel("level1_1");
                })
            }
        ).run();
    }
}