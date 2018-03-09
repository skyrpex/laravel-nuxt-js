const _ = require("lodash");
const utils = require("./utils");

module.exports = (options = {}) => {
    // Define the property that ./module.js will later check
    // to ensure that the Nuxt config has been modified by
    // this higher level function.
    Object.defineProperty(options, utils.validationSymbol, {
        value: true,
        writable: false,
    });

    // The LARAVEL_URL env variable will be passed on
    // by the laravel-nuxt binaries. If present, we
    // can assume that dev mode is enabled.
    const isDev = process.env.LARAVEL_URL != null;

    return _.flow(
        // Add sensible defaults to the options.
        // These may be changed without breaking the app.
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
        // Force some other options. These are mandatory.
        options =>
            _.mergeWith(
                options,
                {
                    mode: "spa",
                    modules: [require.resolve("./module"), "@nuxtjs/axios"],
                    axios: {
                        proxy: isDev,
                    },
                    proxy: isDev
                        ? [
                              [
                                  // We will proxy every single request to Laravel,
                                  // except for the URL in the RENDER_PATH variable.
                                  // This URL will render the SPA's HTML, allowing
                                  // our Laravel backend to fetch it without further
                                  // redirections and display our website.
                                  //
                                  // This is done because we need Laravel to render
                                  // the HTML from the backend and attach any
                                  // generated cookies, such as laravel_session.
                                  ["**/*", `!${process.env.RENDER_PATH}`],
                                  {
                                      target: process.env.LARAVEL_URL,
                                  },
                              ],
                          ]
                        : null,
                },
                (obj, src) => {
                    if (_.isArray(obj)) {
                        return obj.concat(src);
                    }
                },
            ),
    )(options);
};
