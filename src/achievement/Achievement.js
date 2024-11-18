export class Achievement {
    identifier;
    image;
    codecsObject;
    constructor(codecsObject) {
        this.codecsObject = codecsObject;
        this.initProperties();
    }
    initProperties() {
        this.identifier = this.codecsObject["identifier"];
        this.image = this.codecsObject["image"];
    }
}