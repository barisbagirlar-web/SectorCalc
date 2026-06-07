import { describe, expect, test } from "vitest";
import { FORMULA_FAMILIES } from "@/lib/premium-schema/formula-families";
import { listRegisteredFormulaIds } from "@/lib/premium-schema/formula-registry";
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import {
  assertSchemasLintClean,
  lintAllPremiumSchemas,
  lintPremiumCalculatorSchema,
} from "@/lib/premium-schema/schema-linter";
import {
  getPremiumCalculatorSchema,
  PREMIUM_CALCULATOR_SCHEMAS,
} from "@/lib/premium-schema/schema-registry";

describe("schema-linter", () => {
  test("all premium schemas pass lint with zero errors", () => {
    assertSchemasLintClean(PREMIUM_CALCULATOR_SCHEMAS);
  });

  for (const schemaId of [
    "cnc-oee-loss",
    "logistics-route-loss",
    "energy-peak-cost",
    "food-waste-margin-loss",
    "construction-project-overrun",
  ] as const) {
    test(`${schemaId} has valid category and pipeline`, () => {
      const schema = getPremiumCalculatorSchema(schemaId);
      expect(schema).not.toBeNull();
      if (!schema) {
        return;
      }

      const result = lintPremiumCalculatorSchema(schema);
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
      expect(FORMULA_FAMILIES).toContain(schema.category);
      expect(schema.formulaPipeline.length).toBeGreaterThan(0);
    });
  }

  test("lintAllPremiumSchemas reports registry orphans as info only", () => {
    const report = lintAllPremiumSchemas(PREMIUM_CALCULATOR_SCHEMAS);
    expect(report.valid).toBe(true);
    expect(report.globalErrors).toEqual([]);
    // Unused formulas are allowed — registry grows ahead of schema rollout.
    expect(Array.isArray(report.registryOrphans)).toBe(true);
  });

  test("unknown formulaId fails lint", () => {
    const base = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(base).not.toBeNull();
    if (!base) {
      return;
    }

    const broken: PremiumCalculatorSchema = {
      ...base,
      formulaPipeline: [
        {
          formulaId: "not.registered.formula",
          inputMap: {},
          outputId: "brokenOutput",
        },
      ],
    };

    const result = lintPremiumCalculatorSchema(broken);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "UNKNOWN_FORMULA")).toBe(true);
  });

  test("forbidden expression key fails lint", () => {
    const base = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(base).not.toBeNull();
    if (!base) {
      return;
    }

    const broken = {
      ...base,
      expression: "availability * performance",
    } as PremiumCalculatorSchema & { expression: string };

    const result = lintPremiumCalculatorSchema(broken);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "FORBIDDEN_KEY")).toBe(true);
  });

  test("duplicate schema ids fail global lint", () => {
    const base = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(base).not.toBeNull();
    if (!base) {
      return;
    }

    const report = lintAllPremiumSchemas([base, base]);
    expect(report.valid).toBe(false);
    expect(report.globalErrors.some((e) => e.code === "DUPLICATE_ID")).toBe(true);
  });

  test("every pipeline formulaId is registered", () => {
    const registered = new Set(listRegisteredFormulaIds());
    for (const schema of PREMIUM_CALCULATOR_SCHEMAS) {
      for (const step of schema.formulaPipeline) {
        expect(registered.has(step.formulaId)).toBe(true);
      }
    }
  });
});
