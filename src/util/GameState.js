import {free} from "/src/util/Utils.js";

export class GameState {
    #obj = new Map();
    constructor() {
        this.#obj = new Map();
    }
    addObj(key,value) {
        if(!this.#obj.get(key)) {
            this.#obj.set(key,value);
            this[key] = value;
        }
        return this;
    }
    setObj(key,value) {
        this.#obj.set(key,value);
        this[key] = value;
        return this;
    }
    getObj(key) {
        return this.#obj.get(key);
    }
    getStat() {
        return this;
    }
    deleteObj() {
        this.#obj.clear();
        free(this);
    }
}