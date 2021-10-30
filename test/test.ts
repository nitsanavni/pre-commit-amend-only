import test from "ava";
import { $, nothrow } from "zx";

test("scaffolding - not a git repository", async (t) => {
  t.regex((await nothrow($`git status`)).stderr, /not a git repository/im);
});


