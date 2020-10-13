# Warning: this project has been deprecated

`laravel-nuxt` was created to offer some sugar when working locally with Laravel+Nuxt, solving some cookie problems in the process. Today, it isn't necessary anymore.

We recommend using [Laravel Sanctum](https://laravel.com/docs/8.x/sanctum), which plays nicely with SPAs (see [Sanctum's SPA Authentication section](https://laravel.com/docs/8.x/sanctum#spa-authentication)). If you can't migrate, just keep using `laravel-nuxt`.

# Laravel Nuxt JS

[![TravisCI Build status](https://travis-ci.org/skyrpex/laravel-nuxt-js.svg?branch=develop)](https://travis-ci.org/skyrpex/laravel-nuxt-js)

This package allows you to build a SPA with [Laravel](https://laravel.com/) and [Nuxt](https://nuxtjs.org/).

> I'm currently very busy so don't expect updates anytime soon. Please, check out [m2sd/nuxt-laravel](https://github.com/m2sd/nuxt-laravel) which is based on this repository but it's more active.

## Installation

```bash
npm install laravel-nuxt
```

> **Attention!** You must install the [laravel-nuxt](https://github.com/skyrpex/laravel-nuxt) PHP package first.

## Getting Started

> Optionally, you will want to [get rid of the default Laravel scaffolding](#getting-rid-of-the-default-laravel-scaffolding).

Add a script to your `package.json` like this:

```json
{
    "scripts": {
        "start": "laravel-nuxt"
    },
}

```

Wrap you `nuxt.config.js`'s export with `laravelNuxt`:

```js
const laravelNuxt = require("laravel-nuxt");

module.exports = laravelNuxt({
  // Your Nuxt options here...
  modules: [],
  plugins: [],

  // Options such as mode, srcDir and generate.dir are already handled for you.
});
```

Populate `resources/nuxt/pages/index.vue` inside your project:

```html
<template>
  <h1>Hello {{ name }}!</h1>
</template>

<script>
export default {
  data: () => {
    return { name: 'world' };
  },
};
</script>
```

And then run:

```bash
npm start
```

Go to http://localhost:8000.

## Commands

### Development

```bash
laravel-nuxt dev
```

Starts both Nuxt and Laravel artisan servers in development mode (hot-module reloading, error reporting, etc).

### Production

```bash
laravel-nuxt build
```

Compiles the application for production deployment.

This command will output the compiled assets in `public/_nuxt`.

### Analysis

```bash
laravel-nuxt build -a
```

Launch `webpack-bundle-analyzer` to optimize your bundles.

## Other

### Getting rid of the default Laravel scaffolding

The default Laravel installation comes with some frontend files which are not needed anymore.

You can remove the following files and directories:

* `resources/assets/`
* `package.json`
* `package-lock.json`
* `webpack.mix.js`
