import {matchesIgnoreCase} from "/src/util/Utils.js";

export class Tag {
    static TYPE = {}
    static RESTRAINED = {
        COMMON: "ALL",
        BLUNT: (material) => {
            if(matchesIgnoreCase(material,"STONE") || matchesIgnoreCase(material,"ICE")) {
                return Tag.RESULT.INSTANT_KILL;
            } else {
                return Tag.RESULT.SUCCESS;
            }
        },
        FIRE: (material) => {
            if(matchesIgnoreCase(material,"WOODEN") || matchesIgnoreCase(material,"DIAMOND") || matchesIgnoreCase(material,"PLANT") || matchesIgnoreCase(material,"LEATHER")) {
                return Tag.RESULT.BIG_DAMAGE;
            } else if(matchesIgnoreCase(material,"SAND")) {
                return Tag.RESULT.FAIL;
            } else if(matchesIgnoreCase(material,"ICE")) {
                return Tag.RESULT.INSTANT_KILL;
            } else {
                return Tag.RESULT.SUCCESS;
            }
        },
        SHARPS: (material) => {
            if(matchesIgnoreCase(material,"IRON") || matchesIgnoreCase(material,"STONE") || matchesIgnoreCase(material,"DIAMOND")) {
                return Tag.RESULT.FAIL;
            } else if (matchesIgnoreCase(material,"FLESH") || matchesIgnoreCase(material,"PLANT")) {
                return Tag.RESULT.BIG_DAMAGE;
            } else {
                return Tag.RESULT.SUCCESS;
            }
        },
        LIGHTNING: (material) => {
            if(matchesIgnoreCase(material,"LEATHER")) {
                return Tag.RESULT.BIG_DAMAGE;
            } else if(matchesIgnoreCase(material,"BONE") || matchesIgnoreCase(material,"PLANT") || matchesIgnoreCase(material,"WOODEN")) {
                return Tag.RESULT.FAIL;
            } else {
                return Tag.RESULT.SUCCESS;
            }
        },
        ICE: (material) => {
            if(matchesIgnoreCase(material,"IRON")) {
                return Tag.RESULT.FAIL;
            } else {
                return Tag.RESULT.SUCCESS;
            }
        }
    }
    static RESULT = {
        SUCCESS: "SUCCESS",
        FAIL: "FAIL",
        INSTANT_KILL: "INSTANT_KILL",
        BIG_DAMAGE: "BIG_DAMAGE"
    }
    type;
    constructor(type) {
        this.type = type;
        this.type = this.type.toLowerCase();
        this.type = this.type.toUpperCase();
    }
    getType() {
        return this.type.toLowerCase().toUpperCase();
    }
    static addRestrain(key,lambda) {
        Tag.RESTRAINED[key] = lambda;
    }
    static damageResult(attributeObject,materialObject) {
        if(attributeObject == null || materialObject == null) {
            return Tag.RESULT.SUCCESS;
        }
        let attributeType = attributeObject.getType != null ? attributeObject.getType() : null;
        let materialType = materialObject.getType != null ? materialObject.getType() : null;
        if(attributeType == null || materialType == null) {
            return Tag.RESULT.SUCCESS;
        }
        if(Tag.RESTRAINED[attributeType] == "ALL") {
            return Tag.RESULT.SUCCESS;
        } else {
            let attributeValue = Tag.RESTRAINED[attributeType];
            if(attributeValue != null) if(typeof attributeValue == 'function') {
                let result = attributeValue(materialType);
                return result;
            } else {
                return Tag.RESULT.SUCCESS;
            }
        }
        return Tag.RESULT.SUCCESS;
    }
}