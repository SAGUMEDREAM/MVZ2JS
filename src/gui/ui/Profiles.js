import {SoundLoader} from "/src/sound/SoundLoader.js";
import {ProfileManager} from "/src/util/GameProfile.js";
import {Constants} from "/src/client/Client.js";
import {Encryption} from "/src/util/Encryption.js";
import {copyTextToClipboard} from "/src/util/Utils.js";

export class Profiles {
    htmlDocument;
    selectDocument;
    currentUser;
    userList = [];
    constructor() {
    }
    update() {
        this.selectDocument.innerHTML = "";
        this.currentUser = ProfileManager.manager.getData()["username"];
        this.userList = Object.keys(ProfileManager.gameProfiles);
        this.userList.forEach((username) => {
            const option = document.createElement("option");
            option.value = username;
            option.text = username;
            this.selectDocument.add(option);
        });
        this.selectDocument.value = this.currentUser;
    }
    init() {
        this.htmlDocument = document.querySelector(".profiles");
        this.selectDocument = this.htmlDocument.querySelector(".profile_select");
        this.btnAddUser = document.querySelector(".pbBtnAddUser");
        this.btnRename = document.querySelector(".pbBtnRename");
        this.btnDelete = document.querySelector(".pbBtnDelete");
        this.btnChange = document.querySelector(".pbBtnChange");
        this.btnCancel = document.querySelector(".pbBtnCancel");
        this.btnImportProfile = document.querySelector(".pbImportProfile");
        this.btnExportProfile = document.querySelector(".pbExportProfile");
        this.update();
        this.addUserHandler = () => {
            SoundLoader.playSound("click");
            let userInput = prompt("请输入创建的用户名：");
            if (userInput !== null && userInput != "" && ProfileManager.gameProfiles[userInput] == null) {
                ProfileManager.manager.addProfile(userInput);
            }
            this.update();
        };
        this.renameHandler = () => {
            SoundLoader.playSound("click");
            let userInput = prompt("请输入新的名字：");
            let username = this.selectDocument.value;
            if (userInput !== null && userInput != "" && ProfileManager.gameProfiles[username]) {
                ProfileManager.manager.renameProfile(username,userInput);
            }
            this.update();
        };
        this.deleteHandler = () => {
            SoundLoader.playSound("click");
            let username = this.selectDocument.value;
            let conf = confirm(`请确认要删除用户${username}？`);
            if(conf) {
                ProfileManager.manager.deleteProfile(username);
            }
            this.update();
        };
        this.changeHandler = () => {
            SoundLoader.playSound("click");
            let username = this.selectDocument.value;
            ProfileManager.manager.switchProfile(username);
            this.hidden();
            this.update();
        };
        this.cancelHandler = () => {
            SoundLoader.playSound("click");
            this.hidden();
            this.update();
        };
        this.importProfileHandler = () => {
            SoundLoader.playSound("click");
            let code = window.prompt('请输入存档代码:', '');
            if (code) {
                try {
                    let decryptCode = Encryption.decode(code);
                    let exportObjectPattern = /^!profile_export<([^>]+)>(.*)$/;
                    let match = decryptCode.match(exportObjectPattern);
                    if (match) {
                        let username = match[1];
                        let exportData = match[2];
                        let profileData = JSON.parse(exportData);
                        ProfileManager.gameProfiles[username] = profileData;
                        window.alert(`存档 ${username} 导入成功`);
                    } else {
                        window.alert('存档代码格式不正确');
                    }
                } catch (error) {
                    window.alert('导入存档失败，请检查并重试');
                }
            }
            this.update();
        };
        this.exportProfileHandler = () => {
            SoundLoader.playSound("click");
            let data = ProfileManager.manager.getData();
            let username = data["username"];
            let exportObject = JSON.stringify(data);
            let exportData = `!profile_export<${username}>${exportObject}`;
            let encryptCode = Encryption.encode(exportData);
            copyTextToClipboard(encryptCode);
            window.alert("存档代码已复制至剪切板");
            this.update();
        };
        this.btnAddUser.addEventListener('click',this.addUserHandler);
        this.btnRename.addEventListener('click',this.renameHandler);
        this.btnDelete.addEventListener('click',this.deleteHandler);
        this.btnChange.addEventListener('click',this.changeHandler);
        this.btnCancel.addEventListener('click',this.cancelHandler);
        this.btnImportProfile.addEventListener('click',this.importProfileHandler);
        this.btnExportProfile.addEventListener('click',this.exportProfileHandler);
    }
    getSelect() {
        return this.selectDocument.value;
    }
    display() {
        htmlTool.display();
        this.htmlDocument.style.display = "block";
        this.update();
    }
    hidden() {
        htmlTool.hidden();
        this.htmlDocument.style.display = "none";
    }
}