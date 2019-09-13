const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')
const spawn = require('cross-spawn')

module.exports.installSelf = cwd => {
  spawn.sync(
    'npm',
    ['install', '--no-package-lock', path.resolve(__dirname, '../..')],
    {
      cwd
    }
  )

  const nodeModulesDir = path.resolve(__dirname, '../../node_modules')
  glob.sync('*', {
    cwd: nodeModulesDir
  }).forEach(packageName =>
    fs.symlinkSync(
      path.resolve(nodeModulesDir, packageName),
      path.resolve(cwd, 'node_modules', packageName)
    )
  )
}
