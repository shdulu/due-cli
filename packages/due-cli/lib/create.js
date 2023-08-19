const path = require("path");

const Creator = require('./Creator')
const { getPromptModules } = require("./util/createTools");

/**
 * 创建项目
 *
 * @param {*} projectName 项目名称
 */
async function create(projectName, options) {
  let cwd = options.cwd || process.cwd(); // 获取当前工作目录
  let name = projectName; // 项目名称
  let targetDir = path.resolve(cwd, name);

  // TODO: 校验projectName

  // 获取要弹出的选项
  let promptModules = getPromptModules();
  const creator = new Creator(name, targetDir, promptModules);
  creator.create()
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.log(err);
  });
};
