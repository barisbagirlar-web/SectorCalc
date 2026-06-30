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
  // ── CNC / Manufacturing ─────────────────────────────────
  "cnc-oee-loss": "cnc-additive-manufacturing",
  "cnc-tool-wear-cost": "cnc-additive-manufacturing",
  "machine-time-calculator": "cnc-additive-manufacturing",

  // ── Metal & Plastics ────────────────────────────────────
  "sheet-metal-scrap-risk": "metal-plastics-forming",

  // ── Mechanical / HVAC ───────────────────────────────────
  "compressor-leak-cost-calculator": "mechanical-hvac-energy-loss",
  "energy-compressor-leak-cost": "mechanical-hvac-energy-loss",
  "clearance-fit": "mechanical-hvac-energy-loss",
  "interference-fit": "mechanical-hvac-energy-loss",
  "transition-fit": "mechanical-hvac-energy-loss",
  "extension-spring": "mechanical-hvac-energy-loss",
  "torsion-spring": "mechanical-hvac-energy-loss",
  "von-mises-stress": "mechanical-hvac-energy-loss",
  "convergent-divergent-nozzle": "mechanical-hvac-energy-loss",
  "wind-load": "mechanical-hvac-energy-loss",
  "nozzle-calculator": "mechanical-hvac-energy-loss",
  "flange-calculator": "mechanical-hvac-energy-loss",
  "rigging-calculator": "mechanical-hvac-energy-loss",

  // ── Construction / Project ──────────────────────────────
  "concrete-volume-calculator": "project-construction-management",
  "paint-coverage-calculator": "project-construction-management",
  "grout-calculator-for-tile": "project-construction-management",
  "fiber-cement-siding": "project-construction-management",
  "highway-design": "project-construction-management",
  "flood-routing": "project-construction-management",
  "scs-method": "project-construction-management",
  "soil-bearing-capacity": "project-construction-management",
  "soil-bearing-capacity-calculator": "project-construction-management",

  // ── Finance / Sales / Working Capital ───────────────────
  "rent-vs-buy-calculator": "finance-sales-working-capital",
  "quote-price-profit-margin-calculator": "finance-sales-working-capital",
  "customer-lifetime-value": "finance-sales-working-capital",
  "days-payable-outstanding": "finance-sales-working-capital",
  "days-sales-outstanding": "finance-sales-working-capital",
  "economic-order-quantity": "finance-sales-working-capital",
  "gst-calculator-australia-canada-india": "finance-sales-working-capital",
  "qualified-charitable-distribution": "finance-sales-working-capital",
  "social-security-benefits": "finance-sales-working-capital",
  "social-security-spousal-benefits": "finance-sales-working-capital",
  "social-security-survivor-benefits": "finance-sales-working-capital",
  "sum-of-years-digits": "finance-sales-working-capital",
  "how-much-house-can-i-afford": "finance-sales-working-capital",
  "cash-on-cash-return": "finance-sales-working-capital",
  "cd-calculator-certificate-of-deposit": "finance-sales-working-capital",
  "rental-yield-calculator": "finance-sales-working-capital",
  "dividend-yield-calculator": "finance-sales-working-capital",
  "high-yield-savings-calculator": "finance-sales-working-capital",
  "bond-yield-calculator": "finance-sales-working-capital",
  "comic-book-value": "finance-sales-working-capital",
  "vinyl-record-value": "finance-sales-working-capital",
  "milk-yield-check": "finance-sales-working-capital",

  // ── Lean / OEE ──────────────────────────────────────────
  "value-stream-map-vsm-calculator": "lean-production",
  "7-israf-muda-avcisi-parasal-karsilik-calculator": "lean-production",

  // ── Quality / SPC ───────────────────────────────────────
  "quality-cost-paf-calculator": "quality-six-sigma",
  "theoretical-yield-calculator": "quality-six-sigma",
  "percent-yield-calculator": "quality-six-sigma",
  "yield-calculator": "quality-six-sigma",
  "seed-rate-calculator": "quality-six-sigma",
  "unit-price-calculator": "quality-six-sigma",
  "grains-to-grams-calculator": "quality-six-sigma",
  "rice-calculator": "quality-six-sigma",
  "net-price-calculator": "finance-sales-working-capital",
  "original-price-calculator": "finance-sales-working-capital",
  "sale-price-calculator": "finance-sales-working-capital",
  "confusion-matrix-calculator": "quality-six-sigma",
  "beat-frequency-calculator": "quality-six-sigma",
  "frequency-calculator": "quality-six-sigma",
  "note-frequency-calculator": "mathematics-statistics",

  // ── Sustainability / ESG ────────────────────────────────
  "cbam-unit-product-carbon-footprint-calculator": "sustainability-resource-esg",
  "carbon-footprint-compliance-risk": "sustainability-resource-esg",
  "earth-overshoot-day": "sustainability-resource-esg",
  "life-cycle-assessment": "sustainability-resource-esg",

  // ── Mathematics & Statistics ────────────────────────────
  "adjusted-r-squared": "mathematics-statistics",
  "cohen-s-d-calculator": "mathematics-statistics",
  "interquartile-range": "mathematics-statistics",
  "kolmogorov-smirnov": "mathematics-statistics",
  "generating-function": "mathematics-statistics",
  "handshaking-lemma": "mathematics-statistics",
  "inverse-laplace": "mathematics-statistics",
  "inverse-z-transform": "mathematics-statistics",
  "propositional-logic": "mathematics-statistics",
  "recurrence-relation": "mathematics-statistics",
  "regular-polygon-area": "mathematics-statistics",
  "cone-surface-area": "mathematics-statistics",
  "cube-surface-area": "mathematics-statistics",
  "cylinder-surface-area": "mathematics-statistics",
  "prism-surface-area": "mathematics-statistics",
  "pyramid-surface-area": "mathematics-statistics",
  "rectangular-prism-volume": "mathematics-statistics",
  "triangular-prism-volume": "mathematics-statistics",
  "one-sided-limit": "mathematics-statistics",
  "linear-progression": "mathematics-statistics",
  "round-to-nearest": "mathematics-statistics",
  "survival-analysis": "mathematics-statistics",
  "weibull-analysis": "mathematics-statistics",
  "feature-selection": "mathematics-statistics",
  "euler-s-formula-calculator": "mathematics-statistics",
  "e-mc-calculator": "mathematics-statistics",
  "cylindrical-coordinate": "mathematics-statistics",
  "center-of-gravity": "mathematics-statistics",
  "capacity-analysis": "mathematics-statistics",

  // ── Physics → Mathematics (no dedicated physics category) ─
  "length-contraction": "mathematics-statistics",
  "schwarzschild-radius": "mathematics-statistics",
  "gravity-assist": "mathematics-statistics",
  "de-broglie-wavelength": "mathematics-statistics",
  "de-broglie-wavelength-calculator": "mathematics-statistics",
  "cosmic-microwave-background": "mathematics-statistics",
  "cosmic-microwave-background-calculator": "mathematics-statistics",
  "chandrasekhar-limit": "mathematics-statistics",
  "frequency-wavelength": "mathematics-statistics",
  "wavelength-calculator": "mathematics-statistics",
  "quantum-numbers-calculator": "mathematics-statistics",
  "quantum-tunneling": "mathematics-statistics",
  "quantum-tunneling-calculator": "mathematics-statistics",
  "conservation-of-momentum": "mathematics-statistics",
  "conservation-of-momentum-calculator": "mathematics-statistics",
  "momentum-calculator": "mathematics-statistics",
  "relativistic-momentum": "mathematics-statistics",
  "relativistic-momentum-calculator": "mathematics-statistics",
  "gravity-assist-calculator": "mathematics-statistics",
  "gravity-calculator": "mathematics-statistics",
  "horizontal-center-of-gravity-calculator": "mathematics-statistics",
  "nuclear-fission-calculator": "mathematics-statistics",
  "nuclear-fusion-calculator": "mathematics-statistics",
  "half-life-nuclear": "process-chemical",
  "half-life-nuclear-calculator": "process-chemical",
  "waveguide-calculator": "mathematics-statistics",
  "wave-speed-calculator": "mathematics-statistics",
  "standing-wave-calculator": "mathematics-statistics",

  // ── Process / Chemical ──────────────────────────────────
  "reduced-temperature": "process-chemical",
  "batch-reactor": "process-chemical",
  "npsh-required": "process-chemical",

  // ── Agriculture / Food ──────────────────────────────────
  "npk-calculator": "agriculture-food-beverage",
  "fertilizer-calculator": "agriculture-food-beverage",
  "fertilizer-dosage-calculator": "agriculture-food-beverage",
  "lawn-fertilizer": "agriculture-food-beverage",
  "lawn-fertilizer-calculator": "agriculture-food-beverage",
  "crop-factor-calculator": "agriculture-food-beverage",
  "crop-yield-calculator": "agriculture-food-beverage",
  "crop-yield-loss-analyzer": "agriculture-food-beverage",
  "harvest-calculator": "agriculture-food-beverage",
  "soil-ph-calculator": "agriculture-food-beverage",
  "soil-volume-calculator": "agriculture-food-beverage",
  "topsoil-calculator": "agriculture-food-beverage",
  "grass-seed-calculator": "agriculture-food-beverage",
  "seed-calculator": "agriculture-food-beverage",
  "greenhouse-calculator": "agriculture-food-beverage",
  "pumpkin-yield-calculator": "agriculture-food-beverage",
  "bread-calculator": "agriculture-food-beverage",

  // ── Food & Cooking ──────────────────────────────────────
  "candy-temperature": "food-cold-chain-hygiene",
  "steak-temperature": "food-cold-chain-hygiene",
  "grill-temperature": "food-cold-chain-hygiene",
  "reptile-temperature": "health-fitness-daily-life",
  "standard-drink": "food-cold-chain-hygiene",
  "drink-mixer": "food-cold-chain-hygiene",
  "wedding-cake-serving": "food-cold-chain-hygiene",

  // ── Health / Daily Life ─────────────────────────────────
  "hamwi-formula": "health-fitness-daily-life",
  "robinson-formula": "health-fitness-daily-life",
  "miller-formula": "health-fitness-daily-life",
  "coleman-liau-index": "health-fitness-daily-life",
  "corpulence-index": "health-fitness-daily-life",
  "perceived-stress-scale": "health-fitness-daily-life",
  "flourishing-scale": "health-fitness-daily-life",
  "subjective-well-being": "health-fitness-daily-life",
  "positive-predictive-value": "health-fitness-daily-life",
  "negative-predictive-value": "health-fitness-daily-life",
  "sensitivity-specificity": "health-fitness-daily-life",
  "d-d-calculator": "health-fitness-daily-life",
  "d-d-stat-calculator": "health-fitness-daily-life",
  "vitamin-d-from-sun": "health-fitness-daily-life",
  "hcg-doubling-time": "health-fitness-daily-life",
  "healthy-life-years": "health-fitness-daily-life",
  "reps-in-reserve": "health-fitness-daily-life",
  "valentine-s-day-calculator": "health-fitness-daily-life",
  "football-40-yard-dash": "health-fitness-daily-life",
  "golf-course-handicap": "health-fitness-daily-life",
  "hockey-skating-speed": "health-fitness-daily-life",
  "tennis-string-tension": "health-fitness-daily-life",
  "jack-daniels-vdot": "health-fitness-daily-life",
  "lose-it-app-calculator": "health-fitness-daily-life",
  "noom-kalori-hesaplayici": "health-fitness-daily-life",

  // ── Conversion & Measurement ─────────────────────────────
  "baud-to-bps": "conversion-measurement",
  "days-to-hours": "conversion-measurement",
  "days-to-weeks": "conversion-measurement",
  "hours-to-days": "conversion-measurement",
  "minutes-to-hours": "conversion-measurement",
  "minutes-to-seconds": "conversion-measurement",
  "fortnights-to-days": "conversion-measurement",
  "microseconds-to-nanoseconds": "conversion-measurement",
  "nanoseconds-to-picoseconds": "conversion-measurement",
  "shakes-to-nanoseconds": "conversion-measurement",
  "sidereal-day-to-hours": "conversion-measurement",
  "julian-year-to-days": "conversion-measurement",
  "eu-shoe-size-to-us": "conversion-measurement",
  "uk-shoe-size-to-us": "conversion-measurement",
  "us-shoe-size-to-eu": "conversion-measurement",
  "us-dress-size-to-eu": "conversion-measurement",
  "us-men-suit-size-to-eu": "conversion-measurement",
  "parts-per-billion": "conversion-measurement",
  "parts-per-million": "conversion-measurement",
  "stere-to-cubic-meters": "conversion-measurement",
  "cords-to-cubic-meters": "conversion-measurement",
  "circular-mils-to-sqmm": "conversion-measurement",
  "cm-to-mm": "conversion-measurement",
  "m-to-cm": "conversion-measurement",
  "m-to-ft": "conversion-measurement",
  "km-to-m": "conversion-measurement",
  "km-h-to-m-s": "conversion-measurement",
  "m-s-to-km-h": "conversion-measurement",
  "mach-to-km-h": "conversion-measurement",
  "ml-to-cups": "conversion-measurement",
  "ml-to-oz": "conversion-measurement",
  "cups-to-ml": "conversion-measurement",
  "oz-to-ml": "conversion-measurement",
  "cubits-to-meters": "conversion-measurement",
  "fathoms-to-meters": "conversion-measurement",
  "perches-to-sqm": "conversion-measurement",
  "square-rods-to-sqm": "conversion-measurement",
  "sqm-to-sqft": "conversion-measurement",
  "slugs-to-kg": "conversion-measurement",
  "light-years-to-km": "conversion-measurement",
  "parsecs-to-light-years": "conversion-measurement",
  "solar-masses-to-kg": "conversion-measurement",
  "tablespoon-to-teaspoon": "conversion-measurement",
  "tablespoons-to-ml": "conversion-measurement",
  "teaspoons-to-ml": "conversion-measurement",
  "thou-to-mm": "conversion-measurement",
  "scientific-notation": "conversion-measurement",
  "standard-form-line": "conversion-measurement",
  "point-slope-form": "conversion-measurement",
  "slope-intercept-form": "conversion-measurement",
  "gibibytes-to-gigabytes": "conversion-measurement",
  "gigabytes-to-terabytes": "conversion-measurement",
  "kibibytes-to-kilobytes": "conversion-measurement",
  "kilobytes-to-megabytes": "conversion-measurement",
  "mebibytes-to-megabytes": "conversion-measurement",
  "megabytes-to-gigabytes": "conversion-measurement",
  "petabytes-to-exabytes": "conversion-measurement",
  "tebibytes-to-terabytes": "conversion-measurement",
  "terabytes-to-petabytes": "conversion-measurement",
  "bits-to-bytes": "conversion-measurement",
  "bytes-to-kilobytes": "conversion-measurement",
  "kb-calculator": "conversion-measurement",
  "grains-to-grams": "conversion-measurement",
  "stone-calculator": "conversion-measurement",
  "decades-to-centuries-calculator": "conversion-measurement",

  // ── Education & Academic ────────────────────────────────
  "gunning-fog-index": "education-academic",
  "expected-family-contribution": "education-academic",
  "dean-s-list-calculator": "education-academic",
  "egitim-birikim-hesaplayici": "education-academic",
  "transcript-calculator": "education-academic",

  // ── Technology / IT ──────────────────────────────────────
  "protective-relay": "electrical-power-systems",
  "subcontractor-margin-leak-detector": "finance-sales-working-capital",
  "irrigation-cost-check": "finance-sales-working-capital",
  "bradford-factor-calculator": "workforce-hr",
  "insan-hayati-degeri-hesaplayici": "finance-sales-working-capital",
  "amperage-calculator": "electrical-power-systems",
  "electric-field-calculator": "electrical-power-systems",
  "magnetic-field-calculator": "electrical-power-systems",
  "depth-of-field-calculator": "technology-ai-cloud-cyber",
  "field-of-view-calculator": "technology-ai-cloud-cyber",
  "bernoulli-equation": "mathematics-statistics",
  "bernoulli-equation-calculator": "mathematics-statistics",
  "nusselt-number-calculator": "mechanical-hvac-energy-loss",
  "absorption-calculator": "mechanical-hvac-energy-loss",
  "guitar-scale-length": "health-fitness-daily-life",
  "reverb-calculator": "health-fitness-daily-life",
  "chain-length-calculator": "process-chemical",
  "magnification-calculator-optics": "mathematics-statistics",
  "cricket-net-run-rate": "health-fitness-daily-life",
  "gd-t-calculator": "cnc-additive-manufacturing",
  "parabolic-dish": "mathematics-statistics",
  "thermic-effect-of-food": "health-fitness-daily-life",

  // ── -calculator suffix variants with wrong schema metadata ──
  "baking-percentage-calculator": "agriculture-food-beverage",
  "cumulative-gpa-calculator": "education-academic",
  "dividend-payout-ratio-calculator": "finance-sales-working-capital",
  "effect-size-calculator": "mathematics-statistics",
  "eu-shoe-size-to-us-calculator": "conversion-measurement",
  "font-size-converter-calculator": "conversion-measurement",
  "gpa-calculator": "education-academic",
  "hat-size-calculator": "conversion-measurement",
  "letter-grade-to-percentage-calculator": "education-academic",
  "lightweight-cost-savings-calculator": "finance-sales-working-capital",
  "mid-parental-height-calculator": "health-fitness-daily-life",
  "paper-size-calculator": "conversion-measurement",
  "percentage-to-letter-grade-calculator": "education-academic",
  "prorated-property-tax": "finance-sales-working-capital",
  "recipe-converter-calculator": "agriculture-food-beverage",
  "ring-size-calculator": "conversion-measurement",
  "sample-size-calculator": "mathematics-statistics",
  "semester-gpa-calculator": "education-academic",
  "sloan-ratio-calculator": "finance-sales-working-capital",
  "tool-wear-cost-calculator": "cnc-additive-manufacturing",
  "treasury-bond-calculator": "finance-sales-working-capital",
  "us-men-suit-size-to-eu-calculator": "conversion-measurement",
  "muda-waste-cost-calculator": "lean-production",
  "rca-recurring-cost-calculator": "finance-sales-working-capital",
};

const INDUSTRY_CATEGORY_TO_GLOBAL: Readonly<Record<IndustryCategory, GlobalToolCategorySlug>> = {
  "heavy-industry": "cnc-additive-manufacturing",
  "building-trades": "project-construction-management",
  "field-services": "mechanical-hvac-energy-loss",
  "food-retail": "food-cold-chain-hygiene",
  "custom-manufacturing": "cnc-additive-manufacturing",
  "logistics-transport": "procurement-supply-chain",
  "agriculture-livestock": "agriculture-food-beverage",
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
  "agriculture-crops": "agriculture-food-beverage",
  "agriculture-irrigation": "agriculture-food-beverage",
  "agriculture-feed": "agriculture-food-beverage",
  "agriculture-dairy": "agriculture-food-beverage",
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
  "agriculture-food": "agriculture-food-beverage",
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
  { categorySlug: "process-chemical", keywords: ["reaktor", "pompa", "harman", "kutle", "ventil", "kimya", "proses", "chemical", "fluid", "reaction", "molar", "titration", "stoichiometry", "concentration", "ph", "acid", "base", "distillation", "chromatography", "activity coefficient", "electronegativity", "hess", "atom", "atomic", "ionic radius", "electron affinity", "equilibrium", "equivalence", "henderson", "hasselbalch", "clausius", "clapeyron", "adiabatic", "lapse rate", "reactor", "npsh", "batch reactor", "dynamic viscosity", "kinematic viscosity", "heat of fusion", "heat of vaporization", "integrated rate", "decay constant", "half life", "radioactive"] },
  { categorySlug: "cnc-additive-manufacturing", keywords: ["cnc", "3b", "3d", "takim", "tool", "filament", "baski", "machining", "tezgah", "lathe", "milling", "drilling", "grinding", "edm", "laser", "plasma", "waterjet", "spindle", "rpm", "feed", "insert", "carbide", "hss", "coating", "tool wear"] },
  { categorySlug: "metal-plastics-forming", keywords: ["sac", "dokum", "enjeksiyon", "pres", "bukum", "metal", "sheet", "forming", "scrap", "casting", "forging", "extrusion", "stamping", "rolling", "welding", "weld", "solder", "brazing", "annealing", "tempering", "hardness", "hrc", "hb", "hv", "penetration", "shrinkage", "distortion", "preheat"] },
  { categorySlug: "digital-factory-automation", keywords: ["iot", "cobot", "agv", "dijital", "otomasyon", "digital", "automation", "scada", "plc", "robot", "twin", "industry 4", "sensor", "actuator"] },
  { categorySlug: "maintenance-reliability", keywords: ["mtbf", "mttr", "bakim", "ariza", "maintenance", "reliability", "rca", "preventive", "spare part", "uptime", "availability", "oee", "failure"] },
  { categorySlug: "mechanical-hvac-energy-loss", keywords: ["hvac", "kompresor", "compressor", "pompa", "mechanical", "leak", "pressure", "pipe", "piping", "steam", "insulation", "heat loss", "boiler", "chiller", "duct", "ventilation", "cfm", "btu", "load calculation", "pump"] },

  // ── Construction / Project ──────────────────────────────────
  { categorySlug: "project-construction-management", keywords: ["evm", "cpm", "santiye", "insaat", "construction", "hakedis", "sozlesme", "concrete", "paint", "drywall", "roofing", "stucco", "gambrel", "scaffold", "formwork", "masonry", "brick", "foundation", "excavation", "structural", "rebar", "beam", "column", "slab", "footing"] },
  { categorySlug: "electrical-power-systems", keywords: ["elektrik", "panel", "power", "voltage", "current", "electrical", "kwh", "kw", "transformer", "generator", "motor", "grid", "substation", "power factor", "cable", "ampere", "ohm", "circuit breaker", "switchgear", "filter", "amplifier", "reactance", "impedance", "capacitor", "inductor", "resistor", "diode", "transistor", "opamp", "operational amplifier", "inverting", "non inverting", "instrumentation", "butterworth", "bessel", "chebyshev", "rc time", "rl time", "band pass", "band stop", "high pass", "low pass", "rectifier", "regulator", "pwm", "inverter", "converter", "solar panel", "photovoltaic"] },

  // ── Supply Chain / HR / Finance ─────────────────────────────
  { categorySlug: "procurement-supply-chain", keywords: ["tedarik", "tco", "moq", "lojistik", "supply", "procurement", "route", "fuel", "transport", "eoq", "inventory", "warehouse", "stock", "reorder", "safety stock", "abc analysis", "customs", "incoterm", "import", "export", "demurrage"] },
  { categorySlug: "workforce-hr", keywords: ["vardiya", "turnover", "egitim", "mesai", "workforce", "hr", "employee", "labor", "labour", "shift", "overtime", "salary", "payroll", "absenteeism", "headcount", "competence"] },
  { categorySlug: "finance-sales-working-capital", keywords: ["finans", "clv", "cac", "marj", "margin", "finance", "profit", "price", "quote", "rent", "loan", "mortgage", "interest", "npv", "irr", "payback", "investment", "credit", "tax", "depreciation", "amortization", "roi", "dividend", "crypto", "bitcoin", "forex", "valuation", "startup", "runway", "equity", "etf", "ira", "annuity", "insurance", "budget", "cash flow", "breakeven", "cost benefit", "cost estimation", "cost of living", "savings", "bond", "roth", "sba", "rmd", "wire transfer", "debt payoff", "affordability", "net operating", "noi", "cash on cash", "certificate of deposit", "savings bond"] },

  // ── Sustainability / Food / Textile ─────────────────────────
  { categorySlug: "sustainability-resource-esg", keywords: ["karbon", "scope", "cbam", "esg", "surdur", "carbon", "emission", "energy", "recycle", "waste", "water", "green", "footprint", "climate", "co2", "greenhouse", "smog"] },
  { categorySlug: "food-cold-chain-hygiene", keywords: ["gida", "soguk", "cold chain", "hygiene", "food safety", "menu", "restaurant", "calorie", "nutrition", "shelf life", "haccp", "chocolate", "tempering", "candy", "steak", "grill", "wedding cake", "standard drink", "drink mixer"] },
  { categorySlug: "textile-print-lab", keywords: ["tekstil", "baski", "print", "textile", "fabric", "sewing", "knitting", "weaving", "dye", "yarn", "garment", "apparel", "lab", "laboratory"] },
  { categorySlug: "packaging-local-business", keywords: ["paket", "local", "cleaning", "daily", "packaging", "retail", "box", "carton", "pallet", "barcode", "label", "paper", "page count", "printing"] },

  // ── Global Trade ────────────────────────────────────────────
  { categorySlug: "global-compliance-trade", keywords: ["compliance", "trade", "customs", "ihracat", "import", "regulation", "incoterm", "tariff", "vat", "transfer pricing", "ifrs", "aml"] },

  // ── Technology ──────────────────────────────────────────────
  { categorySlug: "technology-ai-cloud-cyber", keywords: ["cloud", "api", "ai", "siber", "cyber", "software", "algorithm", "database", "encryption", "hash", "password", "regex", "json", "unicode", "binary", "hex", "octal", "ascii", "base64", "token", "nft", "jwt", "oauth", "subnet", "ip", "dns", "vpn", "bandwidth", "latency", "server", "cpu", "gpu", "memory", "storage", "checksum", "tree", "markdown", "morse"] },

  // ── Mathematics & Statistics ────────────────────────────────
  { categorySlug: "mathematics-statistics", keywords: ["algebra", "calculus", "derivative", "integral", "matrix", "vector", "equation", "polynomial", "fraction", "decimal", "percent", "ratio", "proportion", "geometry", "trigonometry", "angle", "triangle", "circle", "logarithm", "exponential", "prime", "factorial", "modulo", "gcd", "lcm", "fibonacci", "permutation", "combination", "absolute", "complex", "quaternion", "radical", "roman", "stirling", "ncr", "hanoi", "disk", "partition", "predicate", "conic", "polar", "gradient", "divergence", "decomposition", "set theory", "statistics", "probability", "regression", "anova", "percentile", "correlation", "mean", "median", "mode", "variance", "standard deviation", "confidence", "zscore", "t test", "chi square", "normal distribution", "binomial", "poisson", "bayes", "dice", "odds", "dijkstra", "kendall", "dbscan", "clustering", "roc", "auc", "iqr", "coefficient", "midpoint", "average", "law calculator", "boyle", "charles", "ideal gas", "hooke", "snell", "faraday", "gauss", "kepler", "hubble", "planck", "young", "lenz", "ohm", "pythagorean", "quadratic", "cramer", "simpson", "trapezoidal", "gaussian elimination", "elimination", "adjacency", "propagation", "characteristic impedance", "modular arithmetic", "scientific notation", "standard form", "slope intercept", "point slope", "rule calculator", "ode solver", "pde solver", "damped harmonic", "simple harmonic", "center of gravity", "ballistic", "elastic collision", "inelastic collision", "specific impulse", "cosmological", "magnification"] },

  // ── Health & Daily Life ─────────────────────────────────────
  { categorySlug: "health-fitness-daily-life", keywords: ["bmi", "bmr", "calorie", "body", "weight", "heart", "blood", "sleep", "pregnancy", "ovulation", "baby", "infant", "fasting", "breathing", "metabolic", "cholesterol", "fitness", "workout", "muscle", "vo2", "1rm", "running", "pace", "marathon", "cycling", "swimming", "hiking", "training", "diet", "nutrition", "mindfulness", "smoking", "teeth", "age", "date", "calendar", "birthday", "deadline", "moon", "grade", "gpa", "midpoint", "distance", "velocity", "acceleration", "force", "erectile", "estrogen", "testosterone", "kidney", "liver", "thyroid", "diabetes", "glucose", "cancer", "tumor", "ecog", "mrs", "whitening", "thermogenesis", "wim", "hof", "lose", "noom", "pcos", "bradford", "dose", "half life", "predictor", "height predictor", "risk", "life expectancy", "fat mass", "frailty", "tinnitus", "braden", "palliative", "glasgow", "gcs", "gait", "balance"] },

  // ── Conversion & Measurement ────────────────────────────────
  { categorySlug: "conversion-measurement", keywords: ["converter", "conversion", "convert", "unit", "metric", "imperial", "feet", "inches", "yards", "miles", "kilometer", "centimeter", "millimeter", "micrometer", "nanometer", "liter", "gallon", "ounce", "pound", "kilogram", "gram", "ton", "tonne", "celsius", "fahrenheit", "kelvin", "acres", "hectares", "psi", "bar", "atm", "pascal", "mph", "kmh", "knot", "radians", "degrees", "horsepower", "btu", "joule", "calorie", "watt", "ampere", "volt", "stone", "decades", "centuries", "kb", "mb", "gb", "pixel", "dpi", "paper size", "cm to", "m to", "km to", "ml to", "cups to", "oz to", "bits to", "bytes to", "to cm", "to mm", "to m", "to ft", "to km", "to ml", "to cups", "to oz", "to lbs", "to kg", "to f", "to c", "to mph", "to kph", "to knots", "sqm", "sqft", "cubic", "tablespoon", "teaspoon", "fathoms", "perches", "parsecs", "light years", "cords"] },

  // ── Automotive & Transport ──────────────────────────────────
  { categorySlug: "automotive-transport", keywords: ["car", "vehicle", "auto", "truck", "bus", "engine", "tire", "tyre", "brake", "fuel", "mpg", "odometer", "ev", "electric vehicle", "battery", "hybrid", "transmission", "chassis", "suspension", "fleet", "horsepower", "torque"] },

  // ── Agriculture, Food & Beverage ────────────────────────────
  { categorySlug: "agriculture-food-beverage", keywords: ["agriculture", "farming", "farm", "crop", "harvest", "irrigation", "fertilizer", "npk", "soil", "plant", "seed", "yield", "field", "tractor", "pesticide", "herbicide", "greenhouse", "livestock", "cattle", "dairy", "milk", "feed", "grain", "wheat", "corn", "rice", "silage", "pasture", "ranch", "veterinary", "veterinarian", "animal", "poultry", "swine", "herd", "flock", "breeding", "vaccination", "recipe", "baking", "cooking", "bread", "sourdough", "yogurt", "kombucha", "cheese", "butter", "brew", "beer", "wine", "abv", "pizza", "paleo", "sugar", "espresso", "beverage", "food processing", "fermentation"] },

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
      FREE_TRAFFIC_CATEGORY_TO_GLOBAL[input.freeTrafficCategory] ?? "other"
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
