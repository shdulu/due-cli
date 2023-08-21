const inquirer = require("inquirer");
const cloneDeep = require("lodash.clonedeep");
const { chalk, execa } = require("due-cli-shared-utils");
const { defaults } = require("./options");
const PromptModuleAPI = require("./PromptModuleAPI");
const writeFileTree = require("./util/writeFileTree");

// 是否手工模式
const isManualMode = (answers) => answers.preset === "__manual__";

module.exports = class Creator {
  constructor(name, context, promptModules) {
    this.name = name;
    this.context = context;
    this.promptModules = promptModules;
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts();
    this.presetPrompt = presetPrompt;
    this.featurePrompt = featurePrompt;
    this.injectedPrompts = [];
    this.promptCompleteCbs = [];

    this.run = this.run.bind(this);
    const promptAPI = new PromptModuleAPI(this);
    promptModules.forEach((m) => m(promptAPI));
  }

  run(command, args) {
    // 在context 目录下执行命令
    return execa(command, args, { cwd: this.context });
  }
  async create() {
    const { name, context } = this;
    let preset = await this.promptAndResolvePreset();
    console.log(preset);
    preset = cloneDeep(preset);
    // @vue/cli-service是核心包，自带webpack配置以及build serve 等命令
    preset.plugins["@vue/cli-service"] = Object.assign(
      { projectName: name },
      preset
    );
    console.log(`✨  Creating project in ${chalk.yellow(context)}.`);
    const pkg = {
      name,
      version: "0.1.0",
      private: true,
      devDependencies: {},
    };
    const deps = Object.keys(preset.plugins);
    deps.forEach((dep) => {
      pkg.devDependencies[dep] = "latest"; // getVersion
    });
    // 写入package.json
    await writeFileTree(context, {
      "package.json": JSON.stringify(pkg, null, 2),
    });
    // 初始化git仓库
    console.log(`🗃  Initializing git repository...`);
    await this.run("git init");
    // install plugins
    console.log(
      `⚙\u{fe0f}  Installing CLI plugins. This might take a while...`
    );
    await this.run("npm install"); // 安装依赖的模块
    // run generator
    console.log(`🚀  Invoking generators...`)
  }
  async resolvePreset(name) {
    return this.getPresets()[name];
  }
  async promptAndResolvePreset() {
    let answers = await inquirer.prompt(this.resolveFinalPrompts());
    let preset;
    if (answers.preset && answers.preset !== "__manual__") {
      preset = await this.resolvePreset(answers.preset);
    } else {
      preset = {
        plugins: {},
      };
      answers.features = answers.features || [];
      this.promptCompleteCbs.forEach((cb) => cb(answers, preset));
    }
    return preset;
  }
  resolveFinalPrompts() {
    this.injectedPrompts.forEach((prompt) => {
      let originWhen = prompt.when || (() => true);
      prompt.when = (answers) => {
        // 如果手工模式且answers有vueVersion特性才会弹出
        return isManualMode(answers) && originWhen(answers);
      };
    });
    let prompts = [
      this.presetPrompt, // 预设
      this.featurePrompt, // 选特性
      ...this.injectedPrompts, // 不同的promptModule 插入的选项
    ];
    return prompts;
  }
  resolveIntroPrompts() {
    const presets = this.getPresets();
    const presetChoices = Object.entries(presets).map(([name, preset]) => {
      let displayName = name;
      if (name === "default") {
        displayName = "Default";
      } else if (name === "__default_vue_3__") {
        displayName = "Default (Vue 3)";
      }

      return {
        name: `${displayName}`,
        value: name,
      };
    });
    const presetPrompt = {
      name: "preset",
      type: "list",
      message: `Please pick a preset:`,
      choices: [
        ...presetChoices,
        {
          name: "Manually select features",
          value: "__manual__",
        },
      ],
    };
    const featurePrompt = {
      name: "features",
      when: isManualMode,
      type: "checkbox",
      message: "Check the features needed for your project:",
      choices: [],
      pageSize: 10,
    };
    return {
      presetPrompt,
      featurePrompt,
    };
  }
  getPresets() {
    return Object.assign({}, defaults.presets);
  }
};
