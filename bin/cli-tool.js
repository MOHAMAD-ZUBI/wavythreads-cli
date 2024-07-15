#!/usr/bin/env node

const { program } = require("commander");
const setup = require("../lib/setup");

program
  .command("init")
  .description("Initialize a new project")
  .action(() => {
    setup.run();
  });

program.parse(process.argv);
