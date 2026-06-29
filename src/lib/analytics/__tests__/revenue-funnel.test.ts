import { describe, expect, test } from "vitest";
import {
  getPremiumRevenueFix,
  buildPremiumAnalyzerRevenueScore,
  rankPremiumAnalyzersByRevenueIntent,
} from "@/lib/premium-schema/premium-revenue-score";
import {
  getScoreForEvent,
  scoreRevenueIntent,
  REVENUE_FUNNEL_SIGNALS,
} from "@/lib/analytics/revenue-funnel";
import { CAMPAIGN_CLUSTERS } from "@/lib/campaigns/campaign-clusters";
import { rankCampaignsByRevenueIntent } from "@/lib/campaigns/campaign-revenue-score";

describe("revenue funnel", () => {
  test("free_tool_open score low", () => {
    expect(getScoreForEvent("free_tool_open")).toBe(1);
    const signal = REVENUE_FUNNEL_SIGNALS.find((s) => s.eventName === "free_tool_open");
    expect(signal?.signalStrength).toBe("low");
  });

  test("free_tool_calculate score 3", () => {
    expect(getScoreForEvent("free_tool_calculate")).toBe(3);
  });

  test("premium_unlock_click score high", () => {
    expect(getScoreForEvent("premium_unlock_click")).toBe(10);
    const signal = REVENUE_FUNNEL_SIGNALS.find((s) => s.eventName === "premium_unlock_click");
    expect(signal?.signalStrength).toBe("high");
  });

  test("pricing_cta_click score higher", () => {
    expect(getScoreForEvent("pricing_cta_click")).toBeGreaterThan(getScoreForEvent("premium_unlock_click"));
    expect(getScoreForEvent("pricing_cta_click")).toBe(12);
  });

  test("beta_partner_submit generates hot signal", () => {
    expect(getScoreForEvent("beta_partner_submit")).toBe(15);
    const summary = scoreRevenueIntent([{ eventName: "beta_partner_submit" }]);
    expect(summary.totalScore).toBe(15);
    expect(summary.level).toBe("warm");
  });

  test("scoreRevenueIntent empty events returns cold", () => {
    const summary = scoreRevenueIntent([]);
    expect(summary.totalScore).toBe(0);
    expect(summary.level).toBe("cold");
    expect(summary.recommendedAction.length).toBeGreaterThan(0);
  });

  test("scoreRevenueIntent hot events returns hot", () => {
    const summary = scoreRevenueIntent([
      { eventName: "beta_partner_submit" },
      { eventName: "pricing_cta_click" },
      { eventName: "premium_unlock_click" },
    ]);
    expect(summary.totalScore).toBeGreaterThanOrEqual(19);
    expect(summary.level).toBe("hot");
  });

  test("rankCampaigns empty events does not crash", () => {
    const ranked = rankCampaignsByRevenueIntent(CAMPAIGN_CLUSTERS, []);
    expect(ranked.length).toBe(CAMPAIGN_CLUSTERS.length);
    expect(ranked.every((row) => row.level === "cold")).toBe(true);
    expect(ranked.every((row) => row.totalEvents === 0)).toBe(true);
  });

  test("premium revenue score empty events does not crash", () => {
    const score = buildPremiumAnalyzerRevenueScore(
      { slug: "cnc-oee-loss", title: "CNC OEE Loss" },
      [],
    );
    expect(score.opens).toBe(0);
    expect(score.level).toBe("cold");
    expect(score.recommendedFix.length).toBeGreaterThan(0);
  });

  test("recommended fixes not empty", () => {
    const highOpens = buildPremiumAnalyzerRevenueScore(
      { slug: "cnc-oee-loss", title: "CNC OEE Loss" },
      Array.from({ length: 6 }, () => ({
        eventName: "premium_analyzer_open",
        premiumSlug: "cnc-oee-loss",
      })),
    );
    expect(getPremiumRevenueFix(highOpens).length).toBeGreaterThan(0);
    expect(highOpens.recommendedFix.length).toBeGreaterThan(0);

    const ranked = rankPremiumAnalyzersByRevenueIntent(
      [{ slug: "cnc-oee-loss", title: "CNC OEE Loss" }],
      [{ eventName: "premium_unlock_click", premiumSlug: "cnc-oee-loss" }],
    );
    expect(ranked[0]?.recommendedFix.length).toBeGreaterThan(0);
  });
});
