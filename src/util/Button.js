export function addButton(image,poses,string) {
    let menuBtn_instance = add([
        sprite(image),
        pos(poses),
        anchor("center"),
        area(),
        scale(1,2.2),
        opacity(1),
        z(15)
    ]);
    let menuBtnText_instance = add([
        text(string, { font: "monospace" }),
        pos(poses),
        anchor("center"),
        area(),
        scale(0.7),
        opacity(1),
        z(18)
    ]);
    menuBtn_instance.onHoverUpdate(() => {
        setCursor("pointer");
        menuBtn_instance.color = hsl2rgb(0.6, 0.6, 0.8)
    })
    menuBtn_instance.onHoverEnd(() => {
        setCursor("auto");
        menuBtn_instance.color = rgb()
    })
    return [menuBtn_instance,menuBtnText_instance];
}