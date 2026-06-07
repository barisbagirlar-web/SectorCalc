/**
 * Live KPI review model — aggregate traffic, conversion, revenue, and lead metrics.
 * No PII; slugs and campaign IDs only.
 */

import { getLiveKpiDecision, type LiveKpiDecision } from "@/lib/analytics/live-kpi-decision";
import type { LiveKpiEvent } from "@/lib/analytics/load-live-kpi-events";
import { SECTORCALC_EVENTS } from "@/lib/analytics/event-taxonomy";
import { REVENUE_EVENTS } from "@/lib/analytics/revenue-events";
import { CAMPAIGN_CLUSTERS } from "@/lib/campaigns/campaign-clusters";
import { rankCampaignsByRevenueIntent } from "@/lib/campaigns/campaign-revenue-score";
import type { RevenueEventRecord } from "@/lib/analytics/revenue-funnel";

export type LiveKpiMetricStatus = "healthy" | "watch" | "critical" | "empty";

export type LiveKpiMetric = {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly previousValue?: number;
  readonly changePercent?: number;
  readonly status: LiveKpiMetricStatus;
  readonly description: string;
};

export type LiveKpiSnapshot = {
  readonly generatedAt: string;
  readonly period: "daily" | "weekly";
  readonly traffic: {
    readonly landingViews: number;
    readonly seoLandingViews: number;
    readonly freeToolOpens: number;
    readonly premiumAnalyzerOpens: number;
  };
  readonly conversion: {
    readonly freeCalculations: number;
    readonly freeToPremiumClicks: number;
    readonly premiumUnlockClicks: number;
    readonly pricingViews: number;
    readonly pricingCtaClicks: number;
  };
  readonly revenue: {
    readonly checkoutStarted: number;
    readonly paymentCompleted: number;
    readonly singleReportPurchases: number;
    readonly proSubscriptions: number;
    readonly teamSubscriptions: number;
  };
  readonly leads: {
    readonly betaPartnerSubmits: number;
    readonly reportFeedbackSubmits: number;
  };
  readonly topItems: {
    readonly freeTools: readonly { readonly slug: string; readonly count: number }[];
    readonly premiumAnalyzers: readonly { readonly slug: string; readonly count: number }[];
    readonly campaigns: readonly { readonly campaignId: string; readonly score: number }[];
  };
};

const PII_KEYS = [
  "email",
  "phone",
  "name",
  "company",
  "contact",
  "address",
  "message",
  "notes",
] as const;

function countEvents(events: readonly LiveKpiEvent[], eventName: string): number {
  return events.filter((event) => event.eventName === eventName).length;
}

function countAny(events: readonly LiveKpiEvent[], names: readonly string[]): number {
  const nameSet = new Set(names);
  return events.filter((event) => nameSet.has(event.eventName)).length;
}

function aggregateSlugCounts(
  events: readonly LiveKpiEvent[],
  eventName: string,
  slugKey: "toolSlug" | "premiumSlug"
): { slug: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const event of events) {
    if (event.eventName !== eventName) {
      continue;
    }
    const slug = event[slugKey]?.trim();
    if (!slug) {
      continue;
    }
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
    .slice(0, 10);
}

function toRevenueEventRecords(events: readonly LiveKpiEvent[]): RevenueEventRecord[] {
  return events.map((event) => ({
    eventName: event.eventName,
    campaignId: event.campaignId,
    premiumSlug: event.premiumSlug,
    toolSlug: event.toolSlug,
  }));
}

export function createEmptyLiveKpiSnapshot(
  period: LiveKpiSnapshot["period"] = "weekly"
): LiveKpiSnapshot {
  return {
    generatedAt: new Date().toISOString(),
    period,
    traffic: {
      landingViews: 0,
      seoLandingViews: 0,
      freeToolOpens: 0,
      premiumAnalyzerOpens: 0,
    },
    conversion: {
      freeCalculations: 0,
      freeToPremiumClicks: 0,
      premiumUnlockClicks: 0,
      pricingViews: 0,
      pricingCtaClicks: 0,
    },
    revenue: {
      checkoutStarted: 0,
      paymentCompleted: 0,
      singleReportPurchases: 0,
      proSubscriptions: 0,
      teamSubscriptions: 0,
    },
    leads: {
      betaPartnerSubmits: 0,
      reportFeedbackSubmits: 0,
    },
    topItems: {
      freeTools: [],
      premiumAnalyzers: [],
      campaigns: [],
    },
  };
}

export function buildLiveKpiSnapshot(
  events: readonly LiveKpiEvent[],
  period: LiveKpiSnapshot["period"] = "weekly"
): LiveKpiSnapshot {
  const campaignScores = rankCampaignsByRevenueIntent(
    CAMPAIGN_CLUSTERS,
    toRevenueEventRecords(events)
  );

  return {
    generatedAt: new Date().toISOString(),
    period,
    traffic: {
      landingViews: countAny(events, [
        SECTORCALC_EVENTS.homepage_cta_click,
        SECTORCALC_EVENTS.seo_landing_cta_click,
      ]),
      seoLandingViews: countEvents(events, SECTORCALC_EVENTS.seo_landing_cta_click),
      freeToolOpens: countEvents(events, SECTORCALC_EVENTS.free_tool_open),
      premiumAnalyzerOpens: countEvents(events, SECTORCALC_EVENTS.premium_analyzer_open),
    },
    conversion: {
      freeCalculations: countEvents(events, SECTORCALC_EVENTS.free_tool_calculate),
      freeToPremiumClicks: countEvents(events, SECTORCALC_EVENTS.free_to_premium_click),
      premiumUnlockClicks: countEvents(events, SECTORCALC_EVENTS.premium_unlock_click),
      pricingViews: countAny(events, [
        SECTORCALC_EVENTS.pricing_view,
        SECTORCALC_EVENTS.view_pricing_from_locked_report,
      ]),
      pricingCtaClicks: countEvents(events, SECTORCALC_EVENTS.pricing_cta_click),
    },
    revenue: {
      checkoutStarted: countEvents(events, REVENUE_EVENTS.checkout_started),
      paymentCompleted: countEvents(events, REVENUE_EVENTS.checkout_returned_success),
      singleReportPurchases: 0,
      proSubscriptions: 0,
      teamSubscriptions: 0,
    },
    leads: {
      betaPartnerSubmits: countEvents(events, SECTORCALC_EVENTS.beta_partner_submit),
      reportFeedbackSubmits: 0,
    },
    topItems: {
      freeTools: aggregateSlugCounts(events, SECTORCALC_EVENTS.free_tool_open, "toolSlug"),
      premiumAnalyzers: aggregateSlugCounts(
        events,
        SECTORCALC_EVENTS.premium_analyzer_open,
        "premiumSlug"
      ),
      campaigns: campaignScores.map((score) => ({
        campaignId: score.campaignId,
        score: score.revenueIntentScore,
      })),
    },
  };
}

export function getKpiStatus(metric: {
  readonly value: number;
  readonly previousValue?: number;
}): LiveKpiMetricStatus {
  if (metric.value === 0 && (metric.previousValue === undefined || metric.previousValue === 0)) {
    return "empty";
  }

  if (metric.value === 0 && metric.previousValue !== undefined && metric.previousValue > 0) {
    return "critical";
  }

  if (metric.previousValue !== undefined && metric.previousValue > 0) {
    const changePercent = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
    if (changePercent <= -30) {
      return "critical";
    }
    if (changePercent <= -10) {
      return "watch";
    }
  }

  return metric.value > 0 ? "healthy" : "empty";
}

export function buildLiveKpiMetric(input: {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly previousValue?: number;
  readonly description: string;
}): LiveKpiMetric {
  const changePercent =
    input.previousValue !== undefined && input.previousValue > 0
      ? ((input.value - input.previousValue) / input.previousValue) * 100
      : undefined;

  return {
    id: input.id,
    label: input.label,
    value: input.value,
    previousValue: input.previousValue,
    changePercent,
    status: getKpiStatus({ value: input.value, previousValue: input.previousValue }),
    description: input.description,
  };
}

export function getWeeklyDecision(snapshot: LiveKpiSnapshot): LiveKpiDecision {
  return getLiveKpiDecision(snapshot);
}

export function snapshotContainsPii(snapshot: LiveKpiSnapshot): boolean {
  const serialized = JSON.stringify(snapshot).toLowerCase();
  return PII_KEYS.some((key) => serialized.includes(`"${key}"`));
}

export function isSnapshotEmpty(snapshot: LiveKpiSnapshot): boolean {
  const totals = [
    snapshot.traffic.landingViews,
    snapshot.traffic.seoLandingViews,
    snapshot.traffic.freeToolOpens,
    snapshot.traffic.premiumAnalyzerOpens,
    snapshot.conversion.freeCalculations,
    snapshot.conversion.freeToPremiumClicks,
    snapshot.conversion.premiumUnlockClicks,
    snapshot.conversion.pricingViews,
    snapshot.conversion.pricingCtaClicks,
    snapshot.revenue.checkoutStarted,
    snapshot.revenue.paymentCompleted,
    snapshot.leads.betaPartnerSubmits,
    snapshot.leads.reportFeedbackSubmits,
  ];
  return totals.every((value) => value === 0);
}
