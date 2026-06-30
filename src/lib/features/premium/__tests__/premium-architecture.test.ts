import { describe, expect, test } from "vitest";
import { PREMIUM_DECISION_QUESTIONS } from "@/lib/features/premium/premium-architecture";
import {
  SECTOR_LOSS_REGISTRY,
  getPremiumArchitectureProfile,
  listMvpLossFamilySlugs,
} from "@/lib/features/premium/sector-loss-registry";
import { listPremiumContractSlugs } from "@/lib/features/tools/premium-decision-engine";

describe("premium-architecture-reset-v1", () => {
  test("27 architecture profiles match premium contract slugs", () => {
    const contractSlugs = listPremiumContractSlugs();
    expect(SECTOR_LOSS_REGISTRY.length).toBe(27);
    for (const slug of contractSlugs) {
      expect(getPremiumArchitectureProfile(slug)).not.toBeNull();
    }
  });

  test("every profile has measurement, loss and optimization engine modes", () => {
    for (const profile of SECTOR_LOSS_REGISTRY) {
      const modes = profile.engineModes.map((m) => m.mode);
      expect(modes).toContain("measurement");
      expect(modes).toContain("loss");
      expect(modes).toContain("optimization");
      expect(profile.engineModes.length).toBe(3);
    }
  });

  test("every profile answers at least one decision question via copy", () => {
    for (const profile of SECTOR_LOSS_REGISTRY) {
      const blob = [
        profile.whatIsMeasured,
        profile.whereIsLoss,
        profile.toleranceFocus,
        profile.reclassifiedPromise,
        ...profile.lossTypeLabels,
      ].join(" ");
      expect(blob.length).toBeGreaterThan(40);
      expect(profile.lossImpacts.length).toBeGreaterThanOrEqual(2);
    }
    expect(PREMIUM_DECISION_QUESTIONS.length).toBe(5);
  });

  test("MVP loss family covers 5 anchor sectors", () => {
    const mvp = listMvpLossFamilySlugs();
    expect(mvp.length).toBeGreaterThanOrEqual(8);
    expect(mvp).toContain("cnc-quote-risk-analyzer");
    expect(mvp).toContain("change-order-impact-analyzer");
    expect(mvp).toContain("route-optimization-analyzer");
    expect(mvp).toContain("energy-efficiency-report");
    expect(mvp).toContain("menu-profit-leak-detector");
    expect(mvp).toContain("crop-yield-loss-analyzer");
  });

  test("reclassified titles are not quote-only language", () => {
    for (const profile of SECTOR_LOSS_REGISTRY) {
      expect(profile.reclassifiedTitle.toLowerCase()).not.toMatch(/^minimum safe quote$/);
      expect(profile.reclassifiedTitle).toMatch(/report|loss|exposure|efficiency|yield|route/i);
    }
  });
});
