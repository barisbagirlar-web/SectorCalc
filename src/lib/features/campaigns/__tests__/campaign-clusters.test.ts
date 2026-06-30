import { describe, expect, test } from "vitest";
import {
  buildCampaignUrl,
  CAMPAIGN_CLUSTERS,
  getCampaignClusterById,
} from "@/lib/features/campaigns/campaign-clusters";
import { buildTrackedCtaHref } from "@/lib/features/campaigns/campaign-links";
import {
  buildUtmHref,
  sanitizeAttributionContext,
} from "@/lib/infrastructure/analytics/attribution";
import {
  isSectorCalcEventName,
  SECTORCALC_EVENTS,
  trackSectorCalcEvent,
} from "@/lib/infrastructure/analytics/event-taxonomy";

describe("campaign clusters", () => {
  test("CAMPAIGN_CLUSTERS length === 8", () => {
    expect(CAMPAIGN_CLUSTERS.length).toBe(8);
  });

  test("each cluster id is unique", () => {
    const ids = CAMPAIGN_CLUSTERS.map((cluster) => cluster.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("each cluster landingHref is populated", () => {
    for (const cluster of CAMPAIGN_CLUSTERS) {
      expect(cluster.landingHref.trim().length).toBeGreaterThan(0);
    }
  });

  test("each cluster has at least 2 free tool hrefs", () => {
    for (const cluster of CAMPAIGN_CLUSTERS) {
      expect(cluster.freeToolHrefs.length).toBeGreaterThanOrEqual(2);
    }
  });

  test("each cluster has at least 1 premium analyzer href", () => {
    for (const cluster of CAMPAIGN_CLUSTERS) {
      expect(cluster.premiumAnalyzerHrefs.length).toBeGreaterThanOrEqual(1);
    }
  });

  test("buildCampaignUrl adds utm parameters", () => {
    const url = buildCampaignUrl(
      "/seo/manufacturing-cost-calculators",
      "manufacturing-hidden-loss",
      "linkedin",
      "social"
    );
    expect(url).toContain("utm_source=linkedin");
    expect(url).toContain("utm_medium=social");
    expect(url).toContain("utm_campaign=manufacturing-hidden-loss");
  });

  test("buildCampaignUrl preserves existing query params", () => {
    const url = buildCampaignUrl(
      "/pricing?plan=pro",
      "manufacturing-hidden-loss",
      "email",
      "newsletter"
    );
    expect(url).toContain("plan=pro");
    expect(url).toContain("utm_source=email");
  });

  test("buildTrackedCtaHref preserves existing query params", () => {
    const href = buildTrackedCtaHref(
      "/pricing?plan=pro",
      "logistics-route-cost",
      "seo_hub",
      "pricing"
    );
    expect(href).toContain("plan=pro");
    expect(href).toContain("utm_campaign=logistics-route-cost");
  });

  test("sanitizeAttributionContext handles empty input safely", () => {
    expect(sanitizeAttributionContext(undefined)).toEqual({});
    expect(sanitizeAttributionContext({})).toEqual({});
    expect(() => sanitizeAttributionContext({ utmSource: "  linkedin  " })).not.toThrow();
  });

  test("event taxonomy includes valid event names", () => {
    expect(isSectorCalcEventName("free_to_premium_click")).toBe(true);
    expect(isSectorCalcEventName("not_a_real_event")).toBe(false);
    expect(Object.keys(SECTORCALC_EVENTS).length).toBeGreaterThanOrEqual(14);
  });

  test("trackSectorCalcEvent does not crash in production mode", () => {
    expect(() =>
      trackSectorCalcEvent({
        eventName: "pricing_cta_click",
        locale: "en",
        pagePath: "/pricing",
        ctaId: "pricing_pro_start",
      })
    ).not.toThrow();
  });

  test("getCampaignClusterById resolves known cluster", () => {
    const cluster = getCampaignClusterById("energy-carbon-exposure");
    expect(cluster?.utmCampaign).toBe("energy-carbon-exposure");
    expect(cluster?.landingHref).toBe("/seo/energy-carbon-calculators");
  });

  test("buildUtmHref produces stable output", () => {
    const href = buildUtmHref("/tools/free/oee-calculator", {
      utmSource: "test",
      utmMedium: "qa",
      utmCampaign: "manufacturing-hidden-loss",
    });
    expect(href).toBe(
      "/tools/free/oee-calculator?utm_source=test&utm_medium=qa&utm_campaign=manufacturing-hidden-loss"
    );
  });
});
