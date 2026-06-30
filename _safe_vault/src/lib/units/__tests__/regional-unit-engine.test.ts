import { describe, expect, it } from "vitest";
import {
  canConvert,
  convertUnit,
  formatUnit,
  getCanonicalUnit,
  getDefaultUnitForDimension,
  normalizeInputUnits,
  resolveRegionForLocale,
} from "@/lib/units/regional-unit-engine";

const approx = (value: number, expected: number, tolerance = 1e-6) =>
  Math.abs(value - expected) <= tolerance;

describe("regional-unit-engine convertUnit", () => {
  it("converts m to ft", () => {
    expect(approx(convertUnit(1, "m", "ft"), 3.280839895)).toBe(true);
  });

  it("converts ft to m", () => {
    expect(approx(convertUnit(1, "ft", "m"), 0.3048)).toBe(true);
  });

  it("converts kg to lb", () => {
    expect(approx(convertUnit(1, "kg", "lb"), 2.2046226218)).toBe(true);
  });

  it("converts lb to kg", () => {
    expect(approx(convertUnit(1, "lb", "kg"), 0.45359237)).toBe(true);
  });

  it("converts celsius to fahrenheit", () => {
    expect(approx(convertUnit(100, "celsius", "fahrenheit"), 212)).toBe(true);
    expect(approx(convertUnit(0, "celsius", "fahrenheit"), 32)).toBe(true);
  });

  it("converts fahrenheit to celsius", () => {
    expect(approx(convertUnit(212, "fahrenheit", "celsius"), 100)).toBe(true);
    expect(approx(convertUnit(32, "fahrenheit", "celsius"), 0)).toBe(true);
  });

  it("converts acre to m2", () => {
    expect(approx(convertUnit(1, "acre", "m2"), 4046.8564224, 1e-3)).toBe(true);
  });

  it("converts gal_us to liter", () => {
    expect(approx(convertUnit(1, "gal_us", "l"), 3.785411784)).toBe(true);
  });

  it("returns same value for same unit", () => {
    expect(convertUnit(42.5, "kg", "kg")).toBe(42.5);
  });

  it("throws on incompatible dimensions", () => {
    expect(() => convertUnit(1, "m", "kg")).toThrow();
  });

  it("throws on unknown unit", () => {
    expect(() => convertUnit(1, "furlong", "m")).toThrow();
  });

  it("throws on display-only currency conversion", () => {
    expect(() => convertUnit(1, "usd", "eur")).toThrow();
  });
});

describe("regional-unit-engine helpers", () => {
  it("canConvert is true for same dimension convertibles", () => {
    expect(canConvert("kg", "lb")).toBe(true);
    expect(canConvert("celsius", "fahrenheit")).toBe(true);
  });

  it("canConvert is false for cross dimension and display-only", () => {
    expect(canConvert("m", "kg")).toBe(false);
    expect(canConvert("usd", "eur")).toBe(false);
    expect(canConvert("m", "unknown")).toBe(false);
  });

  it("getCanonicalUnit returns the dimension base unit", () => {
    expect(getCanonicalUnit("ft")).toBe("m");
    expect(getCanonicalUnit("lb")).toBe("kg");
    expect(getCanonicalUnit("fahrenheit")).toBe("celsius");
  });

  it("getCanonicalUnit throws on unknown", () => {
    expect(() => getCanonicalUnit("zzz")).toThrow();
  });
});

describe("normalizeInputUnits", () => {
  it("normalizes number fields and records a trace", () => {
    const { normalizedInput, conversionTrace } = normalizeInputUnits(
      { length: 10, weight: 5, label: "beam", flag: true },
      { length: "ft", weight: "lb" },
    );
    expect(approx(normalizedInput.length as number, 3.048)).toBe(true);
    expect(approx(normalizedInput.weight as number, 2.26796185)).toBe(true);
    expect(normalizedInput.label).toBe("beam");
    expect(normalizedInput.flag).toBe(true);
    expect(conversionTrace).toHaveLength(2);
    expect(conversionTrace[0]).toMatchObject({ field: "length", fromUnit: "ft", toUnit: "m" });
  });

  it("leaves non-number values untouched and skips canonical fields", () => {
    const { normalizedInput, conversionTrace } = normalizeInputUnits(
      { a: "text", b: 3 },
      { a: "ft", b: "m" },
    );
    expect(normalizedInput.a).toBe("text");
    expect(normalizedInput.b).toBe(3);
    expect(conversionTrace).toHaveLength(0);
  });
});

describe("regional profiles", () => {
  it("resolves locale to region", () => {
    expect(resolveRegionForLocale("en")).toBe("global");
    expect(resolveRegionForLocale("tr")).toBe("tr");
    expect(resolveRegionForLocale("de")).toBe("eu");
    expect(resolveRegionForLocale("ar")).toBe("mena");
    expect(resolveRegionForLocale("xx")).toBe("global");
  });

  it("exposes default units per region", () => {
    expect(getDefaultUnitForDimension("us", "length")).toBe("ft");
    expect(getDefaultUnitForDimension("eu", "length")).toBe("m");
    expect(getDefaultUnitForDimension("tr", "currency")).toBe("try");
  });

  it("formats values with symbols", () => {
    expect(formatUnit(3.5, "kg")).toBe("3.5 kg");
    expect(formatUnit(20, "celsius")).toBe("20°C");
  });
});
