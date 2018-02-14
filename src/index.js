const _ = require("lodash");
const utils = require("./utils");

module.exports = (options = {}) => {
  Object.defineProperty(options, utils.validationSymbol, {
    value: true,
    writable: false,
  });

  return _.flow(
    options =>
      _.defaultsDeep(options, {
        srcDir: "resources/nuxt",
        generate: {
          dir: "storage/app/nuxt",
        },
        axios: {
          baseURL: "/",
        },
      }),
    options =>
      _.merge(options, {
        mode: "spa",
        modules: [require.resolve("./module"), "@nuxtjs/axios"],
        axios: {
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
      }),
  )(options);
};
