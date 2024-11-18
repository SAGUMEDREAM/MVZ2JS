import {Registries, Registry} from "/src/registry/Registry.js";
import {JsonCodecs} from "/src/registry/Codecs.js";
import {KaplayLogger} from "/src/client/Client.js";

export class Texture {
    constructor(texture,props) {
        this.texture = texture;
        this.props = props;
        if(props==null) {
            this.props = {};
        }
    }
}
export class CardTexture {
    constructor(texture,props) {
        this.texture = texture;
        this.props = props;
        if(props==null) {
            this.props = {};
        }
    }
}
export class Textures {
    static CODECS = [];
    static ENTITIES_CODECS = [];
    static init() {
        // 主菜单
        Textures.registerTexture("game_title", new Texture("room/roomTitle.png",{}));
        Textures.registerTexture("game_menu", new Texture("room/roomMenu.png",{}));
        Textures.registerTexture("game_menu2", new Texture("room/roomMenu_Bottom.png",{}));
        Textures.registerTexture("game_menu/adventure_mode", new Texture("room/menu_state/adventure_mode.png",{}));
        Textures.registerTexture("game_menu/almanac", new Texture("room/menu_state/almanac.png",{}));
        Textures.registerTexture("game_menu/music_room_bg", new Texture("room/music_room.png",{}));
        Textures.registerTexture("game_menu/change_name", new Texture("room/menu_state/change_name.png",{}));
        Textures.registerTexture("game_menu/exit", new Texture("room/menu_state/exit.png",{}));
        Textures.registerTexture("game_menu/help", new Texture("room/menu_state/help.png",{}));
        Textures.registerTexture("game_menu/iframe", new Texture("room/menu_state/iframe.png",{}));
        Textures.registerTexture("game_menu/more", new Texture("room/menu_state/more.png",{}));
        Textures.registerTexture("game_menu/option", new Texture("room/menu_state/option.png",{}));
        Textures.registerTexture("game_menu/shop", new Texture("room/menu_state/shop.png",{}));
        Textures.registerTexture("game_menu/version", new Texture("room/menu_state/version.png",{}));
        Textures.registerTexture("game_menu/your_name_is", new Texture("room/menu_state/your_name_is.png",{}));
        Textures.registerTexture("game_menu/achievement", new Texture("room/menu_state/achievement.png",{}));
        Textures.registerTexture("game_menu/archives", new Texture("room/menu_state/archives.png",{}));
        Textures.registerTexture("game_menu/back", new Texture("room/menu_state/back.png",{}));
        Textures.registerTexture("game_menu/music_room", new Texture("room/menu_state/music_room.png",{}));

        Textures.registerTexture("game_menu_night", new Texture("room/roomMenuNight.png",{}));
        Textures.registerTexture("minecraft_title", new Texture("room/minecraft_title.png",{}));
        Textures.registerTexture("javascript_edition", new Texture("room/javascript_edition.png",{}));
        Textures.registerTexture("help", new Texture("room/help.png",{}));
        Textures.registerTexture("almanac", new Texture("room/almanac.png",{}));
        Textures.registerTexture("i_almanac", new Texture("room/i_almanac.png",{}));
        Textures.registerTexture("MCButton", new Texture("gui/button.png",{}));
        Textures.registerTexture("MCButton_StartGame", new Texture("gui/button_startGame.png",{}));
        Textures.registerTexture("iframe_playgame", new Texture("gui/iframe_playgame.png",{}));
        Textures.registerTexture("sign_help", new Texture("gui/sign_help.png",{}));
        Textures.registerTexture("sign_option", new Texture("gui/sign_option.png",{}));
        Textures.registerTexture("sign_more", new Texture("gui/sign_more.png",{}));
        Textures.registerTexture("white_screen", new Texture("white.png",{}));
        Textures.registerTexture("map_paper", new Texture("item/map.png",{}));
        Textures.registerTexture("gsk_paper", new Texture("gui/gsk_paper.png",{}));
        Textures.registerTexture("back_button", new Texture("gui/back_button.png",{}));
        Textures.registerTexture("back_button_off", new Texture("gui/back_button_off.png",{}));
        Textures.registerTexture("almanac_button", new Texture("gui/almanac_button.png",{}));
        Textures.registerTexture("almanac_button_off", new Texture("gui/almanac_button_off.png",{}));
        Textures.registerTexture("settings_button", new Texture("gui/settings_button.png",{}));
        Textures.registerTexture("settings_button_off", new Texture("gui/settings_button_off.png",{}));
        Textures.registerTexture("star_shard_frame0", new Texture("gui/star_shard_frame/0.png",{}));
        Textures.registerTexture("star_shard_frame1", new Texture("gui/star_shard_frame/1.png",{}));
        Textures.registerTexture("star_shard_frame2", new Texture("gui/star_shard_frame/2.png",{}));
        Textures.registerTexture("star_shard_frame3", new Texture("gui/star_shard_frame/3.png",{}));
        Textures.registerTexture("star_shard_frame4", new Texture("gui/star_shard_frame/4.png",{}));
        Textures.registerTexture("star_shard_frame5", new Texture("gui/star_shard_frame/5.png",{}));
        Textures.registerTexture("star_shard_frame6", new Texture("gui/star_shard_frame/6.png",{}));
        Textures.registerTexture("star_shard_frame7", new Texture("gui/star_shard_frame/7.png",{}));
        Textures.registerTexture("star_shard_frame8", new Texture("gui/star_shard_frame/8.png",{}));
        Textures.registerTexture("star_shard_frame9", new Texture("gui/star_shard_frame/9.png",{}));
        Textures.registerTexture("star_shard_frame10", new Texture("gui/star_shard_frame/10.png",{}));
        Textures.registerTexture("star_shard_frame11", new Texture("gui/star_shard_frame/11.png",{}));
        Textures.registerTexture("card_selector", new Texture("gui/card_selector.png",{}));
        Textures.registerTexture("page_button_on", new Texture("gui/page_button/on.png",{}));
        Textures.registerTexture("page_button_off", new Texture("gui/page_button/off.png",{}));
        Textures.registerTexture("page_button_disabled", new Texture("gui/page_button/disabled.png",{}));
        // UI
        Textures.registerTexture("ui_power_laptop", new Texture("gui/ui_power_laptop.png",{}));
        Textures.registerTexture("mine", new Texture("gui/mine.png",{
            "sliceX": 3,
            "anims": {
                "normal": 0,
                "start": {
                    "from": 1,
                    "to": 2,
                    "loop": true
                }
            }
        }));
        Textures.registerTexture("pickaxe_slot", new Texture("gui/pickaxe_slot.png",{}));
        Textures.registerTexture("delete_slot", new Texture("gui/delete_slot.png",{}));
        Textures.registerTexture("final_wave", new Texture("gui/final_wave.png",{}));
        Textures.registerTexture("huge_wave", new Texture("gui/huge_wave.png",{}));
        Textures.registerTexture("lose", new Texture("gui/lose.png",{}));
        Textures.registerTexture("gem_bar", new Texture("gui/gem_bar.png",{}));
        // 地图按钮
        Textures.registerTexture("map_button_0", new Texture("gui/level_button/0.png",{}));
        Textures.registerTexture("map_button_1", new Texture("gui/level_button/1.png",{}));
        Textures.registerTexture("map_button_2", new Texture("gui/level_button/2.png",{}));
        Textures.registerTexture("map_button_3", new Texture("gui/level_button/3.png",{}));
        Textures.registerTexture("map_button_4", new Texture("gui/level_button/4.png",{}));

        // 游戏内
        Textures.registerTexture("ready_3", new Texture("gui/ready/3.png",{}));
        Textures.registerTexture("ready_2", new Texture("gui/ready/2.png",{}));
        Textures.registerTexture("ready_1", new Texture("gui/ready/1.png",{}));
        Textures.registerTexture("ui_pause", new Texture("gui/ui_pause.png",{}));
        Textures.registerTexture("exploded_dirt", new Texture("gui/exploded_dirt.png",{}));
        // 其他
        Textures.registerTexture("caps", new Texture("zombie/caps.png",{
            "sliceX": 16,
            "anims": {
                "s0": 0,
                "s1": 1,
                "s2": 2,
            }
        }));
        Textures.registerTexture("iron_helmet", new Texture("zombie/iron_helmet.png",{
            "sliceX": 16,
            "anims": {
                "s0": 0,
                "s1": 1,
                "s2": 2,
            }
        }));
        Textures.registerTexture("flag", new Texture("zombie/flag.png",{
            "sliceX": 16,
            "anims": {
                "s0": 0,
                "s1": 1,
            }
        }));
        Textures.registerTexture("bow", new Texture("zombie/bow.png",{}));
        // 调试材质
        Textures.registerTexture("place_block", new Texture("block.png",{}));
        Textures.registerTexture("void", new Texture("void.png",{}));
        // 物品
        Textures.registerTexture("redstone", new Texture("item/redstone.png",{}));
        Textures.registerTexture("pickaxe", new Texture("item/pickaxe.png",{}));
        Textures.registerTexture("card_laptop", new Texture("item/card_laptop.png",{}));
        Textures.registerTexture("star_shard/0", new Texture("item/star_shard/0.png",{}));
        Textures.registerTexture("star_shard/1", new Texture("item/star_shard/1.png",{}));
        Textures.registerTexture("star_shard/2", new Texture("item/star_shard/2.png",{}));
        Textures.registerTexture("star_shard/3", new Texture("item/star_shard/3.png",{}));
        Textures.registerTexture("trolley/0", new Texture("item/trolley/0.png",{}));
        Textures.registerTexture("trolley/1", new Texture("item/trolley/1.png",{}));
        Textures.registerTexture("trolley/2", new Texture("item/trolley/2.png",{}));
        Textures.registerTexture("trolley/3", new Texture("item/trolley/3.png",{}));
        Textures.registerTexture("trolley/4", new Texture("item/trolley/4.png",{}));
        Textures.registerTexture("trolley/5", new Texture("item/trolley/5.png",{}));
        Textures.registerTexture("emerald", new Texture("item/emerald.png",{}));
        Textures.registerTexture("ruby", new Texture("item/ruby.png",{}));
        Textures.registerTexture("gold_emerald", new Texture("item/gold_emerald.png",{}));
        Textures.registerTexture("diamond", new Texture("item/diamond.png",{}));
        Textures.registerTexture("sword", new Texture("item/sword.png",{}));
        // 关卡
        Textures.registerTexture("level/your_garden", new Texture("level/world0.png",{}));
        // 角色
        Textures.registerTexture("character/villager", new Texture("character/villager.png",{}));
        // 地图

        // 解编码器
        Textures.codecsTexture();
    }
    static codecsTexture() {
        Textures.ENTITIES_CODECS.push(Textures.initCodecsEntities("/resources/data/plants.json"));
        Textures.ENTITIES_CODECS.push(Textures.initCodecsEntities("/resources/data/zombies.json"));
    }
    static initCodecs(input) {
        Textures.CODECS.push(new JsonCodecs(input).apply((object) => {
            let textures = object["textures"];
            textures.forEach((texture) => {
                let key = texture["key"];
                let value = texture["value"];
                let props = texture["props"];
                try {
                    KaplayLogger.log("TextureManager",`Texture ${key}::${value} was loaded successfully`);
                    loadSprite(key, value, props);
                } catch (error) {
                    KaplayLogger.warn("TextureManager",`Unable to load Texture ${key}, cause type is not Texture`);
                    KaplayLogger.warn("TextureManager",value);
                    loadSprite(key, `/resources/textures/lostTexture.png`, {});
                }
            });
        }));
    }
    static initCodecsEntities(input) {
        return new JsonCodecs(input).apply((object) => {
            let registryKey = object["registry_key"];
            let registries = object["registries"];
            registries.forEach((regObj) => {
                let key = regObj["key"];
                let value = regObj["value"];
                new JsonCodecs(value).apply((object) => {
                    let identifier = object["identifier"];
                    let type = object["type"];
                    let resourcesKey = object["resources"];
                    let key = `${type}/${identifier}`;
                    let key2 = `displayed/${type}/${identifier}`;
                    let value = resourcesKey["texture"];
                    let value2 = resourcesKey["display"];
                    let properties = resourcesKey["properties"] || {};
                    try {
                        Registries.CODECS.get(Registries.TEXTURE).register(identifier,object);
                        loadSprite(key, value, properties);
                        loadSprite(key2, value2, {});
                        KaplayLogger.log("TextureManager",`Texture ${key}::${value} was loaded successfully`);
                    } catch (error) {
                        loadSprite(key, `/resources/textures/lostTexture.png`, properties);
                        loadSprite(key2, `/resources/textures/lostTexture.png`, {});
                        KaplayLogger.warn("TextureManager",`Unable to load Texture ${key}, cause type is not Texture`);
                        KaplayLogger.warn("TextureManager",value);
                    }
                });

            })
        });
    }
    static registerTexture(key,value) {
        return Registry.register(Registries.TEXTURE, key, value)
    }

}