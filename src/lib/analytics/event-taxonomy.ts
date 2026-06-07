import { trackEvent, type AnalyticsEventName } from "@/lib/analytics/events";
import { REVENUE_EVENTS, trackRevenueEvent } from "@/lib/analytics/revenue-events";

export const SECTORCALC_EVENTS = {
  homepage_cta_click: "homepage_cta_click",
  seo_landing_cta_click: "seo_landing_cta_click",
  free_tool_open: "free_tool_open",
  free_tool_calculate: "free_tool_calculate",
  free_to_premium_click: "free_to_premium_click",
  premium_analyzer_open: "premium_analyzer_open",
  premium_unlock_click: "premium_unlock_click",
  pricing_view: "pricing_view",
  pricing_cta_click: "pricing_cta_click",
  beta_partner_open: "beta_partner_open",
  beta_partner_submit: "beta_partner_submit",
  report_export_click: "report_export_click",
  report_print_click: "report_print_click",
  report_csv_click: "report_csv_click",
} as const;

export type SectorCalcEventName =
  (typeof SECTORCALC_EVENTS)[keyof typeof SECTORCALC_EVENTS];

export type SectorCalcEventPayload = {
  readonly eventName: SectorCalcEventName;
  readonly locale: string;
  readonly pagePath: string;
  readonly toolSlug?: string;
  readonly premiumSlug?: string;
  readonly campaignId?: string;
  readonly source?: string;
  readonly medium?: string;
  readonly ctaId?: string;
};

const LEGACY_EVENT_MAP: Partial<Record<SectorCalcEventName, AnalyticsEventName>> = {
  pricing_cta_click: "pricing_clicked",
  premium_unlock_click: "unlock_clicked",
  free_to_premium_click: "premium_preview_viewed",
};

function toLegacyPayload(payload: SectorCalcEventPayload): Record<string, string | undefined> {
  return {
    locale: payload.locale,
    pagePath: payload.pagePath,
    toolSlug: payload.toolSlug,
    premiumSlug: payload.premiumSlug,
    campaignId: payload.campaignId,
    source: payload.source,
    medium: payload.medium,
    ctaId: payload.ctaId,
  };
}

export function trackSectorCalcEvent(payload: SectorCalcEventPayload): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[SectorCalc event]", payload);
  }

  const legacyName = LEGACY_EVENT_MAP[payload.eventName];
  if (legacyName) {
    trackEvent(legacyName, toLegacyPayload(payload));
  }

  if (payload.eventName === "pricing_view") {
    trackRevenueEvent(REVENUE_EVENTS.pricing_viewed, {
      toolSlug: payload.toolSlug,
      source: payload.source,
    });
  }
}

export function isSectorCalcEventName(value: string): value is SectorCalcEventName {
  return Object.values(SECTORCALC_EVENTS).includes(value as SectorCalcEventName);
}
