import { siteUrl } from "@/config/site";
import { buildLocalizedUrl } from "@/lib/infrastructure/seo/sitemap-manifest";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-routing";

export type SeoEntityType =
  | "Organization"
  | "WebSite"
  | "SoftwareApplication"
  | "WebApplication"
  | "Calculator"
  | "Industry"
  | "Service"
  | "Product"
  | "FAQ"
  | "Article"
  | "BreadcrumbList";

export type SeoAuthorityEntity = {
  readonly id: string;
  readonly type: SeoEntityType;
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly sameAs?: readonly string[];
  readonly relatedEntityIds?: readonly string[];
  readonly keywords: readonly string[];
};

function entityUrl(locale: SupportedLocale, path: string): string {
  return buildLocalizedUrl(path, locale, siteUrl);
}

export const SECTORCALC_CORE_ENTITIES: readonly SeoAuthorityEntity[] = [
  {
    id: "sectorcalc",
    type: "Organization",
    name: "SectorCalc",
    description:
      "Sector-specific calculators, hidden-loss diagnostics and export-ready decision reports for operators and teams.",
    url: entityUrl("en", "/"),
    keywords: ["sector calculators", "hidden loss", "decision reports", "OEE", "margin"],
    relatedEntityIds: [
      "free-calculators",
      "premium-decision-reports",
      "hidden-loss-diagnostics",
    ],
  },
  {
    id: "free-calculators",
    type: "WebApplication",
    name: "Free Calculators",
    description: "100 browser-side sector calculators for quick estimates with transparent assumptions.",
    url: entityUrl("en", "/free-tools"),
    keywords: ["free calculators", "cost estimate", "unit conversion", "OEE"],
    relatedEntityIds: ["sectorcalc", "premium-decision-reports"],
  },
  {
    id: "premium-decision-reports",
    type: "Service",
    name: "Premium Decision Reports",
    description:
      "Premium analyzers with hidden drivers, threshold checks, suggested actions and export-ready output.",
    url: entityUrl("en", "/pro-tools"),
    keywords: ["decision report", "premium calculator", "hidden drivers", "PDF export"],
    relatedEntityIds: ["sectorcalc", "free-calculators", "hidden-loss-diagnostics"],
  },
  {
    id: "hidden-loss-diagnostics",
    type: "Service",
    name: "Hidden Loss Diagnostics",
    description:
      "Diagnostic layer that surfaces margin leaks, threshold pressure and operational exposure before cash damage.",
    url: entityUrl("en", "/pro-tools"),
    keywords: ["hidden loss", "margin leak", "threshold check", "diagnostic"],
    relatedEntityIds: ["premium-decision-reports", "sectorcalc"],
  },
  {
    id: "manufacturing-calculators",
    type: "Calculator",
    name: "Manufacturing Calculators",
    description: "OEE, scrap, tool wear and shop-floor calculators for manufacturing teams.",
    url: entityUrl("en", "/seo/manufacturing-cost-calculators"),
    keywords: ["manufacturing", "OEE", "scrap rate", "CNC"],
    relatedEntityIds: ["oee-calculator", "cnc-oee-loss-analyzer", "scrap-rate-calculator"],
  },
  {
    id: "construction-calculators",
    type: "Calculator",
    name: "Construction Calculators",
    description: "Concrete, delay, labor and project margin calculators for building trades.",
    url: entityUrl("en", "/seo/construction-cost-calculators"),
    keywords: ["construction", "concrete volume", "project margin", "delay"],
    relatedEntityIds: ["sectorcalc"],
  },
  {
    id: "logistics-calculators",
    type: "Calculator",
    name: "Logistics Calculators",
    description: "Route cost, fuel drift and freight margin calculators for transport operators.",
    url: entityUrl("en", "/seo/logistics-route-calculators"),
    keywords: ["logistics", "route cost", "deadhead", "fuel"],
    relatedEntityIds: ["route-cost-calculator", "cnc-oee-loss-analyzer"],
  },
  {
    id: "energy-carbon-calculators",
    type: "Calculator",
    name: "Energy & Carbon Calculators",
    description: "Peak load, utility cost and carbon exposure calculators for energy decisions.",
    url: entityUrl("en", "/seo/energy-carbon-calculators"),
    keywords: ["energy", "carbon", "peak load", "kWh"],
    relatedEntityIds: ["energy-peak-cost-analyzer", "carbon-compliance-risk-analyzer"],
  },
  {
    id: "agriculture-calculators",
    type: "Calculator",
    name: "Agriculture Calculators",
    description: "Irrigation, yield and feed efficiency calculators for farm operations.",
    url: entityUrl("en", "/seo/agriculture-calculators"),
    keywords: ["agriculture", "irrigation", "yield", "feed efficiency"],
    relatedEntityIds: ["sectorcalc"],
  },
  {
    id: "finance-business-calculators",
    type: "Calculator",
    name: "Finance & Business Calculators",
    description: "Loan, margin, break-even and business ratio calculators for owners and operators.",
    url: entityUrl("en", "/seo/finance-business-calculators"),
    keywords: ["finance", "loan", "break-even", "margin"],
    relatedEntityIds: ["sectorcalc", "free-calculators"],
  },
  {
    id: "unit-conversion-calculators",
    type: "Calculator",
    name: "Unit Conversion Calculators",
    description: "Area, temperature, volume and measurement conversion calculators.",
    url: entityUrl("en", "/seo/unit-conversion-calculators"),
    keywords: ["unit conversion", "area converter", "temperature", "measurement"],
    relatedEntityIds: ["free-calculators"],
  },
  {
    id: "oee-calculator",
    type: "Calculator",
    name: "OEE Calculator",
    description: "Free overall equipment effectiveness estimate from availability, performance and quality.",
    url: entityUrl("en", "/tools/free/oee-calculator"),
    keywords: ["OEE", "availability", "performance", "quality"],
    relatedEntityIds: ["cnc-oee-loss-analyzer", "manufacturing-calculators"],
  },
  {
    id: "scrap-rate-calculator",
    type: "Calculator",
    name: "Scrap Rate Calculator",
    description: "Free scrap and yield exposure estimate for quoted jobs and production runs.",
    url: entityUrl("en", "/tools/free/scrap-rate-calculator"),
    keywords: ["scrap rate", "yield", "material waste"],
    relatedEntityIds: ["manufacturing-calculators", "premium-decision-reports"],
  },
  {
    id: "route-cost-calculator",
    type: "Calculator",
    name: "Route Cost Calculator",
    description: "Free route and trip cost estimate including fuel and time assumptions.",
    url: entityUrl("en", "/tools/free/route-cost-calculator"),
    keywords: ["route cost", "fuel", "freight", "deadhead"],
    relatedEntityIds: ["logistics-calculators", "premium-decision-reports"],
  },
  {
    id: "energy-peak-cost-analyzer",
    type: "SoftwareApplication",
    name: "Energy Peak Cost Calculator",
    description: "Premium calculator for peak-hour load, blended kWh and threshold pressure.",
    url: entityUrl("en", "/tools/premium-schema/energy-peak-cost"),
    keywords: ["energy peak", "kWh", "utility cost"],
    relatedEntityIds: ["energy-carbon-calculators", "carbon-compliance-risk-analyzer"],
  },
  {
    id: "cnc-oee-loss-analyzer",
    type: "SoftwareApplication",
    name: "CNC OEE Loss Calculator",
    description: "Premium decision report for lost machine hours, OEE drivers and export-ready output.",
    url: entityUrl("en", "/tools/premium-schema/cnc-oee-loss"),
    keywords: ["CNC OEE", "machine hours", "capacity loss"],
    relatedEntityIds: ["oee-calculator", "manufacturing-calculators", "premium-decision-reports"],
  },
  {
    id: "carbon-compliance-risk-analyzer",
    type: "SoftwareApplication",
    name: "Carbon Compliance Risk Calculator",
    description: "Premium calculator for carbon exposure, compliance cost pressure and threshold checks.",
    url: entityUrl("en", "/tools/premium-schema/carbon-footprint-compliance-risk"),
    keywords: ["carbon footprint", "compliance", "emissions exposure"],
    relatedEntityIds: ["energy-carbon-calculators", "energy-peak-cost-analyzer"],
  },
] as const;

const ENTITY_MAP = new Map<string, SeoAuthorityEntity>(
  SECTORCALC_CORE_ENTITIES.map((entity) => [entity.id, entity])
);

export function getEntityById(id: string): SeoAuthorityEntity | null {
  return ENTITY_MAP.get(id) ?? null;
}

export function getRelatedEntities(id: string): readonly SeoAuthorityEntity[] {
  const entity = getEntityById(id);
  if (!entity?.relatedEntityIds) {
    return [];
  }
  return entity.relatedEntityIds
    .map((relatedId) => getEntityById(relatedId))
    .filter((item): item is SeoAuthorityEntity => item !== null);
}

export function listSeoAuthorityEntityIds(): readonly string[] {
  return SECTORCALC_CORE_ENTITIES.map((entity) => entity.id);
}
