import {EventConstructor} from "/src/event/Event.js";
import {GargoyleStatue} from "/src/entity/zombie/GargoyleStatue.js";

export function getRandomCoordinate(xRange, yRange) {
    const x = Math.floor(Math.random() * (xRange[1] - xRange[0] + 1)) + xRange[0];
    const y = Math.floor(Math.random() * (yRange[1] - yRange[0] + 1)) + yRange[0];
    return { x, y };
}

export function generateUniqueCoordinates(xRange, yRange, count) {
    const coordinatesSet = new Set();
    while (coordinatesSet.size < count) {
        const { x, y } = getRandomCoordinate(xRange, yRange);
        coordinatesSet.add(JSON.stringify({ x, y }));
    }
    return Array.from(coordinatesSet).map(coord => JSON.parse(coord));
}
export class RandomGStatue extends EventConstructor {
    constructor() {
        super(async (dynLevel) => {
            let posArray = generateUniqueCoordinates([5, 8], [0, 4], 5);
            posArray.forEach(result => {
                let x = result.x;
                let y = result.y;
                GargoyleStatue.spawn(x,y);
            });
        });
    }
}