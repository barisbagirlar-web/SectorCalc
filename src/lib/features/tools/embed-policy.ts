import { stripLocaleFromPath } from "@/lib/infrastructure/i18n/locale-routing";
import type { ToolHelpfulCountTier } from "@/lib/features/tools/tool-helpful-count";

/** Embed iframe code is only offered on free calculator pages. */
export function shouldOfferToolEmbed(tier: ToolHelpfulCountTier): boolean {
  return tier === "free";
}

/**
 * Whether a tool page may be framed in a third-party iframe.
 * Premium and paid routes are blocked even if someone crafts embed HTML manually.
 */
export function shouldAllowToolPageFraming(pathname: string): boolean {
  const path = stripLocaleFromPath(pathname);

  if (path.startsWith("/tools/free/") || path.startsWith("/tools/free-traffic/")) {
    return true;
  }

  if (path.startsWith("/tools/generated/")) {
    return true;
  }

  if (path.startsWith("/embed/")) {
    return true;
  }

  return false;
}

/** Build the embed iframe URL for a given tool slug and locale. */
export function buildEmbedUrl(
  baseUrl: string,
  locale: string,
  slug: string,
): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const siteOrigin = new URL(cleanBase).origin;
  return `${siteOrigin}/${locale}/embed/${slug}`;
}
