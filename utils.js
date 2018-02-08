const chalk = require("chalk");

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
