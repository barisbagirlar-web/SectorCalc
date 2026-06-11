import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { RootLocaleAutoRedirect } from "@/components/i18n/RootLocaleAutoRedirect";
import { HomepageHybrid } from "@/components/home/HomepageHybrid";
import { getHomepageSectorAreaCount } from "@/lib/home/homepage-stats";
import { createPageMetadata } from "@/lib/metadata";
import {
  buildSearchEntriesFromGroups,
  mergeSearchEntries,
} from "@/lib/catalog/catalog-search";
import {
  getCachedFreeTrafficCatalogGroups,
  getCachedPremiumSchemaCatalogGroups,
} from "@/lib/catalog/cached-catalog-groups";
import type { AppLocale } from "@/i18n/routing";
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";
import type { CatalogSearchEntry } from "@/lib/catalog/catalog-search";

export const revalidate = 3600;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepageHybrid" });
  const sectorCount = getHomepageSectorAreaCount();

  return createPageMetadata({
    title: t("meta.title", { sectorCount }),
    description: t("meta.description"),
    path: "/",
    locale: locale as AppLocale,
  });
}

async function buildHomepageCatalogSearchEntries(
  locale: string
): Promise<readonly CatalogSearchEntry[]> {
  const tFree = await getTranslations("freeTrafficCatalog");
  const freeGroups = getCachedFreeTrafficCatalogGroups(
    locale,
    (meta: FreeTrafficCategoryMeta) => ({
      label: tFree(meta.labelKey),
      description: tFree(meta.descriptionKey),
    }),
    tFree("decisionAnalyzerNote"),
    tFree("openCalculator")
  );

  return mergeSearchEntries(
    buildSearchEntriesFromGroups(freeGroups, "free-tools"),
    buildSearchEntriesFromGroups(
      getCachedPremiumSchemaCatalogGroups(locale),
      "premium-tools"
    )
  );
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const catalogSearchEntries =
    locale === "tr" ? [] : await buildHomepageCatalogSearchEntries(locale);

  return (
    <PageLayout>
      {locale === "en" ? <RootLocaleAutoRedirect /> : null}
      <HomepageHybrid catalogSearchEntries={catalogSearchEntries} />
    </PageLayout>
  );
}
