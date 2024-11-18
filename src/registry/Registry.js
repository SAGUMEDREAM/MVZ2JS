import {Textures} from "/src/util/Texture.js";
import {Scenes} from "/src/gui/Scenes.js";
import {Entities} from "/src/entity/Entities.js";
import {Levels} from "/src/level/Levels.js";
import {Items} from "/src/item/Items.js";
import {Worlds} from "/src/world/Worlds.js";
import {Features} from "/src/world/feature/Features.js";
import {ClassMapping} from "/src/util/ClassMapping.js";
import {Components} from "/src/component/Components.js";
import {Dialogs} from "/src/level/Dialogs.js";
import {Achievements} from "../achievement/Achievements.js";

export class DynamicRegistry {
    registry;
    rawRegistry;
    constructor() {
        this.registry = new Map();
        this.rawRegistry = [];
    }
    register(key, value) {
        if (this.getRegistry().has(key)) {
            throw new Error(`Duplicate registration of key ${key}`);
        }
        this.getRegistry().set(key, value);
        this.rawRegistry[this.rawRegistry.length] = value;
        return value;
    }
    set(key, value) {
        if (!this.getRegistry().has(key)) {
            throw new Error(`Invalid registry key ${key}`);
        }
        this.getRegistry().set(key, value);
        this.rawRegistry[this.rawRegistry.length] = value;
        return value;
    }
    get(key) {
        return this.getRegistry().get(key);
    }
    // 获取数字ID键
    getRaw(rawId) {
        return this.rawRegistry[rawId];
    }
    // 获取数字ID
    getRawId(key) {
        let value = this.get(key);
        if (value === null) {
            return -1;
        }
        let rawId = -1;
        for (let i = 0; i < this.rawRegistry.length; i++) {
            if (this.rawRegistry[i] === value) {
                rawId = i;
            }
        }
        return rawId;
    }
    getRegistry() {
        return this.registry;
    }
    clearRegistries() {

        return true;
    }
}
export class SimpleRegistry {
    registry;
    dynamicRegistry;
    rawRegistry;
    constructor() {
        this.registry = new Map();
        this.dynamicRegistry = new DynamicRegistry();
        this.rawRegistry = [];
    }
    static createSimple() {
        return new SimpleRegistry();
    }
    // 注册 键-内容 (忽略冻结)
    register(key, value) {
        if (this.registry.has(key)) {
            throw new Error(`Duplicate registration of key ${key}`);
        }
        this.registry.set(key, value);
        this.rawRegistry[this.rawRegistry.length] = value;
        return value;
    }
    // 设置 键-内容 (忽略冻结)
    set(key, value) {
        if (!this.registry.has(key)) {
            throw new Error('Invalid registry key');
        }
        this.registry.set(key, value);
        this.rawRegistry[this.rawRegistry.length] = value;
        return value;
    }
    // 获取键
    get(key) {
        if(this.dynamicRegistry.getRegistry().has(key)) {
            return this.dynamicRegistry.getRegistry().get(key);
        }
        return this.getRegistry().get(key);
    }
    // 获取数字ID键
    getRaw(rawId) {
        return this.rawRegistry[rawId];
    }
    // 获取数字ID
    getRawId(key) {
        let value = this.get(key);
        if (value === null) {
            return -1;
        }
        let rawId = -1;
        for (let i = 0; i < this.rawRegistry.length; i++) {
            if (this.rawRegistry[i] === value) {
                rawId = i;
            }
        }
        return rawId;
    }
    // 获取动态
    getDynamic() {
        return this.dynamicRegistry;
    }
    // 获取 Map
    getRegistry() {
        return this.registry;
    }
    // 获取本实例化
    getKey() {
        return this;
    }
}
export class RegistryKey {
    identifier;
    constructor(identifier,bind) {
        this.identifier = identifier;
        return bind || this;
    }
    static create(identifier,bind) {
        return new RegistryKey(identifier,bind);
    }
    static createSimpleRegistry(identifier) {
        return new RegistryKey(identifier,SimpleRegistry.createSimple());
    }
}
export class Registries {
    // 定义注册表的 RegistryKey
    static ACHIEVEMENT = new SimpleRegistry();
    static BOSS = new SimpleRegistry();
    static BULLET = new SimpleRegistry();
    static CODECS = new SimpleRegistry();
    static COMPONENT = new SimpleRegistry();
    static DIALOG = new SimpleRegistry();
    static DYNAMIC = new DynamicRegistry();
    static DYNAMIC_TEXTURE = new SimpleRegistry();
    static ITEM = new SimpleRegistry();
    static ITEM_CARD = new SimpleRegistry();
    static LANGUAGE = new SimpleRegistry();
    static LEVEL = new SimpleRegistry();
    static PLANT = new SimpleRegistry();
    static SCENE = new SimpleRegistry();
    static SOUND = new SimpleRegistry();
    static TEXTURE = new SimpleRegistry();
    static WORLD = new SimpleRegistry();
    static WORLD_FEATURE = new SimpleRegistry();
    static WORLD_LEVEL = new SimpleRegistry();
    static ZOMBIE = new SimpleRegistry();
    static isFrozen = false;
    // 冻结注册表，游戏初始化完毕后自动调用，在此之后无法通过 Registry.register() 进行更改
    // 初始化完成后的更改方法 Registries.[YOUR_REGISTRY_KEY].register()
    static freeze() {
        Registries.isFrozen = true;
    }
    // 解冻注册表
    static unfreeze() {
        Registries.isFrozen = false;
    }
    // 初始化注册
    static init() {
        ClassMapping.init();
        Textures.init();
        Components.init();
        Scenes.init();
        Dialogs.init();
        Entities.init();
        Items.init();
        Features.init();
        Levels.init();
        Worlds.init();
        Achievements.init();
        window.registry = Registry;
        window.registries = Registries;
    }
    // 初始化动态注册表
    static initDynamic(f) {
        Registries.getDynamic().clearRegistries();
        if (typeof f === 'function') {
            f();
        }
    }
    // 获取 Registries 中所有 SimpleRegistry 对象
    static getSimples() {
        return Object.values(Registries).filter(registry => registry instanceof SimpleRegistry);
    }
    // 获取注册表大小
    static getSizes() {
        let totalKeys = 0;
        Object.values(Registries)
            .filter(registry => registry instanceof SimpleRegistry)
            .forEach(registry => {
                totalKeys += registry.getRegistry().size;
            });
        return totalKeys;
    }
    // 获取动态注册表
    static getDynamic() {
        return this.DYNAMIC;
    }
    // 获取注册表中对应 RegistryKey 中 Codec 的对象
    static getCodec(registryKey, key) {
        if (!(registryKey instanceof SimpleRegistry)) {
            throw new Error('Unknown registryKey');
        }
        let result = null;
        let resultKey = Registries.CODECS.get(registryKey);
        if(resultKey != null) {
            result = resultKey.get(key);
        }
        return result;
    }
    static {
        Registries.CODECS.register(Registries.ACHIEVEMENT, new SimpleRegistry());
        Registries.CODECS.register(Registries.BOSS, new SimpleRegistry());
        Registries.CODECS.register(Registries.BULLET, new SimpleRegistry());
        Registries.CODECS.register(Registries.COMPONENT, new SimpleRegistry());
        Registries.CODECS.register(Registries.DIALOG, new SimpleRegistry());
        Registries.CODECS.register(Registries.DYNAMIC, new SimpleRegistry());
        Registries.CODECS.register(Registries.DYNAMIC_TEXTURE, new SimpleRegistry());
        Registries.CODECS.register(Registries.ITEM, new SimpleRegistry());
        Registries.CODECS.register(Registries.ITEM_CARD, new SimpleRegistry());
        Registries.CODECS.register(Registries.LANGUAGE, new SimpleRegistry());
        Registries.CODECS.register(Registries.LEVEL, new SimpleRegistry());
        Registries.CODECS.register(Registries.PLANT, new SimpleRegistry());
        Registries.CODECS.register(Registries.SCENE, new SimpleRegistry());
        Registries.CODECS.register(Registries.SOUND, new SimpleRegistry());
        Registries.CODECS.register(Registries.TEXTURE, new SimpleRegistry());
        Registries.CODECS.register(Registries.WORLD, new SimpleRegistry());
        Registries.CODECS.register(Registries.WORLD_FEATURE, new SimpleRegistry());
        Registries.CODECS.register(Registries.WORLD_LEVEL, new SimpleRegistry());
        Registries.CODECS.register(Registries.ZOMBIE, new SimpleRegistry());

    }
}
export class Registry {
    // 注册表
    // 注册表是一个快速定位创建游戏内容的集合
    // 大部分注册内容由 JSON 构成，当然不嫌麻烦和代码长可以自己手写 Registry.register()
    // JsonCodecs 是序列化 JSON 的工具类，用于快速创建注册内容        // 类路径：/src/registry/
    // 使用方式：var CODECS = new JsonCodecs("JSON 文件链接")      // 创建解编码器对象
    // var object = CODECS.toObject();                           // 转化为对象
    // CODECS.apply((object) => { 你的逻辑 });                    // 应用逻辑
    constructor() {
        return new SimpleRegistry();
    }
    // 获取一个注册项内容
    static get(registryKey, key) {
        if (!(registryKey.getRegistry() instanceof Map)) {
            throw new Error('Unknown registryKey');
        }
        if(registryKey.getDynamic().getRegistry().has(key)) {
            return registryKey.getDynamic().getRegistry().get(key);
        }
        return registryKey.getRegistry().get(key);
    }
    // 向游戏注册一个内容
    // 示例：
    // 非TEXTURE、SOUND等单次使用的静态内容使用Registry.register(RegistryKey, "Your Identifier", () => {return new YOUR_INSTANCE();});
    // 静态内容请使用Registry.register(RegistryKey, "Your Identifier", new YOUR_INSTANCE());
    static register(registryKey, key, value) {
        if (!(registryKey.getRegistry() instanceof Map)) {
            throw new Error('Unknown registryKey');
        }
        if (Registries.isFrozen) {
            throw new Error('The registry has been frozen');
        }
        if (registryKey.getRegistry().has(key)) {
            throw new Error(`Duplicate registration of key ${key}`);
        }
        registryKey.getRegistry().set(key, value);
        return value;
    }
    // 修改一个已存在的游戏内容
    static set(registryKey, key, value) {
        if (!(registryKey.getRegistry() instanceof Map)) {
            throw new Error('Unknown registryKey');
        }
        if (Registries.isFrozen) {
            throw new Error('The registry has been frozen');
        }
        if (!registryKey.getRegistry().has(key)) {
            throw new Error(`Invalid registry key ${key}`);
        }
        registryKey.getRegistry().set(key, value);
        return value;
    }
}