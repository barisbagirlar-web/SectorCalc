export type GlobalToolCategorySlug =
  | "lean-production"
  | "quality-six-sigma"
  | "process-chemical"
  | "cnc-additive-manufacturing"
  | "metal-plastics-forming"
  | "project-construction-management"
  | "digital-factory-automation"
  | "maintenance-reliability"
  | "hse-ergonomics"
  | "procurement-supply-chain"
  | "workforce-hr"
  | "finance-sales-working-capital"
  | "sustainability-resource-esg"
  | "food-cold-chain-hygiene"
  | "textile-print-lab"
  | "electrical-power-systems"
  | "mechanical-hvac-energy-loss"
  | "packaging-local-business"
  | "global-compliance-trade"
  | "technology-ai-cloud-cyber";

export type GlobalToolCategory = {
  readonly slug: GlobalToolCategorySlug;
  readonly enTitle: string;
  readonly iconKey: string;
  readonly summary: string;
  readonly premiumSeedCount: number;
};

const GLOBAL_CATEGORIES: readonly GlobalToolCategory[] = [
  {
    slug: "lean-production",
    enTitle: "Lean Production & Line Efficiency",
    iconKey: "flow",
    summary: "SMED, Kanban, VSM, Kaizen, Andon and line balancing tools.",
    premiumSeedCount: 21
  },
  {
    slug: "quality-six-sigma",
    enTitle: "Quality, SPC & Six Sigma",
    iconKey: "quality",
    summary: "Cpk/Ppk, MSA, FMEA, SPC, Taguchi, RTY and quality project selection.",
    premiumSeedCount: 8
  },
  {
    slug: "process-chemical",
    enTitle: "Process, Chemical & Fluids",
    iconKey: "flask",
    summary: "Batch yield, mass balance, pump loss, blending and safety valve.",
    premiumSeedCount: 6
  },
  {
    slug: "cnc-additive-manufacturing",
    enTitle: "CNC, 3D Printing & Advanced Manufacturing",
    iconKey: "cnc",
    summary: "CNC time, tool life, 3D printing, chip load, fixture and machining strategies.",
    premiumSeedCount: 12
  },
  {
    slug: "metal-plastics-forming",
    enTitle: "Sheet Metal, Casting, Plastics & Forming",
    iconKey: "metal",
    summary: "Nesting rate, casting yield, injection cycle, press force and bend springback.",
    premiumSeedCount: 6
  },
  {
    slug: "project-construction-management",
    enTitle: "Project, Site & Construction Management",
    iconKey: "build",
    summary: "EVM, CPM, resource leveling, contract risk, progress payment, mobilization and site decisions.",
    premiumSeedCount: 10
  },
  {
    slug: "digital-factory-automation",
    enTitle: "Digital Factory & Automation",
    iconKey: "automation",
    summary: "IoT, digital twin, cobot, AGV, energy monitoring and paperless production ROI tools.",
    premiumSeedCount: 6
  },
  {
    slug: "maintenance-reliability",
    enTitle: "Maintenance & Reliability",
    iconKey: "maintenance",
    summary: "MTBF/MTTR, spare parts, preventive maintenance, RCA and criticality matrix.",
    premiumSeedCount: 5
  },
  {
    slug: "hse-ergonomics",
    enTitle: "HSE, Ergonomics & Risk Cost",
    iconKey: "shield",
    summary: "Accident cost, HSE investment, noise/vibration and ergonomic losses.",
    premiumSeedCount: 4
  },
  {
    slug: "procurement-supply-chain",
    enTitle: "Procurement, Supply Chain & Logistics",
    iconKey: "truck",
    summary: "Supplier TCO, transport mode, MOQ, import/local risk, warehousing and reverse logistics.",
    premiumSeedCount: 9
  },
  {
    slug: "workforce-hr",
    enTitle: "Workforce, Shift & HR Cost",
    iconKey: "people",
    summary: "Turnover, shift, bonus, training ROI and overtime/hire decision.",
    premiumSeedCount: 5
  },
  {
    slug: "finance-sales-working-capital",
    enTitle: "Finance, Sales & Working Capital",
    iconKey: "finance",
    summary: "CLV/CAC, churn, channel profitability, warranty, cash cycle, hedging, leasing, maturity and price elasticity.",
    premiumSeedCount: 9
  },
  {
    slug: "sustainability-resource-esg",
    enTitle: "Sustainability, Resources & ESG",
    iconKey: "leaf",
    summary: "Water, waste, ISO 50001, circular economy, solar/wind, CBAM and Scope emissions.",
    premiumSeedCount: 7
  },
  {
    slug: "food-cold-chain-hygiene",
    enTitle: "Food, Cold Chain & Hygiene",
    iconKey: "food",
    summary: "Shelf life, recipe cost, HACCP, cold chain, restaurant plate cost and hygiene chemical.",
    premiumSeedCount: 6
  },
  {
    slug: "textile-print-lab",
    enTitle: "Textile, Printing & Laboratory",
    iconKey: "lab",
    summary: "Fabric spreading, sewing line, dyeing/finishing, print waste and lab analysis cost.",
    premiumSeedCount: 5
  },
  {
    slug: "electrical-power-systems",
    enTitle: "Electrical, Panel & Power Systems",
    iconKey: "electric",
    summary: "Panel heat load, cable cross-section, compensation, generator and UPS capacity selection.",
    premiumSeedCount: 4
  },
  {
    slug: "mechanical-hvac-energy-loss",
    enTitle: "Mechanical, HVAC & Energy Loss",
    iconKey: "energy",
    summary: "Welding cost, solder, adhesive, heat load, duct, insulation, steam, heat exchanger, vacuum and hydraulic systems.",
    premiumSeedCount: 10
  },
  {
    slug: "packaging-local-business",
    enTitle: "Packaging & Local Business Tools",
    iconKey: "box",
    summary: "Packaging volume, material substitution, pallet configuration and auto service quote consistency.",
    premiumSeedCount: 4
  },
  {
    slug: "global-compliance-trade",
    enTitle: "Global Compliance, Trade & Tax",
    iconKey: "globe",
    summary: "Data/privacy, IFRS/SOX, AML/KYC, supply chain risk, transfer pricing, FTA and country risk premium.",
    premiumSeedCount: 7
  },
  {
    slug: "technology-ai-cloud-cyber",
    enTitle: "Technology, AI, Cloud & Cyber Risk",
    iconKey: "chip",
    summary: "Cloud cost, SaaS civil risk, AI token, automation ROI, EU AI Act, EOR, localization and cyber security.",
    premiumSeedCount: 8
  }
];

const FORBIDDEN_CATEGORY_SLUGS = new Set(["uncategorized", "misc", "other", "genel"]);

export function listGlobalCategorySlugs(): readonly GlobalToolCategorySlug[] {
  return GLOBAL_CATEGORIES.map((category) => category.slug);
}

export function getGlobalCategoryBySlug(slug: string): GlobalToolCategory | undefined {
  if (FORBIDDEN_CATEGORY_SLUGS.has(slug)) {
    return undefined;
  }
  return GLOBAL_CATEGORIES.find((category) => category.slug === slug);
}

export function listGlobalCategories(): readonly GlobalToolCategory[] {
  return GLOBAL_CATEGORIES;
}

export function resolveGlobalCategoryTitle(
  category: Pick<GlobalToolCategory, "enTitle">,
  _locale?: string,
): string {
  return category.enTitle;
}

export function assertValidGlobalCategorySlug(slug: string): GlobalToolCategorySlug {
  if (FORBIDDEN_CATEGORY_SLUGS.has(slug)) {
    throw new Error(`Forbidden category slug: ${slug}`);
  }
  const category = getGlobalCategoryBySlug(slug);
  if (!category) {
    throw new Error(`Unknown global category slug: ${slug}`);
  }
  return category.slug;
}
