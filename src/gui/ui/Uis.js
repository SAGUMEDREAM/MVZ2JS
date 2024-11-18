import {Constants} from "/src/client/Client.js";

export class Uis {
    static uiThread = [];
    static uiTaskThread = [];
    static createEnergyUI() {
        let d = 150;
        let e = -34;
        let energyUI = add([
            sprite("ui_power_laptop"),
            pos(vec2(115+d,65+e)),
            anchor("center"),
            scale(1.25),
            opacity(1),
            area(),
            z(5),
            "ui",
        ]);
        let energyText = add([
            text("0", { size: 32, align: "center" }),
            pos(vec2(144+d,68+e)),
            anchor("center"),
            color(0, 0, 0),
            area(),
            z(5),
            "ui",
        ]);
        let mine = add([
            sprite("mine"),
            pos(vec2(340,694.5)),
            anchor("center"),
            scale(1.5),
            opacity(1),
            area(),
            z(5),
            state("normal", [ "normal" , "start" ]),
            "ui",
            "mine"
        ]);
        let energyTextTask = onUpdate(() => {
            energyText.text = Constants.gameState.getObj("redstone");
        })
        Uis.uiThread.push(energyUI);
        Uis.uiThread.push(energyText);
        Uis.uiThread.push(mine);
        Uis.uiTaskThread.push(energyTextTask);
    }
    static endUiThread() {
        Uis.uiTaskThread.forEach(task => {
            if(task.cancel) {
                task.cancel()
            }
        });
        Uis.uiThread.forEach(task => {
            try {
                destroy(task);
            } catch (error) {}
        });
        Uis.uiTaskThread.length = 0;
    }
}