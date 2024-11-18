import {KaplayLogger} from "/src/client/Client.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Registries, Registry} from "/src/registry/Registry.js";

export class SoundParser {
    static SoundTypes = {
        HIT: ["hit1","hit2","hit3"],
        IRON: ["iron_hit1","iron_hit2"],
        STONE: ["stone1","stone2","stone3","stone4"],
        WOODEN: [],
        GRASS: ["grass1","grass2","grass3"],
        LEATHER: ["leather_hit1","leather_hit2"],
        EXPLOSION: ["explosion0","explosion1","explosion2","explosion3"],
        SLICE: ["slice1","slice2"]
    }
    static playSound(soundType) {
        if(soundType == null) return;
        if(soundType instanceof Array) {
            soundType = soundType[Math.floor(Math.random() * soundType.length)]
        }
        let player;
        try {
            player = play(soundType, { speed: 1.0, volume: SoundLoader.sound_volume * 0.5 });
        } catch (error) {
            KaplayLogger.error(`Can't play sound ${soundType}`);
        }
        return player;
    }
    static registerSound(key, value) {
        return Registry.register(Registries.SOUND, key, value);
    }
    static init() {
        SoundParser.registerSound("hit1","zombie/hit1.wav");
        SoundParser.registerSound("hit2","zombie/hit2.wav");
        SoundParser.registerSound("hit3","zombie/hit3.wav");
        SoundParser.registerSound("leather_hit1","zombie/leather_hit1.wav");
        SoundParser.registerSound("leather_hit2","zombie/leather_hit2.wav");
        SoundParser.registerSound("iron_hit1","zombie/iron_hit1.wav");
        SoundParser.registerSound("iron_hit2","zombie/iron_hit2.wav");
        SoundParser.registerSound("slice1","zombie/slice1.wav");
        SoundParser.registerSound("slice2","zombie/slice2.wav");
        SoundParser.registerSound("zombie_death","zombie/zombie_death.wav");
        SoundParser.registerSound("skeleton_death","skeleton/skeleton_death.wav");
        SoundParser.registerSound("gargoyle_death","gargoyle/gargoyle_death.wav");
        SoundParser.registerSound("stone1","blocks/stone1.wav");
        SoundParser.registerSound("stone2","blocks/stone2.wav");
        SoundParser.registerSound("stone3","blocks/stone3.wav");
        SoundParser.registerSound("stone4","blocks/stone4.wav");
        SoundParser.registerSound("grass1","blocks/grass1.wav");
        SoundParser.registerSound("grass2","blocks/grass2.wav");
        SoundParser.registerSound("grass3","blocks/grass3.wav");
        SoundParser.registerSound("glass1","blocks/glass1.wav");
        SoundParser.registerSound("glass2","blocks/glass2.wav");
        SoundParser.registerSound("glass3","blocks/glass3.wav");
        SoundParser.registerSound("explosion0","blocks/explosion0.wav");
        SoundParser.registerSound("explosion1","blocks/explosion1.wav");
        SoundParser.registerSound("explosion2","blocks/explosion2.wav");
        SoundParser.registerSound("explosion3","blocks/explosion3.wav");
    }
}