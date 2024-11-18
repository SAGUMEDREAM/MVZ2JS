## Minecraft Vs Zombies II JavaScript Edition

### 简介

这是一个使用 KaplayJS (KaboomJS) 引擎还原并拓展 Minecraft Vs Zombies II 的二创游戏。
简称 MVZ2JE 或 MVZ2JS。

该项目为开源项目，项目地址：https://github.com/SAGUMEDREAM/MVZ2JS

最近更新日期：2024/7/7

### 详细信息
游戏原作者：[Cuerzor58](https://space.bilibili.com/348514)<br>
原作：Minecraft Vs Zombies II / 东方Project (上海アリス幻楽団) / Plants vs. Zombies (PopCap Games, Inc.) / Minecraft (Mojang Studios)<br>
代码：[稀神灵梦](https://space.bilibili.com/158597454)<br>
使用引擎/库：[Kaplay (KaboomJS)](https://kaplayjs.com/)、nw-builder

### 模组加载器
本游戏支持玩家自制并加载模组，模组目录为 /mods/

启用模组列表在 /mods/mods.json

#### 制作模组
游戏代码命名类似 Minecraft Fabric 下的 Yarn，游戏内容将采用注册表的形式对游戏内容注册，大部分注册内容由 JSON 控制，比如说'器械属性'和'怪物属性'等，但它们都会指向一个src类目标 (指向方式：src: "JS路径 -> 类名")。

在制作之前建议先熟悉代码

模组入口： /mods/{模组文件夹}/modlauncher.json

##### 注册表
1. 内容注册方式①：某个注册内容 -> 获取 new JsonCodecs().apply(f=>{}) -> 读取注册列表 -> 读取列表每一个注册项 -> new JsonCodecs().apply(f=>{}) -> 读取注册内容 -> 生成匿名函数返回到注册表
2. 内容注册方式②：如果不嫌麻烦的话直接 Registry.register(registryKey,key,() => {return (value)}); 或 registryKey.register(key,() => {return (value)});

提示：在注册器械或怪物的之前请通过对 CLASS_MAPPING 注册相同的 JSON

##### Mixin
一个修改 Class 或 Object 的工具类，支持对其他类进行注入代码，拦截，覆盖，设置返回值等操作。使用示例：

    new Mixin("@CLASS",目标类); 或 new Mixin("@OBJECT",目标函数);

##### JsonCodecs
一个序列化 JSON 的工具，在游戏注册表广泛使用。 使用示例：

    new JsonCodecs("JSON链接").apply((object) => {你的代码});

### 安装游戏方式
获取方式：拷贝该项目到你的本地或获取Release
1. 方法1：安装宝塔面板 -> 登录宝塔面板 -> 添加网站并选择目录 -> 浏览器输入 网址/index.html
2. 方法2：安装 Visual Studio Code -> 安装拓展 Live Server -> 配置Live Server -> 点击Go Live
3. 方法3：点击 Release 获取最新版本构建 -> 运行mvz2.exe