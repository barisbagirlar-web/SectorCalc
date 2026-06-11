import enMessages from "../../../messages/en.json";
import trMessages from "../../../messages/tr.json";
import deMessages from "../../../messages/de.json";
import frMessages from "../../../messages/fr.json";
import esMessages from "../../../messages/es.json";
import arMessages from "../../../messages/ar.json";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";

type MessageRecord = Record<string, unknown>;

const LOCALE_MESSAGES: Record<string, MessageRecord> = {
  en: enMessages as MessageRecord,
  tr: trMessages as MessageRecord,
  de: deMessages as MessageRecord,
  fr: frMessages as MessageRecord,
  es: esMessages as MessageRecord,
  ar: arMessages as MessageRecord,
};

const TR_FIELD_DISPLAY_FALLBACKS: Record<
  string,
  Record<string, { readonly label: string; readonly placeholder: string; readonly helper?: string }>
> = {
  "square-meter-calculator": {
    length: {
      label: "Uzunluk",
      placeholder: "Uzunluk girin",
      helper: "Oda veya döşeme uzunluğu",
    },
    width: {
      label: "Genişlik",
      placeholder: "Genişlik girin",
      helper: "Oda veya döşeme genişliği",
    },
  },
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

function readFreeToolInputField(
  messages: MessageRecord | undefined,
  slug: string,
  fieldKey: string,
): { label?: string; placeholder?: string; helper?: string } | undefined {
  if (!messages) {
    return undefined;
  }
  const inputsRoot = messages.freeToolInputs;
  if (!inputsRoot || typeof inputsRoot !== "object" || Array.isArray(inputsRoot)) {
    return undefined;
  }
  const toolEntry = (inputsRoot as MessageRecord)[slug];
  if (!toolEntry || typeof toolEntry !== "object" || Array.isArray(toolEntry)) {
    return undefined;
  }
  const fieldEntry = (toolEntry as MessageRecord)[fieldKey];
  if (!fieldEntry || typeof fieldEntry !== "object" || Array.isArray(fieldEntry)) {
    return undefined;
  }
  const record = fieldEntry as MessageRecord;
  return {
    label: readString(record, "label"),
    placeholder: readString(record, "placeholder"),
    helper: readString(record, "helper"),
  };
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
  if (locale === "tr") {
    return readFreeToolUiString(locale, "contractFormDecisionGoal") ?? contractGoal;
  }
  return contractGoal;
}

export function resolveFreeToolFieldDisplay(
  slug: string,
  fieldKey: string,
  locale: string,
  fallback: { readonly label: string; readonly placeholder: string; readonly helper?: string },
): { label: string; placeholder: string; helper?: string } {
  const normalizedKey = fieldKey.toLowerCase();
  const fromMessages = readFreeToolInputField(LOCALE_MESSAGES[locale], slug, normalizedKey);
  if (fromMessages?.label || fromMessages?.placeholder || fromMessages?.helper) {
    return {
      label: fromMessages.label ?? fallback.label,
      placeholder: fromMessages.placeholder ?? fallback.placeholder,
      helper: fromMessages.helper ?? fallback.helper,
    };
  }

  if (locale === "tr") {
    const trFallback = TR_FIELD_DISPLAY_FALLBACKS[slug]?.[normalizedKey];
    if (trFallback) {
      return trFallback;
    }
  }

  return {
    label: fallback.label,
    placeholder: fallback.placeholder,
    helper: fallback.helper,
  };
}

export function localizeFreeTrafficToolInputs<T extends { readonly key: string; readonly label: string; readonly helper: string }>(
  slug: string,
  locale: string,
  inputs: readonly T[],
): T[] {
  if (locale === "en") {
    return [...inputs];
  }

  return inputs.map((input) => {
    const display = resolveFreeToolFieldDisplay(slug, input.key, locale, {
      label: input.label,
      placeholder: input.helper,
      helper: input.helper,
    });
    return {
      ...input,
      label: display.label,
      helper: display.helper ?? input.helper,
    };
  });
}
