import { describe, expect, test } from "vitest";
import { evaluateOfflineCalculatorPolicy, assertPremiumNeverOffline } from "@/lib/infrastructure/pwa/offline-calculator-policy";

describe("offline calculator policy", () => {
  test("free vat calculator may be offline-safe", () => {
    const result = evaluateOfflineCalculatorPolicy({ slug: "vat-calculator", tier: "free" });
    expect(result.allowedOffline).toBe(true);
  });

  test("premium tools are never offline-safe", () => {
    const result = evaluateOfflineCalculatorPolicy({
      slug: "welding-bid-risk-analyzer",
      tier: "premium",
    });
    expect(result.allowedOffline).toBe(false);
    expect(result.blockedFeatures.length).toBeGreaterThan(0);
    expect(() => assertPremiumNeverOffline("welding-bid-risk-analyzer", "premium")).not.toThrow();
  });

  test("unknown free slug defaults to online required", () => {
    const result = evaluateOfflineCalculatorPolicy({ slug: "unknown-tool", tier: "free" });
    expect(result.allowedOffline).toBe(false);
  });
});
