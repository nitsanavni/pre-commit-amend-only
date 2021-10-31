import dotenv from "dotenv";
dotenv.config();
import test from "ava";
import path from "path";
import { buildImage } from "./build-image";
import { runInContainer } from "./run-in-container";

test("run tests in docker", async (t) => {
  t.timeout(30000);
  t.plan(1);

  const container = (await buildImage())
    .withBindMount(path.resolve("."), "/test", "ro")
    .withCopyFileToContainer(path.resolve("../hook.sh"), "/hook/hook.sh");

  const cmd = [
    "/bin/sh",
    "-c",
    "cd /test && npx ava --verbose --timeout --serial 2m in-docker/*",
  ];

  const result = await runInContainer({ container, cmd });

  t.regex(result, /2 tests passed/);
});
