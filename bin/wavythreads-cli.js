#!/usr/bin/env node

const { program } = require("commander");
const { initProject } = require("../lib/setup");

program
  .command("init <projectName>")
  .description("Initialize a new project")
  .action((projectName) => {
    initProject(projectName);
  });

program.parse(process.argv);
