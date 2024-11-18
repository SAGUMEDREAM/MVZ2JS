import {MixinClass} from "/src/modloader/mixin/MixinClass.js";
import {MixinObject} from "/src/modloader/mixin/MixinObject.js";

export class Mixin {
    type;
    modifiedObject;
    // 获取 Mixin
    constructor(type,modifiedObject) {
        this.type = type;
        this.modifiedObject = modifiedObject;
        if(type == '@CLASS') {
            return new MixinClass(modifiedObject);
        } else if(type == '@OBJECT') {
            return new MixinObject(modifiedObject);
        }
    }
    static create(type,modifiedObject) {
        if(type == '@CLASS') {
            return new MixinClass(modifiedObject);
        } else if(type == '@OBJECT') {
            return new MixinObject(modifiedObject);
        }
    }
}