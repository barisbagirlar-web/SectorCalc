import { getLocale, getTranslations } from "next-intl/server";
import { AudienceGrid } from "@/components/home/AudienceGrid";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CompareCards } from "@/components/home/CompareCards";
import { CTASection } from "@/components/home/CTASection";
import { HeroSection } from "@/components/home/HeroSection";
import { LimitsGrid } from "@/components/home/LimitsGrid";
import { LossGrid } from "@/components/home/LossGrid";
import { PopularTools } from "@/components/home/PopularTools";
import {
  buildSearchEntriesFromGroups,
  mergeSearchEntries,
} from "@/lib/catalog/catalog-search";
import {
  getCachedFreeTrafficCatalogGroups,
  getCachedIndustryCatalogGroups,
  getCachedPremiumSchemaCatalogGroups,
} from "@/lib/catalog/cached-catalog-groups";
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";

/** Keep homepage search focused on industry / business calculators — not daily-life catalog tabs. */
const HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES = new Set([
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
]);

export async function HomepageHybrid() {
  const locale = await getLocale();
  const tCatalog = await getTranslations("freeTrafficCatalog");

  const freeGroups = getCachedFreeTrafficCatalogGroups(
    locale,
    (meta: FreeTrafficCategoryMeta) => ({
      label: tCatalog(meta.labelKey),
      description: tCatalog(meta.descriptionKey),
    }),
    tCatalog("openCalculator"),
    tCatalog("openCalculator")
  );

  const premiumGroups = getCachedPremiumSchemaCatalogGroups(locale);
  const industryGroups = getCachedIndustryCatalogGroups(locale);

  const homepageFreeGroups = freeGroups.filter(
    (group) => !HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES.has(group.id)
  );

  const searchEntries = mergeSearchEntries(
    buildSearchEntriesFromGroups(homepageFreeGroups, "homepage"),
    buildSearchEntriesFromGroups(premiumGroups, "homepage"),
    buildSearchEntriesFromGroups(industryGroups, "homepage")
  );

  return (
    <div className="sc-home-omni">
      <HeroSection searchEntries={searchEntries} />
      <CategoryGrid />
      <LossGrid />
      <CompareCards />
      <PopularTools />
      <AudienceGrid />
      <LimitsGrid />
      <CTASection />
    </div>
  );
}
