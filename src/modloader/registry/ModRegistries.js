import {ClassMapping} from "../../util/ClassMapping.js";
import {Components} from "../../component/Components.js";
import {Scenes} from "../../gui/Scenes.js";
import {Dialogs} from "../../level/Dialogs.js";
import {Plants} from "../../entity/plant/Plants.js";
import {Zombies} from "../../entity/zombie/Zombies.js";
import {Bosses} from "../../entity/boss/Bosses.js";
import {Bullets} from "../../entity/Bullets.js";
import {Items} from "../../item/Items.js";
import {Features} from "../../world/feature/Features.js";
import {Levels} from "../../level/Levels.js";
import {Textures} from "../../util/Texture.js";
import {SoundLoader} from "../../sound/SoundLoader.js";
import {ModLanguageProvider} from "../api/ModLanguageProvider.js";

export class ModRegistries {
    // 模组注册表（根据开发状况会有所不同）
    static registryKey = {
        BOSS: [],
        BULLET: [],
        COMPONENT: [],
        DIALOG: [],
        DYNAMIC: [],
        DYNAMIC_TEXTURE: [],
        ITEM: [],
        ITEM_CARD: [],
        LANGUAGE: [],
        LEVEL: [],
        CLASS_MAPPING: [],
        PLANT: [],
        SCENE: [],
        SOUND: [],
        TEXTURE: [],
        WORLD: [],
        WORLD_FEATURE: [],
        WORLD_LEVEL: [],
        ZOMBIE: []
    };
    static {}
    constructor() {}
    // 总启动模组注册表
    bootstrap() {
        ModRegistries.registryKey.LANGUAGE.forEach((k) => {let key = k["key"]; let value = k["value"]; new ModLanguageProvider(key,value)});
        ModRegistries.registryKey.SOUND.forEach((k) => {SoundLoader.initCodecs(k)});
        ModRegistries.registryKey.CLASS_MAPPING.forEach((k) => {ClassMapping.initCodecsMapping(k);});
        ModRegistries.registryKey.TEXTURE.forEach((k) => {Textures.initCodecs(k)});
        ModRegistries.registryKey.COMPONENT.forEach((k) => {Components.codecsComponents(k)});
        ModRegistries.registryKey.SCENE.forEach((k) => {Scenes.initCodecs(k)});
        ModRegistries.registryKey.DIALOG.forEach((k) => {Dialogs.initCodecs(k)});
        ModRegistries.registryKey.PLANT.forEach((k) => {Plants.initCodecs(k);Textures.initCodecsEntities(k)});
        ModRegistries.registryKey.ZOMBIE.forEach((k) => {Zombies.initCodecs(k);Textures.initCodecsEntities(k)});
        ModRegistries.registryKey.BOSS.forEach((k) => {Bosses.initCodecs(k)});
        ModRegistries.registryKey.BULLET.forEach((k) => {Bullets.initCodecs(k)});
        ModRegistries.registryKey.ITEM.forEach((k) => {});
        ModRegistries.registryKey.ITEM_CARD.forEach((k) => {Items.initCodecsCard(k)});
        ModRegistries.registryKey.WORLD_FEATURE.forEach((k) => {Features.initCodecs(k)});
        ModRegistries.registryKey.LEVEL.forEach((k) => {Levels.initCodecs(k)});
        ModRegistries.registryKey.WORLD_LEVEL.forEach((k) => {Levels.initCodecsWorldLevel(k)});
        ModRegistries.registryKey.WORLD.forEach((k) => {});
    }
    // 注册解编码器
    static registerCodec(registryKey, key) {
        if(Array.isArray(registryKey)) registryKey.push(key);
        return key;
    }
    static getCodec(registryKey) {
        return registryKey;
    }
}