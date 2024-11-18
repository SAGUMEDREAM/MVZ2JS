import {Constants} from "/src/client/Client.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";

export class Profile {
    constructor(username, online_mode) {
        this.username = username;
        this.online_mode = online_mode;
        this.data = {};
    }

    setData(data) {
        this.data = data;
        return this;
    }

    getData() {
        return this.data;
    }

    getUsername() {
        return this.username;
    }

    getOnlineMode() {
        return this.online_mode;
    }
}

export class GameProfile extends Profile {
    constructor(username) {
        super(username, false);
    }
}

export class ProfileManager {
    static manager = this.prototype;
    static currentProfile = null;
    static gameProfiles = {};

    constructor() {
        this.init();
    }

    init() {
        if(localStorage.getItem("gameProfileData") != null) {
            ProfileManager.gameProfiles = JSON.parse(localStorage.getItem("gameProfileData"));
            ProfileManager.currentProfile = localStorage.getItem("currentProfile");
        } else {
            ProfileManager.gameProfiles["player"] = this.getDefaultData("player");
            ProfileManager.currentProfile = "player";
            this.saveData();
        }
        ProfileManager.manager = this;
        window.ProfileManager = ProfileManager;
    }

    saveData() {
        localStorage.setItem("currentProfile", ProfileManager.currentProfile);
        localStorage.setItem("gameProfileData", JSON.stringify(ProfileManager.gameProfiles));
    }
    addProfile(name) {
        if (ProfileManager.gameProfiles[name] != null) {
            console.error(`Username ${name} already exists`);
            return;
        }
        ProfileManager.gameProfiles[name] = this.getDefaultData(name);
        this.saveData();
    }
    createProfile(name) {
        return this.getDefaultData(name);
    }

    renameProfile(oldName, newName) {
        if (ProfileManager.gameProfiles[oldName] == null) {
            console.error(`Unknown username ${oldName}`);
            return;
        }
        if (ProfileManager.gameProfiles[newName] != null) {
            console.error(`Username ${newName} already exists`);
            return;
        }
        // 重命名用户
        ProfileManager.gameProfiles[newName] = ProfileManager.gameProfiles[oldName];
        ProfileManager.gameProfiles[newName].username = newName;
        delete ProfileManager.gameProfiles[oldName];

        // 更新当前配置文件，如果正在更改当前活动的配置文件
        if (ProfileManager.currentProfile === oldName) {
            ProfileManager.currentProfile = newName;
        }
        this.saveData();
    }

    deleteProfile(name) {
        if (ProfileManager.gameProfiles[name] == null) {
            console.error(`Unknown username ${name}`);
            return;
        }
        delete ProfileManager.gameProfiles[name];

        if (ProfileManager.currentProfile === name) {
            ProfileManager.currentProfile = null;
        }

        if (Object.keys(ProfileManager.gameProfiles).length === 0) {
            ProfileManager.gameProfiles["player"] = this.getDefaultData("player");
            ProfileManager.currentProfile = "player";
        } else {
            if (ProfileManager.currentProfile === null) {
                ProfileManager.currentProfile = Object.keys(ProfileManager.gameProfiles)[0];
            }
        }
        this.saveData();
    }

    switchProfile(name) {
        if (ProfileManager.gameProfiles[name] == null) {
            console.error(`Unknown username ${name}`);
            return;
        }
        ProfileManager.currentProfile = name;
        this.saveData();
    }

    getData() {
        return ProfileManager.gameProfiles[ProfileManager.currentProfile];
    }

    getDefaultData(username) {
        return {
            username: username,
            online_mode: false,
            game_data: {
                achievements: [],
                plants: Constants.defaultPlant,
                levels: [],
                card_slot: 6,
                star_shard_max_stack: 3,
                currency: 0,
                has_map: false,
                has_book: false,
                has_shop: false,
                has_music_room: false
            },
            settings: {
                music_volume: 1.0,
                sound_volume: 1.0,
                difficulty: "EASY"
            }
        };
    }
}
