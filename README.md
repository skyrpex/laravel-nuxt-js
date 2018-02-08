# Laravel Nuxt JS

This package allows you to build a SPA with [Laravel](https://laravel.com/) and [Nuxt](https://nuxtjs.org/).

## Installation

```bash
npm install laravel-nuxt
```

> **Attention!** You must install the [laravel-nuxt](https://github.com/skyrpex/laravel-nuxt) PHP package first.

## Getting Started

> Optionally, you will want to [get rid of the default Laravel scaffolding](### Getting rid of the default Laravel scaffolding).

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

Starts both Nuxt and Laravel artisan dev servers in development mode (hot-code reloading, error reporting, etc).

### Production

```bash
laravel-nuxt build
```

Compiles the application for production deployment.

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
