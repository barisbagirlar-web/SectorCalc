import enMessages from "../../../messages/en.json";
import trMessages from "../../../messages/tr.json";
import deMessages from "../../../messages/de.json";
import frMessages from "../../../messages/fr.json";
import esMessages from "../../../messages/es.json";
import arMessages from "../../../messages/ar.json";

type MessageRecord = Record<string, unknown>;

const LOCALE_MESSAGES: Record<string, MessageRecord> = {
  en: enMessages as MessageRecord,
  tr: trMessages as MessageRecord,
  de: deMessages as MessageRecord,
  fr: frMessages as MessageRecord,
  es: esMessages as MessageRecord,
  ar: arMessages as MessageRecord,
};

export interface FreeToolLocalizedCopy {
  readonly title?: string;
  readonly description?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly infoBoxTitle?: string;
  readonly infoBoxContent?: string;
}

function readString(source: MessageRecord, key: string): string | undefined {
  const value = source[key];
  return typeof value === "string" ? value : undefined;
}

function readFreeToolContent(
  messages: MessageRecord | undefined,
  slug: string,
): MessageRecord | undefined {
  if (!messages) {
    return undefined;
  }
  const content = messages.freeToolContent;
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return undefined;
  }
  const entry = (content as MessageRecord)[slug];
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return undefined;
  }
  return entry as MessageRecord;
}

/**
 * Resolves tool-specific localized copy for a free tool.
 *
 * Fallback chain per field:
 *   1. locale-specific `freeToolContent[slug]` key
 *   2. English `freeToolContent[slug]` key (EN locale only)
 *   3. undefined — caller must fall back to the English registry value
 *
 * Uses static JSON imports so it resolves deterministically at build time
 * (the previous dynamic `@/../../messages` path resolved outside the repo).
 */
export function resolveFreeToolLocalizedCopy(
  slug: string,
  locale: string,
): FreeToolLocalizedCopy {
  const localeContent = readFreeToolContent(LOCALE_MESSAGES[locale], slug);
  const englishContent = readFreeToolContent(LOCALE_MESSAGES.en, slug);

  const pick = (key: keyof FreeToolLocalizedCopy): string | undefined => {
    if (localeContent) {
      const localeValue = readString(localeContent, key);
      if (localeValue) {
        return localeValue;
      }
    }
    // English message namespace is only a fallback for the EN locale.
    // Other locales fall through to the registry copy at the call site.
    if (locale === "en" && englishContent) {
      return readString(englishContent, key);
    }
    return undefined;
  };

  return {
    title: pick("title"),
    description: pick("description"),
    seoTitle: pick("seoTitle"),
    seoDescription: pick("seoDescription"),
    infoBoxTitle: pick("infoBoxTitle"),
    infoBoxContent: pick("infoBoxContent"),
  };
}
