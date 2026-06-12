import enMessages from "../../../messages/en.json";
import trMessages from "../../../messages/tr.json";
import deMessages from "../../../messages/de.json";
import frMessages from "../../../messages/fr.json";
import esMessages from "../../../messages/es.json";
import arMessages from "../../../messages/ar.json";

type ValidationMessages = {
  readonly required: string;
  readonly invalidNumber: string;
  readonly min: string;
  readonly max: string;
  readonly contractNotFound: string;
};

const LOCALE_VALIDATION: Record<string, ValidationMessages> = {
  en: (enMessages as { freeToolUi: { fieldValidation: ValidationMessages } }).freeToolUi
    .fieldValidation,
  tr: (trMessages as { freeToolUi: { fieldValidation: ValidationMessages } }).freeToolUi
    .fieldValidation,
  de: (deMessages as { freeToolUi: { fieldValidation: ValidationMessages } }).freeToolUi
    .fieldValidation,
  fr: (frMessages as { freeToolUi: { fieldValidation: ValidationMessages } }).freeToolUi
    .fieldValidation,
  es: (esMessages as { freeToolUi: { fieldValidation: ValidationMessages } }).freeToolUi
    .fieldValidation,
  ar: (arMessages as { freeToolUi: { fieldValidation: ValidationMessages } }).freeToolUi
    .fieldValidation,
};

function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

export function getSmartFormValidationMessages(locale: string): ValidationMessages {
  return LOCALE_VALIDATION[locale] ?? LOCALE_VALIDATION.en;
}

export function formatSmartFormFieldError(
  locale: string,
  kind: keyof ValidationMessages,
  values: Record<string, string | number> = {},
): string {
  const messages = getSmartFormValidationMessages(locale);
  return interpolate(messages[kind], values);
}
