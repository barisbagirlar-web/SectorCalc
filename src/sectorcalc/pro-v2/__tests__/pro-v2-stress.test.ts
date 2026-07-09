// SectorCalc PRO V2 — Comprehensive Stress Test Suite
// Covers: validation, unit conversion, field contract, insight engine,
// schema mapping, edge cases, boundary values, and all three presets.

import { describe, it, expect } from "vitest";
import { validateProV2Inputs } from "../proValidation";
import { convertToEngineUnit, getUnitOptions } from "../proUnitRegistry";
import { WELD_FIELD_CONTRACT, WELD_HIDDEN_FIELDS, WELD_PRESETS } from "../proWeldFieldContract";
import { buildWeldInsightReport } from "../proInsightEngine";
import type { ProFieldContract } from "../proFieldContract";

// ── Helpers ──────────────────────────────────────────────────────────────────────

function flattenFields(groups: typeof WELD_FIELD_CONTRACT.groups): ProFieldContract[] {
  return groups.flatMap((g) => g.fields);
}

function stateFromPreset(
  preset: (typeof WELD_PRESETS)[number],
): { values: Record<string, string>; units: Record<string, string> } {
  return { values: { ...preset.values }, units: { ...preset.units } };
}

// ── TEST: Validation Layer ───────────────────────────────────────────────────────

describe("pro-v2: Validation Layer — All Presets", () => {
  const allFields = flattenFields(WELD_FIELD_CONTRACT.groups);

  for (const preset of WELD_PRESETS) {
    it(`${preset.label} passes validation with correct unit conversions`, () => {
      const { values, units } = stateFromPreset(preset);
      const result = validateProV2Inputs({
        fields: allFields,
        values,
        selectedUnits: units,
      });
      expect(result.ok).toBe(true);
      expect(result.blockers).toHaveLength(0);
    });
  }

  it("captures missing required fields", () => {
    const result = validateProV2Inputs({
      fields: allFields,
      values: {},
      selectedUnits: {},
    });
    expect(result.ok).toBe(false);
    expect(result.blockers.length).toBeGreaterThan(0);
    for (const b of result.blockers) {
      expect(b.severity).toBe("ERROR");
    }
  });

  it("skips optional empty fields without error", () => {
    const { values, units } = stateFromPreset(WELD_PRESETS[0]);
    // planned_quote is optional
    delete values.planned_quote;
    const result = validateProV2Inputs({
      fields: allFields,
      values,
      selectedUnits: units,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects non-numeric values for number fields", () => {
    const { values, units } = stateFromPreset(WELD_PRESETS[0]);
    values.weld_length = "abc";
    const result = validateProV2Inputs({
      fields: allFields,
      values,
      selectedUnits: units,
    });
    expect(result.ok).toBe(false);
    expect(result.blockers.some((b) => b.fieldId === "weld_length")).toBe(true);
  });

  it("enforces min range", () => {
    const { values, units } = stateFromPreset(WELD_PRESETS[0]);
    values.weld_length = "-5";
    const result = validateProV2Inputs({
      fields: allFields,
      values,
      selectedUnits: units,
    });
    expect(result.ok).toBe(false);
  });

  it("enforces max range", () => {
    const { values, units } = stateFromPreset(WELD_PRESETS[0]);
    values.deposition_efficiency = "999";
    const result = validateProV2Inputs({
      fields: allFields,
      values,
      selectedUnits: units,
    });
    expect(result.ok).toBe(false);
  });

  it("passes select field values as strings", () => {
    const { values, units } = stateFromPreset(WELD_PRESETS[0]);
    const result = validateProV2Inputs({
      fields: allFields,
      values,
      selectedUnits: units,
    });
    expect(result.engineInputs.material).toBe("carbon_steel");
    expect(typeof result.engineInputs.material).toBe("string");
  });

  it("builds displayInputs with correct structure", () => {
    const { values, units } = stateFromPreset(WELD_PRESETS[0]);
    const result = validateProV2Inputs({
      fields: allFields,
      values,
      selectedUnits: units,
    });
    for (const [key, val] of Object.entries(result.displayInputs)) {
      expect(val).toHaveProperty("value");
      expect(val).toHaveProperty("unit");
      if (key === "material") {
        expect(val.unit).toBe(""); // select fields have empty unit
      } else {
        expect(typeof val.unit).toBe("string");
      }
    }
  });

  it("injects hidden values into engineInputs", () => {
    const { values, units } = stateFromPreset(WELD_PRESETS[0]);
    const result = validateProV2Inputs({
      fields: allFields,
      values,
      selectedUnits: units,
      hiddenValues: { material_density: 7.85, source_confidence: 0.9 },
    });
    expect(result.engineInputs.material_density).toBe(7.85);
    expect(result.engineInputs.source_confidence).toBe(0.9);
  });
});

// ── TEST: Unit Conversion ─────────────────────────────────────────────────────────

describe("pro-v2: Unit Conversion — All Weld Families", () => {
  it("convertToEngineUnit — length (m → mm)", () => {
    const result = convertToEngineUnit(1, "m", "length");
    expect(result).toBe(1000); // m → mm
  });

  it("convertToEngineUnit — small_length (mm → mm)", () => {
    const result = convertToEngineUnit(6, "mm", "small_length");
    expect(result).toBe(6); // identity
  });

  it("convertToEngineUnit — material_cost (USD/kg → USD/kg)", () => {
    const result = convertToEngineUnit(4.2, "USD/kg", "material_cost");
    expect(result).toBe(4.2); // compound: kg/denom → factor 1
  });

  it("convertToEngineUnit — material_cost (USD/lb → USD/kg)", () => {
    const result = convertToEngineUnit(2, "USD/lb", "material_cost");
    // 2 USD per lb → 2 * 0.453592 = 0.907184 USD per kg
    expect(result).toBeCloseTo(0.907184, 5);
  });

  it("convertToEngineUnit — time (h → min)", () => {
    const result = convertToEngineUnit(1, "h", "time");
    expect(result).toBe(60);
  });

  it("convertToEngineUnit — cost_rate (USD/min → USD/min)", () => {
    const result = convertToEngineUnit(0.18, "USD/min", "cost_rate");
    expect(result).toBe(0.18); // passthrough
  });

  it("convertToEngineUnit — percentage (% → %)", () => {
    const result = convertToEngineUnit(85, "%", "percentage");
    expect(result).toBe(85);
  });

  it("convertToEngineUnit — percentage (factor → %)", () => {
    const result = convertToEngineUnit(0.85, "factor", "percentage");
    expect(result).toBe(85);
  });

  it("convertToEngineUnit — unknown unit throws", () => {
    expect(() => convertToEngineUnit(1, "xyz", "length")).toThrow();
  });

  it("getUnitOptions returns array for every weld family", () => {
    const families = ["length", "small_length", "time", "material_cost",
      "cost_rate", "labor_rate", "shop_rate", "currency", "percentage", "factor", "density"];
    for (const f of families) {
      const opts = getUnitOptions(f as any);
      expect(opts.length).toBeGreaterThan(0);
      expect(opts[0]).toHaveProperty("unit");
      expect(opts[0]).toHaveProperty("label");
    }
  });
});

// ── TEST: Field Contract Consistency ──────────────────────────────────────────────

describe("pro-v2: Field Contract Consistency", () => {
  const allFields = flattenFields(WELD_FIELD_CONTRACT.groups);

  it("every visible field has id, label, type, required", () => {
    for (const f of allFields) {
      expect(f.id).toBeTruthy();
      expect(f.label).toBeTruthy();
      expect(f.type).toMatch(/^(number|select|text)$/);
      expect(typeof f.required).toBe("boolean");
    }
  });

  it("number fields have unitFamily, select fields have options", () => {
    for (const f of allFields) {
      if (f.type === "number") {
        expect(f.unitFamily).toBeTruthy();
        expect(f.allowedUnits?.length).toBeGreaterThan(0);
      }
      if (f.type === "select") {
        expect(f.options?.length).toBeGreaterThan(0);
        expect(f.unitFamily).toBeUndefined();
      }
    }
  });

  it("every field has a corresponding preset value in first preset", () => {
    const preset = WELD_PRESETS[0];
    // Check visible fields (non-hidden)
    for (const f of allFields) {
      if (f.hidden) continue;
      expect(preset.values).toHaveProperty(f.id);
      // Select fields (material) have no unit entry in presets
      if (f.type !== "select") {
        expect(preset.units).toHaveProperty(f.id);
      }
    }
  });

  it("every preset key matches a field ID", () => {
    const allIds = new Set(allFields.map((f) => f.id));
    allIds.delete("material_density"); // hidden — not in presets
    allIds.delete("source_confidence"); // hidden — not in presets
    allIds.delete("schema_hash"); // hidden — not in presets
    for (const preset of WELD_PRESETS) {
      for (const key of Object.keys(preset.values)) {
        expect(allIds.has(key)).toBe(true);
      }
    }
  });

  it("hidden fields have hidden=true and defaultValue", () => {
    const hidden = WELD_HIDDEN_FIELDS;
    expect(hidden.length).toBeGreaterThan(0);
    for (const f of hidden) {
      expect(f.hidden).toBe(true);
      if (f.type === "number") {
        expect(typeof f.defaultValue).toBe("number");
      }
    }
  });
});

// ── TEST: Schema Input Mapping (execute body adapter) ────────────────────────────

describe("pro-v2: Schema Raw Inputs Mapping", () => {
  // This mirrors the FORM_TO_SCHEMA_INPUT map in ProExecutionFormV2.tsx
  const FORM_TO_SCHEMA: Record<string, string> = {
    weld_length: "weld_length_m",
    weld_throat: "weld_throat_mm",
    material_density: "weld_density",
    wire_cost: "wire_cost_per_kg",
    gas_cost: "gas_cost_per_min",
    arc_time: "arc_time_min",
    total_job_time: "weld_time_min",
    labor_rate: "labor_rate",
    shop_overhead_rate: "overhead_rate",
    deposition_efficiency: "deposition_efficiency",
    source_confidence: "source_confidence",
  };

  const HIDDEN_DEFAULTS: Record<string, { schemaId: string; defaultValue: number }> = {
    material_density: { schemaId: "weld_density", defaultValue: 7.85 },
    source_confidence: { schemaId: "source_confidence", defaultValue: 0.9 },
  };

  it("maps every form field ID to a unique schema input ID", () => {
    const schemaIds = new Set(Object.values(FORM_TO_SCHEMA));
    expect(schemaIds.size).toBe(Object.keys(FORM_TO_SCHEMA).length);
  });

  it("includes all hidden field defaults", () => {
    for (const [formId, cfg] of Object.entries(HIDDEN_DEFAULTS)) {
      expect(FORM_TO_SCHEMA[formId]).toBe(cfg.schemaId);
      expect(typeof cfg.defaultValue).toBe("number");
    }
  });

  it("standard preset produces all required schema inputs", () => {
    const { values } = stateFromPreset(WELD_PRESETS[0]);
    const schemaInputs: Record<string, number> = {};
    for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA)) {
      if (HIDDEN_DEFAULTS[formId]) {
        schemaInputs[schemaId] = HIDDEN_DEFAULTS[formId].defaultValue;
        continue;
      }
      const raw = values[formId];
      if (raw && raw !== "") {
        const num = parseFloat(raw);
        if (Number.isFinite(num)) schemaInputs[schemaId] = num;
      }
    }
    // planned_quote and contingency
    for (const extra of ["planned_quote", "contingency"]) {
      const raw = values[extra];
      if (raw && raw !== "") {
        const num = parseFloat(raw);
        if (Number.isFinite(num)) schemaInputs[extra] = num;
      }
    }

    // Schema requires these inputs: weld_length_m, weld_throat_mm, weld_density,
    // wire_cost_per_kg, gas_cost_per_min, arc_time_min, weld_time_min,
    // labor_rate, overhead_rate, deposition_efficiency, source_confidence
    expect(schemaInputs.weld_length_m).toBe(12);
    expect(schemaInputs.weld_throat_mm).toBe(6);
    expect(schemaInputs.weld_density).toBe(7.85);
    expect(schemaInputs.wire_cost_per_kg).toBe(4.2);
    expect(schemaInputs.gas_cost_per_min).toBe(0.18);
    expect(schemaInputs.arc_time_min).toBe(45);
    expect(schemaInputs.weld_time_min).toBe(60);
    expect(schemaInputs.labor_rate).toBe(55);
    expect(schemaInputs.overhead_rate).toBe(25);
    expect(schemaInputs.deposition_efficiency).toBe(85);
    expect(schemaInputs.source_confidence).toBe(0.9);
    expect(schemaInputs.planned_quote).toBe(190);
    expect(schemaInputs.contingency).toBe(10);
  });

  it("every preset maps all values correctly", () => {
    for (const preset of WELD_PRESETS) {
      const formKeys = Object.keys(preset.values);
      for (const fk of formKeys) {
        // In mapping, extra, or local-only field (material)
        const inMapping = Object.keys(FORM_TO_SCHEMA).includes(fk);
        const isExtra = ["planned_quote", "contingency"].includes(fk);
        const isLocalOnly = ["material"].includes(fk);
        expect(inMapping || isExtra || isLocalOnly).toBe(true);
      }
    }
  });
});

// ── TEST: Insight Engine ─────────────────────────────────────────────────────────

describe("pro-v2: Insight Engine — Builds Full Report", () => {
  const toolName = "Weld Procedure Cost & Consumable Estimation Suite";

  it("produces all 14 sections with valid outputs", () => {
    const outputs: Record<string, number> = {
      out_utilization_margin: 112.50,   // total cost
      out_scenario_delta: 9.38,          // cost per meter
      out_demand_metric: 42.00,          // wire cost
      out_capacity_metric: 1695.6,        // weld volume (g)
      out_expanded_uncertainty: 2.50,
      out_evidence_completeness: 0.85,
      out_normalized_demand: 12.0,
      out_reference_deviation: 0,
      out_derating_factor: 0.85,
      out_money_at_risk: 112.50,
      out_final_decision_state: 2,
    };
    const displayInputs: Record<string, { value: string; unit: string }> = {
      weld_length: { value: "12", unit: "m" },
      weld_throat: { value: "6", unit: "mm" },
      material: { value: "carbon_steel", unit: "" },
      planned_quote: { value: "190", unit: "USD" },
      contingency: { value: "10", unit: "%" },
    };

    const report = buildWeldInsightReport({
      toolName,
      outputs,
      warnings: [],
      displayInputs,
      engineInputs: {
        gas_cost: 0.18,
        arc_time: 45,
        labor_rate: 55,
        shop_overhead_rate: 25,
        total_job_time: 60,
        deposition_efficiency: 85,
        contingency: 10,
        planned_quote: 190,
        weld_length: 12000,
        weld_throat: 6,
        wire_cost: 4.2,
      },
      traceId: "test-trace-001",
    });

    // 1. Primary KPI
    expect(report.primaryKpi).toBeDefined();
    expect(report.primaryKpi.value).toContain("143");

    // 2. Decision state
    expect(report.decisionState).toBeDefined();
    expect(["PROFITABLE", "AT_RISK", "REVIEW", "LOSS"]).toContain(report.decisionState.state);

    // 3. Executive interpretation
    expect(report.executiveInterpretation).toBeTruthy();

    // 4. Cost distribution (≥3)
    expect(report.costDistribution.length).toBeGreaterThanOrEqual(3);

    // 5. Calculated values (≥3)
    expect(report.calculatedValues.length).toBeGreaterThanOrEqual(3);

    // 6. Hidden losses (≥3)
    expect(report.hiddenLosses.length).toBeGreaterThanOrEqual(3);

    // 7. Missed assumptions (≥3)
    expect(report.missedAssumptions.length).toBeGreaterThanOrEqual(3);

    // 8. Risk warnings (≥3)
    expect(report.riskWarnings.length).toBeGreaterThanOrEqual(3);

    // 9. Sensitivity checks (≥3)
    expect(report.sensitivityChecks.length).toBeGreaterThanOrEqual(3);

    // 10. Checklist (≥5)
    expect(report.checklist.length).toBeGreaterThanOrEqual(5);

    // 11. Recommended action
    expect(report.recommendedAction).toBeDefined();
    expect(report.recommendedAction.action).toBeTruthy();

    // 12. Assumptions used
    expect(report.assumptionsUsed.length).toBeGreaterThanOrEqual(3);

    // 13. Trace ID
    expect(report.traceId).toBe("test-trace-001");

    // 14. Extra metrics
    expect(report.totalCost).toBeTruthy();
    expect(report.costPerMeter).toBeTruthy();
    expect(report.marginPercent).toBeTruthy();
  });

  it("handles zero outputs gracefully (no crash)", () => {
    const outputs: Record<string, number> = {};
    const displayInputs: Record<string, { value: string; unit: string }> = {
      planned_quote: { value: "", unit: "" },
      contingency: { value: "", unit: "" },
    };
    const report = buildWeldInsightReport({
      toolName,
      outputs,
      warnings: [],
      displayInputs,
      engineInputs: {},
    });

    expect(report).toBeDefined();
    expect(report.primaryKpi.value).toContain("0");
    expect(report.calculatedValues.length).toBeGreaterThanOrEqual(0);
  });

  it("calculates margin correctly with planned quote", () => {
    const outputs: Record<string, number> = {
      out_utilization_margin: 100,
      out_scenario_delta: 10,
      out_demand_metric: 40,
      out_capacity_metric: 1500,
    };
    const displayInputs: Record<string, { value: string; unit: string }> = {
      planned_quote: { value: "150", unit: "USD" },
      contingency: { value: "10", unit: "%" },
    };
    const report = buildWeldInsightReport({
      toolName,
      outputs,
      warnings: [],
      displayInputs,
      engineInputs: {
        contingency: 10,
        planned_quote: 150,
      },
    });

    // base: wire(40) + gas(0) + labor(0) + overhead(0) = 40
    // contingency: 40 * 0.10 = 4
    // totalCostFloor: 44
    // margin: (150 - 44) / 150 = 70.7%
    expect(report.marginPercent).toContain("70");
    expect(report.decisionState.state).toBe("PROFITABLE");
  });

  it("generates warnings from server warnings", () => {
    const outputs: Record<string, number> = {
      out_utilization_margin: 100,
      out_scenario_delta: 10,
      out_demand_metric: 40,
      out_capacity_metric: 1500,
    };
    const report = buildWeldInsightReport({
      toolName,
      outputs,
      warnings: [
        { id: "W001", severity: "WARNING", message: "Arc time may be underestimated." },
        { id: "W002", severity: "INFO", message: "Density is estimated." },
      ],
      displayInputs: {},
      engineInputs: {},
    });

    expect(report.riskWarnings.length).toBeGreaterThanOrEqual(2);
    expect(report.riskWarnings[0].title).toBe("W001");
  });

  it("filters internal diagnostics from user-facing warnings", () => {
    const outputs: Record<string, number> = {
      out_utilization_margin: 100,
      out_scenario_delta: 10,
      out_demand_metric: 40,
      out_capacity_metric: 1500,
    };
    const report = buildWeldInsightReport({
      toolName,
      outputs,
      warnings: [
        { id: "schema_hash_mismatch", severity: "WARNING", message: "Hash mismatch" },
        { id: "derating_config", severity: "WARNING", message: "Derating config issue" },
        { id: "BUSINESS_WARN", severity: "WARNING", message: "Verify weld size before quoting" },
      ],
      displayInputs: {},
      engineInputs: { contingency: 10, planned_quote: 150 },
    });
    // schema_hash_mismatch and derating_config should be filtered out
    expect(report.riskWarnings.length).toBeGreaterThanOrEqual(1);
    const titles = report.riskWarnings.map((w) => w.title);
    expect(titles).not.toContain("Schema Hash Mismatch");
    expect(titles).not.toContain("Derating Config");
    expect(titles.some((t) => t.includes("BUSINESS"))).toBe(true);
  });

  it("formats material enum as user-facing label in assumptions", () => {
    const outputs: Record<string, number> = {
      out_utilization_margin: 100,
      out_scenario_delta: 10,
      out_demand_metric: 40,
      out_capacity_metric: 1500,
    };
    const report = buildWeldInsightReport({
      toolName,
      outputs,
      warnings: [],
      displayInputs: {
        material: { value: "carbon_steel", unit: "" },
        weld_length: { value: "12", unit: "m" },
      },
      engineInputs: {},
    });
    const matAssumption = report.assumptionsUsed.find((a) => a.parameter.toLowerCase().includes("material"));
    expect(matAssumption).toBeDefined();
    expect(matAssumption!.value).toBe("Carbon steel ");
  });

  it("sensitivity values are non-zero when costs are significant", () => {
    const outputs: Record<string, number> = {
      out_utilization_margin: 96.48,
      out_scenario_delta: 8.04,
      out_demand_metric: 8.38,
      out_capacity_metric: 1695.6,
    };
    const report = buildWeldInsightReport({
      toolName,
      outputs,
      warnings: [],
      displayInputs: {
        contingency: { value: "10", unit: "%" },
        planned_quote: { value: "190", unit: "USD" },
      },
      engineInputs: {
        gas_cost: 0.18, arc_time: 45,
        labor_rate: 55, shop_overhead_rate: 25, total_job_time: 60,
        deposition_efficiency: 85, contingency: 10, planned_quote: 190,
        weld_length: 12000, weld_throat: 6, wire_cost: 4.2,
      },
    });

    // Wire price sensitivity must be non-zero when wire cost > 0
    const wirePriceSens = report.sensitivityChecks.find((s) => s.parameter === "Wire Price");
    expect(wirePriceSens).toBeDefined();
    expect(wirePriceSens!.impact).not.toContain("$0.00");
    expect(wirePriceSens!.impact).not.toContain("N/A");

    // Deposition efficiency sensitivity must be non-zero when wire cost > 0
    const depEffSens = report.sensitivityChecks.find((s) => s.parameter === "Deposition Efficiency");
    expect(depEffSens).toBeDefined();
    expect(depEffSens!.impact).not.toContain("$0.00");
    expect(depEffSens!.impact).not.toContain("N/A");
  });
});

// ── TEST: Formula Module (Static) ────────────────────────────────────────────────

describe("pro-v2: Formula Module — Static Trace", () => {
  it("formula produces expected output keys with standard preset", async () => {
    // Server-side module — import dynamically (has server-only guard)
    const formula = await import("../../formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula");
    const inputs: Record<string, number> = {
      n_weld_length_m: 12,
      n_weld_throat_mm: 6,
      n_weld_density_g_per_cm3: 7.85,
      n_wire_cost_per_kg: 4.2,
      n_gas_cost_per_min: 0.18,
      n_arc_time_min: 45,
      n_weld_time_min: 60,
      n_labor_rate: 55,
      n_overhead_rate: 25,
      n_deposition_efficiency_pct: 85,
      n_source_confidence_ratio: 0.9,
    };
    const result = formula.calculate(inputs);
    expect(result.status).toBe("OK");
    expect(result.outputs).toBeDefined();

    // All 16 output keys present
    const expectedKeys = [
      "out_evidence_completeness",
      "out_normalized_demand",
      "out_reference_deviation",
      "out_derating_factor",
      "out_demand_metric",
      "out_capacity_metric",
      "out_utilization_margin",
      "out_expanded_uncertainty",
      "out_threshold_crossing",
      "out_sensitivity_driver",
      "out_fmea_trigger",
      "out_money_at_risk",
      "out_scenario_delta",
      "out_audit_hash_payload",
      "out_final_decision_state",
    ];
    for (const key of expectedKeys) {
      expect(result.outputs).toHaveProperty(key);
      expect(typeof result.outputs[key]).toBe("number");
    }

    // out_utilization_margin = total_cost
    expect(result.outputs.out_utilization_margin).toBeGreaterThan(0);
  });

  it("formula handles zero inputs without crash", async () => {
    const formula = await import("../../formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula");
    const inputs: Record<string, number> = {
      n_weld_length_m: 0,
      n_weld_throat_mm: 0,
      n_weld_density_g_per_cm3: 0,
      n_wire_cost_per_kg: 0,
      n_gas_cost_per_min: 0,
      n_arc_time_min: 0,
      n_weld_time_min: 0,
      n_labor_rate: 0,
      n_overhead_rate: 0,
      n_deposition_efficiency_pct: 0,
      n_source_confidence_ratio: 0,
    };
    const result = formula.calculate(inputs);
    expect(result.status).toBe("OK");
    // All outputs should be 0
    for (const val of Object.values(result.outputs)) {
      expect(val).toBe(0);
    }
  });

  it("formula produces sane ratio between large and small weld", async () => {
    const formula = await import("../../formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula");
    // Large structural weld (50m, 8mm throat)
    const large = formula.calculate({
      n_weld_length_m: 50,
      n_weld_throat_mm: 8,
      n_weld_density_g_per_cm3: 7.85,
      n_wire_cost_per_kg: 4.8,
      n_gas_cost_per_min: 0.24,
      n_arc_time_min: 180,
      n_weld_time_min: 260,
      n_labor_rate: 65,
      n_overhead_rate: 35,
      n_deposition_efficiency_pct: 82,
      n_source_confidence_ratio: 0.9,
    });
    // Small precision weld (2m, 3mm throat)
    const small = formula.calculate({
      n_weld_length_m: 2,
      n_weld_throat_mm: 3,
      n_weld_density_g_per_cm3: 7.85,
      n_wire_cost_per_kg: 9.5,
      n_gas_cost_per_min: 0.22,
      n_arc_time_min: 18,
      n_weld_time_min: 42,
      n_labor_rate: 75,
      n_overhead_rate: 40,
      n_deposition_efficiency_pct: 78,
      n_source_confidence_ratio: 0.9,
    });
    // Large weld should cost more
    expect(large.outputs.out_utilization_margin).toBeGreaterThan(
      small.outputs.out_utilization_margin,
    );
  });
});

// ── TEST: Runtime State ──────────────────────────────────────────────────────────

describe("pro-v2: Runtime Reducer — State Transitions", () => {
  it("imports and initializes correctly", async () => {
    const { INITIAL_RUNTIME_STATE, proV2RuntimeReducer } = await import("../proRuntimeReducer");
    expect(INITIAL_RUNTIME_STATE.executionState).toBe("idle");
    expect(INITIAL_RUNTIME_STATE.serverResult).toBeNull();

    const reset = proV2RuntimeReducer(INITIAL_RUNTIME_STATE, { type: "RESET" });
    expect(reset.executionState).toBe("idle");

    const blocked = proV2RuntimeReducer(INITIAL_RUNTIME_STATE, {
      type: "CLIENT_BLOCKED",
      blockers: [{ fieldId: "test", message: "error", severity: "ERROR" }],
    });
    expect(blocked.executionState).toBe("client_blocked");

    const ok = proV2RuntimeReducer(INITIAL_RUNTIME_STATE, {
      type: "SERVER_OK",
      result: { key: "value" },
      warnings: [],
    });
    expect(ok.executionState).toBe("server_ok");
    expect(ok.serverResult).toEqual({ key: "value" });
  });
});

// ── TEST: Execute Client Contract ────────────────────────────────────────────────

describe("pro-v2: Execute Client — Contract Types", () => {
  it("imports type exports without error", async () => {
    const mod = await import("../proExecuteClient");
    expect(typeof mod.executeWithUsageSession).toBe("function");
  });

  it("imports session client without error", async () => {
    const mod = await import("../proSessionClient");
    expect(typeof mod.createCreditSession).toBe("function");
  });
});
