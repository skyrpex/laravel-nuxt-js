#!/usr/bin/env node
const _ = require("lodash");
const program = require("commander");
const spawn = require("cross-spawn");
const which = require("npm-which")(__dirname);
const utils = require("../src/utils");
const pkg = require("../package.json");

program
    .version(pkg.version)
    .description("Compiles the application for production deployment")
    .option(
        "-a, --analyze",
        "Launch webpack-bundle-analyzer to optimize your bundles",
    )
    .option("--no-color", "Disable colored output")
    .parse(process.argv);

// Stop the process if the config is not OK.
utils.validateConfig();

const build = spawn(
    which.sync("nuxt"),
    _.filter([
        "build",
        `-c=${utils.configPath}`,
        "--spa",
        program.analyze ? "-a" : "",
        program.color ? "--color" : null,
    ]),
);
utils.pipeStdio(build, "nuxt");
utils.exitOnClose(build);
