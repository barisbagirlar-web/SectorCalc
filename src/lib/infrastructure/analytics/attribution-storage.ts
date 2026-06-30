import {
  hasAttributionSignals,
  mergeAttributionContext,
  readReferrer,
  sanitizeAttributionContext,
  type AttributionContext,
} from "@/lib/infrastructure/analytics/attribution";
import { resolveCampaignIdForPath } from "@/lib/features/campaigns/campaign-path-resolver";

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

  const inferredCampaign = fromUrl.utmCampaign
    ? undefined
    : resolveCampaignIdForPath(landingPath);

  const captured = mergeAttributionContext(
    fromUrl,
    inferredCampaign
      ? {
          utmCampaign: inferredCampaign,
          utmSource: fromUrl.utmSource ?? "sectorcalc",
          utmMedium: fromUrl.utmMedium ?? "organic",
        }
      : undefined,
  );

  if (hasAttributionSignals(captured) || captured.referrer || captured.landingPath) {
    persistAttributionContext(captured);
  }

  return mergeAttributionContext(readStoredAttributionContext(), captured);
}
