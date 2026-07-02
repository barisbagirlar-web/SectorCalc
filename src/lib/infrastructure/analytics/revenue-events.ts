/**
 * Revenue Flow v1 conversion events - canonical names for GA4/PostHog wiring.
 * No-op sink until analytics provider is connected (no console logging in production).
 */

export const REVENUE_EVENTS = {
 free_tool_started: "free_tool_started",
 free_tool_completed: "free_tool_completed",
 premium_analyzer_viewed: "premium_analyzer_viewed",
 paywall_viewed: "paywall_viewed",
 pricing_viewed: "pricing_viewed",
 checkout_started: "checkout_started",
 checkout_returned_success: "checkout_returned_success",
 premium_result_generated: "premium_result_generated",
 verdict_pdf_downloaded: "verdict_pdf_downloaded",
 verdict_report_saved: "verdict_report_saved",
} as const;

export type RevenueEventName =
 (typeof REVENUE_EVENTS)[keyof typeof REVENUE_EVENTS];

export type RevenueEventPayload = Record<
 string,
 string | number | boolean | undefined
>;

/** Safe no-op until GA4 or PostHog is wired via trackEvent or gtag. */
export function trackRevenueEvent(
 eventName: RevenueEventName,
 payload: RevenueEventPayload = {}
): void {
 void eventName;
 void payload;
}
