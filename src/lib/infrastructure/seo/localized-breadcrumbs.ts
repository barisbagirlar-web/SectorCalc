import { getTranslations } from "@/lib/i18n-stub";
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from "@/lib/infrastructure/seo/schema-mesh";

export type SchemaBreadcrumbKey = "home" | "freeTools" | "premiumTools" | "industries";

type LocalizedBreadcrumbInput =
  | { readonly key: SchemaBreadcrumbKey; readonly path: string }
  | BreadcrumbItem;

export async function buildLocalizedBreadcrumbJsonLd(
  items: readonly LocalizedBreadcrumbInput[],
  locale: string
) {
  const t = await getTranslations({ locale, namespace: "schemaBreadcrumbs" });
  const resolved: BreadcrumbItem[] = items.map((item) => {
    if ("key" in item) {
      return { name: t(item.key), path: item.path };
    }
    return item;
  });
  return buildBreadcrumbJsonLd(resolved, locale);
}
