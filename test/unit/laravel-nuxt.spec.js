const test = require("ava");
const laravelNuxt = require("../../src");

test("should concatenate modules", t => {
    const config = laravelNuxt({
        modules: ["acme_module"],
    });
    t.true(config.modules.indexOf("acme_module") !== -1);
});

test("should respect srcDir", t => {
    const config = laravelNuxt({
        srcDir: "acme_dir",
    });
    t.true(config.srcDir === "acme_dir");
});
