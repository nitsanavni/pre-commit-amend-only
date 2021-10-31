import { Readable } from "stream";

// https://github.com/jasonpincin/stream-to-string/blob/d1e6a27e08c5191fc19557286d6bd0036917a849/index.js
export const toString = (readable: Readable) =>
  new Promise<string>((resolve, reject) => {
    let str = "";
    readable
      .on("data", (d) => (str += String(d)))
      .on("end", () => resolve(str))
      .on("error", reject);
  });
