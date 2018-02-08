const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const validationSymbol = "_uses_laravel_nuxt_";

const configPath = path.resolve(process.cwd(), "nuxt.config.js");

const normalize = data => data.toString().trim();

module.exports.pipeStdio = (child, name) => {
  child.stdout.on("data", data =>
    console.log(`${chalk.gray(`[${name}]`)} ${normalize(data)}`),
  );
  child.stderr.on("data", data =>
    console.error(`${chalk.gray(`[${name}]`)} ${normalize(data)}`),
  );
};

module.exports.exitOnClose = child => {
  child.on("close", ({ code }) => process.exit(code));
};

module.exports.validationSymbol = validationSymbol;

module.exports.configPath = configPath;

module.exports.validateConfig = () => {
  if (!fs.existsSync(configPath)) {
    console.error(
      `${chalk.bgRed("ERROR")}: Could not load config file: ${configPath}`,
    );
    process.exit(1);
  }

  const config = require(configPath);

  if (!Object.hasOwnProperty(config)) {
    console.error(
      `${chalk.bgRed("ERROR")}: You need to wrap your config with ${chalk.gray(
        "laravelNuxt",
      )}.`,
    );
    process.exit(1);
  }
};
