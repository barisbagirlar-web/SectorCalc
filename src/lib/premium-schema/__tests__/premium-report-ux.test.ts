import { describe, expect, test } from "vitest";
import { FORMULA_REGISTRY, listRegisteredFormulaIds } from "@/lib/premium-schema/formula-registry";
import {
  formatPremiumValue,
  formatResultStrings,
  getAssumptionLines,
  getBigNumberMeaning,
  getHiddenDriverOutputs,
  getSuggestedActionSteps,
  getThresholdSummary,
  getVerdictFromThresholds,
  hasInvalidResultStrings,
  reportPreviewSections,
} from "@/lib/premium-schema/format-premium-result";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import type { PremiumDecisionReportPreviewProps } from "@/components/reports/PremiumDecisionReportPreview";
import { PREVIEW_ENTITLEMENT } from "@/lib/entitlements/premium-entitlements";

describe("premium-report-ux", () => {
  test("critical threshold produces Critical verdict", () => {
    const schema = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, {
      ...buildDefaultSchemaInputs(schema),
      availability: 35,
      performance: 35,
      quality: 35,
    });

    const verdict = getVerdictFromThresholds(result.thresholdAlerts);
    expect(verdict.status).toBe("Critical");
    expect(verdict.verdict).toMatch(/critical threshold/i);
  });

  test("warning threshold produces Warning verdict", () => {
    const schema = getPremiumCalculatorSchema("food-waste-margin-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, {
      ...buildDefaultSchemaInputs(schema),
      wasteRate: 6,
    });

    const verdict = getVerdictFromThresholds(result.thresholdAlerts);
    expect(verdict.status).toBe("Warning");
    expect(verdict.verdict).toMatch(/warning threshold/i);
  });

  test("safe state produces Acceptable verdict", () => {
    const schema = getPremiumCalculatorSchema("logistics-route-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const verdict = getVerdictFromThresholds(result.thresholdAlerts);
    expect(verdict.status).toBe("Acceptable");
  });

  test("big number output is formatted", () => {
    const schema = getPremiumCalculatorSchema("energy-peak-cost");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    expect(result.bigNumber.formatted.length).toBeGreaterThan(0);
    expect(formatPremiumValue(result.bigNumber.raw, result.bigNumber.format, result.bigNumber.unit)).toBe(
      result.bigNumber.formatted
    );
    expect(getBigNumberMeaning(result.bigNumber.format)).toMatch(/primary|operating|exposure/i);
  });

  test("missing threshold alerts still returns safe summary rows", () => {
    const schema = getPremiumCalculatorSchema("logistics-route-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const summary = getThresholdSummary(schema, [], result.outputs);
    expect(summary.length).toBe(schema.thresholds.length);
    expect(summary.every((item) => item.level === "safe")).toBe(true);
  });

  test("assumptions and legal note are present", () => {
    const schema = getPremiumCalculatorSchema("construction-project-overrun");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    expect(getAssumptionLines(schema).length).toBeGreaterThan(0);
    expect(result.legalNote.trim().length).toBeGreaterThan(0);
  });

  test("report preview sections list is populated", () => {
    expect(reportPreviewSections().length).toBeGreaterThanOrEqual(6);
  });

  test("formatted result strings exclude NaN and Infinity", () => {
    for (const schemaId of [
      "cnc-oee-loss",
      "logistics-route-loss",
      "energy-peak-cost",
      "food-waste-margin-loss",
      "construction-project-overrun",
    ] as const) {
      const schema = getPremiumCalculatorSchema(schemaId);
      expect(schema).not.toBeNull();
      if (!schema) {
        continue;
      }

      const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
      expect(hasInvalidResultStrings(result)).toBe(false);
      expect(formatResultStrings(result)).not.toMatch(/\bNaN\b/);
      expect(formatResultStrings(result)).not.toMatch(/\bInfinity\b/i);
    }
  });

  test("formula registry has no eval or new Function usage", () => {
    for (const id of listRegisteredFormulaIds()) {
      const fn = FORMULA_REGISTRY[id];
      expect(fn.toString()).not.toMatch(/eval\s*\(/);
      expect(fn.toString()).not.toMatch(/new Function/);
    }
  });

  test("PremiumDecisionReportPreview props shape is valid", () => {
    const schema = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const props: PremiumDecisionReportPreviewProps = {
      schema,
      result,
      locale: "en",
      compact: true,
      entitlement: PREVIEW_ENTITLEMENT,
      checkoutHref: "/pricing?tool=cnc-oee-loss",
    };

    expect(props.result.bigNumber.isBigNumber).toBe(true);
    expect(getHiddenDriverOutputs(props.result).every((output) => !output.isBigNumber)).toBe(true);
    expect(getSuggestedActionSteps("critical").decision.length).toBeGreaterThan(0);
  });
});
