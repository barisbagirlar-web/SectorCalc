import type { LocaleCode } from "@/config/locales";
import { LOCALES } from "@/config/locales";

export interface FormatDateOptions {
  locale?: LocaleCode;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}

export function formatDate(
  date: Date,
  options: FormatDateOptions = {}
): string {
  const localeCode = options.locale ?? "en";
  const locale = LOCALES[localeCode];

  return new Intl.DateTimeFormat(locale.languageTag, {
    dateStyle: options.dateStyle ?? "medium",
    timeStyle: options.timeStyle,
  }).format(date);
}
