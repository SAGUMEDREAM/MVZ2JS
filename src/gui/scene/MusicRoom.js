import {Scene} from "/src/gui/Scene.js";
import {Scenes} from "/src/gui/Scenes.js";
import {Registries, Registry} from "/src/registry/Registry.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {Levels} from "/src/level/Levels.js";
import {Text} from "/src/registry/LanguageProvider.js";

export class MusicRoom extends Scene {
    selectedMusic = "";
    musicPlayer;
    loopEvent;
    constructor() {
        super();
    }
    jump() {
        if(Levels.MUSIC_PLAYER.NAME != "choose_your_seeds") {
            SoundLoader.stopSingleMusic();
            SoundLoader.playSingleMusic("choose_your_seeds");
        }
        let guiBackground = add([
            sprite("game_menu/music_room_bg"),
            pos(center()),
            anchor("center"),
            scale(1),
            opacity(1),
        ]);
        this.musicRoom = document.querySelector(".music_room");
        this.musicRoomPlaylist = document.querySelector(".music_room_play_list");
        this.musicRoomPlayBtn = document.querySelector('.play_button');
        this.musicRoomBackBtn = document.querySelector('#return-button2');
        this.musicRoomTitle = document.querySelector(".music_title");
        this.musicRoomPlayingTitle = document.querySelector(".music_playing_title");
        this.musicRoomDescription = document.querySelector(".music_description");
        this.progressText = document.querySelector(".progress");
        this.progressBar = document.querySelector(".progress_bar");
        this.backBtnClickHandler = function() {
            this.close();
        }.bind(this);
        this.playMusicBtnHandler = function () {
            this.playMusicClick();
        }.bind(this);
        this.musicRoomPlaylist.innerHTML = "";
        this.readObject();
        htmlTool.display();
        this.musicRoomPlayBtn.addEventListener('click', this.playMusicBtnHandler);
        this.musicRoomBackBtn.addEventListener('click', this.backBtnClickHandler);
        this.progressBar.addEventListener('input',this.switchTime.bind(this));
        this.musicRoom.style.display = "";
        this.loopEvent = onUpdate(this.update.bind(this));
    }
    readObject() {
        let registryMap = Registries.SOUND.getRegistry();
        let musicArray = [];
        registryMap.forEach((value,key,map) => {
            if(value.includes("music/")) {
                musicArray.push(key);
            }
        });
        musicArray.forEach(identifier => {
            let div = document.createElement("p");
            div.className = "music_element";
            div.innerHTML = Text.translation(`music.${identifier}.name`);
            div.addEventListener("click",() => {
                this.switchSelected(identifier);
            });
            this.musicRoomPlaylist.appendChild(div);
        });
    }
    playMusicClick() {
        SoundLoader.playSound("click");
        if (this.musicPlayer != null) {
            let name = this.musicPlayer.name;
            if(name == this.selectedMusic) {
                this.musicPlayer.paused = !this.musicPlayer.paused;
            } else {
                this.musicPlayer = SoundLoader.playSingleMusic(this.selectedMusic);
            }
        } else {
            this.musicPlayer = SoundLoader.playSingleMusic(this.selectedMusic);
        }
    }
    update() {
        if (this.musicPlayer != null) {
            let name = this.musicPlayer.name;
            this.musicRoomPlayingTitle.innerHTML = `正在播放：${Text.translation(`music.${name}.name`)}`;
            if(this.musicPlayer.name == this.selectedMusic) {
                let time = this.musicPlayer.time();
                let max_time = this.musicPlayer.duration();
                let sString = formatTime(time);
                let sMaxString = formatTime(max_time);
                this.progressText.innerHTML = `${sString} / ${sMaxString}`;
                if (isNaN(max_time)) {
                    return;
                }
                let calTime = (time / max_time) * 400;
                this.progressBar.value = calTime;
            } else {
                this.progressBar.value = 0;
            }
        }
    }
    switchTime() {
        if (this.musicPlayer != null) {
            let max_time = this.musicPlayer.duration();
            let pointTime = this.progressBar.value;
            if (!isNaN(max_time)) {
                let updateTime = (pointTime / 400) * max_time;
                this.musicPlayer.seek(updateTime);
            }
        }
    }
    switchSelected(identifier) {
        SoundLoader.playSound("click");
        let title = Text.translation(`music.${identifier}.name`);
        let description = Text.translation(`music.${identifier}.description`);
        this.musicRoomTitle.innerHTML = title;
        this.musicRoomDescription.innerHTML = description;
        this.selectedMusic = identifier;
    }
    close() {
        this.musicRoomPlayBtn.removeEventListener('click', this.playMusicBtnHandler);
        this.musicRoomBackBtn.removeEventListener('click', this.backBtnClickHandler);
        this.musicRoomPlayingTitle.innerHTML = ``;
        setCursor("auto");
        SoundLoader.playSound("click");
        Scenes.jumpTo("menu_state0");
        htmlTool.hidden();
        this.musicRoom.style.display = "none";
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const formattedSeconds = secs < 10 ? `0${secs}` : secs;
    return `${minutes}:${formattedSeconds}`;
}