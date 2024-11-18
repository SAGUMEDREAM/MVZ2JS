import {ScriptLevel} from "/src/level/ScriptLevel.js";
import {initCommonLevel} from "/src/util/Utils.js";

export class Level1 extends ScriptLevel {
    constructor(props) {
        super(props);
    }
    run() {
        initCommonLevel();
    }
}