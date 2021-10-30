import test from "ava";
import { $ } from "zx";

test("hook is installed", async (t) => {
  t.regex((await $`git --version`).stdout, /git version 2\.\d{2}\.\d{1,2}/);
});
