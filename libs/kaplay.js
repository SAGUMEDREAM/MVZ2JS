var kaplay = (()=>{
        var Yt = Object.defineProperty;
        var xi = Object.getOwnPropertyDescriptor;
        var Ui = Object.getOwnPropertyNames;
        var Ei = Object.prototype.hasOwnProperty;
        var o = (n,e)=>Yt(n, "name", {
            value: e,
            configurable: !0
        });
        var Si = (n,e)=>{
                for (var i in e)
                    Yt(n, i, {
                        get: e[i],
                        enumerable: !0
                    })
            }
            , Ci = (n,e,i,c)=>{
                if (e && typeof e == "object" || typeof e == "function")
                    for (let m of Ui(e))
                        !Ei.call(n, m) && m !== i && Yt(n, m, {
                            get: ()=>e[m],
                            enumerable: !(c = xi(e, m)) || c.enumerable
                        });
                return n
            }
        ;
        var Ai = n=>Ci(Yt({}, "__esModule", {
            value: !0
        }), n);
        var wr = (()=>{
                for (var n = new Uint8Array(128), e = 0; e < 64; e++)
                    n[e < 26 ? e + 65 : e < 52 ? e + 71 : e < 62 ? e - 4 : e * 4 - 205] = e;
                return i=>{
                    for (var c = i.length, m = new Uint8Array((c - (i[c - 1] == "=") - (i[c - 2] == "=")) * 3 / 4 | 0), p = 0, P = 0; p < c; ) {
                        var I = n[i.charCodeAt(p++)]
                            , j = n[i.charCodeAt(p++)]
                            , y = n[i.charCodeAt(p++)]
                            , X = n[i.charCodeAt(p++)];
                        m[P++] = I << 2 | j >> 4,
                            m[P++] = j << 4 | y >> 2,
                            m[P++] = y << 6 | X
                    }
                    return m
                }
            }
        )();
        var uo = {};
        Si(uo, {
            default: ()=>ao
        });
        function Ge(n) {
            return n * Math.PI / 180
        }
        o(Ge, "deg2rad");
        function ot(n) {
            return n * 180 / Math.PI
        }
        o(ot, "rad2deg");
        function Le(n, e, i) {
            return e > i ? Le(n, i, e) : Math.min(Math.max(n, e), i)
        }
        o(Le, "clamp");
        function Ve(n, e, i) {
            if (typeof n == "number" && typeof e == "number")
                return n + (e - n) * i;
            if (n instanceof v && e instanceof v)
                return n.lerp(e, i);
            if (n instanceof W && e instanceof W)
                return n.lerp(e, i);
            throw new Error(`Bad value for lerp(): ${n}, ${e}. Only number, Vec2 and Color is supported.`)
        }
        o(Ve, "lerp");
        function _e(n, e, i, c, m) {
            return c + (n - e) / (i - e) * (m - c)
        }
        o(_e, "map");
        function vr(n, e, i, c, m) {
            return Le(_e(n, e, i, c, m), c, m)
        }
        o(vr, "mapc");
        var v = class n {
                static{o(this, "Vec2")
                }x = 0;
                y = 0;
                constructor(e=0, i=e) {
                    this.x = e,
                        this.y = i
                }
                static fromAngle(e) {
                    let i = Ge(e);
                    return new n(Math.cos(i),Math.sin(i))
                }
                static LEFT = new n(-1,0);
                static RIGHT = new n(1,0);
                static UP = new n(0,-1);
                static DOWN = new n(0,1);
                clone() {
                    return new n(this.x,this.y)
                }
                add(...e) {
                    let i = T(...e);
                    return new n(this.x + i.x,this.y + i.y)
                }
                sub(...e) {
                    let i = T(...e);
                    return new n(this.x - i.x,this.y - i.y)
                }
                scale(...e) {
                    let i = T(...e);
                    return new n(this.x * i.x,this.y * i.y)
                }
                dist(...e) {
                    let i = T(...e);
                    return this.sub(i).len()
                }
                sdist(...e) {
                    let i = T(...e);
                    return this.sub(i).slen()
                }
                len() {
                    return Math.sqrt(this.dot(this))
                }
                slen() {
                    return this.dot(this)
                }
                unit() {
                    let e = this.len();
                    return e === 0 ? new n(0) : this.scale(1 / e)
                }
                normal() {
                    return new n(this.y,-this.x)
                }
                reflect(e) {
                    return this.sub(e.scale(2 * this.dot(e)))
                }
                project(e) {
                    return e.scale(e.dot(this) / e.len())
                }
                reject(e) {
                    return this.sub(this.project(e))
                }
                dot(e) {
                    return this.x * e.x + this.y * e.y
                }
                cross(e) {
                    return this.x * e.y - this.y * e.x
                }
                angle(...e) {
                    let i = T(...e);
                    return ot(Math.atan2(this.y - i.y, this.x - i.x))
                }
                angleBetween(...e) {
                    let i = T(...e);
                    return ot(Math.atan2(this.cross(i), this.dot(i)))
                }
                lerp(e, i) {
                    return new n(Ve(this.x, e.x, i),Ve(this.y, e.y, i))
                }
                slerp(e, i) {
                    let c = this.dot(e)
                        , m = this.cross(e)
                        , p = Math.atan2(m, c);
                    return this.scale(Math.sin((1 - i) * p)).add(e.scale(Math.sin(i * p))).scale(1 / m)
                }
                isZero() {
                    return this.x === 0 && this.y === 0
                }
                toFixed(e) {
                    return new n(Number(this.x.toFixed(e)),Number(this.y.toFixed(e)))
                }
                transform(e) {
                    return e.multVec2(this)
                }
                eq(e) {
                    return this.x === e.x && this.y === e.y
                }
                bbox() {
                    return new de(this,0,0)
                }
                toString() {
                    return `vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`
                }
            }
        ;
        function T(...n) {
            if (n.length === 1) {
                if (n[0]instanceof v)
                    return new v(n[0].x,n[0].y);
                if (Array.isArray(n[0]) && n[0].length === 2)
                    return new v(...n[0])
            }
            return new v(...n)
        }
        o(T, "vec2");
        var W = class n {
                static{o(this, "Color")
                }r = 255;
                g = 255;
                b = 255;
                constructor(e, i, c) {
                    this.r = Le(e, 0, 255),
                        this.g = Le(i, 0, 255),
                        this.b = Le(c, 0, 255)
                }
                static fromArray(e) {
                    return new n(e[0],e[1],e[2])
                }
                static fromHex(e) {
                    if (typeof e == "number")
                        return new n(e >> 16 & 255,e >> 8 & 255,e >> 0 & 255);
                    if (typeof e == "string") {
                        let i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
                        return new n(parseInt(i[1], 16),parseInt(i[2], 16),parseInt(i[3], 16))
                    } else
                        throw new Error("Invalid hex color format")
                }
                static fromHSL(e, i, c) {
                    if (i == 0)
                        return new n(255 * c,255 * c,255 * c);
                    let m = o((X,S,q)=>(q < 0 && (q += 1),
                    q > 1 && (q -= 1),
                        q < 1 / 6 ? X + (S - X) * 6 * q : q < 1 / 2 ? S : q < 2 / 3 ? X + (S - X) * (2 / 3 - q) * 6 : X), "hue2rgb")
                        , p = c < .5 ? c * (1 + i) : c + i - c * i
                        , P = 2 * c - p
                        , I = m(P, p, e + 1 / 3)
                        , j = m(P, p, e)
                        , y = m(P, p, e - 1 / 3);
                    return new n(Math.round(I * 255),Math.round(j * 255),Math.round(y * 255))
                }
                static RED = new n(255,0,0);
                static GREEN = new n(0,255,0);
                static BLUE = new n(0,0,255);
                static YELLOW = new n(255,255,0);
                static MAGENTA = new n(255,0,255);
                static CYAN = new n(0,255,255);
                static WHITE = new n(255,255,255);
                static BLACK = new n(0,0,0);
                clone() {
                    return new n(this.r,this.g,this.b)
                }
                lighten(e) {
                    return new n(this.r + e,this.g + e,this.b + e)
                }
                darken(e) {
                    return this.lighten(-e)
                }
                invert() {
                    return new n(255 - this.r,255 - this.g,255 - this.b)
                }
                mult(e) {
                    return new n(this.r * e.r / 255,this.g * e.g / 255,this.b * e.b / 255)
                }
                lerp(e, i) {
                    return new n(Ve(this.r, e.r, i),Ve(this.g, e.g, i),Ve(this.b, e.b, i))
                }
                toHSL() {
                    let e = this.r / 255
                        , i = this.g / 255
                        , c = this.b / 255
                        , m = Math.max(e, i, c)
                        , p = Math.min(e, i, c)
                        , P = (m + p) / 2
                        , I = P
                        , j = P;
                    if (m == p)
                        P = I = 0;
                    else {
                        let y = m - p;
                        switch (I = j > .5 ? y / (2 - m - p) : y / (m + p),
                            m) {
                            case e:
                                P = (i - c) / y + (i < c ? 6 : 0);
                                break;
                            case i:
                                P = (c - e) / y + 2;
                                break;
                            case c:
                                P = (e - i) / y + 4;
                                break
                        }
                        P /= 6
                    }
                    return [P, I, j]
                }
                eq(e) {
                    return this.r === e.r && this.g === e.g && this.b === e.b
                }
                toString() {
                    return `rgb(${this.r}, ${this.g}, ${this.b})`
                }
                toHex() {
                    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
                }
            }
        ;
        function J(...n) {
            if (n.length === 0)
                return new W(255,255,255);
            if (n.length === 1) {
                if (n[0]instanceof W)
                    return n[0].clone();
                if (typeof n[0] == "string")
                    return W.fromHex(n[0]);
                if (Array.isArray(n[0]) && n[0].length === 3)
                    return W.fromArray(n[0])
            }
            return new W(...n)
        }
        o(J, "rgb");
        var yr = o((n,e,i)=>W.fromHSL(n, e, i), "hsl2rgb")
            , oe = class n {
                static{o(this, "Quad")
                }x = 0;
                y = 0;
                w = 1;
                h = 1;
                constructor(e, i, c, m) {
                    this.x = e,
                        this.y = i,
                        this.w = c,
                        this.h = m
                }
                scale(e) {
                    return new n(this.x + this.w * e.x,this.y + this.h * e.y,this.w * e.w,this.h * e.h)
                }
                pos() {
                    return new v(this.x,this.y)
                }
                clone() {
                    return new n(this.x,this.y,this.w,this.h)
                }
                eq(e) {
                    return this.x === e.x && this.y === e.y && this.w === e.w && this.h === e.h
                }
                toString() {
                    return `quad(${this.x}, ${this.y}, ${this.w}, ${this.h})`
                }
            }
        ;
        function ce(n, e, i, c) {
            return new oe(n,e,i,c)
        }
        o(ce, "quad");
        var Ue = class n {
                static{o(this, "Mat4")
                }m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                constructor(e) {
                    e && (this.m = e)
                }
                static translate(e) {
                    return new n([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, e.x, e.y, 0, 1])
                }
                static scale(e) {
                    return new n([e.x, 0, 0, 0, 0, e.y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
                }
                static rotateX(e) {
                    e = Ge(-e);
                    let i = Math.cos(e)
                        , c = Math.sin(e);
                    return new n([1, 0, 0, 0, 0, i, -c, 0, 0, c, i, 0, 0, 0, 0, 1])
                }
                static rotateY(e) {
                    e = Ge(-e);
                    let i = Math.cos(e)
                        , c = Math.sin(e);
                    return new n([i, 0, c, 0, 0, 1, 0, 0, -c, 0, i, 0, 0, 0, 0, 1])
                }
                static rotateZ(e) {
                    e = Ge(-e);
                    let i = Math.cos(e)
                        , c = Math.sin(e);
                    return new n([i, -c, 0, 0, c, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
                }
                translate(e) {
                    return this.m[12] += this.m[0] * e.x + this.m[4] * e.y,
                        this.m[13] += this.m[1] * e.x + this.m[5] * e.y,
                        this.m[14] += this.m[2] * e.x + this.m[6] * e.y,
                        this.m[15] += this.m[3] * e.x + this.m[7] * e.y,
                        this
                }
                scale(e) {
                    return this.m[0] *= e.x,
                        this.m[4] *= e.y,
                        this.m[1] *= e.x,
                        this.m[5] *= e.y,
                        this.m[2] *= e.x,
                        this.m[6] *= e.y,
                        this.m[3] *= e.x,
                        this.m[7] *= e.y,
                        this
                }
                rotate(e) {
                    e = Ge(-e);
                    let i = Math.cos(e)
                        , c = Math.sin(e)
                        , m = this.m[0]
                        , p = this.m[1]
                        , P = this.m[4]
                        , I = this.m[5];
                    return this.m[0] = m * i + p * c,
                        this.m[1] = -m * c + p * i,
                        this.m[4] = P * i + I * c,
                        this.m[5] = -P * c + I * i,
                        this
                }
                mult(e) {
                    let i = [];
                    for (let c = 0; c < 4; c++)
                        for (let m = 0; m < 4; m++)
                            i[c * 4 + m] = this.m[0 * 4 + m] * e.m[c * 4 + 0] + this.m[1 * 4 + m] * e.m[c * 4 + 1] + this.m[2 * 4 + m] * e.m[c * 4 + 2] + this.m[3 * 4 + m] * e.m[c * 4 + 3];
                    return new n(i)
                }
                multVec2(e) {
                    return new v(e.x * this.m[0] + e.y * this.m[4] + this.m[12],e.x * this.m[1] + e.y * this.m[5] + this.m[13])
                }
                getTranslation() {
                    return new v(this.m[12],this.m[13])
                }
                getScale() {
                    if (this.m[0] != 0 || this.m[1] != 0) {
                        let e = this.m[0] * this.m[5] - this.m[1] * this.m[4]
                            , i = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
                        return new v(i,e / i)
                    } else if (this.m[4] != 0 || this.m[5] != 0) {
                        let e = this.m[0] * this.m[5] - this.m[1] * this.m[4]
                            , i = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
                        return new v(e / i,i)
                    } else
                        return new v(0,0)
                }
                getRotation() {
                    if (this.m[0] != 0 || this.m[1] != 0) {
                        let e = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
                        return ot(this.m[1] > 0 ? Math.acos(this.m[0] / e) : -Math.acos(this.m[0] / e))
                    } else if (this.m[4] != 0 || this.m[5] != 0) {
                        let e = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
                        return ot(Math.PI / 2 - (this.m[5] > 0 ? Math.acos(-this.m[4] / e) : -Math.acos(this.m[4] / e)))
                    } else
                        return 0
                }
                getSkew() {
                    if (this.m[0] != 0 || this.m[1] != 0) {
                        let e = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
                        return new v(Math.atan(this.m[0] * this.m[4] + this.m[1] * this.m[5]) / (e * e),0)
                    } else if (this.m[4] != 0 || this.m[5] != 0) {
                        let e = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
                        return new v(0,Math.atan(this.m[0] * this.m[4] + this.m[1] * this.m[5]) / (e * e))
                    } else
                        return new v(0,0)
                }
                invert() {
                    let e = []
                        , i = this.m[10] * this.m[15] - this.m[14] * this.m[11]
                        , c = this.m[9] * this.m[15] - this.m[13] * this.m[11]
                        , m = this.m[9] * this.m[14] - this.m[13] * this.m[10]
                        , p = this.m[8] * this.m[15] - this.m[12] * this.m[11]
                        , P = this.m[8] * this.m[14] - this.m[12] * this.m[10]
                        , I = this.m[8] * this.m[13] - this.m[12] * this.m[9]
                        , j = this.m[6] * this.m[15] - this.m[14] * this.m[7]
                        , y = this.m[5] * this.m[15] - this.m[13] * this.m[7]
                        , X = this.m[5] * this.m[14] - this.m[13] * this.m[6]
                        , S = this.m[4] * this.m[15] - this.m[12] * this.m[7]
                        , q = this.m[4] * this.m[14] - this.m[12] * this.m[6]
                        , E = this.m[5] * this.m[15] - this.m[13] * this.m[7]
                        , K = this.m[4] * this.m[13] - this.m[12] * this.m[5]
                        , Q = this.m[6] * this.m[11] - this.m[10] * this.m[7]
                        , te = this.m[5] * this.m[11] - this.m[9] * this.m[7]
                        , k = this.m[5] * this.m[10] - this.m[9] * this.m[6]
                        , pe = this.m[4] * this.m[11] - this.m[8] * this.m[7]
                        , C = this.m[4] * this.m[10] - this.m[8] * this.m[6]
                        , Ae = this.m[4] * this.m[9] - this.m[8] * this.m[5];
                    e[0] = this.m[5] * i - this.m[6] * c + this.m[7] * m,
                        e[4] = -(this.m[4] * i - this.m[6] * p + this.m[7] * P),
                        e[8] = this.m[4] * c - this.m[5] * p + this.m[7] * I,
                        e[12] = -(this.m[4] * m - this.m[5] * P + this.m[6] * I),
                        e[1] = -(this.m[1] * i - this.m[2] * c + this.m[3] * m),
                        e[5] = this.m[0] * i - this.m[2] * p + this.m[3] * P,
                        e[9] = -(this.m[0] * c - this.m[1] * p + this.m[3] * I),
                        e[13] = this.m[0] * m - this.m[1] * P + this.m[2] * I,
                        e[2] = this.m[1] * j - this.m[2] * y + this.m[3] * X,
                        e[6] = -(this.m[0] * j - this.m[2] * S + this.m[3] * q),
                        e[10] = this.m[0] * E - this.m[1] * S + this.m[3] * K,
                        e[14] = -(this.m[0] * X - this.m[1] * q + this.m[2] * K),
                        e[3] = -(this.m[1] * Q - this.m[2] * te + this.m[3] * k),
                        e[7] = this.m[0] * Q - this.m[2] * pe + this.m[3] * C,
                        e[11] = -(this.m[0] * te - this.m[1] * pe + this.m[3] * Ae),
                        e[15] = this.m[0] * k - this.m[1] * C + this.m[2] * Ae;
                    let $ = this.m[0] * e[0] + this.m[1] * e[4] + this.m[2] * e[8] + this.m[3] * e[12];
                    for (let Te = 0; Te < 4; Te++)
                        for (let ye = 0; ye < 4; ye++)
                            e[Te * 4 + ye] *= 1 / $;
                    return new n(e)
                }
                clone() {
                    return new n([...this.m])
                }
                toString() {
                    return this.m.toString()
                }
            }
        ;
        function Ln(n, e, i, c=m=>-Math.cos(m)) {
            return n + (c(i) + 1) / 2 * (e - n)
        }
        o(Ln, "wave");
        var Ti = 1103515245
            , Oi = 12345
            , br = 2147483648
            , bt = class {
            static{o(this, "RNG")
            }seed;
            constructor(e) {
                this.seed = e
            }
            gen() {
                return this.seed = (Ti * this.seed + Oi) % br,
                this.seed / br
            }
            genNumber(e, i) {
                return e + this.gen() * (i - e)
            }
            genVec2(e, i) {
                return new v(this.genNumber(e.x, i.x),this.genNumber(e.y, i.y))
            }
            genColor(e, i) {
                return new W(this.genNumber(e.r, i.r),this.genNumber(e.g, i.g),this.genNumber(e.b, i.b))
            }
            genAny(...e) {
                if (e.length === 0)
                    return this.gen();
                if (e.length === 1) {
                    if (typeof e[0] == "number")
                        return this.genNumber(0, e[0]);
                    if (e[0]instanceof v)
                        return this.genVec2(T(0, 0), e[0]);
                    if (e[0]instanceof W)
                        return this.genColor(J(0, 0, 0), e[0])
                } else if (e.length === 2) {
                    if (typeof e[0] == "number" && typeof e[1] == "number")
                        return this.genNumber(e[0], e[1]);
                    if (e[0]instanceof v && e[1]instanceof v)
                        return this.genVec2(e[0], e[1]);
                    if (e[0]instanceof W && e[1]instanceof W)
                        return this.genColor(e[0], e[1])
                }
            }
        }
            , Fn = new bt(Date.now());
        function xr(n) {
            return n != null && (Fn.seed = n),
                Fn.seed
        }
        o(xr, "randSeed");
        function xt(...n) {
            return Fn.genAny(...n)
        }
        o(xt, "rand");
        function Vn(...n) {
            return Math.floor(xt(...n))
        }
        o(Vn, "randi");
        function Ur(n) {
            return xt() <= n
        }
        o(Ur, "chance");
        function Er(n) {
            return n[Vn(n.length)]
        }
        o(Er, "choose");
        function Sr(n, e) {
            return n.pos.x + n.width > e.pos.x && n.pos.x < e.pos.x + e.width && n.pos.y + n.height > e.pos.y && n.pos.y < e.pos.y + e.height
        }
        o(Sr, "testRectRect");
        function Ri(n, e) {
            if (n.p1.x === n.p2.x && n.p1.y === n.p2.y || e.p1.x === e.p2.x && e.p1.y === e.p2.y)
                return null;
            let i = (e.p2.y - e.p1.y) * (n.p2.x - n.p1.x) - (e.p2.x - e.p1.x) * (n.p2.y - n.p1.y);
            if (i === 0)
                return null;
            let c = ((e.p2.x - e.p1.x) * (n.p1.y - e.p1.y) - (e.p2.y - e.p1.y) * (n.p1.x - e.p1.x)) / i
                , m = ((n.p2.x - n.p1.x) * (n.p1.y - e.p1.y) - (n.p2.y - n.p1.y) * (n.p1.x - e.p1.x)) / i;
            return c < 0 || c > 1 || m < 0 || m > 1 ? null : c
        }
        o(Ri, "testLineLineT");
        function it(n, e) {
            let i = Ri(n, e);
            return i ? T(n.p1.x + i * (n.p2.x - n.p1.x), n.p1.y + i * (n.p2.y - n.p1.y)) : null
        }
        o(it, "testLineLine");
        function Cr(n, e) {
            if (vt(n, e.p1) || vt(n, e.p2))
                return !0;
            let i = n.points();
            return !!it(e, new Ie(i[0],i[1])) || !!it(e, new Ie(i[1],i[2])) || !!it(e, new Ie(i[2],i[3])) || !!it(e, new Ie(i[3],i[0]))
        }
        o(Cr, "testRectLine");
        function vt(n, e) {
            return e.x > n.pos.x && e.x < n.pos.x + n.width && e.y > n.pos.y && e.y < n.pos.y + n.height
        }
        o(vt, "testRectPoint");
        function Ar(n, e) {
            let i = e.sub(n.p1)
                , c = n.p2.sub(n.p1);
            if (Math.abs(i.cross(c)) > Number.EPSILON)
                return !1;
            let m = i.dot(c) / c.dot(c);
            return m >= 0 && m <= 1
        }
        o(Ar, "testLinePoint");
        function _n(n, e) {
            let i = n.p2.sub(n.p1)
                , c = i.dot(i)
                , m = n.p1.sub(e.center)
                , p = 2 * i.dot(m)
                , P = m.dot(m) - e.radius * e.radius
                , I = p * p - 4 * c * P;
            if (c <= Number.EPSILON || I < 0)
                return !1;
            if (I == 0) {
                let j = -p / (2 * c);
                if (j >= 0 && j <= 1)
                    return !0
            } else {
                let j = (-p + Math.sqrt(I)) / (2 * c)
                    , y = (-p - Math.sqrt(I)) / (2 * c);
                if (j >= 0 && j <= 1 || y >= 0 && y <= 1)
                    return !0
            }
            return Tr(e, n.p1)
        }
        o(_n, "testLineCircle");
        function Tr(n, e) {
            return n.center.sdist(e) < n.radius * n.radius
        }
        o(Tr, "testCirclePoint");
        function Or(n, e) {
            let i = e.pts[e.pts.length - 1];
            for (let c of e.pts) {
                if (_n(new Ie(i,c), n))
                    return !0;
                i = c
            }
            return Tr(n, e.pts[0]) ? !0 : kn(e, n.center)
        }
        o(Or, "testCirclePolygon");
        function kn(n, e) {
            let i = !1
                , c = n.pts;
            for (let m = 0, p = c.length - 1; m < c.length; p = m++)
                c[m].y > e.y != c[p].y > e.y && e.x < (c[p].x - c[m].x) * (e.y - c[m].y) / (c[p].y - c[m].y) + c[m].x && (i = !i);
            return i
        }
        o(kn, "testPolygonPoint");
        var Ie = class n {
                static{o(this, "Line")
                }p1;
                p2;
                constructor(e, i) {
                    this.p1 = e.clone(),
                        this.p2 = i.clone()
                }
                transform(e) {
                    return new n(e.multVec2(this.p1),e.multVec2(this.p2))
                }
                bbox() {
                    return de.fromPoints(this.p1, this.p2)
                }
                area() {
                    return this.p1.dist(this.p2)
                }
                clone() {
                    return new n(this.p1,this.p2)
                }
            }
            , de = class n {
                static{o(this, "Rect")
                }pos;
                width;
                height;
                constructor(e, i, c) {
                    this.pos = e.clone(),
                        this.width = i,
                        this.height = c
                }
                static fromPoints(e, i) {
                    return new n(e.clone(),i.x - e.x,i.y - e.y)
                }
                center() {
                    return new v(this.pos.x + this.width / 2,this.pos.y + this.height / 2)
                }
                points() {
                    return [this.pos, this.pos.add(this.width, 0), this.pos.add(this.width, this.height), this.pos.add(0, this.height)]
                }
                transform(e) {
                    return new Ke(this.points().map(i=>e.multVec2(i)))
                }
                bbox() {
                    return this.clone()
                }
                area() {
                    return this.width * this.height
                }
                clone() {
                    return new n(this.pos.clone(),this.width,this.height)
                }
                distToPoint(e) {
                    return Math.sqrt(this.sdistToPoint(e))
                }
                sdistToPoint(e) {
                    let i = this.pos
                        , c = this.pos.add(this.width, this.height)
                        , m = Math.max(i.x - e.x, 0, e.x - c.x)
                        , p = Math.max(i.y - e.y, 0, e.y - c.y);
                    return m * m + p * p
                }
            }
            , yt = class n {
                static{o(this, "Circle")
                }center;
                radius;
                constructor(e, i) {
                    this.center = e.clone(),
                        this.radius = i
                }
                transform(e) {
                    return new In(this.center,this.radius,this.radius).transform(e)
                }
                bbox() {
                    return de.fromPoints(this.center.sub(T(this.radius)), this.center.add(T(this.radius)))
                }
                area() {
                    return this.radius * this.radius * Math.PI
                }
                clone() {
                    return new n(this.center,this.radius)
                }
            }
            , In = class n {
                static{o(this, "Ellipse")
                }center;
                radiusX;
                radiusY;
                constructor(e, i, c) {
                    this.center = e.clone(),
                        this.radiusX = i,
                        this.radiusY = c
                }
                transform(e) {
                    return new n(e.multVec2(this.center),e.m[0] * this.radiusX,e.m[5] * this.radiusY)
                }
                bbox() {
                    return de.fromPoints(this.center.sub(T(this.radiusX, this.radiusY)), this.center.add(T(this.radiusX, this.radiusY)))
                }
                area() {
                    return this.radiusX * this.radiusY * Math.PI
                }
                clone() {
                    return new n(this.center,this.radiusX,this.radiusY)
                }
            }
            , Ke = class n {
                static{o(this, "Polygon")
                }pts;
                constructor(e) {
                    if (e.length < 3)
                        throw new Error("Polygons should have at least 3 vertices");
                    this.pts = e
                }
                transform(e) {
                    return new n(this.pts.map(i=>e.multVec2(i)))
                }
                bbox() {
                    let e = T(Number.MAX_VALUE)
                        , i = T(-Number.MAX_VALUE);
                    for (let c of this.pts)
                        e.x = Math.min(e.x, c.x),
                            i.x = Math.max(i.x, c.x),
                            e.y = Math.min(e.y, c.y),
                            i.y = Math.max(i.y, c.y);
                    return de.fromPoints(e, i)
                }
                area() {
                    let e = 0
                        , i = this.pts.length;
                    for (let c = 0; c < i; c++) {
                        let m = this.pts[c]
                            , p = this.pts[(c + 1) % i];
                        e += m.x * p.y * .5,
                            e -= p.x * m.y * .5
                    }
                    return Math.abs(e)
                }
                clone() {
                    return new n(this.pts.map(e=>e.clone()))
                }
            }
        ;
        function Rr(n, e) {
            let i = Number.MAX_VALUE
                , c = T(0);
            for (let m of [n, e])
                for (let p = 0; p < m.pts.length; p++) {
                    let P = m.pts[p]
                        , j = m.pts[(p + 1) % m.pts.length].sub(P).normal().unit()
                        , y = Number.MAX_VALUE
                        , X = -Number.MAX_VALUE;
                    for (let K = 0; K < n.pts.length; K++) {
                        let Q = n.pts[K].dot(j);
                        y = Math.min(y, Q),
                            X = Math.max(X, Q)
                    }
                    let S = Number.MAX_VALUE
                        , q = -Number.MAX_VALUE;
                    for (let K = 0; K < e.pts.length; K++) {
                        let Q = e.pts[K].dot(j);
                        S = Math.min(S, Q),
                            q = Math.max(q, Q)
                    }
                    let E = Math.min(X, q) - Math.max(y, S);
                    if (E < 0)
                        return null;
                    if (E < Math.abs(i)) {
                        let K = q - y
                            , Q = S - X;
                        i = Math.abs(K) < Math.abs(Q) ? K : Q,
                            c = j.scale(i)
                    }
                }
            return c
        }
        o(Rr, "sat");
        var Ut = class extends Map {
                static{o(this, "Registry")
                }lastID;
                constructor(...e) {
                    super(...e),
                        this.lastID = 0
                }
                push(e) {
                    let i = this.lastID;
                    return this.set(i, e),
                        this.lastID++,
                        i
                }
                pushd(e) {
                    let i = this.push(e);
                    return ()=>this.delete(i)
                }
            }
            , ke = class n {
                static{o(this, "EventController")
                }paused = !1;
                cancel;
                constructor(e) {
                    this.cancel = e
                }
                static join(e) {
                    let i = new n(()=>e.forEach(c=>c.cancel()));
                    return Object.defineProperty(i, "paused", {
                        get: ()=>e[0].paused,
                        set: c=>e.forEach(m=>m.paused = c)
                    }),
                        i.paused = !1,
                        i
                }
            }
            , be = class {
                static{o(this, "Event")
                }handlers = new Ut;
                add(e) {
                    let i = this.handlers.pushd((...m)=>{
                            c.paused || e(...m)
                        }
                    )
                        , c = new ke(i);
                    return c
                }
                addOnce(e) {
                    let i = this.add((...c)=>{
                            i.cancel(),
                                e(...c)
                        }
                    );
                    return i
                }
                next() {
                    return new Promise(e=>this.addOnce(e))
                }
                trigger(...e) {
                    this.handlers.forEach(i=>i(...e))
                }
                numListeners() {
                    return this.handlers.size
                }
                clear() {
                    this.handlers.clear()
                }
            }
            , Ne = class {
                static{o(this, "EventHandler")
                }handlers = {};
                on(e, i) {
                    return this.handlers[e] || (this.handlers[e] = new be),
                        this.handlers[e].add(i)
                }
                onOnce(e, i) {
                    let c = this.on(e, (...m)=>{
                            c.cancel(),
                                i(...m)
                        }
                    );
                    return c
                }
                next(e) {
                    return new Promise(i=>{
                            this.onOnce(e, (...c)=>i(c[0]))
                        }
                    )
                }
                trigger(e, ...i) {
                    this.handlers[e] && this.handlers[e].trigger(...i)
                }
                remove(e) {
                    delete this.handlers[e]
                }
                clear() {
                    this.handlers = {}
                }
                numListeners(e) {
                    return this.handlers[e]?.numListeners() ?? 0
                }
            }
        ;
        function Xt(n, e) {
            if (n === e)
                return !0;
            let i = typeof n
                , c = typeof e;
            if (i !== c)
                return !1;
            if (i === "object" && c === "object" && n !== null && e !== null) {
                if (Array.isArray(n) !== Array.isArray(e))
                    return !1;
                let m = Object.keys(n)
                    , p = Object.keys(e);
                if (m.length !== p.length)
                    return !1;
                for (let P of m) {
                    let I = n[P]
                        , j = e[P];
                    if (!Xt(I, j))
                        return !1
                }
                return !0
            }
            return !1
        }
        o(Xt, "deepEq");
        function Pi(n) {
            let e = window.atob(n)
                , i = e.length
                , c = new Uint8Array(i);
            for (let m = 0; m < i; m++)
                c[m] = e.charCodeAt(m);
            return c.buffer
        }
        o(Pi, "base64ToArrayBuffer");
        function Dr(n) {
            return Pi(n.split(",")[1])
        }
        o(Dr, "dataURLToArrayBuffer");
        function Jt(n, e) {
            let i = document.createElement("a");
            i.href = e,
                i.download = n,
                i.click()
        }
        o(Jt, "download");
        function Nn(n, e) {
            Jt(n, "data:text/plain;charset=utf-8," + e)
        }
        o(Nn, "downloadText");
        function Mr(n, e) {
            Nn(n, JSON.stringify(e))
        }
        o(Mr, "downloadJSON");
        function jn(n, e) {
            let i = URL.createObjectURL(e);
            Jt(n, i),
                URL.revokeObjectURL(i)
        }
        o(jn, "downloadBlob");
        var Hn = o(n=>n.match(/^data:\w+\/\w+;base64,.+/), "isDataURL");
        var Gr = o(n=>n.split(".").slice(0, -1).join("."), "getFileName");
        function Ee(n, e) {
            return (...i)=>{
                let c = i.length;
                if (c === n.length)
                    return n(...i);
                if (c === e.length)
                    return e(...i)
            }
        }
        o(Ee, "overload2");
        var Br = (()=>{
                let n = 0;
                return ()=>n++
            }
        )()
            , Fr = o(n=>n instanceof Error ? n.message : String(n), "getErrorMessage");
        var Wt = class {
                static{o(this, "BinaryHeap")
                }_items;
                _compareFn;
                constructor(e=(i,c)=>i < c) {
                    this._compareFn = e,
                        this._items = []
                }
                insert(e) {
                    this._items.push(e),
                        this.moveUp(this._items.length - 1)
                }
                remove() {
                    if (this._items.length === 0)
                        return null;
                    let e = this._items[0]
                        , i = this._items.pop();
                    return this._items.length !== 0 && (this._items[0] = i,
                        this.moveDown(0)),
                        e
                }
                clear() {
                    this._items.splice(0, this._items.length)
                }
                moveUp(e) {
                    for (; e > 0; ) {
                        let i = Math.floor((e - 1) / 2);
                        if (!this._compareFn(this._items[e], this._items[i]) && this._items[e] >= this._items[i])
                            break;
                        this.swap(e, i),
                            e = i
                    }
                }
                moveDown(e) {
                    for (; e < Math.floor(this._items.length / 2); ) {
                        let i = 2 * e + 1;
                        if (i < this._items.length - 1 && !this._compareFn(this._items[i], this._items[i + 1]) && ++i,
                            this._compareFn(this._items[e], this._items[i]))
                            break;
                        this.swap(e, i),
                            e = i
                    }
                }
                swap(e, i) {
                    [this._items[e],this._items[i]] = [this._items[i], this._items[e]]
                }
                get length() {
                    return this._items.length
                }
            }
        ;
        var Di = Object.freeze([776, 2359, 2367, 2984, 3007, 3021, 3633, 3635, 3648, 3657, 4352, 4449, 4520]);
        function Ir(n) {
            if (typeof n != "string")
                throw new TypeError("string cannot be undefined or null");
            let e = []
                , i = 0
                , c = 0;
            for (; i < n.length; ) {
                if (c += Mi(i + c, n),
                _i(n[i + c]) && c++,
                Ii(n[i + c]) && c++,
                Li(n[i + c]) && c++,
                    ki(n[i + c])) {
                    c++;
                    continue
                }
                e.push(n.substring(i, i + c)),
                    i += c,
                    c = 0
            }
            return e
        }
        o(Ir, "runes");
        function Mi(n, e) {
            let i = e[n];
            if (!Gi(i) || n === e.length - 1)
                return 1;
            let c = i + e[n + 1]
                , m = e.substring(n + 2, n + 5);
            return Pr(c) && Pr(m) ? 4 : Bi(c) && Vi(m) ? e.slice(n).indexOf(String.fromCodePoint(917631)) + 2 : Fi(m) ? 4 : 2
        }
        o(Mi, "nextUnits");
        function Gi(n) {
            return n && tt(n[0].charCodeAt(0), 55296, 56319)
        }
        o(Gi, "isFirstOfSurrogatePair");
        function Pr(n) {
            return tt(qn(n), 127462, 127487)
        }
        o(Pr, "isRegionalIndicator");
        function Bi(n) {
            return tt(qn(n), 127988, 127988)
        }
        o(Bi, "isSubdivisionFlag");
        function Fi(n) {
            return tt(qn(n), 127995, 127999)
        }
        o(Fi, "isFitzpatrickModifier");
        function Ii(n) {
            return typeof n == "string" && tt(n.charCodeAt(0), 65024, 65039)
        }
        o(Ii, "isVariationSelector");
        function Li(n) {
            return typeof n == "string" && tt(n.charCodeAt(0), 8400, 8447)
        }
        o(Li, "isDiacriticalMark");
        function Vi(n) {
            let e = n.codePointAt(0);
            return typeof n == "string" && typeof e == "number" && tt(e, 917504, 917631)
        }
        o(Vi, "isSupplementarySpecialpurposePlane");
        function _i(n) {
            return typeof n == "string" && Di.includes(n.charCodeAt(0))
        }
        o(_i, "isGrapheme");
        function ki(n) {
            return typeof n == "string" && n.charCodeAt(0) === 8205
        }
        o(ki, "isZeroWidthJoiner");
        function qn(n) {
            let e = n.charCodeAt(0) - 55296
                , i = n.charCodeAt(1) - 56320;
            return (e << 10) + i + 65536
        }
        o(qn, "codePointFromSurrogatePair");
        function tt(n, e, i) {
            return n >= e && n <= i
        }
        o(tt, "betweenInclusive");
        var $n = {
            "Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)": {
                buttons: {
                    "0": "south",
                    "1": "east",
                    "2": "west",
                    "3": "north",
                    "4": "lshoulder",
                    "5": "rshoulder",
                    "6": "ltrigger",
                    "7": "rtrigger",
                    "8": "select",
                    "9": "start",
                    "10": "lstick",
                    "11": "rstick",
                    "12": "dpad-up",
                    "13": "dpad-down",
                    "14": "dpad-left",
                    "15": "dpad-right",
                    "16": "home",
                    "17": "capture"
                },
                sticks: {
                    left: {
                        x: 0,
                        y: 1
                    },
                    right: {
                        x: 2,
                        y: 3
                    }
                }
            },
            "Joy-Con (L) (STANDARD GAMEPAD Vendor: 057e Product: 2006)": {
                buttons: {
                    "0": "south",
                    "1": "east",
                    "2": "west",
                    "3": "north",
                    "4": "lshoulder",
                    "5": "rshoulder",
                    "9": "select",
                    "10": "lstick",
                    "16": "start"
                },
                sticks: {
                    left: {
                        x: 0,
                        y: 1
                    }
                }
            },
            "Joy-Con (R) (STANDARD GAMEPAD Vendor: 057e Product: 2007)": {
                buttons: {
                    "0": "south",
                    "1": "east",
                    "2": "west",
                    "3": "north",
                    "4": "lshoulder",
                    "5": "rshoulder",
                    "9": "start",
                    "10": "lstick",
                    "16": "select"
                },
                sticks: {
                    left: {
                        x: 0,
                        y: 1
                    }
                }
            },
            "Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)": {
                buttons: {
                    "0": "south",
                    "1": "east",
                    "2": "west",
                    "3": "north",
                    "4": "lshoulder",
                    "5": "rshoulder",
                    "6": "ltrigger",
                    "7": "rtrigger",
                    "8": "select",
                    "9": "start",
                    "10": "lstick",
                    "11": "rstick",
                    "12": "dpad-up",
                    "13": "dpad-down",
                    "14": "dpad-left",
                    "15": "dpad-right",
                    "16": "home",
                    "17": "capture"
                },
                sticks: {
                    left: {
                        x: 0,
                        y: 1
                    },
                    right: {
                        x: 2,
                        y: 3
                    }
                }
            },
            default: {
                buttons: {
                    "0": "south",
                    "1": "east",
                    "2": "west",
                    "3": "north",
                    "4": "lshoulder",
                    "5": "rshoulder",
                    "6": "ltrigger",
                    "7": "rtrigger",
                    "8": "select",
                    "9": "start",
                    "10": "lstick",
                    "11": "rstick",
                    "12": "dpad-up",
                    "13": "dpad-down",
                    "14": "dpad-left",
                    "15": "dpad-right",
                    "16": "home"
                },
                sticks: {
                    left: {
                        x: 0,
                        y: 1
                    },
                    right: {
                        x: 2,
                        y: 3
                    }
                }
            }
        };
        var at = class {
            static{o(this, "ButtonState")
            }pressed = new Set([]);
            pressedRepeat = new Set([]);
            released = new Set([]);
            down = new Set([]);
            update() {
                this.pressed.clear(),
                    this.released.clear(),
                    this.pressedRepeat.clear()
            }
            press(e) {
                this.pressed.add(e),
                    this.pressedRepeat.add(e),
                    this.down.add(e)
            }
            pressRepeat(e) {
                this.pressedRepeat.add(e)
            }
            release(e) {
                this.down.delete(e),
                    this.pressed.delete(e),
                    this.released.add(e)
            }
        }
            , zn = class {
            static{o(this, "GamepadState")
            }buttonState = new at;
            stickState = new Map
        }
            , Kn = class {
            static{o(this, "FPSCounter")
            }dts = [];
            timer = 0;
            fps = 0;
            tick(e) {
                this.dts.push(e),
                    this.timer += e,
                this.timer >= 1 && (this.timer = 0,
                    this.fps = Math.round(1 / (this.dts.reduce((i,c)=>i + c) / this.dts.length)),
                    this.dts = [])
            }
        }
            , Lr = o(n=>{
                if (!n.canvas)
                    throw new Error("Please provide a canvas");
                let e = {
                    canvas: n.canvas,
                    loopID: null,
                    stopped: !1,
                    dt: 0,
                    time: 0,
                    realTime: 0,
                    fpsCounter: new Kn,
                    timeScale: 1,
                    skipTime: !1,
                    numFrames: 0,
                    mousePos: new v(0),
                    mouseDeltaPos: new v(0),
                    keyState: new at,
                    mouseState: new at,
                    mergedGamepadState: new zn,
                    gamepadStates: new Map,
                    gamepads: [],
                    charInputted: [],
                    isMouseMoved: !1,
                    lastWidth: n.canvas.offsetWidth,
                    lastHeight: n.canvas.offsetHeight,
                    events: new Ne
                };
                function i() {
                    return e.dt * e.timeScale
                }
                o(i, "dt");
                function c() {
                    return e.time
                }
                o(c, "time");
                function m() {
                    return e.fpsCounter.fps
                }
                o(m, "fps");
                function p() {
                    return e.numFrames
                }
                o(p, "numFrames");
                function P() {
                    return e.canvas.toDataURL()
                }
                o(P, "screenshot");
                function I(l) {
                    e.canvas.style.cursor = l
                }
                o(I, "setCursor");
                function j() {
                    return e.canvas.style.cursor
                }
                o(j, "getCursor");
                function y(l) {
                    if (l)
                        try {
                            let x = e.canvas.requestPointerLock();
                            x.catch && x.catch(R=>console.error(R))
                        } catch (x) {
                            console.error(x)
                        }
                    else
                        document.exitPointerLock()
                }
                o(y, "setCursorLocked");
                function X() {
                    return !!document.pointerLockElement
                }
                o(X, "isCursorLocked");
                function S(l) {
                    l.requestFullscreen ? l.requestFullscreen() : l.webkitRequestFullscreen && l.webkitRequestFullscreen()
                }
                o(S, "enterFullscreen");
                function q() {
                    document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullScreen && document.webkitExitFullScreen()
                }
                o(q, "exitFullscreen");
                function E() {
                    return document.fullscreenElement || document.webkitFullscreenElement
                }
                o(E, "getFullscreenElement");
                function K(l=!0) {
                    l ? S(e.canvas) : q()
                }
                o(K, "setFullscreen");
                function Q() {
                    return !!E()
                }
                o(Q, "isFullscreen");
                function te() {
                    e.stopped = !0;
                    for (let l in se)
                        e.canvas.removeEventListener(l, se[l]);
                    for (let l in le)
                        document.removeEventListener(l, le[l]);
                    for (let l in ae)
                        window.removeEventListener(l, ae[l]);
                    ge.disconnect()
                }
                o(te, "quit");
                function k(l) {
                    e.loopID !== null && cancelAnimationFrame(e.loopID);
                    let x = 0
                        , R = o(L=>{
                            if (e.stopped)
                                return;
                            if (document.visibilityState !== "visible") {
                                e.loopID = requestAnimationFrame(R);
                                return
                            }
                            let he = L / 1e3
                                , z = he - e.realTime
                                , Oe = n.maxFPS ? 1 / n.maxFPS : 0;
                            e.realTime = he,
                                x += z,
                            x > Oe && (e.skipTime || (e.dt = x,
                                e.time += i(),
                                e.fpsCounter.tick(e.dt)),
                                x = 0,
                                e.skipTime = !1,
                                e.numFrames++,
                                ft(),
                                l(),
                                yn()),
                                e.loopID = requestAnimationFrame(R)
                        }
                        , "frame");
                    R(0)
                }
                o(k, "run");
                function pe() {
                    return "ontouchstart"in window || navigator.maxTouchPoints > 0
                }
                o(pe, "isTouchscreen");
                function C() {
                    return e.mousePos.clone()
                }
                o(C, "mousePos");
                function Ae() {
                    return e.mouseDeltaPos.clone()
                }
                o(Ae, "mouseDeltaPos");
                function $(l="left") {
                    return e.mouseState.pressed.has(l)
                }
                o($, "isMousePressed");
                function Te(l="left") {
                    return e.mouseState.down.has(l)
                }
                o(Te, "isMouseDown");
                function ye(l="left") {
                    return e.mouseState.released.has(l)
                }
                o(ye, "isMouseReleased");
                function Se() {
                    return e.isMouseMoved
                }
                o(Se, "isMouseMoved");
                function st(l) {
                    return l === void 0 ? e.keyState.pressed.size > 0 : e.keyState.pressed.has(l)
                }
                o(st, "isKeyPressed");
                function an(l) {
                    return l === void 0 ? e.keyState.pressedRepeat.size > 0 : e.keyState.pressedRepeat.has(l)
                }
                o(an, "isKeyPressedRepeat");
                function Tt(l) {
                    return l === void 0 ? e.keyState.down.size > 0 : e.keyState.down.has(l)
                }
                o(Tt, "isKeyDown");
                function Ot(l) {
                    return l === void 0 ? e.keyState.released.size > 0 : e.keyState.released.has(l)
                }
                o(Ot, "isKeyReleased");
                function Rt(l) {
                    return l === void 0 ? e.mergedGamepadState.buttonState.pressed.size > 0 : e.mergedGamepadState.buttonState.pressed.has(l)
                }
                o(Rt, "isGamepadButtonPressed");
                function Ye(l) {
                    return l === void 0 ? e.mergedGamepadState.buttonState.down.size > 0 : e.mergedGamepadState.buttonState.down.has(l)
                }
                o(Ye, "isGamepadButtonDown");
                function un(l) {
                    return l === void 0 ? e.mergedGamepadState.buttonState.released.size > 0 : e.mergedGamepadState.buttonState.released.has(l)
                }
                o(un, "isGamepadButtonReleased");
                function cn(l) {
                    return e.events.on("resize", l)
                }
                o(cn, "onResize");
                let hn = Ee(l=>e.events.on("keyDown", l), (l,x)=>e.events.on("keyDown", R=>R === l && x(l)))
                    , ln = Ee(l=>e.events.on("keyPress", l), (l,x)=>e.events.on("keyPress", R=>R === l && x(l)))
                    , dn = Ee(l=>e.events.on("keyPressRepeat", l), (l,x)=>e.events.on("keyPressRepeat", R=>R === l && x(l)))
                    , fn = Ee(l=>e.events.on("keyRelease", l), (l,x)=>e.events.on("keyRelease", R=>R === l && x(l)))
                    , Pt = Ee(l=>e.events.on("mouseDown", x=>l(x)), (l,x)=>e.events.on("mouseDown", R=>R === l && x(R)))
                    , Dt = Ee(l=>e.events.on("mousePress", x=>l(x)), (l,x)=>e.events.on("mousePress", R=>R === l && x(R)))
                    , Mt = Ee(l=>e.events.on("mouseRelease", x=>l(x)), (l,x)=>e.events.on("mouseRelease", R=>R === l && x(R)));
                function Gt(l) {
                    return e.events.on("mouseMove", ()=>l(C(), Ae()))
                }
                o(Gt, "onMouseMove");
                function Bt(l) {
                    return e.events.on("charInput", l)
                }
                o(Bt, "onCharInput");
                function mn(l) {
                    return e.events.on("touchStart", l)
                }
                o(mn, "onTouchStart");
                function ct(l) {
                    return e.events.on("touchMove", l)
                }
                o(ct, "onTouchMove");
                function pn(l) {
                    return e.events.on("touchEnd", l)
                }
                o(pn, "onTouchEnd");
                function gn(l) {
                    return e.events.on("scroll", l)
                }
                o(gn, "onScroll");
                function Ft(l) {
                    return e.events.on("hide", l)
                }
                o(Ft, "onHide");
                function wn(l) {
                    return e.events.on("show", l)
                }
                o(wn, "onShow");
                function It(l, x) {
                    if (typeof l == "function")
                        return e.events.on("gamepadButtonDown", l);
                    if (typeof l == "string" && typeof x == "function")
                        return e.events.on("gamepadButtonDown", R=>R === l && x(l))
                }
                o(It, "onGamepadButtonDown");
                function Lt(l, x) {
                    if (typeof l == "function")
                        return e.events.on("gamepadButtonPress", l);
                    if (typeof l == "string" && typeof x == "function")
                        return e.events.on("gamepadButtonPress", R=>R === l && x(l))
                }
                o(Lt, "onGamepadButtonPress");
                function bn(l, x) {
                    if (typeof l == "function")
                        return e.events.on("gamepadButtonRelease", l);
                    if (typeof l == "string" && typeof x == "function")
                        return e.events.on("gamepadButtonRelease", R=>R === l && x(l))
                }
                o(bn, "onGamepadButtonRelease");
                function ht(l, x) {
                    return e.events.on("gamepadStick", (R,L)=>R === l && x(L))
                }
                o(ht, "onGamepadStick");
                function vn(l) {
                    e.events.on("gamepadConnect", l)
                }
                o(vn, "onGamepadConnect");
                function lt(l) {
                    e.events.on("gamepadDisconnect", l)
                }
                o(lt, "onGamepadDisconnect");
                function Pe(l) {
                    return e.mergedGamepadState.stickState.get(l) || new v(0)
                }
                o(Pe, "getGamepadStick");
                function dt() {
                    return [...e.charInputted]
                }
                o(dt, "charInputted");
                function Vt() {
                    return [...e.gamepads]
                }
                o(Vt, "getGamepads");
                function ft() {
                    e.events.trigger("input"),
                        e.keyState.down.forEach(l=>e.events.trigger("keyDown", l)),
                        e.mouseState.down.forEach(l=>e.events.trigger("mouseDown", l)),
                        He()
                }
                o(ft, "processInput");
                function yn() {
                    e.keyState.update(),
                        e.mouseState.update(),
                        e.mergedGamepadState.buttonState.update(),
                        e.mergedGamepadState.stickState.forEach((l,x)=>{
                                e.mergedGamepadState.stickState.set(x, new v(0))
                            }
                        ),
                        e.charInputted = [],
                        e.isMouseMoved = !1,
                        e.gamepadStates.forEach(l=>{
                                l.buttonState.update(),
                                    l.stickState.forEach((x,R)=>{
                                            l.stickState.set(R, new v(0))
                                        }
                                    )
                            }
                        )
                }
                o(yn, "resetInput");
                function _t(l) {
                    let x = {
                        index: l.index,
                        isPressed: R=>e.gamepadStates.get(l.index).buttonState.pressed.has(R),
                        isDown: R=>e.gamepadStates.get(l.index).buttonState.down.has(R),
                        isReleased: R=>e.gamepadStates.get(l.index).buttonState.released.has(R),
                        getStick: R=>e.gamepadStates.get(l.index).stickState.get(R)
                    };
                    return e.gamepads.push(x),
                        e.gamepadStates.set(l.index, {
                            buttonState: new at,
                            stickState: new Map([["left", new v(0)], ["right", new v(0)]])
                        }),
                        x
                }
                o(_t, "registerGamepad");
                function ne(l) {
                    e.gamepads = e.gamepads.filter(x=>x.index !== l.index),
                        e.gamepadStates.delete(l.index)
                }
                o(ne, "removeGamepad");
                function He() {
                    for (let l of navigator.getGamepads())
                        l && !e.gamepadStates.has(l.index) && _t(l);
                    for (let l of e.gamepads) {
                        let x = navigator.getGamepads()[l.index]
                            , L = (n.gamepads ?? {})[x.id] ?? $n[x.id] ?? $n.default
                            , he = e.gamepadStates.get(l.index);
                        for (let z = 0; z < x.buttons.length; z++)
                            x.buttons[z].pressed ? (he.buttonState.down.has(L.buttons[z]) || (e.mergedGamepadState.buttonState.press(L.buttons[z]),
                                he.buttonState.press(L.buttons[z]),
                                e.events.trigger("gamepadButtonPress", L.buttons[z])),
                                e.events.trigger("gamepadButtonDown", L.buttons[z])) : he.buttonState.down.has(L.buttons[z]) && (e.mergedGamepadState.buttonState.release(L.buttons[z]),
                                he.buttonState.release(L.buttons[z]),
                                e.events.trigger("gamepadButtonRelease", L.buttons[z]));
                        for (let z in L.sticks) {
                            let Oe = L.sticks[z]
                                , $e = new v(x.axes[Oe.x],x.axes[Oe.y]);
                            he.stickState.set(z, $e),
                                e.mergedGamepadState.stickState.set(z, $e),
                                e.events.trigger("gamepadStick", z, $e)
                        }
                    }
                }
                o(He, "processGamepad");
                let se = {}
                    , le = {}
                    , ae = {}
                    , Be = n.pixelDensity || window.devicePixelRatio || 1;
                se.mousemove = l=>{
                    let x = new v(l.offsetX,l.offsetY)
                        , R = new v(l.movementX,l.movementY);
                    if (Q()) {
                        let L = e.canvas.width / Be
                            , he = e.canvas.height / Be
                            , z = window.innerWidth
                            , Oe = window.innerHeight
                            , $e = z / Oe
                            , kt = L / he;
                        if ($e > kt) {
                            let De = Oe / he
                                , Ce = (z - L * De) / 2;
                            x.x = _e(l.offsetX - Ce, 0, L * De, 0, L),
                                x.y = _e(l.offsetY, 0, he * De, 0, he)
                        } else {
                            let De = z / L
                                , Ce = (Oe - he * De) / 2;
                            x.x = _e(l.offsetX, 0, L * De, 0, L),
                                x.y = _e(l.offsetY - Ce, 0, he * De, 0, he)
                        }
                    }
                    e.events.onOnce("input", ()=>{
                            e.isMouseMoved = !0,
                                e.mousePos = x,
                                e.mouseDeltaPos = R,
                                e.events.trigger("mouseMove")
                        }
                    )
                }
                ;
                let We = ["left", "middle", "right", "back", "forward"];
                se.mousedown = l=>{
                    e.events.onOnce("input", ()=>{
                            let x = We[l.button];
                            x && (e.mouseState.press(x),
                                e.events.trigger("mousePress", x))
                        }
                    )
                }
                    ,
                    se.mouseup = l=>{
                        e.events.onOnce("input", ()=>{
                                let x = We[l.button];
                                x && (e.mouseState.release(x),
                                    e.events.trigger("mouseRelease", x))
                            }
                        )
                    }
                ;
                let xn = new Set([" ", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"])
                    , qe = {
                    ArrowLeft: "left",
                    ArrowRight: "right",
                    ArrowUp: "up",
                    ArrowDown: "down",
                    " ": "space"
                };
                se.keydown = l=>{
                    xn.has(l.key) && l.preventDefault(),
                        e.events.onOnce("input", ()=>{
                                let x = qe[l.key] || l.key.toLowerCase();
                                x.length === 1 ? (e.events.trigger("charInput", x),
                                    e.charInputted.push(x)) : x === "space" && (e.events.trigger("charInput", " "),
                                    e.charInputted.push(" ")),
                                    l.repeat ? (e.keyState.pressRepeat(x),
                                        e.events.trigger("keyPressRepeat", x)) : (e.keyState.press(x),
                                        e.events.trigger("keyPressRepeat", x),
                                        e.events.trigger("keyPress", x))
                            }
                        )
                }
                    ,
                    se.keyup = l=>{
                        e.events.onOnce("input", ()=>{
                                let x = qe[l.key] || l.key.toLowerCase();
                                e.keyState.release(x),
                                    e.events.trigger("keyRelease", x)
                            }
                        )
                    }
                    ,
                    se.touchstart = l=>{
                        l.preventDefault(),
                            e.events.onOnce("input", ()=>{
                                    let x = [...l.changedTouches]
                                        , R = e.canvas.getBoundingClientRect();
                                    n.touchToMouse !== !1 && (e.mousePos = new v(x[0].clientX - R.x,x[0].clientY - R.y),
                                        e.mouseState.press("left"),
                                        e.events.trigger("mousePress", "left")),
                                        x.forEach(L=>{
                                                e.events.trigger("touchStart", new v(L.clientX - R.x,L.clientY - R.y), L)
                                            }
                                        )
                                }
                            )
                    }
                    ,
                    se.touchmove = l=>{
                        l.preventDefault(),
                            e.events.onOnce("input", ()=>{
                                    let x = [...l.changedTouches]
                                        , R = e.canvas.getBoundingClientRect();
                                    n.touchToMouse !== !1 && (e.mousePos = new v(x[0].clientX - R.x,x[0].clientY - R.y),
                                        e.events.trigger("mouseMove")),
                                        x.forEach(L=>{
                                                e.events.trigger("touchMove", new v(L.clientX - R.x,L.clientY - R.y), L)
                                            }
                                        )
                                }
                            )
                    }
                    ,
                    se.touchend = l=>{
                        e.events.onOnce("input", ()=>{
                                let x = [...l.changedTouches]
                                    , R = e.canvas.getBoundingClientRect();
                                n.touchToMouse !== !1 && (e.mousePos = new v(x[0].clientX - R.x,x[0].clientY - R.y),
                                    e.mouseState.release("left"),
                                    e.events.trigger("mouseRelease", "left")),
                                    x.forEach(L=>{
                                            e.events.trigger("touchEnd", new v(L.clientX - R.x,L.clientY - R.y), L)
                                        }
                                    )
                            }
                        )
                    }
                    ,
                    se.touchcancel = l=>{
                        e.events.onOnce("input", ()=>{
                                let x = [...l.changedTouches]
                                    , R = e.canvas.getBoundingClientRect();
                                n.touchToMouse !== !1 && (e.mousePos = new v(x[0].clientX - R.x,x[0].clientY - R.y),
                                    e.mouseState.release("left"),
                                    e.events.trigger("mouseRelease", "left")),
                                    x.forEach(L=>{
                                            e.events.trigger("touchEnd", new v(L.clientX - R.x,L.clientY - R.y), L)
                                        }
                                    )
                            }
                        )
                    }
                    ,
                    se.wheel = l=>{
                        l.preventDefault(),
                            e.events.onOnce("input", ()=>{
                                    e.events.trigger("scroll", new v(l.deltaX,l.deltaY))
                                }
                            )
                    }
                    ,
                    se.contextmenu = l=>l.preventDefault(),
                    le.visibilitychange = ()=>{
                        document.visibilityState === "visible" ? (e.skipTime = !0,
                            e.events.trigger("show")) : e.events.trigger("hide")
                    }
                    ,
                    ae.gamepadconnected = l=>{
                        let x = _t(l.gamepad);
                        e.events.onOnce("input", ()=>{
                                e.events.trigger("gamepadConnect", x)
                            }
                        )
                    }
                    ,
                    ae.gamepaddisconnected = l=>{
                        let x = Vt().filter(R=>R.index === l.gamepad.index)[0];
                        ne(l.gamepad),
                            e.events.onOnce("input", ()=>{
                                    e.events.trigger("gamepadDisconnect", x)
                                }
                            )
                    }
                ;
                for (let l in se)
                    e.canvas.addEventListener(l, se[l]);
                for (let l in le)
                    document.addEventListener(l, le[l]);
                for (let l in ae)
                    window.addEventListener(l, ae[l]);
                let ge = new ResizeObserver(l=>{
                        for (let x of l)
                            if (x.target === e.canvas) {
                                if (e.lastWidth === e.canvas.offsetWidth && e.lastHeight === e.canvas.offsetHeight)
                                    return;
                                e.lastWidth = e.canvas.offsetWidth,
                                    e.lastHeight = e.canvas.offsetHeight,
                                    e.events.onOnce("input", ()=>{
                                            e.events.trigger("resize")
                                        }
                                    )
                            }
                    }
                );
                return ge.observe(e.canvas),
                    {
                        dt: i,
                        time: c,
                        run: k,
                        canvas: e.canvas,
                        fps: m,
                        numFrames: p,
                        quit: te,
                        setFullscreen: K,
                        isFullscreen: Q,
                        setCursor: I,
                        screenshot: P,
                        getGamepads: Vt,
                        getCursor: j,
                        setCursorLocked: y,
                        isCursorLocked: X,
                        isTouchscreen: pe,
                        mousePos: C,
                        mouseDeltaPos: Ae,
                        isKeyDown: Tt,
                        isKeyPressed: st,
                        isKeyPressedRepeat: an,
                        isKeyReleased: Ot,
                        isMouseDown: Te,
                        isMousePressed: $,
                        isMouseReleased: ye,
                        isMouseMoved: Se,
                        isGamepadButtonPressed: Rt,
                        isGamepadButtonDown: Ye,
                        isGamepadButtonReleased: un,
                        getGamepadStick: Pe,
                        charInputted: dt,
                        onResize: cn,
                        onKeyDown: hn,
                        onKeyPress: ln,
                        onKeyPressRepeat: dn,
                        onKeyRelease: fn,
                        onMouseDown: Pt,
                        onMousePress: Dt,
                        onMouseRelease: Mt,
                        onMouseMove: Gt,
                        onCharInput: Bt,
                        onTouchStart: mn,
                        onTouchMove: ct,
                        onTouchEnd: pn,
                        onScroll: gn,
                        onHide: Ft,
                        onShow: wn,
                        onGamepadButtonDown: It,
                        onGamepadButtonPress: Lt,
                        onGamepadButtonRelease: bn,
                        onGamepadStick: ht,
                        onGamepadConnect: vn,
                        onGamepadDisconnect: lt,
                        events: e.events
                    }
            }
            , "default");
        var Re = class n {
                static{o(this, "Texture")
                }ctx;
                src = null;
                glTex;
                width;
                height;
                constructor(e, i, c, m={}) {
                    this.ctx = e;
                    let p = e.gl;
                    this.glTex = e.gl.createTexture(),
                        e.onDestroy(()=>this.free()),
                        this.width = i,
                        this.height = c;
                    let P = {
                        linear: p.LINEAR,
                        nearest: p.NEAREST
                    }[m.filter ?? e.opts.texFilter] ?? p.NEAREST
                        , I = {
                        repeat: p.REPEAT,
                        clampToEadge: p.CLAMP_TO_EDGE
                    }[m.wrap] ?? p.CLAMP_TO_EDGE;
                    this.bind(),
                    i && c && p.texImage2D(p.TEXTURE_2D, 0, p.RGBA, i, c, 0, p.RGBA, p.UNSIGNED_BYTE, null),
                        p.texParameteri(p.TEXTURE_2D, p.TEXTURE_MIN_FILTER, P),
                        p.texParameteri(p.TEXTURE_2D, p.TEXTURE_MAG_FILTER, P),
                        p.texParameteri(p.TEXTURE_2D, p.TEXTURE_WRAP_S, I),
                        p.texParameteri(p.TEXTURE_2D, p.TEXTURE_WRAP_T, I),
                        this.unbind()
                }
                static fromImage(e, i, c={}) {
                    let m = new n(e,i.width,i.height,c);
                    return m.update(i),
                        m.src = i,
                        m
                }
                update(e, i=0, c=0) {
                    let m = this.ctx.gl;
                    this.bind(),
                        m.texSubImage2D(m.TEXTURE_2D, 0, i, c, m.RGBA, m.UNSIGNED_BYTE, e),
                        this.unbind()
                }
                bind() {
                    this.ctx.pushTexture2D(this.glTex)
                }
                unbind() {
                    this.ctx.popTexture2D()
                }
                free() {
                    this.ctx.gl.deleteTexture(this.glTex)
                }
            }
            , rt = class {
                static{o(this, "FrameBuffer")
                }ctx;
                tex;
                glFramebuffer;
                glRenderbuffer;
                constructor(e, i, c, m={}) {
                    this.ctx = e;
                    let p = e.gl;
                    e.onDestroy(()=>this.free()),
                        this.tex = new Re(e,i,c,m),
                        this.glFramebuffer = p.createFramebuffer(),
                        this.glRenderbuffer = p.createRenderbuffer(),
                        this.bind(),
                        p.renderbufferStorage(p.RENDERBUFFER, p.DEPTH_STENCIL, i, c),
                        p.framebufferTexture2D(p.FRAMEBUFFER, p.COLOR_ATTACHMENT0, p.TEXTURE_2D, this.tex.glTex, 0),
                        p.framebufferRenderbuffer(p.FRAMEBUFFER, p.DEPTH_STENCIL_ATTACHMENT, p.RENDERBUFFER, this.glRenderbuffer),
                        this.unbind()
                }
                get width() {
                    return this.tex.width
                }
                get height() {
                    return this.tex.height
                }
                toImageData() {
                    let e = this.ctx.gl
                        , i = new Uint8ClampedArray(this.width * this.height * 4);
                    this.bind(),
                        e.readPixels(0, 0, this.width, this.height, e.RGBA, e.UNSIGNED_BYTE, i),
                        this.unbind();
                    let c = this.width * 4
                        , m = new Uint8Array(c);
                    for (let p = 0; p < (this.height / 2 | 0); p++) {
                        let P = p * c
                            , I = (this.height - p - 1) * c;
                        m.set(i.subarray(P, P + c)),
                            i.copyWithin(P, I, I + c),
                            i.set(m, I)
                    }
                    return new ImageData(i,this.width,this.height)
                }
                toDataURL() {
                    let e = document.createElement("canvas")
                        , i = e.getContext("2d");
                    return e.width = this.width,
                        e.height = this.height,
                        i.putImageData(this.toImageData(), 0, 0),
                        e.toDataURL()
                }
                draw(e) {
                    this.bind(),
                        e(),
                        this.unbind()
                }
                bind() {
                    this.ctx.pushFramebuffer(this.glFramebuffer),
                        this.ctx.pushRenderbuffer(this.glRenderbuffer),
                        this.ctx.pushViewport({
                            x: 0,
                            y: 0,
                            w: this.width,
                            h: this.height
                        })
                }
                unbind() {
                    this.ctx.popFramebuffer(),
                        this.ctx.popRenderbuffer(),
                        this.ctx.popViewport()
                }
                free() {
                    let e = this.ctx.gl;
                    e.deleteFramebuffer(this.glFramebuffer),
                        e.deleteRenderbuffer(this.glRenderbuffer),
                        this.tex.free()
                }
            }
            , Qt = class {
                static{o(this, "Shader")
                }ctx;
                glProgram;
                constructor(e, i, c, m) {
                    this.ctx = e,
                        e.onDestroy(()=>this.free());
                    let p = e.gl
                        , P = p.createShader(p.VERTEX_SHADER)
                        , I = p.createShader(p.FRAGMENT_SHADER);
                    p.shaderSource(P, i),
                        p.shaderSource(I, c),
                        p.compileShader(P),
                        p.compileShader(I);
                    let j = p.createProgram();
                    if (this.glProgram = j,
                        p.attachShader(j, P),
                        p.attachShader(j, I),
                        m.forEach((y,X)=>p.bindAttribLocation(j, X, y)),
                        p.linkProgram(j),
                        !p.getProgramParameter(j, p.LINK_STATUS)) {
                        let y = p.getShaderInfoLog(P);
                        if (y)
                            throw new Error("VERTEX SHADER " + y);
                        let X = p.getShaderInfoLog(I);
                        if (X)
                            throw new Error("FRAGMENT SHADER " + X)
                    }
                    p.deleteShader(P),
                        p.deleteShader(I)
                }
                bind() {
                    this.ctx.pushProgram(this.glProgram)
                }
                unbind() {
                    this.ctx.popProgram()
                }
                send(e) {
                    let i = this.ctx.gl;
                    for (let c in e) {
                        let m = e[c]
                            , p = i.getUniformLocation(this.glProgram, c);
                        typeof m == "number" ? i.uniform1f(p, m) : m instanceof Ue ? i.uniformMatrix4fv(p, !1, new Float32Array(m.m)) : m instanceof W ? i.uniform3f(p, m.r, m.g, m.b) : m instanceof v && i.uniform2f(p, m.x, m.y)
                    }
                }
                free() {
                    this.ctx.gl.deleteProgram(this.glProgram)
                }
            }
            , Zt = class {
                static{o(this, "BatchRenderer")
                }ctx;
                glVBuf;
                glIBuf;
                vqueue = [];
                iqueue = [];
                stride;
                maxVertices;
                maxIndices;
                vertexFormat;
                numDraws = 0;
                curPrimitive = null;
                curTex = null;
                curShader = null;
                curUniform = {};
                constructor(e, i, c, m) {
                    let p = e.gl;
                    this.vertexFormat = i,
                        this.ctx = e,
                        this.stride = i.reduce((P,I)=>P + I.size, 0),
                        this.maxVertices = c,
                        this.maxIndices = m,
                        this.glVBuf = p.createBuffer(),
                        e.pushArrayBuffer(this.glVBuf),
                        p.bufferData(p.ARRAY_BUFFER, c * 4, p.DYNAMIC_DRAW),
                        e.popArrayBuffer(),
                        this.glIBuf = p.createBuffer(),
                        e.pushElementArrayBuffer(this.glIBuf),
                        p.bufferData(p.ELEMENT_ARRAY_BUFFER, m * 4, p.DYNAMIC_DRAW),
                        e.popElementArrayBuffer()
                }
                push(e, i, c, m, p=null, P={}) {
                    (e !== this.curPrimitive || p !== this.curTex || m !== this.curShader || !Xt(this.curUniform, P) || this.vqueue.length + i.length * this.stride > this.maxVertices || this.iqueue.length + c.length > this.maxIndices) && this.flush();
                    let I = this.vqueue.length / this.stride;
                    for (let j of i)
                        this.vqueue.push(j);
                    for (let j of c)
                        this.iqueue.push(j + I);
                    this.curPrimitive = e,
                        this.curShader = m,
                        this.curTex = p,
                        this.curUniform = P
                }
                flush() {
                    if (!this.curPrimitive || !this.curShader || this.vqueue.length === 0 || this.iqueue.length === 0)
                        return;
                    let e = this.ctx.gl;
                    this.ctx.pushArrayBuffer(this.glVBuf),
                        e.bufferSubData(e.ARRAY_BUFFER, 0, new Float32Array(this.vqueue)),
                        this.ctx.pushElementArrayBuffer(this.glIBuf),
                        e.bufferSubData(e.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.iqueue)),
                        this.ctx.setVertexFormat(this.vertexFormat),
                        this.curShader.bind(),
                        this.curShader.send(this.curUniform),
                        this.curTex?.bind(),
                        e.drawElements(this.curPrimitive, this.iqueue.length, e.UNSIGNED_SHORT, 0),
                        this.curTex?.unbind(),
                        this.curShader.unbind(),
                        this.ctx.popArrayBuffer(),
                        this.ctx.popElementArrayBuffer(),
                        this.vqueue = [],
                        this.iqueue = [],
                        this.numDraws++
                }
                free() {
                    let e = this.ctx.gl;
                    e.deleteBuffer(this.glVBuf),
                        e.deleteBuffer(this.glIBuf)
                }
            }
        ;
        function nt(n) {
            let e = []
                , i = o(p=>{
                    e.push(p),
                        n(p)
                }
                , "push")
                , c = o(()=>{
                    e.pop(),
                        n(m() ?? null)
                }
                , "pop")
                , m = o(()=>e[e.length - 1], "cur");
            return [i, c, m]
        }
        o(nt, "genStack");
        function Yn(n, e={}) {
            let i = [];
            function c($) {
                i.push($)
            }
            o(c, "onDestroy");
            function m() {
                i.forEach($=>$()),
                    n.getExtension("WEBGL_lose_context").loseContext()
            }
            o(m, "destroy");
            let p = null;
            function P($) {
                if (Xt($, p))
                    return;
                p = $;
                let Te = $.reduce((ye,Se)=>ye + Se.size, 0);
                $.reduce((ye,Se,st)=>(n.vertexAttribPointer(st, Se.size, n.FLOAT, !1, Te * 4, ye),
                    n.enableVertexAttribArray(st),
                ye + Se.size * 4), 0)
            }
            o(P, "setVertexFormat");
            let[I,j] = nt($=>n.bindTexture(n.TEXTURE_2D, $))
                , [y,X] = nt($=>n.bindBuffer(n.ARRAY_BUFFER, $))
                , [S,q] = nt($=>n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, $))
                , [E,K] = nt($=>n.bindFramebuffer(n.FRAMEBUFFER, $))
                , [Q,te] = nt($=>n.bindRenderbuffer(n.RENDERBUFFER, $))
                , [k,pe] = nt(({x: $, y: Te, w: ye, h: Se})=>{
                    n.viewport($, Te, ye, Se)
                }
            )
                , [C,Ae] = nt($=>n.useProgram($));
            return k({
                x: 0,
                y: 0,
                w: n.drawingBufferWidth,
                h: n.drawingBufferHeight
            }),
                {
                    gl: n,
                    opts: e,
                    onDestroy: c,
                    destroy: m,
                    pushTexture2D: I,
                    popTexture2D: j,
                    pushArrayBuffer: y,
                    popArrayBuffer: X,
                    pushElementArrayBuffer: S,
                    popElementArrayBuffer: q,
                    pushFramebuffer: E,
                    popFramebuffer: K,
                    pushRenderbuffer: Q,
                    popRenderbuffer: te,
                    pushViewport: k,
                    popViewport: pe,
                    pushProgram: C,
                    popProgram: Ae,
                    setVertexFormat: P
                }
        }
        o(Yn, "initGfx");
        var ve = class n {
                static{o(this, "Asset")
                }loaded = !1;
                data = null;
                error = null;
                onLoadEvents = new be;
                onErrorEvents = new be;
                onFinishEvents = new be;
                constructor(e) {
                    e.then(i=>{
                            this.data = i,
                                this.onLoadEvents.trigger(i)
                        }
                    ).catch(i=>{
                            if (this.error = i,
                            this.onErrorEvents.numListeners() > 0)
                                this.onErrorEvents.trigger(i);
                            else
                                throw i
                        }
                    ).finally(()=>{
                            this.onFinishEvents.trigger(),
                                this.loaded = !0
                        }
                    )
                }
                static loaded(e) {
                    let i = new n(Promise.resolve(e));
                    return i.data = e,
                        i.loaded = !0,
                        i
                }
                onLoad(e) {
                    return this.loaded && this.data ? e(this.data) : this.onLoadEvents.add(e),
                        this
                }
                onError(e) {
                    return this.loaded && this.error ? e(this.error) : this.onErrorEvents.add(e),
                        this
                }
                onFinish(e) {
                    return this.loaded ? e() : this.onFinishEvents.add(e),
                        this
                }
                then(e) {
                    return this.onLoad(e)
                }
                catch(e) {
                    return this.onError(e)
                }
                finally(e) {
                    return this.onFinish(e)
                }
            }
            , je = class {
                static{o(this, "AssetBucket")
                }assets = new Map;
                lastUID = 0;
                add(e, i) {
                    let c = e ?? this.lastUID++ + ""
                        , m = new ve(i);
                    return this.assets.set(c, m),
                        m
                }
                addLoaded(e, i) {
                    let c = e ?? this.lastUID++ + ""
                        , m = ve.loaded(i);
                    return this.assets.set(c, m),
                        m
                }
                get(e) {
                    return this.assets.get(e)
                }
                progress() {
                    if (this.assets.size === 0)
                        return 1;
                    let e = 0;
                    return this.assets.forEach(i=>{
                            i.loaded && e++
                        }
                    ),
                    e / this.assets.size
                }
            }
        ;
        function Wn(n) {
            return fetch(n).then(e=>{
                    if (!e.ok)
                        throw new Error(`Failed to fetch "${n}"`);
                    return e
                }
            )
        }
        o(Wn, "fetchURL");
        function Et(n) {
            return Wn(n).then(e=>e.json())
        }
        o(Et, "fetchJSON");
        function Vr(n) {
            return Wn(n).then(e=>e.text())
        }
        o(Vr, "fetchText");
        function _r(n) {
            return Wn(n).then(e=>e.arrayBuffer())
        }
        o(_r, "fetchArrayBuffer");
        function St(n) {
            let e = new Image;
            return e.crossOrigin = "anonymous",
                e.src = n,
                new Promise((i,c)=>{
                        e.onload = ()=>i(e),
                            e.onerror = ()=>c(new Error(`Failed to load image from "${n}"`))
                    }
                )
        }
        o(St, "loadImg");
        var en = 2.5949095
            , kr = 1.70158 + 1
            , Nr = 2 * Math.PI / 3
            , jr = 2 * Math.PI / 4.5
            , tn = {
            linear: n=>n,
            easeInSine: n=>1 - Math.cos(n * Math.PI / 2),
            easeOutSine: n=>Math.sin(n * Math.PI / 2),
            easeInOutSine: n=>-(Math.cos(Math.PI * n) - 1) / 2,
            easeInQuad: n=>n * n,
            easeOutQuad: n=>1 - (1 - n) * (1 - n),
            easeInOutQuad: n=>n < .5 ? 2 * n * n : 1 - Math.pow(-2 * n + 2, 2) / 2,
            easeInCubic: n=>n * n * n,
            easeOutCubic: n=>1 - Math.pow(1 - n, 3),
            easeInOutCubic: n=>n < .5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2,
            easeInQuart: n=>n * n * n * n,
            easeOutQuart: n=>1 - Math.pow(1 - n, 4),
            easeInOutQuart: n=>n < .5 ? 8 * n * n * n * n : 1 - Math.pow(-2 * n + 2, 4) / 2,
            easeInQuint: n=>n * n * n * n * n,
            easeOutQuint: n=>1 - Math.pow(1 - n, 5),
            easeInOutQuint: n=>n < .5 ? 16 * n * n * n * n * n : 1 - Math.pow(-2 * n + 2, 5) / 2,
            easeInExpo: n=>n === 0 ? 0 : Math.pow(2, 10 * n - 10),
            easeOutExpo: n=>n === 1 ? 1 : 1 - Math.pow(2, -10 * n),
            easeInOutExpo: n=>n === 0 ? 0 : n === 1 ? 1 : n < .5 ? Math.pow(2, 20 * n - 10) / 2 : (2 - Math.pow(2, -20 * n + 10)) / 2,
            easeInCirc: n=>1 - Math.sqrt(1 - Math.pow(n, 2)),
            easeOutCirc: n=>Math.sqrt(1 - Math.pow(n - 1, 2)),
            easeInOutCirc: n=>n < .5 ? (1 - Math.sqrt(1 - Math.pow(2 * n, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * n + 2, 2)) + 1) / 2,
            easeInBack: n=>kr * n * n * n - 1.70158 * n * n,
            easeOutBack: n=>1 + kr * Math.pow(n - 1, 3) + 1.70158 * Math.pow(n - 1, 2),
            easeInOutBack: n=>n < .5 ? Math.pow(2 * n, 2) * ((en + 1) * 2 * n - en) / 2 : (Math.pow(2 * n - 2, 2) * ((en + 1) * (n * 2 - 2) + en) + 2) / 2,
            easeInElastic: n=>n === 0 ? 0 : n === 1 ? 1 : -Math.pow(2, 10 * n - 10) * Math.sin((n * 10 - 10.75) * Nr),
            easeOutElastic: n=>n === 0 ? 0 : n === 1 ? 1 : Math.pow(2, -10 * n) * Math.sin((n * 10 - .75) * Nr) + 1,
            easeInOutElastic: n=>n === 0 ? 0 : n === 1 ? 1 : n < .5 ? -(Math.pow(2, 20 * n - 10) * Math.sin((20 * n - 11.125) * jr)) / 2 : Math.pow(2, -20 * n + 10) * Math.sin((20 * n - 11.125) * jr) / 2 + 1,
            easeInBounce: n=>1 - tn.easeOutBounce(1 - n),
            easeOutBounce: n=>n < 1 / 2.75 ? 7.5625 * n * n : n < 2 / 2.75 ? 7.5625 * (n -= 1.5 / 2.75) * n + .75 : n < 2.5 / 2.75 ? 7.5625 * (n -= 2.25 / 2.75) * n + .9375 : 7.5625 * (n -= 2.625 / 2.75) * n + .984375,
            easeInOutBounce: n=>n < .5 ? (1 - tn.easeOutBounce(1 - 2 * n)) / 2 : (1 + tn.easeOutBounce(2 * n - 1)) / 2
        }
            , Ct = tn;
        var At = class {
                static{o(this, "TexPacker")
                }textures = [];
                canvas;
                c2d;
                x = 0;
                y = 0;
                curHeight = 0;
                gfx;
                constructor(e, i, c) {
                    this.gfx = e,
                        this.canvas = document.createElement("canvas"),
                        this.canvas.width = i,
                        this.canvas.height = c,
                        this.textures = [Re.fromImage(e, this.canvas)],
                        this.c2d = this.canvas.getContext("2d")
                }
                add(e) {
                    if (e.width > this.canvas.width || e.height > this.canvas.height)
                        throw new Error(`Texture size (${e.width} x ${e.height}) exceeds limit (${this.canvas.width} x ${this.canvas.height})`);
                    this.x + e.width > this.canvas.width && (this.x = 0,
                        this.y += this.curHeight,
                        this.curHeight = 0),
                    this.y + e.height > this.canvas.height && (this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height),
                        this.textures.push(Re.fromImage(this.gfx, this.canvas)),
                        this.x = 0,
                        this.y = 0,
                        this.curHeight = 0);
                    let i = this.textures[this.textures.length - 1]
                        , c = new v(this.x,this.y);
                    return this.x += e.width,
                    e.height > this.curHeight && (this.curHeight = e.height),
                        e instanceof ImageData ? this.c2d.putImageData(e, c.x, c.y) : this.c2d.drawImage(e, c.x, c.y),
                        i.update(this.canvas),
                        [i, new oe(c.x / this.canvas.width,c.y / this.canvas.height,e.width / this.canvas.width,e.height / this.canvas.height)]
                }
                free() {
                    for (let e of this.textures)
                        e.free()
                }
            }
        ;
        var Hr = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA1CAYAAADyMeOEAAAAAXNSR0IArs4c6QAAAoVJREFUaIHdm7txwkAQhheGAqACiCHzOKQDQrqgILpwSAeEDBnEUAF0gCMxZ7G72qce/mec2Lpf9+3unaS78wgSNZ8uX5729+d1FNWXUuGmXlBOUUEIMckEpeQJgBu6C+BSFngztBR2vd+ovY+7g+p6LbgaWgJrAeUkDYIUXgXdBBwNi6kpABJwMTQH3AZsXRR8GHTfgEth8E3gjdAUcNewpbTgY85sCMCUuOokozE0YM0YRzM9NGAAXd8+omAF5h4lnmBRvpSnZHyLoLEbaN+aKB9KWv/KWw0tAbbANnlG+UvB2dm77NxxdwgBpjrF/d7rW9cbmpvio2A5z8iAYpVU8pGZlo6/2+MSco2lHfd3rv9jAP038e1xef9o2mjvYb2OqpqKE81028/jeietlSEVO5FRWsxWsJit1G3aFpW8iWe5RwpiCZAk25QvV6nz6fIlynRGuTd5WqpJ4guAlDfVKBK87hXljflgv1ON6fV+4+5gVlA17SfeG0heKqQd4l4jI/wrmaA9N9R4ar+wpHJDZyrrfcH0nB66PqAzPi76pn+faSyJk/vzOorYhGurQrzj/P68jtBMawHaHBIR9xoD5O34dy0qQOSYHvqExq2TpT2nf76+w7y251OYF0CRaU+J920TwLUa6inx6OxE6g80lu2ux7Y2eJLF/rCXE6zEPdnenk9o+4ih9AEdnW2q81HXl5LuU6OTl2fXUhqganbXAGq3g6jJOWV/OnoesO6YqqEB/GdNsjf7uHtwj2DzmRNpp7iOZfm6D9oAxB6Yi1gC4oIYeo4MIPdopEQRB+cAko5J1tW386HpB2Kz1eop4Epdwls/kgZ1sh8gZsEjdcWkr//D8Qu3Z3l5Nl1NtAAAAABJRU5ErkJggg==";
        var qr = wr("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L5QNSqT5iiySS9Ja2SV//5ME0ak//+4KgAAABgQBAADAMDgYCAEgCteQ0fZH6+ICXA357+MPfhR/+ywRf/U///LVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JknQAFoWhGLm5gBClBmT3GiAAAAAGkHAAAIAAANIOAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
        var $r = "data:image/png;base64,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";
        var zr = "data:image/png;base64,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";
        var zi = "3000.1.17"
            , Kr = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
            , nn = "topleft"
            , Yr = 64
            , Ki = "monospace"
            , rn = "monospace"
            , Yi = 36
            , sn = 64
            , on = 256
            , Wr = 2048
            , Xr = 2048
            , Jr = 2048
            , Qr = 2048
            , Zr = .1
            , Wi = 64
            , Xn = "linear"
            , Xi = 8
            , Ji = 4
            , Zn = [{
            name: "a_pos",
            size: 2
        }, {
            name: "a_uv",
            size: 2
        }, {
            name: "a_color",
            size: 4
        }]
            , Qi = Zn.reduce((n,e)=>n + e.size, 0)
            , es = 2048
            , Zi = es * 4 * Qi
            , eo = es * 6
            , to = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 0.0, 1.0);
}

{{user}}

void main() {
	vec4 pos = vert(a_pos, a_uv, a_color);
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
`
            , no = `
precision mediump float;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

{{user}}

void main() {
	gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`
            , Jn = `
vec4 vert(vec2 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`
            , Qn = `
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`
            , ro = new Set(["id", "require"])
            , so = new Set(["add", "update", "draw", "destroy", "inspect", "drawInspect"]);
        function ut(n) {
            switch (n) {
                case "topleft":
                    return new v(-1,-1);
                case "top":
                    return new v(0,-1);
                case "topright":
                    return new v(1,-1);
                case "left":
                    return new v(-1,0);
                case "center":
                    return new v(0,0);
                case "right":
                    return new v(1,0);
                case "botleft":
                    return new v(-1,1);
                case "bot":
                    return new v(0,1);
                case "botright":
                    return new v(1,1);
                default:
                    return n
            }
        }
        o(ut, "anchorPt");
        function io(n) {
            switch (n) {
                case "left":
                    return 0;
                case "center":
                    return .5;
                case "right":
                    return 1;
                default:
                    return 0
            }
        }
        o(io, "alignPt");
        function oo(n) {
            return n.createBuffer(1, 1, 44100)
        }
        o(oo, "createEmptyAudioBuffer");
        var ao = o((n={})=>{
                let e = n.root ?? document.body;
                e === document.body && (document.body.style.width = "100%",
                    document.body.style.height = "100%",
                    document.body.style.margin = "0px",
                    document.documentElement.style.width = "100%",
                    document.documentElement.style.height = "100%");
                let i = n.canvas ?? (()=>{
                        let t = document.createElement("canvas");
                        return e.appendChild(t),
                            t
                    }
                )()
                    , c = n.scale ?? 1
                    , m = n.width && n.height && !n.stretch && !n.letterbox;
                m ? (i.width = n.width * c,
                    i.height = n.height * c) : (i.width = i.parentElement.offsetWidth,
                    i.height = i.parentElement.offsetHeight);
                let p = ["outline: none", "cursor: default"];
                if (m) {
                    let t = i.width
                        , r = i.height;
                    p.push(`width: ${t}px`),
                        p.push(`height: ${r}px`)
                } else
                    p.push("width: 100%"),
                        p.push("height: 100%");
                n.crisp && (p.push("image-rendering: pixelated"),
                    p.push("image-rendering: crisp-edges")),
                    i.style.cssText = p.join(";");
                let P = n.pixelDensity || window.devicePixelRatio;
                i.width *= P,
                    i.height *= P,
                    i.tabIndex = 0;
                let I = document.createElement("canvas");
                I.width = on,
                    I.height = on;
                let j = I.getContext("2d", {
                    willReadFrequently: !0
                })
                    , y = Lr({
                    canvas: i,
                    touchToMouse: n.touchToMouse,
                    gamepads: n.gamepads,
                    pixelDensity: n.pixelDensity,
                    maxFPS: n.maxFPS
                })
                    , X = []
                    , S = y.canvas.getContext("webgl", {
                    antialias: !0,
                    depth: !0,
                    stencil: !0,
                    alpha: !0,
                    preserveDrawingBuffer: !0
                })
                    , q = Yn(S, {
                    texFilter: n.texFilter
                })
                    , E = (()=>{
                        let t = ht(Jn, Qn)
                            , r = Re.fromImage(q, new ImageData(new Uint8ClampedArray([255, 255, 255, 255]),1,1))
                            , s = n.width && n.height ? new rt(q,n.width * P * c,n.height * P * c) : new rt(q,S.drawingBufferWidth,S.drawingBufferHeight)
                            , u = null
                            , a = 1;
                        n.background && (u = J(n.background),
                            a = Array.isArray(n.background) ? n.background[3] : 1,
                            S.clearColor(u.r / 255, u.g / 255, u.b / 255, a ?? 1)),
                            S.enable(S.BLEND),
                            S.blendFuncSeparate(S.SRC_ALPHA, S.ONE_MINUS_SRC_ALPHA, S.ONE, S.ONE_MINUS_SRC_ALPHA);
                        let h = new Zt(q,Zn,Zi,eo)
                            , f = Re.fromImage(q, new ImageData(new Uint8ClampedArray([128, 128, 128, 255, 190, 190, 190, 255, 190, 190, 190, 255, 128, 128, 128, 255]),2,2), {
                            wrap: "repeat",
                            filter: "nearest"
                        });
                        return {
                            lastDrawCalls: 0,
                            defShader: t,
                            defTex: r,
                            frameBuffer: s,
                            postShader: null,
                            postShaderUniform: null,
                            renderer: h,
                            transform: new Ue,
                            transformStack: [],
                            bgTex: f,
                            bgColor: u,
                            bgAlpha: a,
                            width: n.width ?? S.drawingBufferWidth / P / c,
                            height: n.height ?? S.drawingBufferHeight / P / c,
                            viewport: {
                                x: 0,
                                y: 0,
                                width: S.drawingBufferWidth,
                                height: S.drawingBufferHeight
                            },
                            fixed: !1
                        }
                    }
                )();
                class K {
                    static{o(this, "SpriteData")
                    }tex;
                    frames = [new oe(0,0,1,1)];
                    anims = {};
                    slice9 = null;
                    constructor(r, s, u={}, a=null) {
                        this.tex = r,
                        s && (this.frames = s),
                            this.anims = u,
                            this.slice9 = a
                    }
                    get width() {
                        return this.tex.width * this.frames[0].w
                    }
                    get height() {
                        return this.tex.height * this.frames[0].h
                    }
                    static from(r, s={}) {
                        return typeof r == "string" ? K.fromURL(r, s) : Promise.resolve(K.fromImage(r, s))
                    }
                    static fromImage(r, s={}) {
                        let[u,a] = k.packer.add(r)
                            , h = s.frames ? s.frames.map(f=>new oe(a.x + f.x * a.w,a.y + f.y * a.h,f.w * a.w,f.h * a.h)) : Tt(s.sliceX || 1, s.sliceY || 1, a.x, a.y, a.w, a.h);
                        return new K(u,h,s.anims,s.slice9)
                    }
                    static fromURL(r, s={}) {
                        return St(r).then(u=>K.fromImage(u, s))
                    }
                }
                class Q {
                    static{o(this, "SoundData")
                    }buf;
                    constructor(r) {
                        this.buf = r
                    }
                    static fromArrayBuffer(r) {
                        return new Promise((s,u)=>te.ctx.decodeAudioData(r, s, u)).then(s=>new Q(s))
                    }
                    static fromURL(r) {
                        return Hn(r) ? Q.fromArrayBuffer(Dr(r)) : _r(r).then(s=>Q.fromArrayBuffer(s))
                    }
                }
                let te = (()=>{
                        let t = new (window.AudioContext || window.webkitAudioContext)
                            , r = t.createGain();
                        r.connect(t.destination);
                        let s = new Q(oo(t));
                        return t.decodeAudioData(qr.buffer.slice(0)).then(u=>{
                                s.buf = u
                            }
                        ).catch(u=>{
                                console.error("Failed to load burp: ", u)
                            }
                        ),
                            {
                                ctx: t,
                                masterNode: r,
                                burpSnd: s
                            }
                    }
                )()
                    , k = {
                    urlPrefix: "",
                    sprites: new je,
                    fonts: new je,
                    bitmapFonts: new je,
                    sounds: new je,
                    shaders: new je,
                    custom: new je,
                    packer: new At(q,Jr,Qr),
                    loaded: !1
                };
                function pe(t) {
                    return typeof t != "string" || Hn(t) ? t : k.urlPrefix + t
                }
                o(pe, "fixURL");
                let C = {
                    events: new Ne,
                    objEvents: new Ne,
                    root: En([]),
                    gravity: 0,
                    scenes: {},
                    logs: [],
                    cam: {
                        pos: null,
                        scale: new v(1),
                        angle: 0,
                        shake: 0,
                        transform: new Ue
                    }
                };
                C.root.use(Tn());
                function Ae(t) {
                    return k.custom.add(null, t)
                }
                o(Ae, "load");
                function $() {
                    let t = [k.sprites, k.sounds, k.shaders, k.fonts, k.bitmapFonts, k.custom];
                    return t.reduce((r,s)=>r + s.progress(), 0) / t.length
                }
                o($, "loadProgress");
                function Te(t) {
                    return t !== void 0 && (k.urlPrefix = t),
                        k.urlPrefix
                }
                o(Te, "loadRoot");
                function ye(t, r) {
                    return k.custom.add(t, Et(r))
                }
                o(ye, "loadJSON");
                class Se {
                    static{o(this, "FontData")
                    }fontface;
                    filter = Xn;
                    outline = null;
                    size = sn;
                    constructor(r, s={}) {
                        if (this.fontface = r,
                            this.filter = s.filter ?? Xn,
                            this.size = s.size ?? sn,
                        this.size > on)
                            throw new Error(`Max font size: ${on}`);
                        s.outline && (this.outline = {
                            width: 1,
                            color: J(0, 0, 0)
                        },
                            typeof s.outline == "number" ? this.outline.width = s.outline : typeof s.outline == "object" && (s.outline.width && (this.outline.width = s.outline.width),
                            s.outline.color && (this.outline.color = s.outline.color)))
                    }
                }
                function st(t, r, s={}) {
                    let u = new FontFace(t,typeof r == "string" ? `url(${r})` : r);
                    return document.fonts.add(u),
                        k.fonts.add(t, u.load().catch(a=>{
                                throw new Error(`Failed to load font from "${r}": ${a}`)
                            }
                        ).then(a=>new Se(a,s)))
                }
                o(st, "loadFont");
                function an(t, r, s, u, a={}) {
                    return k.bitmapFonts.add(t, St(r).then(h=>vn(Re.fromImage(q, h, a), s, u, a.chars ?? Kr)))
                }
                o(an, "loadBitmapFont");
                function Tt(t=1, r=1, s=0, u=0, a=1, h=1) {
                    let f = []
                        , b = a / t
                        , g = h / r;
                    for (let d = 0; d < r; d++)
                        for (let w = 0; w < t; w++)
                            f.push(new oe(s + w * b,u + d * g,b,g));
                    return f
                }
                o(Tt, "slice");
                function Ot(t, r) {
                    return t = pe(t),
                        Ae(typeof r == "string" ? new Promise((s,u)=>{
                                Et(r).then(a=>{
                                        Ot(t, a).then(s).catch(u)
                                    }
                                )
                            }
                        ) : K.from(t).then(s=>{
                                let u = {};
                                for (let a in r) {
                                    let h = r[a]
                                        , f = s.frames[0]
                                        , b = Jr * f.w
                                        , g = Qr * f.h
                                        , d = h.frames ? h.frames.map(A=>new oe(f.x + (h.x + A.x) / b * f.w,f.y + (h.y + A.y) / g * f.h,A.w / b * f.w,A.h / g * f.h)) : Tt(h.sliceX || 1, h.sliceY || 1, f.x + h.x / b * f.w, f.y + h.y / g * f.h, h.width / b * f.w, h.height / g * f.h)
                                        , w = new K(s.tex,d,h.anims);
                                    k.sprites.addLoaded(a, w),
                                        u[a] = w
                                }
                                return u
                            }
                        ))
                }
                o(Ot, "loadSpriteAtlas");
                function Rt(t, r={}) {
                    let s = document.createElement("canvas")
                        , u = t[0].width
                        , a = t[0].height;
                    s.width = u * t.length,
                        s.height = a;
                    let h = s.getContext("2d");
                    t.forEach((b,g)=>{
                            b instanceof ImageData ? h.putImageData(b, g * u, 0) : h.drawImage(b, g * u, 0)
                        }
                    );
                    let f = h.getImageData(0, 0, t.length * u, a);
                    return K.fromImage(f, {
                        ...r,
                        sliceX: t.length,
                        sliceY: 1
                    })
                }
                o(Rt, "createSpriteSheet");
                function Ye(t, r, s={
                    sliceX: 1,
                    sliceY: 1,
                    anims: {}
                }) {
                    return r = pe(r),
                        Array.isArray(r) ? r.some(u=>typeof u == "string") ? k.sprites.add(t, Promise.all(r.map(u=>typeof u == "string" ? St(u) : Promise.resolve(u))).then(u=>Rt(u, s))) : k.sprites.addLoaded(t, Rt(r, s)) : typeof r == "string" ? k.sprites.add(t, K.from(r, s)) : k.sprites.addLoaded(t, K.fromImage(r, s))
                }
                o(Ye, "loadSprite");
                function un(t, r) {
                    return r = pe(r),
                        k.sprites.add(t, new Promise(async s=>{
                                let u = typeof r == "string" ? await Et(r) : r
                                    , a = await Promise.all(u.frames.map(St))
                                    , h = document.createElement("canvas");
                                h.width = u.width,
                                    h.height = u.height * u.frames.length;
                                let f = h.getContext("2d");
                                a.forEach((g,d)=>{
                                        f.drawImage(g, 0, d * u.height)
                                    }
                                );
                                let b = await Ye(null, h, {
                                    sliceY: u.frames.length,
                                    anims: u.anims
                                });
                                s(b)
                            }
                        ))
                }
                o(un, "loadPedit");
                function cn(t, r, s) {
                    r = pe(r),
                        s = pe(s),
                    typeof r == "string" && !s && (s = Gr(r) + ".json");
                    let u = typeof s == "string" ? Et(s) : Promise.resolve(s);
                    return k.sprites.add(t, u.then(a=>{
                            let h = a.meta.size
                                , f = a.frames.map(g=>new oe(g.frame.x / h.w,g.frame.y / h.h,g.frame.w / h.w,g.frame.h / h.h))
                                , b = {};
                            for (let g of a.meta.frameTags)
                                g.from === g.to ? b[g.name] = g.from : b[g.name] = {
                                    from: g.from,
                                    to: g.to,
                                    speed: 10,
                                    loop: !0,
                                    pingpong: g.direction === "pingpong"
                                };
                            return K.from(r, {
                                frames: f,
                                anims: b
                            })
                        }
                    ))
                }
                o(cn, "loadAseprite");
                function hn(t, r, s) {
                    return k.shaders.addLoaded(t, ht(r, s))
                }
                o(hn, "loadShader");
                function ln(t, r, s) {
                    r = pe(r),
                        s = pe(s);
                    let u = o(h=>h ? Vr(h) : Promise.resolve(null), "resolveUrl")
                        , a = Promise.all([u(r), u(s)]).then(([h,f])=>ht(h, f));
                    return k.shaders.add(t, a)
                }
                o(ln, "loadShaderURL");
                function dn(t, r) {
                    return r = pe(r),
                        k.sounds.add(t, typeof r == "string" ? Q.fromURL(r) : Q.fromArrayBuffer(r))
                }
                o(dn, "loadSound");
                function fn(t="bean") {
                    return Ye(t, Hr)
                }
                o(fn, "loadBean");
                function Pt(t) {
                    return k.sprites.get(t)
                }
                o(Pt, "getSprite");
                function Dt(t) {
                    return k.sounds.get(t)
                }
                o(Dt, "getSound");
                function Mt(t) {
                    return k.fonts.get(t)
                }
                o(Mt, "getFont");
                function Gt(t) {
                    return k.bitmapFonts.get(t)
                }
                o(Gt, "getBitmapFont");
                function Bt(t) {
                    return k.shaders.get(t)
                }
                o(Bt, "getShader");
                function mn(t) {
                    return k.custom.get(t)
                }
                o(mn, "getAsset");
                function ct(t) {
                    if (typeof t == "string") {
                        let r = Pt(t);
                        if (r)
                            return r;
                        if ($() < 1)
                            return null;
                        throw new Error(`Sprite not found: ${t}`)
                    } else {
                        if (t instanceof K)
                            return ve.loaded(t);
                        if (t instanceof ve)
                            return t;
                        throw new Error(`Invalid sprite: ${t}`)
                    }
                }
                o(ct, "resolveSprite");
                function pn(t) {
                    if (typeof t == "string") {
                        let r = Dt(t);
                        if (r)
                            return r;
                        if ($() < 1)
                            return null;
                        throw new Error(`Sound not found: ${t}`)
                    } else {
                        if (t instanceof Q)
                            return ve.loaded(t);
                        if (t instanceof ve)
                            return t;
                        throw new Error(`Invalid sound: ${t}`)
                    }
                }
                o(pn, "resolveSound");
                function gn(t) {
                    if (!t)
                        return E.defShader;
                    if (typeof t == "string") {
                        let r = Bt(t);
                        if (r)
                            return r.data ?? r;
                        if ($() < 1)
                            return null;
                        throw new Error(`Shader not found: ${t}`)
                    } else if (t instanceof ve)
                        return t.data ? t.data : t;
                    return t
                }
                o(gn, "resolveShader");
                function Ft(t) {
                    if (!t)
                        return Ft(n.font ?? Ki);
                    if (typeof t == "string") {
                        let r = Gt(t)
                            , s = Mt(t);
                        if (r)
                            return r.data ?? r;
                        if (s)
                            return s.data ?? s;
                        if (document.fonts.check(`${sn}px ${t}`))
                            return t;
                        if ($() < 1)
                            return null;
                        throw new Error(`Font not found: ${t}`)
                    } else if (t instanceof ve)
                        return t.data ? t.data : t;
                    return t
                }
                o(Ft, "resolveFont");
                function wn(t) {
                    return t !== void 0 && (te.masterNode.gain.value = t),
                        te.masterNode.gain.value
                }
                o(wn, "volume");
                function It(t, r={}) {
                    let s = te.ctx
                        , u = r.paused ?? !1
                        , a = s.createBufferSource()
                        , h = new be
                        , f = s.createGain()
                        , b = r.seek ?? 0
                        , g = 0
                        , d = 0
                        , w = !1;
                    a.loop = !!r.loop,
                        a.detune.value = r.detune ?? 0,
                        a.playbackRate.value = r.speed ?? 1,
                        a.connect(f),
                        a.onended = ()=>{
                            N() >= a.buffer?.duration && h.trigger()
                        }
                        ,
                        f.connect(te.masterNode),
                        f.gain.value = r.volume ?? 1;
                    let A = o(M=>{
                            a.buffer = M.buf,
                            u || (g = s.currentTime,
                                a.start(0, b),
                                w = !0)
                        }
                        , "start")
                        , D = pn(t);
                    D instanceof ve && D.onLoad(A);
                    let N = o(()=>{
                            if (!a.buffer)
                                return 0;
                            let M = u ? d - g : s.currentTime - g
                                , O = a.buffer.duration;
                            return a.loop ? M % O : Math.min(M, O)
                        }
                        , "getTime")
                        , _ = o(M=>{
                            let O = s.createBufferSource();
                            return O.buffer = M.buffer,
                                O.loop = M.loop,
                                O.playbackRate.value = M.playbackRate.value,
                                O.detune.value = M.detune.value,
                                O.onended = M.onended,
                                O.connect(f),
                                O
                        }
                        , "cloneNode");
                    return {
                        stop() {
                            this.paused = !0,
                                this.seek(0)
                        },
                        set paused(M) {
                            if (u !== M)
                                if (u = M,
                                    M)
                                    w && (a.stop(),
                                        w = !1),
                                        d = s.currentTime;
                                else {
                                    a = _(a);
                                    let O = d - g;
                                    a.start(0, O),
                                        w = !0,
                                        g = s.currentTime - O,
                                        d = 0
                                }
                        },
                        get paused() {
                            return u
                        },
                        play(M=0) {
                            this.seek(M),
                                this.paused = !1
                        },
                        seek(M) {
                            a.buffer?.duration && (M > a.buffer.duration || (u ? (a = _(a),
                                g = d - M) : (a.stop(),
                                a = _(a),
                                g = s.currentTime - M,
                                a.start(0, M),
                                w = !0,
                                d = 0)))
                        },
                        set speed(M) {
                            a.playbackRate.value = M
                        },
                        get speed() {
                            return a.playbackRate.value
                        },
                        set detune(M) {
                            a.detune.value = M
                        },
                        get detune() {
                            return a.detune.value
                        },
                        set volume(M) {
                            f.gain.value = Math.max(M, 0)
                        },
                        get volume() {
                            return f.gain.value
                        },
                        set loop(M) {
                            a.loop = M
                        },
                        get loop() {
                            return a.loop
                        },
                        duration() {
                            return a.buffer?.duration ?? 0
                        },
                        time() {
                            return N() % this.duration()
                        },
                        onEnd(M) {
                            return h.add(M)
                        },
                        then(M) {
                            return this.onEnd(M)
                        }
                    }
                }
                o(It, "play");
                function Lt(t) {
                    return It(te.burpSnd, t)
                }
                o(Lt, "burp");
                function bn(t, r) {
                    return new rt(q,t,r)
                }
                o(bn, "makeCanvas");
                function ht(t=Jn, r=Qn) {
                    let s = to.replace("{{user}}", t ?? Jn)
                        , u = no.replace("{{user}}", r ?? Qn);
                    try {
                        return new Qt(q,s,u,Zn.map(a=>a.name))
                    } catch (a) {
                        let f = /(?<type>^\w+) SHADER ERROR: 0:(?<line>\d+): (?<msg>.+)/
                            , b = Fr(a).match(f)
                            , g = Number(b.groups.line) - 14
                            , d = b.groups.msg.trim()
                            , w = b.groups.type.toLowerCase();
                        throw new Error(`${w} shader line ${g}: ${d}`)
                    }
                }
                o(ht, "makeShader");
                function vn(t, r, s, u) {
                    let a = t.width / r
                        , h = {}
                        , f = u.split("").entries();
                    for (let[b,g] of f)
                        h[g] = new oe(b % a * r,Math.floor(b / a) * s,r,s);
                    return {
                        tex: t,
                        map: h,
                        size: s
                    }
                }
                o(vn, "makeFont");
                function lt(t, r, s, u=E.defTex, a=E.defShader, h={}) {
                    let f = gn(a);
                    if (!f || f instanceof ve)
                        return;
                    let b = E.fixed || s ? E.transform : C.cam.transform.mult(E.transform)
                        , g = [];
                    for (let d of t) {
                        let w = yn(b.multVec2(d.pos));
                        g.push(w.x, w.y, d.uv.x, d.uv.y, d.color.r / 255, d.color.g / 255, d.color.b / 255, d.opacity)
                    }
                    E.renderer.push(S.TRIANGLES, g, r, f, u, h)
                }
                o(lt, "drawRaw");
                function Pe() {
                    E.renderer.flush()
                }
                o(Pe, "flush");
                function dt() {
                    S.clear(S.COLOR_BUFFER_BIT),
                        E.frameBuffer.bind(),
                        S.clear(S.COLOR_BUFFER_BIT),
                    E.bgColor || Ce(()=>{
                            Be({
                                width: we(),
                                height: xe(),
                                quad: new oe(0,0,we() / Yr,xe() / Yr),
                                tex: E.bgTex,
                                fixed: !0
                            })
                        }
                    ),
                        E.renderer.numDraws = 0,
                        E.fixed = !1,
                        E.transformStack.length = 0,
                        E.transform = new Ue
                }
                o(dt, "frameStart");
                function Vt(t, r) {
                    E.postShader = t,
                        E.postShaderUniform = r ?? null
                }
                o(Vt, "usePostEffect");
                function ft() {
                    Pe(),
                        E.lastDrawCalls = E.renderer.numDraws,
                        E.frameBuffer.unbind(),
                        S.viewport(0, 0, S.drawingBufferWidth, S.drawingBufferHeight);
                    let t = E.width
                        , r = E.height;
                    E.width = S.drawingBufferWidth / P,
                        E.height = S.drawingBufferHeight / P,
                        We({
                            flipY: !0,
                            tex: E.frameBuffer.tex,
                            pos: new v(E.viewport.x,E.viewport.y),
                            width: E.viewport.width,
                            height: E.viewport.height,
                            shader: E.postShader,
                            uniform: typeof E.postShaderUniform == "function" ? E.postShaderUniform() : E.postShaderUniform,
                            fixed: !0
                        }),
                        Pe(),
                        E.width = t,
                        E.height = r
                }
                o(ft, "frameEnd");
                function yn(t) {
                    return new v(t.x / we() * 2 - 1,-t.y / xe() * 2 + 1)
                }
                o(yn, "screen2ndc");
                function _t(t) {
                    E.transform = t.clone()
                }
                o(_t, "pushMatrix");
                function ne(...t) {
                    if (t[0] === void 0)
                        return;
                    let r = T(...t);
                    r.x === 0 && r.y === 0 || E.transform.translate(r)
                }
                o(ne, "pushTranslate");
                function He(...t) {
                    if (t[0] === void 0)
                        return;
                    let r = T(...t);
                    r.x === 1 && r.y === 1 || E.transform.scale(r)
                }
                o(He, "pushScale");
                function se(t) {
                    t && E.transform.rotate(t)
                }
                o(se, "pushRotate");
                function le() {
                    E.transformStack.push(E.transform.clone())
                }
                o(le, "pushTransform");
                function ae() {
                    E.transformStack.length > 0 && (E.transform = E.transformStack.pop())
                }
                o(ae, "popTransform");
                function Be(t) {
                    if (t.width === void 0 || t.height === void 0)
                        throw new Error('drawUVQuad() requires property "width" and "height".');
                    if (t.width <= 0 || t.height <= 0)
                        return;
                    let r = t.width
                        , s = t.height
                        , a = ut(t.anchor || nn).scale(new v(r,s).scale(-.5))
                        , h = t.quad || new oe(0,0,1,1)
                        , f = t.color || J(255, 255, 255)
                        , b = t.opacity ?? 1
                        , g = t.tex ? Zr / t.tex.width : 0
                        , d = t.tex ? Zr / t.tex.height : 0
                        , w = h.x + g
                        , A = h.y + d
                        , D = h.w - g * 2
                        , N = h.h - d * 2;
                    le(),
                        ne(t.pos),
                        se(t.angle),
                        He(t.scale),
                        ne(a),
                        lt([{
                            pos: new v(-r / 2,s / 2),
                            uv: new v(t.flipX ? w + D : w,t.flipY ? A : A + N),
                            color: f,
                            opacity: b
                        }, {
                            pos: new v(-r / 2,-s / 2),
                            uv: new v(t.flipX ? w + D : w,t.flipY ? A + N : A),
                            color: f,
                            opacity: b
                        }, {
                            pos: new v(r / 2,-s / 2),
                            uv: new v(t.flipX ? w : w + D,t.flipY ? A + N : A),
                            color: f,
                            opacity: b
                        }, {
                            pos: new v(r / 2,s / 2),
                            uv: new v(t.flipX ? w : w + D,t.flipY ? A : A + N),
                            color: f,
                            opacity: b
                        }], [0, 1, 3, 1, 2, 3], t.fixed, t.tex, t.shader, t.uniform),
                        ae()
                }
                o(Be, "drawUVQuad");
                function We(t) {
                    if (!t.tex)
                        throw new Error('drawTexture() requires property "tex".');
                    let r = t.quad ?? new oe(0,0,1,1)
                        , s = t.tex.width * r.w
                        , u = t.tex.height * r.h
                        , a = new v(1);
                    if (t.tiled) {
                        let h = Math.ceil((t.width || s) / s)
                            , f = Math.ceil((t.height || u) / u)
                            , g = ut(t.anchor || nn).add(new v(1,1)).scale(.5).scale(h * s, f * u);
                        for (let d = 0; d < h; d++)
                            for (let w = 0; w < f; w++)
                                Be(Object.assign({}, t, {
                                    pos: (t.pos || new v(0)).add(new v(s * d,u * w)).sub(g),
                                    scale: a.scale(t.scale || new v(1)),
                                    tex: t.tex,
                                    quad: r,
                                    width: s,
                                    height: u,
                                    anchor: "topleft"
                                }))
                    } else
                        t.width && t.height ? (a.x = t.width / s,
                            a.y = t.height / u) : t.width ? (a.x = t.width / s,
                            a.y = a.x) : t.height && (a.y = t.height / u,
                            a.x = a.y),
                            Be(Object.assign({}, t, {
                                scale: a.scale(t.scale || new v(1)),
                                tex: t.tex,
                                quad: r,
                                width: s,
                                height: u
                            }))
                }
                o(We, "drawTexture");
                function xn(t) {
                    if (!t.sprite)
                        throw new Error('drawSprite() requires property "sprite"');
                    let r = ct(t.sprite);
                    if (!r || !r.data)
                        return;
                    let s = r.data.frames[t.frame ?? 0];
                    if (!s)
                        throw new Error(`Frame not found: ${t.frame ?? 0}`);
                    We(Object.assign({}, t, {
                        tex: r.data.tex,
                        quad: s.scale(t.quad ?? new oe(0,0,1,1))
                    }))
                }
                o(xn, "drawSprite");
                function qe(t, r, s, u, a, h=1) {
                    u = Ge(u % 360),
                        a = Ge(a % 360),
                    a <= u && (a += Math.PI * 2);
                    let f = []
                        , b = Math.ceil((a - u) / Ge(8) * h)
                        , g = (a - u) / b;
                    for (let d = u; d < a; d += g)
                        f.push(t.add(r * Math.cos(d), s * Math.sin(d)));
                    return f.push(t.add(r * Math.cos(a), s * Math.sin(a))),
                        f
                }
                o(qe, "getArcPts");
                function ge(t) {
                    if (t.width === void 0 || t.height === void 0)
                        throw new Error('drawRect() requires property "width" and "height".');
                    if (t.width <= 0 || t.height <= 0)
                        return;
                    let r = t.width
                        , s = t.height
                        , a = ut(t.anchor || nn).add(1, 1).scale(new v(r,s).scale(-.5))
                        , h = [new v(0,0), new v(r,0), new v(r,s), new v(0,s)];
                    if (t.radius) {
                        let f = Math.min(Math.min(r, s) / 2, t.radius);
                        h = [new v(f,0), new v(r - f,0), ...qe(new v(r - f,f), f, f, 270, 360), new v(r,f), new v(r,s - f), ...qe(new v(r - f,s - f), f, f, 0, 90), new v(r - f,s), new v(f,s), ...qe(new v(f,s - f), f, f, 90, 180), new v(0,s - f), new v(0,f), ...qe(new v(f,f), f, f, 180, 270)]
                    }
                    z(Object.assign({}, t, {
                        offset: a,
                        pts: h,
                        ...t.gradient ? {
                            colors: t.horizontal ? [t.gradient[0], t.gradient[1], t.gradient[1], t.gradient[0]] : [t.gradient[0], t.gradient[0], t.gradient[1], t.gradient[1]]
                        } : {}
                    }))
                }
                o(ge, "drawRect");
                function l(t) {
                    let {p1: r, p2: s} = t;
                    if (!r || !s)
                        throw new Error('drawLine() requires properties "p1" and "p2".');
                    let u = t.width || 1
                        , a = s.sub(r).unit().normal().scale(u * .5)
                        , h = [r.sub(a), r.add(a), s.add(a), s.sub(a)].map(f=>({
                        pos: new v(f.x,f.y),
                        uv: new v(0),
                        color: t.color ?? W.WHITE,
                        opacity: t.opacity ?? 1
                    }));
                    lt(h, [0, 1, 3, 1, 2, 3], t.fixed, E.defTex, t.shader, t.uniform)
                }
                o(l, "drawLine");
                function x(t) {
                    let r = t.pts;
                    if (!r)
                        throw new Error('drawLines() requires property "pts".');
                    if (!(r.length < 2))
                        if (t.radius && r.length >= 3) {
                            let s = r[0].sdist(r[1]);
                            for (let a = 1; a < r.length - 1; a++)
                                s = Math.min(r[a].sdist(r[a + 1]), s);
                            let u = Math.min(t.radius, Math.sqrt(s) / 2);
                            l(Object.assign({}, t, {
                                p1: r[0],
                                p2: r[1]
                            }));
                            for (let a = 1; a < r.length - 2; a++) {
                                let h = r[a]
                                    , f = r[a + 1];
                                l(Object.assign({}, t, {
                                    p1: h,
                                    p2: f
                                }))
                            }
                            l(Object.assign({}, t, {
                                p1: r[r.length - 2],
                                p2: r[r.length - 1]
                            }))
                        } else
                            for (let s = 0; s < r.length - 1; s++)
                                l(Object.assign({}, t, {
                                    p1: r[s],
                                    p2: r[s + 1]
                                })),
                                t.join !== "none" && L(Object.assign({}, t, {
                                    pos: r[s],
                                    radius: t.width / 2
                                }))
                }
                o(x, "drawLines");
                function R(t) {
                    if (!t.p1 || !t.p2 || !t.p3)
                        throw new Error('drawTriangle() requires properties "p1", "p2" and "p3".');
                    return z(Object.assign({}, t, {
                        pts: [t.p1, t.p2, t.p3]
                    }))
                }
                o(R, "drawTriangle");
                function L(t) {
                    if (typeof t.radius != "number")
                        throw new Error('drawCircle() requires property "radius".');
                    t.radius !== 0 && he(Object.assign({}, t, {
                        radiusX: t.radius,
                        radiusY: t.radius,
                        angle: 0
                    }))
                }
                o(L, "drawCircle");
                function he(t) {
                    if (t.radiusX === void 0 || t.radiusY === void 0)
                        throw new Error('drawEllipse() requires properties "radiusX" and "radiusY".');
                    if (t.radiusX === 0 || t.radiusY === 0)
                        return;
                    let r = t.start ?? 0
                        , s = t.end ?? 360
                        , u = ut(t.anchor ?? "center").scale(new v(-t.radiusX,-t.radiusY))
                        , a = qe(u, t.radiusX, t.radiusY, r, s, t.resolution);
                    a.unshift(u);
                    let h = Object.assign({}, t, {
                        pts: a,
                        radius: 0,
                        ...t.gradient ? {
                            colors: [t.gradient[0], ...Array(a.length - 1).fill(t.gradient[1])]
                        } : {}
                    });
                    if (s - r >= 360 && t.outline) {
                        t.fill !== !1 && z(Object.assign(h, {
                            outline: null
                        })),
                            z(Object.assign(h, {
                                pts: a.slice(1),
                                fill: !1
                            }));
                        return
                    }
                    z(h)
                }
                o(he, "drawEllipse");
                function z(t) {
                    if (!t.pts)
                        throw new Error('drawPolygon() requires property "pts".');
                    let r = t.pts.length;
                    if (!(r < 3)) {
                        if (le(),
                            ne(t.pos),
                            He(t.scale),
                            se(t.angle),
                            ne(t.offset),
                        t.fill !== !1) {
                            let s = t.color ?? W.WHITE
                                , u = t.pts.map((h,f)=>({
                                pos: new v(h.x,h.y),
                                uv: new v(0,0),
                                color: t.colors && t.colors[f] ? t.colors[f].mult(s) : s,
                                opacity: t.opacity ?? 1
                            }))
                                , a = [...Array(r - 2).keys()].map(h=>[0, h + 1, h + 2]).flat();
                            lt(u, t.indices ?? a, t.fixed, E.defTex, t.shader, t.uniform)
                        }
                        t.outline && x({
                            pts: [...t.pts, t.pts[0]],
                            radius: t.radius,
                            width: t.outline.width,
                            color: t.outline.color,
                            join: t.outline.join,
                            uniform: t.uniform,
                            fixed: t.fixed,
                            opacity: t.opacity
                        }),
                            ae()
                    }
                }
                o(z, "drawPolygon");
                function Oe(t, r, s) {
                    Pe(),
                        S.clear(S.STENCIL_BUFFER_BIT),
                        S.enable(S.STENCIL_TEST),
                        S.stencilFunc(S.NEVER, 1, 255),
                        S.stencilOp(S.REPLACE, S.REPLACE, S.REPLACE),
                        r(),
                        Pe(),
                        S.stencilFunc(s, 1, 255),
                        S.stencilOp(S.KEEP, S.KEEP, S.KEEP),
                        t(),
                        Pe(),
                        S.disable(S.STENCIL_TEST)
                }
                o(Oe, "drawStenciled");
                function $e(t, r) {
                    Oe(t, r, S.EQUAL)
                }
                o($e, "drawMasked");
                function kt(t, r) {
                    Oe(t, r, S.NOTEQUAL)
                }
                o(kt, "drawSubtracted");
                function De() {
                    return (E.viewport.width + E.viewport.height) / (E.width + E.height)
                }
                o(De, "getViewportScale");
                function Ce(t) {
                    Pe();
                    let r = E.width
                        , s = E.height;
                    E.width = E.viewport.width,
                        E.height = E.viewport.height,
                        t(),
                        Pe(),
                        E.width = r,
                        E.height = s
                }
                o(Ce, "drawUnscaled");
                function er(t, r) {
                    r.pos && (t.pos = t.pos.add(r.pos)),
                    r.scale && (t.scale = t.scale.scale(T(r.scale))),
                    r.angle && (t.angle += r.angle),
                    r.color && t.ch.length === 1 && (t.color = t.color.mult(r.color)),
                    r.opacity && (t.opacity *= r.opacity)
                }
                o(er, "applyCharTransform");
                let tr = /\[(?<style>\w+)\](?<text>.*?)\[\/\k<style>\]/g;
                function ts(t) {
                    let r = {}
                        , s = t.replace(tr, "$2")
                        , u = 0;
                    for (let a of t.matchAll(tr)) {
                        let h = a.index - u;
                        for (let f = 0; f < a.groups.text.length; f++)
                            r[f + h] = [a.groups.style];
                        u += a[0].length - a.groups.text.length
                    }
                    return {
                        charStyleMap: r,
                        text: s
                    }
                }
                o(ts, "compileStyledText");
                let Un = {};
                function Xe(t) {
                    if (t.text === void 0)
                        throw new Error('formatText() requires property "text".');
                    let r = Ft(t.font);
                    if (t.text === "" || r instanceof ve || !r)
                        return {
                            width: 0,
                            height: 0,
                            chars: [],
                            opt: t
                        };
                    let {charStyleMap: s, text: u} = ts(t.text + "")
                        , a = Ir(u);
                    if (r instanceof Se || typeof r == "string") {
                        let Z = r instanceof Se ? r.fontface.family : r
                            , H = r instanceof Se ? {
                            outline: r.outline,
                            filter: r.filter
                        } : {
                            outline: null,
                            filter: Xn
                        }
                            , V = Un[Z] ?? {
                            font: {
                                tex: new Re(q,Wr,Xr,{
                                    filter: H.filter
                                }),
                                map: {},
                                size: sn
                            },
                            cursor: new v(0),
                            outline: H.outline
                        };
                        Un[Z] || (Un[Z] = V),
                            r = V.font;
                        for (let fe of a)
                            if (!V.font.map[fe]) {
                                let U = j;
                                U.clearRect(0, 0, I.width, I.height),
                                    U.font = `${r.size}px ${Z}`,
                                    U.textBaseline = "top",
                                    U.textAlign = "left",
                                    U.fillStyle = "#ffffff";
                                let G = U.measureText(fe)
                                    , B = Math.ceil(G.width)
                                    , F = r.size;
                                V.outline && (U.lineJoin = "round",
                                    U.lineWidth = V.outline.width * 2,
                                    U.strokeStyle = V.outline.color.toHex(),
                                    U.strokeText(fe, V.outline.width, V.outline.width),
                                    B += V.outline.width * 2,
                                    F += V.outline.width * 3),
                                    U.fillText(fe, V.outline?.width ?? 0, V.outline?.width ?? 0);
                                let Y = U.getImageData(0, 0, B, F);
                                if (V.cursor.x + B > Wr && (V.cursor.x = 0,
                                    V.cursor.y += F,
                                V.cursor.y > Xr))
                                    throw new Error("Font atlas exceeds character limit");
                                r.tex.update(Y, V.cursor.x, V.cursor.y),
                                    r.map[fe] = new oe(V.cursor.x,V.cursor.y,B,F),
                                    V.cursor.x += B
                            }
                    }
                    let h = t.size || r.size
                        , f = T(t.scale ?? 1).scale(h / r.size)
                        , b = t.lineSpacing ?? 0
                        , g = t.letterSpacing ?? 0
                        , d = 0
                        , w = 0
                        , A = 0
                        , D = []
                        , N = []
                        , _ = 0
                        , M = null
                        , O = null;
                    for (; _ < a.length; ) {
                        let Z = a[_];
                        if (Z === `
`)
                            A += h + b,
                                D.push({
                                    width: d - g,
                                    chars: N
                                }),
                                M = null,
                                O = null,
                                d = 0,
                                N = [];
                        else {
                            let H = r.map[Z];
                            if (H) {
                                let V = H.w * f.x;
                                t.width && d + V > t.width && (A += h + b,
                                M != null && (_ -= N.length - M,
                                    Z = a[_],
                                    H = r.map[Z],
                                    V = H.w * f.x,
                                    N = N.slice(0, M - 1),
                                    d = O),
                                    M = null,
                                    O = null,
                                    D.push({
                                        width: d - g,
                                        chars: N
                                    }),
                                    d = 0,
                                    N = []),
                                    N.push({
                                        tex: r.tex,
                                        width: H.w,
                                        height: H.h,
                                        quad: new oe(H.x / r.tex.width,H.y / r.tex.height,H.w / r.tex.width,H.h / r.tex.height),
                                        ch: Z,
                                        pos: new v(d,A),
                                        opacity: t.opacity ?? 1,
                                        color: t.color ?? W.WHITE,
                                        scale: T(f),
                                        angle: 0
                                    }),
                                Z === " " && (M = N.length,
                                    O = d),
                                    d += V,
                                    w = Math.max(w, d),
                                    d += g
                            }
                        }
                        _++
                    }
                    D.push({
                        width: d - g,
                        chars: N
                    }),
                        A += h,
                    t.width && (w = t.width);
                    let ie = [];
                    for (let Z of D) {
                        let H = (w - Z.width) * io(t.align ?? "left");
                        for (let V of Z.chars) {
                            let fe = r.map[V.ch]
                                , U = ie.length;
                            if (V.pos = V.pos.add(H, 0).add(fe.w * f.x * .5, fe.h * f.y * .5),
                                t.transform) {
                                let G = typeof t.transform == "function" ? t.transform(U, V.ch) : t.transform;
                                G && er(V, G)
                            }
                            if (s[U]) {
                                let G = s[U];
                                for (let B of G) {
                                    let F = t.styles[B]
                                        , Y = typeof F == "function" ? F(U, V.ch) : F;
                                    Y && er(V, Y)
                                }
                            }
                            ie.push(V)
                        }
                    }
                    return {
                        width: w,
                        height: A,
                        chars: ie,
                        opt: t
                    }
                }
                o(Xe, "formatText");
                function nr(t) {
                    Je(Xe(t))
                }
                o(nr, "drawText");
                function Je(t) {
                    le(),
                        ne(t.opt.pos),
                        se(t.opt.angle),
                        ne(ut(t.opt.anchor ?? "topleft").add(1, 1).scale(t.width, t.height).scale(-.5)),
                        t.chars.forEach(r=>{
                                Be({
                                    tex: r.tex,
                                    width: r.width,
                                    height: r.height,
                                    pos: r.pos,
                                    scale: r.scale,
                                    angle: r.angle,
                                    color: r.color,
                                    opacity: r.opacity,
                                    quad: r.quad,
                                    anchor: "center",
                                    uniform: t.opt.uniform,
                                    shader: t.opt.shader,
                                    fixed: t.opt.fixed
                                })
                            }
                        ),
                        ae()
                }
                o(Je, "drawFormattedText");
                function we() {
                    return E.width
                }
                o(we, "width");
                function xe() {
                    return E.height
                }
                o(xe, "height");
                function ns(t) {
                    return new v((t.x - E.viewport.x) * we() / E.viewport.width,(t.y - E.viewport.y) * xe() / E.viewport.height)
                }
                o(ns, "windowToContent");
                function rs(t) {
                    return new v(t.x * E.viewport.width / E.width,t.y * E.viewport.height / E.height)
                }
                o(rs, "contentToView");
                function Nt() {
                    return ns(y.mousePos())
                }
                o(Nt, "mousePos");
                let rr = !1
                    , re = {
                    inspect: !1,
                    timeScale: 1,
                    showLog: !0,
                    fps: ()=>y.fps(),
                    numFrames: ()=>y.numFrames(),
                    stepFrame: fr,
                    drawCalls: ()=>E.lastDrawCalls,
                    clearLog: ()=>C.logs = [],
                    log: t=>{
                        let r = n.logMax ?? Xi;
                        C.logs.unshift({
                            msg: t,
                            time: y.time()
                        }),
                        C.logs.length > r && (C.logs = C.logs.slice(0, r))
                    }
                    ,
                    error: t=>re.log(new Error(t.toString ? t.toString() : t)),
                    curRecording: null,
                    numObjects: ()=>Rn("*", {
                        recursive: !0
                    }).length,
                    get paused() {
                        return rr
                    },
                    set paused(t) {
                        rr = t,
                            t ? te.ctx.suspend() : te.ctx.resume()
                    }
                };
                function Me() {
                    return y.dt() * re.timeScale
                }
                o(Me, "dt");
                function ss(...t) {
                    return t.length > 0 && (C.cam.pos = T(...t)),
                        C.cam.pos ? C.cam.pos.clone() : zt()
                }
                o(ss, "camPos");
                function is(...t) {
                    return t.length > 0 && (C.cam.scale = T(...t)),
                        C.cam.scale.clone()
                }
                o(is, "camScale");
                function os(t) {
                    return t !== void 0 && (C.cam.angle = t),
                        C.cam.angle
                }
                o(os, "camRot");
                function as(t=12) {
                    C.cam.shake += t
                }
                o(as, "shake");
                function sr(t) {
                    return C.cam.transform.multVec2(t)
                }
                o(sr, "toScreen");
                function ir(t) {
                    return C.cam.transform.invert().multVec2(t)
                }
                o(ir, "toWorld");
                function jt(t) {
                    let r = new Ue;
                    return t.pos && r.translate(t.pos),
                    t.scale && r.scale(t.scale),
                    t.angle && r.rotate(t.angle),
                        t.parent ? r.mult(t.parent.transform) : r
                }
                o(jt, "calcTransform");
                function En(t=[]) {
                    let r = new Map
                        , s = {}
                        , u = new Ne
                        , a = []
                        , h = null
                        , f = !1
                        , b = {
                        id: Br(),
                        hidden: !1,
                        transform: new Ue,
                        children: [],
                        parent: null,
                        set paused(d) {
                            if (d !== f) {
                                f = d;
                                for (let w of a)
                                    w.paused = d
                            }
                        },
                        get paused() {
                            return f
                        },
                        add(d=[]) {
                            let w = Array.isArray(d) ? En(d) : d;
                            if (w.parent)
                                throw new Error("Cannot add a game obj that already has a parent.");
                            return w.parent = this,
                                w.transform = jt(w),
                                this.children.push(w),
                                w.trigger("add", w),
                                C.events.trigger("add", w),
                                w
                        },
                        readd(d) {
                            let w = this.children.indexOf(d);
                            return w !== -1 && (this.children.splice(w, 1),
                                this.children.push(d)),
                                d
                        },
                        remove(d) {
                            let w = this.children.indexOf(d);
                            if (w !== -1) {
                                d.parent = null,
                                    this.children.splice(w, 1);
                                let A = o(D=>{
                                        D.trigger("destroy"),
                                            C.events.trigger("destroy", D),
                                            D.children.forEach(N=>A(N))
                                    }
                                    , "trigger");
                                A(d)
                            }
                        },
                        removeAll(d) {
                            if (d)
                                this.get(d).forEach(w=>this.remove(w));
                            else
                                for (let w of [...this.children])
                                    this.remove(w)
                        },
                        update() {
                            this.paused || (this.children.sort((d,w)=>(d.z ?? 0) - (w.z ?? 0)).forEach(d=>d.update()),
                                this.trigger("update"))
                        },
                        draw() {
                            if (this.hidden)
                                return;
                            this.canvas && this.canvas.bind();
                            let d = E.fixed;
                            this.fixed && (E.fixed = !0),
                                le(),
                                ne(this.pos),
                                He(this.scale),
                                se(this.angle);
                            let w = this.children.sort((A,D)=>(A.z ?? 0) - (D.z ?? 0));
                            if (this.mask) {
                                let A = {
                                    intersect: $e,
                                    subtract: kt
                                }[this.mask];
                                if (!A)
                                    throw new Error(`Invalid mask func: "${this.mask}"`);
                                A(()=>{
                                        w.forEach(D=>D.draw())
                                    }
                                    , ()=>{
                                        this.trigger("draw")
                                    }
                                )
                            } else
                                this.trigger("draw"),
                                    w.forEach(A=>A.draw());
                            ae(),
                                E.fixed = d,
                            this.canvas && this.canvas.unbind()
                        },
                        drawInspect() {
                            this.hidden || (le(),
                                ne(this.pos),
                                He(this.scale),
                                se(this.angle),
                                this.children.sort((d,w)=>(d.z ?? 0) - (w.z ?? 0)).forEach(d=>d.drawInspect()),
                                this.trigger("drawInspect"),
                                ae())
                        },
                        use(d) {
                            if (!d)
                                return;
                            if (typeof d == "string")
                                return this.use({
                                    id: d
                                });
                            let w = [];
                            d.id && (this.unuse(d.id),
                                s[d.id] = [],
                                w = s[d.id],
                                r.set(d.id, d));
                            for (let D in d) {
                                if (ro.has(D))
                                    continue;
                                let N = Object.getOwnPropertyDescriptor(d, D);
                                if (typeof N.value == "function" && (d[D] = d[D].bind(this)),
                                N.set && Object.defineProperty(d, D, {
                                    set: N.set.bind(this)
                                }),
                                N.get && Object.defineProperty(d, D, {
                                    get: N.get.bind(this)
                                }),
                                    so.has(D)) {
                                    let _ = D === "add" ? ()=>{
                                            h = o(M=>w.push(M), "onCurCompCleanup"),
                                                d[D](),
                                                h = null
                                        }
                                        : d[D];
                                    w.push(this.on(D, _).cancel)
                                } else if (this[D] === void 0)
                                    Object.defineProperty(this, D, {
                                        get: ()=>d[D],
                                        set: _=>d[D] = _,
                                        configurable: !0,
                                        enumerable: !0
                                    }),
                                        w.push(()=>delete this[D]);
                                else
                                    throw new Error(`Duplicate component property: "${D}"`)
                            }
                            let A = o(()=>{
                                    if (d.require) {
                                        for (let D of d.require)
                                            if (!this.c(D))
                                                throw new Error(`Component "${d.id}" requires component "${D}"`)
                                    }
                                }
                                , "checkDeps");
                            d.destroy && w.push(d.destroy.bind(this)),
                                this.exists() ? (A(),
                                d.add && (h = o(D=>w.push(D), "onCurCompCleanup"),
                                    d.add.call(this),
                                    h = null)) : d.require && w.push(this.on("add", A).cancel)
                        },
                        unuse(d) {
                            s[d] && (s[d].forEach(w=>w()),
                                delete s[d]),
                            r.has(d) && r.delete(d)
                        },
                        c(d) {
                            return r.get(d)
                        },
                        get(d, w={}) {
                            let A = w.recursive ? this.children.flatMap(o(function D(N) {
                                return [N, ...N.children.flatMap(D)]
                            }, "recurse")) : this.children;
                            if (A = A.filter(D=>d ? D.is(d) : !0),
                                w.liveUpdate) {
                                let D = o(_=>w.recursive ? this.isAncestorOf(_) : _.parent === this, "isChild")
                                    , N = [];
                                N.push(Sn(_=>{
                                        D(_) && _.is(d) && A.push(_)
                                    }
                                )),
                                    N.push(or(_=>{
                                            if (D(_) && _.is(d)) {
                                                let M = A.findIndex(O=>O.id === _.id);
                                                M !== -1 && A.splice(M, 1)
                                            }
                                        }
                                    )),
                                    this.onDestroy(()=>{
                                            for (let _ of N)
                                                _.cancel()
                                        }
                                    )
                            }
                            return A
                        },
                        isAncestorOf(d) {
                            return d.parent ? d.parent === this || this.isAncestorOf(d.parent) : !1
                        },
                        exists() {
                            return C.root.isAncestorOf(this)
                        },
                        is(d) {
                            if (d === "*")
                                return !0;
                            if (Array.isArray(d)) {
                                for (let w of d)
                                    if (!this.c(w))
                                        return !1;
                                return !0
                            } else
                                return this.c(d) != null
                        },
                        on(d, w) {
                            let A = u.on(d, w.bind(this));
                            return h && h(()=>A.cancel()),
                                A
                        },
                        trigger(d, ...w) {
                            u.trigger(d, ...w),
                                C.objEvents.trigger(d, this, ...w)
                        },
                        destroy() {
                            this.parent && this.parent.remove(this)
                        },
                        inspect() {
                            let d = {};
                            for (let[w,A] of r)
                                d[w] = A.inspect ? A.inspect() : null;
                            return d
                        },
                        onAdd(d) {
                            return this.on("add", d)
                        },
                        onUpdate(d) {
                            return this.on("update", d)
                        },
                        onDraw(d) {
                            return this.on("draw", d)
                        },
                        onDestroy(d) {
                            return this.on("destroy", d)
                        },
                        clearEvents() {
                            u.clear()
                        }
                    }
                        , g = ["onKeyPress", "onKeyPressRepeat", "onKeyDown", "onKeyRelease", "onMousePress", "onMouseDown", "onMouseRelease", "onMouseMove", "onCharInput", "onMouseMove", "onTouchStart", "onTouchMove", "onTouchEnd", "onScroll", "onGamepadButtonPress", "onGamepadButtonDown", "onGamepadButtonRelease", "onGamepadStick"];
                    for (let d of g)
                        b[d] = (...w)=>{
                            let A = y[d](...w);
                            return a.push(A),
                                b.onDestroy(()=>A.cancel()),
                                A
                        }
                        ;
                    for (let d of t)
                        b.use(d);
                    return b
                }
                o(En, "make");
                function ze(t, r, s) {
                    return C.objEvents[t] || (C.objEvents[t] = new Ut),
                        C.objEvents.on(t, (u,...a)=>{
                                u.is(r) && s(u, ...a)
                            }
                        )
                }
                o(ze, "on");
                let us = Ee(t=>{
                        let r = gt([{
                            update: t
                        }]);
                        return {
                            get paused() {
                                return r.paused
                            },
                            set paused(s) {
                                r.paused = s
                            },
                            cancel: ()=>r.destroy()
                        }
                    }
                    , (t,r)=>ze("update", t, r))
                    , cs = Ee(t=>{
                        let r = gt([{
                            draw: t
                        }]);
                        return {
                            get paused() {
                                return r.hidden
                            },
                            set paused(s) {
                                r.hidden = s
                            },
                            cancel: ()=>r.destroy()
                        }
                    }
                    , (t,r)=>ze("draw", t, r))
                    , Sn = Ee(t=>C.events.on("add", t), (t,r)=>ze("add", t, r))
                    , or = Ee(t=>C.events.on("destroy", t), (t,r)=>ze("destroy", t, r));
                function hs(t, r, s) {
                    return ze("collide", t, (u,a,h)=>a.is(r) && s(u, a, h))
                }
                o(hs, "onCollide");
                function ls(t, r, s) {
                    return ze("collideUpdate", t, (u,a,h)=>a.is(r) && s(u, a, h))
                }
                o(ls, "onCollideUpdate");
                function ds(t, r, s) {
                    return ze("collideEnd", t, (u,a,h)=>a.is(r) && s(u, a, h))
                }
                o(ds, "onCollideEnd");
                function Ht(t, r) {
                    Rn(t, {
                        recursive: !0
                    }).forEach(r),
                        Sn(t, r)
                }
                o(Ht, "forAllCurrentAndFuture");
                let fs = Ee(t=>y.onMousePress(t), (t,r)=>{
                        let s = [];
                        return Ht(t, u=>{
                                if (!u.area)
                                    throw new Error("onClick() requires the object to have area() component");
                                s.push(u.onClick(()=>r(u)))
                            }
                        ),
                            ke.join(s)
                    }
                );
                function ms(t, r) {
                    let s = [];
                    return Ht(t, u=>{
                            if (!u.area)
                                throw new Error("onHover() requires the object to have area() component");
                            s.push(u.onHover(()=>r(u)))
                        }
                    ),
                        ke.join(s)
                }
                o(ms, "onHover");
                function ps(t, r) {
                    let s = [];
                    return Ht(t, u=>{
                            if (!u.area)
                                throw new Error("onHoverUpdate() requires the object to have area() component");
                            s.push(u.onHoverUpdate(()=>r(u)))
                        }
                    ),
                        ke.join(s)
                }
                o(ps, "onHoverUpdate");
                function gs(t, r) {
                    let s = [];
                    return Ht(t, u=>{
                            if (!u.area)
                                throw new Error("onHoverEnd() requires the object to have area() component");
                            s.push(u.onHoverEnd(()=>r(u)))
                        }
                    ),
                        ke.join(s)
                }
                o(gs, "onHoverEnd");
                function ws(t) {
                    C.gravity = t
                }
                o(ws, "setGravity");
                function bs() {
                    return C.gravity
                }
                o(bs, "getGravity");
                function vs(...t) {
                    t.length === 1 || t.length === 2 ? (E.bgColor = J(t[0]),
                    t[1] && (E.bgAlpha = t[1])) : (t.length === 3 || t.length === 4) && (E.bgColor = J(t[0], t[1], t[2]),
                    t[3] && (E.bgAlpha = t[3])),
                        S.clearColor(E.bgColor.r / 255, E.bgColor.g / 255, E.bgColor.b / 255, E.bgAlpha)
                }
                o(vs, "setBackground");
                function ys() {
                    return E.bgColor.clone()
                }
                o(ys, "getBackground");
                function qt(...t) {
                    return {
                        id: "pos",
                        pos: T(...t),
                        moveBy(...r) {
                            this.pos = this.pos.add(T(...r))
                        },
                        move(...r) {
                            this.moveBy(T(...r).scale(Me()))
                        },
                        moveTo(...r) {
                            if (typeof r[0] == "number" && typeof r[1] == "number")
                                return this.moveTo(T(r[0], r[1]), r[2]);
                            let s = r[0]
                                , u = r[1];
                            if (u === void 0) {
                                this.pos = T(s);
                                return
                            }
                            let a = s.sub(this.pos);
                            if (a.len() <= u * Me()) {
                                this.pos = T(s);
                                return
                            }
                            this.move(a.unit().scale(u))
                        },
                        worldPos() {
                            return this.parent ? this.parent.transform.multVec2(this.pos) : this.pos
                        },
                        screenPos() {
                            let r = this.worldPos();
                            return pt(this) ? r : sr(r)
                        },
                        inspect() {
                            return `(${Math.round(this.pos.x)}, ${Math.round(this.pos.y)})`
                        },
                        drawInspect() {
                            L({
                                color: J(255, 0, 0),
                                radius: 4 / De()
                            })
                        }
                    }
                }
                o(qt, "pos");
                function $t(...t) {
                    return t.length === 0 ? $t(1) : {
                        id: "scale",
                        scale: T(...t),
                        scaleTo(...r) {
                            this.scale = T(...r)
                        },
                        scaleBy(...r) {
                            this.scale.scale(T(...r))
                        },
                        inspect() {
                            return `(${mt(this.scale.x, 2)}, ${mt(this.scale.y, 2)})`
                        }
                    }
                }
                o($t, "scale");
                function xs(t) {
                    return {
                        id: "rotate",
                        angle: t ?? 0,
                        rotateBy(r) {
                            this.angle += r
                        },
                        rotateTo(r) {
                            this.angle = r
                        },
                        inspect() {
                            return `${Math.round(this.angle)}`
                        }
                    }
                }
                o(xs, "rotate");
                function Us(...t) {
                    return {
                        id: "color",
                        color: J(...t),
                        inspect() {
                            return this.color.toString()
                        }
                    }
                }
                o(Us, "color");
                function mt(t, r) {
                    return Number(t.toFixed(r))
                }
                o(mt, "toFixed");
                function Es(t) {
                    return {
                        id: "opacity",
                        opacity: t ?? 1,
                        inspect() {
                            return `${mt(this.opacity, 1)}`
                        },
                        fadeOut(r=1, s=Ct.linear) {
                            return Pn(this.opacity, 0, r, u=>this.opacity = u, s)
                        }
                    }
                }
                o(Es, "opacity");
                function Cn(t) {
                    if (!t)
                        throw new Error("Please define an anchor");
                    return {
                        id: "anchor",
                        anchor: t,
                        inspect() {
                            return typeof this.anchor == "string" ? this.anchor : this.anchor.toString()
                        }
                    }
                }
                o(Cn, "anchor");
                function Ss(t) {
                    return {
                        id: "z",
                        z: t,
                        inspect() {
                            return `${this.z}`
                        }
                    }
                }
                o(Ss, "z");
                function Cs(t, r) {
                    return {
                        id: "follow",
                        require: ["pos"],
                        follow: {
                            obj: t,
                            offset: r ?? T(0)
                        },
                        add() {
                            t.exists() && (this.pos = this.follow.obj.pos.add(this.follow.offset))
                        },
                        update() {
                            t.exists() && (this.pos = this.follow.obj.pos.add(this.follow.offset))
                        }
                    }
                }
                o(Cs, "follow");
                function As(t, r) {
                    let s = typeof t == "number" ? v.fromAngle(t) : t.unit();
                    return {
                        id: "move",
                        require: ["pos"],
                        update() {
                            this.move(s.scale(r))
                        }
                    }
                }
                o(As, "move");
                let Ts = 200;
                function Os(t={}) {
                    let r = t.distance ?? Ts
                        , s = !1;
                    return {
                        id: "offscreen",
                        require: ["pos"],
                        isOffScreen() {
                            let u = this.screenPos()
                                , a = new de(T(0),we(),xe());
                            return !vt(a, u) && a.sdistToPoint(u) > r * r
                        },
                        onExitScreen(u) {
                            return this.on("exitView", u)
                        },
                        onEnterScreen(u) {
                            return this.on("enterView", u)
                        },
                        update() {
                            this.isOffScreen() ? (s || (this.trigger("exitView"),
                                s = !0),
                            t.hide && (this.hidden = !0),
                            t.pause && (this.paused = !0),
                            t.destroy && this.destroy()) : (s && (this.trigger("enterView"),
                                s = !1),
                            t.hide && (this.hidden = !1),
                            t.pause && (this.paused = !1))
                        }
                    }
                }
                o(Os, "offscreen");
                function pt(t) {
                    return t.fixed ? !0 : t.parent ? pt(t.parent) : !1
                }
                o(pt, "isFixed");
                function Rs(t={}) {
                    let r = {}
                        , s = new Set;
                    return {
                        id: "area",
                        collisionIgnore: t.collisionIgnore ?? [],
                        add() {
                            this.area.cursor && this.onHover(()=>y.setCursor(this.area.cursor)),
                                this.onCollideUpdate((u,a)=>{
                                        r[u.id] || this.trigger("collide", u, a),
                                            r[u.id] = a,
                                            s.add(u.id)
                                    }
                                )
                        },
                        update() {
                            for (let u in r)
                                s.has(Number(u)) || (this.trigger("collideEnd", r[u].target),
                                    delete r[u]);
                            s.clear()
                        },
                        drawInspect() {
                            let u = this.localArea();
                            le(),
                                He(this.area.scale),
                                ne(this.area.offset);
                            let a = {
                                outline: {
                                    width: 4 / De(),
                                    color: J(0, 0, 255)
                                },
                                anchor: this.anchor,
                                fill: !1,
                                fixed: pt(this)
                            };
                            u instanceof de ? ge({
                                ...a,
                                pos: u.pos,
                                width: u.width,
                                height: u.height
                            }) : u instanceof Ke ? z({
                                ...a,
                                pts: u.pts
                            }) : u instanceof yt && L({
                                ...a,
                                pos: u.center,
                                radius: u.radius
                            }),
                                ae()
                        },
                        area: {
                            shape: t.shape ?? null,
                            scale: t.scale ? T(t.scale) : T(1),
                            offset: t.offset ?? T(0),
                            cursor: t.cursor ?? null
                        },
                        isClicked() {
                            return y.isMousePressed() && this.isHovering()
                        },
                        isHovering() {
                            let u = pt(this) ? Nt() : ir(Nt());
                            return this.hasPoint(u)
                        },
                        checkCollision(u) {
                            return r[u.id] ?? null
                        },
                        getCollisions() {
                            return Object.values(r)
                        },
                        isColliding(u) {
                            return !!r[u.id]
                        },
                        isOverlapping(u) {
                            let a = r[u.id];
                            return a && a.hasOverlap()
                        },
                        onClick(u) {
                            let a = y.onMousePress("left", ()=>{
                                    this.isHovering() && u()
                                }
                            );
                            return this.onDestroy(()=>a.cancel()),
                                a
                        },
                        onHover(u) {
                            let a = !1;
                            return this.onUpdate(()=>{
                                    a ? a = this.isHovering() : this.isHovering() && (a = !0,
                                        u())
                                }
                            )
                        },
                        onHoverUpdate(u) {
                            return this.onUpdate(()=>{
                                    this.isHovering() && u()
                                }
                            )
                        },
                        onHoverEnd(u) {
                            let a = !1;
                            return this.onUpdate(()=>{
                                    a ? this.isHovering() || (a = !1,
                                        u()) : a = this.isHovering()
                                }
                            )
                        },
                        onCollide(u, a) {
                            if (typeof u == "function" && a === void 0)
                                return this.on("collide", u);
                            if (typeof u == "string")
                                return this.onCollide((h,f)=>{
                                        h.is(u) && a(h, f)
                                    }
                                )
                        },
                        onCollideUpdate(u, a) {
                            if (typeof u == "function" && a === void 0)
                                return this.on("collideUpdate", u);
                            if (typeof u == "string")
                                return this.on("collideUpdate", (h,f)=>h.is(u) && a(h, f))
                        },
                        onCollideEnd(u, a) {
                            if (typeof u == "function" && a === void 0)
                                return this.on("collideEnd", u);
                            if (typeof u == "string")
                                return this.on("collideEnd", h=>h.is(u) && a(h))
                        },
                        hasPoint(u) {
                            return kn(this.worldArea(), u)
                        },
                        resolveCollision(u) {
                            let a = this.checkCollision(u);
                            a && !a.resolved && (this.pos = this.pos.add(a.displacement),
                                a.resolved = !0)
                        },
                        localArea() {
                            return this.area.shape ? this.area.shape : this.renderArea()
                        },
                        worldArea() {
                            let u = this.localArea();
                            if (!(u instanceof Ke || u instanceof de))
                                throw new Error("Only support polygon and rect shapes for now");
                            let a = this.transform.clone().scale(T(this.area.scale ?? 1)).translate(this.area.offset);
                            if (u instanceof de) {
                                let h = ut(this.anchor || nn).add(1, 1).scale(-.5).scale(u.width, u.height);
                                a.translate(h)
                            }
                            return u.transform(a)
                        },
                        screenArea() {
                            let u = this.worldArea();
                            return pt(this) ? u : u.transform(C.cam.transform)
                        }
                    }
                }
                o(Rs, "area");
                function Qe(t) {
                    return {
                        color: t.color,
                        opacity: t.opacity,
                        anchor: t.anchor,
                        outline: t.outline,
                        shader: t.shader,
                        uniform: t.uniform
                    }
                }
                o(Qe, "getRenderProps");
                function An(t, r={}) {
                    let s = null
                        , u = null
                        , a = null
                        , h = new be;
                    if (!t)
                        throw new Error("Please pass the resource name or data to sprite()");
                    let f = o((b,g,d,w)=>{
                            let A = T(1, 1);
                            return d && w ? (A.x = d / (b.width * g.w),
                                A.y = w / (b.height * g.h)) : d ? (A.x = d / (b.width * g.w),
                                A.y = A.x) : w && (A.y = w / (b.height * g.h),
                                A.x = A.y),
                                A
                        }
                        , "calcTexScale");
                    return {
                        id: "sprite",
                        width: 0,
                        height: 0,
                        frame: r.frame || 0,
                        quad: r.quad || new oe(0,0,1,1),
                        animSpeed: r.animSpeed ?? 1,
                        flipX: r.flipX ?? !1,
                        flipY: r.flipY ?? !1,
                        draw() {
                            if (!s)
                                return;
                            let b = s.frames[this.frame ?? 0];
                            if (!b)
                                throw new Error(`Frame not found: ${this.frame ?? 0}`);
                            if (s.slice9) {
                                let {left: g, right: d, top: w, bottom: A} = s.slice9
                                    , D = s.tex.width * b.w
                                    , N = s.tex.height * b.h
                                    , _ = this.width - g - d
                                    , M = this.height - w - A
                                    , O = g / D
                                    , ie = d / D
                                    , Z = 1 - O - ie
                                    , H = w / N
                                    , V = A / N
                                    , fe = 1 - H - V
                                    , U = [ce(0, 0, O, H), ce(O, 0, Z, H), ce(O + Z, 0, ie, H), ce(0, H, O, fe), ce(O, H, Z, fe), ce(O + Z, H, ie, fe), ce(0, H + fe, O, V), ce(O, H + fe, Z, V), ce(O + Z, H + fe, ie, V), ce(0, 0, g, w), ce(g, 0, _, w), ce(g + _, 0, d, w), ce(0, w, g, M), ce(g, w, _, M), ce(g + _, w, d, M), ce(0, w + M, g, A), ce(g, w + M, _, A), ce(g + _, w + M, d, A)];
                                for (let G = 0; G < 9; G++) {
                                    let B = U[G]
                                        , F = U[G + 9];
                                    We(Object.assign(Qe(this), {
                                        pos: F.pos(),
                                        tex: s.tex,
                                        quad: b.scale(B),
                                        flipX: this.flipX,
                                        flipY: this.flipY,
                                        tiled: r.tiled,
                                        width: F.w,
                                        height: F.h
                                    }))
                                }
                            } else
                                We(Object.assign(Qe(this), {
                                    tex: s.tex,
                                    quad: b.scale(this.quad ?? new oe(0,0,1,1)),
                                    flipX: this.flipX,
                                    flipY: this.flipY,
                                    tiled: r.tiled,
                                    width: this.width,
                                    height: this.height
                                }))
                        },
                        add() {
                            let b = o(d=>{
                                    let w = d.frames[0].clone();
                                    r.quad && (w = w.scale(r.quad));
                                    let A = f(d.tex, w, r.width, r.height);
                                    this.width = d.tex.width * w.w * A.x,
                                        this.height = d.tex.height * w.h * A.y,
                                    r.anim && this.play(r.anim),
                                        s = d,
                                        h.trigger(s)
                                }
                                , "setSpriteData")
                                , g = ct(t);
                            g ? g.onLoad(b) : On(()=>b(ct(t).data))
                        },
                        update() {
                            if (!u)
                                return;
                            let b = s.anims[u.name];
                            if (typeof b == "number") {
                                this.frame = b;
                                return
                            }
                            if (b.speed === 0)
                                throw new Error("Sprite anim speed cannot be 0");
                            u.timer += Me() * this.animSpeed,
                            u.timer >= 1 / u.speed && (u.timer = 0,
                                this.frame += a,
                            (this.frame < Math.min(b.from, b.to) || this.frame > Math.max(b.from, b.to)) && (u.loop ? u.pingpong ? (this.frame -= a,
                                a *= -1,
                                this.frame += a) : this.frame = b.from : (this.frame = b.to,
                                u.onEnd(),
                                this.stop())))
                        },
                        play(b, g={}) {
                            if (!s) {
                                h.add(()=>this.play(b, g));
                                return
                            }
                            let d = s.anims[b];
                            if (d === void 0)
                                throw new Error(`Anim not found: ${b}`);
                            u && this.stop(),
                                u = typeof d == "number" ? {
                                    name: b,
                                    timer: 0,
                                    loop: !1,
                                    pingpong: !1,
                                    speed: 0,
                                    onEnd: ()=>{}
                                } : {
                                    name: b,
                                    timer: 0,
                                    loop: g.loop ?? d.loop ?? !1,
                                    pingpong: g.pingpong ?? d.pingpong ?? !1,
                                    speed: g.speed ?? d.speed ?? 10,
                                    onEnd: g.onEnd ?? (()=>{}
                                    )
                                },
                                a = typeof d == "number" ? null : d.from < d.to ? 1 : -1,
                                this.frame = typeof d == "number" ? d : d.from,
                                this.trigger("animStart", b)
                        },
                        stop() {
                            if (!u)
                                return;
                            let b = u.name;
                            u = null,
                                this.trigger("animEnd", b)
                        },
                        numFrames() {
                            return s?.frames.length ?? 0
                        },
                        curAnim() {
                            return u?.name
                        },
                        onAnimEnd(b) {
                            return this.on("animEnd", b)
                        },
                        onAnimStart(b) {
                            return this.on("animStart", b)
                        },
                        renderArea() {
                            return new de(T(0),this.width,this.height)
                        },
                        inspect() {
                            if (typeof t == "string")
                                return `"${t}"`
                        }
                    }
                }
                o(An, "sprite");
                function Ps(t, r={}) {
                    function s(a) {
                        let h = Xe(Object.assign(Qe(a), {
                            text: a.text + "",
                            size: a.textSize,
                            font: a.font,
                            width: r.width && a.width,
                            align: a.align,
                            letterSpacing: a.letterSpacing,
                            lineSpacing: a.lineSpacing,
                            transform: a.textTransform,
                            styles: a.textStyles
                        }));
                        return r.width || (a.width = h.width / (a.scale?.x || 1)),
                            a.height = h.height / (a.scale?.y || 1),
                            h
                    }
                    o(s, "update");
                    let u = {
                        id: "text",
                        set text(a) {
                            t = a,
                                s(this)
                        },
                        get text() {
                            return t
                        },
                        textSize: r.size ?? Yi,
                        font: r.font,
                        width: r.width ?? 0,
                        height: 0,
                        align: r.align,
                        lineSpacing: r.lineSpacing,
                        letterSpacing: r.letterSpacing,
                        textTransform: r.transform,
                        textStyles: r.styles,
                        add() {
                            On(()=>s(this))
                        },
                        draw() {
                            Je(s(this))
                        },
                        renderArea() {
                            return new de(T(0),this.width,this.height)
                        }
                    };
                    return s(u),
                        u
                }
                o(Ps, "text");
                function Ds(t, r={}) {
                    if (t.length < 3)
                        throw new Error(`Polygon's need more than two points, ${t.length} points provided`);
                    return {
                        id: "polygon",
                        pts: t,
                        colors: r.colors,
                        radius: r.radius,
                        draw() {
                            z(Object.assign(Qe(this), {
                                pts: this.pts,
                                colors: this.colors,
                                radius: this.radius,
                                fill: r.fill
                            }))
                        },
                        renderArea() {
                            return new Ke(this.pts)
                        },
                        inspect() {
                            return this.pts.map(s=>`[${s.x},${s.y}]`).join(",")
                        }
                    }
                }
                o(Ds, "polygon");
                function Ms(t, r, s={}) {
                    return {
                        id: "rect",
                        width: t,
                        height: r,
                        radius: s.radius || 0,
                        draw() {
                            ge(Object.assign(Qe(this), {
                                width: this.width,
                                height: this.height,
                                radius: this.radius,
                                fill: s.fill
                            }))
                        },
                        renderArea() {
                            return new de(T(0),this.width,this.height)
                        },
                        inspect() {
                            return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`
                        }
                    }
                }
                o(Ms, "rect");
                function Gs(t, r) {
                    return {
                        id: "rect",
                        width: t,
                        height: r,
                        draw() {
                            Be(Object.assign(Qe(this), {
                                width: this.width,
                                height: this.height
                            }))
                        },
                        renderArea() {
                            return new de(T(0),this.width,this.height)
                        },
                        inspect() {
                            return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`
                        }
                    }
                }
                o(Gs, "uvquad");
                function Bs(t, r={}) {
                    return {
                        id: "circle",
                        radius: t,
                        draw() {
                            L(Object.assign(Qe(this), {
                                radius: this.radius,
                                fill: r.fill
                            }))
                        },
                        renderArea() {
                            return new de(new v(this.anchor ? 0 : -this.radius),this.radius * 2,this.radius * 2)
                        },
                        inspect() {
                            return `${Math.ceil(this.radius)}`
                        }
                    }
                }
                o(Bs, "circle");
                function Fs(t=1, r=J(0, 0, 0)) {
                    return {
                        id: "outline",
                        outline: {
                            width: t,
                            color: r
                        }
                    }
                }
                o(Fs, "outline");
                function Tn() {
                    return {
                        id: "timer",
                        wait(t, r) {
                            let s = [];
                            r && s.push(r);
                            let u = 0
                                , a = this.onUpdate(()=>{
                                    u += Me(),
                                    u >= t && (s.forEach(h=>h()),
                                        a.cancel())
                                }
                            );
                            return {
                                get paused() {
                                    return a.paused
                                },
                                set paused(h) {
                                    a.paused = h
                                },
                                cancel: a.cancel,
                                onEnd(h) {
                                    s.push(h)
                                },
                                then(h) {
                                    return this.onEnd(h),
                                        this
                                }
                            }
                        },
                        loop(t, r) {
                            let s = null
                                , u = o(()=>{
                                    s = this.wait(t, u),
                                        r()
                                }
                                , "newAction");
                            return s = this.wait(0, u),
                                {
                                    get paused() {
                                        return s.paused
                                    },
                                    set paused(a) {
                                        s.paused = a
                                    },
                                    cancel: ()=>s.cancel()
                                }
                        },
                        tween(t, r, s, u, a=Ct.linear) {
                            let h = 0
                                , f = []
                                , b = this.onUpdate(()=>{
                                    h += Me();
                                    let g = Math.min(h / s, 1);
                                    u(Ve(t, r, a(g))),
                                    g === 1 && (b.cancel(),
                                        u(r),
                                        f.forEach(d=>d()))
                                }
                            );
                            return {
                                get paused() {
                                    return b.paused
                                },
                                set paused(g) {
                                    b.paused = g
                                },
                                onEnd(g) {
                                    f.push(g)
                                },
                                then(g) {
                                    return this.onEnd(g),
                                        this
                                },
                                cancel() {
                                    b.cancel()
                                },
                                finish() {
                                    b.cancel(),
                                        u(r),
                                        f.forEach(g=>g())
                                }
                            }
                        }
                    }
                }
                o(Tn, "timer");
                let Is = 640
                    , Ls = 65536;
                function Vs(t={}) {
                    let r = null
                        , s = null
                        , u = !1;
                    return {
                        id: "body",
                        require: ["pos", "area"],
                        vel: new v(0),
                        jumpForce: t.jumpForce ?? Is,
                        gravityScale: t.gravityScale ?? 1,
                        isStatic: t.isStatic ?? !1,
                        mass: t.mass ?? 1,
                        add() {
                            if (this.mass === 0)
                                throw new Error("Can't set body mass to 0");
                            this.onCollideUpdate((a,h)=>{
                                    if (a.is("body") && !h.resolved && (this.trigger("beforePhysicsResolve", h),
                                        a.trigger("beforePhysicsResolve", h.reverse()),
                                    !h.resolved && !(this.isStatic && a.isStatic))) {
                                        if (!this.isStatic && !a.isStatic) {
                                            let f = this.mass + a.mass;
                                            this.pos = this.pos.add(h.displacement.scale(a.mass / f)),
                                                a.pos = a.pos.add(h.displacement.scale(-this.mass / f)),
                                                this.transform = jt(this),
                                                a.transform = jt(a)
                                        } else {
                                            let f = !this.isStatic && a.isStatic ? h : h.reverse();
                                            f.source.pos = f.source.pos.add(f.displacement),
                                                f.source.transform = jt(f.source)
                                        }
                                        h.resolved = !0,
                                            this.trigger("physicsResolve", h),
                                            a.trigger("physicsResolve", h.reverse())
                                    }
                                }
                            ),
                                this.onPhysicsResolve(a=>{
                                        C.gravity && (a.isBottom() && this.isFalling() ? (this.vel.y = 0,
                                            r = a.target,
                                            s = a.target.pos,
                                            u ? u = !1 : this.trigger("ground", r)) : a.isTop() && this.isJumping() && (this.vel.y = 0,
                                            this.trigger("headbutt", a.target)))
                                    }
                                )
                        },
                        update() {
                            if (!C.gravity || this.isStatic)
                                return;
                            if (u && (r = null,
                                s = null,
                                this.trigger("fallOff"),
                                u = !1),
                                r)
                                if (!this.isColliding(r) || !r.exists() || !r.is("body"))
                                    u = !0;
                                else {
                                    !r.pos.eq(s) && t.stickToPlatform !== !1 && this.moveBy(r.pos.sub(s)),
                                        s = r.pos;
                                    return
                                }
                            let a = this.vel.y;
                            this.vel.y += C.gravity * this.gravityScale * Me(),
                                this.vel.y = Math.min(this.vel.y, t.maxVelocity ?? Ls),
                            a < 0 && this.vel.y >= 0 && this.trigger("fall"),
                                this.move(this.vel)
                        },
                        onPhysicsResolve(a) {
                            return this.on("physicsResolve", a)
                        },
                        onBeforePhysicsResolve(a) {
                            return this.on("beforePhysicsResolve", a)
                        },
                        curPlatform() {
                            return r
                        },
                        isGrounded() {
                            return r !== null
                        },
                        isFalling() {
                            return this.vel.y > 0
                        },
                        isJumping() {
                            return this.vel.y < 0
                        },
                        jump(a) {
                            r = null,
                                s = null,
                                this.vel.y = -a || -this.jumpForce
                        },
                        onGround(a) {
                            return this.on("ground", a)
                        },
                        onFall(a) {
                            return this.on("fall", a)
                        },
                        onFallOff(a) {
                            return this.on("fallOff", a)
                        },
                        onHeadbutt(a) {
                            return this.on("headbutt", a)
                        }
                    }
                }
                o(Vs, "body");
                function _s(t=2) {
                    let r = t;
                    return {
                        id: "doubleJump",
                        require: ["body"],
                        numJumps: t,
                        add() {
                            this.onGround(()=>{
                                    r = this.numJumps
                                }
                            )
                        },
                        doubleJump(s) {
                            r <= 0 || (r < this.numJumps && this.trigger("doubleJump"),
                                r--,
                                this.jump(s))
                        },
                        onDoubleJump(s) {
                            return this.on("doubleJump", s)
                        },
                        inspect() {
                            return `${r}`
                        }
                    }
                }
                o(_s, "doubleJump");
                function ks(t, r) {
                    return {
                        id: "shader",
                        shader: t,
                        ...typeof r == "function" ? {
                            uniform: r(),
                            update() {
                                this.uniform = r()
                            }
                        } : {
                            uniform: r
                        }
                    }
                }
                o(ks, "shader");
                function Ns() {
                    return {
                        id: "fixed",
                        fixed: !0
                    }
                }
                o(Ns, "fixed");
                function ar(t) {
                    return {
                        id: "stay",
                        stay: !0,
                        scenesToStay: t
                    }
                }
                o(ar, "stay");
                function js(t, r) {
                    if (t == null)
                        throw new Error("health() requires the initial amount of hp");
                    return {
                        id: "health",
                        hurt(s=1) {
                            this.setHP(t - s),
                                this.trigger("hurt", s)
                        },
                        heal(s=1) {
                            let u = t;
                            this.setHP(t + s),
                                this.trigger("heal", t - u)
                        },
                        hp() {
                            return t
                        },
                        maxHP() {
                            return r ?? null
                        },
                        setMaxHP(s) {
                            r = s
                        },
                        setHP(s) {
                            t = r ? Math.min(r, s) : s,
                            t <= 0 && this.trigger("death")
                        },
                        onHurt(s) {
                            return this.on("hurt", s)
                        },
                        onHeal(s) {
                            return this.on("heal", s)
                        },
                        onDeath(s) {
                            return this.on("death", s)
                        },
                        inspect() {
                            return `${t}`
                        }
                    }
                }
                o(js, "health");
                function Hs(t, r={}) {
                    if (t == null)
                        throw new Error("lifespan() requires time");
                    let s = r.fade ?? 0;
                    return {
                        id: "lifespan",
                        async add() {
                            await lr(t),
                            s > 0 && this.opacity && await Pn(this.opacity, 0, s, u=>this.opacity = u, Ct.linear),
                                this.destroy()
                        }
                    }
                }
                o(Hs, "lifespan");
                function qs(t, r, s) {
                    if (!t)
                        throw new Error("state() requires an initial state");
                    let u = {};
                    function a(g) {
                        u[g] || (u[g] = {
                            enter: new be,
                            end: new be,
                            update: new be,
                            draw: new be
                        })
                    }
                    o(a, "initStateEvents");
                    function h(g, d, w) {
                        return a(d),
                            u[d][g].add(w)
                    }
                    o(h, "on");
                    function f(g, d, ...w) {
                        a(d),
                            u[d][g].trigger(...w)
                    }
                    o(f, "trigger");
                    let b = !1;
                    return {
                        id: "state",
                        state: t,
                        enterState(g, ...d) {
                            if (b = !0,
                            r && !r.includes(g))
                                throw new Error(`State not found: ${g}`);
                            let w = this.state;
                            if (s) {
                                if (!s?.[w])
                                    return;
                                let A = typeof s[w] == "string" ? [s[w]] : s[w];
                                if (!A.includes(g))
                                    throw new Error(`Cannot transition state from "${w}" to "${g}". Available transitions: ${A.map(D=>`"${D}"`).join(", ")}`)
                            }
                            f("end", w, ...d),
                                this.state = g,
                                f("enter", g, ...d),
                                f("enter", `${w} -> ${g}`, ...d)
                        },
                        onStateTransition(g, d, w) {
                            return h("enter", `${g} -> ${d}`, w)
                        },
                        onStateEnter(g, d) {
                            return h("enter", g, d)
                        },
                        onStateUpdate(g, d) {
                            return h("update", g, d)
                        },
                        onStateDraw(g, d) {
                            return h("draw", g, d)
                        },
                        onStateEnd(g, d) {
                            return h("end", g, d)
                        },
                        update() {
                            b || (f("enter", t),
                                b = !0),
                                f("update", this.state)
                        },
                        draw() {
                            f("draw", this.state)
                        },
                        inspect() {
                            return this.state
                        }
                    }
                }
                o(qs, "state");
                function $s(t=1) {
                    let r = 0
                        , s = !1;
                    return {
                        require: ["opacity"],
                        add() {
                            this.opacity = 0
                        },
                        update() {
                            s || (r += Me(),
                                this.opacity = _e(r, 0, t, 0, 1),
                            r >= t && (this.opacity = 1,
                                s = !0))
                        }
                    }
                }
                o($s, "fadeIn");
                function zs(t="intersect") {
                    return {
                        id: "mask",
                        mask: t
                    }
                }
                o(zs, "mask");
                function Ks(t) {
                    return {
                        add() {
                            this.canvas = t
                        }
                    }
                }
                o(Ks, "drawon");
                function On(t) {
                    k.loaded ? t() : C.events.on("load", t)
                }
                o(On, "onLoad");
                function Ys(t, r) {
                    C.scenes[t] = r
                }
                o(Ys, "scene");
                function Ws(t, ...r) {
                    if (!C.scenes[t])
                        throw new Error(`Scene not found: ${t}`);
                    C.events.onOnce("frameEnd", ()=>{
                            C.events.trigger("sceneLeave", t),
                                y.events.clear(),
                                C.events.clear(),
                                C.objEvents.clear(),
                                [...C.root.children].forEach(s=>{
                                        (!s.stay || s.scenesToStay && !s.scenesToStay.includes(t)) && C.root.remove(s)
                                    }
                                ),
                                C.root.clearEvents(),
                                gr(),
                                C.cam = {
                                    pos: null,
                                    scale: T(1),
                                    angle: 0,
                                    shake: 0,
                                    transform: new Ue
                                },
                                C.scenes[t](...r)
                        }
                    )
                }
                o(Ws, "go");
                function Xs(t) {
                    return C.events.on("sceneLeave", t)
                }
                o(Xs, "onSceneLeave");
                function Js(t, r) {
                    try {
                        return JSON.parse(window.localStorage[t])
                    } catch {
                        return r ? (ur(t, r),
                            r) : null
                    }
                }
                o(Js, "getData");
                function ur(t, r) {
                    window.localStorage[t] = JSON.stringify(r)
                }
                o(ur, "setData");
                function cr(t, ...r) {
                    let s = t(Ze), u;
                    typeof s == "function" ? u = s(...r)(Ze) : u = s;
                    for (let a in u)
                        Ze[a] = u[a],
                        n.global !== !1 && (window[a] = u[a]);
                    return Ze
                }
                o(cr, "plug");
                function zt() {
                    return T(we() / 2, xe() / 2)
                }
                o(zt, "center");
                let Qs;
                (O=>(O[O.None = 0] = "None",
                    O[O.Left = 1] = "Left",
                    O[O.Top = 2] = "Top",
                    O[O.LeftTop = 3] = "LeftTop",
                    O[O.Right = 4] = "Right",
                    O[O.Horizontal = 5] = "Horizontal",
                    O[O.RightTop = 6] = "RightTop",
                    O[O.HorizontalTop = 7] = "HorizontalTop",
                    O[O.Bottom = 8] = "Bottom",
                    O[O.LeftBottom = 9] = "LeftBottom",
                    O[O.Vertical = 10] = "Vertical",
                    O[O.LeftVertical = 11] = "LeftVertical",
                    O[O.RightBottom = 12] = "RightBottom",
                    O[O.HorizontalBottom = 13] = "HorizontalBottom",
                    O[O.RightVertical = 14] = "RightVertical",
                    O[O.All = 15] = "All"))(Qs ||= {});
                function hr(t={}) {
                    let r = T(0)
                        , s = t.isObstacle ?? !1
                        , u = t.cost ?? 0
                        , a = t.edges ?? []
                        , h = o(()=>{
                            let b = {
                                left: 1,
                                top: 2,
                                right: 4,
                                bottom: 8
                            };
                            return a.map(g=>b[g] || 0).reduce((g,d)=>g | d, 0)
                        }
                        , "getEdgeMask")
                        , f = h();
                    return {
                        id: "tile",
                        tilePosOffset: t.offset ?? T(0),
                        set tilePos(b) {
                            let g = this.getLevel();
                            r = b.clone(),
                                this.pos = T(this.tilePos.x * g.tileWidth(), this.tilePos.y * g.tileHeight()).add(this.tilePosOffset)
                        },
                        get tilePos() {
                            return r
                        },
                        set isObstacle(b) {
                            s !== b && (s = b,
                                this.getLevel().invalidateNavigationMap())
                        },
                        get isObstacle() {
                            return s
                        },
                        set cost(b) {
                            u !== b && (u = b,
                                this.getLevel().invalidateNavigationMap())
                        },
                        get cost() {
                            return u
                        },
                        set edges(b) {
                            a = b,
                                f = h(),
                                this.getLevel().invalidateNavigationMap()
                        },
                        get edges() {
                            return a
                        },
                        get edgeMask() {
                            return f
                        },
                        getLevel() {
                            return this.parent
                        },
                        moveLeft() {
                            this.tilePos = this.tilePos.add(T(-1, 0))
                        },
                        moveRight() {
                            this.tilePos = this.tilePos.add(T(1, 0))
                        },
                        moveUp() {
                            this.tilePos = this.tilePos.add(T(0, -1))
                        },
                        moveDown() {
                            this.tilePos = this.tilePos.add(T(0, 1))
                        }
                    }
                }
                o(hr, "tile");
                function Zs(t, r) {
                    if (!r.tileWidth || !r.tileHeight)
                        throw new Error("Must provide tileWidth and tileHeight.");
                    let s = gt([qt(r.pos ?? T(0))])
                        , u = t.length
                        , a = 0
                        , h = null
                        , f = null
                        , b = null
                        , g = null
                        , d = o(U=>U.x + U.y * a, "tile2Hash")
                        , w = o(U=>T(Math.floor(U % a), Math.floor(U / a)), "hash2Tile")
                        , A = o(()=>{
                            h = [];
                            for (let U of s.children)
                                D(U)
                        }
                        , "createSpatialMap")
                        , D = o(U=>{
                            let G = d(U.tilePos);
                            h[G] ? h[G].push(U) : h[G] = [U]
                        }
                        , "insertIntoSpatialMap")
                        , N = o(U=>{
                            let G = d(U.tilePos);
                            if (h[G]) {
                                let B = h[G].indexOf(U);
                                B >= 0 && h[G].splice(B, 1)
                            }
                        }
                        , "removeFromSpatialMap")
                        , _ = o(()=>{
                            let U = !1;
                            for (let G of s.children) {
                                let B = s.pos2Tile(G.pos);
                                (G.tilePos.x != B.x || G.tilePos.y != B.y) && (U = !0,
                                    N(G),
                                    G.tilePos.x = B.x,
                                    G.tilePos.y = B.y,
                                    D(G))
                            }
                            U && s.trigger("spatial_map_changed")
                        }
                        , "updateSpatialMap")
                        , M = o(()=>{
                            let U = s.getSpatialMap()
                                , G = s.numRows() * s.numColumns();
                            f ? f.length = G : f = new Array(G),
                                f.fill(1, 0, G);
                            for (let B = 0; B < U.length; B++) {
                                let F = U[B];
                                if (F) {
                                    let Y = 0;
                                    for (let ee of F)
                                        if (ee.isObstacle) {
                                            Y = 1 / 0;
                                            break
                                        } else
                                            Y += ee.cost;
                                    f[B] = Y || 1
                                }
                            }
                        }
                        , "createCostMap")
                        , O = o(()=>{
                            let U = s.getSpatialMap()
                                , G = s.numRows() * s.numColumns();
                            b ? b.length = G : b = new Array(G),
                                b.fill(15, 0, G);
                            for (let B = 0; B < U.length; B++) {
                                let F = U[B];
                                if (F) {
                                    let Y = F.length
                                        , ee = 15;
                                    for (let ue = 0; ue < Y; ue++)
                                        ee |= F[ue].edgeMask;
                                    b[B] = ee
                                }
                            }
                        }
                        , "createEdgeMap")
                        , ie = o(()=>{
                            let U = s.numRows() * s.numColumns()
                                , G = o((F,Y)=>{
                                    let ee = [];
                                    for (ee.push(F); ee.length > 0; ) {
                                        let ue = ee.pop();
                                        V(ue).forEach(me=>{
                                                g[me] < 0 && (g[me] = Y,
                                                    ee.push(me))
                                            }
                                        )
                                    }
                                }
                                , "traverse");
                            g ? g.length = U : g = new Array(U),
                                g.fill(-1, 0, U);
                            let B = 0;
                            for (let F = 0; F < f.length; F++) {
                                if (g[F] >= 0) {
                                    B++;
                                    continue
                                }
                                G(F, B),
                                    B++
                            }
                        }
                        , "createConnectivityMap")
                        , Z = o((U,G)=>f[G], "getCost")
                        , H = o((U,G)=>{
                            let B = w(U)
                                , F = w(G);
                            return B.dist(F)
                        }
                        , "getHeuristic")
                        , V = o((U,G)=>{
                            let B = []
                                , F = Math.floor(U % a)
                                , Y = F > 0 && b[U] & 1 && f[U - 1] !== 1 / 0
                                , ee = U >= a && b[U] & 2 && f[U - a] !== 1 / 0
                                , ue = F < a - 1 && b[U] & 4 && f[U + 1] !== 1 / 0
                                , me = U < a * u - a - 1 && b[U] & 8 && f[U + a] !== 1 / 0;
                            return G ? (Y && (ee && B.push(U - a - 1),
                                B.push(U - 1),
                            me && B.push(U + a - 1)),
                            ee && B.push(U - a),
                            ue && (ee && B.push(U - a + 1),
                                B.push(U + 1),
                            me && B.push(U + a + 1)),
                            me && B.push(U + a)) : (Y && B.push(U - 1),
                            ee && B.push(U - a),
                            ue && B.push(U + 1),
                            me && B.push(U + a)),
                                B
                        }
                        , "getNeighbours")
                        , fe = {
                        id: "level",
                        tileWidth() {
                            return r.tileWidth
                        },
                        tileHeight() {
                            return r.tileHeight
                        },
                        spawn(U, ...G) {
                            let B = T(...G)
                                , F = (()=>{
                                    if (typeof U == "string") {
                                        if (r.tiles[U]) {
                                            if (typeof r.tiles[U] != "function")
                                                throw new Error("Level symbol def must be a function returning a component list");
                                            return r.tiles[U](B)
                                        } else if (r.wildcardTile)
                                            return r.wildcardTile(U, B)
                                    } else {
                                        if (Array.isArray(U))
                                            return U;
                                        throw new Error("Expected a symbol or a component list")
                                    }
                                }
                            )();
                            if (!F)
                                return null;
                            let Y = !1
                                , ee = !1;
                            for (let me of F)
                                me.id === "tile" && (ee = !0),
                                me.id === "pos" && (Y = !0);
                            Y || F.push(qt()),
                            ee || F.push(hr());
                            let ue = s.add(F);
                            return Y && (ue.tilePosOffset = ue.pos.clone()),
                                ue.tilePos = B,
                            h && (D(ue),
                                this.trigger("spatial_map_changed"),
                                this.trigger("navigation_map_invalid")),
                                ue
                        },
                        numColumns() {
                            return a
                        },
                        numRows() {
                            return u
                        },
                        levelWidth() {
                            return a * this.tileWidth()
                        },
                        levelHeight() {
                            return u * this.tileHeight()
                        },
                        tile2Pos(...U) {
                            return T(...U).scale(this.tileWidth(), this.tileHeight())
                        },
                        pos2Tile(...U) {
                            let G = T(...U);
                            return T(Math.floor(G.x / this.tileWidth()), Math.floor(G.y / this.tileHeight()))
                        },
                        getSpatialMap() {
                            return h || A(),
                                h
                        },
                        onSpatialMapChanged(U) {
                            return this.on("spatial_map_changed", U)
                        },
                        onNavigationMapInvalid(U) {
                            return this.on("navigation_map_invalid", U)
                        },
                        getAt(U) {
                            h || A();
                            let G = d(U);
                            return h[G] || []
                        },
                        update() {
                            h && _()
                        },
                        invalidateNavigationMap() {
                            f = null,
                                b = null,
                                g = null
                        },
                        onNavigationMapChanged(U) {
                            return this.on("navigation_map_changed", U)
                        },
                        getTilePath(U, G, B={}) {
                            if (f || M(),
                            b || O(),
                            g || ie(),
                            U.x < 0 || U.x >= a || U.y < 0 || U.y >= u || G.x < 0 || G.x >= a || G.y < 0 || G.y >= u)
                                return null;
                            let F = d(U)
                                , Y = d(G);
                            if (f[Y] === 1 / 0)
                                return null;
                            if (F === Y)
                                return [];
                            if (g[F] != -1 && g[F] !== g[Y])
                                return null;
                            let ee = new Wt((Fe,Gn)=>Fe.cost < Gn.cost);
                            ee.insert({
                                cost: 0,
                                node: F
                            });
                            let ue = new Map;
                            ue.set(F, F);
                            let me = new Map;
                            for (me.set(F, 0); ee.length !== 0; ) {
                                let Fe = ee.remove()?.node;
                                if (Fe === Y)
                                    break;
                                let Gn = V(Fe, B.allowDiagonals);
                                for (let et of Gn) {
                                    let Bn = (me.get(Fe) || 0) + Z(Fe, et) + H(et, Y);
                                    (!me.has(et) || Bn < me.get(et)) && (me.set(et, Bn),
                                        ee.insert({
                                            cost: Bn,
                                            node: et
                                        }),
                                        ue.set(et, Fe))
                                }
                            }
                            let Mn = []
                                , wt = Y
                                , yi = w(wt);
                            for (Mn.push(yi); wt !== F; ) {
                                wt = ue.get(wt);
                                let Fe = w(wt);
                                Mn.push(Fe)
                            }
                            return Mn.reverse()
                        },
                        getPath(U, G, B={}) {
                            let F = this.tileWidth()
                                , Y = this.tileHeight()
                                , ee = this.getTilePath(this.pos2Tile(U), this.pos2Tile(G), B);
                            return ee ? [U, ...ee.slice(1, -1).map(ue=>ue.scale(F, Y).add(F / 2, Y / 2)), G] : null
                        }
                    };
                    return s.use(fe),
                        s.onNavigationMapInvalid(()=>{
                                s.invalidateNavigationMap(),
                                    s.trigger("navigation_map_changed")
                            }
                        ),
                        t.forEach((U,G)=>{
                                let B = U.split("");
                                a = Math.max(B.length, a),
                                    B.forEach((F,Y)=>{
                                            s.spawn(F, T(Y, G))
                                        }
                                    )
                            }
                        ),
                        s
                }
                o(Zs, "addLevel");
                function ei(t={}) {
                    let r = null
                        , s = null
                        , u = null
                        , a = null;
                    return {
                        id: "agent",
                        require: ["pos", "tile"],
                        agentSpeed: t.speed ?? 100,
                        allowDiagonals: t.allowDiagonals ?? !0,
                        getDistanceToTarget() {
                            return r ? this.pos.dist(r) : 0
                        },
                        getNextLocation() {
                            return s && u ? s[u] : null
                        },
                        getPath() {
                            return s ? s.slice() : null
                        },
                        getTarget() {
                            return r
                        },
                        isNavigationFinished() {
                            return s ? u === null : !0
                        },
                        isTargetReachable() {
                            return s !== null
                        },
                        isTargetReached() {
                            return r ? this.pos.eq(r) : !0
                        },
                        setTarget(h) {
                            r = h,
                                s = this.getLevel().getPath(this.pos, r, {
                                    allowDiagonals: this.allowDiagonals
                                }),
                                u = s ? 0 : null,
                                s ? (a || (a = this.getLevel().onNavigationMapChanged(()=>{
                                        s && u !== null && (s = this.getLevel().getPath(this.pos, r, {
                                            allowDiagonals: this.allowDiagonals
                                        }),
                                            u = s ? 0 : null,
                                            s ? this.trigger("navigation-next", this, s[u]) : this.trigger("navigation-ended", this))
                                    }
                                ),
                                    this.onDestroy(()=>a.cancel())),
                                    this.trigger("navigation-started", this),
                                    this.trigger("navigation-next", this, s[u])) : this.trigger("navigation-ended", this)
                        },
                        update() {
                            if (s && u !== null) {
                                if (this.pos.sdist(s[u]) < 2)
                                    if (u === s.length - 1) {
                                        this.pos = r.clone(),
                                            u = null,
                                            this.trigger("navigation-ended", this),
                                            this.trigger("target-reached", this);
                                        return
                                    } else
                                        u++,
                                            this.trigger("navigation-next", this, s[u]);
                                this.moveTo(s[u], this.agentSpeed)
                            }
                        },
                        onNavigationStarted(h) {
                            return this.on("navigation-started", h)
                        },
                        onNavigationNext(h) {
                            return this.on("navigation-next", h)
                        },
                        onNavigationEnded(h) {
                            return this.on("navigation-ended", h)
                        },
                        onTargetReached(h) {
                            return this.on("target-reached", h)
                        },
                        inspect() {
                            return JSON.stringify({
                                target: JSON.stringify(r),
                                path: JSON.stringify(s)
                            })
                        }
                    }
                }
                o(ei, "agent");
                function ti(t) {
                    let r = y.canvas.captureStream(t)
                        , s = te.ctx.createMediaStreamDestination();
                    te.masterNode.connect(s);
                    let u = new MediaRecorder(r)
                        , a = [];
                    return u.ondataavailable = h=>{
                        h.data.size > 0 && a.push(h.data)
                    }
                        ,
                        u.onerror = ()=>{
                            te.masterNode.disconnect(s),
                                r.getTracks().forEach(h=>h.stop())
                        }
                        ,
                        u.start(),
                        {
                            resume() {
                                u.resume()
                            },
                            pause() {
                                u.pause()
                            },
                            stop() {
                                return u.stop(),
                                    te.masterNode.disconnect(s),
                                    r.getTracks().forEach(h=>h.stop()),
                                    new Promise(h=>{
                                            u.onstop = ()=>{
                                                h(new Blob(a,{
                                                    type: "video/mp4"
                                                }))
                                            }
                                        }
                                    )
                            },
                            download(h="kaplay.mp4") {
                                this.stop().then(f=>jn(h, f))
                            }
                        }
                }
                o(ti, "record");
                function ni() {
                    return document.activeElement === y.canvas
                }
                o(ni, "isFocused");
                function ri(t) {
                    t.destroy()
                }
                o(ri, "destroy");
                let gt = C.root.add.bind(C.root)
                    , si = C.root.readd.bind(C.root)
                    , ii = C.root.removeAll.bind(C.root)
                    , Rn = C.root.get.bind(C.root)
                    , lr = C.root.wait.bind(C.root)
                    , oi = C.root.loop.bind(C.root)
                    , Pn = C.root.tween.bind(C.root);
                function dr(t=2, r=1) {
                    let s = 0;
                    return {
                        require: ["scale"],
                        update() {
                            let u = Math.sin(s * t) * r;
                            u < 0 && this.destroy(),
                                this.scale = T(u),
                                s += Me()
                        }
                    }
                }
                o(dr, "boom");
                let ai = Ye(null, $r)
                    , ui = Ye(null, zr);
                function ci(t, r={}) {
                    let s = gt([qt(t), ar()])
                        , u = (r.speed || 1) * 5
                        , a = r.scale || 1;
                    s.add([An(ui), $t(0), Cn("center"), dr(u, a), ...r.comps ?? []]);
                    let h = s.add([An(ai), $t(0), Cn("center"), Tn(), ...r.comps ?? []]);
                    return h.wait(.4 / u, ()=>h.use(dr(u, a))),
                        h.onDestroy(()=>s.destroy()),
                        s
                }
                o(ci, "addKaboom");
                function fr() {
                    C.root.update()
                }
                o(fr, "updateFrame");
                class Dn {
                    static{o(this, "Collision")
                    }source;
                    target;
                    displacement;
                    resolved = !1;
                    constructor(r, s, u, a=!1) {
                        this.source = r,
                            this.target = s,
                            this.displacement = u,
                            this.resolved = a
                    }
                    reverse() {
                        return new Dn(this.target,this.source,this.displacement.scale(-1),this.resolved)
                    }
                    hasOverlap() {
                        return !this.displacement.isZero()
                    }
                    isLeft() {
                        return this.displacement.x > 0
                    }
                    isRight() {
                        return this.displacement.x < 0
                    }
                    isTop() {
                        return this.displacement.y > 0
                    }
                    isBottom() {
                        return this.displacement.y < 0
                    }
                    preventResolution() {
                        this.resolved = !0
                    }
                }
                function hi() {
                    let t = {}
                        , r = n.hashGridSize || Wi
                        , s = new Ue
                        , u = [];
                    function a(h) {
                        if (u.push(s.clone()),
                        h.pos && s.translate(h.pos),
                        h.scale && s.scale(h.scale),
                        h.angle && s.rotate(h.angle),
                            h.transform = s.clone(),
                        h.c("area") && !h.paused) {
                            let f = h
                                , g = f.worldArea().bbox()
                                , d = Math.floor(g.pos.x / r)
                                , w = Math.floor(g.pos.y / r)
                                , A = Math.ceil((g.pos.x + g.width) / r)
                                , D = Math.ceil((g.pos.y + g.height) / r)
                                , N = new Set;
                            for (let _ = d; _ <= A; _++)
                                for (let M = w; M <= D; M++)
                                    if (!t[_])
                                        t[_] = {},
                                            t[_][M] = [f];
                                    else if (!t[_][M])
                                        t[_][M] = [f];
                                    else {
                                        let O = t[_][M];
                                        e: for (let ie of O) {
                                            if (ie.paused || !ie.exists() || N.has(ie.id))
                                                continue;
                                            for (let H of f.collisionIgnore)
                                                if (ie.is(H))
                                                    continue e;
                                            for (let H of ie.collisionIgnore)
                                                if (f.is(H))
                                                    continue e;
                                            let Z = Rr(f.worldArea(), ie.worldArea());
                                            if (Z) {
                                                let H = new Dn(f,ie,Z);
                                                f.trigger("collideUpdate", ie, H);
                                                let V = H.reverse();
                                                V.resolved = H.resolved,
                                                    ie.trigger("collideUpdate", f, V)
                                            }
                                            N.add(ie.id)
                                        }
                                        O.push(f)
                                    }
                        }
                        h.children.forEach(a),
                            s = u.pop()
                    }
                    o(a, "checkObj"),
                        a(C.root)
                }
                o(hi, "checkFrame");
                function li() {
                    let t = C.cam
                        , r = v.fromAngle(xt(0, 360)).scale(t.shake);
                    t.shake = Ve(t.shake, 0, 5 * Me()),
                        t.transform = new Ue().translate(zt()).scale(t.scale).rotate(t.angle).translate((t.pos ?? zt()).scale(-1).add(r)),
                        C.root.draw(),
                        Pe()
                }
                o(li, "drawFrame");
                function di() {
                    let t = $();
                    C.events.numListeners("loading") > 0 ? C.events.trigger("loading", t) : Ce(()=>{
                            let r = we() / 2
                                , s = 24
                                , u = T(we() / 2, xe() / 2).sub(T(r / 2, s / 2));
                            ge({
                                pos: T(0),
                                width: we(),
                                height: xe(),
                                color: J(0, 0, 0)
                            }),
                                ge({
                                    pos: u,
                                    width: r,
                                    height: s,
                                    fill: !1,
                                    outline: {
                                        width: 4
                                    }
                                }),
                                ge({
                                    pos: u,
                                    width: r * t,
                                    height: s
                                })
                        }
                    )
                }
                o(di, "drawLoadScreen");
                function mr(t, r) {
                    Ce(()=>{
                            let s = T(8);
                            le(),
                                ne(t);
                            let u = Xe({
                                text: r,
                                font: rn,
                                size: 16,
                                pos: s,
                                color: J(255, 255, 255),
                                fixed: !0
                            })
                                , a = u.width + s.x * 2
                                , h = u.height + s.x * 2;
                            t.x + a >= we() && ne(T(-a, 0)),
                            t.y + h >= xe() && ne(T(0, -h)),
                                ge({
                                    width: a,
                                    height: h,
                                    color: J(0, 0, 0),
                                    radius: 4,
                                    opacity: .8,
                                    fixed: !0
                                }),
                                Je(u),
                                ae()
                        }
                    )
                }
                o(mr, "drawInspectText");
                function fi() {
                    if (re.inspect) {
                        let t = null;
                        for (let r of C.root.get("*", {
                            recursive: !0
                        }))
                            if (r.c("area") && r.isHovering()) {
                                t = r;
                                break
                            }
                        if (C.root.drawInspect(),
                            t) {
                            let r = []
                                , s = t.inspect();
                            for (let u in s)
                                s[u] ? r.push(`${u}: ${s[u]}`) : r.push(`${u}`);
                            mr(rs(Nt()), r.join(`
`))
                        }
                        mr(T(8), `FPS: ${re.fps()}`)
                    }
                    re.paused && Ce(()=>{
                            le(),
                                ne(we(), 0),
                                ne(-8, 8);
                            let t = 32;
                            ge({
                                width: t,
                                height: t,
                                anchor: "topright",
                                color: J(0, 0, 0),
                                opacity: .8,
                                radius: 4,
                                fixed: !0
                            });
                            for (let r = 1; r <= 2; r++)
                                ge({
                                    width: 4,
                                    height: t * .6,
                                    anchor: "center",
                                    pos: T(-t / 3 * r, t * .5),
                                    color: J(255, 255, 255),
                                    radius: 2,
                                    fixed: !0
                                });
                            ae()
                        }
                    ),
                    re.timeScale !== 1 && Ce(()=>{
                            le(),
                                ne(we(), xe()),
                                ne(-8, -8);
                            let t = 8
                                , r = Xe({
                                text: re.timeScale.toFixed(1),
                                font: rn,
                                size: 16,
                                color: J(255, 255, 255),
                                pos: T(-t),
                                anchor: "botright",
                                fixed: !0
                            });
                            ge({
                                width: r.width + t * 2 + t * 4,
                                height: r.height + t * 2,
                                anchor: "botright",
                                color: J(0, 0, 0),
                                opacity: .8,
                                radius: 4,
                                fixed: !0
                            });
                            for (let s = 0; s < 2; s++) {
                                let u = re.timeScale < 1;
                                R({
                                    p1: T(-r.width - t * (u ? 2 : 3.5), -t),
                                    p2: T(-r.width - t * (u ? 2 : 3.5), -t - r.height),
                                    p3: T(-r.width - t * (u ? 3.5 : 2), -t - r.height / 2),
                                    pos: T(-s * t * 1 + (u ? -t * .5 : 0), 0),
                                    color: J(255, 255, 255),
                                    fixed: !0
                                })
                            }
                            Je(r),
                                ae()
                        }
                    ),
                    re.curRecording && Ce(()=>{
                            le(),
                                ne(0, xe()),
                                ne(24, -24),
                                L({
                                    radius: 12,
                                    color: J(255, 0, 0),
                                    opacity: Ln(0, 1, y.time() * 4),
                                    fixed: !0
                                }),
                                ae()
                        }
                    ),
                    re.showLog && C.logs.length > 0 && Ce(()=>{
                            le(),
                                ne(0, xe()),
                                ne(8, -8);
                            let t = 8
                                , r = [];
                            for (let u of C.logs) {
                                let a = ""
                                    , h = u.msg instanceof Error ? "error" : "info";
                                a += `[time]${u.time.toFixed(2)}[/time]`,
                                    a += " ",
                                    a += `[${h}]${u.msg?.toString ? u.msg.toString() : u.msg}[/${h}]`,
                                    r.push(a)
                            }
                            C.logs = C.logs.filter(u=>y.time() - u.time < (n.logTime || Ji));
                            let s = Xe({
                                text: r.join(`
`),
                                font: rn,
                                pos: T(t, -t),
                                anchor: "botleft",
                                size: 16,
                                width: we() * .6,
                                lineSpacing: t / 2,
                                fixed: !0,
                                styles: {
                                    time: {
                                        color: J(127, 127, 127)
                                    },
                                    info: {
                                        color: J(255, 255, 255)
                                    },
                                    error: {
                                        color: J(255, 0, 127)
                                    }
                                }
                            });
                            ge({
                                width: s.width + t * 2,
                                height: s.height + t * 2,
                                anchor: "botleft",
                                color: J(0, 0, 0),
                                radius: 4,
                                opacity: .8,
                                fixed: !0
                            }),
                                Je(s),
                                ae()
                        }
                    )
                }
                o(fi, "drawDebug");
                function mi(t) {
                    C.events.on("loading", t)
                }
                o(mi, "onLoading");
                function pi(t) {
                    y.onResize(t)
                }
                o(pi, "onResize");
                function gi(t) {
                    C.events.on("error", t)
                }
                o(gi, "onError");
                function wi(t) {
                    console.error(t),
                        te.ctx.suspend(),
                        y.run(()=>{
                                dt(),
                                    Ce(()=>{
                                            let u = we()
                                                , a = xe()
                                                , h = {
                                                size: 36,
                                                width: u - 32 * 2,
                                                letterSpacing: 4,
                                                lineSpacing: 4,
                                                font: rn,
                                                fixed: !0
                                            };
                                            ge({
                                                width: u,
                                                height: a,
                                                color: J(0, 0, 255),
                                                fixed: !0
                                            });
                                            let f = Xe({
                                                ...h,
                                                text: "Error",
                                                pos: T(32),
                                                color: J(255, 128, 0),
                                                fixed: !0
                                            });
                                            Je(f),
                                                nr({
                                                    ...h,
                                                    text: t.message,
                                                    pos: T(32, 32 + f.height + 16),
                                                    fixed: !0
                                                }),
                                                ae(),
                                                C.events.trigger("error", t)
                                        }
                                    ),
                                    ft()
                            }
                        )
                }
                o(wi, "handleErr");
                function bi(t) {
                    X.push(t)
                }
                o(bi, "onCleanup");
                function vi() {
                    C.events.onOnce("frameEnd", ()=>{
                            y.quit(),
                                S.clear(S.COLOR_BUFFER_BIT | S.DEPTH_BUFFER_BIT | S.STENCIL_BUFFER_BIT);
                            let t = S.getParameter(S.MAX_TEXTURE_IMAGE_UNITS);
                            for (let r = 0; r < t; r++)
                                S.activeTexture(S.TEXTURE0 + r),
                                    S.bindTexture(S.TEXTURE_2D, null),
                                    S.bindTexture(S.TEXTURE_CUBE_MAP, null);
                            S.bindBuffer(S.ARRAY_BUFFER, null),
                                S.bindBuffer(S.ELEMENT_ARRAY_BUFFER, null),
                                S.bindRenderbuffer(S.RENDERBUFFER, null),
                                S.bindFramebuffer(S.FRAMEBUFFER, null),
                                q.destroy(),
                                X.forEach(r=>r())
                        }
                    )
                }
                o(vi, "quit");
                let Kt = !0;
                y.run(()=>{
                        try {
                            k.loaded || $() === 1 && !Kt && (k.loaded = !0,
                                C.events.trigger("load")),
                                !k.loaded && n.loadingScreen !== !1 || Kt ? (dt(),
                                    di(),
                                    ft()) : (re.paused || fr(),
                                    hi(),
                                    dt(),
                                    li(),
                                n.debug !== !1 && fi(),
                                    ft()),
                            Kt && (Kt = !1),
                                C.events.trigger("frameEnd")
                        } catch (t) {
                            wi(t)
                        }
                    }
                );
                function pr() {
                    let t = P
                        , r = S.drawingBufferWidth / t
                        , s = S.drawingBufferHeight / t;
                    if (n.letterbox) {
                        if (!n.width || !n.height)
                            throw new Error("Letterboxing requires width and height defined.");
                        let u = r / s
                            , a = n.width / n.height;
                        if (u > a) {
                            let h = s * a
                                , f = (r - h) / 2;
                            E.viewport = {
                                x: f,
                                y: 0,
                                width: h,
                                height: s
                            }
                        } else {
                            let h = r / a
                                , f = (s - h) / 2;
                            E.viewport = {
                                x: 0,
                                y: f,
                                width: r,
                                height: h
                            }
                        }
                        return
                    }
                    if (n.stretch && (!n.width || !n.height))
                        throw new Error("Stretching requires width and height defined.");
                    E.viewport = {
                        x: 0,
                        y: 0,
                        width: r,
                        height: s
                    }
                }
                o(pr, "updateViewport");
                function gr() {
                    y.onHide(()=>{
                            n.backgroundAudio || te.ctx.suspend()
                        }
                    ),
                        y.onShow(()=>{
                                !n.backgroundAudio && !re.paused && te.ctx.resume()
                            }
                        ),
                        y.onResize(()=>{
                                if (y.isFullscreen())
                                    return;
                                let t = n.width && n.height;
                                t && !n.stretch && !n.letterbox || (i.width = i.offsetWidth * P,
                                    i.height = i.offsetHeight * P,
                                    pr(),
                                t || (E.frameBuffer.free(),
                                    E.frameBuffer = new rt(q,S.drawingBufferWidth,S.drawingBufferHeight),
                                    E.width = S.drawingBufferWidth / P,
                                    E.height = S.drawingBufferHeight / P))
                            }
                        ),
                    n.debug !== !1 && (y.onKeyPress("f1", ()=>re.inspect = !re.inspect),
                        y.onKeyPress("f2", ()=>re.clearLog()),
                        y.onKeyPress("f8", ()=>re.paused = !re.paused),
                        y.onKeyPress("f7", ()=>{
                                re.timeScale = mt(Le(re.timeScale - .2, 0, 2), 1)
                            }
                        ),
                        y.onKeyPress("f9", ()=>{
                                re.timeScale = mt(Le(re.timeScale + .2, 0, 2), 1)
                            }
                        ),
                        y.onKeyPress("f10", ()=>re.stepFrame())),
                    n.burp && y.onKeyPress("b", ()=>Lt())
                }
                o(gr, "initEvents"),
                    pr(),
                    gr();
                let Ze = {
                    VERSION: zi,
                    loadRoot: Te,
                    loadProgress: $,
                    loadSprite: Ye,
                    loadSpriteAtlas: Ot,
                    loadSound: dn,
                    loadBitmapFont: an,
                    loadFont: st,
                    loadShader: hn,
                    loadShaderURL: ln,
                    loadAseprite: cn,
                    loadPedit: un,
                    loadBean: fn,
                    loadJSON: ye,
                    load: Ae,
                    getSprite: Pt,
                    getSound: Dt,
                    getFont: Mt,
                    getBitmapFont: Gt,
                    getShader: Bt,
                    getAsset: mn,
                    Asset: ve,
                    SpriteData: K,
                    SoundData: Q,
                    width: we,
                    height: xe,
                    center: zt,
                    dt: Me,
                    time: y.time,
                    screenshot: y.screenshot,
                    record: ti,
                    isFocused: ni,
                    setCursor: y.setCursor,
                    getCursor: y.getCursor,
                    setCursorLocked: y.setCursorLocked,
                    isCursorLocked: y.isCursorLocked,
                    setFullscreen: y.setFullscreen,
                    isFullscreen: y.isFullscreen,
                    isTouchscreen: y.isTouchscreen,
                    onLoad: On,
                    onLoading: mi,
                    onResize: pi,
                    onGamepadConnect: y.onGamepadConnect,
                    onGamepadDisconnect: y.onGamepadDisconnect,
                    onError: gi,
                    onCleanup: bi,
                    camPos: ss,
                    camScale: is,
                    camRot: os,
                    shake: as,
                    toScreen: sr,
                    toWorld: ir,
                    setGravity: ws,
                    getGravity: bs,
                    setBackground: vs,
                    getBackground: ys,
                    getGamepads: y.getGamepads,
                    add: gt,
                    make: En,
                    destroy: ri,
                    destroyAll: ii,
                    get: Rn,
                    readd: si,
                    pos: qt,
                    scale: $t,
                    rotate: xs,
                    color: Us,
                    opacity: Es,
                    anchor: Cn,
                    area: Rs,
                    sprite: An,
                    text: Ps,
                    polygon: Ds,
                    rect: Ms,
                    circle: Bs,
                    uvquad: Gs,
                    outline: Fs,
                    body: Vs,
                    doubleJump: _s,
                    shader: ks,
                    timer: Tn,
                    fixed: Ns,
                    stay: ar,
                    health: js,
                    lifespan: Hs,
                    z: Ss,
                    move: As,
                    offscreen: Os,
                    follow: Cs,
                    state: qs,
                    fadeIn: $s,
                    mask: zs,
                    drawon: Ks,
                    tile: hr,
                    agent: ei,
                    on: ze,
                    onUpdate: us,
                    onDraw: cs,
                    onAdd: Sn,
                    onDestroy: or,
                    onClick: fs,
                    onCollide: hs,
                    onCollideUpdate: ls,
                    onCollideEnd: ds,
                    onHover: ms,
                    onHoverUpdate: ps,
                    onHoverEnd: gs,
                    onKeyDown: y.onKeyDown,
                    onKeyPress: y.onKeyPress,
                    onKeyPressRepeat: y.onKeyPressRepeat,
                    onKeyRelease: y.onKeyRelease,
                    onMouseDown: y.onMouseDown,
                    onMousePress: y.onMousePress,
                    onMouseRelease: y.onMouseRelease,
                    onMouseMove: y.onMouseMove,
                    onCharInput: y.onCharInput,
                    onTouchStart: y.onTouchStart,
                    onTouchMove: y.onTouchMove,
                    onTouchEnd: y.onTouchEnd,
                    onScroll: y.onScroll,
                    onHide: y.onHide,
                    onShow: y.onShow,
                    onGamepadButtonDown: y.onGamepadButtonDown,
                    onGamepadButtonPress: y.onGamepadButtonPress,
                    onGamepadButtonRelease: y.onGamepadButtonRelease,
                    onGamepadStick: y.onGamepadStick,
                    mousePos: Nt,
                    mouseDeltaPos: y.mouseDeltaPos,
                    isKeyDown: y.isKeyDown,
                    isKeyPressed: y.isKeyPressed,
                    isKeyPressedRepeat: y.isKeyPressedRepeat,
                    isKeyReleased: y.isKeyReleased,
                    isMouseDown: y.isMouseDown,
                    isMousePressed: y.isMousePressed,
                    isMouseReleased: y.isMouseReleased,
                    isMouseMoved: y.isMouseMoved,
                    isGamepadButtonPressed: y.isGamepadButtonPressed,
                    isGamepadButtonDown: y.isGamepadButtonDown,
                    isGamepadButtonReleased: y.isGamepadButtonReleased,
                    getGamepadStick: y.getGamepadStick,
                    charInputted: y.charInputted,
                    loop: oi,
                    wait: lr,
                    play: It,
                    volume: wn,
                    burp: Lt,
                    audioCtx: te.ctx,
                    Line: Ie,
                    Rect: de,
                    Circle: yt,
                    Polygon: Ke,
                    Vec2: v,
                    Color: W,
                    Mat4: Ue,
                    Quad: oe,
                    RNG: bt,
                    rand: xt,
                    randi: Vn,
                    randSeed: xr,
                    vec2: T,
                    rgb: J,
                    hsl2rgb: yr,
                    quad: ce,
                    choose: Er,
                    chance: Ur,
                    lerp: Ve,
                    tween: Pn,
                    easings: Ct,
                    map: _e,
                    mapc: vr,
                    wave: Ln,
                    deg2rad: Ge,
                    rad2deg: ot,
                    clamp: Le,
                    testLineLine: it,
                    testRectRect: Sr,
                    testRectLine: Cr,
                    testRectPoint: vt,
                    testCirclePolygon: Or,
                    testLinePoint: Ar,
                    testLineCircle: _n,
                    drawSprite: xn,
                    drawText: nr,
                    formatText: Xe,
                    drawRect: ge,
                    drawLine: l,
                    drawLines: x,
                    drawTriangle: R,
                    drawCircle: L,
                    drawEllipse: he,
                    drawUVQuad: Be,
                    drawPolygon: z,
                    drawFormattedText: Je,
                    drawMasked: $e,
                    drawSubtracted: kt,
                    pushTransform: le,
                    popTransform: ae,
                    pushTranslate: ne,
                    pushScale: He,
                    pushRotate: se,
                    pushMatrix: _t,
                    usePostEffect: Vt,
                    makeCanvas: bn,
                    debug: re,
                    scene: Ys,
                    go: Ws,
                    onSceneLeave: Xs,
                    addLevel: Zs,
                    getData: Js,
                    setData: ur,
                    download: Jt,
                    downloadJSON: Mr,
                    downloadText: Nn,
                    downloadBlob: jn,
                    plug: cr,
                    ASCII_CHARS: Kr,
                    canvas: y.canvas,
                    addKaboom: ci,
                    LEFT: v.LEFT,
                    RIGHT: v.RIGHT,
                    UP: v.UP,
                    DOWN: v.DOWN,
                    RED: W.RED,
                    GREEN: W.GREEN,
                    BLUE: W.BLUE,
                    YELLOW: W.YELLOW,
                    MAGENTA: W.MAGENTA,
                    CYAN: W.CYAN,
                    WHITE: W.WHITE,
                    BLACK: W.BLACK,
                    quit: vi,
                    Event: be,
                    EventHandler: Ne,
                    EventController: ke
                };
                if (n.plugins && n.plugins.forEach(cr),
                n.global !== !1)
                    for (let t in Ze)
                        window[t] = Ze[t];
                return n.focus !== !1 && y.canvas.focus(),
                    Ze
            }
            , "default");
        return Ai(uo);
    }
)();
window.kaboom = kaplay.default
//# sourceMappingURL=kaplay.js.world
