const path = require("path");

const Creator = require("./Creator");
const { getPromptModules } = require("./util/createTools");

/**
 * 创建项目
 *
 * @param {*} projectName 项目名称
 */
async function create(projectName, options) {
  debugger
  const cwd = options.cwd || process.cwd(); // 获取当前工作目录
  const name = projectName; // 项目名称
  const targetDir = path.resolve(cwd, name);

  // TODO: 校验projectName

  // 获取要弹出的选项
  const promptModules = getPromptModules();
  const creator = new Creator(name, targetDir, promptModules);
  creator.create();
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.log(err);
  });
};
