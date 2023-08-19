// ora主要用来实现node.js命令行环境的loading效果，和显示各种状态的图标等
const ora = require("ora");
const spinner = ora();

exports.logWithSpinner = (msg) => {
  spinner.text = msg;
  spinner.start();
};

exports.stopSpinner = () => {
  spinner.stop();
};

exports.logWithSpinner("npm install");
setTimeout(() => {
  exports.stopSpinner();
}, 3000);
