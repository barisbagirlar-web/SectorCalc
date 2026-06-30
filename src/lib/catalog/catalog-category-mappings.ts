import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import type { FreeTrafficCategory } from "@/lib/features/tools/free-traffic-infer";

/** Maps free-traffic catalog categories to industry hub sector slugs. */
export const CATALOG_CATEGORY_TO_SECTOR_SLUG: Readonly<Record<FreeTrafficCategory, string>> = {
  "construction-measurement": "construction",
  "finance-business": "ecommerce",
  "manufacturing-workshop": "cnc-manufacturing",
  "energy-carbon": "energy-carbon",
  "logistics-travel": "logistics-transport",
  "agriculture-food": "agriculture-crops",
  "everyday-life": "daily-renovation",
  "math-statistics": "ecommerce",
  conversion: "ecommerce",
  "health-body": "cleaning",
  "physics-science": "energy-consumption",
  "chemistry-science": "energy-consumption",
  "engineering-science": "cnc-manufacturing",
  "food-cooking": "restaurant",
  "date-time": "daily-renovation",
  "education-academic": "ecommerce",
  "ecology-environment": "energy-carbon",
  "gaming-entertainment": "ecommerce",
  "hobbies-diy": "landscaping-lawn-care",
};

export type SchemaCatalogMetadata = {
  readonly catalogCategory: FreeTrafficCategory;
  readonly sectorSlug: string;
  readonly categorySlug: GlobalToolCategorySlug;
};
