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
} from "@/lib/core/format/localization";

describe("localization helpers", () => {
  test("formatLocalizedNumber en works", () => {
    expect(formatLocalizedNumber(1234.5, "en")).toBe("1,234.5");
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

  test("formatLocalizedPercent works", () => {
    expect(formatLocalizedPercent(12.3, "en")).toBe("12.3%");
  });

  test("getDefaultCurrency en USD", () => {
    expect(getDefaultCurrency("en")).toBe("USD");
  });

  test("getDefaultUnitSystem en metric", () => {
    expect(getDefaultUnitSystem("en")).toBe("metric");
  });

  test("legal note EN not empty", () => {
    expect(getFreeToolLegalNote("en").trim().length).toBeGreaterThan(0);
    expect(getPremiumLegalNote("en").trim().length).toBeGreaterThan(0);
  });

  test("normalizeLocale maps supported locales", () => {
    expect(normalizeLocale("tr")).toBe("en");
    expect(normalizeLocale("de")).toBe("en");
    expect(normalizeLocale("fr")).toBe("en");
    expect(normalizeLocale("es")).toBe("en");
    expect(normalizeLocale("ar")).toBe("en");
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale(undefined)).toBe("en");
  });
});
