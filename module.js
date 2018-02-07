const path = require('path')
const fs = require('fs-extra')

module.exports = function () {
  if (this.options.dev) {
    return
  }

  const publicPath = path.resolve('public' + this.options.build.publicPath)

  this.nuxt.hook('generate:done', async () => {
    const { html } = await this.nuxt.renderer.renderRoute('/', { url: '/' })

    fs.moveSync(path.resolve(this.options.generate.dir + this.options.build.publicPath), publicPath, {
      overwrite: true,
    });

    fs.writeFileSync(path.resolve(publicPath, 'index.html'), html)

    fs.removeSync(path.resolve(this.options.generate.dir))
  })
};
