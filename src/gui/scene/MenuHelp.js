import {Scene} from "/src/gui/Scene.js";
import {Scenes} from "/src/gui/Scenes.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Levels} from "../../level/Levels.js";

export class MenuHelp extends Scene {
    constructor() {
        super();
    }
    jump() {
        let guiBackgroundInstance = add([
            sprite("help"),
            scale(1),
            opacity(0),
            z(12)
        ]);
        let menuBtn_instance = guiBackgroundInstance.add([
            sprite("MCButton"),
            pos(vec2(center().x,center().y+300)),
            anchor("center"),
            area(),
            scale(1,2.2),
            opacity(1),
            z(15)
        ]);
        let menuBtnText_instance = guiBackgroundInstance.add([
            text("返回主菜单", { font: "monospace" }),
            pos(vec2(center().x,center().y+300)),
            anchor("center"),
            area(),
            scale(0.7),
            opacity(1),
            z(18)
        ]);
        tween(
            guiBackgroundInstance.opacity,
            1,
            2,
            (val0) => guiBackgroundInstance.opacity = val0,
            easings["easeOutCubic"],
        )

        menuBtn_instance.onHoverUpdate(() => {
            setCursor("pointer");
            menuBtn_instance.color = hsl2rgb(0.6, 0.6, 0.8)
        })
        menuBtn_instance.onHoverEnd(() => {
            setCursor("auto");
            menuBtn_instance.color = rgb()
        })
        menuBtn_instance.onClick(() => {
            Levels.MUSIC_PLAYER = SoundLoader.playSingleMusic("grazy_dave");
            setCursor("auto");
            SoundLoader.playSound("click");
            Scenes.jumpTo("menu_state0");
        });
    }
}