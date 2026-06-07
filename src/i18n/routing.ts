import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "tr", "es", "de", "ar"] as const;
export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
 locales: [...locales],
 defaultLocale: "en",
 localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
 createNavigation(routing);

export function isAppLocale(value: string): value is AppLocale {
 return (locales as readonly string[]).includes(value);
}

export function stripLocalePrefix(pathname: string): string {
 const match = pathname.match(/^\/(en|tr|es|de|ar)(\/.*)?$/);
 if (!match) {
 return pathname;
 }
 return match[2] ?? "/";
}
