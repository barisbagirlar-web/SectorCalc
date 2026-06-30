import { describe, expect, it } from "vitest";
import { formatOutputValue, formatRegionalCurrency, getAvailableUnitsForQuantity, getDefaultCurrency, getDefaultUnitSystem, getRegionConfig, getRegionalBenchmark, getRegionalParameterOptions, normalizeInputValue, resolveRegionalCalculationContext } from "@/lib/features/regional/regional-engine";
import { getLocaleDecimalSeparator } from "@/lib/features/regional/regional-formatting";

describe("regional engine", () => {
  it("TR defaults to metric + TRY", () => {
    expect(getDefaultUnitSystem("TR")).toBe("metric");
    expect(getDefaultCurrency("TR")).toBe("TRY");
    expect(getRegionConfig("TR").decimalSeparator).toBe(",");
  });
  it("US defaults to imperial + USD", () => {
    expect(getDefaultUnitSystem("US")).toBe("imperial");
    expect(getDefaultCurrency("US")).toBe("USD");
  });
  it("DE defaults to metric + EUR", () => {
    expect(getDefaultUnitSystem("DE")).toBe("metric");
    expect(getDefaultCurrency("DE")).toBe("EUR");
  });
  it("converts inch to meter", () => {
    const result = normalizeInputValue({ value: 1, unit: "in", quantityType: "length" });
    expect(result.ok).toBe(true);
    if (result.ok) { expect(result.canonicalUnit).toBe("m"); expect(result.canonicalValue).toBeCloseTo(0.0254, 4); }
  });
  it("converts lb to kg", () => {
    const result = normalizeInputValue({ value: 1, unit: "lb", quantityType: "mass" });
    expect(result.ok).toBe(true);
    if (result.ok) { expect(result.canonicalUnit).toBe("kg"); expect(result.canonicalValue).toBeCloseTo(0.453592, 3); }
  });
  it("converts ft2 to m2", () => {
    const result = normalizeInputValue({ value: 10, unit: "ft2", quantityType: "area" });
    expect(result.ok).toBe(true);
    if (result.ok) { expect(result.canonicalUnit).toBe("m2"); expect(result.canonicalValue).toBeCloseTo(0.92903, 3); }
  });
  it("returns error for unsupported unit", () => {
    const result = normalizeInputValue({ value: 5, unit: "parsec", quantityType: "length" });
    expect(result.ok).toBe(false);
  });
  it("formats TR decimal separator as comma", () => {
    expect(getLocaleDecimalSeparator("tr" as any)).toBe(",");
  });
  it("formats TRY currency", () => {
    const formatted = formatRegionalCurrency(1250.5, "tr" as any, "TR", "TRY");
    expect(formatted).toMatch(/₺|TRY/);
  });
  it("benchmarks return not_configured", () => {
    expect(getRegionalBenchmark({ benchmarkKey: "x", regionCode: "TR" }).status).toBe("not_configured");
  });
  it("resolves TR context", () => {
    const ctx = resolveRegionalCalculationContext({ locale: "tr" as any, toolSlug: "loan-payment-calculator" });
    expect(ctx.regionCode).toBe("TR");
    expect(ctx.currency).toBe("TRY");
  });
  it("US imperial length units", () => {
    expect(getAvailableUnitsForQuantity("length", "US")[0]).toBe("in");
  });
  it("formats localized number", () => {
    expect(formatOutputValue({ canonicalValue: 1234.5, quantityType: "count", locale: "tr" as any }).formatted).toMatch(/1[\.,]234/);
  });
  it("currency options for TR", () => {
    const options = getRegionalParameterOptions({ toolSlug: "loan-payment-calculator", parameterKey: "currency", regionCode: "TR" });
    expect((options.value as readonly string[]).includes("TRY")).toBe(true);
  });
});
