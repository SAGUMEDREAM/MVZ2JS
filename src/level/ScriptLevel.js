import {Registries, Registry} from "/src/registry/Registry.js";
import {LevelProperties, WorldProperties} from "/src/util/Properties.js";
import {Info} from "/src/util/old/Info.js";
import {KaplayLogger} from "/src/client/Client.js";
import {random, randomInt} from "/src/util/Math.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";

export class ScriptLevel {
    script = [
        (line) => {},
    ];
    boss = null;
    firstScriptRuntime = 20;
    scriptLength = 0;
    properties = null;
    wave = 0;
    timerTicks = 0;
    timerSeconds = 0;
    allZombieHealth = 10;
    allZombieMaxHealth = 10;
    stopScript = false;
    loop0 = null;
    loop1 = null;
    pauseLoop0 = false;
    pauseLoop1 = false;
    naturalTime = { min: 20, max: 25 };
    bigWaveTime = { min: 35, max: 40 };
    spawnTime = 0;
    isBigWave = false;
    canLose = true;
    constructor(properties) {
        this.properties = properties;
        this.initProperties();
    }
    init() {
        this.run();
        this.scriptLength = this.script.length - 1;
        wait(this.firstScriptRuntime, () => {
            this.updateNextSpawnTime();
            this.tick();
        })
    }
    run() {}
    initProperties() {
        if(this.properties instanceof LevelProperties) {
        } else {
            KaplayLogger.warn("LevelManager",`Properties type error: ${this.properties}::${this}`)
            this.properties = new LevelProperties();
            this.initProperties();
        }
    }
    async tick() {
        this.loop0 = loop(0.1, () => {
            if(this.pauseLoop0) {
                return;
            }
            if(this.stopScript) {
                if(this.boss != null && this.boss instanceof Function) {
                    this.boss();
                }
                this.stopLoop();
                return;
            }
            this.timerTicks++;
            if(this.timerTicks>=1) {
                this.timerTicks = 0;
                this.timerSeconds++;
            }
        });
        this.loop1 = loop(1, () => {
            if(this.pauseLoop1) {
                return;
            }
            if(this.stopScript) {
                return;
            }
            let HealthRatio = this.getAllZombieHealth();
            if(HealthRatio<=0.50) {
                this.pauseLoop1 = true;
                wait(random(4,5),() => {
                    this.nextWave();
                    this.pauseLoop1 = false;
                });
            } else if(this.timerSeconds >= this.spawnTime) {
                this.nextWave();
            }
        });
    }
    nextWave() {
        this.timerTicks = 0;
        this.timerSeconds = 0;
        this.updateNextSpawnTime();
        let runScript = this.script[this.wave];
        if(runScript != null) {
            let info = runScript();
            if(info instanceof Info) {
                let infoCtx = info.getInfo()
                if(infoCtx==="bigWave") {
                    this.updateNextBigWaveSpawnTime();
                } else if(infoCtx==="end") {
                    this.win();
                    return;
                }
            }
        }
        this.wave++;
    }
    updateNextSpawnTime() {
        this.spawnTime = random(this.naturalTime.min,this.naturalTime.max);
    }
    updateNextBigWaveSpawnTime() {
        this.spawnTime = random(this.bigWaveTime.min,this.bigWaveTime.max);
    }
    runLevel() {}
    win() {}
    lose() {
        if(this.canLose) {
            SoundLoader.playSound("lose");
        }
    }
    exitLevel() {}
    stopLoop() {
        if(this.loop0!=null) {
            this.loop0.cancel();
            this.loop0 = null;
        }
        if(this.loop1!=null) {
            this.loop1.cancel();
            this.loop1 = null;
        }
    }
    getAllZombieHealth() {
        let zombie = get("entity_zombie");
        this.allZombieHealth = 0;
        this.allZombieMaxHealth = 0;
        zombie.forEach(entity => {
            if(entity) {
                if(entity.entity_instance) {
                    if(entity.entity_instance.getHealth != null && entity.entity_instance.getMaxHealth != null) {
                        this.allZombieHealth += entity.entity_instance.getHealth();
                        this.allZombieMaxHealth += entity.entity_instance.getMaxHealth();
                    }
                }
            }
        });
        if(this.allZombieMaxHealth === 0) {
            this.allZombieHealth = 100;
            this.allZombieMaxHealth = 100;
        }
        return (Math.abs(this.allZombieHealth) / Math.abs(this.allZombieMaxHealth)).toFixed(2);
    }
    getLevel() {
        return this;
    }
}


