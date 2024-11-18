import {Registries, Registry} from "/src/registry/Registry.js";
import {KaplayLogger} from "/src/client/Client.js";
import {Levels} from "/src/level/Levels.js";
import {JsonCodecs} from "../registry/Codecs.js";
import {SoundParser} from "./SoundParser.js";

export class SoundLoader {
    constructor() {
    }
    static CODECS = [];
    static music_stage1;
    static music_stage2;
    static music_volume = 1.0;
    static sound_volume = 1.0;
    static stage = 1;
    static playSound(soundType) {
        if(soundType == null) return null;
        let player;
        try {
            player = play(soundType, { speed: 1.0, volume: SoundLoader.sound_volume })
        } catch (error) {
            KaplayLogger.error(`Can't play sound ${soundType}`)
        }
        return player;
    }
    static playSoundByVolume(soundType,volume = 1.0) {
        if(soundType == null) return null;
        let player;
        try {
            player = play(soundType, { speed: 1.0, volume: volume * SoundLoader.sound_volume })
        } catch (error) {
            KaplayLogger.error(`Can't play sound ${soundType}`)
        }
        return player;
    }
    static stopSingleMusic() {
        if(Levels.MUSIC_PLAYER != null) if(Levels.MUSIC_PLAYER.stop != null) {
            Levels.MUSIC_PLAYER.stop();
        }
    }
    static playSingleMusic(soundType) {
        let player;
        if(Levels.MUSIC_PLAYER != null) if(Levels.MUSIC_PLAYER.stop != null) {
            Levels.MUSIC_PLAYER.stop();
        }
        try {
            player = play(soundType, {
                speed: 1.0,
                volume: SoundLoader.music_volume,
                loop: true
            });
            player.name = soundType;
            player.NAME = soundType;
        } catch (error) {
            KaplayLogger.error(`Can't play sound ${soundType}`)
        }
        Levels.MUSIC_PLAYER = player;
        return player;
    }
    static playMusic(music_stage1,music_stage2) {
        if(music_stage2 == null) {
            music_stage2 = music_stage1;
        }
        if(SoundLoader.music_stage1) {
            SoundLoader.music_stage1.stop();
        }
        if(SoundLoader.music_stage2) {
            SoundLoader.music_stage2.stop();
        }
        SoundLoader.music_stage1 = play(music_stage1, {
            volume: SoundLoader.music_volume,
            loop: true
        });
        SoundLoader.music_stage2 = play(music_stage2, {
            volume: 0,
            loop: true
        });
        SoundLoader.stage = 1;
        return [SoundLoader.music_stage1, SoundLoader.music_stage2];
    }
    static changeStage() {
        let setVolume = (music, volume) => {
            if (music != null) {
                music.volume = volume;
            }
        };
        if (SoundLoader.stage === 1) {
            setVolume(SoundLoader.music_stage1, 0);
            setVolume(SoundLoader.music_stage2, 1.0);
            SoundLoader.stage = 2;
        } else {
            setVolume(SoundLoader.music_stage1, 1.0);
            setVolume(SoundLoader.music_stage2, 0);
            SoundLoader.stage = 1;
        }
    }

    init() {
        Registry.register(Registries.SOUND,"evillaugh","evillaugh.wav");
        Registry.register(Registries.SOUND,"click","click.wav");
        Registry.register(Registries.SOUND,"lose","lose.wav");
        Registry.register(Registries.SOUND,"nooooo","nooooo.wav");
        Registry.register(Registries.SOUND,"buzzer","buzzer.wav");
        Registry.register(Registries.SOUND,"ready","ready.wav");
        Registry.register(Registries.SOUND,"picking_plant","picking_plant.wav");
        Registry.register(Registries.SOUND,"pause","pause.wav");
        Registry.register(Registries.SOUND,"dirt_rise","dirt_rise.wav");
        Registry.register(Registries.SOUND,"mine_explosion","mine_explosion.wav");
        Registry.register(Registries.SOUND,"throw","throw.wav");
        Registry.register(Registries.SOUND,"redstone_click","redstone_click.wav");
        Registry.register(Registries.SOUND,"zombie_coming","zombie_coming.wav");
        Registry.register(Registries.SOUND,"shovel","shovel.wav");
        Registry.register(Registries.SOUND,"tap","tap.wav");
        Registry.register(Registries.SOUND,"paper","paper.wav");
        Registry.register(Registries.SOUND,"win","win.wav");
        Registry.register(Registries.SOUND,"huge_wave","huge_wave.wav");
        Registry.register(Registries.SOUND,"final_wave","final_wave.wav");
        Registry.register(Registries.SOUND,"spell_card","spell_card.wav");
        Registry.register(Registries.SOUND,"weeder","weeder.wav");
        Registry.register(Registries.SOUND,"star_shard_appear","star_shard_appear.wav");
        Registry.register(Registries.SOUND,"star_shard_use","star_shard_use.wav");
        Registry.register(Registries.SOUND,"coin","coin.wav");
        Registry.register(Registries.SOUND,"piston_in","piston_in.wav");
        Registry.register(Registries.SOUND,"piston_out","piston_out.wav");
        Registry.register(Registries.SOUND,"magical","magical.wav");
        Registry.register(Registries.SOUND,"fire","fire.wav");
        Registry.register(Registries.SOUND,"money_fall","money_fall.wav");
        Registry.register(Registries.SOUND,"chime","chime.wav");
        Registry.register(Registries.SOUND,"chest_close","chest_close.wav");
        Registry.register(Registries.SOUND,"fireball","fireball.wav");
        Registry.register(Registries.SOUND,"swing","swing.wav");

        Registry.register(Registries.SOUND,"crazy","villager/crazy.wav");
        Registry.register(Registries.SOUND,"el1","villager/el1.wav");
        Registry.register(Registries.SOUND,"el2","villager/el2.wav");
        Registry.register(Registries.SOUND,"el3","villager/el3.wav");
        Registry.register(Registries.SOUND,"l1","villager/l1.wav");
        Registry.register(Registries.SOUND,"l2","villager/l2.wav");
        Registry.register(Registries.SOUND,"l3","villager/l3.wav");
        Registry.register(Registries.SOUND,"sc1","villager/sc1.wav");
        Registry.register(Registries.SOUND,"sc2","villager/sc2.wav");
        Registry.register(Registries.SOUND,"vs1","villager/vs1.wav");
        Registry.register(Registries.SOUND,"vs2","villager/vs2.wav");
        Registry.register(Registries.SOUND,"vs3","villager/vs3.wav");

        Registry.register(Registries.SOUND,"grasswalk","music/grasswalk.mp3");
        Registry.register(Registries.SOUND,"grazy_dave","music/grazy_dave.mp3");
        Registry.register(Registries.SOUND,"choose_your_seeds","music/choose_your_seeds.mp3");
        Registry.register(Registries.SOUND,"halloween","music/halloween.mp3");
        Registry.register(Registries.SOUND,"halloween_map","music/halloween_map.mp3");
        Registry.register(Registries.SOUND,"minigame","music/minigame.mp3");
        Registry.register(Registries.SOUND,"ultimate_battle","music/ultimate_battle.mp3");
        Registry.register(Registries.SOUND,"frankenstein","music/frankenstein.mp3");
        Registry.register(Registries.SOUND,"dreamland","music/dreamland.mp3");
        Registry.register(Registries.SOUND,"dreamland_map","music/dreamland_map.mp3");
        Registry.register(Registries.SOUND,"repentant","music/repentant.mp3");
        Registry.register(Registries.SOUND,"agony","music/agony.mp3");
        Registry.register(Registries.SOUND,"the_mysterious_shrine_maiden_flying_through_space","music/the_mysterious_shrine_maiden_flying_through_space.mp3");
        Registry.register(Registries.SOUND,"pandemonic_planet","music/pandemonic_planet.mp3");
        Registry.register(Registries.SOUND,"dreamland_night","music/dreamland_night.mp3");
        Registry.register(Registries.SOUND,"dreamland_night2","music/dreamland_night2.mp3");
        Registry.register(Registries.SOUND,"gensokyo","music/gensokyo.mp3");

        SoundParser.init();
    }
    static initCodecs(input) {
        SoundLoader.CODECS.push(new JsonCodecs(input).apply((object) => {
            let sounds = object["sounds"];
            sounds.forEach((sound) => {
                let key = sound["key"];
                let value = sound["value"];
                try {
                    loadSound(key, value);
                    KaplayLogger.log("SoundManager",`Sound ${key}::${value} was loaded successfully`);
                } catch (error) {
                    KaplayLogger.error("SoundManager",`Unable to load Sound ${key}`);
                    KaplayLogger.error("SoundManager",value);
                }
            });
        }));
    }
}