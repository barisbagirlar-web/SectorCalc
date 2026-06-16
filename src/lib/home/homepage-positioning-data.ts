import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";
import { resolvePremiumToolHref } from "@/lib/tools/tool-links";

export const HOMEPAGE_HERO_PANEL_IDS = [
  "production",
  "industrial",
  "technical",
  "construction",
  "logistics",
  "energy",
  "finance",
  "scrapMargin",
] as const;

export const HOMEPAGE_COVERAGE_IDS = [
  "production",
  "industrial",
  "technical",
  "construction",
  "logistics",
  "energy",
  "finance",
  "foodRetail",
] as const;

export type HomepageCoverageId = (typeof HOMEPAGE_COVERAGE_IDS)[number];

export const HOMEPAGE_LOSS_IDS = ["monetary", "material", "time", "energy"] as const;

export type HomepageLossId = (typeof HOMEPAGE_LOSS_IDS)[number];

export const HOMEPAGE_AUDIENCE_IDS = [
  "production",
  "construction",
  "industrial",
  "logistics",
  "engineering",
  "finance",
] as const;

export type HomepageAudienceId = (typeof HOMEPAGE_AUDIENCE_IDS)[number];

export const HOMEPAGE_EXCEL_IDS = ["formula", "sector", "decision"] as const;

export type HomepageExcelId = (typeof HOMEPAGE_EXCEL_IDS)[number];

export type HomepagePopularToolDef = {
  readonly categoryKey: string;
  readonly groupId: string;
  readonly tool: HomepageCriticalToolDef;
};

export const HOMEPAGE_POPULAR_CATEGORY_GROUP_ID: Readonly<Record<string, string>> = {
  production: "productionManufacturing",
  workshop: "workshopQuote",
  engineering: "technicalEngineering",
  construction: "constructionField",
  energy: "energyCarbon",
};

export const HOMEPAGE_POPULAR_TOOLS: readonly HomepagePopularToolDef[] = [
  {
    categoryKey: "production",
    groupId: "productionManufacturing",
    tool: { id: "shopRate", slug: "shop-rate-hourly-cost-calculator", tier: "premium-schema" },
  },
  {
    categoryKey: "production",
    groupId: "productionManufacturing",
    tool: { id: "oee", slug: "oee-equipment-effectiveness-calculator", tier: "premium-schema" },
  },
  {
    categoryKey: "workshop",
    groupId: "workshopQuote",
    tool: { id: "quoteMargin", slug: "quote-price-profit-margin-calculator", tier: "premium-schema" },
  },
  {
    categoryKey: "engineering",
    groupId: "technicalEngineering",
    tool: { id: "boltTorque", slug: "bolt-tightening-torque-calculator", tier: "premium-schema" },
  },
  {
    categoryKey: "construction",
    groupId: "constructionField",
    tool: { id: "concreteVolume", slug: "concrete-volume-calculator", tier: "free" },
  },
  {
    categoryKey: "energy",
    groupId: "energyCarbon",
    tool: { id: "compressorLeak", slug: "compressor-leak-cost-calculator", tier: "premium-schema" },
  },
];

export type HomepageCriticalToolTier = "free" | "premium-schema" | "premium";

export type HomepageCriticalToolDef = {
  readonly id: string;
  readonly slug: string;
  readonly tier: HomepageCriticalToolTier;
};

export type HomepageCriticalGroupDef = {
  readonly id: string;
  readonly tools: readonly HomepageCriticalToolDef[];
};

export const HOMEPAGE_CRITICAL_GROUPS: readonly HomepageCriticalGroupDef[] = [
  {
    id: "productionManufacturing",
    tools: [
      { id: "shopRate", slug: "shop-rate-hourly-cost-calculator", tier: "premium-schema" },
      { id: "oee", slug: "oee-equipment-effectiveness-calculator", tier: "premium-schema" },
      { id: "cuttingSpeed", slug: "cutting-speed-calculator", tier: "free" },
      { id: "sheetScrap", slug: "sheet-metal-scrap-risk", tier: "premium-schema" },
    ],
  },
  {
    id: "workshopQuote",
    tools: [
      { id: "quoteMargin", slug: "quote-price-profit-margin-calculator", tier: "premium-schema" },
      { id: "breakEven", slug: "break-even-calculator", tier: "free" },
      { id: "repairQuote", slug: "auto-repair-parts-labor-quote-calculator", tier: "premium-schema" },
      { id: "productMargin", slug: "profit-margin-calculator", tier: "free" },
    ],
  },
  {
    id: "technicalEngineering",
    tools: [
      { id: "boltTorque", slug: "bolt-tightening-torque-calculator", tier: "premium-schema" },
      { id: "weldedConnection", slug: "welded-bolted-connection-calculator", tier: "premium-schema" },
      { id: "toleranceStack", slug: "tolerance-stack-up-calculator", tier: "premium-schema" },
      { id: "cylinderForce", slug: "hydraulic-pneumatic-cylinder-force-calculator", tier: "premium-schema" },
    ],
  },
  {
    id: "constructionField",
    tools: [
      { id: "concreteVolume", slug: "concrete-volume-calculator", tier: "free" },
      { id: "squareMeter", slug: "square-meter-calculator", tier: "free" },
      { id: "paintCoverage", slug: "paint-coverage-calculator", tier: "free" },
      { id: "roofingArea", slug: "roofing-area-calculator", tier: "free" },
    ],
  },
  {
    id: "energyCarbon",
    tools: [
      { id: "compressorLeak", slug: "compressor-leak-cost-calculator", tier: "premium-schema" },
      { id: "kwhCost", slug: "kwh-cost-calculator", tier: "free" },
      { id: "ledSavings", slug: "energy-savings-package-calculator", tier: "premium-schema" },
      { id: "cbamCarbon", slug: "cbam-unit-product-carbon-footprint-calculator", tier: "premium-schema" },
    ],
  },
  {
    id: "financeHr",
    tools: [
      { id: "vat", slug: "vat-calculator", tier: "free" },
      { id: "loanPayment", slug: "loan-payment-calculator", tier: "free" },
      { id: "employeeCost", slug: "employee-total-cost-calculator", tier: "premium-schema" },
      { id: "inventoryEoq", slug: "inventory-carrying-cost-eoq-calculator", tier: "premium-schema" },
    ],
  },
];

const FREE_SLUGS = new Set(FREE_TRAFFIC_TOOLS.map((tool) => tool.slug));

export function resolveHomepageCriticalToolHref(tool: HomepageCriticalToolDef): string | null {
  if (!isHomepageCriticalToolLive(tool)) {
    return null;
  }

  switch (tool.tier) {
    case "free":
      return `/tools/free/${tool.slug}`;
    case "premium-schema":
      return `/tools/premium-schema/${tool.slug}`;
    case "premium":
      return resolvePremiumToolHref(tool.slug);
    default:
      return null;
  }
}

export function isHomepageCriticalToolLive(tool: HomepageCriticalToolDef): boolean {
  switch (tool.tier) {
    case "free":
      return FREE_SLUGS.has(tool.slug);
    case "premium-schema":
      return getPremiumCalculatorSchema(tool.slug) !== null;
    case "premium":
      return getRevenueToolByFreeSlug(tool.slug) !== null;
    default:
      return false;
  }
}
