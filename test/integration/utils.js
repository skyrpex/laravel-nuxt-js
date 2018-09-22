const path = require("path");
const spawn = require("cross-spawn");

module.exports.installSelf = cwd => {
    spawn.sync("npm", ["pack", path.resolve(__dirname, "../..")], {
        cwd,
    });

    spawn.sync(
        "npm",
        ["install", "--no-package-lock", "laravel-nuxt-1.4.7.tgz"],
        {
            cwd,
        },
    );
};
