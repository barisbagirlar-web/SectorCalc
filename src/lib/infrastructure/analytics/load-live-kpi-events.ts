/**
 * Live KPI event loader - v1 returns an empty list until a server-side
 * analytics store is wired. No PII; aggregate event names and slugs only.
 */

export type LiveKpiPeriod = "daily" | "weekly";

export type LiveKpiEvent = {
  readonly eventName: string;
  readonly toolSlug?: string;
  readonly premiumSlug?: string;
  readonly campaignId?: string;
  readonly timestamp?: string;
};

export type LoadLiveKpiEventsInput = {
  readonly period: LiveKpiPeriod;
};

export async function loadLiveKpiEvents(
  _input: LoadLiveKpiEventsInput
): Promise<readonly LiveKpiEvent[]> {
  return [];
}
