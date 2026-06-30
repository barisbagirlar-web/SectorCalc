/**
 * Premium analyzer revenue intent scoring for weekly monetization review.
 */

import {
  getRevenueIntentLevel,
  getScoreForEvent,
  type RevenueEventRecord,
} from "@/lib/analytics/revenue-funnel";

export type PremiumAnalyzerCatalogRef = {
  readonly slug: string;
  readonly title: string;
};

export type PremiumAnalyzerRevenueScore = {
  readonly premiumSlug: string;
  readonly title: string;
  readonly opens: number;
  readonly unlockClicks: number;
  readonly pricingClicks: number;
  readonly exportClicks: number;
  readonly score: number;
  readonly level: "cold" | "warm" | "hot";
  readonly recommendedFix: string;
};

const PRICING_EVENTS = new Set([
  "pricing_cta_click",
  "view_pricing_from_locked_report",
  "pricing_view",
]);

const EXPORT_EVENTS = new Set([
  "report_export_click",
  "report_csv_click",
  "report_print_click",
  "locked_export_click",
  "report_copy_summary_click",
]);

function filterPremiumEvents(
  slug: string,
  events: readonly RevenueEventRecord[],
): RevenueEventRecord[] {
  return events.filter((event) => event.premiumSlug === slug);
}

function countEvent(events: readonly RevenueEventRecord[], eventName: string): number {
  return events.filter((event) => event.eventName === eventName).length;
}

export function getPremiumRevenueFix(score: PremiumAnalyzerRevenueScore): string {
  if (score.opens === 0 && score.score === 0) {
    return "No preview traffic yet — link from related free tools and SEO hubs.";
  }

  if (score.opens >= 5 && score.unlockClicks === 0) {
    return "Strengthen locked state value — preview shows headline but full drivers are unclear.";
  }

  if (score.unlockClicks >= 3 && score.pricingClicks === 0) {
    return "Improve pricing link clarity from locked state — user wants unlock but not seeing plan path.";
  }

  if (score.pricingClicks >= 3 && score.score < 19) {
    return "Pricing friction — review Pro card dominance and single-report offer visibility.";
  }

  if (score.exportClicks >= 2 && score.unlockClicks < score.exportClicks) {
    return "Export is the paywall trigger — prioritize entitlement and payment before export.";
  }

  if (score.level === "hot") {
    return "High intent — prioritize checkout flow and report delivery for this analyzer.";
  }

  if (score.level === "warm") {
    return "Moderate intent — test locked-state copy and related free-tool upsell.";
  }

  return "Low intent — improve discovery from campaign clusters and free-tool related links.";
}

export function buildPremiumAnalyzerRevenueScore(
  item: PremiumAnalyzerCatalogRef,
  events: readonly RevenueEventRecord[],
): PremiumAnalyzerRevenueScore {
  const matched = filterPremiumEvents(item.slug, events);

  const opens = countEvent(matched, "premium_analyzer_open") + countEvent(matched, "premium_calculate");
  const unlockClicks = countEvent(matched, "premium_unlock_click");
  const pricingClicks = matched.filter((event) => PRICING_EVENTS.has(event.eventName)).length;
  const exportClicks = matched.filter((event) => EXPORT_EVENTS.has(event.eventName)).length;

  let score = 0;
  for (const event of matched) {
    score += getScoreForEvent(event.eventName);
  }

  const draft: PremiumAnalyzerRevenueScore = {
    premiumSlug: item.slug,
    title: item.title,
    opens,
    unlockClicks,
    pricingClicks,
    exportClicks,
    score,
    level: getRevenueIntentLevel(score),
    recommendedFix: "",
  };

  return {
    ...draft,
    recommendedFix: getPremiumRevenueFix(draft),
  };
}

export function rankPremiumAnalyzersByRevenueIntent(
  items: readonly PremiumAnalyzerCatalogRef[],
  events: readonly RevenueEventRecord[],
): PremiumAnalyzerRevenueScore[] {
  return [...items]
    .map((item) => buildPremiumAnalyzerRevenueScore(item, events))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.title.localeCompare(b.title);
    });
}
