import { describe, expect, test } from "vitest";
import { PREVIEW_ENTITLEMENT, FULL_ENTITLEMENT } from "@/lib/entitlements/premium-entitlements";
import { FORMULA_REGISTRY, FORMULA_REGISTRY_META, listRegisteredFormulaIds } from "@/lib/premium-schema/formula-registry";
import { gatePremiumReportExportPayload } from "@/lib/premium-schema/premium-report-gate";
import { buildPremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  schemaHasFiniteResults,
} from "@/lib/premium-schema/premium-schema-engine";
import { PREMIUM_MIGRATION_MAP } from "@/lib/premium-schema/premium-migration-map";
import {
  getPremiumCalculatorSchema,
  listPremiumSchemaIds,
  PREMIUM_CALCULATOR_SCHEMAS,
} from "@/lib/premium-schema/schema-registry";
import { PREMIUM_SCHEMAS } from "@/lib/premium-schema/schemas/index";

const BATCH3_SCHEMA_IDS = [
  "cnc-tool-wear-cost",
  "textile-fabric-waste-risk",
  "printing-reprint-margin-leak",
  "auto-repair-comeback-cost",
  "hvac-callback-margin-risk",
  "electrical-panel-rework-cost",
  "plumbing-leak-callback-cost",
  "roofing-weather-delay-risk",
  "painting-rework-coverage-risk",
  "dairy-feed-efficiency-loss",
  "retail-inventory-turnover-risk",
  "warehouse-space-cost-leak",
  "calibration-drift-risk",
  "legal-interest-fee-calculator-pro",
  "carbon-footprint-compliance-risk",
] as const;

const BATCH3_FORMULA_IDS = [
  "cost.unit_cost",
  "time.setup_loss",
  "cost.percent_of_amount",
  "cost.difference",
  "cost.margin_rate_on_price",
  "cost.quote_target_price",
  "cost.quote_safe_floor_price",
  "cost.shop_hourly_rate",
  "cost.break_even_units",
  "cost.safety_margin_rate",
  "carbon.unit_product_emissions",
  "carbon.unit_exposure_cost",
  "time.downtime_minute_cost",
  "time.downtime_units_lost",
  "inventory.eoq_units",
  "inventory.carrying_cost_annual",
  "calibration.tolerance_worst_case_stack",
  "calibration.tolerance_rss_stack",
  "measurement.weld_throat_capacity",
  "measurement.bolt_shear_capacity",
  "time.hour_overrun_cost",
  "cost.count_cost",
  "agriculture.feed_monthly_cost",
  "agriculture.milk_yield_gap_revenue",
  "retail.inventory_turnover",
  "warehouse.unused_space_cost",
  "legal.simple_interest_days",
  "carbon.total_emissions",
  "calibration.tolerance_status",
] as const;

describe("premium-schema-batch3", () => {
  test("PREMIUM_SCHEMAS length === 50", () => {
    expect(PREMIUM_SCHEMAS.length).toBe(50);
    expect(listPremiumSchemaIds().length).toBe(51);
  });

  test("new 15 slugs exist in schema index", () => {
    const ids = new Set(listPremiumSchemaIds());
    for (const slug of BATCH3_SCHEMA_IDS) {
      expect(ids.has(slug)).toBe(true);
    }
  });

  test.each(BATCH3_SCHEMA_IDS)("%s produces finite results with big number", (schemaId) => {
    const schema = getPremiumCalculatorSchema(schemaId);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    expect(schemaHasFiniteResults(result)).toBe(true);
    expect(result.bigNumber.isBigNumber).toBe(true);
    expect(result.bigNumber.formatted.length).toBeGreaterThan(0);
    expect(result.legalNote.trim().length).toBeGreaterThan(0);
  });

  test.each(BATCH3_SCHEMA_IDS)("%s has no NaN or Infinity", (schemaId) => {
    const schema = getPremiumCalculatorSchema(schemaId);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const joined = [
      ...result.outputs.map((output) => String(output.raw)),
      result.bigNumber.formatted,
      String(result.p90Exposure),
      String(result.minimumSafePrice),
    ].join(" ");

    expect(joined).not.toMatch(/\bNaN\b/);
    expect(joined).not.toMatch(/\bInfinity\b/i);
  });

  test.each(BATCH3_FORMULA_IDS)("formula %s is registered", (formulaId) => {
    expect(FORMULA_REGISTRY[formulaId]).toBeDefined();
    expect(typeof FORMULA_REGISTRY[formulaId]).toBe("function");
  });

  test("FORMULA_REGISTRY_META covers all registry keys", () => {
    const metaIds = new Set(FORMULA_REGISTRY_META.map((item) => item.formulaId));
    for (const formulaId of listRegisteredFormulaIds()) {
      expect(metaIds.has(formulaId)).toBe(true);
    }
  });

  test("formula registry has no eval or new Function usage", () => {
    for (const id of listRegisteredFormulaIds()) {
      const fn = FORMULA_REGISTRY[id];
      expect(fn.toString()).not.toMatch(/eval\s*\(/);
      expect(fn.toString()).not.toMatch(/new Function/);
    }
  });

  test("schema_pilot migration slugs exist in PREMIUM_SCHEMAS", () => {
    const schemaIds = new Set(PREMIUM_SCHEMAS.map((schema) => schema.id));
    for (const pilot of PREMIUM_MIGRATION_MAP.filter((entry) => entry.status === "schema_pilot")) {
      expect(schemaIds.has(pilot.schemaSlug as string)).toBe(true);
    }
  });

  test("migration map has 27 schema_pilot entries", () => {
    const pilots = PREMIUM_MIGRATION_MAP.filter((entry) => entry.status === "schema_pilot");
    expect(pilots.length).toBe(27);
  });

  test.each(BATCH3_SCHEMA_IDS)("%s entitlement gate export payload does not crash", (schemaId) => {
    const schema = getPremiumCalculatorSchema(schemaId);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const payload = buildPremiumReportExportPayload(schema, result, "en");

    const previewGated = gatePremiumReportExportPayload(payload, PREVIEW_ENTITLEMENT);
    const fullGated = gatePremiumReportExportPayload(payload, FULL_ENTITLEMENT);

    expect(previewGated.schemaSlug).toBe(schemaId);
    expect(fullGated.hiddenDrivers.length).toBeGreaterThanOrEqual(previewGated.hiddenDrivers.length);
  });

  test("all 51 schemas produce finite results", () => {
    for (const schema of PREMIUM_CALCULATOR_SCHEMAS) {
      const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
      expect(schemaHasFiniteResults(result)).toBe(true);
    }
  });
});
