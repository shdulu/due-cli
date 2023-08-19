// const { formatFeatures } = require('./util/features')
const inquirer = require("inquirer");
const { defaults } = require("./options");
const PromptModuleAPI = require("./PromptModuleAPI");

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

    const promptAPI = new PromptModuleAPI(this);
    promptModules.forEach((m) => m(promptAPI));
  }
  async create() {
    let preset = await this.promptAndResolvePresets();
    console.log(preset);
  }
  async promptAndResolvePresets() {
    let answers = await inquirer.prompt(this.resolveFinalPrompts());
    return answers;
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
