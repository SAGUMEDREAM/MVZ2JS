import {Constants} from "/src/client/Client.js";
import {free} from "/src/util/Utils.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {SoundParser} from "../sound/SoundParser.js";
import {ObjectMaterial} from "./ObjectMaterial.js";
import {ObjectAttribute} from "./ObjectAttribute.js";

export class Bullet {
    codecObject;
    source
    type;
    identifier;
    props;
    texture;
    attacking_damage;
    speed;
    vector
    bullet_instance;
    taskLoops = [];
    tags = [];
    rFunc = () => {};
    constructor(codecObject,source,props = {}) {
        this.codecObject = codecObject;
        this.source = source;
        this.props = props;
        this.initProperties();
        Constants.bulletInstance.push(this);
    }
    initProperties() {
        this.type = this.codecObject["type"] || "bullet";
        this.identifier = this.codecObject["identifier"] || "default_bullet";
        this.resources = this.codecObject["resources"];
        this.texture = this.resources["texture"];
        this.sounds = this.resources["sounds"] || { start: null, collide: null};
        this.startSound = this.sounds["start"];
        this.collideSound = this.sounds["collide"];
        this.properties = this.codecObject["properties"];
        this.attacking_damage = this.source["attacking_damage"] || this.properties["attacking_damage"] || 20;

        const attr = this.codecObject["object_attribute"];
        const material = this.codecObject["object_material"];

        this.object_attribute_type = (attr !== undefined && attr !== "") ? attr : "COMMON";
        this.object_material_type = (material !== undefined && material !== "") ? material : "FLESH";
        this.object_attribute = new ObjectAttribute(this.object_attribute_type);
        this.object_material = new ObjectMaterial(this.object_material_type);

        this.speed = this.properties["speed"] || 0.4;
        this.vector = this.properties["vector"] || 2;
        this.size = this.properties["size"] || 1;
        this.tags = this.properties["tags"] || [];
        let objects = this.codecObject["objects"] || {};
        if (objects) Object.assign(this, objects);
    }
    onRun() {}
    onCollide(e) {}
    collide(e) {
        if(this.collideSound != null && this.collideSound != "") {
            SoundParser.playSound(this.collideSound);
        }
        this.onCollide(e);
    }
    run() {
        let vecZ = center();
        if(this.source != null) if(this.source.entity_instance != null) {
            let x0 = this.source.entity_instance.pos.x;
            let y0 = this.source.entity_instance.pos.y;
            vecZ = vec2(x0, y0);
        }
        let sprProps = [
            sprite(`bullet/${this.identifier}`),
            pos(vecZ),
            anchor("center"),
            scale(this.size),
            rotate(0),
            color(),
            area(),
            z(7),
            `entity`,
            `bullet`,
            `${this.identifier}`,
            {
                instance: this,
                betray: false,
            },
        ]
        this.tags.forEach(tag => {
            sprProps.push(tag);
        })
        this.bullet_instance = add(sprProps);
        if(this.startSound != null && this.startSound != "") {
            SoundLoader.playSound(this.startSound);
        }
        this.onRun();
    }
    getVec() {
        return this.bullet_instance.pos;
    }
    endThread() {
        if(this.taskLoops != null) {
            this.taskLoops.forEach(task => {
                if(task.cancel) {
                    task.cancel();
                }
            });
        }
        if(this.bullet_instance != null) {
            destroy(this.bullet_instance);
        }
        free(this);
    }
}