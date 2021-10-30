import test from "ava";
import { $, cd, nothrow } from "zx";

test("scaffolding - not a git repository", async (t) => {
  t.regex((await nothrow($`git status`)).stderr, /not a git repository/im);
});

test("git init", async (t) => {
  const { stdout: path } = await $`mktemp -d`;

  await $`mkdir -p ${path}`;

  cd(path);

  await $`git init`;
  await $`git config --local user.name "John Doe"`;
  await $`git config --local user.email johndoe@example.com`;
  await $`cp /hook/hook.sh .git/hooks/pre-commit`;
  // await $`chmod +x .git/hooks/pre-commit`;
  await $`echo hello > file`;
  await $`git add .`;
  t.is((await $`git commit -m my-commit`).exitCode, 0);
});
