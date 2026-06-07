export type AttributionParams = {
  readonly utmSource?: string;
  readonly utmMedium?: string;
  readonly utmCampaign?: string;
  readonly referrer?: string;
};

export type AttributionContext = {
  readonly utmSource?: string;
  readonly utmMedium?: string;
  readonly utmCampaign?: string;
  readonly utmContent?: string;
  readonly referrer?: string;
  readonly landingPath?: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

function trimValue(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeToken(value: string | undefined, maxLength = 120): string | undefined {
  if (!value) {
    return undefined;
  }
  const cleaned = value.replace(/[\r\n\t]/g, " ").trim();
  if (!cleaned) {
    return undefined;
  }
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) : cleaned;
}

export function simplifyReferrer(referrer: string | undefined): string | undefined {
  const value = trimValue(referrer);
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    const path = url.pathname === "/" ? "" : url.pathname;
    return `${url.hostname.replace(/^www\./i, "")}${path}`.slice(0, 160);
  } catch {
    return sanitizeToken(value, 160);
  }
}

export function sanitizeAttributionContext(
  context: Partial<AttributionContext> | undefined
): AttributionContext {
  if (!context) {
    return {};
  }

  return {
    utmSource: sanitizeToken(context.utmSource),
    utmMedium: sanitizeToken(context.utmMedium),
    utmCampaign: sanitizeToken(context.utmCampaign),
    utmContent: sanitizeToken(context.utmContent),
    referrer: simplifyReferrer(context.referrer),
    landingPath: sanitizeToken(context.landingPath, 200),
  };
}

export function readAttributionFromSearchParams(
  params: Readonly<URLSearchParams>
): AttributionContext {
  return sanitizeAttributionContext({
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
  });
}

export function readReferrer(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  return simplifyReferrer(document.referrer);
}

export function buildUtmHref(path: string, context: Partial<AttributionContext>): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const [pathname, existingQuery = ""] = normalized.split("?");
  const params = new URLSearchParams(existingQuery);
  const sanitized = sanitizeAttributionContext(context);

  if (sanitized.utmSource) {
    params.set("utm_source", sanitized.utmSource);
  }
  if (sanitized.utmMedium) {
    params.set("utm_medium", sanitized.utmMedium);
  }
  if (sanitized.utmCampaign) {
    params.set("utm_campaign", sanitized.utmCampaign);
  }
  if (sanitized.utmContent) {
    params.set("utm_content", sanitized.utmContent);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function buildShareHref(path: string, campaign = "share"): string {
  return buildUtmHref(path, {
    utmSource: "sectorcalc",
    utmMedium: "share",
    utmCampaign: campaign,
  });
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

export function mergeAttributionContext(
  ...contexts: readonly (Partial<AttributionContext> | undefined)[]
): AttributionContext {
  const merged: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    referrer?: string;
    landingPath?: string;
  } = {};

  for (const context of contexts) {
    if (!context) {
      continue;
    }
    if (context.utmSource) merged.utmSource = context.utmSource;
    if (context.utmMedium) merged.utmMedium = context.utmMedium;
    if (context.utmCampaign) merged.utmCampaign = context.utmCampaign;
    if (context.utmContent) merged.utmContent = context.utmContent;
    if (context.referrer) merged.referrer = context.referrer;
    if (context.landingPath) merged.landingPath = context.landingPath;
  }
  return sanitizeAttributionContext(merged);
}

export function hasAttributionSignals(context: Partial<AttributionContext>): boolean {
  return Boolean(
    context.utmSource ||
      context.utmMedium ||
      context.utmCampaign ||
      context.utmContent
  );
}

export function attributionSearchParamKeys(): readonly string[] {
  return UTM_KEYS;
}
