import {KaplayLogger} from "../../client/Client.js";

export class Crasher {
    logger;
    constructor() {
    }
    create(error) {
        this.logger = document.querySelector(".logger");
        this.crash_popup = document.querySelector(".crash_popup");
        this.app = document.querySelector(".app");
        let date = new Date();
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');
        let aDay = hours >= 12 ? "上午" : "下午";
        this.logger.innerHTML += `<p>---- Minecraft Vs Zombie II Crash Report ----</p>`;
        this.logger.innerHTML += `<p>// Don't be sad, have a hug! <3</p>`;
        this.logger.innerHTML += `<p></p>`;
        this.logger.innerHTML += `<p>Contact their mod authors BEFORE contacting The Game Developer</p>`;
        this.logger.innerHTML += `<p></p>`;
        this.logger.innerHTML += `<p>${year-2000}-${month}-${day} ${aDay}${hours}:${minutes}</p>`;
        this.logger.innerHTML += `<p>Crash reason:</p>`;
        this.logger.innerHTML += `<p>${error.stack}</p>`;
        this.logger.innerHTML += `<p></p>`;
        this.logger.innerHTML += `<p>A detailed walkthrough of the error, its code path and all known details is as follows:</p>`;
        this.logger.innerHTML += `<p>---------------------------------------------------------------------------------------</p>`;
        KaplayLogger.Logger.forEach(log => {
            this.logger.innerHTML += `<p>${log}</p>`;
        });
        this.app.style.display = "block";
        this.app.style.pointerEvents = "auto";
        this.logger.style.display = "block";
        this.crash_popup.style.display = "block";
    }
}