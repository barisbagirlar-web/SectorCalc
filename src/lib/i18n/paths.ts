import { routing, type AppLocale } from "@/i18n/routing";
import { isTurkishPath, stripLocaleFromPath } from "@/lib/i18n/locale-routing";

export function withLocale(path: string, locale: AppLocale = routing.defaultLocale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") {
    return normalized === "/" ? "/" : normalized;
  }
  if (normalized === "/") {
    return "/tr";
  }
  return `/tr${normalized}`;
}

export function localizeHref(href: string, locale: AppLocale): string {
  if (
    href.startsWith("http") ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("/admin")
  ) {
    return href;
  }

  const [pathPart, query = ""] = href.split("?");
  const stripped = stripLocaleFromPath(pathPart) || "/";
  const localized = withLocale(stripped, locale);
  return query ? `${localized}?${query}` : localized;
}

export { isTurkishPath };
