const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const chalk = require("chalk");

// This string identifier will be used to ensure that
// the Nuxt config is wrapped by our higher-level function.
const validationSymbol = "__laravel_nuxt__";
module.exports.validationSymbol = validationSymbol;

// The path were the Nuxt config should be.
const configPath = path.resolve(process.cwd(), "nuxt.config.js");
module.exports.configPath = configPath;

/**
 * Print all of the data of the given child process to the console.
 *
 * @param {ChildProcess} child
 * @param {string} name
 * @return {void}
 */
module.exports.pipeStdio = (child, name) => {
  const out = data => {
    data
      .toString()
      .trim()
      .split("\n")
      .forEach(text => {
    if (text.length > 0) {
      console.log(`${chalk.gray(`[${name}]`)} ${text}`);
    }
      });
  };

  child.stdout.on("data", out);
  child.stderr.on("data", out);
};

/**
 * Close the main process if the child process exits.
 *
 * @param {ChildProcess} child
 * @return {void}
 */
module.exports.exitOnClose = child => {
  child.on("close", code => {
    process.exit(code);
  });
};

/**
 * Print an error and stop the process if the Nuxt config is not valid.
 */
module.exports.validateConfig = () => {
  if (!fs.existsSync(configPath)) {
    console.error(
      `${chalk.bgRed("ERROR")}: Could not load config file: ${configPath}`,
    );
    process.exit(1);
  }

  const config = require(configPath);

  if (!config.hasOwnProperty(validationSymbol)) {
    console.error(
      `${chalk.bgRed("ERROR")}: You need to wrap your config with ${chalk.gray(
        "laravelNuxt",
      )}.`,
    );
    process.exit(1);
  }
};

/**
 * Check wether the given string is an URL or not.
 *
 * @param {string} url
 */
const isUrl = url => {
  return url.indexOf("http") === 0 || url.indexOf("//") === 0;
};

/**
 * Normalize the given public path, so it works with path.join.
 *
 * @param {string} publicPath
 */
exports.normalizePublicPath = publicPath => {
  return isUrl(publicPath) ? "" : _.trim(publicPath, "/");
};
