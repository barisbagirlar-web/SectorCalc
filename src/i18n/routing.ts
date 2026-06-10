import { createElement, type ComponentProps } from "react";
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, type AppLocale, isAppLocale, stripLocalePrefix } from "@/i18n/locales";

export { locales, type AppLocale, isAppLocale, stripLocalePrefix };

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

const navigation = createNavigation(routing);

const IntlLink = navigation.Link;

type IntlLinkProps = ComponentProps<typeof IntlLink>;

/** Platform policy: internal navigation must not parallel-prefetch RSC streams. */
export function Link({ prefetch = false, ...props }: IntlLinkProps) {
  return createElement(IntlLink, { prefetch, ...props });
}

export const { redirect, usePathname, useRouter, getPathname } = navigation;
