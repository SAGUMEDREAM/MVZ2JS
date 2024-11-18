import {Constants, KaplayLogger} from "/src/client/Client.js";
import {GameState} from "/src/util/GameState.js";
import {Uis} from "/src/gui/ui/Uis.js";
import {WorldLevel} from "/src/level/WorldLevel.js";
import {Feature} from "/src/world/feature/Feature.js";

export function free(clazz) {
    try {
        Object.keys(clazz).forEach((key) => {
            if (clazz.hasOwnProperty(key)) {
                clazz[key] = null;
            }
        });
        clazz = null;
    } catch (error) {
        KaplayLogger.warn(`Object cannot be recycled: ${clazz}`);
    }
}
export function getRowColumn(arr, col, row) {
    let result = [];
    let removedElements = [];

    for (let i = 0; i < arr.length; i++) {
        if (i !== row - 1) {
            let newRow = [];
            for (let j = 0; j < arr[i].length; j++) {
                if (j !== col - 1) {
                    newRow.push(arr[i][j]);
                } else {
                    if (arr[i][j] !== null) {
                        removedElements.push(arr[i][j]);
                    }
                }
            }
            result.push(newRow);
        } else {
            for (let j = 0; j < arr[i].length; j++) {
                if (j !== col - 1) {
                    if (arr[i][j] !== null) {
                        removedElements.push(arr[i][j]);
                    }
                }
            }
        }
    }
    return {
        keep: result,
        removed: removedElements
    };
}
export function initCommonLevel() {
    let stat = new GameState();
    let obj = stat.getStat();
    obj.addObj("redstone", 50);
    obj.addObj("star_shard", 0);
    obj.addObj("conveyor", false);
    obj.addObj("cards", []);
    Constants.gameState = stat;
    Uis.createEnergyUI();
    //new Redstone(1,false,null,null);
    //new Zombie("zombie",1);
    /*for (let i = 0; i < 10; i++) {
        let card = new Card(Dispenser,"dispenser","normal",100,30,true,i);
        card.init();
    }*/
}
export function initConveyorLevel() {
    let stat = new GameState();
    let obj = stat.getStat();
    obj.addObj("redstone", 50);
    obj.addObj("star_shard", 0);
    obj.addObj("conveyor", true);
    obj.addObj("cards", []);
    Constants.gameState = stat;
    Uis.createEnergyUI();
}

export async function moveTo(instance, vec2, easing) {
    if (easing == null) {
        easing = "easeOutCubic";
    }
    try {
        if (instance != null) {
            return await tween(
                instance.pos,
                vec2,
                1,
                (val0) => instance.pos = val0,
                easings[easing],
            )
        }
    } catch (error) {
        return null;
    }
}
export async function moveTo_Timer(instance, vec2, easing, time) {
    if (easing == null) {
        easing = "easeOutCubic";
    }
    try {
        if (instance != null) {
            return await tween(
                instance.pos,
                vec2,
                time,
                (val0) => instance.pos = val0,
                easings[easing],
            )
        }
    } catch (error) {
        console.log(error)
        return null;
    }
}
export async function moveCameraTo(vecZ, easing, time) {
    let allObjs = get("*");

    for (let obj of allObjs) {
        if(obj.pos != null && obj["ignoreCam"] != true) {
            let x0 = obj.pos.x;
            let y0 = obj.pos.y;
            let x1 = vecZ.x;
            let y1 = vecZ.y;
            let targetPos = vec2(x0 + x1, y0 + y1);

            moveTo_Timer(obj, targetPos, easing, time);
        }
    }
}
export async function scaleTo(instance,value,time,easing) {
    if(easing == null) { easing = "easeOutCubic"; }
    tween(
        instance.scale.x,
        value,
        time,
        (val0) => instance.scale.x = val0,
        easings[easing],
    );
    tween(
        instance.scale.y,
        value,
        time,
        (val0) => instance.scale.y = val0,
        easings[easing],
    );
}
export async function moveToEntity(instance,instance2,easing) {
    if(easing == null) { easing = "easeOutCubic"; }
    try {
        if(instance!=null) {
            let eX = instance.pos.x;
            let eY = instance.pos.y;
            let eVec2 = vec2(eX,eY)
            return await tween(
                instance2.pos,
                eVec2,
                1,
                (val0) => instance2.pos = val0,
                easings[easing],
            )
        }
    } catch (error) {return null;}
}

export function getCommonElements(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(element => set2.has(element));
}

export function selectRange(vec, range, conditionTag) {
    let array = [];
    let x = vec.x;
    let y = vec.y;
    get("*").forEach((element) => {
        if (element.pos != null) {
            let x0 = element.pos.x;
            let y0 = element.pos.y;
            let eRange = Math.sqrt(Math.pow((x - x0), 2) + Math.pow((y - y0), 2));
            /*if(element.is(conditionTag)) {
                console.log(eRange)
            }*/
            if (eRange <= range) {
                if(element.is(conditionTag) || conditionTag == null) {
                    array.push(element);
                }/* else {
                    console.log(element)
                    console.log(element.is(conditionTag))
                }*/
            }/* else {
                console.log("no")
                console.log(`${eRange}/${range}`)
            }*/
        }
    });
    return array;
}

export function freeBlock(x0,y0) {
    let placeBlockArray = get("place_block");
    placeBlockArray.forEach(placeBlock => {
        let x = placeBlock.x;
        let y = placeBlock.y;
        if(x0 === x && y0 === y) {
            placeBlock.isPlanting = false;
        }
    });
}

export function chooseArrayElement(array) {
    if (array.length === 0) {
        return null;
    } else {
        let randomIndex = Math.floor(Math.random() * array.length);
        let randomElement = array[randomIndex];
        return randomElement;
    }
}

export function choose(arr) {
    if (arr.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return 'Android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    }
    if (/mobile/i.test(userAgent)) {
        return 'Mobile';
    }

    return 'Desktop';
}
export function testSprite(s) {
    add([
        sprite(s)
    ]);
}
export function getWorldLevel() {
    return WorldLevel.currentWorldLevel;
}
export function getBlock(x,y) {
    let blockObj = Constants.blockPosMap.get(Feature.getPosKey(x,y));
    let result = null;
    if(blockObj != null) {
        result = blockObj;
    }
    return result;
}
export function addConfetti(opt = {}) {
    const DEF_COUNT = 80;
    const DEF_GRAVITY = 800;
    const DEF_AIR_DRAG = 0.9;
    const DEF_VELOCITY = [1000, 4000];
    const DEF_ANGULAR_VELOCITY = [-200, 200];
    const DEF_FADE = 0.3;
    const DEF_SPREAD = 60;
    const DEF_SPIN = [2, 8];
    const DEF_SATURATION = 0.7;
    const DEF_LIGHTNESS = 0.6;

    const sample = (s) => typeof s === "function" ? s() : s;
    for (let i = 0; i < (opt.count ?? DEF_COUNT); i++) {
        const p = add([
            pos(sample(opt.pos ?? vec2(0, 0))),
            choose([
                rect(rand(5, 20), rand(5, 20)),
                circle(rand(3, 10)),
            ]),
            color(
                sample(
                    opt.color
                    ?? hsl2rgb(rand(0, 1), DEF_SATURATION, DEF_LIGHTNESS),
                ),
            ),
            opacity(1),
            lifespan(4),
            scale(1),
            anchor("center"),
            z(15),
            rotate(rand(0, 360)),
        ]);
        const spin = rand(DEF_SPIN[0], DEF_SPIN[1]);
        const gravity = opt.gravity ?? DEF_GRAVITY;
        const airDrag = opt.airDrag ?? DEF_AIR_DRAG;
        const heading = sample(opt.heading ?? 0) - 90;
        const spread = opt.spread ?? DEF_SPREAD;
        const head = heading + rand(-spread / 2, spread / 2);
        const fade = opt.fade ?? DEF_FADE;
        const vel = sample(
            opt.velocity ?? rand(DEF_VELOCITY[0], DEF_VELOCITY[1]),
        );
        let velX = Math.cos(deg2rad(head)) * vel;
        let velY = Math.sin(deg2rad(head)) * vel;
        const velA = sample(
            opt.angularVelocity
            ?? rand(DEF_ANGULAR_VELOCITY[0], DEF_ANGULAR_VELOCITY[1]),
        );
        p.onUpdate(() => {
            velY += gravity * dt();
            p.pos.x += velX * dt();
            p.pos.y += velY * dt();
            p.angle += velA * dt();
            p.opacity -= fade * dt();
            velX *= airDrag;
            velY *= airDrag;
            p.scale.x = wave(-1, 1, time() * spin);
        });
    }
}
export function vec2Sum(vector1,vector2) {
    let x0 = vector1.x;
    let y0 = vector1.y;
    let x1 = vector2.x;
    let y1 = vector2.y;
    return vec2(x0+x1,y0+y1);
}

export function getEndItem() {
    let trolleys = get("trolley");
    if(trolleys) trolleys.forEach(trolley => {
        trolley.instance.getClick();
    });
    wait(0.2,() => {
        let gemStones = get("emerald");
        if(gemStones) gemStones.forEach(gemStone => {
            gemStone.instance.getClick();
        });
    })
}

export function matchesIgnoreCase(str, pattern) {
    const regex = new RegExp(pattern, 'i');
    return regex.test(str);
}

export function copyTextToClipboard(ctxString) {
    navigator.clipboard.writeText(ctxString).then(() => {
        KaplayLogger.log("CLIPBOARD",`Text copied to clipboard: ${ctxString}`);
    }).catch(err => {
        KaplayLogger.error("CLIPBOARD",`Failed to copy text: ${err}`);
    });
}