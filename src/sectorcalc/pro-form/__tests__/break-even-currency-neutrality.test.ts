import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("break-even currency neutrality", () => {
  it("contains no hardcoded currency code in the formula engine", () => {
    const formulaPath = path.join(
      process.cwd(),
      "src/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula.ts",
    );
    const formulaText = readFileSync(formulaPath, "utf8");

    expect(formulaText).not.toMatch(/\bUSD\b|\bEUR\b|\bGBP\b/);
  });
});
