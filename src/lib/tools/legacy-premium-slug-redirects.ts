import legacyToolRedirects from "../../../config/legacy-tool-redirects.json";
import { isCanonicalPremiumSlug } from "./canonical-tool-slugs";

type LegacyRedirectMap = Readonly<Record<string, string>>;

const LEGACY_PREMIUM_REDIRECTS = legacyToolRedirects as LegacyRedirectMap;

export function getLegacyPremiumRedirectMap(): LegacyRedirectMap {
  return LEGACY_PREMIUM_REDIRECTS;
}

export function resolveLegacyPremiumSlug(slug: string): string | null {
  const normalized = slug.trim().replace(/-premium$/, "");
  if (!normalized) {
    return null;
  }

  const mapped = LEGACY_PREMIUM_REDIRECTS[normalized];
  if (mapped) {
    return mapped;
  }

  if (isCanonicalPremiumSlug(normalized)) {
    return normalized;
  }

  return null;
}

export function resolveLegacyPremiumGeneratedPath(slug: string): string | null {
  const target = resolveLegacyPremiumSlug(slug);
  return target ? `/tools/generated/${target}` : null;
}
