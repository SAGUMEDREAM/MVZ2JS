import {ProfileManager} from "/src/util/GameProfile.js";

export class GemBar {
    uiInstance;
    uiTextInstance;
    eventArray = [];
    constructor() {
    }
    init() {
        let vecConst = vec2(150, 698);
        this.uiInstance = add([
            sprite("gem_bar"),
            pos(vecConst),
            anchor("center"),
            scale(1.25)
        ]);
        this.uiTextInstance = this.uiInstance.add([
            text("", { size: 15, font: "monospace" }),
            pos(vec2(10,0)),
            anchor("center"),
            scale(1.0)
        ]);
        this.eventArray.push(onUpdate(() => {
            if(this.uiTextInstance != null) {
                this.uiTextInstance.text = `${GemBar.getCurrency()}`;
            }
        }));
    }
    static getCurrency() {
        return ProfileManager.manager.getData()["game_data"]["currency"];
    }
}