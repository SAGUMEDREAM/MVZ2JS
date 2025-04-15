import kaplay from "/libs/kaplay.mjs"
import {Registries, Registry} from '/src/registry/Registry.js';
import {LanguageLoader, ResourcesLoader} from "/src/util/Loader.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {KaplayLogger, Constants} from "/src/client/Client.js";
import {ProfileManager} from "/src/util/GameProfile.js";
import {Scenes} from "/src/gui/Scenes.js";
import {ClassMapping} from "/src/util/ClassMapping.js";
import {Renderer} from "/src/client/Renderer.js";
import {WorldLevel} from "/src/level/WorldLevel.js";
import {detectDevice} from "/src/util/Utils.js";
import {ModLoader} from "/src/modloader/ModLoader.js";
import {MixinLoader} from "/src/modloader/mixin/MixinLoader.js";
import {IsoGrid} from "/plugins/IsoGridOpt.js";
import tiledImporter from "/plugins/tiledImporter.js";
import {shockwave} from "/plugins/shockwave.js";
import {commonLoadInit} from "/libs/yaml.js";
import {Worlds} from "/src/world/Worlds.js";
import {Items} from "/src/item/Items.js";
import {Crasher} from "/src/gui/ui/Crasher.js";
import componentBar from "../plugins/bar.js";
import MultitouchComponent from "../plugins/multitouch.js";
import {GargoyleStatue} from "./entity/zombie/GargoyleStatue.js";
import {GemStone} from "./item/GemStone.js";
import {Option} from "./gui/ui/Option.js";
import {Profiles} from "./gui/ui/Profiles.js";
import {LoseLevel} from "./gui/ui/LoseLevel.js";
import {Silvenser} from "./entity/plant/Silvenser.js";
import {Sword} from "./item/Sword.js";


export class Main {
    static kaboomInstance = null;
    resourcesLoader = null;
    languageLoader = null;
    soundLoader = null;
    textureLoader = null;
    modLoader = null;
    mixinLoader = null;

    constructor() {
        KaplayLogger.log("main", `Loading KaplayJS (KaboomJS) VERSION ${VERSION}`)
        KaplayLogger.log("main", `Loading Minecraft Vs Zombies II ${Constants.version}`)
        KaplayLogger.log("main", "The main stage is executing.")
        KaplayLogger.printf("main/WARN", "It's Open Source Minecraft Vs Zombies 2 JavaScript Edition");
        KaplayLogger.printf("main/WARN", "Original Work；上海アリス幻楽団 / Minecraft Vs. Zombies 2（Cuerzor58）/ Plants vs. Zombies（PopCap Games / Inc.）");
        KaplayLogger.printf("main/WARN", "This is a secondary/tertiary fan creation based on the original work 'Minecraft Vs. Zombies 2' and its fan derivatives.");
        KaplayLogger.printf("main/WARN", "Github：https://github.com/SAGUMEDREAM/MVZ2JS");
    }

    start() {
        this.mixinLoader = new MixinLoader();
        Constants.profileManager = new ProfileManager();
        KaplayLogger.printf("main/INFO", `Setting user: ${ProfileManager.manager.getData().username}`);
        Registries.unfreeze();
        Registries.init();
        this.soundLoader = new SoundLoader();
        this.resourcesLoader = new ResourcesLoader();
        this.languageLoader = new LanguageLoader();
        this.soundLoader.init();
        this.modLoader = new ModLoader();
        this.resourcesLoader.init(); //在这之前必须完成资源的注册
        this.languageLoader.init();
        Constants.language = "zh_cn";
        Constants.languageProvider = Registry.get(Registries.LANGUAGE, Constants.language);
        KaplayLogger.log("registry", `Number of registration items: ${Registries.getSizes()}`);
        window.option = new Option();
        window.profilesUI = new Profiles();
        window.loseLevel = new LoseLevel();
        window.option.init()
        window.profilesUI.init()
        window.cs = Constants;
        window.gs = Constants.gameState;
        window.htmlTool = Constants.HTMLTool;
        Renderer.renderingMain();
    }

    getClient() {
        return Main.kaboomInstance;
    }
}

const PC = {
    global: true,
    canvas: document.querySelector(".h5canvas"),
    font: "UrdType",
    background: [0, 0, 0,],
    backgroundAudio: true,
    scale: 0.5,
    width: 1280,
    height: 720,
    letterbox: true,
    stretch: true,
    crisp: true,
    pixelDensity: 4
}
const LAPTOP = {
    global: true,
    canvas: document.querySelector(".h5canvas"),
    font: "UrdType",
    background: [0, 0, 0,],
    backgroundAudio: true,
    scale: 0.5,
    width: 1280,
    height: 720,
    letterbox: true,
    stretch: true,
    crisp: true,
    pixelDensity: 4
};
export var gameThreadLock = false;
export var launcher = {};
try {
    if (gameThreadLock == false) {
        gameThreadLock = true;
        let device = detectDevice();
        if (device == 'Desktop') {
            launcher = PC;
        } else {
            launcher = LAPTOP;
        }
        Main.kaboomInstance = kaplay(launcher);
        commonLoadInit["used"] = true;
        plug(IsoGrid);
        plug(tiledImporter);
        plug(componentBar);
        plug(MultitouchComponent);
        const scenes = {
            index: () => {
                setCursor("auto");
                if (Scenes.SCENE != null) {
                    Scenes.SCENE().jump();
                    Scenes.SCENE = null;
                }
                createDebug();
            },
            n_index: () => {
                setCursor("auto");
                if (WorldLevel.currentWorldLevel != null) {
                    WorldLevel.currentWorldLevel.jump();
                }
                createDebug();
            },
            w_index: () => {
                setCursor("auto");
                if (Worlds.currentOpenedWorld != null) {
                    Worlds.currentOpenedWorld.jump();
                }
                createDebug();
            }
        }
        for (const key in scenes) {
            scene(key, scenes[key]);
        }
        Constants.mainClient = new Main();
        Constants.mainClient.start();
        KaplayLogger.log("main", "Game launch completed");
    }
} catch (err) {
    KaplayLogger.crash("main", "The game has crashed.");
    KaplayLogger.crash("main", err);
    console.error(err);
    let crasher = new Crasher();
    crasher.create(err);
}

function createDebug() {
    onMousePress(() => {
        if (Constants.debugMode) {
            let mousePos_ = mousePos();
            let mouseX = mousePos_.x.toFixed(1);
            let mouseY = mousePos_.y.toFixed(1);
            KaplayLogger.debug(mouseX + " / " + mouseY);
        }
    });
    onKeyPress("l", () => {
        if (Constants.debugMode) {
            Worlds.jumpToWorldLevel("level1_1");
        }
    });
    onKeyPress("a", () => {
        if (Constants.debugMode) {
            Registry.get(Registries.PLANT, "dispenser")(null);
        }
    });
    onKeyPress("s", () => {
        if (Constants.debugMode) {
            Registry.get(Registries.PLANT, "silvenser")(null);
        }
    });
    onKeyPress("d", () => {
        if (Constants.debugMode) {
            new Sword();
        }
    });
    onKeyPress("f", () => {
        if (Constants.debugMode) {
        }
    });
    onKeyPress("]", () => {
        if (Constants.debugMode) {
            //Items.spawnItem("dispenser");
            //GargoyleStatue.spawn(4,1);
            //new GemStone(100,100,1).spawn();
            Scenes.jumpTo("music_room");
        }
    });
    onKeyPress("z", () => {
        if (Constants.debugMode) {
            let z = Registry.get(Registries.ZOMBIE, "zombie")(1);
        }
    });
    onKeyPress("x", () => {
        if (Constants.debugMode) {
            let x = Registry.get(Registries.ZOMBIE, "cap_zombie")(1);
        }
    });
    onKeyPress("c", () => {
        if (Constants.debugMode) {
            let c = Registry.get(Registries.ZOMBIE, "iron_helmet_zombie")(1);
        }
    });
    onKeyPress("v", () => {
        if (Constants.debugMode) {
            let v = Registry.get(Registries.ZOMBIE, "necromancer")(1);
        }
    });
    onKeyPress("b", () => {
        if (Constants.debugMode) {
            let b = Registry.get(Registries.ZOMBIE, "skeleton")(1);
        }
    });
    onKeyPress("m", () => {
        if (Constants.debugMode) {
            Worlds.jumpToWorld("world1")
        }
    });
}