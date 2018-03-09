#!/usr/bin/env node
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
    .parse(process.argv);

utils.validateConfig();

const build = spawn.sync(
    which.sync("nuxt"),
    ["build", `-c=${utils.configPath}`, "--spa", program.analyze ? "-a" : ""],
    {
        stdio: "inherit",
    },
);

process.exit(build.status);
