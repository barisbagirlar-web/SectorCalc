import enMessages from "../../../messages/en.json";
import fieldI18nBundle from "@/data/free-tool-inputs-i18n.generated.json";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
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
};

/** Single source of truth for calculator field label / helper copy. */
const FIELD_I18N = fieldI18nBundle as Record<
  string,
  Record<string, Record<string, FieldDisplayCopy>>
>;

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
  _locale: string,
  registryTitle: string,
): string {
  return resolveFreeToolLocalizedCopy(slug, "en").title ?? registryTitle;
}

export function readFreeToolUiString(locale: string, key: string): string | undefined {
  return readFreeToolUi(LOCALE_MESSAGES[locale], key) ?? readFreeToolUi(LOCALE_MESSAGES.en, key);
}

export function resolveSmartFormDecisionGoal(
  _slug: string,
  _locale: string,
  contractGoal: string,
): string {
  return contractGoal;
}

export function resolveFreeToolFieldDisplay(
  slug: string,
  fieldKey: string,
  _locale: string,
  fallback: { readonly label: string; readonly placeholder: string; readonly helper?: string },
): FieldDisplayCopy {
  const normalizedKey = fieldKey.toLowerCase();

  const fromBundle = readGeneratedFieldCopy("en", slug, normalizedKey);
  if (fromBundle?.label) {
    return fromBundle;
  }

  return {
    label: fallback.label,
    placeholder: fallback.placeholder,
    helper: fallback.helper,
  };
}

function localizeToolInputCopy<
  T extends {
    readonly key: string;
    readonly label: string;
    readonly helper?: string;
    readonly helperText?: string;
    readonly options?: readonly { readonly value: string; readonly label: string }[];
  },
>(slug: string, _locale: string, inputs: readonly T[]): T[] {
  return inputs.map((input) => {
    const helperSource = input.helper ?? input.helperText ?? input.label;
    const display = resolveFreeToolFieldDisplay(slug, "en", input, {
      label: input.label,
      placeholder: helperSource,
      helper: helperSource,
    });
    return {
      ...input,
      label: display.label,
      helper: display.helper ?? helperSource,
      helperText: display.helper ?? input.helperText ?? helperSource,
      options: input.options,
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
  _locale: string,
  source: {
    readonly label: string;
    readonly helper?: string;
    readonly label_i18n?: Readonly<Record<string, string>>;
    readonly helper_i18n?: Readonly<Record<string, string>>;
  },
): FieldDisplayCopy {
  return resolveFreeToolFieldDisplay(toolSlug, fieldKey, "en", {
    label: source.label,
    placeholder: source.helper ?? source.label,
    helper: source.helper,
  });
}
