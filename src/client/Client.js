import kaboom from "/libs/kaboom.mjs";
import {GameState} from "/src/util/GameState.js";
import {detectDevice} from "/src/util/Utils.js";
import {HTMLTool} from "/src/util/HTMLTool.js";
import {Option} from "/src/gui/ui/Option.js";
import {Crasher} from "../gui/ui/Crasher.js";
import {ESC} from "../gui/ui/ESC.js";
import {LoseLevel} from "../gui/ui/LoseLevel.js";
import {Profiles} from "../gui/ui/Profiles.js";
export class Constants {
    static debugMode = true;
    static mainClient = null;
    static language = null;
    static languageProvider = null;
    static device = null;
    static profileManager = null;
    static defaultPlant = ["dispenser","furnace","obsidian","mine_tnt"];
    static level = () => {};
    static entityInstance = [];
    static bulletInstance = [];
    static gameState = new GameState();
    static blockPosMap = new Map();
    static weights = new Map();
    static modLoader = null;
    static isClient = true;
    static HTMLTool = new HTMLTool();
    static version = "0.0.1";
    static data_version = 1;
    static {
        {
            let deviceType = detectDevice();
            if(deviceType == 'Desktop') {
                Constants.device = "desktop";
            } else {
                Constants.device = "laptop";
            }
        }
        document.querySelector('.app').addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

    }
}
export class KaplayLogger {
    static KaboomClient = "KaplayClient";
    static Debugger = "Debugger";
    static Logger = [];
    static printf(logger,message) {
        let string = `[${KaplayLogger.getTime()}] [${logger}] ${message}`;
        console.log(string);
        KaplayLogger.Logger.push(string);
    };
    static log(logger,message) {
        let string = `[${KaplayLogger.getTime()}] [${logger}/INFO] ${message}`;
        console.log(string);
        KaplayLogger.Logger.push(string);
    };
    static debug(message) {
        let string = `[${KaplayLogger.getTime()}] [${KaplayLogger.Debugger}/INFO] ${message}`
        console.log(string);
        KaplayLogger.Logger.push(string);
    };
    static error(logger,message) {
        let string = `[${KaplayLogger.getTime()}] [${logger}/ERROR] ${message}`;
        console.log(string);
        KaplayLogger.Logger.push(string);
    };
    static warn(logger,message) {
        let string = `[${KaplayLogger.getTime()}] [${logger}/WARN] ${message}`;
        console.warn(string);
        KaplayLogger.Logger.push(string);
    };
    static crash(logger,message) {
        let string = `[${KaplayLogger.getTime()}] [${logger}/CRASHED] ${message}`;
        console.error(string);
        KaplayLogger.Logger.push(string);
    }
    static getTime() {
        let date = new Date();
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
}