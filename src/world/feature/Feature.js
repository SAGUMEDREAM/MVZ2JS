import {Constants} from "/src/client/Client.js";
import {Block} from "/src/entity/Block.js";
import {free} from "/src/util/Utils.js";

export class Feature {
    codecObject = {};
    type = "feature";
    identifier = "default_feature";
    backgroundTexture;
    backgroundOffset = { x: 100, y: 0 };
    backgroundOffsetX = 0;
    backgroundOffsetY = 0;
    blockTexture = "place_block";
    blockLocation = { x: 341, y: 196 };
    blockLocationX;
    blockLocationY;
    blockOffset = { x: 103.1, y: 103.3 };
    blockOffsetX;
    blockOffsetY;
    blockArray;
    blockMaxX = 0;
    blockMaxY = 0;
    blockSpecialSettings = {};
    guiBackground;
    runLock = false;

    constructor(codecObject) {
        this.codecObject = codecObject;
        this.initObject();
        console.log(this);
    }

    initObject() {
        this.type = this.codecObject["type"] || "feature";
        this.identifier = this.codecObject["identifier"] || "default_feature";
        this.star_shard = this.codecObject["star_shard"] || null;
        this.trolley = this.codecObject["trolley"] || null;
        let backgroundObj = this.codecObject["background"];
        let blocksObj = this.codecObject["blocks"];
        {
            this.backgroundTexture = backgroundObj["texture"] || "level/your_garden";
            this.backgroundOffset = backgroundObj["offset"] || this.backgroundOffset;
            this.backgroundOffsetX = this.backgroundOffset["x"];
            this.backgroundOffsetY = this.backgroundOffset["y"];
        }
        this.blockTexture = blocksObj["texture"] || "place_block";
        this.blockLocation = blocksObj["location"] || this.blockLocation;
        {
            this.blockLocationX = this.blockLocation["x"] || this.blockLocation.x;
            this.blockLocationY = this.blockLocation["y"] || this.blockLocation.y;
        }
        this.blockOffset = blocksObj["offset"] || this.blockOffset;
        {
            this.blockOffsetX = this.blockOffset["x"] || this.blockOffset.x;
            this.blockOffsetY = this.blockOffset["y"] || this.blockOffset.y;
        }
        this.blockArray = blocksObj["array"];
        this.blockMaxX = this.calculateMaxLen(this.blockArray);
        this.blockMaxY = this.blockArray.length;
        this.blockSpecialSettings = blocksObj["special_settings"];
        let objects = this.codecObject["objects"];
        if (objects) Object.assign(this, objects);
    }

    calculateMaxLen(array) {
        let maxLen = 0;
        array.forEach(row => {
            if (row.length > maxLen) {
                maxLen = row.length;
            }
        });
        return maxLen;
    }

    run() {
        if (this.runLock) {
            return;
        }
        this.runLock = true;
        Constants.blockPosMap = new Map();
        this.guiBackground = add([
            sprite(this.identifier),
            scale(1),
            opacity(1),
            anchor("center"),
            pos(vec2(center().x + this.backgroundOffsetX, center().y + this.backgroundOffsetY))
        ]);
        for (let i = 0; i < this.blockMaxX; ++i) {
            for (let j = 0; j < this.blockMaxY; j++) {
                let x0 = (this.blockLocationX + (i * this.blockOffsetX));
                let y0 = (this.blockLocationY + (j * this.blockOffsetY));
                let canPlace = true;
                let isWater = false;
                for (let item of this.blockSpecialSettings) {
                    let key = item["key"];
                    let value = item["value"];
                    if (i == key["x"] && j == key["y"]) {
                        canPlace = value["canPlace"];
                        isWater = value["isWater"];
                    }
                }
                let block_instance = add([
                    sprite(this.blockTexture),
                    pos(vec2(x0, y0)),
                    anchor("center"),
                    color(255, 255, 255),
                    scale(1),
                    opacity(0),
                    area(),
                    `place_block`,
                    {
                        x: i,
                        y: j,
                        block_instance: new Block(i, j),
                        isPlanting: false,
                        canPlace: canPlace,
                        isWater: isWater,
                    }
                ]);
                Constants.blockPosMap.set(Feature.getPosKey(i,j), { blockX: x0, blockY: y0, instance: block_instance });
            }
        }
    }
    static getPosKey(x,y) {
        return `${x},${y}`;
    }
    endThread() {
        free(this);
    }
}
