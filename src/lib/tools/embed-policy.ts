import { stripLocaleFromPath } from "@/lib/i18n/locale-routing";
import type { ToolHelpfulCountTier } from "@/lib/tools/tool-helpful-count";

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

  return false;
}
