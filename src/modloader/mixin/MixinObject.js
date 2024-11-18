
export class MixinObject {
    constructor(obj) {
        this.obj = obj;
    }

    // 注入一个方法到对象的方法的头部或尾部
    // location：@HEAD 或 @TAIL
    inject(methodName, location, fn) {
        const originalMethod = this.obj[methodName];

        if (location === '@HEAD') {
            this.obj[methodName] = function(...args) {
                fn.call(this.obj, ...args);
                return originalMethod.call(this.obj, ...args);
            };
        } else if (location === '@TAIL') {
            this.obj[methodName] = function(...args) {
                const result = originalMethod.call(this.obj, ...args);
                fn.call(this.obj, ...args);
                return result;
            };
        }

        return this;
    }

    // 覆盖对象的方法
    overwrite(methodName, fn) {
        this.obj[methodName] = fn.bind(this.obj);
        return this;
    }

    // 修改对象的属性或方法
    modifyProperty(propertyName, value) {
        this.obj[propertyName] = value;
        return this;
    }

    // 拦截对象的方法中的特定代码段
    // location：@BEFORE 或 @AFTER
    intercept(methodName, location, targetCode, fn) {
        const originalMethod = this.obj[methodName];

        let modifiedFunction;

        if (location === '@BEFORE') {
            modifiedFunction = function(...args) {
                fn.call(this.obj, ...args);
                return originalMethod.call(this.obj, ...args);
            }.bind(this);
        } else if (location === '@AFTER') {
            modifiedFunction = function(...args) {
                const result = originalMethod.call(this.obj, ...args);
                fn.call(this.obj, ...args);
                return result;
            }.bind(this);
        } else {
            throw new Error(`Invalid location "${location}" specified for intercept.`);
        }

        this.obj[methodName] = modifiedFunction;
        return this;
    }



    // 拦截并修改对象方法的返回值
    setReturnValue(methodName, fn) {
        const originalMethod = this.obj[methodName];

        const proxyFunction = function(...args) {
            const originalResult = originalMethod.apply(this.obj, args);
            const modifiedResult = fn.call(this.obj, originalResult, ...args);
            return modifiedResult;
        };

        this.obj[methodName] = function(...args) {
            return proxyFunction.apply(this.obj, args);
        };

        return this;
    }

    // 创建一个 Mixin 对象
    static create(obj) {
        return new MixinObject(obj);
    }
}