/**
 * Resolve merged locale messages with optional pseudo-localized English fallback (dev leak hunting).
 */

import { mergeLocaleMessages } from "@/lib/infrastructure/i18n/merge-locale-messages";
import { pseudoLocalizeMessages } from "@/lib/infrastructure/i18n/pseudo-localize-messages";
import { ROOT_LOCALE } from "@/lib/infrastructure/i18n/locale-config";

export function shouldUsePseudoLocaleFallback(): boolean {
  return (
    process.env.NEXT_PUBLIC_PSEUDO_LOCALE === "1" &&
    process.env.NODE_ENV !== "production"
  );
}

export function resolveMergedLocaleMessages(
  locale: string,
  enMessages: Record<string, unknown>,
  localeMessages: Record<string, unknown>,
  usePseudoFallback = shouldUsePseudoLocaleFallback(),
): Record<string, unknown> {
  if (locale === ROOT_LOCALE) {
    return localeMessages;
  }

  const fallback = usePseudoFallback ? pseudoLocalizeMessages(enMessages) : enMessages;
  return mergeLocaleMessages(fallback, localeMessages);
}
