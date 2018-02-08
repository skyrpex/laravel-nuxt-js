#!/usr/bin/env node
const path = require("path");
const program = require("commander");
const spawn = require("cross-spawn");
const which = require("npm-which")(__dirname);
const pkg = require("../package.json");

program
  .version(pkg.version)
  .description('Compiles the application for production deployment')
  .option("-a, --analyze", "Launch webpack-bundle-analyzer to optimize your bundles")
  .parse(process.argv);

const build = spawn.sync(which.sync("nuxt"), [
  "build",
  "--spa",
  program.analyze ? "-a" : "",
], {
  stdio: "inherit",
});

process.exit(build.status);
