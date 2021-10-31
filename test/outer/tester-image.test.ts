import dotenv from "dotenv";
dotenv.config();
import test, { beforeEach } from "ava";
import { GenericContainer } from "testcontainers";
import { $ } from "zx";

import { toString } from "./readable-to-string";

const buildImage = () => GenericContainer.fromDockerfile(".").build();

const run = async ({
  container,
  cmd,
}: {
  container: GenericContainer;
  cmd: string[];
}): Promise<string> => {
  const started = await container.withCmd(cmd).start();

  return toString(await started.logs());
};

type Context = {
  run: (arg: { cmd: string[] }) => Promise<string>;
};

beforeEach(async (t) => {
  // note this reuses docker's cache so it shouldn't be too bad
  const container = await buildImage();

  (t.context as Context).run = ({ cmd }: { cmd: string[] }) =>
    run({ container, cmd });
});

test("custom image supports `ps -ocommand`", async (t) => {
  t.timeout(50000);
  t.plan(1);

  const stdout = await (t.context as Context).run({ cmd: ["ps", "-ocommand"] });

  t.regex(stdout, /ps -ocommand/m);
});

test("custom image supports `grep -e PATTERN`", async (t) => {
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
