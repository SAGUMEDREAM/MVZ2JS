export class Info {
    container = "";
    constructor(info) {
        if(info!=null) {
            this.container = info;
        }
    }
    getInfo() {
        return this.container;
    }
}