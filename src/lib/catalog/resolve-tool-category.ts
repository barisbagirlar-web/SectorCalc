import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import type { FreeTrafficCategory } from "@/lib/tools/free-traffic-catalog";
import type { IndustryCategory, IndustrySlug } from "@/lib/tools/industry-registry";

export type ToolCategoryResolutionInput = {
  readonly slug: string;
  readonly title?: string;
  readonly description?: string;
  readonly tier?: "free" | "premium" | "premium-schema";
  readonly source?:
    | "existing-free"
    | "existing-premium"
    | "existing-premium-schema"
    | "user-premium-152";
  readonly seedCategorySlug?: string;
  readonly industryCategory?: IndustryCategory;
  readonly industrySlug?: IndustrySlug;
  readonly freeTrafficCategory?: FreeTrafficCategory;
  readonly premiumSchemaCategory?: string;
};

const FORBIDDEN_CATEGORY_SLUGS = new Set(["uncategorized", "misc", "other", "genel"]);

export const MANUAL_CATEGORY_OVERRIDES: Readonly<Record<string, GlobalToolCategorySlug>> = {
  "cnc-oee-loss": "cnc-additive-manufacturing",
  "cnc-tool-wear-cost": "cnc-additive-manufacturing",
  "sheet-metal-scrap-risk": "metal-plastics-forming",
  "machine-time-calculator": "cnc-additive-manufacturing",
  "compressor-leak-cost-calculator": "mechanical-hvac-energy-loss",
  "energy-compressor-leak-cost": "mechanical-hvac-energy-loss",
  "concrete-volume-calculator": "project-construction-management",
  "paint-coverage-calculator": "project-construction-management",
  "rent-vs-buy-calculator": "finance-sales-working-capital",
  "quote-price-profit-margin-calculator": "finance-sales-working-capital",
  "value-stream-map-vsm-calculator": "lean-production",
  "seven-wastes-muda-monetary-impact-calculator": "lean-production",
  "quality-cost-paf-calculator": "quality-six-sigma",
  "cbam-unit-product-carbon-footprint-calculator": "sustainability-resource-esg",
  "carbon-footprint-compliance-risk": "sustainability-resource-esg",
};

const INDUSTRY_CATEGORY_TO_GLOBAL: Readonly<Record<IndustryCategory, GlobalToolCategorySlug>> = {
  "heavy-industry": "cnc-additive-manufacturing",
  "building-trades": "project-construction-management",
  "field-services": "mechanical-hvac-energy-loss",
  "food-retail": "food-cold-chain-hygiene",
  "custom-manufacturing": "cnc-additive-manufacturing",
  "logistics-transport": "procurement-supply-chain",
  "agriculture-livestock": "food-cold-chain-hygiene",
  "energy-environment": "sustainability-resource-esg",
  "daily-life": "packaging-local-business",
};

const INDUSTRY_SLUG_TO_GLOBAL: Partial<Record<IndustrySlug, GlobalToolCategorySlug>> = {
  "cnc-manufacturing": "cnc-additive-manufacturing",
  "3d-printing-service": "cnc-additive-manufacturing",
  "sheet-metal": "metal-plastics-forming",
  construction: "project-construction-management",
  roofing: "project-construction-management",
  "carpentry-millwork": "project-construction-management",
  painting: "project-construction-management",
  plumbing: "mechanical-hvac-energy-loss",
  hvac: "mechanical-hvac-energy-loss",
  "electrical-contracting": "electrical-power-systems",
  "welding-fabrication": "metal-plastics-forming",
  "auto-repair-shop": "maintenance-reliability",
  "printing-signage": "textile-print-lab",
  restaurant: "food-cold-chain-hygiene",
  cleaning: "packaging-local-business",
  ecommerce: "finance-sales-working-capital",
  "logistics-transport": "procurement-supply-chain",
  "agriculture-crops": "food-cold-chain-hygiene",
  "agriculture-irrigation": "food-cold-chain-hygiene",
  "agriculture-feed": "food-cold-chain-hygiene",
  "agriculture-dairy": "food-cold-chain-hygiene",
  "energy-consumption": "mechanical-hvac-energy-loss",
  "energy-carbon": "sustainability-resource-esg",
  "daily-renovation": "packaging-local-business",
  "daily-fuel": "procurement-supply-chain",
  "daily-meals": "food-cold-chain-hygiene",
  "landscaping-lawn-care": "packaging-local-business",
};

const FREE_TRAFFIC_CATEGORY_TO_GLOBAL: Readonly<
  Record<FreeTrafficCategory, GlobalToolCategorySlug>
> = {
  "construction-measurement": "project-construction-management",
  "finance-business": "finance-sales-working-capital",
  "manufacturing-workshop": "cnc-additive-manufacturing",
  "energy-carbon": "sustainability-resource-esg",
  "logistics-travel": "procurement-supply-chain",
  "agriculture-food": "food-cold-chain-hygiene",
  "everyday-life": "packaging-local-business",
  "math-statistics": "technology-ai-cloud-cyber",
  conversion: "technology-ai-cloud-cyber",
  "health-body": "hse-ergonomics",
};

const PREMIUM_SCHEMA_CATEGORY_TO_GLOBAL: Readonly<Record<string, GlobalToolCategorySlug>> = {
  oee: "lean-production",
  scrap: "quality-six-sigma",
  cost: "finance-sales-working-capital",
  route: "procurement-supply-chain",
  energy: "mechanical-hvac-energy-loss",
  carbon: "sustainability-resource-esg",
  calibration: "quality-six-sigma",
  measurement: "cnc-additive-manufacturing",
  time: "project-construction-management",
  benchmark: "finance-sales-working-capital",
};

const KEYWORD_CATEGORY_RULES: ReadonlyArray<{
  readonly categorySlug: GlobalToolCategorySlug;
  readonly keywords: readonly string[];
}> = [
  { categorySlug: "lean-production", keywords: ["smed", "kanban", "vsm", "kaizen", "andon", "oee", "takt", "heijunka", "poka", "muda"] },
  { categorySlug: "quality-six-sigma", keywords: ["cpk", "ppk", "spc", "msa", "sigma", "aql", "fty", "rty", "taguchi", "fmea", "htea"] },
  { categorySlug: "process-chemical", keywords: ["reaktor", "pompa", "harman", "kutle", "ventil", "kimya", "proses", "chemical", "fluid"] },
  { categorySlug: "cnc-additive-manufacturing", keywords: ["cnc", "3b", "3d", "takim", "tool", "filament", "baski", "machining", "tezgah"] },
  { categorySlug: "metal-plastics-forming", keywords: ["sac", "dokum", "enjeksiyon", "pres", "bukum", "metal", "sheet", "forming", "scrap"] },
  { categorySlug: "project-construction-management", keywords: ["evm", "cpm", "santiye", "insaat", "construction", "hakedis", "sozlesme", "concrete", "paint"] },
  { categorySlug: "digital-factory-automation", keywords: ["iot", "cobot", "agv", "dijital", "otomasyon", "digital", "automation"] },
  { categorySlug: "maintenance-reliability", keywords: ["mtbf", "mttr", "bakim", "ariza", "maintenance", "reliability", "rca"] },
  { categorySlug: "hse-ergonomics", keywords: ["isg", "ergonomi", "kaza", "gurultu", "hse", "safety", "health"] },
  { categorySlug: "procurement-supply-chain", keywords: ["tedarik", "tco", "moq", "lojistik", "supply", "procurement", "route", "fuel", "transport"] },
  { categorySlug: "workforce-hr", keywords: ["vardiya", "turnover", "egitim", "mesai", "workforce", "hr", "employee", "labor"] },
  { categorySlug: "finance-sales-working-capital", keywords: ["finans", "clv", "cac", "marj", "margin", "finance", "profit", "price", "quote", "rent", "loan"] },
  { categorySlug: "sustainability-resource-esg", keywords: ["karbon", "scope", "cbam", "esg", "surdur", "carbon", "emission", "energy"] },
  { categorySlug: "food-cold-chain-hygiene", keywords: ["gida", "soguk", "hygiene", "food", "menu", "restaurant", "agriculture"] },
  { categorySlug: "textile-print-lab", keywords: ["tekstil", "baski", "print", "textile", "fabric"] },
  { categorySlug: "electrical-power-systems", keywords: ["elektrik", "panel", "power", "voltage", "current", "electrical"] },
  { categorySlug: "mechanical-hvac-energy-loss", keywords: ["hvac", "kompresor", "compressor", "pompa", "mechanical", "leak", "pressure"] },
  { categorySlug: "packaging-local-business", keywords: ["paket", "local", "cleaning", "daily", "packaging", "retail"] },
  { categorySlug: "global-compliance-trade", keywords: ["compliance", "trade", "customs", "ihracat", "import", "regulation"] },
  { categorySlug: "technology-ai-cloud-cyber", keywords: ["cloud", "api", "ai", "siber", "cyber", "software", "math", "statistics", "conversion"] },
];

function normalizeMatchText(input: ToolCategoryResolutionInput): string {
  return [input.slug, input.title ?? "", input.description ?? ""]
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
}

function resolveByKeywords(input: ToolCategoryResolutionInput): GlobalToolCategorySlug | undefined {
  const haystack = normalizeMatchText(input);
  for (const rule of KEYWORD_CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      return rule.categorySlug;
    }
  }
  return undefined;
}

export function resolveToolCategory(input: ToolCategoryResolutionInput): GlobalToolCategorySlug {
  const manual = MANUAL_CATEGORY_OVERRIDES[input.slug];
  if (manual) {
    return manual;
  }

  if (input.source === "user-premium-152" && input.seedCategorySlug) {
    return input.seedCategorySlug as GlobalToolCategorySlug;
  }

  const keywordMatch = resolveByKeywords(input);
  if (keywordMatch) {
    return keywordMatch;
  }

  if (input.industrySlug && INDUSTRY_SLUG_TO_GLOBAL[input.industrySlug]) {
    return INDUSTRY_SLUG_TO_GLOBAL[input.industrySlug]!;
  }

  if (input.industryCategory) {
    return INDUSTRY_CATEGORY_TO_GLOBAL[input.industryCategory];
  }

  if (input.freeTrafficCategory) {
    return FREE_TRAFFIC_CATEGORY_TO_GLOBAL[input.freeTrafficCategory];
  }

  if (input.premiumSchemaCategory && PREMIUM_SCHEMA_CATEGORY_TO_GLOBAL[input.premiumSchemaCategory]) {
    return PREMIUM_SCHEMA_CATEGORY_TO_GLOBAL[input.premiumSchemaCategory];
  }

  if (input.seedCategorySlug && !FORBIDDEN_CATEGORY_SLUGS.has(input.seedCategorySlug)) {
    return input.seedCategorySlug as GlobalToolCategorySlug;
  }

  // Fallback instead of throwing
  return 'lean-production';
}
