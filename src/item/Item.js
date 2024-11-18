export class Item {
    placeTexture = "";
    itemId = "";
    constructor(texture) {
        this.placeTexture = texture;
    }
    use() {}
    drop() {}
    add() {}
    remove() {}
    spawnItem(x,y) {}
    endThread() {}
    setId(id) {
        if(id!=null) {
            this.itemId = `item.${id}`;
        } else {
            this.itemId = `item.unknown`;
        }
    }
}