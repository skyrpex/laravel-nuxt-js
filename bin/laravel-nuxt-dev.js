#!/usr/bin/env node
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
    .option("--laravel-path [path]", "Path to laravel directory", process.cwd())
    .parse(process.argv);

const NUXT_PORT = parseInt(program.port);
const LARAVEL_PORT = NUXT_PORT + 1;

const renderUrl = new URL(
    program.renderPath,
    `http://${program.hostname}:${NUXT_PORT}`,
);

utils.validateConfig();

let args = [
    which.sync("nuxt"),
    "dev",
    `-c=${utils.configPath}`,
    "--spa",
    `--port=${NUXT_PORT}`,
    `--hostname=${program.hostname}`,
];

if (process.env.NODE_OPTS) {
    args.unshift(process.env.NODE_OPTS);
}

const nuxt = spawn(which.sync("node"), args, {
    env: {
        ...process.env,
        LARAVEL_URL: `http://${program.hostname}:${LARAVEL_PORT}`,
        RENDER_PATH: renderUrl.pathname,
    },
    detached: true,
});

const laravel = spawn(
    "php",
    [
        "artisan",
        "serve",
        `--host=${program.hostname}`,
        `--port=${LARAVEL_PORT}`,
    ],
    {
        cwd: program.laravelPath,
        env: Object.assign({}, process.env, {
            NUXT_URL: renderUrl,
            APP_URL: `http://${program.hostname}:${NUXT_PORT}`,
        }),
        detached: true,
    },
);

utils.pipeStdio(nuxt, "nuxt");
utils.pipeStdio(laravel, "laravel");

const cleanUp = () => {
    utils.kill(nuxt);
    utils.kill(laravel);
};
utils.exitOnClose([nuxt, laravel], cleanUp);
ON_DEATH(() => {
    cleanUp();
});
