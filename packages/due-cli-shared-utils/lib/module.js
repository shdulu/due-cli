const Module = require("module");
const path = require("path");

 
exports.loadModule = function (request, context) {
  // 创建一个require   
  return Module.createRequire(path.resolve(context, "package.json"))(request);
};
