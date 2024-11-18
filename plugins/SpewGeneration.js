export class SpewGeneration {
    static particleSpew(amount, obj) {
        for (let i = 0; i < amount; i++) {
            setTimeout(() => {
                let tempP = add([
                    circle(5),
                    pos(obj.pos.x, obj.pos.y),
                    area(),
                    color(RED),
                    z(2),
                    "object",
                    "material",
                    offscreen({
                        destroy: true
                    }),
                ])
                let strength = 200;
                let yOffset = rand(-width() / strength, width() / strength);
                let xOffset = rand(-height() / strength, height() / strength);

                let interval = setInterval(() => {
                    tempP.pos.x += xOffset;
                    tempP.pos.y += yOffset;
                    let test = randi(1, 200)
                    if (test < 5) {
                        destroy(tempP);
                        clearInterval(interval);
                    }
                    xOffset /= 1.1;
                    yOffset /= 1.1;
                }, 10);
            }, 10);//end timeout
        }
    }
}