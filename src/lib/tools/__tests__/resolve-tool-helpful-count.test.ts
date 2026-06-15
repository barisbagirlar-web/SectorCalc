import { describe, expect, test } from "vitest";
import { formatToolHelpfulCount, resolveToolHelpfulCount } from "@/lib/tools/resolve-tool-helpful-count";

describe("resolveToolHelpfulCount", () => {
  test("free tools stay within 1890–15000", () => {
    const samples = [
      "vsm-financial-converter",
      "standard-deviation-calculator",
      "machine-hour-estimator",
    ];
    for (const slug of samples) {
      const count = resolveToolHelpfulCount(slug, false);
      expect(count).toBeGreaterThanOrEqual(1890);
      expect(count).toBeLessThanOrEqual(15000);
    }
  });

  test("premium tools stay within 97–4897", () => {
    const samples = [
      "oee-downtime-calculator",
      "quote-risk-analyzer",
      "welding-cost-calculator",
    ];
    for (const slug of samples) {
      const count = resolveToolHelpfulCount(slug, true);
      expect(count).toBeGreaterThanOrEqual(97);
      expect(count).toBeLessThanOrEqual(4897);
    }
  });

  test("same slug always returns the same count", () => {
    expect(resolveToolHelpfulCount("vsm-financial-converter", false)).toBe(
      resolveToolHelpfulCount("vsm-financial-converter", false),
    );
  });

  test("formatToolHelpfulCount uses locale grouping", () => {
    expect(formatToolHelpfulCount(1892, "tr-TR")).toMatch(/1[\.,]892/);
  });
});
