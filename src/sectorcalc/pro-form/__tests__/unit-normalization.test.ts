// Test: Unit normalization — SI conversion, unit validation

import { describe, it, expect } from "vitest";
import { normalizeInput, normalizeInputs, preservePhysicalQuantity } from "../unit-normalizer";
import type { ConversionRegistry } from "../contract-types";

const lengthRegistry: ConversionRegistry = {
  length: {
    base_unit: "m",
    unit_family: "LENGTH",
    units: [
      { unit: "in", factor: 0.0254, label: "Inch" },
      { unit: "ft", factor: 0.3048, label: "Foot" },
      { unit: "m", factor: 1, label: "Meter" },
      { unit: "mm", factor: 0.001, label: "Millimeter" },
    ],
  },
  mass: {
    base_unit: "kg",
    unit_family: "MASS",
    units: [
      { unit: "lb", factor: 0.453592, label: "Pound" },
      { unit: "kg", factor: 1, label: "Kilogram" },
      { unit: "g", factor: 0.001, label: "Gram" },
    ],
  },
};

const testSchema = {
  tool_id: "test",
  tool_key: "test-tool",
  meta_schema_version: "5.3",
  metadata: { title: "Test", description: "", category: "general", schema_version: "1.0.0", formula_version: "1.0.0", sector: "general", tool_type: "pro" },
  brand: { brand: "SC", brand_tag: "SC", tier: "pro", profile: "industrial" },
  ui_config: { profile_mode: "GLOBAL", ui_features: [] },
  inputs: [
    { id: "length", name: "Length", quantity_kind: "length", base_unit: "m", unit_si: "m", unit_display: "in", unit_selectable: true, allowed_display_units: ["in", "ft", "m", "mm"], value_type: "number" },
    { id: "mass", name: "Mass", quantity_kind: "mass", base_unit: "kg", unit_si: "kg", unit_display: "lb", unit_selectable: true, allowed_display_units: ["lb", "kg", "g"], value_type: "number" },
  ],
  outputs: [],
  unit_conversion_contract: { unit_system: "GLOBAL", conversion_registry: lengthRegistry },
  references: [],
  uncertainty_contract: null,
  fmea_contract: null,
  audit_trail_contract: null,
  evidence_contract: null,
  guides: [],
};

describe("Unit normalization", () => {
  it("converts inches to meters", () => {
    const result = normalizeInput("length", 12, "in", "m", "length", lengthRegistry);
    if ("baseValue" in result) {
      expect(result.baseValue).toBeCloseTo(0.3048, 4);
    } else {
      expect.fail("Should not return error: " + result.reason);
    }
  });

  it("converts lb to kg", () => {
    const result = normalizeInput("mass", 100, "lb", "kg", "mass", lengthRegistry);
    if ("baseValue" in result) {
      expect(result.baseValue).toBeCloseTo(45.3592, 3);
    } else {
      expect.fail("Should not return error: " + result.reason);
    }
  });

  it("returns error for unknown unit conversion", () => {
    const result = normalizeInput("length", 10, "cubit", "m", "length", lengthRegistry);
    expect("reason" in result).toBe(true);
  });

  it("normalizes all inputs in schema", () => {
    const rawInputs = { length: 12, mass: 100 };
    const selectedUnits = { length: "in", mass: "lb" };
    const result = normalizeInputs(rawInputs, selectedUnits, testSchema, lengthRegistry);
    expect(result.errors.length).toBe(0);
    expect(result.normalized.length.baseValue).toBeCloseTo(0.3048, 3);
    expect(result.normalized.mass.baseValue).toBeCloseTo(45.3592, 3);
  });

  it("preservePhysicalQuantity converts between units", () => {
    const result = preservePhysicalQuantity(12, "in", "ft", "length", lengthRegistry);
    if ("newValue" in result) {
      expect(result.newValue).toBeCloseTo(1, 3);
    } else {
      expect.fail("Should not return error: " + result.reason);
    }
  });
});
