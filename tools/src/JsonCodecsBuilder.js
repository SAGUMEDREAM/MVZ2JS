class JsonCodecsBuilder {
    divElement;
    data = {};
    registryContainer = {};
    dialogData = {};
    worldLevel = {}
    constructor() {
    }
    setOutput(divElement,divElement2) {
        this.divElement = divElement;
    }
    getInputCtx(key) {
        let value = document.querySelector(`.${key}`).value.trim()
        if(value === '') {
            return null;
        } else {
            return value;
        }
    }
    getCheckedCtx(key) {
        return document.querySelector(`.${key}`).checked;
    }
    getArray(key) {
        let value = document.querySelector(`.${key}`).value.trim();
        if (value === '') {
            return [];
        } else {
            let result = value.split('|').map(item => {
                let num = parseFloat(item.trim());
                return isNaN(num) ? item.trim() : num;
            });
            return result;
        }
    }
    forArray(string) {
        let items = string.split('|').map(item => {
            let trimmedItem = item.trim();
            let num = parseFloat(trimmedItem);
            return isNaN(num) ? trimmedItem : num;
        });
        return items;
    }
    getEach(keyHeader) {
        let result;
        return result;
    }
    getsData() {
        this.data["name"] = this.getInputCtx("name") || "测试关卡";
        this.data["identifier"] = this.getInputCtx("identifier") || "Identifier";
        this.data["author"] = this.getInputCtx("author") || "YOUR_NANE";
        this.data["daytime"] = this.getCheckedCtx("daytime") || true;
        this.data["conveyor_belt"] = this.getCheckedCtx("conveyor_belt") || false;
        this.data["has_boss"] = this.getCheckedCtx("isBossLevel") || false;
        this.data["wave_point"] = this.getInputCtx("wave_point") || 0;
        this.data["speed"] = this.getInputCtx("speed") || 1.0;
        this.data["big_wave_flags"] = this.getArray("big_wave_flags") || [];
        this.data["drops"] = this.getInputCtx("drops") || null;
        this.data["maximum_half"] = this.getInputCtx("maximum_half") || 0.60;
        this.data["minimum_half"] = this.getInputCtx("minimum_half") || 0.52;
        this.data["cards"] = {};
        this.data["cards"]["fixed"] = this.getCheckedCtx("fixed") || false;
        this.data["cards"]["list"] = this.getArray("list") || [];
        this.data["zombies"] = { "static": [], "dynamic": [] }
        const staticElements = document.querySelectorAll('.static_zombie .static_element');
        staticElements.forEach((element, index) => {
            let wave = index;
            let poolString = element.querySelector(".input-text.pool").value;
            let object = {
                "wave": wave,
                "pool": this.forArray(poolString)
            }
            this.data["zombies"]["static"].push(object);
        });
        const dynamicElements = document.querySelectorAll('.dynamic_zombie .dynamic_element');
        dynamicElements.forEach((element, index) => {
            let wavePoint = element.querySelector(".input-text.wave_point").value;
            let entitiesString = element.querySelector(".input-text.entities").value;
            let entities = this.forArray(entitiesString);
            let object = {
                "wave": index,
                "wave_point": wavePoint,
                "entities": entities
            }
            this.data["zombies"]["dynamic"].push(object);
        });
        this.data["scripts"] = this.getInputCtx("scripts") || [];
        this.data["boss"] = this.getInputCtx("boss") || null;

        this.registryContainer = {};
        this.registryContainer["registry_key"] = "LEVEL";
        this.registryContainer["registries"] = [];
        this.registryContainer["registries"].push(
            {
                "key": this.data["identifier"],
                "value": `/resources/data/level/${this.data["identifier"]}.json`
            }
        )
    }
    getsDialogData() {
        this.dialogData = {};
        this.dialogData["type"] = "DIALOG";
        this.dialogData["identifier"] = this.getInputCtx("identifier") || "Identifier";
        this.dialogData["dialogs"] = [];
        let dialogs = document.querySelectorAll('.dialogs .dialog');
        dialogs.forEach((element, index) => {
            let name = this.getInputCtx("name") || "";
            let toward = document.getElementById('toward').value || "left";
            let texture = this.getInputCtx("texture") || "";
            let text = this.getInputCtx("text") || "";
            let sound = this.getInputCtx("sound") || null;
            let object = {
                "name": name,
                "toward": toward,
                "texture": texture,
                "text": text,
                "sound": sound
            };
            this.dialogData["dialogs"].push(object);
        });
        this.registryContainer = {};
        this.registryContainer["registry_key"] = "LEVEL";
        this.registryContainer["registries"] = [];
        this.registryContainer["registries"].push(
            {
                "key": this.dialogData["identifier"],
                "value": `/resources/data/dialog/${this.dialogData["identifier"]}.json`
            }
        )
        let dialogJson = document.querySelector(".DIALOG_JSON");
        let registryJson = document.querySelector(".REGISTRY_JSON");
        dialogJson.innerHTML = `文件：/resources/data/dialog/${this.dialogData["identifier"]}.json`;
        registryJson.innerHTML = `文件：/resources/data/dialogs.json`;
        this.divElement[0].value = JSON.stringify(this.dialogData, null, 2);
        this.divElement[1].value = JSON.stringify(this.registryContainer, null, 2);
    }
    generateDialogData() {
        this.getsDialogData();
    }
    generate() {
        this.getsData();
        let levelJson = document.querySelector(".LEVEL_JSON");
        let registryJson = document.querySelector(".REGISTRY_JSON");
        levelJson.innerHTML = `文件：/resources/data/level/${this.data["identifier"]}.json`;
        registryJson.innerHTML = `文件：/resources/data/levels.json`;
        this.divElement[0].value = JSON.stringify(this.data, null, 2);
        this.divElement[1].value = JSON.stringify(this.registryContainer, null, 2);
    }
}