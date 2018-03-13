#!/usr/bin/env node
const _ = require("lodash");
const { URL } = require("url");
const ON_DEATH = require("death");
const spawn = require("cross-spawn");
const program = require("commander");
const which = require("npm-which")(__dirname);
const utils = require("../src/utils");
const pkg = require("../package.json");

program
    .version(pkg.version)
    .description(
        "Starts the application in development mode (hot-code reloading, error reporting, etc)",
    )
    .option(
        "-p, --port [port]",
        "A port number on which to start the application",
        8000,
    )
    .option(
        "-H, --hostname [hostname]",
        "Hostname on which to start the application",
        "127.0.0.1",
    )
    .option(
        "--render-path [path]",
        "URL path used to render the SPA",
        "/__laravel_nuxt__",
    )
    .option("--no-color", "Disable colored output")
    .parse(process.argv);

// TODO Allow passing both ports.
const NUXT_PORT = parseInt(program.port);
const LARAVEL_PORT = NUXT_PORT + 1;

// The URL that will actually render the SPA HTML
// without proxying to the Laravel backend.
const renderUrl = new URL(
    program.renderPath,
    `http://${program.hostname}:${NUXT_PORT}`,
);

// Stop the process if the config is not OK.
utils.validateConfig();

const nuxt = spawn(
    which.sync("nuxt"),
    _.filter([
        "dev",
        `-c=${utils.configPath}`,
        "--spa",
        `--port=${NUXT_PORT}`,
        `--hostname=${program.hostname}`,
        program.color ? "--color" : null,
    ]),
    {
        env: {
            ...process.env,
            // All of the requests will be proxied to Laravel...
            LARAVEL_URL: `http://${program.hostname}:${LARAVEL_PORT}`,
            // ...except for this one, which will actually render.
            RENDER_PATH: renderUrl.pathname,
        },
    },
);
utils.pipeStdio(nuxt, "nuxt");
utils.exitOnClose(nuxt);

const laravel = spawn(
    "php",
    _.filter([
        "artisan",
        "serve",
        `--host=${program.hostname}`,
        `--port=${LARAVEL_PORT}`,
        program.color ? "--ansi" : null,
    ]),
    {
        env: {
            ...process.env,
            // The Laravel's NuxtController will
            // fetch the SPA's HTML from this URL.
            NUXT_URL: renderUrl,
            APP_URL: `http://${program.hostname}:${NUXT_PORT}`,
        },
    },
);
utils.pipeStdio(laravel, "laravel");
utils.exitOnClose(laravel);

// Ensure that both child processes are killed at the end.
ON_DEATH(() => {
    nuxt.kill();
    laravel.kill();
});
