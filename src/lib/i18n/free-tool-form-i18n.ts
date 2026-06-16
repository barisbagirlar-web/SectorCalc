import enMessages from "../../../messages/en.json";
import trMessages from "../../../messages/tr.json";
import deMessages from "../../../messages/de.json";
import frMessages from "../../../messages/fr.json";
import esMessages from "../../../messages/es.json";
import arMessages from "../../../messages/ar.json";
import fieldI18nBundle from "@/data/free-tool-inputs-i18n.generated.json";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locale-config";
import type { RevenueToolInput } from "@/lib/tools/revenue-tools";

type MessageRecord = Record<string, unknown>;

type FieldDisplayCopy = {
  readonly label: string;
  readonly placeholder: string;
  readonly helper?: string;
};

/** UI chrome only — field copy must not read messages.freeToolInputs (legacy override risk). */
const LOCALE_MESSAGES: Record<string, MessageRecord> = {
  en: enMessages as MessageRecord,
  tr: trMessages as MessageRecord,
  de: deMessages as MessageRecord,
  fr: frMessages as MessageRecord,
  es: esMessages as MessageRecord,
  ar: arMessages as MessageRecord,
};

/** Single source of truth for calculator field label / helper copy. */
const FIELD_I18N = fieldI18nBundle as Record<
  string,
  Record<string, Record<string, FieldDisplayCopy>>
>;

const PLACEHOLDER_BY_LOCALE: Record<SupportedLocale, (label: string) => string> = {
  en: (label) => `Enter ${label.toLowerCase()}`,
  tr: (label) => `${label} girin`,
  de: (label) => `${label} eingeben`,
  fr: (label) => `Saisir ${label.toLowerCase()}`,
  es: (label) => `Introduzca ${label.toLowerCase()}`,
  ar: (label) => `أدخل ${label}`,
};

function readString(source: MessageRecord | undefined, key: string): string | undefined {
  if (!source) {
    return undefined;
  }
  const value = source[key];
  return typeof value === "string" ? value : undefined;
}

function readFreeToolUi(messages: MessageRecord | undefined, key: string): string | undefined {
  if (!messages) {
    return undefined;
  }
  const ui = messages.freeToolUi;
  if (!ui || typeof ui !== "object" || Array.isArray(ui)) {
    return undefined;
  }
  return readString(ui as MessageRecord, key);
}

function readGeneratedFieldCopy(
  locale: string,
  slug: string,
  fieldKey: string,
): FieldDisplayCopy | undefined {
  const localeBundle = FIELD_I18N[locale]?.[slug]?.[fieldKey.toLowerCase()];
  if (!localeBundle?.label) {
    return undefined;
  }
  return localeBundle;
}

export function resolveFreeToolDisplayTitle(
  slug: string,
  locale: string,
  registryTitle: string,
): string {
  return resolveFreeToolLocalizedCopy(slug, locale).title ?? registryTitle;
}

export function readFreeToolUiString(locale: string, key: string): string | undefined {
  const localeValue = readFreeToolUi(LOCALE_MESSAGES[locale], key);
  if (localeValue) {
    return localeValue;
  }
  if (locale !== "en") {
    return readFreeToolUi(LOCALE_MESSAGES.en, key);
  }
  return undefined;
}

export function resolveSmartFormDecisionGoal(
  _slug: string,
  locale: string,
  contractGoal: string,
): string {
  if (locale === "en") {
    return contractGoal;
  }
  return readFreeToolUiString(locale, "contractFormDecisionGoal") ?? contractGoal;
}

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

function finalizeFieldCopy(
  copy: FieldDisplayCopy,
  locale: string,
  alreadyLocalized = false,
): FieldDisplayCopy {
  if (locale === "en" || alreadyLocalized) {
    return copy;
  }
  return {
    label: translateCalculatorPhrase(copy.label, locale),
    placeholder: translateCalculatorPhrase(copy.placeholder, locale),
    helper: copy.helper ? translateCalculatorPhrase(copy.helper, locale) : undefined,
  };
}

function hasDistinctBundleCopy(
  locale: string,
  slug: string,
  normalizedKey: string,
  fromBundle: FieldDisplayCopy,
): boolean {
  if (locale === "en") {
    return true;
  }
  const enBundle = readGeneratedFieldCopy("en", slug, normalizedKey);
  if (!enBundle?.label) {
    return Boolean(fromBundle.label);
  }
  return (
    fromBundle.label !== enBundle.label ||
    fromBundle.placeholder !== enBundle.placeholder ||
    (fromBundle.helper ?? "") !== (enBundle.helper ?? "")
  );
}

export function resolveFreeToolFieldDisplay(
  slug: string,
  fieldKey: string,
  locale: string,
  fallback: { readonly label: string; readonly placeholder: string; readonly helper?: string },
): FieldDisplayCopy {
  const normalizedKey = fieldKey.toLowerCase();

  const fromBundle = readGeneratedFieldCopy(locale, slug, normalizedKey);
  if (fromBundle?.label && hasDistinctBundleCopy(locale, slug, normalizedKey, fromBundle)) {
    return finalizeFieldCopy(fromBundle, locale, locale !== "en");
  }

  if (locale !== "en" && isSupportedLocale(locale)) {
    const fromEnBundle = readGeneratedFieldCopy("en", slug, normalizedKey);
    if (fromEnBundle) {
      return finalizeFieldCopy(
        {
          label: fromEnBundle.label,
          placeholder: PLACEHOLDER_BY_LOCALE[locale](translateCalculatorPhrase(fromEnBundle.label, locale)),
          helper: fromEnBundle.helper,
        },
        locale,
      );
    }
  }

  if (locale === "en") {
    return {
      label: fallback.label,
      placeholder: fallback.placeholder,
      helper: fallback.helper,
    };
  }

  const placeholderTemplate = isSupportedLocale(locale)
    ? PLACEHOLDER_BY_LOCALE[locale]
    : PLACEHOLDER_BY_LOCALE.en;

  return finalizeFieldCopy(
    {
      label: fallback.label,
      placeholder: placeholderTemplate(translateCalculatorPhrase(fallback.label, locale)),
      helper: fallback.helper,
    },
    locale,
  );
}

function localizeToolInputCopy<
  T extends {
    readonly key: string;
    readonly label: string;
    readonly helper?: string;
    readonly helperText?: string;
    readonly options?: readonly { readonly value: string; readonly label: string }[];
  },
>(slug: string, locale: string, inputs: readonly T[]): T[] {
  return inputs.map((input) => {
    const helperSource = input.helper ?? input.helperText ?? input.label;
    const display = resolveFreeToolFieldDisplay(slug, input.key, locale, {
      label: input.label,
      placeholder: helperSource,
      helper: helperSource,
    });
    return {
      ...input,
      label: display.label,
      helper: display.helper ?? helperSource,
      helperText: display.helper ?? input.helperText ?? helperSource,
      options: input.options?.map((option) => ({
        ...option,
        label: translateCalculatorPhrase(option.label, locale),
      })),
    };
  });
}

export function localizeFreeTrafficToolInputs<
  T extends { readonly key: string; readonly label: string; readonly helper: string },
>(slug: string, locale: string, inputs: readonly T[]): T[] {
  return localizeToolInputCopy(slug, locale, inputs);
}

export function localizeRevenueToolInputs(
  slug: string,
  locale: string,
  inputs: readonly RevenueToolInput[],
): RevenueToolInput[] {
  return localizeToolInputCopy(slug, locale, inputs);
}

/** Premium schema + revenue paid inputs — same field i18n pipeline */
export function resolveCalculatorInputDisplay(
  toolSlug: string,
  fieldKey: string,
  locale: string,
  source: { readonly label: string; readonly helper?: string },
): FieldDisplayCopy {
  return resolveFreeToolFieldDisplay(toolSlug, fieldKey, locale, {
    label: source.label,
    placeholder: source.helper ?? source.label,
    helper: source.helper,
  });
}
