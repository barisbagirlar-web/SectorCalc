/**
 * Document Intelligence — Landing Analytics Events
 *
 * Privacy-safe events. Never send filenames, document content,
 * or user identifiers to the analytics sink.
 */

export const DI_ANALYTICS_EVENTS = {
  document_intelligence_category_view: "document_intelligence_category_view",
  maintenance_bom_product_view: "maintenance_bom_product_view",
  hero_primary_cta_click: "hero_primary_cta_click",
  hero_secondary_cta_click: "hero_secondary_cta_click",
  sample_output_view: "sample_output_view",
  sample_row_source_link: "sample_row_source_link",
  pricing_view: "pricing_view",
  free_diagnostic_started: "free_diagnostic_started",
  diagnostic_completed: "diagnostic_completed",
  diagnostic_eligible: "diagnostic_eligible",
  diagnostic_rejected: "diagnostic_rejected",
  diagnostic_manual_review: "diagnostic_manual_review",
  credits_confirmation_view: "credits_confirmation_view",
  credits_confirmed: "credits_confirmed",
  job_processing_started: "job_processing_started",
  delivery_package_downloaded: "delivery_package_downloaded",
} as const;

export type DiAnalyticsEventName =
  (typeof DI_ANALYTICS_EVENTS)[keyof typeof DI_ANALYTICS_EVENTS];

export type DiAnalyticsPayload = Record<
  string,
  string | number | boolean | undefined
>;

/**
 * No-op analytics sink until GA4/PostHog is wired.
 * Safe to call from client components.
 */
export function trackDiEvent(
  eventName: DiAnalyticsEventName,
  payload: DiAnalyticsPayload = {},
): void {
  if (process.env.NODE_ENV === "development") {
    const sink = { event: eventName, ...payload };
    void sink;
  }
}
