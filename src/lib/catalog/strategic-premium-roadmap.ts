import {
  STRATEGIC_PREMIUM_CALCULATORS,
  type Locale,
  type RoadmapStatus,
  type StrategicPremiumCalculator,
} from "@/data/strategic-premium-calculators";
import { CANONICAL_FREE_SLUGS, CANONICAL_PREMIUM_SLUGS } from "@/lib/tools/canonical-tool-slugs";
import { PREMIUM_SCHEMA_LOCALIZED_SLUGS } from "@/data/premium-schema-i18n";
import { listPremiumSchemaIds } from "@/lib/premium-schema/schema-registry";
import { revenueTools } from "@/lib/tools/revenue-tools";
import {
  getPremiumSchemaToolHref,
  resolvePremiumToolHref,
} from "@/lib/tools/tool-links";

const FREE_TRAFFIC_SLUGS = new Set(CANONICAL_FREE_SLUGS);
const REVENUE_FREE_SLUGS = new Set(CANONICAL_PREMIUM_SLUGS);
const REVENUE_PAID_SLUGS = new Set(revenueTools.map((tool) => tool.paidSlug));
const PREMIUM_SCHEMA_IDS = new Set([
  ...listPremiumSchemaIds(),
  ...PREMIUM_SCHEMA_LOCALIZED_SLUGS,
]);

export type StrategicPremiumRoadmapCard = {
  readonly id: string;
  readonly slug: string;
  readonly phase: StrategicPremiumCalculator["phase"];
  readonly score: number;
  readonly status: RoadmapStatus;
  readonly categoryId: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly href: string | null;
};

export function resolveMappedLiveToolHref(mappedLiveSlug: string): string {
  if (FREE_TRAFFIC_SLUGS.has(mappedLiveSlug) || REVENUE_FREE_SLUGS.has(mappedLiveSlug)) {
    return `/tools/generated/${mappedLiveSlug}`;
  }
  if (PREMIUM_SCHEMA_IDS.has(mappedLiveSlug)) {
    return getPremiumSchemaToolHref(mappedLiveSlug);
  }
  if (REVENUE_PAID_SLUGS.has(mappedLiveSlug)) {
    return resolvePremiumToolHref(mappedLiveSlug);
  }
  return `/tools/free/${mappedLiveSlug}`;
}

export function buildStrategicPremiumRoadmapCards(
  locale: Locale,
): readonly StrategicPremiumRoadmapCard[] {
  return STRATEGIC_PREMIUM_CALCULATORS.map((item) => ({
    id: item.id,
    slug: item.slug,
    phase: item.phase,
    score: item.score,
    status: item.status,
    categoryId: item.categoryId,
    title: item.title[locale],
    shortDescription: item.shortDescription[locale],
    href:
      item.status === "live" && item.mappedLiveSlug
        ? resolveMappedLiveToolHref(item.mappedLiveSlug)
        : null,
  }));
}

export function listStrategicPremiumRoadmapItems(): readonly StrategicPremiumCalculator[] {
  return STRATEGIC_PREMIUM_CALCULATORS;
}
