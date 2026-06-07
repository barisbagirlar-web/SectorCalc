"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, locales, type AppLocale } from "@/i18n/routing";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("locale");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const handleChange = (nextLocale: string) => {
    if (nextLocale === locale) {
      return;
    }
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as AppLocale });
    });
  };

  return (
    <label className={`apple-locale ${className}`.trim()}>
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={(event) => handleChange(event.target.value)}
        disabled={pending}
        aria-label={t("label")}
        className="apple-locale__select"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {t(code)}
          </option>
        ))}
      </select>
    </label>
  );
}
