import dotenv from "dotenv";
dotenv.config();
import test, { beforeEach } from "ava";
import { $ } from "zx";

import { buildImage } from "./build-image";
import { runInContainer } from "./run-in-container";

type Context = {
  run: (arg: { cmd: string[] }) => Promise<string>;
};

beforeEach(async (t) => {
  // note this reuses docker's cache so it shouldn't be too bad
  const container = await buildImage();

  (t.context as Context).run = ({ cmd }: { cmd: string[] }) =>
    runInContainer({ container, cmd });
});

test("custom image supports `ps -ocommand`", async (t) => {
  t.timeout(50000);
  t.plan(1);

  const stdout = await (t.context as Context).run({ cmd: ["ps", "-ocommand"] });

  t.regex(stdout, /ps -ocommand/m);
});

test("custom image supports `grep -e PATTERN`", async (t) => {
  t.timeout(50000);
  const run = (t.context as Context).run;

  t.regex(
    await run({
      cmd: ["/bin/sh", "-c", "echo hello | grep -e hello"],
    }),
    /hello/m
  );
});

test("host supports `grep -e PATTERN`", async (t) => {
  t.regex((await $`/bin/sh -c "echo hello | grep -e hello"`).stdout, /hello/m);
});
