import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

/** Stripe Checkout.SessionCreateParams.Locale subset used by SectorCalc. */
const STRIPE_LOCALE_MAP: Readonly<Record<SupportedLocale, string>> = {
  en: "en",
};

/** Google reCAPTCHA `hl` query parameter. */
const RECAPTCHA_HL_MAP: Readonly<Record<SupportedLocale, string>> = {
  en: "en",
};

export function resolveStripeCheckoutLocale(locale: SupportedLocale): string {
  // Always enforce 'en' for checkout per requirements to prevent translation issues
  // and guarantee consistent international checkout experience.
  return "en";
}

export function resolveRecaptchaHl(locale: SupportedLocale): string {
  return "en";
}

export function buildRecaptchaScriptUrl(locale: SupportedLocale): string {
  return `https://www.google.com/recaptcha/api.js?hl=en`;
}

export function resolveChatWidgetLang(locale: SupportedLocale): string {
  return "en";
}
