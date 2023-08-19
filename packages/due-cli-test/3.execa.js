// execa 是可以调用 shell 和本地外部程序
// 它会启动子进程执行，是对child_process.exec的封装
const execa = require("execa");

(async () => {
  const { stdout } = await execa("echo", ["hello"]);
  console.log(stdout);
})();
