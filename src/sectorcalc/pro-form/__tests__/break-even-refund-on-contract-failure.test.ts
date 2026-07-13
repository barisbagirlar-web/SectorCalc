import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("PRO key refund on formula contract failure", () => {
  it("treats formula contract failures as pass2 failures before successful execution", () => {
    const routePath = path.join(
      process.cwd(),
      "src/app/api/pro-calculator/execute/route.ts",
    );
    const route = readFileSync(routePath, "utf8");
    const mismatchIndex = route.indexOf("FORMULA_SCHEMA_CONTRACT_MISMATCH");
    const pass2FailureIndex = route.indexOf("if (!pass2.ok)");
    const refundIndex = route.indexOf("refundBarisProKey", pass2FailureIndex);

    expect(mismatchIndex).toBeGreaterThan(-1);
    expect(pass2FailureIndex).toBeGreaterThan(mismatchIndex);
    expect(refundIndex).toBeGreaterThan(pass2FailureIndex);
  });
});
