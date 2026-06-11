import { describe, expect, test } from "vitest";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  schemaHasFiniteResults,
} from "@/lib/premium-schema/premium-schema-engine";
import { getPremiumCalculatorSchema, listPremiumSchemaIds } from "@/lib/premium-schema/schema-registry";
import { FORMULA_REGISTRY } from "@/lib/premium-schema/formula-registry";

const BATCH5_SCHEMA_IDS = [
  "energy-savings-package-calculator",
  "investment-payback-npv-calculator",
  "annual-leave-severance-notice-calculator",
  "belt-pulley-speed-length-calculator",
] as const;

const BATCH5_FORMULA_IDS = [
  "energy.monthly_kwh_savings",
  "finance.payback_years",
  "finance.simple_npv",
  "finance.annual_yield_percent",
  "cost.employer_burden_total",
  "cost.severance_screening",
  "cost.notice_screening",
  "measurement.pulley_driven_rpm",
  "measurement.belt_speed_mpm",
  "measurement.open_belt_length_mm",
] as const;

describe("premium-schema-batch5", () => {
  test("batch5 slugs exist in schema registry", () => {
    const ids = new Set(listPremiumSchemaIds());
    for (const slug of BATCH5_SCHEMA_IDS) {
      expect(ids.has(slug)).toBe(true);
    }
  });

  test.each(BATCH5_SCHEMA_IDS)("%s produces finite results with big number", (schemaId) => {
    const schema = getPremiumCalculatorSchema(schemaId);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    expect(schemaHasFiniteResults(result)).toBe(true);
    expect(result.bigNumber.isBigNumber).toBe(true);
  });

  test.each(BATCH5_FORMULA_IDS)("formula %s is registered", (formulaId) => {
    expect(FORMULA_REGISTRY[formulaId]).toBeDefined();
  });
});
