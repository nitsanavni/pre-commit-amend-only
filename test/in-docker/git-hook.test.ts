import test from "ava";
import { $, cd, nothrow } from "zx";
import * as fc from "fast-check";

$.verbose = false;

test("property-based", async (t) => {
  t.timeout(30000);

  await t.notThrowsAsync(
    fc.assert(
      fc.asyncProperty(fc.boolean(), async (doInstallHook) => {
        const { stdout: path } = await $`mktemp -d`;

        await $`mkdir -p ${path}`;

        cd(path);

        await $`git init`;
        await $`git config --local user.name "John Doe"`;
        await $`git config --local user.email johndoe@example.com`;
        if (doInstallHook) {
          await $`cp /hook/hook.sh .git/hooks/pre-commit`;
        }
        await $`echo hello > file`;
        await $`git add .`;

        const { exitCode, stdout, stderr } = await nothrow(
          $`git commit -m my-commit`
        );

        let pass = true;
        if (doInstallHook) {
          pass &&= exitCode == 1;
          pass &&= /start with the end in mind/gm.test(stderr);
          t.regex(stderr, /start with the end in mind/gm);
        } else {
          pass &&= exitCode == 0;
        }

        console.log({ doInstallHook, pass });

        return pass;
      }),
      { numRuns: 2, skipEqualValues: true }
    )
  );
});

test("scaffolding - not a git repository", async (t) => {
  t.regex((await nothrow($`git status`)).stderr, /not a git repository/im);
});

test("non-empty commit", async (t) => {
  t.timeout(30000);
  const { stdout: path } = await $`mktemp -d`;

  await $`mkdir -p ${path}`;

  cd(path);

  await $`git init`;
  await $`git config --local user.name "John Doe"`;
  await $`git config --local user.email johndoe@example.com`;
  await $`cp /hook/hook.sh .git/hooks/pre-commit`;
  await $`echo hello > file`;
  await $`git add .`;

  // attempt to commit
  const { exitCode, stdout } = await nothrow($`git commit -m my-commit`);

  // but stopped by hook
  t.is(exitCode, 1);
  t.regex(stdout, /start with the end in mind/);
});
