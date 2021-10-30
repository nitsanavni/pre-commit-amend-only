import dotenv from "dotenv";
dotenv.config();
import test from "ava";
import path from "path";
import { GenericContainer } from "testcontainers";

test("hook is installed", async (t) => {
  t.timeout(30000);
  t.plan(1);

  const container = await new GenericContainer("timbru31/node-alpine-git")
    .withBindMount(path.resolve("."), "/test", "ro")
    .withCopyFileToContainer(path.resolve("../hook.sh"), "/hook/hook.sh")
    .withCmd([
      "/bin/sh",
      "-c",
      "cd /test && npx ava --verbose --timeout --serial 2m test.js",
    ])
    .start();

  const stream = await container.logs();

  const result = await new Promise<string>((re, j) =>
    stream
      .on("data", (d) => {
        if (/1 test/m.test(d)) {
          re(String(d));
        }
      })
      .on("error", (d) => j(String(d)))
      .on("end", () => j())
  );

  t.regex(result, /pass/);
});
