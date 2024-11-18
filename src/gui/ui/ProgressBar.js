export class ProgressBar {
    dynLevel;
    codecObject;
    bar;
    progress;
    event;
    max_wave;

    constructor(dynLevel, codecObject) {
        this.dynLevel = dynLevel;
        this.codecObject = codecObject;
        this.initCodecs();
    }

    initCodecs() {
        let zombies = this.codecObject["zombies"];
        let staticZombieArray = zombies["static"];
        let dynamicZombieArray = zombies["dynamic"];
        this.max_wave = Math.max(staticZombieArray.length - 1, dynamicZombieArray.length - 1);
    }

    build() {
        const barWidth = 200;
        const barHeight = 13;
        const barRadius = 5; // 圆角半径
        const barOutlineWidth = 1; // 描边宽度
        const barOutlineColor = rgb(0, 0, 0); // 描边颜色
        const x0 = 1140;
        const y0 = 695;
        this.bar = add([
            pos(vec2(x0,y0)),
            rect(barWidth, barHeight, { radius: barRadius }),
            color(174, 213, 76),
            anchor("right"),
            z(15),
        ]);
        this.barBg = add([
            pos(vec2(x0,y0)),
            rect(barWidth, barHeight, { radius: barRadius }),
            color(39, 81, 51),
            anchor("right"),
            outline(barOutlineWidth, barOutlineColor),
            z(14),
        ]);

        this.progress = 0.0;

        this.event = onUpdate(() => {
            let currentWave = this.dynLevel.currentWave;
            if (currentWave <= this.max_wave) {
                this.progress = clamp(currentWave / this.max_wave, 0, 1);
                this.bar.width = barWidth * this.progress;
            } else {
                this.progress = 1;
                this.bar.width = barWidth;
            }
        });
    }
}
