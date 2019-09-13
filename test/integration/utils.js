const spawn = require('cross-spawn')

module.exports.installSelf = cwd => {
  spawn.sync('yarn', ['link'])

  spawn.sync(
    'yarn',
    ['link', 'laravel-nuxt'],
    {
      cwd
    }
  )
}
