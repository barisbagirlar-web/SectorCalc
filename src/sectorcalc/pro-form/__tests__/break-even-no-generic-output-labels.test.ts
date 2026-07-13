import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const FORBIDDEN_LABELS = [
  "Maximum Absorbed Overhead",
  "FMEA Trigger Flag",
  "Primary Sensitivity Driver",
  "Required Annual Revenue",
  "Break-Even Multiplier",
];

describe("break-even output labels", () => {
  it("contains only survival-cash domain labels", () => {
    const schemaPath = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    );
    const schemaText = readFileSync(schemaPath, "utf8");

    for (const label of FORBIDDEN_LABELS) {
      expect(schemaText).not.toContain(label);
    }
  });
});
