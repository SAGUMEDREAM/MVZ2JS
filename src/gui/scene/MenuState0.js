import {Scene} from "/src/gui/Scene.js";
import {Scenes} from "/src/gui/Scenes.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Levels} from "../../level/Levels.js";
import {ProfileManager} from "../../util/GameProfile.js";
import {moveCameraTo} from "../../util/Utils.js";
export class MenuState0 extends Scene {
    guiBackground;
    guiBackground2;
    eventArray = [];
    constructor() {
        super();
    }
    jump() {
        if(Levels.MUSIC_PLAYER != null) if(Levels.MUSIC_PLAYER.NAME != "grazy_dave") {
            SoundLoader.playSingleMusic("grazy_dave");
        }
        this.guiBackground = add([
            sprite("game_menu"),
            pos(center()),
            anchor("center"),
            scale(1),
            opacity(1),
            area(),
        ]);
        this.guiBackground2 = add([
            sprite("game_menu2"),
            pos(vec2(center().x,center().y*3+44)),
            anchor("center"),
            scale(1),
            opacity(1),
            area(),
        ]);
        // MainIndex
        let adventure_mode = this.createBtn("game_menu/adventure_mode",vec2(133,-213),"");
        let almanac = this.createBtn("game_menu/almanac",vec2(-379,200.5),"almanac");
        let change_name = this.createBtn("game_menu/change_name",vec2(-258.5,-207.5),"profile");
        let exit = this.createBtn("game_menu/exit",vec2(0,306.5),"exit");
        let help = this.createBtn("game_menu/help",vec2(259.5,111),"help");
        let iframe = this.createBtn("game_menu/iframe",vec2(7.5,-206),"adventure_mode");
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
        // MainIndexBottom
        let achievement = this.createBtn2("game_menu/achievement",vec2(314.5,74.5),"achievement");
        let archives = this.createBtn2("game_menu/archives",vec2(-312,73),"archives");
        let back = this.createBtn2("game_menu/back",vec2(1,-222),"back");
        let music_room = this.createBtn2("game_menu/music_room",vec2(1.5,75.5),"music_room");

        this.eventArray.push(
            onUpdate(() => {
                let profile = ProfileManager.manager;
                let profileName = profile.getData()["username"];
                let data = profile.getData()["game_data"];
                let has_map = data["has_map"];
                let has_book = data["has_book"];
                let has_music_room = data["has_music_room"];
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
                if(has_music_room) {

                } else {

                }
            })
        );

        [adventure_mode,almanac,change_name,exit,help,iframe,more,option,shop,version,your_name_is,achievement,archives,back,music_room].forEach(btn => {
            if(btn.type != null && btn.type != "") {
                btn.onHoverUpdate(() => {
                    if(btn.allow_click) {
                        setCursor("pointer");
                        btn.color = hsl2rgb(0.6, 0.6, 0.8);
                    }
                });
                btn.onHoverEnd(() => {
                    if(btn.allow_click) {
                        setCursor("auto");
                        btn.color = rgb();
                    }
                });
            }
            btn.onClick(() => {
                switch (btn.type) {
                    case "adventure_mode": {
                        SoundLoader.stopSingleMusic();
                        Scenes.jumpTo("menu_state1");
                        break;
                    }
                    case "almanac": {
                        if(btn.allow_click) {
                            SoundLoader.playSound("book_menu");
                            Scenes.jumpTo("book_menu");
                        }
                        break;
                    }
                    case "help": {
                        SoundLoader.playSound("paper");
                        SoundLoader.stopSingleMusic();
                        Scenes.jumpTo("menu_help");
                        break;
                    }
                    case "profile": {
                        SoundLoader.playSound("click");
                        window.profilesUI.display();
                        break;
                    }
                    case "more": {
                        SoundLoader.playSound("click");
                        moveCameraTo(vec2(0,-764),"easeOutCubic",0.75);
                        break;
                    }
                    case "option": {
                        SoundLoader.playSound("click");
                        window.option.display();
                        break;
                    }
                    case "exit": {
                        SoundLoader.playSound("click");
                        let conf = confirm("您确定要退出游戏？");
                        if(conf) window.close();
                        break;
                    }
                    case "achievement": {
                        SoundLoader.playSound("click");
                        break;
                    }
                    case "archives": {
                        SoundLoader.playSound("click");
                        break;
                    }
                    case "back": {
                        SoundLoader.playSound("click");
                        moveCameraTo(vec2(0,764),"easeOutCubic",0.75);
                        break;
                    }
                    case "music_room": {
                        SoundLoader.playSound("click");
                        Scenes.jumpTo("music_room");
                        break;
                    }
                }
            })
        });
        //console.log([startGame,sign_help,sign_option,sign_more]);
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
                type: type,
                allow_click: true
            }
        ]);
    }
    createBtn2(img,vec,type) {
        return this.guiBackground2.add([
            sprite(img),
            pos(vec),
            anchor("center"),
            scale(1),
            opacity(1),
            area(),
            {
                type: type,
                allow_click: true
            }
        ]);
    }
}