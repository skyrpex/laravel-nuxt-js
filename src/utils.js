const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const spawn = require("cross-spawn");

const validationSymbol = "__laravel_nuxt__";

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

module.exports.exitOnClose = ([...childs], callback) => {
    childs.forEach(child =>
        child.on("exit", code => {
            callback();
            process.exit(code);
        }),
    );
};

module.exports.kill = child => {
    if (process.platform !== "win32") {
        spawn("sh", ["-c", "kill -INT -" + child.pid]);
    } else {
        child.kill("SIGINT");
    }
};

module.exports.validationSymbol = validationSymbol;

module.exports.configPath = configPath;

module.exports.validateConfig = () => {
    if (!fs.existsSync(configPath)) {
        console.error(
            `${chalk.bgRed(
                "ERROR",
            )}: Could not load config file: ${configPath}`,
        );
        process.exit(1);
    }

    const config = require(configPath);

    if (!config.hasOwnProperty(validationSymbol)) {
        console.error(
            `${chalk.bgRed(
                "ERROR",
            )}: You need to wrap your config with ${chalk.gray(
                "laravelNuxt",
            )}.`,
        );
        process.exit(1);
    }
};
