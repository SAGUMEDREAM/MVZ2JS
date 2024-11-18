export function IsoGrid(k) {

    function addIsoGrid(map, opt) {
        const tileWidth = opt.tileWidth;
        const tileHeight = opt.tileHeight;
        const halfWidth = opt.tileWidth / 2;
        const halfHeight = opt.tileHeight / 2;
        const tileY = opt.tileY;
        const layers = map.length;
        const columns = map[0][0].length;
        const rows = map[0].length;

        return add([
            pos(opt.pos),
            {
                draw() {
                    const depth = opt.depth;
                    for (let l = 0; l < layers; l++) {
                        const layer = map[l];
                        let y = tileY ? tileY[l] : 0;
                        for (let j = 0; j < rows; j++) {
                            const row = layer[j];
                            for (let i = 0; i < columns; i++) {
                                const point = this.tileToSprite(vec2(i, j));
                                const char = row[i];
                                if (l > 0 && char === " ") continue;
                                const tile = opt.tiles[char] || opt.wildcardTile;
                                const tileY = depth ? y + depth[j][i] : y;
                                drawSprite({
                                    sprite: tile[0],
                                    frame: tile[1],
                                    pos: point.sub(0, tileY),
                                });
                            }
                        }
                    }
                },
                tileToSprite(tile) {
                    const xStart = (rows - 1) * halfWidth;
                    return vec2(xStart + halfWidth * (tile.x - tile.y), halfHeight * (tile.x + tile.y));
                },
                tileToCenter(tile) {
                    return this.tileToSprite(tile).add(halfWidth, halfHeight);
                },
                pointToTile(point) {
                    const xStart = (rows - 1) * halfWidth;
                    point = point.sub(xStart + this.pos.x, this.pos.y);
                    return vec2(Math.floor(point.x / tileWidth + (point.y + halfHeight) / tileHeight) - 1,
                        Math.floor(-point.x / tileWidth + (point.y + halfHeight) / tileHeight));
                }
            }
        ]);
    }

    return {
        addIsoGrid,
    };
}
