import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("break-even monthly time basis", () => {
  it("uses monthly obligations, revenue, runway, and report units", () => {
    const schemaPath = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    );
    const schemaText = readFileSync(schemaPath, "utf8");

    expect(schemaText).toContain("Monthly Fixed Cash Cost");
    expect(schemaText).toContain("Monthly Debt Service");
    expect(schemaText).toContain("Current Monthly Revenue");
    expect(schemaText).toContain("Target Survival Months");
    expect(schemaText).not.toContain("Required Annual Revenue");
  });
});
