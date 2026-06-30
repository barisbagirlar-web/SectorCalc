import { createElement, type ComponentProps } from "react";
import NextLink from "next/link";
import { createNavigation } from "next-intl/navigation";
import { locales, type AppLocale, isAppLocale, stripLocalePrefix } from "@/i18n/locales";
import { routing } from "@/i18n/routing-config";

export { locales, type AppLocale, isAppLocale, stripLocalePrefix, routing };

type IntlLinkProps = ComponentProps<typeof NextLink>;

/** Platform policy: internal navigation must not parallel-prefetch RSC streams. */
export function Link({ prefetch = false, ...props }: IntlLinkProps) {
  return createElement(NextLink, { prefetch, ...props });
}

/** next-intl navigation re-exports for i18n-aware routing hooks. */
export const { redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
