const path = require("path");
const fs = require("fs-extra");

module.exports = function() {
  const publicPath = path.resolve("public" + this.options.build.publicPath);

  fs.removeSync(publicPath);

  if (this.options.dev) {
    this.extendRoutes((routes, resolve) => {
      routes.push({
        path: process.env.RENDER_PATH,
        component: resolve(this.options.srcDir, "pages/index.vue"),
      });
    });
    return;
  }

  this.nuxt.hook("generate:done", async () => {
    const { html } = await this.nuxt.renderer.renderRoute("/", { url: "/" });

    fs.moveSync(
      path.resolve(this.options.generate.dir + this.options.build.publicPath),
      publicPath,
      {
        overwrite: true,
      },
    );

    fs.writeFileSync(path.resolve(publicPath, "index.html"), html);

    fs.removeSync(path.resolve(this.options.generate.dir));
  });
};