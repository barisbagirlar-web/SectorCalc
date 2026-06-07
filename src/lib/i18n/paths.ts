import { routing, type AppLocale } from "@/i18n/routing";

export function withLocale(path: string, locale: AppLocale = routing.defaultLocale): string {
 const normalized = path.startsWith("/") ? path : `/${path}`;
 if (normalized === "/") {
 return `/${locale}`;
 }
 return `/${locale}${normalized}`;
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
 const stripped = pathPart.replace(/^\/(en|tr|es|de|ar)(?=\/|$)/, "") || "/";
 const localized = withLocale(stripped, locale);
 return query ? `${localized}?${query}` : localized;
}
