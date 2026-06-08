/**
 * Smart form rollout expansion tests — Phase 5I-H.
 */

import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { runSmartFormRolloutExpansionAudit } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-batch-audit";
import { resolveRolloutCategory } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-eligibility";
import { resolveGovernanceSlugFromRoute } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-route-map";
import {
  buildPayloadForSubmit,
  buildRolloutPayloadPlan,
} from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-payload-plan";
import {
  resolveSmartFormForRoute,
  shouldFallbackToClassicForm,
} from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-fallback-policy";

describe("smart form rollout expansion — Phase 5I-H", () => {
  test("first 3 live pilots remain live_already", () => {
    for (const slug of ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS) {
      expect(resolveRolloutCategory(slug)).toBe("live_already");
    }
    const audit = runSmartFormRolloutExpansionAudit();
    expect(audit.liveAlready).toBe(3);
    expect(audit.rollbackSafe).toBe(true);
  });

  test("free route mapping is deterministic", () => {
    expect(resolveGovernanceSlugFromRoute("repair-time-vs-price-check")).toBe(
      "auto-shop-margin-leak-detector",
    );
    expect(resolveGovernanceSlugFromRoute("3d-print-cost-check")).toBe("3d-print-cost-check");
  });

  test("governance slug alias resolves correctly", () => {
    expect(resolveGovernanceSlugFromRoute("hvac-tonnage-rule-check")).toBe("hvac-project-margin-guard");
    expect(resolveGovernanceSlugFromRoute("laser-cutting-time-check")).toBe("sheet-metal-quote-risk-tool");
  });

  test("premium-only tools are not calculation bridge eligible", () => {
    expect(resolveRolloutCategory("millwork-bid-risk-analyzer")).toBe(
      "premium_only_requires_later_gate",
    );
    const audit = runSmartFormRolloutExpansionAudit();
    expect(audit.addedPayloadBridges).not.toContain("millwork-bid-risk-analyzer");
  });

  test("derived and assumption keys excluded from payload", () => {
    const plan = buildRolloutPayloadPlan("3d-print-cost-check", false);
    const payload = buildPayloadForSubmit(
      "3d-print-cost-check",
      {
        materialCost: 10,
        derivedTotal: 99,
        assumptionRate: 5,
        printHours: 2,
        machineRate: 3,
      },
      false,
    );
    expect(payload).not.toHaveProperty("derivedTotal");
    expect(payload).not.toHaveProperty("assumptionRate");
    expect(plan.excludedDerivedKeys.length + plan.excludedAssumptionKeys.length).toBeGreaterThanOrEqual(0);
  });

  test("optional keys excluded when gate closed", () => {
    const plan = buildRolloutPayloadPlan("electrical-labor-estimator", false);
    const withOptional = buildPayloadForSubmit(
      "electrical-labor-estimator",
      { materialCost: 1, laborHours: 2, laborRate: 3, optionalBuffer: 4 },
      false,
    );
    expect(withOptional).not.toHaveProperty("optionalBuffer");
    expect(plan.optionalGateOpen).toBe(false);
  });

  test("unsupported slug falls back to classic form", () => {
    expect(shouldFallbackToClassicForm("unknown-tool-slug")).toBe(true);
    expect(resolveSmartFormForRoute("unknown-tool-slug")).toBe("classic_form");
  });

  describe("feature flag fallback", () => {
    const original = process.env.NEXT_PUBLIC_SMART_FORM_PILOT;

    beforeEach(() => {
      process.env.NEXT_PUBLIC_SMART_FORM_PILOT = "false";
    });

    afterEach(() => {
      process.env.NEXT_PUBLIC_SMART_FORM_PILOT = original;
    });

    test("flag false yields classic form", () => {
      expect(resolveSmartFormForRoute("3d-print-cost-check")).toBe("classic_form");
    });
  });

  describe("flag true eligible slug", () => {
    const original = process.env.NEXT_PUBLIC_SMART_FORM_PILOT;

    beforeEach(() => {
      process.env.NEXT_PUBLIC_SMART_FORM_PILOT = "true";
    });

    afterEach(() => {
      process.env.NEXT_PUBLIC_SMART_FORM_PILOT = original;
    });

    test("flag true eligible slug yields smart form", () => {
      expect(resolveSmartFormForRoute("3d-print-cost-check")).toBe("smart_form");
      expect(resolveSmartFormForRoute("electrical-labor-estimator")).toBe("smart_form");
    });
  });

  test("batch audit produces deterministic categories", () => {
    const first = runSmartFormRolloutExpansionAudit();
    const second = runSmartFormRolloutExpansionAudit();
    expect(first).toEqual(second);
    expect(first.totalCompletedPatchTools).toBe(15);
  });
});
