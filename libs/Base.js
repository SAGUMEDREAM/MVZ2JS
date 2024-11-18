// 定义一些方便使用的函数
function isset(o = null) {
    return o != null;
}
function is_null(o = null) {
    return o == null;
}
function empty(o = null) {
    return o != false && o != 0 && o != '' && o != null && !(Array.isArray(o) ? o.length != 0: false);
}