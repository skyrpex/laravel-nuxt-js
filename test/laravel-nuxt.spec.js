const test = require("ava");
const laravelNuxt = require("../src");

test("should concatenate modules", t => {
    const config = laravelNuxt({
        modules: ["acme_module"],
    });
    t.true(config.modules.indexOf("acme_module") !== -1);
});
