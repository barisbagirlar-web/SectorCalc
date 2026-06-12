import { describe, expect, test } from "vitest";
import { createLocalizedCopy } from "@/lib/locale-center/localized-copy";
import { collectLocaleKeyParityGaps } from "@/lib/locale-center/locale-dictionary";
import {
  formatMoney,
  formatNumber,
  formatPercent,
} from "@/lib/locale-center/formatters";
import { getDefaultCurrency, getDefaultUnit, getUnitOptions } from "@/lib/locale-center/unit-currency-center";
import { resolveLocaleContext } from "@/lib/locale-center/locale-resolver";
import { buildLocaleIntegrityReport } from "@/lib/locale-center/locale-integrity-report";

describe("locale-center", () => {
  test("resolveLocaleContext maps tr to TR region and ltr", () => {
    const ctx = resolveLocaleContext("tr");
    expect(ctx.locale).toBe("tr");
    expect(ctx.region).toBe("TR");
    expect(ctx.isRtl).toBe(false);
  });

  test("resolveLocaleContext maps ar to rtl", () => {
    const ctx = resolveLocaleContext("ar");
    expect(ctx.locale).toBe("ar");
    expect(ctx.isRtl).toBe(true);
  });

  test("createLocalizedCopy resolves nav.freeCalculators", () => {
    const copy = createLocalizedCopy("tr", { allowRuntimeFallback: false });
    expect(copy("nav.freeCalculators")).toContain("Ücretsiz");
  });

  test("formatters use locale-aware output", () => {
    expect(formatNumber(1234.5, "tr")).toContain("1");
    expect(formatPercent(12.5, "en")).toContain("%");
    expect(formatMoney(100, "tr", "TRY", "TR")).toMatch(/100|₺|TRY/);
  });

  test("unit defaults follow region", () => {
    expect(getDefaultUnit("tr", "TR", "length")).toBe("m");
    expect(getDefaultCurrency("tr", "TR")).toBe("TRY");
    expect(getDefaultUnit("en", "US", "length")).toBe("ft");
    const options = getUnitOptions("tr", "TR", "length");
    expect(options.some((opt) => opt.value === "m")).toBe(true);
    expect(options[0]?.label).toContain("metre");
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
