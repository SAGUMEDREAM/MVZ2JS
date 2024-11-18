import {ModInitializer} from "/src/modloader/ModInitializer.js";

export class ExampleMod extends ModInitializer {
    constructor() {
        super();
    }
    onInitialize() {
        console.log("Hello World");
        // 你的模组逻辑...
        // ModRegistries.registerCodec(ModRegistries.registryKey.OBJECT,"JSON 路径");
    }
}