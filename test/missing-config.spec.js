const tmp = require("tmp");
const test = require("ava");
const path = require("path");
const fs = require("fs-extra");
const spawn = require("cross-spawn");
const { installSelf } = require("./utils");

const baseDir = tmp.dirSync({
  unsafeCleanup: true,
}).name;
fs.copySync(path.resolve(__dirname, "stubs/missing_config"), baseDir);
installSelf(baseDir);

test("should fail if no config is present", t => {
  const { status } = spawn.sync("npm", ["run", "build"], {
    cwd: baseDir,
  });

  t.true(status !== 0);
});
