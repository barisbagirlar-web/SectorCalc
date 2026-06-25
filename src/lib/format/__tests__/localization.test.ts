import { describe, expect, test } from "vitest";
import {
  formatLocalizedCurrency,
  formatLocalizedNumber,
  formatLocalizedPercent,
  getDefaultCurrency,
  getDefaultUnitSystem,
  getFreeToolLegalNote,
  getLocalizedLegalNote,
  getLocalizedNotAvailable,
  getPremiumLegalNote,
  normalizeLocale,
} from "@/lib/format/localization";

describe("localization helpers", () => {
  test("formatLocalizedNumber en works", () => {
    expect(formatLocalizedNumber(1234.5, "en")).toBe("1,234.5");
  });

  test("formatLocalizedNumber tr works", () => {
    expect(formatLocalizedNumber(1234.5, "tr")).toBe("1.234,5");
  });

  test("NaN => localized not available", () => {
    expect(formatLocalizedNumber(Number.NaN, "en")).toBe("Not available");
  });

  test("Infinity => localized not available", () => {
    expect(formatLocalizedNumber(Number.POSITIVE_INFINITY, "en")).toBe("Not available");
  });

  test("formatLocalizedCurrency USD en works", () => {
    expect(formatLocalizedCurrency(1200, "en", "USD", { maximumFractionDigits: 0 })).toBe("$1,200");
  });

  test("formatLocalizedCurrency TRY tr works", () => {
    const formatted = formatLocalizedCurrency(1200, "tr", "TRY", { maximumFractionDigits: 0 });
    expect(formatted).toContain("1.200");
    expect(formatted).toMatch(/TRY|₺/);
  });

  test("formatLocalizedPercent works", () => {
    expect(formatLocalizedPercent(12.3, "en")).toBe("12.3%");
    expect(formatLocalizedPercent(12.3, "tr")).toBe("12,3%");
  });

  test("getDefaultCurrency en USD", () => {
    expect(getDefaultCurrency("en")).toBe("USD");
  });

  test("getDefaultUnitSystem tr metric", () => {
    expect(getDefaultUnitSystem("tr")).toBe("metric");
  });

  test("legal note EN/TR not empty", () => {
    expect(getFreeToolLegalNote("en").trim().length).toBeGreaterThan(0);
    expect(getPremiumLegalNote("en").trim().length).toBeGreaterThan(0);
  });

  test("normalizeLocale maps supported locales", () => {
    expect(normalizeLocale("tr")).toBe("tr");
    expect(normalizeLocale("de")).toBe("de");
    expect(normalizeLocale("fr")).toBe("fr");
    expect(normalizeLocale("es")).toBe("es");
    expect(normalizeLocale("ar")).toBe("ar");
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale(undefined)).toBe("en");
  });

  test("tr TRY default currency", () => {
    expect(getDefaultCurrency("tr")).toBe("TRY");
  });

  test("de EUR default currency", () => {
    expect(getDefaultCurrency("de")).toBe("EUR");
  });

  test("fr EUR default currency", () => {
    expect(getDefaultCurrency("fr")).toBe("EUR");
  });

  test("es EUR default currency", () => {
    expect(getDefaultCurrency("es")).toBe("EUR");
  });

  test("ar USD default currency", () => {
    expect(getDefaultCurrency("ar")).toBe("USD");
  });

  test("ar not available Arabic", () => {
    expect(getLocalizedNotAvailable("ar")).toBe("غير متاح");
  });

  test("ar legal note Arabic", () => {
    expect(getLocalizedLegalNote("ar")).toContain("هذه النتيجة");
    expect(getFreeToolLegalNote("ar").trim().length).toBeGreaterThan(0);
    expect(getPremiumLegalNote("ar").trim().length).toBeGreaterThan(0);
  });
});
