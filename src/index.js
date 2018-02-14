const _ = require("lodash");
const utils = require("./utils");

module.exports = (options = {}) => {
  Object.defineProperty(options, utils.validationSymbol, {
    value: true,
    writable: false,
  });

  return _.defaultsDeep(options, {
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
            ["**/*", `!${process.env.RENDER_PATH}`],
            {
              target: process.env.LARAVEL_URL,
            },
          ],
        ]
      : null,
  });
};
