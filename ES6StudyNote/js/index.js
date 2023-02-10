/**
 * 题目1考察：
 * 1. function 声明函数提升，var 声明不提升
 */
// 先声明后使用
console.log("题目1：");
function fn1_1() {}
var fn1_2 = function () {};
console.log("fn1_1.prototype", fn1_1.prototype); // 构造函数
console.log("fn1_1.__proto__", fn1_1.__proto__); // native code
console.log("fn1_2.prototype", fn1_2.prototype); // 构造函数
console.log("fn1_2.__proto__", fn1_2.__proto__); // native code

console.log("fn1_3.prototype", fn1_3.prototype); // 构造函数
console.log("fn1_3.__proto__", fn1_3.__proto__); // native code
// console.log("fn1_4.prototype", fn1_4.prototype); // undefined error
// console.log("fn1_4.__proto__", fn1_4.__proto__); // undefined error
function fn1_3() {}
var fn1_4 = function () {};
