import { describe, expect, test } from "vitest";
import {
  formatLocalizedCurrency,
  formatLocalizedNumber,
  formatLocalizedPercent,
  getDefaultCurrency,
  getDefaultUnitSystem,
  getFreeToolLegalNote,
  getPremiumLegalNote,
  NOT_AVAILABLE,
  normalizeLocale,
} from "@/lib/format/localization";

describe("localization helpers", () => {
  test("formatLocalizedNumber en works", () => {
    expect(formatLocalizedNumber(1234.5, "en")).toBe("1,234.5");
  });

  test("formatLocalizedNumber tr works", () => {
    expect(formatLocalizedNumber(1234.5, "tr")).toBe("1.234,5");
  });

  test("NaN => Not available", () => {
    expect(formatLocalizedNumber(Number.NaN, "en")).toBe(NOT_AVAILABLE);
  });

  test("Infinity => Not available", () => {
    expect(formatLocalizedNumber(Number.POSITIVE_INFINITY, "en")).toBe(NOT_AVAILABLE);
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

  test("legal note EN/TR boş değil", () => {
    expect(getFreeToolLegalNote("en").trim().length).toBeGreaterThan(0);
    expect(getFreeToolLegalNote("tr").trim().length).toBeGreaterThan(0);
    expect(getPremiumLegalNote("en").trim().length).toBeGreaterThan(0);
    expect(getPremiumLegalNote("tr").trim().length).toBeGreaterThan(0);
  });

  test("normalizeLocale maps tr variants", () => {
    expect(normalizeLocale("tr")).toBe("tr");
    expect(normalizeLocale("tr-TR")).toBe("tr");
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale(undefined)).toBe("en");
  });
});
