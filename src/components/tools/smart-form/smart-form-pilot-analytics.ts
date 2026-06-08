/**
 * Smart form pilot analytics — Phase 5H-G-F (aligned with REVENUE_EVENTS; no new deps).
 */

import {
  REVENUE_EVENTS,
  trackRevenueEvent,
  type RevenueEventPayload,
} from "@/lib/analytics/revenue-events";
import { THREE_D_PRINT_PILOT_SLUG, THREE_D_PRINT_PILOT_SUBMIT_KEYS } from "@/components/tools/smart-form/pilot-calculation-payload";

export type SmartFormPilotAnalyticsPayload = RevenueEventPayload & {
  readonly slug: string;
  readonly mode: "smart_form_pilot";
  readonly featureFlag: true;
  readonly mappedInputCount: number;
  readonly advancedInputSubmitted: false;
};

export function buildSmartFormPilotAnalyticsPayload(
  slug: string = THREE_D_PRINT_PILOT_SLUG,
): SmartFormPilotAnalyticsPayload {
  return {
    slug,
    mode: "smart_form_pilot",
    featureFlag: true,
    mappedInputCount: THREE_D_PRINT_PILOT_SUBMIT_KEYS.length,
    advancedInputSubmitted: false,
    toolSlug: slug,
  };
}

export function trackSmartFormPilotStarted(slug: string = THREE_D_PRINT_PILOT_SLUG): void {
  try {
    trackRevenueEvent(
      REVENUE_EVENTS.free_tool_started,
      buildSmartFormPilotAnalyticsPayload(slug),
    );
  } catch {
    // Analytics must never break calculation flow.
  }
}

export function trackSmartFormPilotCompleted(slug: string = THREE_D_PRINT_PILOT_SLUG): void {
  try {
    trackRevenueEvent(
      REVENUE_EVENTS.free_tool_completed,
      buildSmartFormPilotAnalyticsPayload(slug),
    );
  } catch {
    // Analytics must never break calculation flow.
  }
}
