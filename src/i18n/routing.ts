import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, type AppLocale, isAppLocale, stripLocalePrefix } from "@/i18n/locales";

export { locales, type AppLocale, isAppLocale, stripLocalePrefix };

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
