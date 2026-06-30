import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

/** Stripe Checkout.SessionCreateParams.Locale subset used by SectorCalc. */
const STRIPE_LOCALE_MAP: Readonly<Record<SupportedLocale, string>> = {
  en: "en",
  tr: "tr",
  de: "de",
  fr: "fr",
  es: "es",
  ar: "ar",
};

/** Google reCAPTCHA `hl` query parameter. */
const RECAPTCHA_HL_MAP: Readonly<Record<SupportedLocale, string>> = {
  en: "en",
  tr: "tr",
  de: "de",
  fr: "fr",
  es: "es",
  ar: "ar",
};

export function resolveStripeCheckoutLocale(locale: SupportedLocale): string {
  return STRIPE_LOCALE_MAP[locale];
}

export function resolveRecaptchaHl(locale: SupportedLocale): string {
  return RECAPTCHA_HL_MAP[locale];
}

export function buildRecaptchaScriptUrl(locale: SupportedLocale): string {
  return `https://www.google.com/recaptcha/api.js?hl=${resolveRecaptchaHl(locale)}`;
}

export function resolveChatWidgetLang(locale: SupportedLocale): string {
  return locale;
}
