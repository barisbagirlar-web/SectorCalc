/**
 * Revenue funnel model — scores conversion events for monetization review.
 * No PII; event names and slugs only.
 */

import type { SectorCalcEventName } from "@/lib/analytics/event-taxonomy";

export type RevenueFunnelStage =
  | "traffic"
  | "free_usage"
  | "premium_interest"
  | "premium_preview"
  | "unlock_intent"
  | "pricing_intent"
  | "lead_intent"
  | "export_intent"
  | "purchase_intent";

export type RevenueSignalStrength = "low" | "medium" | "high";

export type RevenueIntentLevel = "cold" | "warm" | "hot";

export type RevenueFunnelSignal = {
  readonly stage: RevenueFunnelStage;
  readonly signalStrength: RevenueSignalStrength;
  readonly eventName: string;
  readonly score: number;
  readonly description: string;
};

export type RevenueIntentSummary = {
  readonly totalScore: number;
  readonly level: RevenueIntentLevel;
  readonly strongestStage: RevenueFunnelStage;
  readonly recommendedAction: string;
};

export type RevenueEventRecord = {
  readonly eventName: string;
  readonly campaignId?: string;
  readonly premiumSlug?: string;
  readonly toolSlug?: string;
};

const SCORED_EVENTS: Partial<Record<SectorCalcEventName, number>> = {
  free_tool_open: 1,
  free_tool_calculate: 3,
  free_to_premium_click: 6,
  premium_analyzer_open: 7,
  premium_unlock_click: 10,
  pricing_view: 8,
  pricing_cta_click: 12,
  beta_partner_submit: 15,
  report_export_click: 10,
  report_csv_click: 9,
  report_print_click: 9,
};

function strengthForScore(score: number): RevenueSignalStrength {
  if (score >= 10) {
    return "high";
  }
  if (score >= 6) {
    return "medium";
  }
  return "low";
}

function stageForEvent(eventName: string): RevenueFunnelStage {
  switch (eventName) {
    case "seo_landing_cta_click":
    case "homepage_cta_click":
      return "traffic";
    case "free_tool_open":
    case "free_tool_calculate":
      return "free_usage";
    case "free_to_premium_click":
      return "premium_interest";
    case "premium_analyzer_open":
    case "premium_calculate":
      return "premium_preview";
    case "premium_unlock_click":
      return "unlock_intent";
    case "pricing_view":
    case "view_pricing_from_locked_report":
      return "pricing_intent";
    case "pricing_cta_click":
      return "purchase_intent";
    case "beta_partner_submit":
    case "beta_partner_open":
      return "lead_intent";
    case "report_export_click":
    case "report_csv_click":
    case "report_print_click":
    case "report_copy_summary_click":
    case "locked_export_click":
      return "export_intent";
    default:
      return "traffic";
  }
}

const SIGNAL_DESCRIPTIONS: Record<string, string> = {
  free_tool_open: "Visitor opened a free calculator page.",
  free_tool_calculate: "User completed a free calculation.",
  free_to_premium_click: "User clicked from free tool to premium analyzer.",
  premium_analyzer_open: "User opened a premium analyzer preview.",
  premium_unlock_click: "User clicked unlock on a locked report.",
  pricing_view: "User viewed the pricing page.",
  pricing_cta_click: "User clicked a pricing plan CTA.",
  beta_partner_submit: "User submitted the beta partner form.",
  report_export_click: "User attempted a report export action.",
  report_csv_click: "User attempted CSV export.",
  report_print_click: "User attempted print / PDF export.",
};

export const REVENUE_FUNNEL_SIGNALS: readonly RevenueFunnelSignal[] = Object.entries(
  SCORED_EVENTS,
).map(([eventName, score]) => ({
  stage: stageForEvent(eventName),
  signalStrength: strengthForScore(score),
  eventName,
  score,
  description: SIGNAL_DESCRIPTIONS[eventName] ?? `Revenue signal: ${eventName}`,
}));

export function getScoreForEvent(eventName: string): number {
  return SCORED_EVENTS[eventName as SectorCalcEventName] ?? 0;
}

export function getRevenueIntentLevel(score: number): RevenueIntentLevel {
  if (score >= 19) {
    return "hot";
  }
  if (score >= 6) {
    return "warm";
  }
  return "cold";
}

export function scoreRevenueIntent(events: readonly RevenueEventRecord[]): RevenueIntentSummary {
  const stageScores = new Map<RevenueFunnelStage, number>();

  let totalScore = 0;
  for (const event of events) {
    const points = getScoreForEvent(event.eventName);
    if (points <= 0) {
      continue;
    }
    totalScore += points;
    const stage = stageForEvent(event.eventName);
    stageScores.set(stage, (stageScores.get(stage) ?? 0) + points);
  }

  const level = getRevenueIntentLevel(totalScore);

  let strongestStage: RevenueFunnelStage = "traffic";
  let strongestScore = 0;
  for (const [stage, score] of stageScores) {
    if (score > strongestScore) {
      strongestScore = score;
      strongestStage = stage;
    }
  }

  const summary: RevenueIntentSummary = {
    totalScore,
    level,
    strongestStage,
    recommendedAction: "",
  };

  return {
    ...summary,
    recommendedAction: getRecommendedRevenueAction(summary),
  };
}

export function getRecommendedRevenueAction(summary: RevenueIntentSummary): string {
  if (summary.level === "cold") {
    return "Drive more qualified traffic and improve free-tool calculate rate before changing pricing.";
  }

  switch (summary.strongestStage) {
    case "free_usage":
      return "Strengthen free-to-premium CTA copy and related premium block on high-traffic tools.";
    case "premium_interest":
    case "premium_preview":
      return "Improve locked report value copy and make the preview outcome more concrete.";
    case "unlock_intent":
    case "pricing_intent":
      return "Review pricing page friction — Pro card dominance and single-report visibility.";
    case "purchase_intent":
      return "Prioritize checkout completion and entitlement confirmation for plan CTAs.";
    case "lead_intent":
      return "Route beta partner leads into case-study proof before pushing paid conversion.";
    case "export_intent":
      return "Prioritize export entitlement and payment flow — export is the paywall trigger.";
    default:
      if (summary.level === "hot") {
        return "Launch a focused monetization sprint on the strongest revenue stage.";
      }
      return "Continue weekly revenue review and test one CTA or locked-state improvement.";
  }
}
