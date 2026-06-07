import { describe, expect, test } from "vitest";
import {
  calculateGrowthBacklogTotalScore,
  scoreGrowthBacklogItem,
  type GrowthBacklogItem,
} from "@/lib/growth/growth-backlog-score";

function buildItem(overrides: Partial<GrowthBacklogItem> = {}): GrowthBacklogItem {
  return {
    id: "item_1",
    title: "Test item",
    category: "revenue",
    priority: "P2",
    status: "new",
    effort: "S",
    risk: "low",
    isBlocker: false,
    isIndexingBlocker: false,
    hasEvidence: true,
    scores: {
      revenueImpact: 0,
      trafficImpact: 0,
      conversionImpact: 0,
      userPainEvidence: 0,
      seoEvidence: 0,
      implementationEffort: -1,
      technicalRisk: -1,
      maintenanceCost: -1,
    },
    ...overrides,
  };
}

describe("growth-backlog-score", () => {
  test("high revenue + low effort becomes candidate", () => {
    const result = scoreGrowthBacklogItem(
      buildItem({
        scores: {
          revenueImpact: 5,
          trafficImpact: 4,
          conversionImpact: 4,
          userPainEvidence: 4,
          seoEvidence: 2,
          implementationEffort: -1,
          technicalRisk: -1,
          maintenanceCost: -1,
        },
      })
    );
    expect(result.totalScore).toBeGreaterThanOrEqual(15);
    expect(result.band).toBe("candidate");
    expect(result.sprintEligible).toBe(true);
  });

  test("low score is parked", () => {
    const result = scoreGrowthBacklogItem(
      buildItem({
        hasEvidence: false,
        scores: {
          revenueImpact: 1,
          trafficImpact: 1,
          conversionImpact: 0,
          userPainEvidence: 0,
          seoEvidence: 1,
          implementationEffort: -5,
          technicalRisk: -5,
          maintenanceCost: -5,
        },
      })
    );
    expect(result.totalScore).toBeLessThan(5);
    expect(result.band).toBe("parked");
    expect(result.recommendedStatus).toBe("needs_data");
    expect(result.sprintEligible).toBe(false);
  });

  test("blocker becomes P0 and sprint eligible", () => {
    const result = scoreGrowthBacklogItem(
      buildItem({
        isBlocker: true,
        priority: "P2",
        scores: {
          revenueImpact: 2,
          trafficImpact: 0,
          conversionImpact: 1,
          userPainEvidence: 2,
          seoEvidence: 0,
          implementationEffort: -2,
          technicalRisk: -2,
          maintenanceCost: -1,
        },
      })
    );
    expect(result.effectivePriority).toBe("P0");
    expect(result.sprintEligible).toBe(true);
    expect(result.recommendedStatus).toBe("candidate");
  });

  test("needs_data without evidence does not enter sprint", () => {
    const result = scoreGrowthBacklogItem(
      buildItem({
        status: "needs_data",
        hasEvidence: false,
        scores: {
          revenueImpact: 5,
          trafficImpact: 5,
          conversionImpact: 5,
          userPainEvidence: 5,
          seoEvidence: 5,
          implementationEffort: -1,
          technicalRisk: -1,
          maintenanceCost: -1,
        },
      })
    );
    expect(result.totalScore).toBeGreaterThanOrEqual(15);
    expect(result.sprintEligible).toBe(false);
  });

  test("negative risk score lowers total", () => {
    const lowRiskTotal = calculateGrowthBacklogTotalScore({
      revenueImpact: 4,
      trafficImpact: 4,
      conversionImpact: 4,
      userPainEvidence: 3,
      seoEvidence: 2,
      implementationEffort: -1,
      technicalRisk: -1,
      maintenanceCost: -1,
    });
    const highRiskTotal = calculateGrowthBacklogTotalScore({
      revenueImpact: 4,
      trafficImpact: 4,
      conversionImpact: 4,
      userPainEvidence: 3,
      seoEvidence: 2,
      implementationEffort: -1,
      technicalRisk: -5,
      maintenanceCost: -1,
    });
    expect(highRiskTotal).toBeLessThan(lowRiskTotal);
    expect(lowRiskTotal - highRiskTotal).toBe(4);
  });
});
