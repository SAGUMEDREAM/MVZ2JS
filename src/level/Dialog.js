import {choose, free, moveTo_Timer} from "/src/util/Utils.js";
import {Constants, KaplayLogger} from "/src/client/Client.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";

export class Dialog {
    codecObject;
    type;
    identifier;
    dialogs;
    step = -1;
    maxStep = -1;
    eventListener = [];
    sprites = [];
    character = [];
    callF = () => {};
    isDone = false;
    constructor(codecObject) {
        this.codecObject = codecObject;
        this.initProperties();
    }
    initProperties() {
        this.type = this.codecObject["type"];
        this.identifier = this.codecObject["identifier"];
        this.dialogs = this.codecObject["dialogs"];
        this.maxStep = this.dialogs.length - 1;

        let objects = this.codecObject["objects"];
        if (objects) Object.assign(this, objects);
    }
    next() {
        this.step++;
        if(this.step <= this.maxStep) {
            let obj = this.dialogs[this.step];
            let objName = obj["name"];
            let objToward = obj["toward"];
            let objTexture = obj["texture"];
            let objText = obj["text"];
            let objSound = obj["sound"];
            let conChar;
            if(this.character[0] == null) {
                this.character[0] = add([
                    sprite("void"),
                    anchor("center"),
                    pos(center().x+400, center().y+180),
                    outline(2),
                    z(7),
                ]);
                this.character.flipX = true
            }
            if(this.character[1] == null) {
                this.character[1] = add([
                    sprite("void"),
                    anchor("center"),
                    pos(center().x-400, center().y+180),
                    outline(2),
                    z(7)
                ]);
                this.character.flipX = false
            }
            if(objToward == "left") {
                conChar = this.character[0];
                this.character.flipX = true;
            } else if(objToward == "right") {
                conChar = this.character[1];
                this.character.flipX = false;
            }
            if(conChar != null) {
                conChar.use(sprite(objTexture));
            }
            //console.log(`${objName}:${objText}`);
            this.sprites[1].text = objText;
            this.sprites[2].text = objName;
            if(objSound != "" && objSound != null) {
                if(Array.isArray(objSound)) {
                    let result = choose(objSound);
                    SoundLoader.playSound(result);
                } else {
                    SoundLoader.playSound(objSound);
                }
            }
        } else {
            this.isDone = true;
            (async () => {
                for (let chr of this.character) {
                    let vecZ;
                    let x0 = chr.pos.x;
                    let y0 = chr.pos.y+800;
                    vecZ = vec2(x0, y0);
                    moveTo_Timer(chr, vecZ,"easeOutCubic" ,0.4);
                }
            })();
            (async () => {
                for (let spr of this.sprites) {
                    let vecZ;
                    let x0 = spr.pos.x;
                    let y0 = spr.pos.y+400;
                    vecZ = vec2(x0, y0);
                    moveTo_Timer(spr, vecZ,"easeOutCubic" ,0.4);
                }
            })();
            (async ()=> {
                await wait(0.5,() => {
                    this.call();
                    this.endThread();
                });
            })();
        }
    }
    run() {
        this.eventListener[0] = onClick(() => {
            if(this.isDone == false) {
                this.next();
            }
        });
        this.sprites[0] = add([ //对话框
                rect(width() - 500, 140, { radius: 18 }),
                anchor("center"),
                pos(center().x, height() - 100),
                outline(2),
                z(8)
        ]);
        this.sprites[1] = add([ // 对话文本
            text("", { size: 28, width: width(), height: height(), font: "monospace", align: "center" }),
            pos(this.sprites[0].pos),
            anchor("center"),
            color(0, 0, 0),
            z(9),
        ]);
        this.sprites[2] = add([ // 名字
            text("", { size: 20, width: width(), height: height(), font: "monospace", align: "center" }),
            pos(vec2(this.sprites[0].pos.x+340, this.sprites[0].pos.y+45)),
            anchor("center"),
            color(0, 0, 0),
            z(9),
        ]);

        this.next();
    }
    setCall(f) {
        this.callF = f;
        return this;
    }
    call() {
        return this.callF();
    }
    endThread() {
        if(this.eventListener != null) {
            this.eventListener.forEach(event => {
                if(event.cancel != null) {
                    event.cancel();
                }
            });
        }
        this.sprites.forEach(item => {
            destroy(item);
        });
        this.character.forEach(item => {
            destroy(item);
        });
        free(this);
    }
}