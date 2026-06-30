import { describe, expect, test } from "vitest";
import { createLocalizedCopy } from "@/lib/content/locale-center/localized-copy";
import { collectLocaleKeyParityGaps } from "@/lib/content/locale-center/locale-dictionary";
import {
  formatMoney,
  formatNumber,
  formatPercent,
} from "@/lib/content/locale-center/formatters";
import { getDefaultCurrency, getDefaultUnit, getUnitOptions } from "@/lib/content/locale-center/unit-currency-center";
import { resolveLocaleContext } from "@/lib/content/locale-center/locale-resolver";
import { buildLocaleIntegrityReport } from "@/lib/content/locale-center/locale-integrity-report";

describe("locale-center", () => {
  test("resolveLocaleContext maps en to GLOBAL region and ltr", () => {
    const ctx = resolveLocaleContext("en");
    expect(ctx.locale).toBe("en");
    expect(ctx.region).toBe("GLOBAL");
    expect(ctx.isRtl).toBe(false);
  });

  test("createLocalizedCopy resolves nav.freeCalculators", () => {
    const copy = createLocalizedCopy("en", { allowRuntimeFallback: false });
    expect(copy("nav.freeCalculators")).toContain("Free");
  });

  test("formatters use locale-aware output", () => {
    expect(formatNumber(1234.5, "en")).toContain("1");
    expect(formatPercent(12.5, "en")).toContain("%");
    expect(formatMoney(100, "en", "USD", "GLOBAL")).toMatch(/100|\$/);
  });

  test("unit defaults follow region", () => {
    expect(getDefaultUnit("en", "GLOBAL", "length")).toBe("m");
    expect(getDefaultCurrency("en", "GLOBAL")).toBe("USD");
    expect(getDefaultUnit("en", "US", "length")).toBe("ft");
    const options = getUnitOptions("en", "GLOBAL", "length");
    expect(options.some((opt) => opt.value === "m")).toBe(true);
    expect(options[0]?.label).toContain("meter");
  });

  test("message key parity gaps are bounded", () => {
    const gaps = collectLocaleKeyParityGaps();
    expect(gaps.length).toBeLessThanOrEqual(5);
  });

  test("integrity report structure", () => {
    const report = buildLocaleIntegrityReport();
    expect(report).toHaveProperty("passed");
    expect(report).toHaveProperty("localeKeyGaps");
  });
});
