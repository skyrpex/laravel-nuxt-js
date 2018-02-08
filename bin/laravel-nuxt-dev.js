#!/usr/bin/env node
const spawn = require("cross-spawn");
const program = require("commander");
const which = require("npm-which")(__dirname);
const pkg = require("../package.json");
const { pipeStdio, exitOnClose } = require("../utils");

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
  .parse(process.argv);

const NUXT_PORT = program.port;
const LARAVEL_PORT = NUXT_PORT + 1;

const nuxt = spawn(
  which.sync("nuxt"),
  ["dev", "--spa", `--port=${NUXT_PORT}`, `--hostname=${program.hostname}`],
  {
    env: {
      ...process.env,
      LARAVEL_URL: `http://${program.hostname}:${LARAVEL_PORT}`,
    },
  },
);
pipeStdio(nuxt, "nuxt");
exitOnClose(nuxt);

const laravel = spawn(
  "php",
  ["artisan", "serve", `--host=${program.hostname}`, `--port=${LARAVEL_PORT}`],
  {
    env: {
      ...process.env,
      NUXT_URL: `http://${program.hostname}:${NUXT_PORT}`,
    },
  },
);
pipeStdio(laravel, "laravel");
exitOnClose(nuxt);
