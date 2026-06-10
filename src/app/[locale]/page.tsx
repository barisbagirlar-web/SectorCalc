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
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("homepageHybrid");
  const sectorCount = getHomepageSectorAreaCount();

  return createPageMetadata({
    title: t("meta.title", { sectorCount }),
    description: t("meta.description"),
    path: "/",
  });
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
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
  const premiumGroups = getCachedPremiumSchemaCatalogGroups(locale);
  const catalogSearchEntries = mergeSearchEntries(
    buildSearchEntriesFromGroups(freeGroups, "free-tools"),
    buildSearchEntriesFromGroups(premiumGroups, "premium-tools")
  );

  return (
    <PageLayout>
      {locale === "en" ? <RootLocaleAutoRedirect /> : null}
      <HomepageHybrid catalogSearchEntries={catalogSearchEntries} />
    </PageLayout>
  );
}
