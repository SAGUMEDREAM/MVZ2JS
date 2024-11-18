import {WorldLevel} from "/src/level/WorldLevel.js";
import {Worlds} from "/src/world/Worlds.js";
import {Scenes} from "/src/gui/Scenes.js";
import {choose} from "/src/util/Utils.js";
import {SoundLoader} from "../../sound/SoundLoader.js";

export class LoseLevel {
    documentTarget;
    targetLstRestart;
    targetLstBackMap;
    static TEXT_ARR = [
        "那可是一次激烈的战斗",
        "哦不！看来怪物今天赢了一局。",
        "你已经离胜利不远了！",
        "你将成为我们中的一员。",
        "脑子是好的，但不是每个人都有",
        "换个膝盖吧。",
        "被打死了！",
        "亲爱的日记：今天我死了。",
        "老兄，你也是这一道的？",
        "我们现在，都一样了。",
        "没有死亡能束缚我！没有死亡能束缚我！",
        "从此他们幸福的生活在了一起。",
        "兄弟你家里有电脑啊？",
        "兄弟你好香",
        "我们明年再见"
    ];
    constructor() {
    }
    init() {
        this.documentTarget = document.querySelector(".loseLevelMenu");
        this.targetLstRestart = document.querySelector(".lstRestart");
        this.targetLstBackMap = document.querySelector(".lstBackMap");
        this.LoseText = document.querySelector(".LT2");
        this.LoseText.innerHTML = `${choose(LoseLevel.TEXT_ARR)}<br>`
        this.restartHandler = function () {
            SoundLoader.playSound("click");
            let worldLevelIdentifier = WorldLevel.currentWorldLevelIdentifier;
            if(worldLevelIdentifier != null) {
                Worlds.jumpToWorldLevel(worldLevelIdentifier);
            } else {
                Scenes.jumpTo("menu_state0");
            }
            this.hidden();
        }.bind(this);
        this.backMapHandler = function () {
            SoundLoader.playSound("click");
            let cOpenedWorldId = Worlds.currentOpenedWorldId;
            if(cOpenedWorldId != null) {
                Worlds.jumpToWorld(cOpenedWorldId);
            } else {
                Scenes.jumpTo("menu_state0");
            }
            this.hidden();
        }.bind(this);
        this.targetLstRestart.addEventListener('click', this.restartHandler);
        this.targetLstBackMap.addEventListener('click', this.backMapHandler);
        this.display();
    }
    display() {
        htmlTool.display();
        this.documentTarget.style.display = "";
    }
    hidden() {
        this.targetLstRestart.removeEventListener('click', this.restartHandler);
        this.targetLstBackMap.removeEventListener('click', this.backMapHandler);
        htmlTool.hidden();
        this.documentTarget.style.display = "none";
    }
}