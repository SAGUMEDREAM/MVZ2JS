export class MixinClass {
    Class;
    constructor(Class) {
        this.Class = Class;
    }
    // location：@HRAD 或 @TAIL
    inject(field, location, fn) {
        let isStatic = this.isStatic(field);
        let target = isStatic ? this.Class : this.Class.prototype;
        let originalMethod = target[field];

        if (location === '@HEAD') {
            if (isStatic) {
                this.Class[field] = function(...args) {
                    fn.call(this, ...args);
                    return originalMethod.call(this, ...args);
                };
            } else {
                this.Class.prototype[field] = function(...args) {
                    fn.call(this, ...args);
                    return originalMethod.call(this, ...args);
                };
            }
        } else if (location === '@TAIL') {
            if (isStatic) {
                this.Class[field] = function(...args) {
                    const result = originalMethod.call(this, ...args);
                    fn.call(this, ...args);
                    return result;
                };
            } else {
                this.Class.prototype[field] = function(...args) {
                    const result = originalMethod.call(this, ...args);
                    fn.call(this, ...args);
                    return result;
                };
            }
        }
        return this;
    }

    // 覆盖一个方法
    overwrite(field, fn) {
        if (this.isStatic(field)) {
            this.Class[field] = fn.bind(this.Class);
        } else {
            this.Class.prototype[field] = fn.bind(this.Class.prototype);
        }
        return this;
    }

    // 修改一个变量
    modifyVariable(field, value) {
        if (this.isStatic(field)) {
            this.Class[field] = value;
        } else {
            this.Class.prototype[field] = value;
        }
        return this;
    }

    // 拦截某个函数中的特定代码段
    // location：@BEFORE 或 @AFTER
    intercept(field, location, targetCode, fn) {
        const isStatic = this.isStatic(field);
        const target = isStatic ? this.Class : this.Class.prototype;
        const originalMethod = target[field];

        let modifiedFunction;

        if (location === '@BEFORE') {
            modifiedFunction = function(...args) {
                const originalFunctionStr = originalMethod.toString();
                const targetStrIndex = originalFunctionStr.indexOf(targetCode);
                if (targetStrIndex === -1) {
                    throw new Error(`Target code "${targetCode}" not found in function "${field}".`);
                }

                const beforeCode = fn.toString(); // Assuming fn is already a function
                const modifiedFunctionStr = (
                    originalFunctionStr.slice(0, targetStrIndex) +
                    beforeCode +
                    '\n' +
                    originalFunctionStr.slice(targetStrIndex)
                );

                const modifiedFunction = new Function('return ' + modifiedFunctionStr)();
                return modifiedFunction.apply(this, args);
            };
        } else if (location === '@AFTER') {
            modifiedFunction = function(...args) {
                const originalFunctionStr = originalMethod.toString();
                const targetStrIndex = originalFunctionStr.indexOf(targetCode);
                if (targetStrIndex === -1) {
                    throw new Error(`Target code "${targetCode}" not found in function "${field}".`);
                }

                const afterCode = fn.toString(); // Assuming fn is already a function
                const modifiedFunctionStr = (
                    originalFunctionStr.slice(0, targetStrIndex + targetCode.length) +
                    '\n' +
                    afterCode +
                    originalFunctionStr.slice(targetStrIndex + targetCode.length)
                );

                const modifiedFunction = new Function('return ' + modifiedFunctionStr)();
                return modifiedFunction.apply(this, args);
            };
        } else {
            throw new Error(`Invalid location "${location}" specified for intercept.`);
        }

        if (isStatic) {
            target[field] = modifiedFunction;
        } else {
            target[field] = modifiedFunction;
        }

        return this;
    }


    // 拦截并修改函数的返回值
    // 可见前返回变量为 (f) 示例：function(originalResult) {return originalResult + 10;});
    setReturnValue(field, fn) {
        const isStatic = this.isStatic(field);
        const target = isStatic ? this.Class : this.Class.prototype;
        const originalMethod = target[field];

        const proxyFunction = function(...args) {
            const originalResult = originalMethod.apply(this, args);
            const modifiedResult = fn.call(this, originalResult, ...args);
            return modifiedResult;
        };

        if (isStatic) {
            target[field] = function(...args) {
                return proxyFunction.apply(this, args);
            };
        } else {
            target[field] = function(...args) {
                return proxyFunction.apply(this, args);
            };
        }

        return this;
    }

    // 判断是否是static
    isStatic(field) {
        return this.Class.hasOwnProperty(field);
    }

    // 创建一个Mixin对象
    static create(Class) {
        return new MixinClass(Class);
    }

    // 导入一个方法
    static async getClass(classString) {
        let [packageName, className] = classString.split(" -> ");
        try {
            const packageModule = await import(packageName);
            const Class = packageModule[className];

            if (Class) {
                return Class;
            } else {
                throw new Error(`Class "${className}" not found in package "${packageName}".`);
            }
        } catch (error) {
            console.error('Error loading class:', error);
            throw error;
        }
    }

}
