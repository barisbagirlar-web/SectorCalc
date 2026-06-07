export type AttributionParams = {
  readonly utmSource?: string;
  readonly utmMedium?: string;
  readonly utmCampaign?: string;
  readonly referrer?: string;
};

export function readAttributionFromSearchParams(
  params: Readonly<URLSearchParams>
): AttributionParams {
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}

export function readReferrer(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  const referrer = document.referrer.trim();
  return referrer.length > 0 ? referrer : undefined;
}

export function buildShareHref(path: string, campaign = "share"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const params = new URLSearchParams({
    utm_source: "sectorcalc",
    utm_medium: "share",
    utm_campaign: campaign,
  });
  return `${normalized}?${params.toString()}`;
}

export function mergeAttribution(
  base: AttributionParams,
  extra: Partial<AttributionParams>
): AttributionParams {
  return {
    utmSource: extra.utmSource ?? base.utmSource,
    utmMedium: extra.utmMedium ?? base.utmMedium,
    utmCampaign: extra.utmCampaign ?? base.utmCampaign,
    referrer: extra.referrer ?? base.referrer,
  };
}
