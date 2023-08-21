const path = require("path");
const fs = require("fs-extra");

module.exports = async function (dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath)); // 先确保文件所在的目录是存在的
    fs.writeFileSync(filePath, files[name]);
  });
};
