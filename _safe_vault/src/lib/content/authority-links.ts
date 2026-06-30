import type { AuthorityGuide, AuthorityGuideCategory } from "@/lib/content/authority-guides";
import { AUTHORITY_GUIDES } from "@/lib/content/authority-guides";

const CATEGORY_SEO_HUB: Record<AuthorityGuideCategory, string> = {
  manufacturing: "manufacturing-cost-calculators",
  construction: "construction-cost-calculators",
  logistics: "logistics-route-calculators",
  "food-retail": "finance-business-calculators",
  "energy-carbon": "energy-carbon-calculators",
  agriculture: "agriculture-calculators",
  "finance-business": "finance-business-calculators",
  conversion: "unit-conversion-calculators",
};

const CATEGORY_INDUSTRY: Record<AuthorityGuideCategory, string> = {
  manufacturing: "/industries/cnc-manufacturing",
  construction: "/industries/construction",
  logistics: "/industries/logistics-transport",
  "food-retail": "/industries/restaurant",
  "energy-carbon": "/industries/energy-consumption",
  agriculture: "/industries/agriculture-crops",
  "finance-business": "/industries/ecommerce",
  conversion: "/industries/daily-renovation",
};

export function getSeoHubSlugForGuide(guide: AuthorityGuide): string {
  return CATEGORY_SEO_HUB[guide.category];
}

export function getIndustryPathForGuide(guide: AuthorityGuide): string {
  return CATEGORY_INDUSTRY[guide.category];
}

export function getAuthorityGuideForFreeTool(slug: string): AuthorityGuide | null {
  return AUTHORITY_GUIDES.find((guide) => guide.relatedFreeToolSlugs.includes(slug)) ?? null;
}

export function getAuthorityGuideForPremiumSchema(slug: string): AuthorityGuide | null {
  return AUTHORITY_GUIDES.find((guide) => guide.relatedPremiumSchemaSlugs.includes(slug)) ?? null;
}

export function getAuthorityGuideRoutePath(slug: string): string {
  return `/guides/${slug}`;
}
