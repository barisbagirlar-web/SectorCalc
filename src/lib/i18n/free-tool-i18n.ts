import enMessages from "../../../messages/en.json";
import trMessages from "../../../messages/tr.json";
import deMessages from "../../../messages/de.json";
import frMessages from "../../../messages/fr.json";
import esMessages from "../../../messages/es.json";
import arMessages from "../../../messages/ar.json";
import catalogI18nBundle from "../../data/free-tool-catalog-i18n.generated.json";

type MessageRecord = Record<string, unknown>;

const LOCALE_MESSAGES: Record<string, MessageRecord> = {
  en: enMessages as MessageRecord,
  tr: trMessages as MessageRecord,
  de: deMessages as MessageRecord,
  fr: frMessages as MessageRecord,
  es: esMessages as MessageRecord,
  ar: arMessages as MessageRecord,
};

const CATALOG_I18N = catalogI18nBundle as Record<
  string,
  Record<string, { title?: string; description?: string; seoTitle?: string; seoDescription?: string }>
>;

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

function readFreeToolsItem(
  messages: MessageRecord | undefined,
  slug: string,
): MessageRecord | undefined {
  if (!messages) {
    return undefined;
  }
  const items = messages.freeTools;
  if (!items || typeof items !== "object" || Array.isArray(items)) {
    return undefined;
  }
  const entry = (items as MessageRecord)[slug];
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return undefined;
  }
  return entry as MessageRecord;
}

function readCatalogOverride(locale: string, slug: string): FreeToolLocalizedCopy | undefined {
  const bucket = CATALOG_I18N[locale]?.[slug];
  if (!bucket) {
    return undefined;
  }
  return bucket;
}

/**
 * Resolves tool-specific localized copy for a free tool.
 *
 * Fallback chain per field:
 *   1. messages[locale].freeToolContent[slug]
 *   2. messages[locale].freeTools.items[slug] (legacy shape)
 *   3. generated catalog i18n bundle override map
 *   4. messages.en.freeToolContent[slug] (EN locale only)
 *   5. undefined — caller falls back to English registry JSON
 */
export function resolveFreeToolLocalizedCopy(
  slug: string,
  locale: string,
): FreeToolLocalizedCopy {
  const localeContent = readFreeToolContent(LOCALE_MESSAGES[locale], slug);
  const legacyItem = readFreeToolsItem(LOCALE_MESSAGES[locale], slug);
  const catalogOverride = locale === "en" ? undefined : readCatalogOverride(locale, slug);
  const englishContent = readFreeToolContent(LOCALE_MESSAGES.en, slug);

  const pick = (key: keyof FreeToolLocalizedCopy): string | undefined => {
    if (localeContent) {
      const localeValue = readString(localeContent, key);
      if (localeValue) {
        return localeValue;
      }
    }

    if (legacyItem) {
      const legacyValue = readString(legacyItem, key);
      if (legacyValue) {
        return legacyValue;
      }
    }

    if (catalogOverride) {
      const overrideValue = catalogOverride[key];
      if (overrideValue) {
        return overrideValue;
      }
    }

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

export function resolveFreeToolDisplayTitle(
  slug: string,
  locale: string,
  registryTitle: string,
): string {
  return resolveFreeToolLocalizedCopy(slug, locale).title ?? registryTitle;
}
