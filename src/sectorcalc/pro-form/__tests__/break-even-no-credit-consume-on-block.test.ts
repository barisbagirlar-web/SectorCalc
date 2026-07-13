import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("blocked execution credit safety", () => {
  it("decrements product use only after pass2 and pass3 succeed", () => {
    const routePath = path.join(
      process.cwd(),
      "src/app/api/pro-calculator/execute/route.ts",
    );
    const route = readFileSync(routePath, "utf8");
    const pass2Failure = route.indexOf("if (!pass2.ok)");
    const pass3Failure = route.indexOf("if (!pass3.ok)");
    const decrement = route.indexOf("decrementProductUse");

    expect(pass2Failure).toBeGreaterThan(-1);
    expect(pass3Failure).toBeGreaterThan(pass2Failure);
    expect(decrement).toBeGreaterThan(pass3Failure);
  });
});
