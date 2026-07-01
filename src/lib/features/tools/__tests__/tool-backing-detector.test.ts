import { describe, expect, test } from "vitest";
import { resolveToolFormPresence, resolveToolCalculationAllowed } from "@/components/tools/resolve-tool-form-presence";
import { evaluateRuntimeTrust } from "@/lib/features/tools/runtime-trust-engine";
import {
  checkToolBacking,
  isToolBackingActivationEligible,
  P8_SAFETY_BLOCKED_SLUGS,
} from "@/lib/features/tools/tool-backing-detector";
import { isGuideExplicitlyBlocked } from "@/lib/features/tools/guide/tool-guide-blocklist";

describe("P8 tool backing detector", () => {
  test("7-israf backing is complete and activation eligible", () => {
    const backing = checkToolBacking("7-israf-muda-avcisi-parasal-karsilik-calculator");
    expect(backing.isComplete).toBe(true);
    expect(isToolBackingActivationEligible("7-israf-muda-avcisi-parasal-karsilik-calculator")).toBe(true);
  });

  test("cnc-quote backing is complete despite P24 WARN", () => {
    const backing = checkToolBacking("cnc-quote-risk-analyzer");
    expect(backing.isComplete).toBe(true);
    const trust = evaluateRuntimeTrust({
      slug: "cnc-quote-risk-analyzer",
      locale: "tr",
      surface: "premium",
    });
    expect(trust.calculationEligible).toBe(true);
    expect(trust.paymentEligible).toBe(false);
    expect(trust.findings).not.toContain("audit_status_not_pass");
  });

  test("feed-efficiency-analyzer stays safety blocked", () => {
    expect(P8_SAFETY_BLOCKED_SLUGS.has("feed-efficiency-analyzer")).toBe(true);
    expect(checkToolBacking("feed-efficiency-analyzer").isComplete).toBe(false);
    expect(isGuideExplicitlyBlocked("feed-efficiency-analyzer")).toBe(true);
    expect(
      resolveToolFormPresence({
        slug: "feed-efficiency-analyzer",
        locale: "tr",
        surface: "premium",
      }),
    ).toBe(false);
    const trust = evaluateRuntimeTrust({
      slug: "feed-efficiency-analyzer",
      locale: "tr",
      surface: "premium",
    });
    expect(trust.calculationEligible).toBe(false);
  });

  test("problem slug stays hard locked", () => {
    expect(
      resolveToolFormPresence({
        slug: "abonelik-yazilim-cloud-yillik-maliyet-calc",
        locale: "tr",
        surface: "premium",
      }),
    ).toBe(false);
    const trust = evaluateRuntimeTrust({
      slug: "abonelik-yazilim-cloud-yillik-maliyet-calc",
      locale: "tr",
      surface: "premium",
    });
    expect(trust.calculationEligible).toBe(false);
  });

  test("3d-print-job-margin-tool calculation allowed when backing complete", () => {
    expect(checkToolBacking("3d-print-job-margin-tool").isComplete).toBe(true);
    const trust = evaluateRuntimeTrust({
      slug: "3d-print-job-margin-tool",
      locale: "en",
      surface: "premium",
    });
    expect(trust.calculationEligible).toBe(true);
    expect(
      resolveToolCalculationAllowed({
        slug: "3d-print-job-margin-tool",
        locale: "en",
        surface: "premium",
        calculationEligible: trust.calculationEligible,
        tier: trust.tier,
      }),
    ).toBe(true);
  });
});
