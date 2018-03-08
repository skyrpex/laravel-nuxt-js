const path = require("path");
const chalk = require("chalk");
const fs = require("fs-extra");
const utils = require("./utils");

module.exports = function() {
  if (this.options.dev) {
    // Add the special render route for dev mode.
    this.extendRoutes((routes, resolve) => {
      routes.push({
        path: process.env.RENDER_PATH,
        component: resolve(this.options.srcDir, "pages/index.vue"),
      });
    });
  } else {
    this.nuxt.hook("generate:done", async () => {
      // Render the HTML template.
      const { html } = await this.nuxt.renderer.renderRoute("/", { url: "/" });
      fs.writeFileSync(
        path.resolve(this.options.generate.dir, "index.html"),
        html,
      );

      // Render the JSON manifest (useful to render a custom HTML template).
      fs.copySync(
        path.resolve(
          this.options.buildDir,
          "dist/vue-ssr-client-manifest.json",
        ),
        path.resolve(this.options.generate.dir, "vue-ssr-client-manifest.json"),
      );

      // Move the compiled assets to the public directory.
      if (!utils.isUrl(this.options.build.publicPath)) {
        fs.moveSync(
          path.resolve(
            this.options.generate.dir,
            utils.normalizePublicPath(this.options.build.publicPath),
          ),
          path.resolve(
            "public",
            utils.normalizePublicPath(this.options.build.publicPath),
          ),
          {
            overwrite: true,
          },
        );
      } else {
        console.log(
          `${chalk.green(
            `[laravel-nuxt]`,
          )} Looks like you are using a CDN to serve your assets [${
            this.options.build.publicPath
          }]`,
        );
        console.log(
          `${chalk.green(
            `[laravel-nuxt]`,
          )} You should now publish the contents of ${
            this.options.generate.dir
          } there`,
        );
      }
    });
  }
};
