import {Scene} from "/src/gui/Scene.js";
import {Scenes} from "/src/gui/Scenes.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {Levels} from "/src/level/Levels.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {moveTo, scaleTo} from "../../util/Utils.js";

export class Title extends Scene{
    constructor() {
        super();
    }
    jump() {
        Levels.MUSIC_PLAYER = SoundLoader.playSingleMusic("grazy_dave");
        let guiBackground = add([
            sprite("game_title"),
            scale(1.15),
            pos(center()),
            anchor("center"),
            opacity(1),
        ]);
        let guiTitle = add([
            sprite("minecraft_title"),
            pos(vec2(center().x,center().y-600)),
            anchor("center"),
            scale(0.9),
            opacity(1),
        ]);
        let button = add([
            sprite("MCButton_StartGame"),
            pos(vec2(center().x,center().y+600)),
            anchor("center"),
            scale(2.5),
            opacity(1),
            area(),
        ]);
        scaleTo(guiBackground,1.0,1.25,"easeOutCubic");
        moveTo(guiTitle,vec2(center().x,center().y-200),"easeOutCubic");
        moveTo(button,vec2(center().x,center().y+300),"easeOutCubic");
        button.onHoverUpdate(() => {
            button.scale = vec2(2.4995);
            button.color = hsl2rgb(0.6, 0.6, 0.8);
            setCursor("pointer");
        })
        button.onHoverEnd(() => {
            button.scale = vec2(2.5);
            button.color = rgb();
            setCursor("auto");
        })
        button.onClick(() => {
            setCursor("auto");
            SoundLoader.playSound("click");
            Scenes.jumpTo("menu_state0");
        })
    }
}