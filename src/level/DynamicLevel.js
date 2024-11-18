import {Registries, Registry} from "/src/registry/Registry.js";
import {free, initCommonLevel, initConveyorLevel, scaleTo} from "/src/util/Utils.js";
import {Zombies} from "/src/entity/zombie/Zombies.js";
import {isInRange, random} from "/src/util/Math.js";
import {Constants, KaplayLogger} from "/src/client/Client.js";
import {Redstone} from "/src/item/Redstone.js";
import {SoundLoader} from "/src/sound/SoundLoader.js";
import {ProgressBar} from "../gui/ui/ProgressBar.js";
import {Items} from "../item/Items.js";
import {Worlds} from "../world/Worlds.js";
import {Levels} from "./Levels.js";
import {ProfileManager} from "../util/GameProfile.js";

export class DynamicLevel {
    codecObject = {};
    firstFlagTime = 0;
    isFirst = true;
    wavePoint = 0;
    waves = 0;
    currentWave = -1;
    currentTimer = () => {};
    day_time = true;
    difficulty = "EASY";
    hasBoss = false;
    isConveyor_belt = false;
    identifier = "world_-1_1";
    taskArray = [];
    levelSettings = {};
    big_wave_flags = [];
    properties = {};
    allTypePool = [];
    staticPool = [];
    dynamicPool = [];
    boss = () => {};
    naturalTime = { min: 200, max: 250 };
    bigFlagTime = { min: 350, max: 400 };
    allZombieHealth;
    allZombieMaxHealth;
    timer = 0;
    timer_s = 0;
    rsMine_timer = 0;
    rsMine_timer_const = 75;
    lockTimer = false;
    nextTime = 0;
    drops = null;
    scripts = [];
    lastLine = 0;
    progressBar;
    instance_arr = [];

    constructor(codecObject) {
        this.codecObject = codecObject;
        this.init();
        this.initObject();
        console.log(this);
    }
    init() {this.onInit();}
    onInit() {}
    initObject() {
        this.levelSettings.name =  this.codecObject["name"] || 'Unnamed Level';
        this.levelSettings.identifier =  this.codecObject["identifier"] || 'world_-1_1';
        this.levelSettings.author =  this.codecObject["author"] || 'unofficial author';
        this.levelSettings.speed =  this.codecObject["speed"] || 1.0;
        this.levelSettings.degree_of_difficulty =  this.codecObject["degree_of_difficulty"] || 1.0;
        this.levelSettings.maximum_half =  this.codecObject["maximum_half"] || 0.60;
        this.levelSettings.minimum_half =  this.codecObject["minimum_half"] || 0.52;
        this.difficulty = this.getDifficulty(ProfileManager.manager.getData()["settings"]["difficulty"]);
        this.day_time = this.codecObject["daytime"];
        this.isConveyor_belt = this.codecObject["conveyor_belt"];
        this.wavePoint = this.codecObject["wave_point"] || 0;
        this.drops = this.codecObject["drops"] || null;
        this.big_wave_flags = this.codecObject["big_wave_flags"] || [];
        let zombies = this.codecObject["zombies"];
        let staticZombieArray = zombies["static"];
        let dynamicZombieArray = zombies["dynamic"];
        staticZombieArray.forEach(item => {
            let waveNum = item["wave"];
            this.staticPool[waveNum] = item["pool"];
        });
        dynamicZombieArray.forEach(item => {
            let waveNum = item["wave"];
            let wavePoint = item["wave_point"];
            let entities = item["entities"];
            this.dynamicPool[waveNum] = {
                wave: waveNum,
                wave_point: wavePoint,
                entities: entities,
            };
            if(entities != null) if(entities.forEach != null) {
                entities.forEach(entity => {
                    this.allTypePool.push(entity);
                });
            }
        });
        this.allTypePool = [...new Set(this.allTypePool)];
        this.waves = Math.max(staticZombieArray.length - 1, dynamicZombieArray.length - 1);
        let scriptArray = this.codecObject["scripts"];
        if (Array.isArray(scriptArray)) {
            let combinedScript = scriptArray.join('\n');
            this.scripts.push(() => {
                eval(combinedScript);
            });
        }
        this.hasBoss = this.codecObject["has_boss"];
        this.events = this.codecObject["events"] || {};
        this.startEvent = this.events["start"] || null;
        this.endEvent = this.events["end"] || null;
        if(this.codecObject["boss"] != null) {
            this.boss = () => {return Registry.get(Registries.BOSS, this.codecObject["boss"]);}
        } else {
            this.boss = null;
        }
        if(this.isConveyor_belt == true) {
            this.firstFlagTime = 120;
        } else if(this.isConveyor_belt == false) {
            this.firstFlagTime = 250;
        }
    }
    debugText;
    init_debug() {
        this.debugText = add([
            text("",{ size: 16, align: "center" }),
            pos(vec2(1000,600)),
            anchor("center"),
            z(20),
        ]);
        onUpdate(() => {
            this.update_debug();
        });
    }
    update_debug() {
        if(this.debugText != null) {
            this.debugText.text = `
        MAX_WAVE：${this.waves}
        WAVE：${this.currentWave}
        WAVE_POINT：${this.wavePoint}
        HP/MAX_HP：${this.getAllZombieHealthString()[0]}/${this.getAllZombieHealthString()[1]}
        CB_MODE：${this.isConveyor_belt}
        FirstFlagTime：${this.firstFlagTime}
        Timer：${this.timer_s}/${this.spawnTime}
        LockTimer：${this.lockTimer}
        `;
        }
    }
    async next() {
        this.timer_s = 0;
        this.updateNextSpawnTime();
        ++this.currentWave;
        if(this.currentWave != null) if (this.dynamicPool[this.currentWave] != null || this.staticPool[this.currentWave] != null) {
            if (this.dynamicPool[this.currentWave] != null) {
                let currentPool = this.dynamicPool[this.currentWave];
                let poolWave = currentPool.wave;
                let poolWavePoint = currentPool.wave_point * this.levelSettings.degree_of_difficulty * this.difficulty;
                let poolEntities = currentPool.entities;
                let allWeight = 0;
                let tI = false;
                this.wavePoint = poolWavePoint;
                if(this.big_wave_flags.includes(this.currentWave)) {
                    this.wavePoint = poolWavePoint * 1.5;
                    this.bigWave();
                    tI = true;
                }
                if(tI == true) {
                    await wait(7.5)
                    this.spawnZombie("flag_zombie", -1);
                }

                // 计算总权重
                poolEntities.forEach(zombieType => {
                    let wMap = Constants.weights.get(zombieType);
                    if (wMap) {
                        let weight = wMap["weight"];
                        allWeight += weight;
                    }
                });

                // 出怪逻辑
                while (this.wavePoint > 0) {
                    // 检查是否存在任何 cost 小于等于 wavePoint 的怪物
                    let canSpawn = poolEntities.some(zombieType => {
                        let wMap = Constants.weights.get(zombieType);
                        return wMap && wMap["cost"] <= this.wavePoint;
                    });

                    if (!canSpawn) {
                        break; // 如果没有可出的怪物，退出循环
                    }

                    // 按权重选择怪物类型
                    let cumulativeWeight = 0;
                    let selectedZombieType = null;
                    let randomWeight = Math.random() * allWeight;
                    while(this.lastLine == randomWeight) {
                        randomWeight = Math.random() * allWeight;
                    }
                    this.lastLine = randomWeight;

                    for (let zombieType of poolEntities) {
                        let wMap = Constants.weights.get(zombieType);
                        if (wMap) {
                            cumulativeWeight += wMap["weight"];
                            if (randomWeight < cumulativeWeight) {
                                selectedZombieType = zombieType;
                                break;
                            }
                        }
                    }

                    if (selectedZombieType) {
                        let wMap = Constants.weights.get(selectedZombieType);
                        if (wMap) {
                            let cost = wMap["cost"];
                            if (this.wavePoint >= cost) {
                                // 出怪逻辑
                                //console.log(`Spawning ${selectedZombieType}`);
                                wait(Math.random() * (1.5 - 0.1) + 0.1, () => {
                                    let zombie = Zombies.spawn(selectedZombieType,-1);
                                    this.instance_arr.push(zombie);
                                });
                                this.wavePoint -= cost;
                            } else {
                                break; // 如果当前的 wavePoint 不够支付下一个怪物的 cost，退出循环
                            }
                        }
                    }
                }
                wait(1.6,() => {

                });
            }

            if (this.staticPool[this.currentWave] != null) {
                let pool = this.staticPool[this.currentWave];
                if(pool != null) {
                    pool.forEach((zombieType) => {
                        this.spawnZombie(zombieType, -1);
                    })
                }
            }
        } else if (this.dynamicPool[this.currentWave] == null && this.boss != null && this.hasBoss == true) {
            if (this.taskArray != null) {
                this.taskArray.forEach(task => {
                    if (task.cancel != null) {
                        task.cancel();
                    }
                });
            }
            this.spawnBoss();
        } else if (this.dynamicPool[this.currentWave] == null && this.hasBoss == false) {
            this.winLevel();
        }
    }

    // 关卡入口点
    run() {
        this.updateNextSpawnTime();
        this.script();
    }
    // 正式开始
    start() {
        if(this.isConveyor_belt == false) {
            initCommonLevel();
        } else if(this.isConveyor_belt == true) {
            initConveyorLevel();
        }
        this.addTask(loop(0.1, () => {
            if(this.isFirst == false) {
                this.timer_s += 1 * this.levelSettings.speed;
            }
            if(this.isFirst == true) {
                this.firstFlagTime -= 1 * this.levelSettings.speed;
            }
        })).addTask(loop(1, () => {
            if(this.firstFlagTime <= 0 && this.isFirst == true) {
                this.isFirst = false;
                this.lockTimer = true;
                SoundLoader.playSound("zombie_coming");
                wait(random(0.1,0.2),async () => {
                    await this.next();
                    this.lockTimer = false;
                });

            }
            if(this.lockTimer == true) {
                return;
            }
            let HealthRatio = this.getAllZombieHealth();
            //let Health = this.getAllZombieHealth2();
            if(isInRange(this.levelSettings.minimum_half, HealthRatio, this.levelSettings.maximum_half)) {
                this.lockTimer = true;
                wait(random(4,5),() => {
                    this.next();
                    this.lockTimer = false;
                });
            } else if(this.timer_s >= this.spawnTime) {
                this.lockTimer = true
                this.next();
                this.lockTimer = false;
            }
        }));
        if(this.isConveyor_belt == false && this.day_time == true) {
            this.addTask(loop(0.1, () => {
                this.rsMine_timer++;
                //console.log(this.rsMine_timer);
                if(this.rsMine_timer>=this.rsMine_timer_const) {
                    let rs = new Redstone(1, false, null, null)
                    this.rsMine_timer = 0;
                }
            }));
        }
        if(this.day_time == true) {
            let mine = get("mine");
            mine.forEach(m => {
                m.play("start");
            })
        }
        this.startLevel();
        this.progressBar = new ProgressBar(this,this.codecObject);
        this.progressBar.build();
        //this.currentWave = 9;
    }
    async bigWave() {
        let tI = 2;
        SoundLoader.playSound("huge_wave");
        let hw = add([
            sprite("huge_wave"),
            pos(center()),
            anchor("center"),
            scale(1.6),
            opacity(1.0),
            area(),
            z(20),
        ]);
        scaleTo(hw,1.4,2,"easeOutCubic");
        shake(20);
        if(this.currentWave === Math.max(...this.big_wave_flags)) {
            await wait(6);
            if(hw!= null) destroy(hw);
            let fw = add([
                sprite("final_wave"),
                pos(center()),
                anchor("center"),
                scale(1.55),
                opacity(1.0),
                area(),
                z(20),
            ]);
            scaleTo(fw,1.35,1.5,"easeOutCubic");
            SoundLoader.playSound("final_wave");
            shake(20);
            await wait(2);
            this.generateGargoyle();
            if(fw!= null) destroy(fw);
            tI += 8;
        } else {
            if(hw!= null) destroy(hw);
        }
        return tI;
    }
    generateGargoyle() {
        let gargoyle_statues = get("gargoyle_statue");
        if(gargoyle_statues != null) {
            gargoyle_statues.forEach(gargoyle_statue => {
                if(gargoyle_statue.instance != null) {
                    gargoyle_statue.instance.releaseGargoyleStatue();
                }
            })
        }
    }
    getAllZombieHealthString() {
        let zombies = get("zombies");
        this.allZombieHealth = 0;
        this.allZombieMaxHealth = 0;
        zombies.forEach(entity => {
            if(entity != null) {
                if(entity.instance != null) {
                    if(entity.instance.getHealth != null && entity.instance.getMaxHealth != null && (entity.ignoring_calculate == false)) {
                        this.allZombieHealth += entity.instance.getHealth();
                        this.allZombieMaxHealth += entity.instance.getMaxHealth();
                    }
                }
            }
        });
        if(this.allZombieMaxHealth === 0) {
            this.allZombieHealth = 100;
            this.allZombieMaxHealth = 100;
        }
        return [(Math.abs(this.allZombieHealth)), (Math.abs(this.allZombieMaxHealth))]
    }
    getAllZombieHealth() {
        let zombies = get("zombies");
        this.allZombieHealth = 0;
        this.allZombieMaxHealth = 0;
        zombies.forEach(entity => {
            if(entity != null) {
                if(entity.instance != null) {
                    if(entity.instance.getHealth != null && entity.instance.getMaxHealth != null && (entity.ignoring_calculate == false)) {
                        this.allZombieHealth += entity.instance.getHealth();
                        this.allZombieMaxHealth += entity.instance.getMaxHealth();
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
    getAllZombieHealth2() {
        let zombies = get("zombies");
        this.allZombieHealth = 0;
        zombies.forEach(entity => {
            if(entity != null) {
                if(entity.instance != null) {
                    if(entity.instance.getHealth != null && entity.instance.getMaxHealth != null && (entity.ignoring_calculate == false)) {
                        this.allZombieHealth += entity.instance.getHealth();
                    }
                }
            }
        });
        return (Math.abs(this.allZombieHealth)).toFixed(2);
    }
    async spawnZombie(type,line) {
        await wait(random(0.1,0.5), () => {
            if(line == -1) {
                Zombies.spawn(type,-1);
            } else {
                Zombies.spawn(type, line)
            }
        });
    }
    updateNextSpawnTime() {
        if(this.naturalTime != null) this.spawnTime = random(this.naturalTime.min,this.naturalTime.max);
    }
    updateNextBigWaveSpawnTime() {
        if(this.naturalTime != null) this.spawnTime = random(this.bigFlagTime.min,this.bigFlagTime.max);
    }
    spawnBoss() {
        if(this.hasBoss == true) {
            this.boss();
        } else {
            return null;
        }
    }
    script() {
        return this.scripts.forEach(task => task());
    }
    isBigWave() {
        return this.big_wave_flags.includes(this.currentWave);
    }
    addTask(f) {
        this.taskArray.push(f);
        return this;
    }
    startLevel() {
        if(this.startEvent != null) {
            let startEventSrc = this.startEvent.split(" -> ");
            let [packageName, exportName] = startEventSrc;
            import(packageName)
                .then(module => {
                    let value = module[exportName];
                    let instance = new value();
                    instance.run(this);
                })
                .catch(error => {
                    KaplayLogger.error(error);
                    console.error(error);
                });
        }
    }
    winLock = false;
    winLevel() {
        this.addTask(onUpdate(() => {
            let zombies = get("zombies");
            let health = 0;
            zombies.forEach(entity => {
                if(entity != null) {
                    if (entity.instance != null) if (entity.instance.getHealth != null) {
                        health += entity.instance.getHealth();
                    }
                }
            });
            if(health<=0) {
                if(this.winLock == true) return;
                this.winLock = true;
                if(this.drops != null && this.drops != "EMPTY") {
                    Items.spawnItem(this.drops);
                }
                Levels.passLevel(this.levelSettings.identifier);
                if(this.endEvent != null) {
                    let endEventSrc = this.endEvent.split(" -> ");
                    let [packageName, exportName] = endEventSrc;
                    import(packageName)
                        .then(module => {
                            let value = module[exportName];
                            let instance = new value();
                            instance.run(this);
                        })
                        .catch(error => {
                            KaplayLogger.error(error);
                            console.error(error);
                        });
                } else {
                    this.endLevel();
                }
            }
        }));
    }
    getDifficulty() {
        switch (this.difficulty) {
            case "EASY": return 1.0;
            case "NORMAL": return 1.5;
            case "HARD": return 2.0;
            case "LUNATIC": return 2.5;
            case "EXTRA": return 3.0;
            default: return 1.0;
        }
    }
    endLevel() {
        this.endThread();
    }
    endThread() {
        console.log("DynLevelThread = null");
        if(this.taskArray != null) {
            this.taskArray.forEach(task => {
                if(task.cancel != null) {
                    task.cancel();
                }
            })
        }
        if(this.currentTimer != null) {
            if (this.currentTimer.cancel != null) {
                this.currentTimer.cancel();
            }
        }
        free(this);
    }
    isDayTime() {
        return this.day_time;
    }
}