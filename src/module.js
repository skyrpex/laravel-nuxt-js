const path = require("path");
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

      // Move the compiled assets to the public directory.
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
    });
  }
};
