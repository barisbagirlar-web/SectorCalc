import { describe, expect, test } from "vitest";
import { FORMULA_REGISTRY, listRegisteredFormulaIds } from "@/lib/premium-schema/formula-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  schemaHasFiniteResults,
} from "@/lib/premium-schema/premium-schema-engine";
import { SCHEMA_LEGAL_NOTE } from "@/lib/premium-schema/premium-schema-engine";
import {
  getPremiumCalculatorSchema,
  listPremiumSchemaIds,
  PREMIUM_SCHEMA_SLUG_MAP,
} from "@/lib/premium-schema/schema-registry";

describe("premium-schema-engine", () => {
  test("formula registry has no eval or new Function usage", () => {
    for (const id of listRegisteredFormulaIds()) {
      const fn = FORMULA_REGISTRY[id];
      expect(typeof fn).toBe("function");
      expect(fn.toString()).not.toMatch(/eval\s*\(/);
      expect(fn.toString()).not.toMatch(/new Function/);
    }
  });

  test("3 pilot schemas are registered", () => {
    const ids = listPremiumSchemaIds();
    expect(ids).toContain("cnc-oee-loss");
    expect(ids).toContain("logistics-route-loss");
    expect(ids).toContain("energy-peak-cost");
    expect(ids.length).toBe(3);
  });

  test("slug map bridges 3 legacy premium routes", () => {
    expect(PREMIUM_SCHEMA_SLUG_MAP["cnc-quote-risk-analyzer"]).toBe("cnc-oee-loss");
    expect(PREMIUM_SCHEMA_SLUG_MAP["route-optimization-analyzer"]).toBe("logistics-route-loss");
    expect(PREMIUM_SCHEMA_SLUG_MAP["energy-efficiency-report"]).toBe("energy-peak-cost");
  });

  for (const schemaId of ["cnc-oee-loss", "logistics-route-loss", "energy-peak-cost"] as const) {
    test(`${schemaId} produces big number and finite results`, () => {
      const schema = getPremiumCalculatorSchema(schemaId);
      expect(schema).not.toBeNull();
      if (!schema) {
        return;
      }

      const defaults = buildDefaultSchemaInputs(schema);
      const result = runPremiumSchemaEngine(schema, defaults);

      expect(result.bigNumber.formatted.length).toBeGreaterThan(0);
      expect(result.bigNumber.isBigNumber).toBe(true);
      expect(schemaHasFiniteResults(result)).toBe(true);
      expect(result.reportSections.length).toBeGreaterThanOrEqual(
        schema.reportTemplate.sections.length
      );
      expect(result.legalNote).toBe(SCHEMA_LEGAL_NOTE);

      const joined = [
        result.executiveSummary,
        result.suggestedAction,
        ...result.outputs.map((o) => o.formatted),
        String(result.p90Exposure),
        String(result.minimumSafePrice),
      ].join(" ");

      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    });
  }

  test("cnc-oee-loss threshold can fire on low OEE", () => {
    const schema = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, {
      ...buildDefaultSchemaInputs(schema),
      availability: 40,
      performance: 40,
      quality: 40,
    });

    expect(result.thresholdAlerts.some((a) => a.severity === "critical")).toBe(true);
    expect(result.suggestedAction.toLowerCase()).toMatch(/risk|reprice|margin/);
  });

  test("logistics-route-loss deadhead formula runs via registry", () => {
    const schema = getPremiumCalculatorSchema("logistics-route-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const deadhead = result.outputs.find((o) => o.id === "deadheadCost");
    expect(deadhead?.raw).toBeGreaterThan(0);
  });

  test("energy-peak-cost produces excess kWh cost", () => {
    const schema = getPremiumCalculatorSchema("energy-peak-cost");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, {
      ...buildDefaultSchemaInputs(schema),
      currentKwh: 15000,
      targetKwh: 10000,
    });

    const excess = result.outputs.find((o) => o.id === "excessKwhCost");
    expect(excess?.raw).toBeGreaterThan(0);
  });

  test("unknown formulaId throws", () => {
    const schema = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const broken = {
      ...schema,
      formulaPipeline: [
        {
          formulaId: "not.a.real.formula",
          inputMap: {},
          outputId: "broken",
        },
      ],
    };

    expect(() => runPremiumSchemaEngine(broken, buildDefaultSchemaInputs(schema))).toThrow(
      /Unknown formulaId/
    );
  });
});
