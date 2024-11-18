import {Registries, Registry} from "/src/registry/Registry.js";

export class Bosses {
    static CODECS = [];
    static init() {
        Bosses.initCodecs(null)
    }
    static initCodecs(input) {
        Bosses.CODECS.push(null);
    }
    static registerBoss(key,value) {
        return Registry.register(Registries.BOSS, key, value);
    }
}