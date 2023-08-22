const pluginRE = /^@vue\/cli-plugin-/;
function isPlugin(id) {
  return pluginRE.test(id);
}

module.exports = {
  isPlugin,
};
