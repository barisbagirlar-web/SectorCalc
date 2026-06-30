import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { addLocaleToPath } from "@/lib/i18n/locale-routing";

/** Core catalog hubs — smoke-tested on every supported locale route. */
export const LOCALE_CATALOG_ROUTES = [
  "/free-tools",
  "/pro-tools",
  "/categories",
  "/industries",
] as const;

export type LocaleCatalogRoute = (typeof LOCALE_CATALOG_ROUTES)[number];

export function buildLocaleCatalogSmokeRoutes(): string[] {
  const routes: string[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const path of LOCALE_CATALOG_ROUTES) {
      routes.push(addLocaleToPath(path, locale));
    }
  }

  return routes;
}
