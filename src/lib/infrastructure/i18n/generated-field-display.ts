import { resolveGeneratedI18nText } from "@/lib/features/generated-tools/resolve-i18n-text";
import type { GeneratedToolInput } from "@/lib/features/generated-tools/types";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { resolveFreeToolFieldDisplay } from "@/lib/infrastructure/i18n/free-tool-form-i18n";

export type GeneratedFieldDisplay = {
  readonly label: string;
  readonly placeholder: string;
  readonly helper?: string;
};

const PLACEHOLDER_BY_LOCALE: Record<SupportedLocale, (label: string) => string> = {
  en: (label) => `Enter ${label.toLowerCase()}`,
  tr: (label) => `${label} girin`,
  de: (label) => `${label} eingeben`,
  fr: (label) => `Saisir ${label.toLowerCase()}`,
  es: (label) => `Introduzca ${label.toLowerCase()}`,
  ar: (label) => `أدخل ${label}`,
};

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

/** Schema locale copy is intentionally distinct from English anchor. */
export function hasDistinctSchemaLocaleCopy(
  i18n: GeneratedToolInput["label_i18n"],
  locale: SupportedLocale,
): boolean {
  if (locale === "en" || !i18n) {
    return false;
  }
  const localized = i18n[locale]?.trim();
  const english = i18n.en?.trim();
  if (!localized || !english) {
    return false;
  }
  return localized !== english;
}

/**
 * Generated calculator fields — schema i18n wins when locale copy is distinct;
 * otherwise bundle + phrase glossary pipeline applies.
 */
export function resolveGeneratedFieldDisplay(
  slug: string,
  input: Pick<GeneratedToolInput, "id" | "label" | "label_i18n" | "businessContext" | "businessContext_i18n">,
  locale: string,
): GeneratedFieldDisplay {
  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";

  const label = resolveGeneratedI18nText(input.label_i18n, normalizedLocale, input.label);
  const helper = resolveGeneratedI18nText(
    input.businessContext_i18n,
    normalizedLocale,
    input.businessContext ?? "",
  );

  const schemaLabelDistinct = hasDistinctSchemaLocaleCopy(input.label_i18n, normalizedLocale);
  const schemaHelperDistinct = hasDistinctSchemaLocaleCopy(
    input.businessContext_i18n,
    normalizedLocale,
  );

  if (schemaLabelDistinct || schemaHelperDistinct) {
    const placeholderTemplate = PLACEHOLDER_BY_LOCALE[normalizedLocale];
    return {
      label,
      placeholder: helper.trim() ? helper : placeholderTemplate(label),
      helper: helper.trim() ? helper : undefined,
    };
  }

  return resolveFreeToolFieldDisplay(slug, input.id, normalizedLocale, {
    label,
    placeholder: helper.trim() ? helper : label,
    helper: helper.trim() ? helper : undefined,
  });
}
