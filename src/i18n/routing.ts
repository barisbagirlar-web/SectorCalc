import { createElement, type ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { locales, type AppLocale, isAppLocale, stripLocalePrefix } from "@/i18n/locales";
import { routing } from "@/i18n/routing-config";

export { locales, type AppLocale, isAppLocale, stripLocalePrefix, routing };

const navigation = createNavigation(routing);

const IntlLink = navigation.Link;

type IntlLinkProps = ComponentProps<typeof IntlLink>;

/** Platform policy: internal navigation must not parallel-prefetch RSC streams. */
export function Link({ prefetch = false, ...props }: IntlLinkProps) {
  return createElement(IntlLink, { prefetch, ...props });
}

export const { redirect, usePathname, useRouter, getPathname } = navigation;
