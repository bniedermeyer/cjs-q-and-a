let test = require("tape");
let tiny = require("tiny-json-http");
let sandbox = require("@architect/sandbox");
let base = "http://localhost:6666";

let end;
test("Start", async (t) => {
  t.plan(1);
  end = await sandbox.start();
  t.ok(end, "Sandbox started");
});

test("End", (t) => {
  t.plan(1);
  end();
  tiny.get({ url: base }, function win(err, result) {
    if (err) {
      t.equal(err.code, "ECONNREFUSED", "Sandbox succssfully shut down");
    } else {
      t.fail("Sandbox did not shut down");
    }
  });
});
