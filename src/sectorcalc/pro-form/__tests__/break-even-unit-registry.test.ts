import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { SuperV4Schema } from "../contract-types";
import { normalizeInput, preservePhysicalQuantity } from "../unit-normalizer";

function loadSchema(): SuperV4Schema {
  const schemaPath = path.join(
    process.cwd(),
    "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
  );
  return JSON.parse(readFileSync(schemaPath, "utf8")) as SuperV4Schema;
}

describe("break-even ratio and percent conversion", () => {
  it("normalizes 42 percent to 0.42 ratio", () => {
    const schema = loadSchema();
    const result = normalizeInput(
      "contribution_margin_ratio",
      42,
      "percent",
      "ratio",
      "dimensionless",
      schema.unit_conversion_contract.conversion_registry,
    );

    expect("baseValue" in result).toBe(true);
    if ("baseValue" in result) {
      expect(result.baseValue).toBeCloseTo(0.42, 12);
    }
  });

  it("preserves the physical quantity across percent and ratio changes", () => {
    const schema = loadSchema();
    const toRatio = preservePhysicalQuantity(
      70,
      "percent",
      "ratio",
      "dimensionless",
      schema.unit_conversion_contract.conversion_registry,
    );
    expect("newValue" in toRatio).toBe(true);
    if (!("newValue" in toRatio)) return;
    expect(toRatio.newValue).toBeCloseTo(0.7, 12);

    const backToPercent = preservePhysicalQuantity(
      toRatio.newValue,
      "ratio",
      "percent",
      "dimensionless",
      schema.unit_conversion_contract.conversion_registry,
    );
    expect("newValue" in backToPercent).toBe(true);
    if ("newValue" in backToPercent) {
      expect(backToPercent.newValue).toBeCloseTo(70, 12);
    }
  });
});
