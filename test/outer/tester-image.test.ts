import dotenv from "dotenv";
dotenv.config();
import test from "ava";
import { GenericContainer } from "testcontainers";

import { toString } from "./readable-to-string";

test("custom image support `ps -ocommand`", async (t) => {
  t.timeout(50000);
  t.plan(1);

  const buildImage = () => GenericContainer.fromDockerfile(".").build();

  const runPs = (container: GenericContainer) =>
    container.withCmd(["ps", "-ocommand"]).start();

  const image = await buildImage();
  const container = await runPs(image);
  const logs = await container.logs();
  // TODO - impl an async `flow`
  const stdout = await toString(logs);

  t.regex(stdout, /ps -ocommand/m);
});
