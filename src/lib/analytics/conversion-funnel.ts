import { sanitizeAttributionContext } from "@/lib/analytics/attribution";
import {
  isSectorCalcEventName,
  trackSectorCalcEvent,
  type SectorCalcEventName,
} from "@/lib/analytics/event-taxonomy";

export type ConversionFunnelStage =
  | "landing"
  | "tool_open"
  | "calculation"
  | "premium_interest"
  | "premium_preview"
  | "unlock_intent"
  | "pricing_intent"
  | "lead_submit"
  | "export_intent";

export type ConversionValueType = "free" | "premium" | "lead" | "export";

export type ConversionExportType = "pdf" | "print" | "csv" | "copy";

export type ConversionFunnelEvent = {
  readonly stage: ConversionFunnelStage;
  readonly eventName: string;
  readonly locale: string;
  readonly pagePath: string;
  readonly sourcePage?: string;
  readonly toolSlug?: string;
  readonly premiumSlug?: string;
  readonly campaignId?: string;
  readonly ctaId?: string;
  readonly valueType?: ConversionValueType;
  readonly exportType?: ConversionExportType;
  readonly category?: string;
  readonly source?: string;
  readonly medium?: string;
};

export type ConversionFunnelEventInput = {
  readonly stage: ConversionFunnelStage;
  readonly eventName: SectorCalcEventName | string;
  readonly locale: string;
  readonly pagePath: string;
  readonly sourcePage?: string;
  readonly toolSlug?: string;
  readonly premiumSlug?: string;
  readonly campaignId?: string;
  readonly ctaId?: string;
  readonly valueType?: ConversionValueType;
  readonly exportType?: ConversionExportType;
  readonly category?: string;
  readonly source?: string;
  readonly medium?: string;
};

const PII_FIELD_NAMES = new Set([
  "email",
  "contactname",
  "companyname",
  "name",
  "phone",
  "company",
  "contact",
  "firstname",
  "lastname",
  "address",
  "message",
  "notes",
]);

const ALLOWED_PAYLOAD_KEYS = new Set([
  "stage",
  "eventName",
  "locale",
  "pagePath",
  "sourcePage",
  "toolSlug",
  "premiumSlug",
  "campaignId",
  "ctaId",
  "valueType",
  "exportType",
  "category",
  "source",
  "medium",
]);

function sanitizeSlug(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.slice(0, 120);
}

function sanitizePath(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.startsWith("/") ? trimmed.slice(0, 200) : `/${trimmed}`.slice(0, 200);
}

export function normalizeConversionPayload(
  input: ConversionFunnelEvent | Record<string, unknown>
): Record<string, string> {
  const output: Record<string, string> = {};

  for (const [key, rawValue] of Object.entries(input)) {
    if (PII_FIELD_NAMES.has(key.toLowerCase())) {
      continue;
    }
    if (!ALLOWED_PAYLOAD_KEYS.has(key)) {
      continue;
    }
    if (rawValue === null || rawValue === undefined) {
      continue;
    }
    if (typeof rawValue !== "string") {
      continue;
    }
    const trimmed = rawValue.trim();
    if (trimmed.length > 0) {
      output[key] = trimmed;
    }
  }

  return output;
}

export function buildConversionEvent(input: ConversionFunnelEventInput): ConversionFunnelEvent {
  const campaign = input.campaignId
    ? sanitizeAttributionContext({ utmCampaign: input.campaignId }).utmCampaign
    : undefined;

  const event: ConversionFunnelEvent = {
    stage: input.stage,
    eventName: input.eventName.trim(),
    locale: input.locale.trim().slice(0, 8),
    pagePath: sanitizePath(input.pagePath) ?? "/",
    ...(sanitizePath(input.sourcePage) ? { sourcePage: sanitizePath(input.sourcePage) } : {}),
    ...(sanitizeSlug(input.toolSlug) ? { toolSlug: sanitizeSlug(input.toolSlug) } : {}),
    ...(sanitizeSlug(input.premiumSlug) ? { premiumSlug: sanitizeSlug(input.premiumSlug) } : {}),
    ...(campaign ? { campaignId: campaign } : {}),
    ...(input.ctaId?.trim() ? { ctaId: input.ctaId.trim().slice(0, 80) } : {}),
    ...(input.valueType ? { valueType: input.valueType } : {}),
    ...(input.exportType ? { exportType: input.exportType } : {}),
    ...(input.category?.trim() ? { category: input.category.trim().slice(0, 80) } : {}),
    ...(input.source?.trim() ? { source: input.source.trim().slice(0, 80) } : {}),
    ...(input.medium?.trim() ? { medium: input.medium.trim().slice(0, 80) } : {}),
  };

  return event;
}

function toSectorCalcPayload(event: ConversionFunnelEvent) {
  return {
    eventName: event.eventName as SectorCalcEventName,
    locale: event.locale,
    pagePath: event.pagePath,
    toolSlug: event.toolSlug,
    premiumSlug: event.premiumSlug,
    campaignId: event.campaignId,
    ctaId: event.ctaId,
    source: event.source,
    medium: event.medium,
  };
}

export function trackConversionEvent(input: ConversionFunnelEventInput): void {
  try {
    const event = buildConversionEvent(input);
    const normalized = normalizeConversionPayload(event);

    if (!isSectorCalcEventName(event.eventName)) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[SectorCalc conversion]", normalized);
      }
      return;
    }

    trackSectorCalcEvent(toSectorCalcPayload(event));
  } catch {
    // Tracking must never break calculator, CTA, or form flows.
  }
}

export function mapEventToStage(eventName: SectorCalcEventName): ConversionFunnelStage {
  switch (eventName) {
    case "homepage_cta_click":
    case "seo_landing_cta_click":
      return "landing";
    case "free_tool_open":
      return "tool_open";
    case "free_tool_calculate":
      return "calculation";
    case "free_to_premium_click":
      return "premium_interest";
    case "premium_analyzer_open":
    case "premium_calculate":
      return "premium_preview";
    case "premium_unlock_click":
      return "unlock_intent";
    case "pricing_view":
    case "pricing_cta_click":
    case "view_pricing_from_locked_report":
      return "pricing_intent";
    case "beta_partner_open":
    case "beta_partner_submit":
      return "lead_submit";
    case "report_export_click":
    case "report_print_click":
    case "report_csv_click":
    case "report_copy_summary_click":
    case "locked_export_click":
      return "export_intent";
    default:
      return "landing";
  }
}
