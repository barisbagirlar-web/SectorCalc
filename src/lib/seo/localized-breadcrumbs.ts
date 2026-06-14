import { getTranslations } from "next-intl/server";
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo/schema-mesh";

export type SchemaBreadcrumbKey =
  | "home"
  | "freeTools"
  | "premiumTools"
  | "industries"
  | "generatedTools";

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
