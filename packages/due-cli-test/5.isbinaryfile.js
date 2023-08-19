// isbinaryfile可以检测一个文件是否是二进制文件
const path = require("path");
const { isBinaryFileSync } = require("isbinaryfile");
// let logo = path.join(__dirname, "template/assets/logo.png");
// let isBinary = isBinaryFileSync(logo);
// console.log(isBinary);
let main = path.join(__dirname, "template/main.js");
isBinary = isBinaryFileSync(main);
console.log(isBinary);
