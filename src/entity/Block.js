export class Block {
    plant1;
    plant2;
    static mapArray = [];
    constructor(x,y) {
        this.x = x + 1;
        this.y = y + 1;
        while (Block.mapArray.length <= y) {
            Block.mapArray.push([]);
        }
        while (Block.mapArray[y].length <= x) {
            Block.mapArray[y].push(null);
        }
        Block.mapArray[y][x] = this;
    };
    setPlant(plantInstance) {
        this.plant1 = plantInstance;
    }
    getPlant() {
        return this.plant1;
    }
}