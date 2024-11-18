import {EventConstructor} from "/src/event/Event.js";
import {Dialogs} from "/src/level/Dialogs.js";
import {ItemGensoukyouMap} from "/src/item/ItemGensoukyouMap.js";

export class Level0_1_end extends EventConstructor {
    constructor() {
        super(async (dynLevel) => {
            dynLevel.endThread();
            new ItemGensoukyouMap();
        });
    }
}