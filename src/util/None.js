// 没有用的地方，专门给IDE看的;
// 别导包了，不然覆盖了原有方法奇异搞笑

const defFunction = class {
    static {console.warn("再次警告请勿导入此包");}
};

function play(type,props = {}) {
    return Object;
}
function add(a = []) {
    return Object;
}
function rotate(anchor) {
    return Object;
}
function z(z) {
    return Object;
}
function sprite(texture = String("")) {
    return Object;
}
function wait(t = 1, f = () => {}) {
    return Object;
}
function loop(t = 1, f = () => {}) {
    return Object;
}
function mousePos() {
    return vec2(0,0);
}
function center() {
    return vec2(0,0);
}
function pos(vec2) {
    return vec2;
}
function vec2(x,y) {
    return { x: x,y: y };
}
function area() {
    return Object;
}
function onUpdate() {
    return Object;
}
function get(tag = String("")) {
    return [];
}
function onMousePress() {
    return Object;
}
function anchor(type) {
    return type;
}
function outline(num) {
    return num;
}
function scene(key = String(""), f = () => {}) {
    return Object;
}
function onKeyPress(key = String(""), f = () => {}) {
    return Object;
}
function onClick(f = () => {}) {
    return Object;
}
function onTouch(f = () => {}) {
    return Object;
}
function onTouchEnd(f = () => {}) {
    return Object;
}
function setCursor(type = "") {
    return Object;
}
function scale(num = 1.0) {
    return Object
}
function color(r,g,b) {
    return {r,g,b}
}
function state(a = String(""),b = [String("")]) {
    return Object;
}
function plug(f = function(){}) {

}