"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { LOCALE_DEFINITION_LIST } from "@/lib/i18n/locale-config";
import {
  addLocaleToPath,
  stripLocaleFromPath,
  type SupportedLocale,
} from "@/lib/i18n/locale-routing";
import { setLocaleCookie } from "@/lib/i18n/locale-client";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const t = useTranslations("locale");
  const [pending, startTransition] = useTransition();

  const handleChange = (nextLocale: SupportedLocale) => {
    if (nextLocale === locale) {
      return;
    }

    startTransition(() => {
      setLocaleCookie(nextLocale);
      const basePath = stripLocaleFromPath(pathname);
      const nextPath = addLocaleToPath(basePath, nextLocale);
      window.location.assign(nextPath);
    });
  };

  const currentLabel = t(locale);

  return (
    <label className={`apple-locale language-selector ${className}`.trim()}>
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={(event) => handleChange(event.target.value as SupportedLocale)}
        disabled={pending}
        aria-label={t("label")}
        className="apple-locale__select language-selector__select"
        title={currentLabel}
      >
        {LOCALE_DEFINITION_LIST.map((option) => (
          <option key={option.code} value={option.code}>
            {t(option.code)}
          </option>
        ))}
      </select>
    </label>
  );
}
