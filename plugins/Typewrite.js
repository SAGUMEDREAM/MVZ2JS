import { GameObj, KAPLAYCtx } from "kaplay";

function getRenderProps(obj) {
    return {
        color: obj.color,
        opacity: obj.opacity,
        anchor: obj.anchor,
        outline: obj.outline,
        shader: obj.shader,
        uniform: obj.uniform,
    };
}

export default function Typewriter(k) {
    k.text = function text(t, opt = {}) {
        function update(obj) {
            const ftext = k.formatText(Object.assign(getRenderProps(obj), {
                text: obj.text + "",
                size: obj.textSize,
                font: obj.font,
                width: opt.width && obj.width,
                align: obj.align,
                letterSpacing: obj.letterSpacing,
                lineSpacing: obj.lineSpacing,
                transform: obj.textTransform,
                styles: obj.textStyles,
            }));

            if (!opt.width) {
                obj.width = ftext.width / (obj.scale?.x || 1);
            }

            obj.height = ftext.height / (obj.scale?.y || 1);

            return ftext;
        }

        const obj = {
            id: "text",
            set text(nt) {
                t = nt;
                update(this);
            },
            get text() {
                return t;
            },
            textSize: opt.size ?? 16,
            font: opt.font,
            width: opt.width ?? 0,
            height: 0,
            align: opt.align,
            lineSpacing: opt.lineSpacing,
            letterSpacing: opt.letterSpacing,
            textTransform: opt.transform,
            textStyles: opt.styles,

            add() {
                k.onLoad(() => update(this));
            },

            draw() {
                k.drawFormattedText(update(this));
            },

            renderArea() {
                return new k.Rect(k.vec2(0), this.width, this.height);
            },

            async typewrite(message, cps) {
                const delay = 1000 / cps;
                let currentText = "";

                for (let i = 0; i < message.length; i++) {
                    let char = message[i];

                    // Tag [example][/example]
                    if (char === '[') {
                        while (char !== ']') {
                            // store tags here
                            i++;
                            char = message[i];
                        }
                    } else {
                        await new Promise(resolve => setTimeout(resolve, delay));
                        currentText += char;
                    }

                    this.text = currentText;
                }

                // add tags at correct formatted spots of the message ([example] at index 5, [/example] at index 15, etc.)

                // make sure final message is correct
                this.text = message;
            }
        };

        update(obj);

        return obj;
    }
}
