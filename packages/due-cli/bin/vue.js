#!/usr/bin/env node

const program = require("commander");

program
  .version(`due/cli ${require("../package").version}`)
  .usage("<command> [options]");

program
  .command("create <app-name>")
  .description("create a new project powered by vue-cli-service")
  .action((name, options) => {
    require("../lib/create")(name, options);
  });
program.parse(process.argv);
