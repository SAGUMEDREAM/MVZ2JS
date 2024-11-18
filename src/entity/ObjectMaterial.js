import {Tag} from "/src/entity/Tag.js";

export class ObjectMaterial extends Tag {
    static TYPE = {
        STONE: "STONE",
        FLESH: "FLESH",
        LEATHER: "LEATHER",
        IRON: "IRON",
        PLANT: "PLANT",
        BONE: "BONE",
        VOID: "VOID",
        WOODEN: "WOODEN",
        DIAMOND: "WOODEN",
        SAND: "SAND",
        ICE: "ICE"
    }
    constructor(type) {
        super(type);
    }
}