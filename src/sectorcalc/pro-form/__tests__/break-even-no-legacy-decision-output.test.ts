import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("break-even decision output isolation", () => {
  it("uses out_decision_code instead of the legacy generic decision id", () => {
    const formulaPath = path.join(
      process.cwd(),
      "src/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula.ts",
    );
    const formula = readFileSync(formulaPath, "utf8");

    expect(formula).toContain("out_decision_code");
    expect(formula).not.toContain("out_final_decision_state");
  });
});
