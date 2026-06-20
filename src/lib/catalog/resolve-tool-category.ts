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

const FORBIDDEN_CATEGORY_SLUGS = new Set(["uncategorized", "misc", "genel"]);

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
  "7-israf-muda-avcisi-parasal-karsilik-calculator": "lean-production",
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

export const FREE_TRAFFIC_CATEGORY_TO_GLOBAL: Readonly<
  Partial<Record<FreeTrafficCategory, GlobalToolCategorySlug>>
> = {
  "construction-measurement": "project-construction-management",
  "finance-business": "finance-sales-working-capital",
  "manufacturing-workshop": "cnc-additive-manufacturing",
  "energy-carbon": "sustainability-resource-esg",
  "logistics-travel": "procurement-supply-chain",
  "agriculture-food": "food-cold-chain-hygiene",
  "everyday-life": "health-fitness-daily-life",
  "math-statistics": "mathematics-statistics",
  conversion: "conversion-measurement",
  "health-body": "health-fitness-daily-life",
  "physics-science": "mathematics-statistics",
  "chemistry-science": "process-chemical",
  "engineering-science": "cnc-additive-manufacturing",
  "food-cooking": "food-cold-chain-hygiene",
  "date-time": "health-fitness-daily-life",
  "education-academic": "education-academic",
  "ecology-environment": "sustainability-resource-esg",
  "gaming-entertainment": "technology-ai-cloud-cyber",
  "hobbies-diy": "health-fitness-daily-life",
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
  // ── Industrial / Manufacturing ──────────────────────────────
  { categorySlug: "lean-production", keywords: ["smed", "kanban", "vsm", "kaizen", "andon", "oee", "takt", "heijunka", "poka", "muda", "yoke", "israf", "5s", "gemba", "six sigma", "value stream"] },
  { categorySlug: "quality-six-sigma", keywords: ["cpk", "ppk", "spc", "msa", "sigma", "aql", "fty", "rty", "taguchi", "fmea", "htea", "capability", "control chart", "defect", "paf", "quality cost", "calibration"] },
  { categorySlug: "process-chemical", keywords: ["reaktor", "pompa", "harman", "kutle", "ventil", "kimya", "proses", "chemical", "fluid", "reaction", "molar", "titration", "stoichiometry", "concentration", "ph", "acid", "base", "distillation", "chromatography", "activity coefficient", "electronegativity", "hess"] },
  { categorySlug: "cnc-additive-manufacturing", keywords: ["cnc", "3b", "3d", "takim", "tool", "filament", "baski", "machining", "tezgah", "lathe", "milling", "drilling", "grinding", "edm", "laser", "plasma", "waterjet", "spindle", "rpm", "feed", "insert", "carbide", "hss", "coating", "tool wear"] },
  { categorySlug: "metal-plastics-forming", keywords: ["sac", "dokum", "enjeksiyon", "pres", "bukum", "metal", "sheet", "forming", "scrap", "casting", "forging", "extrusion", "stamping", "rolling", "welding", "weld", "solder", "brazing", "annealing", "tempering", "hardness", "hrc", "hb", "hv", "penetration", "shrinkage", "distortion", "preheat"] },
  { categorySlug: "digital-factory-automation", keywords: ["iot", "cobot", "agv", "dijital", "otomasyon", "digital", "automation", "scada", "plc", "robot", "twin", "industry 4", "sensor", "actuator"] },
  { categorySlug: "maintenance-reliability", keywords: ["mtbf", "mttr", "bakim", "ariza", "maintenance", "reliability", "rca", "preventive", "spare part", "uptime", "availability", "oee", "failure"] },
  { categorySlug: "mechanical-hvac-energy-loss", keywords: ["hvac", "kompresor", "compressor", "pompa", "mechanical", "leak", "pressure", "pipe", "piping", "steam", "insulation", "heat loss", "boiler", "chiller", "duct", "ventilation", "cfm", "btu", "load calculation", "pump"] },

  // ── Construction / Project ──────────────────────────────────
  { categorySlug: "project-construction-management", keywords: ["evm", "cpm", "santiye", "insaat", "construction", "hakedis", "sozlesme", "concrete", "paint", "drywall", "roofing", "stucco", "gambrel", "scaffold", "formwork", "masonry", "brick", "foundation", "excavation", "structural", "rebar", "beam", "column", "slab", "footing"] },
  { categorySlug: "electrical-power-systems", keywords: ["elektrik", "panel", "power", "voltage", "current", "electrical", "kwh", "kw", "transformer", "generator", "motor", "grid", "substation", "power factor", "cable", "ampere", "ohm", "circuit breaker", "switchgear"] },

  // ── Supply Chain / HR / Finance ─────────────────────────────
  { categorySlug: "procurement-supply-chain", keywords: ["tedarik", "tco", "moq", "lojistik", "supply", "procurement", "route", "fuel", "transport", "eoq", "inventory", "warehouse", "stock", "reorder", "safety stock", "abc analysis", "customs", "incoterm", "import", "export", "demurrage"] },
  { categorySlug: "workforce-hr", keywords: ["vardiya", "turnover", "egitim", "mesai", "workforce", "hr", "employee", "labor", "labour", "shift", "overtime", "salary", "payroll", "absenteeism", "headcount", "competence"] },
  { categorySlug: "finance-sales-working-capital", keywords: ["finans", "clv", "cac", "marj", "margin", "finance", "profit", "price", "quote", "rent", "loan", "mortgage", "interest", "npv", "irr", "payback", "investment", "credit", "tax", "depreciation", "amortization", "roi", "dividend", "crypto", "bitcoin", "forex", "valuation", "startup", "runway", "equity", "etf", "ira", "annuity", "insurance", "budget", "cash flow", "breakeven", "cost benefit", "cost estimation", "cost of living", "savings", "bond", "roth", "sba", "rmd", "wire transfer", "debt payoff", "affordability", "net operating", "noi"] },

  // ── Sustainability / Food / Textile ─────────────────────────
  { categorySlug: "sustainability-resource-esg", keywords: ["karbon", "scope", "cbam", "esg", "surdur", "carbon", "emission", "energy", "recycle", "waste", "water", "green", "footprint", "climate", "co2", "greenhouse", "smog"] },
  { categorySlug: "food-cold-chain-hygiene", keywords: ["gida", "soguk", "hygiene", "food", "menu", "restaurant", "agriculture", "recipe", "baking", "cooking", "calorie", "nutrition", "shelf life", "haccp", "brew", "beer", "wine", "abv", "sourdough", "yogurt", "kombucha", "espresso", "pizza", "paleo", "sugar"] },
  { categorySlug: "textile-print-lab", keywords: ["tekstil", "baski", "print", "textile", "fabric", "sewing", "knitting", "weaving", "dye", "yarn", "garment", "apparel", "lab", "laboratory"] },
  { categorySlug: "packaging-local-business", keywords: ["paket", "local", "cleaning", "daily", "packaging", "retail", "box", "carton", "pallet", "barcode", "label", "paper", "page count", "printing"] },

  // ── Global Trade ────────────────────────────────────────────
  { categorySlug: "global-compliance-trade", keywords: ["compliance", "trade", "customs", "ihracat", "import", "regulation", "incoterm", "tariff", "vat", "transfer pricing", "ifrs", "aml"] },

  // ── Technology ──────────────────────────────────────────────
  { categorySlug: "technology-ai-cloud-cyber", keywords: ["cloud", "api", "ai", "siber", "cyber", "software", "algorithm", "database", "encryption", "hash", "password", "regex", "json", "unicode", "binary", "hex", "octal", "ascii", "base64", "token", "nft", "jwt", "oauth", "subnet", "ip", "dns", "vpn", "bandwidth", "latency", "server", "cpu", "gpu", "memory", "storage", "checksum", "tree", "markdown", "morse"] },

  // ── Mathematics & Statistics ────────────────────────────────
  { categorySlug: "mathematics-statistics", keywords: ["algebra", "calculus", "derivative", "integral", "matrix", "vector", "equation", "polynomial", "fraction", "decimal", "percent", "ratio", "proportion", "geometry", "trigonometry", "angle", "triangle", "circle", "logarithm", "exponential", "prime", "factorial", "modulo", "gcd", "lcm", "fibonacci", "permutation", "combination", "absolute", "complex", "quaternion", "radical", "roman", "stirling", "ncr", "hanoi", "disk", "partition", "predicate", "conic", "polar", "gradient", "divergence", "decomposition", "set theory", "statistics", "probability", "regression", "anova", "percentile", "correlation", "mean", "median", "mode", "variance", "standard deviation", "confidence", "zscore", "t test", "chi square", "normal distribution", "binomial", "poisson", "bayes", "dice", "odds", "dijkstra", "kendall", "dbscan", "clustering", "roc", "auc", "iqr", "coefficient", "midpoint", "average"] },

  // ── Health & Daily Life ─────────────────────────────────────
  { categorySlug: "health-fitness-daily-life", keywords: ["bmi", "bmr", "calorie", "body", "weight", "heart", "blood", "sleep", "pregnancy", "ovulation", "baby", "infant", "fasting", "breathing", "metabolic", "cholesterol", "fitness", "workout", "muscle", "vo2", "1rm", "running", "pace", "marathon", "cycling", "swimming", "hiking", "training", "diet", "nutrition", "mindfulness", "smoking", "teeth", "age", "date", "calendar", "birthday", "deadline", "moon", "grade", "gpa", "midpoint", "distance", "velocity", "acceleration", "force", "erectile", "estrogen", "testosterone", "kidney", "liver", "thyroid", "diabetes", "glucose", "cancer", "tumor", "ecog", "mrs", "whitening", "thermogenesis", "wim", "hof", "lose", "noom", "pcos", "bradford"] },

  // ── Conversion & Measurement ────────────────────────────────
  { categorySlug: "conversion-measurement", keywords: ["converter", "conversion", "convert", "unit", "metric", "imperial", "feet", "inches", "yards", "miles", "kilometer", "centimeter", "millimeter", "micrometer", "nanometer", "liter", "gallon", "ounce", "pound", "kilogram", "gram", "ton", "tonne", "celsius", "fahrenheit", "kelvin", "acres", "hectares", "psi", "bar", "atm", "pascal", "mph", "kmh", "knot", "radians", "degrees", "horsepower", "btu", "joule", "calorie", "watt", "ampere", "volt", "stone", "decades", "centuries", "kb", "mb", "gb", "pixel", "dpi", "paper size"] },

  // ── Automotive & Transport ──────────────────────────────────
  { categorySlug: "automotive-transport", keywords: ["car", "vehicle", "auto", "truck", "bus", "engine", "tire", "tyre", "brake", "fuel", "mpg", "odometer", "ev", "electric vehicle", "battery", "hybrid", "transmission", "chassis", "suspension", "fleet", "horsepower", "torque"] },

  // ── Maritime & Shipping ─────────────────────────────────────
  { categorySlug: "maritime-shipping", keywords: ["ship", "vessel", "boat", "maritime", "marine", "naval", "port", "harbor", "harbour", "cargo", "container", "draft", "displacement", "buoyancy", "anchor", "hull", "propeller", "nautical", "anchor", "mooring", "ballast", "trim", "stability", "scantling", "bunker", "demurrage"] },

  // ── Mining & Geology ────────────────────────────────────────
  { categorySlug: "mining-geology", keywords: ["mine", "mining", "ore", "mineral", "coal", "gold", "silver", "copper", "drill", "excavation", "geology", "geological", "seismic", "reservoir", "rock", "quarry", "blasting"] },

  // ── Furniture & Woodworking ─────────────────────────────────
  { categorySlug: "furniture-woodworking", keywords: ["furniture", "wood", "woodworking", "lumber", "timber", "carpentry", "cabinet", "veneer", "plywood", "hardwood", "softwood", "sawmill", "board foot", "millwork"] },

  // ── Cleaning & Facility ─────────────────────────────────────
  { categorySlug: "cleaning-facility", keywords: ["cleaning", "hygiene", "sanitize", "sanitation", "detergent", "disinfect", "janitor", "custodial", "dilution", "dosage"] },

  // ── Water & Wastewater ──────────────────────────────────────
  { categorySlug: "water-wastewater", keywords: ["water", "wastewater", "sewage", "treatment", "filtration", "chlorination", "pool", "aquarium", "pond", "ntu", "flow", "irrigation", "drainage"] },

  // ── Tourism & Hospitality ───────────────────────────────────
  { categorySlug: "tourism-hospitality", keywords: ["hotel", "tourism", "travel", "hospitality", "resort", "booking", "reservation", "flight", "vacation", "tourist", "occupancy", "revpar", "adr", "restaurant", "menu", "food cost", "catering"] },

  // ── Education & Academic ────────────────────────────────────
  { categorySlug: "education-academic", keywords: ["grade", "gpa", "exam", "test", "score", "college", "university", "scholarship", "tuition", "semester", "credit", "degree", "student", "classroom", "curriculum", "gpat", "mcat", "citation", "plagiarism", "transcript", "pathfinder"] },

  // ── Real Estate & Property ──────────────────────────────────
  { categorySlug: "real-estate-property", keywords: ["real estate", "property", "mortgage", "rent", "rental", "lease", "landlord", "tenant", "housing", "appraisal", "valuation", "down payment", "closing", "hoa", "cap rate", "flip", "refinance", "home", "affordability"] },

  // ── Aerospace & Aviation ────────────────────────────────────
  { categorySlug: "aerospace-aviation", keywords: ["aircraft", "airplane", "plane", "aviation", "aerospace", "jet", "turbine", "wing", "fuselage", "aerodynamic", "lift", "drag", "altitude", "runway", "pilot", "flight", "rocket", "orbital", "satellite", "spacecraft", "propulsion"] },

  // ── HSE & Risk ──────────────────────────────────────────────
  { categorySlug: "hse-ergonomics", keywords: ["isg", "ergonomi", "kaza", "gurultu", "hse", "safety", "occupational", "ppe", "exposure", "noise", "vibration", "hazard", "risk assessment", "ergonomics", "accident", "incident"] },
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

  if (input.industrySlug && INDUSTRY_SLUG_TO_GLOBAL[input.industrySlug]) {
    return INDUSTRY_SLUG_TO_GLOBAL[input.industrySlug]!;
  }

  if (input.industryCategory) {
    return INDUSTRY_CATEGORY_TO_GLOBAL[input.industryCategory];
  }

  if (input.freeTrafficCategory) {
    return (
      FREE_TRAFFIC_CATEGORY_TO_GLOBAL[input.freeTrafficCategory] ??
      "finance-sales-working-capital"
    );
  }

  if (input.premiumSchemaCategory && PREMIUM_SCHEMA_CATEGORY_TO_GLOBAL[input.premiumSchemaCategory]) {
    return PREMIUM_SCHEMA_CATEGORY_TO_GLOBAL[input.premiumSchemaCategory];
  }

  const keywordMatch = resolveByKeywords(input);
  if (keywordMatch) {
    return keywordMatch;
  }

  if (input.seedCategorySlug && !FORBIDDEN_CATEGORY_SLUGS.has(input.seedCategorySlug)) {
    return input.seedCategorySlug as GlobalToolCategorySlug;
  }

  // If nothing matched, try keyword matching one more time with the raw slug only
  // before falling back to "other".
  const lastResort = resolveByKeywords({ slug: input.slug });
  if (lastResort) {
    return lastResort;
  }

  return "other";
}
