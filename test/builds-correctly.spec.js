const tmp = require("tmp");
const test = require("ava");
const path = require("path");
const fs = require("fs-extra");
const spawn = require("cross-spawn");
const { installSelf } = require("./utils");

const baseDir = tmp.dirSync({
    unsafeCleanup: true,
}).name;
fs.copySync(path.resolve(__dirname, "stubs/builds_correctly"), baseDir);
installSelf(baseDir);

test("should build correctly", t => {
    const { status, output } = spawn.sync("npm", ["run", "build"], {
        cwd: baseDir,
    });

    t.true(status === 0, output.toString());
    t.true(fs.existsSync(path.resolve(baseDir, "public/_nuxt")));
    t.true(fs.existsSync(path.resolve(baseDir, "storage/app/nuxt/index.html")));
    t.true(
        fs.existsSync(
            path.resolve(
                baseDir,
                "storage/app/nuxt/vue-ssr-client-manifest.json",
            ),
        ),
    );
});
