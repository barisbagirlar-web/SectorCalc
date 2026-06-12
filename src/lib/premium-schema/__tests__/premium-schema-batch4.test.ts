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
import {
  getPremiumCalculatorSchema,
  listPremiumSchemaIds,
  PREMIUM_CALCULATOR_SCHEMAS,
} from "@/lib/premium-schema/schema-registry";
import { PREMIUM_SCHEMAS } from "@/lib/premium-schema/schemas/index";

const BATCH4_SCHEMA_IDS = [
  "bolt-tightening-torque-calculator",
  "fire-system-flow-hydrant-calculator",
  "hydraulic-pneumatic-cylinder-force-calculator",
  "quality-cost-paf-calculator",
  "pressure-vessel-wall-thickness-calculator",
  "value-stream-map-vsm-calculator",
] as const;

const BATCH4_FORMULA_IDS = [
  "measurement.bolt_tightening_torque",
  "measurement.fire_flow_demand",
  "measurement.hydrant_count",
  "measurement.cylinder_force",
  "measurement.cylinder_retract_force",
  "measurement.vessel_wall_thickness",
  "cost.sum3",
  "cost.ratio_percent",
  "time.vsm_total_lead_time",
  "benchmark.value_added_percent",
] as const;

describe("premium-schema-batch4", () => {
  test("PREMIUM_SCHEMAS length === 50", () => {
    expect(PREMIUM_SCHEMAS.length).toBe(50);
    expect(listPremiumSchemaIds().length).toBe(51);
  });

  test("batch4 slugs exist in schema index", () => {
    const ids = new Set(listPremiumSchemaIds());
    for (const slug of BATCH4_SCHEMA_IDS) {
      expect(ids.has(slug)).toBe(true);
    }
  });

  test.each(BATCH4_SCHEMA_IDS)("%s produces finite results with big number", (schemaId) => {
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

  test.each(BATCH4_FORMULA_IDS)("formula %s is registered", (formulaId) => {
    expect(FORMULA_REGISTRY[formulaId]).toBeDefined();
    expect(typeof FORMULA_REGISTRY[formulaId]).toBe("function");
  });

  test("FORMULA_REGISTRY_META covers all registry keys", () => {
    const metaIds = new Set(FORMULA_REGISTRY_META.map((item) => item.formulaId));
    for (const formulaId of listRegisteredFormulaIds()) {
      expect(metaIds.has(formulaId)).toBe(true);
    }
  });

  test.each(BATCH4_SCHEMA_IDS)("%s entitlement gate export payload does not crash", (schemaId) => {
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
