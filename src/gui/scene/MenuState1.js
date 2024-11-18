import {Scene} from "/src/gui/Scene.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Constants} from "/src/client/Client.js";
import {Scenes} from "/src/gui/Scenes.js";
import {World} from "/src/world/World.js";
import {Worlds} from "/src/world/Worlds.js";
import {ProfileManager} from "/src/util/GameProfile.js";

export class MenuState1 extends Scene {
    guiBackground;
    eventArray = [];
    constructor() {
        super();
    }
    jump() {
        this.guiBackground = add([
            sprite("game_menu_night"),
            pos(center()),
            anchor("center"),
            scale(1),
            opacity(1),
        ]);
        let adventure_mode = this.createBtn("game_menu/adventure_mode",vec2(133,-213),"");
        let almanac = this.createBtn("game_menu/almanac",vec2(-379,200.5),"almanac");
        let change_name = this.createBtn("game_menu/change_name",vec2(-258.5,-207.5),"");
        let exit = this.createBtn("game_menu/exit",vec2(0,306.5),"exit");
        let help = this.createBtn("game_menu/help",vec2(259.5,111),"help");
        //let iframe = this.createBtn("game_menu/iframe",vec2(7.5,-206),"adventure_mode");
        let more = this.createBtn("game_menu/more",vec2(0.5,41.5),"more");
        let option = this.createBtn("game_menu/option",vec2(-254.5,109.5),"option");
        let shop = this.createBtn("game_menu/shop",vec2(375,202.5),"");
        let version = this.createBtn("game_menu/version",vec2(256,-211),"");
        let your_name_is = this.createBtn("game_menu/your_name_is",vec2(-129.5,-234.5),"");
        let name = this.guiBackground.add([
            text("", { size: 30, font: "monospace" }),
            pos(vec2(-129.5,-210.5)),
            anchor("center"),
            color(0,0,0),
            scale(1),
            opacity(1),
            area(),
        ]);
        this.eventArray.push(
            onUpdate(() => {
                let profile = ProfileManager.manager;
                let profileName = profile.getData()["username"];
                let data = profile.getData()["game_data"];
                let has_map = data["has_map"];
                let has_book = data["has_book"];
                let has_shop = data["has_shop"];
                if(profileName != null) {
                    name.text = profileName;
                }
                if(has_book) {
                    almanac.opacity = 1;
                    almanac.allow_click = true;
                } else {
                    almanac.opacity = 0;
                    almanac.allow_click = false;
                }
                if(has_shop) {
                    shop.opacity = 1;
                    shop.allow_click = true;
                } else {
                    shop.opacity = 0;
                    shop.allow_click = false;
                }
            })
        );
        let profile = ProfileManager.manager;
        let profileName = profile.getData()["username"];
        if(profileName != null) {
            name.text = profileName;
        }
        SoundLoader.playSound("lose");
        wait(4.5, () => {
            this.startGame();
        });
    }
    createBtn(img,vec,type) {
        return this.guiBackground.add([
            sprite(img),
            pos(vec),
            anchor("center"),
            scale(1),
            opacity(1),
            area(),
            {
                type: type
            }
        ]);
    }
    startGame() {
        if(this.hasMap()) {
            Worlds.jumpToWorld("world1");
        } else {
            Worlds.jumpToWorldLevel("level0_1");
        }
    }
    hasMap() {
        let game_data = ProfileManager.manager.getData()["game_data"];
        if(game_data != null) {
            return game_data["has_map"] == true;
        }
        return false;
    }
}