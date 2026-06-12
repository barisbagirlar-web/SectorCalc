import { FREE_TO_PREMIUM_TITLE_LIST_TR } from "../src/lib/freemium/free-to-premium-migration-list";
import { buildFreeToPremiumMigrationReport } from "../src/lib/freemium/resolve-free-to-premium-migration";
import {
  buildCategorizedToolIndex,
  listPremiumToolsByCategory,
} from "../src/lib/catalog/build-categorized-tool-index";
import { listPublicFreeToolSlugs } from "../src/lib/tools/free-traffic-routes";
import { listGlobalCategories } from "../src/lib/catalog/global-tool-category-taxonomy";

const report = buildFreeToPremiumMigrationReport();
const index = buildCategorizedToolIndex();
const migratedSlugs = new Set(report.matched.map((entry) => entry.slug));
const freeItems = index.filter((item) => item.tier === "free");
const migratedPremiumItems = index.filter((item) => item.source === "existing-free-migrated");
const slugCounts = new Map<string, number>();
for (const item of index) {
  slugCounts.set(item.slug, (slugCounts.get(item.slug) ?? 0) + 1);
}
const duplicateSlugsInIndex = [...slugCounts.entries()]
  .filter(([, count]) => count > 1)
  .map(([slug]) => slug);
const categorySlugSet = new Set(listGlobalCategories().map((category) => category.slug));
const unknownCategories = report.matched
  .filter((entry) => !categorySlugSet.has(entry.categorySlug))
  .map((entry) => entry.categorySlug);
const freeCatalogSlugs = new Set(freeItems.map((item) => item.slug));
const stillInFreeCatalog = [...migratedSlugs].filter((slug) => freeCatalogSlugs.has(slug));
const missingFromPremiumIndex = [...migratedSlugs].filter(
  (slug) =>
    !index.some(
      (item) =>
        item.slug === slug && (item.tier === "premium" || item.tier === "premium-schema"),
    ),
);
const missingCategoryDetail = report.matched
  .filter(
    (entry) =>
      listPremiumToolsByCategory(entry.categorySlug).filter((item) => item.slug === entry.slug)
        .length === 0,
  )
  .map((entry) => entry.slug);

console.log(
  JSON.stringify({
    listTotal: FREE_TO_PREMIUM_TITLE_LIST_TR.length,
    reportListTotal: report.listTotal,
    matchedCount: report.matched.length,
    notFoundInFreeTools: report.notFoundInFreeTools,
    duplicateSlugWarnings: report.duplicateSlugWarnings,
    migratedPremiumIndexCount: migratedPremiumItems.length,
    stillInFreeCatalog,
    missingFromPremiumIndex,
    unknownCategories,
    missingCategoryDetail,
    publicFreeSlugCount: listPublicFreeToolSlugs().length,
    duplicateSlugsInIndex,
  }),
);
