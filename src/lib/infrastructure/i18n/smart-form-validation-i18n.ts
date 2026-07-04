import staticMessages from "@/data/static-free-tool-messages.json" assert { type: "json" };

type ValidationMessages = {
  readonly required: string;
  readonly invalidNumber: string;
  readonly min: string;
  readonly max: string;
  readonly contractNotFound: string;
};

const LOCALE_VALIDATION: Record<string, ValidationMessages> = {
  en: {
    required: (staticMessages as any)?.en?.freeToolUi?.fieldValidation?.required ?? "This field is required",
    invalidNumber: (staticMessages as any)?.en?.freeToolUi?.fieldValidation?.invalidNumber ?? "Invalid number",
    min: (staticMessages as any)?.en?.freeToolUi?.fieldValidation?.min ?? "Minimum value is {min}",
    max: (staticMessages as any)?.en?.freeToolUi?.fieldValidation?.max ?? "Maximum value is {max}",
    contractNotFound: (staticMessages as any)?.en?.freeToolUi?.fieldValidation?.contractNotFound ?? "Validation contract not found",
  },
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
