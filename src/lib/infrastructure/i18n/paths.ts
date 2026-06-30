import { routing, type AppLocale } from "@/i18n/routing";
import { addLocaleToPath, stripLocaleFromPath } from "@/lib/infrastructure/i18n/locale-routing";

export function withLocale(path: string, locale: AppLocale = routing.defaultLocale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return addLocaleToPath(normalized, locale);
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

export { stripLocaleFromPath as stripLocalePrefix } from "@/lib/infrastructure/i18n/locale-routing";
