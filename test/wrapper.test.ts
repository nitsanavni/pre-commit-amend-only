import dotenv from "dotenv";
dotenv.config();
import test from "ava";
import path from "path";
import { GenericContainer, Wait } from "testcontainers";
// import { Promise } from ""

test("hook is installed", async (t) => {
  t.timeout(30000);
  t.plan(1);
  const container = await new GenericContainer("timbru31/node-alpine-git")
    .withBindMount(path.resolve("."), "/test", "ro")
    .withCmd([
      "/bin/sh",
      "-c",
      "cd /test && npx ava --verbose --timeout 2m test.js;",
    ])
    .withWaitStrategy(Wait.forLogMessage(/1 test/))
    .start();

  const strem = await container.logs();

  const result = await new Promise<string>((re, j) =>
    strem
      .on("data", (d) => {
        if (/1 test/m.test(String(d))) {
          re(String(d));
        }
      })
      .on("error", (d) => j(String(d)))
      .on("end", () => j())
  );

  t.regex(result, /pass/);

  return;
});
