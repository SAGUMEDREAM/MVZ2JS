import {free} from "/src/util/Utils.js";
import {Events} from "/src/event/Events.js";

export class Component {
    codecObject;
    type;
    identifier;
    elements;
    spriteArray = [];
    constructor(codecObject) {
        this.codecObject = codecObject;
        this.initProperties();
    }

    initProperties() {
        this.type = this.codecObject["type"];
        this.identifier = this.codecObject["identifier"];
        this.elements = this.codecObject["elements"];

        let objects = this.codecObject["objects"];
        if (objects) Object.assign(this, objects);
    }
    run() {
        this.elements.forEach((item) => {
            let type = item["type"];
            switch (type) {
                case "sprite": {
                    this.createSprite(item);
                    break;
                }
            }
        })
    }
    createSprite(item) {
        let properties = item["properties"];
        let pArray = [];
        if(properties != null) {
            if(properties["texture"]) {
                let texture = properties["texture"];
                pArray.push(sprite(texture));
            }
            if(properties["pos"]) {
                let x = properties["pos"]["x"];
                let y = properties["pos"]["y"];
                let c = properties["pos"]["center"];
                if(c == true) {
                    pArray.push(vec2((center().x+x),(center().y+y)));
                } else {
                    pArray.push(vec2(x,y));
                }
            }
            if(properties["anchor"]) {
                let anchorType = properties["anchor"]
                pArray.push(anchor(anchorType));
            }
            if(properties["scale"]) {
                let sc = properties["scale"]
                pArray.push(scale(sc));
            }
            if(properties["opacity"]) {
                let op = properties["opacity"]
                pArray.push(opacity(op));
            }
            if(properties["area"] == true) {
                pArray.push(area());
            }
            if(properties["tags"]) {
                let tags = properties["tags"];
                tags.forEach(tag => {
                    pArray.push(tag);
                });
            }
        }
        let spr = add(pArray);
        if(properties != null) {
            let events = properties["events"];
            events.forEach(event => {
                let type = event["type"];
                let action = event["action"];
                switch (type) {
                    case "onclick": {
                        spr.onClick(() => {
                            Events.getEvent(action);
                        })
                        break;
                    }
                    case "hover": {
                        spr.onHover(() => {
                            Events.getEvent(action)
                        })
                        break;
                    }
                    case "hover_update": {
                        spr.onHoverUpdate(() => {
                            Events.getEvent(action)
                        })
                        break;
                    }
                    case "hover_end": {
                        spr.onHoverEnd(() => {
                            Events.getEvent(action)
                        })
                        break;
                    }
                    case "update": {
                        spr.onUpdate(() => {
                            Events.getEvent(action)
                        });
                        break;
                    }
                }
            });
        }
        this.spriteArray.push(spr);
    }
    endThread() {
        if(this.spriteArray != null) {
            this.spriteArray.forEach((sprite) => {
                destroy(sprite);
                sprite = null;
            });
        }
        this.spriteArray = null;
        free(this);
    }
}