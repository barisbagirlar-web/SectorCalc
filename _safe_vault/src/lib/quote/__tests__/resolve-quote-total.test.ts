import { describe, expect, it } from "vitest";
import {
  applyFireRateToQuoteTotal,
  resolveQuoteBaseTotal,
} from "@/lib/quote/resolve-quote-total";
import type { GeneratedToolResult } from "@/lib/generated-tools/types";

describe("quote totals", () => {
  it("resolves primary output total", () => {
    const result = {
      totalAnnualInventoryCost: 42000,
      breakdown: {},
      hiddenLossDrivers: [],
      suggestedActions: [],
      dataConfidenceAdjusted: 43000,
      premiumRequired: true,
      unit: "",
      premiumFeatures: [],
    } satisfies GeneratedToolResult;

    expect(resolveQuoteBaseTotal(result, "totalAnnualInventoryCost")).toBe(42000);
  });

  it("applies fire rate uplift", () => {
    expect(applyFireRateToQuoteTotal(1000, 5)).toBe(1050);
  });
});
