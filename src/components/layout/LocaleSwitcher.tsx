"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
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

  return (
    <label className={`apple-locale ${className}`.trim()}>
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(event) => handleChange(event.target.value as SupportedLocale)}
        disabled={pending}
        aria-label="Language"
        className="apple-locale__select min-w-[3rem] max-w-[4.5rem]"
      >
        {LOCALE_DEFINITION_LIST.map((option) => (
          <option key={option.code} value={option.code} title={option.nativeName}>
            {option.shortLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
