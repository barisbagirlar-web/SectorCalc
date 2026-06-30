"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALE_DEFINITION_LIST, getLocaleDefinition } from "@/lib/i18n/locale-config";
import {
  addLocaleToPath,
  stripLocaleFromPath,
  type SupportedLocale,
} from "@/lib/i18n/locale-routing";
import { setLocaleCookie } from "@/lib/i18n/locale-client";

export function LocaleSwitcher({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "compact";
}) {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("locale");

  const handleChange = (nextLocale: SupportedLocale) => {
    if (nextLocale === locale) {
      return;
    }

    setLocaleCookie(nextLocale, { manual: true });
    const currentPath = window.location.pathname;
    const basePath = stripLocaleFromPath(currentPath);
    const nextPath = addLocaleToPath(basePath, nextLocale);
    window.location.assign(nextPath);
  };

  const currentLabel = t(locale);
  const shortLabel = getLocaleDefinition(locale).shortLabel;
  const compact = variant === "compact";

  return (
    <label
      className={`apple-locale language-selector${compact ? " language-selector--compact-code" : ""} ${className}`.trim()}
      title={currentLabel}
    >
      <span className="sr-only">{t("label")}</span>
      {compact ? (
        <span className="language-selector__code" aria-hidden="true">
          {shortLabel}
        </span>
      ) : null}
      <select
        value={locale}
        onChange={(event) => handleChange(event.target.value as SupportedLocale)}
        disabled={false}
        aria-label={t("label")}
        className={`apple-locale__select language-selector__select${compact ? " language-selector__select--overlay" : ""}`}
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
