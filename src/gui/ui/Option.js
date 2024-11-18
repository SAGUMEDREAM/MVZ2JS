import {Constants} from "../../client/Client.js";
import {SoundLoader} from "../../sound/SoundLoader.js";
import {Levels} from "../../level/Levels.js";
import {Worlds} from "../../world/Worlds.js";
import {Scenes} from "../Scenes.js";
import {WorldLevel} from "../../level/WorldLevel.js";
import {ProfileManager} from "../../util/GameProfile.js";

export class Option {
    popup;

    constructor() {
    }

    init() {
        let musicVolume = ProfileManager.manager.getData()["settings"]["music_volume"];
        let soundVolume = ProfileManager.manager.getData()["settings"]["sound_volume"];
        this.popup = document.querySelector(".popup");
        const volumeSlider = document.getElementById('volume-slider');
        const effectSlider = document.getElementById('effect-slider');
        const volumeValue = document.getElementById('volume-value');
        const effectValue = document.getElementById('effect-value');

        volumeSlider.value = musicVolume * 100;
        volumeValue.textContent = (musicVolume * 100) + '%';

        effectSlider.value = soundVolume * 100;
        effectValue.textContent = (soundVolume * 100) + '%';

        volumeSlider.addEventListener('input', function(event) {
            let volumeValuePercentage = event.target.value;
            let result = volumeValuePercentage / 100;
            ProfileManager.manager.getData()["settings"]["music_volume"] = result;
            SoundLoader.music_volume = result;
            volumeValue.textContent = volumeValuePercentage + '%';
            ProfileManager.manager.saveData();
            if(Levels.MUSIC_PLAYER != null) if(Levels.MUSIC_PLAYER.volume != null) {
                Levels.MUSIC_PLAYER.volume = result;
            }
        });

        effectSlider.addEventListener('input', function(event) {
            let effectValuePercentage = event.target.value;
            let result = effectValuePercentage / 100;
            ProfileManager.manager.getData()["settings"]["sound_volume"] = result;
            SoundLoader.sound_volume = result;
            effectValue.textContent = effectValuePercentage + '%';
            ProfileManager.manager.saveData();
        });

        {
            SoundLoader.music_volume = volumeSlider.value / 100;
        }

        document.querySelector('.opBtnFullscreen').addEventListener('click', () => {
            SoundLoader.playSound("click");
            //setFullscreen(!isFullscreen())
            let full = document.fullscreenElement;
            if (!full) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
        document.querySelector('.opBtnDifficulty').addEventListener('click', () => {
            SoundLoader.playSound("click");
        });
        document.querySelector('.opBackToMap').addEventListener('click', () => {
            SoundLoader.playSound("click");
            let game_data = ProfileManager.manager.getData()["game_data"];
            if(debug.paused) debug.paused = false;
            this.hidden();
            if(WorldLevel.currentWorldLevel != null) {
                WorldLevel.currentWorldLevel.endThread();
            }
            if(game_data != null) {
                SoundLoader.stopSingleMusic();
                if(game_data["has_map"] == true) {
                    let cOpenedWorldId = Worlds.currentOpenedWorldId;
                    if(cOpenedWorldId != null) {
                        Worlds.jumpToWorld(cOpenedWorldId);
                    } else {
                        Worlds.jumpToWorld("world1");
                    }
                } else {
                    SoundLoader.playSingleMusic("grazy_dave");
                    Scenes.jumpTo("menu_state0");
                }
            }
        });
        document.querySelector('.opBtnBack').addEventListener('click', () => {
            SoundLoader.playSound("click");
            if(debug.paused) debug.paused = false;
            this.hidden();
        });
    }

    display() {
        htmlTool.display();
        this.popup.style.display = "block";
    }

    hidden() {
        htmlTool.hidden();
        this.popup.style.display = "none";
    }
}
