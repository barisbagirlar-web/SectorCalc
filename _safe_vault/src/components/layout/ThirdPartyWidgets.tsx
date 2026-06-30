"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { isAppLocale } from "@/i18n/locales";
import {
  buildRecaptchaScriptUrl,
  resolveChatWidgetLang,
  resolveStripeCheckoutLocale,
} from "@/lib/i18n/third-party-locale";

/**
 * Centralizes locale parameters for third-party embeds (Stripe, reCAPTCHA, chat).
 * Add script tags here when a vendor widget is enabled — never hardcode locale strings in pages.
 */
export function ThirdPartyWidgets() {
  const rawLocale = useLocale();
  const locale = isAppLocale(rawLocale) ? rawLocale : "en";

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.stripeLocale = resolveStripeCheckoutLocale(locale);
    root.dataset.recaptchaHl = locale;
    root.dataset.chatLang = resolveChatWidgetLang(locale);
    root.dataset.recaptchaScriptUrl = buildRecaptchaScriptUrl(locale);
  }, [locale]);

  return null;
}
