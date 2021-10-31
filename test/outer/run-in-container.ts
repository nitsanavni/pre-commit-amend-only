import { GenericContainer } from "testcontainers";

import { toString } from "./readable-to-string";

export const runInContainer = async ({
  container,
  cmd,
}: {
  container: GenericContainer;
  cmd: string[];
}): Promise<string> => {
  const started = await container.withCmd(cmd).start();

  return toString(await started.logs());
};
