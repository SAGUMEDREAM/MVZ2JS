import {MixinInitializer} from "/src/modloader/mixin/MixinInitializer.js";
import {MixinClass} from "/src/modloader/mixin/MixinClass.js";
import {Test} from "../Test.js";

export class ExampleMixin extends MixinInitializer {
    constructor() {
        super();
    }
    load() {
        // 你的逻辑 ...
        let ClassTest = Test;
        let mixinTest = MixinClass.create(ClassTest);
        mixinTest.inject("test","@HEAD",function () {
            console.log(this.textBefore);
        });
    }
}