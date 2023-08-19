const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const globby = require("globby");
const slash = require("slash");

let source = path.join(__dirname, "template");
(async function () {
  const _files = await globby(["**/*"], { cwd: source });
  let files = {};
  for (const rawPath of _files) {
    const sourcePath = slash(path.resolve(source, rawPath));
    const template = fs.readFileSync(sourcePath, "utf8");
    const content = ejs.render(template, {
      rootOptions: { vueVersion: "2" },
    });
    files[sourcePath] = content;
  }
  console.log(files);
})();
