import type { LocaleCode } from "@/config/locales";
import { LOCALES } from "@/config/locales";

export interface FormatCurrencyOptions {
 locale?: LocaleCode;
 currency?: string;
 minimumFractionDigits?: number;
 maximumFractionDigits?: number;
}

export function formatCurrency(
 amount: number,
 options: FormatCurrencyOptions = {}
): string {
 const localeCode = options.locale ?? "en";
 const locale = LOCALES[localeCode];
 const currency = options.currency ?? locale.defaultCurrency;

 return new Intl.NumberFormat(locale.languageTag, {
 style: "currency",
 currency,
 minimumFractionDigits: options.minimumFractionDigits,
 maximumFractionDigits: options.maximumFractionDigits,
 }).format(amount);
}
