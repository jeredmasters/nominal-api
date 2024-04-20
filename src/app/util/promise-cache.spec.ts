import { strictEqual } from "assert";
import { PromiseCache } from "./promise-cache";
import { sleep } from "./rand";

describe("Promise cache", () => {
  it("simple", async () => {
    const cache = new PromiseCache("test", {});

    const result = await cache.call(() => sleep(10, "ASDF"));

    strictEqual(result, "ASDF");
  });

  it("promise merging", async () => {
    const cache = new PromiseCache("test", {});

    const result = await Promise.all([
      cache.call(() => sleep(10, "ASDF1")),
      cache.call(() => sleep(10, "ASDF2")),
    ]);

    strictEqual(result[0], "ASDF1");
    strictEqual(result[1], "ASDF1");
  });
});
