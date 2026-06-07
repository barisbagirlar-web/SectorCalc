import {
  hasAttributionSignals,
  mergeAttributionContext,
  readReferrer,
  sanitizeAttributionContext,
  type AttributionContext,
} from "@/lib/analytics/attribution";

const STORAGE_KEY = "sc_attr_v1";

export function persistAttributionContext(context: Partial<AttributionContext>): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  const sanitized = sanitizeAttributionContext(context);
  if (!hasAttributionSignals(sanitized) && !sanitized.landingPath && !sanitized.referrer) {
    return;
  }

  const existing = readStoredAttributionContext();
  const merged = mergeAttributionContext(existing, sanitized);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function readStoredAttributionContext(): AttributionContext {
  if (typeof sessionStorage === "undefined") {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Partial<AttributionContext>;
    return sanitizeAttributionContext(parsed);
  } catch {
    return {};
  }
}

export function captureAttributionFromLocation(
  searchParams: Readonly<URLSearchParams>,
  landingPath: string
): AttributionContext {
  const fromUrl = sanitizeAttributionContext({
    utmSource: searchParams.get("utm_source") ?? undefined,
    utmMedium: searchParams.get("utm_medium") ?? undefined,
    utmCampaign: searchParams.get("utm_campaign") ?? undefined,
    utmContent: searchParams.get("utm_content") ?? undefined,
    landingPath,
    referrer: readReferrer(),
  });

  if (hasAttributionSignals(fromUrl) || fromUrl.referrer) {
    persistAttributionContext(fromUrl);
  }

  return mergeAttributionContext(readStoredAttributionContext(), fromUrl);
}
