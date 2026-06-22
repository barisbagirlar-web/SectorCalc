import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  FORMULA_REGISTRY,
  FORMULA_REGISTRY_META,
  listRegisteredFormulaIds,
} from "@/lib/premium-schema/formula-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  schemaHasFiniteResults,
} from "@/lib/premium-schema/premium-schema-engine";
import {
  PREMIUM_MIGRATION_MAP,
} from "@/lib/premium-schema/premium-migration-map";
import {
  getPremiumCalculatorSchema,
} from "@/lib/premium-schema/schema-registry";
import { PREMIUM_SCHEMAS } from "@/lib/premium-schema/schemas/index";
import { hasInvalidResultStrings } from "@/lib/premium-schema/format-premium-result";

const BATCH2_SCHEMA_IDS = [
  "sheet-metal-scrap-risk",
  "restaurant-menu-margin-leak",
  "construction-subcontractor-margin-leak",
  "logistics-fuel-route-drift",
  "energy-compressor-leak-cost",
  "cloud-api-cost-overrun",
  "agriculture-irrigation-yield-loss",
] as const;

const BATCH2_FORMULA_IDS = [
  "time.rework_cost",
  "cost.food_cost_percent",
  "cost.delivery_fee_cost",
  "cost.restaurant_margin_pressure",
  "cost.variance",
  "route.distance_drift_cost",
  "cost.sum2",
  "energy.compressor_leak_kwh",
  "cost.annualize",
  "cloud.api_call_cost",
  "agriculture.yield_loss_revenue",
  "cost.total2",
] as const;

describe("premium-schema-batch2", () => {
  test("PREMIUM_SCHEMAS length is 27", () => {
    expect(PREMIUM_SCHEMAS.length).toBe(81);
  });

  test("all batch 2 slugs exist in schema index", () => {
    const ids = new Set(PREMIUM_SCHEMAS.map((schema) => schema.id));
    for (const slug of BATCH2_SCHEMA_IDS) {
      expect(ids.has(slug)).toBe(true);
    }
  });

  test.each(BATCH2_SCHEMA_IDS)("%s produces finite engine result", (schemaId) => {
    const schema = getPremiumCalculatorSchema(schemaId);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    expect(schemaHasFiniteResults(result)).toBe(true);
    expect(hasInvalidResultStrings(result)).toBe(false);
  });

  test("sheet-metal totalExposure is calculated", () => {
    const schema = getPremiumCalculatorSchema("sheet-metal-scrap-risk");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const total = result.outputs.find((output) => output.id === "totalExposure");
    expect(total?.raw).toBe(2207);
    expect(total?.raw).toBeGreaterThan(0);
  });

  test("restaurant totalMarginPressure is calculated", () => {
    const schema = getPremiumCalculatorSchema("restaurant-menu-margin-leak");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const pressure = result.outputs.find((output) => output.id === "totalMarginPressure");
    expect(pressure?.raw).toBeCloseTo(62.45, 1);
    expect(pressure?.raw).toBeGreaterThan(0);
  });

  test("construction subcontractor totalExposure is calculated", () => {
    const schema = getPremiumCalculatorSchema("construction-subcontractor-margin-leak");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const total = result.outputs.find((output) => output.id === "totalExposure");
    expect(total?.raw).toBe(20200);
    expect(total?.raw).toBeGreaterThan(0);
  });

  test("logistics fuel totalExposure is calculated", () => {
    const schema = getPremiumCalculatorSchema("logistics-fuel-route-drift");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const total = result.outputs.find((output) => output.id === "totalExposure");
    expect(total?.raw).toBeCloseTo(163.1, 1);
    expect(total?.raw).toBeGreaterThan(0);
  });

  test("compressor monthlyLeakCost is calculated", () => {
    const schema = getPremiumCalculatorSchema("energy-compressor-leak-cost");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const monthly = result.outputs.find((output) => output.id === "monthlyLeakCost");
    expect(monthly?.raw).toBeCloseTo(272.16, 1);
    expect(monthly?.raw).toBeGreaterThan(0);
  });

  test("cloud totalCloudCost is calculated", () => {
    const schema = getPremiumCalculatorSchema("cloud-api-cost-overrun");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const total = result.outputs.find((output) => output.id === "totalCloudCost");
    expect(total?.raw).toBe(2670);
    expect(total?.raw).toBeGreaterThan(0);
  });

  test("agriculture totalExposure is calculated", () => {
    const schema = getPremiumCalculatorSchema("agriculture-irrigation-yield-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const total = result.outputs.find((output) => output.id === "totalExposure");
    expect(total?.raw).toBeCloseTo(6712, 0);
    expect(total?.raw).toBeGreaterThan(0);
  });

  test("batch 2 schemas produce no NaN or Infinity", () => {
    for (const schemaId of BATCH2_SCHEMA_IDS) {
      const schema = getPremiumCalculatorSchema(schemaId);
      expect(schema).not.toBeNull();
      if (!schema) {
        continue;
      }
      const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
      expect(hasInvalidResultStrings(result)).toBe(false);
    }
  });

  test.each(BATCH2_FORMULA_IDS)("%s is registered", (formulaId) => {
    expect(listRegisteredFormulaIds()).toContain(formulaId);
    expect(typeof FORMULA_REGISTRY[formulaId]).toBe("function");
  });

  test("FORMULA_REGISTRY_META keys match registry formula keys", () => {
    const metaIds = new Set(FORMULA_REGISTRY_META.map((item) => item.formulaId));
    for (const id of listRegisteredFormulaIds()) {
      expect(metaIds.has(id)).toBe(true);
    }
  });

  test("formula registry source has no eval or new Function", () => {
    const source = readFileSync(
      join(process.cwd(), "src/lib/premium-schema/formula-registry.ts"),
      "utf8"
    );
    expect(source).not.toMatch(/eval\s*\(/);
    expect(source).not.toMatch(/new Function/);
    for (const id of BATCH2_FORMULA_IDS) {
      const fn = FORMULA_REGISTRY[id];
      expect(fn.toString()).not.toMatch(/eval\s*\(/);
      expect(fn.toString()).not.toMatch(/new Function/);
    }
  });

  test("schema_pilot migration map schemaSlugs exist in PREMIUM_SCHEMAS", () => {
    const schemaIds = new Set(PREMIUM_SCHEMAS.map((schema) => schema.id));
    for (const pilot of PREMIUM_MIGRATION_MAP.filter((entry) => entry.status === "schema_pilot")) {
      expect(schemaIds.has(pilot.schemaSlug as string)).toBe(true);
    }
  });
});
