import test from "ava";
import { $, cd, nothrow } from "zx";

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
