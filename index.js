const _ = require("lodash");

module.exports = (options = {}) =>
  _.defaultsDeep(options, {
    mode: "spa",
    srcDir: "resources/nuxt",
    generate: {
      dir: "storage/app/nuxt",
    },
    modules: [require.resolve("./module"), "@nuxtjs/axios"],
    axios: {
      baseURL: "/",
      proxy: process.env.LARAVEL_URL != null,
    },
    proxy: process.env.LARAVEL_URL
      ? [
          [
            ["**/*", "!/"],
            {
              target: process.env.LARAVEL_URL,
            },
          ],
        ]
      : null,
  });
