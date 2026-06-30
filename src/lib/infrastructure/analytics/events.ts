export const ANALYTICS_EVENTS = {
 tool_view: "tool_view",
 form_started: "form_started",
 calculation_completed: "calculation_completed",
 export_clicked: "export_clicked",
 premium_preview_viewed: "premium_preview_viewed",
 unlock_clicked: "unlock_clicked",
 pricing_clicked: "pricing_clicked",
 sector_pass_clicked: "sector_pass_clicked",
 lead_modal_opened: "lead_modal_opened",
 lead_submitted: "lead_submitted",
 lead_submit_failed: "lead_submit_failed",
 admin_leads_viewed: "admin_leads_viewed",
 admin_lead_filter_changed: "admin_lead_filter_changed",
} as const;

export type AnalyticsEventName =
 (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsEventPayload = Record<
 string,
 string | number | boolean | undefined
>;

/**
 * No-op analytics sink until GA/PostHog or similar is wired.
 * Safe to call from client components.
 */
export function trackEvent(
 eventName: AnalyticsEventName,
 payload: AnalyticsEventPayload = {}
): void {
 if (process.env.NODE_ENV === "development") {
 const sink = { event: eventName, ...payload };
 void sink;
 }
}
