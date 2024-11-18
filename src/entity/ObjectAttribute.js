import {Tag} from "/src/entity/Tag.js";
export class ObjectAttribute extends Tag {
    static TYPE = {
        COMMON: "COMMON",
        BLUNT: "BLUNT",
        FIRE: "FIRE",
        SHARPS: "SHARPS",
        LIGHTNING: "LIGHTNING",
        ICE: "ICE"
    }
    constructor(type) {
        super(type);
    }
}