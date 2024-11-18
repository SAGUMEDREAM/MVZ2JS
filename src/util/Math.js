export function sin(t) {
    return Math.sin(t);
}
export function cos(t) {
    return Math.cos(t);
}
export function tan(t) {
    return Math.tan(t);
}
export function sqrt(t) {
    return Math.sqrt(t);
}
export function getRange(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}
export function isInRange(a,b,c) {
    return (a <= b && b <= c);
}
export function isInRangeClose(a,b,c) {
    return (a < b && b < c);
}
export function random(a, b) {
    return (Math.random() * (b - a) + a);
}
export function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}