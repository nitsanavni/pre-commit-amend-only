import test from "ava";

test("promise", async (t) => {
  t.plan(1);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  t.pass("hello");
});
