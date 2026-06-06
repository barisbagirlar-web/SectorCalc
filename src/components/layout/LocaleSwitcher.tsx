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
    <label className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={(event) => handleChange(event.target.value)}
        disabled={pending}
        aria-label={t("label")}
        className="min-h-[44px] rounded-lg border border-slate/20 bg-white px-2 py-1 text-xs font-semibold text-deep-navy dark:border-slate-600 dark:bg-slate-900 dark:text-off-white"
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
