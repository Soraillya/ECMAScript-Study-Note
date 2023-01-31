/**
 * 手写 Promise
 * 先了解 Promise 的使用，再逆向手写出 Promise
 */

// Promise 的使用
// const p = new Promise((resolve, reject) => {
//     let status = confirm("Promise是否成功？");
//     if (status) {
//         resolve("Comfirm Success!!!");
//     } else {
//         reject("Comfirm Error!!!");
//     }
// });

// p.then((result) => {
//     console.log(result);
// })
//     .catch((error) => {
//         console.log(error);
//     })
//     .finally(() => {});

class MyPromise {
    static PENDING = "PENDING";
    static FULLFILLED = "FULLFILLED";
    static REJECTED = "REJECTED";
    constructor(executor) {
        this.status = MyPromise.PENDING;
        this.result = null;
        this.resolveCallbacks = [];
        this.rejectCallbacks = [];

        // 写法一：使用构造函数外部的 resolve 和 reject，需使用 bind 绑定 this 的指向
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error);
        }

        // 写法二：不使用 bind 绑定，则在 constructor 内部定义 resolve 和 reject 函数
        // let that = this;
        // function resolve(result) {
        //     that.status = MyPromise.FULLFILLED;
        //     that.result = result;
        // }
        // function reject(error) {
        //     that.status = MyPromise.REJECTED;
        //     that.error = error;
        // }
        // executor(resolve, reject);
    }

    // 写法一
    resolve(result) {
        console.log("resolve 加入宏任务");
        // 加入宏任务队列
        setTimeout(() => {
            // PENDING 状态 (不可缺少)
            console.log("-- resolve: 判断status");
            if (this.status === MyPromise.PENDING) {
                console.log("-- status === PENDING");
                this.status = MyPromise.FULLFILLED;
                this.result = result;
                console.log("-- 开始执行队列中的回调函数 (可能存在多个then)");
                this.resolveCallbacks.forEach((callback) => callback());
                console.log("-- 结束执行队列中的回调函数");
            }
        });
    }
    reject(result) {
        // 加入宏任务队列
        setTimeout(() => {
            // PENDING 状态 (不可缺少)
            console.log("-- reject: 判断status");
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.REJECTED;
                this.result = result;
                this.rejectCallbacks.forEach((callback) => callback(result));
            }
        });
    }

    // 此处要为 then 中的 onFULLFILLED 和 onREJECTED 加入宏任务队列实现异步
    then(onFULLFILLED, onREJECTED) {
        // 执行 then 最终返回新的 Promise 实例对象
        return new MyPromise((resolve, reject) => {
            // 传入的函数进行严格判断
            onFULLFILLED = typeof onFULLFILLED === "function" ? onFULLFILLED : (result) => result;
            onREJECTED =
                typeof onREJECTED === "function"
                    ? onREJECTED
                    : (result) => {
                          throw result;
                      };

            // PENDING 状态 (不可缺少)
            // 将 resolve 和 reject 回调函数以宏任务形式放入栈中
            if (this.status === MyPromise.PENDING) {
                console.log("将 resolve 和 reject 回调函数放入栈中");
                this.resolveCallbacks.push(() => {
                    setTimeout(() => {
                        onFULLFILLED(this.result);
                    });
                });
                this.rejectCallbacks.push(() => {
                    setTimeout(() => {
                        onREJECTED(this.result);
                    });
                });
            }

            // FULLFILLED 状态 (不可缺少)
            if (this.status === MyPromise.FULLFILLED) {
                // 加入宏任务队列
                setTimeout(() => {
                    try {
                        console.log("-- -- onFULLFILLED");
                        onFULLFILLED(this.result);
                    } catch (e) {
                        throw e;
                    }
                });
            }

            // REJECTED 状态 (不可缺少)
            if (this.status === MyPromise.REJECTED) {
                // 加入宏任务队列
                setTimeout(() => {
                    console.log("-- -- onREJECTED");
                    onREJECTED(this.result);
                });
            }
        });
    }
    // 以下未完善
    catch(func) {
        func = typeof func === "function" ? func : () => {};
        if (this.status === MyPromise.REJECTED) {
            console.log(MyPromise.REJECTED);
            func(this.result);
        }
        return this;
    }
    // 以下未完善
    finally(func) {
        func = typeof func === "function" ? func : () => {};
        func();
    }
}

console.log("第一步，创建MyPromise对象的实例mp");
const mp = new MyPromise((resolve, reject) => {
    console.log("mp函数内部");
    let status = confirm("Promise是否成功？");
    if (status) {
        console.log("resolve前");
        resolve("Comfirm Success!!!");
        console.log("resolve后");
    } else {
        reject("Comfirm Error!!!");
    }
});

console.log("第二步，执行 mp 中的 then 方法，再接上 catch 以及 finally 方法");

mp.then(
    (result) => {
        console.log("then onFULLFILLED:", result);
    },
    (error) => {
        console.log("then onREJECTED:", error);
    }
);
mp.then(
    (result) => {
        console.log("then onFULLFILLED1:", result);
    },
    (error) => {
        console.log("then onREJECTED1:", error);
    }
);
mp.then(
    (result) => {
        console.log("then onFULLFILLED2:", result);
    },
    (error) => {
        console.log("then onREJECTED2:", error);
    }
);

console.log("结束");
// .catch((error) => {
//     console.log("catch:", error);
// })
// .finally(() => {
//     console.log("Finally");
// });
