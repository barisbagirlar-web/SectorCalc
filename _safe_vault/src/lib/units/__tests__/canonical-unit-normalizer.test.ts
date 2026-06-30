/**
 * Canonical unit normalizer tests — ADIM 5.
 */

import { describe, expect, test } from "vitest";
import {
  convertValueFromCanonical,
  convertValueToCanonical,
  normalizeToCanonicalUnit,
  resolveDisplayUnitLabel,
  resolveFieldUnitMetadata,
} from "@/lib/units/canonical-unit-normalizer";
import { convertCanonicalUnits, convertUnits } from "@/lib/units/unit-conversions";
import { resolveLocaleDefaultUnitSystem } from "@/lib/units/locale-unit-defaults";
import { lookupCanonicalUnit } from "@/lib/units/unit-definitions";

describe("canonical unit normalizer", () => {
  test("lookup resolves aliases deterministically", () => {
    expect(lookupCanonicalUnit("sqft")?.id).toBe("sqft");
    expect(lookupCanonicalUnit("square feet")?.id).toBe("sqft");
    expect(lookupCanonicalUnit("m²")?.id).toBe("m2");
    expect(lookupCanonicalUnit("USD/hr")?.id).toBe("USD_hr");
  });

  test("metric/imperial length conversion is deterministic", () => {
    const result = convertCanonicalUnits(1, "m", "ft");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeCloseTo(3.280839895, 8);
    }
  });

  test("temperature affine conversion is deterministic", () => {
    const freezing = convertCanonicalUnits(0, "C", "F");
    const boiling = convertCanonicalUnits(100, "C", "F");

    expect(freezing).toEqual({ ok: true, value: 32 });
    expect(boiling).toEqual({ ok: true, value: 212 });
  });

  test("incompatible units return blocked conversion", () => {
    expect(convertUnits(10, "m", "kg")).toEqual({ ok: false, reason: "incompatible_units" });
    expect(convertUnits(10, "unknown", "m")).toEqual({ ok: false, reason: "unknown_unit" });
  });

  test("locale defaults prefer metric for tr/de", () => {
    expect(resolveLocaleDefaultUnitSystem("tr" as any, "areaSize", "area")).toBe("metric");
    expect(resolveLocaleDefaultUnitSystem("de" as any, "squareFeet", "area")).toBe("metric");
  });

  test("en locale applies imperial bias for US field hints", () => {
    expect(resolveLocaleDefaultUnitSystem("en", "areaSize", "area")).toBe("imperial");
    expect(resolveLocaleDefaultUnitSystem("en", "squareFeet", "area")).toBe("imperial");
    expect(resolveLocaleDefaultUnitSystem("en", "laborCost", "currency")).toBe("metric");
  });

  test("infers physical dimension from field key when unit metadata is generic", () => {
    const metadata = resolveFieldUnitMetadata("areaSize", undefined, "dimensionless", "en");

    expect(metadata?.dimension).toBe("area");
    expect(metadata?.canonicalUnit).toBe("m²");
    expect(metadata?.displayUnit).toBe("sq ft");
  });

  test("resolveFieldUnitMetadata exposes canonical and display units", () => {
    const metadata = resolveFieldUnitMetadata("areaSize", "m2", "area", "en");

    expect(metadata).not.toBeNull();
    expect(metadata?.canonicalUnit).toBe("m²");
    expect(metadata?.displayUnit).toBe("sq ft");
    expect(metadata?.unitSystem).toBe("imperial");
    expect(metadata?.convertible).toBe(true);
  });

  test("metric locale keeps metric display for area fields", () => {
    const metadata = resolveFieldUnitMetadata("areaSize", "m2", "area", "tr" as any);

    expect(metadata?.displayUnit).toBe("m²");
    expect(metadata?.unitSystem).toBe("metric");
    expect(metadata?.convertible).toBe(false);
  });

  test("normalizeToCanonicalUnit maps inferred dimensions", () => {
    expect(normalizeToCanonicalUnit("%", "percent")?.unitId).toBe("percent");
    expect(normalizeToCanonicalUnit("USD", "currency")?.unitId).toBe("USD");
    expect(normalizeToCanonicalUnit("hr", "time")?.unitId).toBe("hr");
    expect(normalizeToCanonicalUnit(undefined, "length")?.unitId).toBe("m");
  });

  test("convertValueToCanonical and fromCanonical round-trip area", () => {
    const toCanonical = convertValueToCanonical(100, "sqft", "area");
    expect(toCanonical.ok).toBe(true);
    if (!toCanonical.ok) {
      return;
    }

    const fromCanonical = convertValueFromCanonical(toCanonical.value, "m²", "sq ft");
    expect(fromCanonical.ok).toBe(true);
    if (fromCanonical.ok) {
      expect(fromCanonical.value).toBeCloseTo(100, 6);
    }
  });

  test("resolveDisplayUnitLabel returns locale-aware label", () => {
    expect(resolveDisplayUnitLabel("areaSize", "m2", "area", "en")).toBe("sq ft");
    expect(resolveDisplayUnitLabel("areaSize", "m2", "area", "de" as any)).toBe("m²");
    expect(resolveDisplayUnitLabel("laborCost", "USD", "currency", "en")).toBe("USD");
  });
});
