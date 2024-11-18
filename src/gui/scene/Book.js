import {Scene} from "/src/gui/Scene.js";
import {Scenes} from "/src/gui/Scenes.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {Items} from "/src/item/Items.js";
import {ProfileManager} from "/src/util/GameProfile.js";
import {Text} from "/src/registry/LanguageProvider.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Worlds} from "/src/world/Worlds.js";
import {Levels} from "/src/level/Levels.js";

export class IBook extends Scene {
    constructor() {
        super();
    }

    jump() {
        this.almanac = document.querySelector(".almanac");
        this.catalog = this.almanac.querySelector(".catalog");
        this.details = this.almanac.querySelector(".details");
        this.catalog.innerHTML = "";
        this.readObject();
        htmlTool.display();
        this.almanac.style.display = "";
    }

    readObject() {
        let guiBackground = add([
            sprite("almanac"),
            pos(center()),
            anchor("center"),
            scale(1),
            opacity(1),
        ]);
        let arr0 = Array.from(Registries.PLANT.getRegistry().keys());
        let arr1 = ProfileManager.manager.getData()["game_data"]["plants"];
        let arr2 = arr0.filter(item => arr1.includes(item));
        arr2.forEach((item) => {
            let img = Items.PC_CARD_IMAGE_URL.get(item);
            this.addCard(item,img);
        });
        let c = 30 + 1  - 6;
        let r1 = arr0.length % c;
        if (r1 !== 0) {
            let n = c - r1;
            for (let i = 0; i < n; i++) {
                this.addCard("");
            }
        }
        this.almanacBackBtn = document.querySelector('.almanacBackBtn');
        this.almanacBackBtnClickHandler = function() {
            this.close();
        }.bind(this);
        this.almanacBackBtn.addEventListener('click', this.almanacBackBtnClickHandler);
    }

    addCard(registryId,img) {
        let div = document.createElement("div");
        div.className = "plant";
        if (img) {
            div.innerHTML = `<img src="${img}" draggable="false">`;
            div.addEventListener("click", () => {
                let codecsObject = Registries.CODECS.get(Registries.PLANT).get(registryId);
                let translationName = Text.translation(`${codecsObject["type"]}.${codecsObject["identifier"]}.name`);
                let translationDescription = Text.translation(`${codecsObject["type"]}.${codecsObject["identifier"]}.description`);
                let translationDescription2 = Text.translation(`${codecsObject["type"]}.${codecsObject["identifier"]}.description2`);
                let imgSrc = codecsObject["resources"]["display"];
                let qsd = document.querySelector(".details");
                let pn = qsd.querySelector("#almanac-name");
                let pi = qsd.querySelector("#almanac-image");
                let pd = qsd.querySelector("#almanac-description");
                let cdTimeStr = function () {
                    let cooldownTime = codecsObject["card"]["colddown_time"]
                    if (cooldownTime <= 5) {
                        return "快";
                    } else if (cooldownTime >= 10 && cooldownTime <= 15) {
                        return "中";
                    } else if (cooldownTime >= 20 && cooldownTime <= 25) {
                        return "慢";
                    } else if (cooldownTime >= 30 && cooldownTime <= 35) {
                        return "非常慢";
                    } else if (cooldownTime >= 45) {
                        return "极慢";
                    } else {
                        return "未知";
                    }
                }();
                let adStr = function () {
                    let ad = codecsObject["attacking_damage"];
                    if (ad < 20) {
                        return "低";
                    } else if (ad >= 20 && ad <= 30) {
                        return "中";
                    } else if (ad > 30 && ad <= 60) {
                        return "较高";
                    } else if (ad >= 80) {
                        return "高";
                    } else if (ad >= 550 && ad <= 1000) {
                        return "非常高";
                    } else if (ad >= 1200) {
                        return "极高";
                    } else {
                        return "未知";
                    }
                }();

                pn.innerHTML = Text.translation(`${translationName}`);
                pd.innerHTML = `${translationDescription}<br><br>
                伤害：${adStr}<br>
                花费：${codecsObject["card"]["redstone"]}<br>
                恢复时间：${cdTimeStr}<br><br>
                ${translationDescription2}
                `;
                pi.src = imgSrc;
                SoundLoader.playSound("click");
            });
        } else {
            div.innerHTML = `<img src="">`;
        }
        this.catalog.appendChild(div);
    }
    close() {
        this.almanacBackBtn.removeEventListener('click', this.almanacBackBtnClickHandler);
        SoundLoader.playSound("click");
        htmlTool.hidden();
        this.almanac.style.display = "none";
        Scenes.jumpTo("book_menu");
    }
}

export class MBook extends Scene {
    constructor() {
        super();
    }
    jump() {
        this.almanac = document.querySelector(".almanac");
        this.catalog = this.almanac.querySelector(".catalog");
        this.details = this.almanac.querySelector(".details");
        this.catalog.innerHTML = "";
        this.readObject();
        htmlTool.display();
        this.almanac.style.display = "";
    }
    readObject() {
        let guiBackground = add([
            sprite("almanac"),
            pos(center()),
            anchor("center"),
            scale(1),
            opacity(1),
        ]);
        let arr0 = Array.from(Registries.ZOMBIE.getRegistry().keys());
        arr0.forEach((item) => {
            let img = Items.PC_ZOMBIE_CARD_IMAGE_URL.get(item);
            this.addCard(item,img);
        });
        let c = 30 - 6;
        let r1 = arr0.length % c;
        if (r1 !== 0) {
            let n = c - r1;
            for (let i = 0; i < n; i++) {
                this.addCard("");
            }
        }
        this.almanacBackBtn = document.querySelector('.almanacBackBtn');
        this.almanacBackBtnClickHandler = function() {
            this.close();
        }.bind(this);
        this.almanacBackBtn.addEventListener('click', this.almanacBackBtnClickHandler);
    }
    addCard(registryId,img) {
        let div = document.createElement("div");
        div.className = "zombie";
        if (img) {
            div.innerHTML = `<img src="${img}" draggable="false">`;
            div.addEventListener("click", () => {
                let codecsObject = Registries.CODECS.get(Registries.ZOMBIE).get(registryId);
                let translationName = Text.translation(`${codecsObject["type"]}.${codecsObject["identifier"]}.name`);
                let translationDescription = Text.translation(`${codecsObject["type"]}.${codecsObject["identifier"]}.description`);
                let translationDescription2 = Text.translation(`${codecsObject["type"]}.${codecsObject["identifier"]}.description2`);
                let featureText = Text.translation(`${codecsObject["type"]}.${codecsObject["identifier"]}.feature`);
                let imgSrc = codecsObject["resources"]["display"];
                let qsd = document.querySelector(".details");
                let pn = qsd.querySelector("#almanac-name");
                let pi = qsd.querySelector("#almanac-image");
                let pd = qsd.querySelector("#almanac-description");
                let max_health = function () {
                    let sum = 0;
                    let health = codecsObject["max_health"] || 0;
                    let armor_health = codecsObject["armor_health"] || 0;
                    sum = health + armor_health;
                    return sum;
                }();
                let speed = codecsObject["moving_speed"] || 0;
                let mhStr = function () {
                    if(max_health<=100) {
                        return "极低";
                    } else if(max_health<=200) {
                        return "低";
                    } else if(max_health<=575) {
                        return "较低";
                    } else if(max_health<=1300) {
                        return "中等";
                    } else if(max_health<=1800) {
                        return "较高";
                    } else if(max_health<=3200) {
                        return "高";
                    } else if(max_health<=7800) {
                        return "极高";
                    } else if(max_health>=7800){
                        return "超高";
                    } else {
                        return "未知";
                    }
                }();
                let spStr = function () {
                    if(speed<=1) {
                        return "慢";
                    } else if(speed<=1.25) {
                        return "中等";
                    } else if(speed<=1.5) {
                        return "快";
                    } else if(speed<=2) {
                        return "极快";
                    } else {
                        return "未知";
                    }
                }();

                pn.innerHTML = Text.translation(`${translationName}`);
                pd.innerHTML = `${translationDescription}<br><br>
                耐久：${mhStr}<br>
                速度：${spStr}<br>
                特点：${featureText}<br><br>
                ${translationDescription2}
                `;
                pi.src = imgSrc;
                SoundLoader.playSound("click");
            });
        } else {
            div.innerHTML = `<img src="">`;
        }
        this.catalog.appendChild(div);
    }
    close() {
        cleanInfo();
        this.almanacBackBtn.removeEventListener('click', this.almanacBackBtnClickHandler);
        SoundLoader.playSound("click");
        htmlTool.hidden();
        this.almanac.style.display = "none";
        Scenes.jumpTo("book_menu");
    }
}
export class BookMenu extends Scene {
    constructor() {
        super();
    }
    jump() {
        if(Levels.MUSIC_PLAYER.NAME != "choose_your_seeds") {
            SoundLoader.stopSingleMusic();
            SoundLoader.playSingleMusic("choose_your_seeds");
        }
        this.almanac = document.querySelector(".almanac_menu");
        let guiBackground = add([
            sprite("almanac"),
            pos(center()),
            anchor("center"),
            scale(1),
            opacity(1),
        ]);
        this.almanacBackBtn = document.querySelector('#return-button1');
        this.wpBtn = document.querySelector('.check_weapon');
        this.moBtn = document.querySelector('.check_monster');
        this.almanacBackBtnClickHandler = function() {
            this.close();
        }.bind(this);
        this.jpToWHandler = function() {
            this.jumpTo("weapon");
        }.bind(this);
        this.jpToMHandler = function() {
            this.jumpTo("monster");
        }.bind(this);
        this.almanacBackBtn.addEventListener('click', this.almanacBackBtnClickHandler);
        this.wpBtn.addEventListener('click', this.jpToWHandler);
        this.moBtn.addEventListener('click', this.jpToMHandler);
        htmlTool.display();
        this.almanac.style.display = "";
    }
    jumpTo(cmdStr) {
        this.almanacBackBtn.removeEventListener('click', this.almanacBackBtnClickHandler);
        this.wpBtn.removeEventListener('click', this.jpToWHandler);
        this.moBtn.removeEventListener('click', this.jpToMHandler);
        htmlTool.hidden();
        this.almanac.style.display = "none";
        SoundLoader.playSound("click");
        switch (cmdStr) {
            case "weapon": {
                Scenes.jumpTo("book_i")
                break;
            }
            case "monster": {
                Scenes.jumpTo("book_m")
                break;
            }
        }
    }
    close() {
        cleanInfo();
        this.almanacBackBtn.removeEventListener('click', this.almanacBackBtnClickHandler);
        this.wpBtn.removeEventListener('click', this.jpToWHandler);
        this.moBtn.removeEventListener('click', this.jpToMHandler);
        SoundLoader.playSound("click");
        let game_data = ProfileManager.manager.getData()["game_data"];
        if(game_data != null) {
            SoundLoader.stopSingleMusic();
            if(game_data["has_map"] == true) {
                let cOpenedWorldId = Worlds.currentOpenedWorldId;
                if(cOpenedWorldId != null) {
                    Worlds.jumpToWorld(cOpenedWorldId);
                } else {
                    Worlds.jumpToWorld("world1");
                }
            } else {
                SoundLoader.playSingleMusic("grazy_dave");
                Scenes.jumpTo("menu_state0");
            }
        }
        htmlTool.hidden();
        this.almanac.style.display = "none";
    }
}
function cleanInfo() {
    let qsd = document.querySelector(".details");
    let pn = qsd.querySelector("#almanac-name");
    let pi = qsd.querySelector("#almanac-image");
    let pd = qsd.querySelector("#almanac-description");
    pn.innerHTML = Text.translation(``);
    pd.innerHTML = Text.translation(``);
    pi.src = "";
}