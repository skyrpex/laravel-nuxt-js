const path = require("path");
const spawn = require("cross-spawn");

module.exports.installSelf = cwd =>
  spawn.sync(
    "npm",
    [
      "install",
      "--no-package-lock",
      path.resolve(__dirname, ".."),
      "nuxt",
      "@nuxtjs/axios",
      "@nuxtjs/proxy",
    ],
    {
      cwd,
    },
  );
