import { describe, expect, test } from "vitest";
import { revenueTools } from "@/lib/tools/revenue-tools";
import { FORMULA_FAMILIES } from "@/lib/premium-schema/formula-families";
import { FORMULA_REGISTRY, listRegisteredFormulaIds } from "@/lib/premium-schema/formula-registry";
import { getPremiumMigrationStatus } from "@/lib/premium-schema/get-premium-migration-status";
import {
  PREMIUM_MIGRATION_MAP,
  listMigrationMapLegacySlugs,
} from "@/lib/premium-schema/premium-migration-map";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  schemaHasFiniteResults,
} from "@/lib/premium-schema/premium-schema-engine";
import {
  getPremiumCalculatorSchema,
  PREMIUM_CALCULATOR_SCHEMAS,
} from "@/lib/premium-schema/schema-registry";
import { PREMIUM_SCHEMAS } from "@/lib/premium-schema/schemas/index";

const SCHEMA_PILOT_IDS = [
  "cnc-oee-loss",
  "logistics-route-loss",
  "energy-peak-cost",
  "food-waste-margin-loss",
  "construction-project-overrun",
  "sheet-metal-scrap-risk",
  "restaurant-menu-margin-leak",
  "construction-subcontractor-margin-leak",
  "logistics-fuel-route-drift",
  "energy-compressor-leak-cost",
  "cloud-api-cost-overrun",
  "agriculture-irrigation-yield-loss",
] as const;

describe("premium-migration-map", () => {
  test("PREMIUM_MIGRATION_MAP is not empty and covers all revenue premium tools", () => {
    expect(PREMIUM_MIGRATION_MAP.length).toBeGreaterThan(0);
    expect(PREMIUM_MIGRATION_MAP.length).toBe(revenueTools.length);
    expect(PREMIUM_MIGRATION_MAP.length).toBe(27);
  });

  test("legacySlug values are unique", () => {
    const slugs = listMigrationMapLegacySlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("every revenue paidSlug appears in migration map", () => {
    for (const tool of revenueTools) {
      expect(PREMIUM_MIGRATION_MAP.some((entry) => entry.legacySlug === tool.paidSlug)).toBe(
        true
      );
    }
  });

  test("schema_pilot items include schemaSlug", () => {
    const pilots = PREMIUM_MIGRATION_MAP.filter((entry) => entry.status === "schema_pilot");
    expect(pilots.length).toBe(12);
    for (const pilot of pilots) {
      expect(pilot.schemaSlug).toBeTruthy();
    }
  });

  test("schema_pilot schemaSlugs exist in PREMIUM_SCHEMAS", () => {
    const schemaIds = new Set(PREMIUM_SCHEMAS.map((schema) => schema.id));
    for (const pilot of PREMIUM_MIGRATION_MAP.filter((entry) => entry.status === "schema_pilot")) {
      expect(schemaIds.has(pilot.schemaSlug as string)).toBe(true);
    }
  });

  test("every map item has valid family and non-empty sectorSlug", () => {
    for (const entry of PREMIUM_MIGRATION_MAP) {
      expect(FORMULA_FAMILIES).toContain(entry.family);
      expect(entry.sectorSlug.trim().length).toBeGreaterThan(0);
      expect(entry.title.trim().length).toBeGreaterThan(0);
      expect(entry.migrationNote.trim().length).toBeGreaterThan(0);
    }
  });

  test("getPremiumMigrationStatus returns schema route for pilots", () => {
    const status = getPremiumMigrationStatus("cnc-quote-risk-analyzer");
    expect(status.status).toBe("schema_pilot");
    expect(status.schemaSlug).toBe("cnc-oee-loss");
    expect(status.schemaRoutePath).toBe("/tools/premium-schema/cnc-oee-loss");
  });

  test("getPremiumMigrationStatus returns legacy for unmapped slug", () => {
    const status = getPremiumMigrationStatus("unknown-premium-slug");
    expect(status.status).toBe("legacy");
    expect(status.schemaRoutePath).toBeNull();
  });

  for (const schemaId of SCHEMA_PILOT_IDS) {
    test(`${schemaId} pilot produces finite results`, () => {
      const schema = getPremiumCalculatorSchema(schemaId);
      expect(schema).not.toBeNull();
      if (!schema) {
        return;
      }

      const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
      expect(schemaHasFiniteResults(result)).toBe(true);
      expect(result.bigNumber.isBigNumber).toBe(true);
    });
  }

  test("food-waste-margin-loss calculates excessWasteCost", () => {
    const schema = getPremiumCalculatorSchema("food-waste-margin-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const excess = result.outputs.find((output) => output.id === "excessWasteCost");
    expect(excess?.raw).toBe(720);
    expect(excess?.raw).toBeGreaterThan(0);
  });

  test("construction-project-overrun calculates totalExposure", () => {
    const schema = getPremiumCalculatorSchema("construction-project-overrun");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const total = result.outputs.find((output) => output.id === "totalExposure");
    expect(total?.raw).toBe(12040);
    expect(total?.raw).toBeGreaterThan(0);
  });

  test("pilot schemas produce no NaN or Infinity", () => {
    for (const schema of PREMIUM_CALCULATOR_SCHEMAS) {
      const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
      const joined = [
        ...result.outputs.map((output) => String(output.raw)),
        String(result.p90Exposure),
        String(result.minimumSafePrice),
        result.bigNumber.formatted,
      ].join(" ");

      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    }
  });

  test("formula registry has no eval or new Function usage", () => {
    for (const id of listRegisteredFormulaIds()) {
      const fn = FORMULA_REGISTRY[id];
      expect(fn.toString()).not.toMatch(/eval\s*\(/);
      expect(fn.toString()).not.toMatch(/new Function/);
    }
  });
});
