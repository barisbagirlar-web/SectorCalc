import enMessages from "../../../../messages/en.json";
import catalogI18nBundle from "../../../data/free-tool-catalog-i18n.generated.json";
import batch1I18nBundle from "../../../data/roadmap-free-batch1-i18n.generated.json";
import batch2I18nBundle from "../../../data/roadmap-free-batch2-i18n.generated.json";
import { translateCalculatorPhrase } from "@/lib/infrastructure/i18n/calculator-phrase-translate";
import { humanizeCanonicalSlug } from "@/lib/features/tools/canonical-tool-slugs";

type MessageRecord = Record<string, unknown>;

const LOCALE_MESSAGES: Record<string, MessageRecord> = {
  en: enMessages as MessageRecord,
};

const CATALOG_I18N = catalogI18nBundle as Record<
  string,
  Record<string, { title?: string; description?: string; seoTitle?: string; seoDescription?: string }>
>;

const BATCH1_I18N = batch1I18nBundle as unknown as Record<
  string,
  Record<string, { title?: string; description?: string; seoTitle?: string; seoDescription?: string }>
>;

const BATCH2_I18N = batch2I18nBundle as unknown as Record<
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
  const bucket = CATALOG_I18N[locale]?.[slug] ?? BATCH1_I18N[locale]?.[slug] ?? BATCH2_I18N[locale]?.[slug];
  if (!bucket) {
    return undefined;
  }
  return bucket;
}

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
  const localized = resolveFreeToolLocalizedCopy(slug, locale).title;
  if (localized) return localized;

  // Glossary-based translation of humanized slug
  if (locale !== "en") {
    const humanized = humanizeCanonicalSlug(slug);
    const translated = translateCalculatorPhrase(humanized, locale);
    if (translated.trim() && translated !== humanized) {
      return translated;
    }
  }

  return registryTitle;
}

export function resolveFreeToolSeoTitle(
  slug: string,
  locale: string,
  registrySeoTitle: string,
  tierOneMetaTitle?: string | null,
): string {
  const copy = resolveFreeToolLocalizedCopy(slug, locale);
  if (copy.seoTitle) {
    return copy.seoTitle;
  }
  if (copy.title) {
    return `${copy.title} | SectorCalc`;
  }
  if (locale === "en") {
    return tierOneMetaTitle ?? registrySeoTitle;
  }
  return registrySeoTitle.includes("| SectorCalc")
    ? registrySeoTitle
    : `${resolveFreeToolDisplayTitle(slug, locale, registrySeoTitle)} | SectorCalc`;
}

export function resolveFreeToolSeoDescription(
  slug: string,
  locale: string,
  registrySeoDescription: string,
  tierOneMetaDescription?: string | null,
): string {
  const copy = resolveFreeToolLocalizedCopy(slug, locale);
  if (copy.seoDescription) {
    return copy.seoDescription;
  }
  if (copy.description) {
    return copy.description;
  }
  if (locale === "en") {
    return tierOneMetaDescription ?? registrySeoDescription;
  }
  return registrySeoDescription;
}
