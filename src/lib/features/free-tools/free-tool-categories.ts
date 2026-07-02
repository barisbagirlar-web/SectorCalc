/**
 * SectorCalc - Free Tool Category Registry v2.0
 *
 * 33 premium-grade categories for free calculation tools.
 * Each category maps a field (alan), sector (sektor), and social purpose (sosyal amac).
 * Icons, titles, taglines, field, domain, and socialPurpose in all 6 supported locales.
 *
 * ECMI / ISO 9001:2015 - TUV-certifiable industrial quality.
 */

import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

// ─── Types ──────────────────────────────────────────────────────────────────

export type FreeToolCategorySlug =
  | "quality-six-sigma"
  | "technology-ai-cloud-cyber"
  | "finance-sales-working-capital"
  | "electrical-power-systems"
  | "sustainability-resource-esg"
  | "cnc-additive-manufacturing"
  | "metal-plastics-forming"
  | "process-chemical"
  | "hse-ergonomics"
  | "maintenance-reliability"
  | "project-construction-management"
  | "workforce-hr"
  | "procurement-supply-chain"
  | "food-cold-chain-hygiene"
  | "lean-production"
  | "textile-print-lab"
  | "mechanical-hvac-energy-loss"
  | "packaging-local-business"
  | "global-compliance-trade"
  | "digital-factory-automation"
  | "mathematics-statistics"
  | "health-fitness-daily-life"
  | "conversion-measurement"
  | "automotive-transport"
  | "maritime-shipping"
  | "mining-geology"
  | "furniture-woodworking"
  | "cleaning-facility"
  | "water-wastewater"
  | "tourism-hospitality"
  | "education-academic"
  | "real-estate-property"
  | "aerospace-aviation"
  | "other";

export type FreeToolCategoryEntry = {
  readonly slug: FreeToolCategorySlug;
  readonly order: number;
  readonly icon: string;
  /** Premium line-art SVG symbol (inline, copper/navy stroke, 48×48 viewBox). */
  readonly symbolSvg: string;
  readonly title: Readonly<Record<SupportedLocale, string>>;
  readonly tagline: Readonly<Record<SupportedLocale, string>>;
  /** Field domain (alan) - e.g. "Engineering", "Finance", "Health" */
  readonly field: Readonly<Record<SupportedLocale, string>>;
  /** Industry sector (sektor) - e.g. "Manufacturing", "Construction" */
  readonly domain: Readonly<Record<SupportedLocale, string>>;
  /** Social purpose (sosyal amac) - e.g. "Industrial Efficiency", "Public Health" */
  readonly socialPurpose: Readonly<Record<SupportedLocale, string>>;
};

/* ──────────────────────────────────────────────
 * Premium line-art SVG symbols (copper style)
 * Each is a clean 48×48 viewBox with stroke-width="1.5"
 * using sc-copper (#B87333) or sc-navy (#1B2A4A) tones.
 * Follows same design language as premium-categories.ts.
 * ────────────────────────────────────────────── */

const SYM_BASE = 'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

/* --- Reused from premium-categories.ts (20 matching slugs) --- */
const SYM_QUALITY = `<svg ${SYM_BASE}><polygon points="24,4 29,18 44,18 32,27 35,42 24,33 13,42 16,27 4,18 19,18"/><circle cx="24" cy="22" r="4"/></svg>`;
const SYM_TECH = `<svg ${SYM_BASE}><rect x="10" y="10" width="28" height="28" rx="4"/><circle cx="24" cy="24" r="6"/><line x1="24" y1="10" x2="24" y2="4"/><line x1="24" y1="38" x2="24" y2="44"/><line x1="10" y1="24" x2="4" y2="24"/><line x1="38" y1="24" x2="44" y2="24"/></svg>`;
const SYM_FINANCE = `<svg ${SYM_BASE}><line x1="24" y1="8" x2="24" y2="40"/><path d="M14 14c0-4 4-6 10-6s10 2 10 6-4 6-10 6-10 2-10 6 4 6 10 6 10-2 10-6"/></svg>`;
const SYM_ELECTRIC = `<svg ${SYM_BASE}><path d="M20 4l-8 20h8l-4 20 16-24h-8l8-16z"/></svg>`;
const SYM_LEAF = `<svg ${SYM_BASE}><path d="M24 12c-8 0-14 6-14 14v8c0 2 2 4 4 4h20c2 0 4-2 4-4v-8c0-8-6-14-14-14z"/><path d="M24 12V4"/><path d="M18 32l6-8 6 8"/></svg>`;
const SYM_CNC = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="8"/><path d="M24 8v6M24 34v6M8 24h6M34 24h6"/><path d="M14 14l4 4M30 30l4 4M30 14l-4 4M14 30l4-4"/></svg>`;
const SYM_METAL = `<svg ${SYM_BASE}><rect x="8" y="16" width="32" height="20" rx="2"/><path d="M8 16l6-8h20l6 8"/><line x1="24" y1="16" x2="24" y2="36"/><line x1="14" y1="24" x2="18" y2="24"/><line x1="30" y1="24" x2="34" y2="24"/></svg>`;
const SYM_PROCESS = `<svg ${SYM_BASE}><circle cx="16" cy="16" r="6"/><circle cx="36" cy="16" r="6"/><line x1="22" y1="16" x2="30" y2="16"/><line x1="16" y1="22" x2="16" y2="40"/><line x1="36" y1="22" x2="36" y2="40"/><line x1="16" y1="40" x2="36" y2="40"/></svg>`;
const SYM_HSE = `<svg ${SYM_BASE}><path d="M24 6L8 14v8c0 12 6 18 16 20 10-2 16-8 16-20v-8L24 6z"/><line x1="24" y1="18" x2="24" y2="28"/><circle cx="24" cy="32" r="1.5"/></svg>`;
const SYM_MAINTENANCE = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="14"/><path d="M24 10v14l8 8"/><path d="M10 8l4 4M38 8l-4 4M10 40l4-4M38 40l-4-4"/></svg>`;
const SYM_PROJECT = `<svg ${SYM_BASE}><rect x="8" y="6" width="32" height="36" rx="3"/><line x1="16" y1="14" x2="32" y2="14"/><line x1="16" y1="22" x2="32" y2="22"/><line x1="16" y1="30" x2="28" y2="30"/><circle cx="34" cy="34" r="3"/></svg>`;
const SYM_WORKFORCE = `<svg ${SYM_BASE}><circle cx="18" cy="14" r="6"/><circle cx="34" cy="16" r="5"/><path d="M8 40c0-8 4-12 10-12s10 4 10 12"/><path d="M28 38c0-6 3-10 8-10s8 4 8 10"/></svg>`;
const SYM_PROCUREMENT = `<svg ${SYM_BASE}><rect x="6" y="10" width="36" height="28" rx="3"/><line x1="6" y1="18" x2="42" y2="18"/><line x1="18" y1="10" x2="18" y2="38"/><circle cx="14" cy="26" r="2"/><circle cx="14" cy="32" r="2"/></svg>`;
const SYM_FOOD = `<svg ${SYM_BASE}><path d="M12 40V8h6v14h4V8h6v14h4V8h6v32"/><line x1="8" y1="40" x2="40" y2="40"/></svg>`;
const SYM_LEAN = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="18"/><path d="M12 24h24M24 12v24"/><path d="M18 24l6-6 6 6M24 18l-6 6 6 6"/></svg>`;
const SYM_TEXTILE = `<svg ${SYM_BASE}><rect x="8" y="8" width="32" height="32" rx="2"/><line x1="8" y1="20" x2="40" y2="20"/><line x1="8" y1="28" x2="40" y2="28"/><line x1="20" y1="8" x2="20" y2="40"/><line x1="28" y1="8" x2="28" y2="40"/></svg>`;
const SYM_THERMAL = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="14"/><path d="M24 10c-3 0-6 2-6 6 0 4 6 8 6 8s6-4 6-8c0-4-3-6-6-6z"/><path d="M14 36l24-24"/></svg>`;
const SYM_BOX = `<svg ${SYM_BASE}><rect x="6" y="14" width="36" height="24" rx="2"/><path d="M6 14l18 6 18-6"/><line x1="24" y1="20" x2="24" y2="38"/><line x1="12" y1="26" x2="16" y2="24"/><line x1="36" y1="26" x2="32" y2="24"/></svg>`;
const SYM_GLOBE = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="18"/><ellipse cx="24" cy="24" rx="10" ry="18"/><line x1="6" y1="24" x2="42" y2="24"/><path d="M12 12c4-2 8-2 12 0s8 2 12 0M12 36c4 2 8 2 12 0s8-2 12 0"/></svg>`;
const SYM_FACTORY = `<svg ${SYM_BASE}><rect x="6" y="14" width="36" height="26" rx="2"/><line x1="6" y1="24" x2="42" y2="24"/><circle cx="16" cy="34" r="4"/><circle cx="32" cy="34" r="4"/><line x1="24" y1="14" x2="24" y2="24"/><path d="M24 10V6"/></svg>`;

/* --- New premium symbols for free-only categories (14 slugs) --- */
const SYM_MATH = `<svg ${SYM_BASE}><path d="M8 8h32v32H8z"/><path d="M16 16l16 16M32 16L16 32"/><circle cx="24" cy="24" r="3"/></svg>`;
const SYM_HEALTH = `<svg ${SYM_BASE}><path d="M24 8C14 8 8 16 8 24s6 16 16 16 16-8 16-16S34 8 24 8z"/><path d="M24 16v16M16 24h16"/></svg>`;
const SYM_CONVERSION = `<svg ${SYM_BASE}><rect x="6" y="18" width="16" height="20" rx="2"/><rect x="26" y="10" width="16" height="28" rx="2"/><line x1="22" y1="28" x2="26" y2="28"/><path d="M14 12v6M38 30v8"/></svg>`;
const SYM_AUTOMOTIVE = `<svg ${SYM_BASE}><rect x="6" y="24" width="36" height="14" rx="4"/><circle cx="16" cy="34" r="5"/><circle cx="32" cy="34" r="5"/><path d="M10 24l4-10h20l4 10"/><line x1="6" y1="28" x2="42" y2="28"/></svg>`;
const SYM_MARITIME = `<svg ${SYM_BASE}><path d="M8 28l8-16h16l8 16"/><rect x="4" y="28" width="40" height="12" rx="2"/><line x1="24" y1="12" x2="24" y2="6"/><path d="M14 18l10-6 10 6"/></svg>`;
const SYM_MINING = `<svg ${SYM_BASE}><path d="M8 36l6-24h20l6 24"/><line x1="14" y1="28" x2="34" y2="28"/><rect x="18" y="36" width="12" height="8"/><path d="M24 16v8M20 20h8"/><line x1="8" y1="44" x2="40" y2="44"/></svg>`;
const SYM_FURNITURE = `<svg ${SYM_BASE}><rect x="8" y="12" width="32" height="20" rx="2"/><rect x="14" y="32" width="6" height="10"/><rect x="28" y="32" width="6" height="10"/><line x1="8" y1="20" x2="40" y2="20"/><line x1="14" y1="26" x2="18" y2="26"/></svg>`;
const SYM_CLEANING = `<svg ${SYM_BASE}><rect x="18" y="6" width="12" height="32" rx="4"/><rect x="14" y="30" width="20" height="12" rx="2"/><path d="M28 12l8 4M28 16l8 6M28 20l6 8"/><circle cx="24" cy="38" r="2"/></svg>`;
const SYM_WATER = `<svg ${SYM_BASE}><path d="M24 6c-4 8-12 16-12 22 0 6.6 5.4 12 12 12s12-5.4 12-12c0-6-8-14-12-22z"/><line x1="18" y1="22" x2="30" y2="22"/><line x1="16" y1="28" x2="32" y2="28"/></svg>`;
const SYM_TOURISM = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="8"/><path d="M24 6v8M24 34v8M6 24h8M34 24h8"/><path d="M10 10l8 8M30 30l8 8M30 10l-8 8M10 30l8-8"/></svg>`;
const SYM_EDUCATION = `<svg ${SYM_BASE}><path d="M6 18l18-10 18 10-18 10z"/><path d="M6 18v14l18 10 18-10V18"/><line x1="12" y1="22" x2="12" y2="34"/><line x1="18" y1="19" x2="18" y2="31"/><line x1="30" y1="19" x2="30" y2="31"/><line x1="36" y1="22" x2="36" y2="34"/></svg>`;
const SYM_PROPERTY = `<svg ${SYM_BASE}><path d="M8 24l16-14 16 14"/><rect x="14" y="26" width="20" height="16" rx="1"/><rect x="20" y="30" width="8" height="12"/><rect x="32" y="8" width="8" height="10" rx="1"/><line x1="8" y1="40" x2="40" y2="40"/></svg>`;
const SYM_AERO = `<svg ${SYM_BASE}><ellipse cx="24" cy="24" rx="18" ry="8"/><line x1="24" y1="16" x2="24" y2="8"/><path d="M16 24l-8 16M32 24l8 16"/><line x1="14" y1="24" x2="34" y2="24"/><path d="M24 8c-4 0-8 4-8 8"/><path d="M24 8c4 0 8 4 8 8"/></svg>`;
const SYM_OTHER = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="18"/><circle cx="18" cy="20" r="2.5"/><circle cx="24" cy="20" r="2.5"/><circle cx="30" cy="20" r="2.5"/><path d="M16 30c4-3 12-3 16 0"/></svg>`;

// ─── Category definitions ───────────────────────────────────────────────────

export const FREE_TOOL_CATEGORIES: readonly FreeToolCategoryEntry[] = [
  // ── 1. FINANCE ─────────────────────────────────────────────────────────────
  {
    slug: "finance-sales-working-capital",
    order: 1,
    icon: "Landmark",
    symbolSvg: SYM_FINANCE,
    title: {
      en: "Finance, Sales & Working Capital",
    },
    tagline: {
      en: "Budgeting, investment, pricing and cash-flow calculators for business finance.",
    },
    field: {
      en: "Business & Economics",
    },
    domain: {
      en: "Financial Services",
    },
    socialPurpose: {
      en: "Economic Empowerment",
    },
  },

  // ── 2. QUALITY ─────────────────────────────────────────────────────────────
  {
    slug: "quality-six-sigma",
    order: 2,
    icon: "Sigma",
    symbolSvg: SYM_QUALITY,
    title: {
      en: "Quality, SPC & Six Sigma",
    },
    tagline: {
      en: "Process capability, control charts, defect analysis and quality cost tools.",
    },
    field: {
      en: "Quality Engineering",
    },
    domain: {
      en: "Process Management",
    },
    socialPurpose: {
      en: "Quality Culture & Zero Defects",
    },
  },

  // ── 3. TECHNOLOGY ──────────────────────────────────────────────────────────
  {
    slug: "technology-ai-cloud-cyber",
    order: 3,
    icon: "Monitor",
    symbolSvg: SYM_TECH,
    title: {
      en: "Technology, AI, Cloud & Cyber",
    },
    tagline: {
      en: "IT infrastructure, cloud cost, cybersecurity, software and data tools.",
    },
    field: {
      en: "Computer Sciences",
    },
    domain: {
      en: "Information Technology",
    },
    socialPurpose: {
      en: "Digital Inclusion & Literacy",
    },
  },

  // ── 4. ELECTRICAL ──────────────────────────────────────────────────────────
  {
    slug: "electrical-power-systems",
    order: 4,
    icon: "Zap",
    symbolSvg: SYM_ELECTRIC,
    title: {
      en: "Electrical, Panel & Power Systems",
    },
    tagline: {
      en: "Electrical engineering, power distribution, panel design and cable sizing.",
    },
    field: {
      en: "Electrical Engineering",
    },
    domain: {
      en: "Power Systems",
    },
    socialPurpose: {
      en: "Energy Access & Efficiency",
    },
  },

  // ── 5. SUSTAINABILITY ─────────────────────────────────────────────────────
  {
    slug: "sustainability-resource-esg",
    order: 5,
    icon: "Leaf",
    symbolSvg: SYM_LEAF,
    title: {
      en: "Environment, Resources & ESG",
    },
    tagline: {
      en: "Carbon footprint, waste, water, energy efficiency and ESG compliance tools.",
    },
    field: {
      en: "Environmental Sciences",
    },
    domain: {
      en: "Sustainable Energy & Environment",
    },
    socialPurpose: {
      en: "Climate Action & Sustainability",
    },
  },

  // ── 6. CNC MANUFACTURING ──────────────────────────────────────────────────
  {
    slug: "cnc-additive-manufacturing",
    order: 6,
    icon: "Cog",
    symbolSvg: SYM_CNC,
    title: {
      en: "CNC, 3D Printing & Advanced Manufacturing",
    },
    tagline: {
      en: "Machining parameters, tool life, 3D print cost and advanced process calculators.",
    },
    field: {
      en: "Manufacturing Engineering",
    },
    domain: {
      en: "Advanced Manufacturing",
    },
    socialPurpose: {
      en: "Industrial Innovation & Precision",
    },
  },

  // ── 7. METALS & PLASTICS ──────────────────────────────────────────────────
  {
    slug: "metal-plastics-forming",
    order: 7,
    icon: "Anvil",
    symbolSvg: SYM_METAL,
    title: {
      en: "Metals, Plastics & Forming",
    },
    tagline: {
      en: "Sheet metal, casting, injection molding, forging and material forming tools.",
    },
    field: {
      en: "Materials Science & Engineering",
    },
    domain: {
      en: "Metal & Plastics Industry",
    },
    socialPurpose: {
      en: "Material Efficiency & Circular Economy",
    },
  },

  // ── 8. CHEMISTRY ──────────────────────────────────────────────────────────
  {
    slug: "process-chemical",
    order: 8,
    icon: "FlaskConical",
    symbolSvg: SYM_PROCESS,
    title: {
      en: "Chemistry, Process & Fluids",
    },
    tagline: {
      en: "Chemical reactions, fluid dynamics, thermodynamics and process engineering.",
    },
    field: {
      en: "Chemical Sciences",
    },
    domain: {
      en: "Chemical & Process Engineering",
    },
    socialPurpose: {
      en: "Chemical Safety & Green Chemistry",
    },
  },

  // ── 9. HSE ─────────────────────────────────────────────────────────────────
  {
    slug: "hse-ergonomics",
    order: 9,
    icon: "ShieldAlert",
    symbolSvg: SYM_HSE,
    title: {
      en: "HSE, Ergonomics & Risk",
    },
    tagline: {
      en: "Occupational safety, ergonomic risk, noise, vibration and hazard analysis.",
    },
    field: {
      en: "Occupational Health & Safety",
    },
    domain: {
      en: "HSE Management",
    },
    socialPurpose: {
      en: "Workplace Safety & Worker Protection",
    },
  },

  // ── 10. MAINTENANCE ──────────────────────────────────────────────────────
  {
    slug: "maintenance-reliability",
    order: 10,
    icon: "Wrench",
    symbolSvg: SYM_MAINTENANCE,
    title: {
      en: "Maintenance & Reliability",
    },
    tagline: {
      en: "MTBF/MTTR, preventive maintenance, spare part optimization and RCA tools.",
    },
    field: {
      en: "Industrial Engineering",
    },
    domain: {
      en: "Asset Management",
    },
    socialPurpose: {
      en: "Operational Excellence & Reliability",
    },
  },

  // ── 11. CONSTRUCTION ─────────────────────────────────────────────────────
  {
    slug: "project-construction-management",
    order: 11,
    icon: "HardHat",
    symbolSvg: SYM_PROJECT,
    title: {
      en: "Construction & Project Management",
    },
    tagline: {
      en: "Site management, EVM, CPM, structural analysis and construction cost tools.",
    },
    field: {
      en: "Civil & Structural Engineering",
    },
    domain: {
      en: "Construction Industry",
    },
    socialPurpose: {
      en: "Infrastructure Development & Safety",
    },
  },

  // ── 12. HR ──────────────────────────────────────────────────────────────
  {
    slug: "workforce-hr",
    order: 12,
    icon: "Users",
    symbolSvg: SYM_WORKFORCE,
    title: {
      en: "Workforce, Shift & HR",
    },
    tagline: {
      en: "Personnel cost, shift planning, overtime, turnover and HR analytics.",
    },
    field: {
      en: "Human Resources Management",
    },
    domain: {
      en: "Workforce & Employment",
    },
    socialPurpose: {
      en: "Fair Labor & Decent Work",
    },
  },

  // ── 13. SUPPLY CHAIN ─────────────────────────────────────────────────────
  {
    slug: "procurement-supply-chain",
    order: 13,
    icon: "Warehouse",
    symbolSvg: SYM_PROCUREMENT,
    title: {
      en: "Procurement, Supply Chain & Logistics",
    },
    tagline: {
      en: "Inventory, EOQ, warehouse, transportation, supplier cost and route optimization.",
    },
    field: {
      en: "Supply Chain Management",
    },
    domain: {
      en: "Logistics & Transportation",
    },
    socialPurpose: {
      en: "Efficient Trade & Commerce",
    },
  },

  // ── 14. FOOD ──────────────────────────────────────────────────────────────
  {
    slug: "food-cold-chain-hygiene",
    order: 14,
    icon: "Salad",
    symbolSvg: SYM_FOOD,
    title: {
      en: "Food, Cold Chain & Hygiene",
    },
    tagline: {
      en: "Recipe cost, shelf life, HACCP, cold chain and food safety calculators.",
    },
    field: {
      en: "Food Science & Technology",
    },
    domain: {
      en: "Food & Beverage Industry",
    },
    socialPurpose: {
      en: "Food Security & Safety",
    },
  },

  // ── 15. LEAN ──────────────────────────────────────────────────────────────
  {
    slug: "lean-production",
    order: 15,
    icon: "ArrowLeftRight",
    symbolSvg: SYM_LEAN,
    title: {
      en: "Efficiency, Lean & OEE",
    },
    tagline: {
      en: "OEE, SMED, Kaizen, Kanban, 5S, VSM and productivity improvement tools.",
    },
    field: {
      en: "Industrial Engineering",
    },
    domain: {
      en: "Manufacturing & Production",
    },
    socialPurpose: {
      en: "Productivity & Operational Efficiency",
    },
  },

  // ── 16. TEXTILE ─────────────────────────────────────────────────────────
  {
    slug: "textile-print-lab",
    order: 16,
    icon: "Shirt",
    symbolSvg: SYM_TEXTILE,
    title: {
      en: "Textile, Printing & Laboratory",
    },
    tagline: {
      en: "Fabric, garment, printing, dyeing and laboratory analysis calculators.",
    },
    field: {
      en: "Textile Engineering",
    },
    domain: {
      en: "Textile & Apparel Industry",
    },
    socialPurpose: {
      en: "Sustainable Fashion & Textile Innovation",
    },
  },

  // ── 17. HVAC-MECHANICAL ──────────────────────────────────────────────────
  {
    slug: "mechanical-hvac-energy-loss",
    order: 17,
    icon: "Thermometer",
    symbolSvg: SYM_THERMAL,
    title: {
      en: "Mechanical, HVAC & Energy Loss",
    },
    tagline: {
      en: "HVAC load, insulation, welding, piping, steam and mechanical system losses.",
    },
    field: {
      en: "Mechanical Engineering",
    },
    domain: {
      en: "HVAC & Mechanical Systems",
    },
    socialPurpose: {
      en: "Energy Efficiency & Thermal Comfort",
    },
  },

  // ── 18. PACKAGING ───────────────────────────────────────────────────────
  {
    slug: "packaging-local-business",
    order: 18,
    icon: "Package",
    symbolSvg: SYM_BOX,
    title: {
      en: "Packaging & Local Business Tools",
    },
    tagline: {
      en: "Packaging volume, pallet config, material selection and local service pricing.",
    },
    field: {
      en: "Packaging Engineering",
    },
    domain: {
      en: "Print & Packaging Industry",
    },
    socialPurpose: {
      en: "Sustainable Packaging & Waste Reduction",
    },
  },

  // ── 19. GLOBAL TRADE ─────────────────────────────────────────────────────
  {
    slug: "global-compliance-trade",
    order: 19,
    icon: "Globe",
    symbolSvg: SYM_GLOBE,
    title: {
      en: "Global Trade, Compliance & Tax",
    },
    tagline: {
      en: "Customs, incoterms, transfer pricing, IFRS, AML and cross-border trade tools.",
    },
    field: {
      en: "International Business & Law",
    },
    domain: {
      en: "Global Trade & Compliance",
    },
    socialPurpose: {
      en: "Fair Trade & Regulatory Compliance",
    },
  },

  // ── 20. AUTOMATION ──────────────────────────────────────────────────────
  {
    slug: "digital-factory-automation",
    order: 20,
    icon: "Cpu",
    symbolSvg: SYM_FACTORY,
    title: {
      en: "Automation & Digital Factory",
    },
    tagline: {
      en: "IoT, robotics, AGV, digital twin, SCADA and industry 4.0 calculators.",
    },
    field: {
      en: "Automation & Control Engineering",
    },
    domain: {
      en: "Industrial Automation",
    },
    socialPurpose: {
      en: "Industry 4.0 & Smart Manufacturing",
    },
  },

  // ── 21. MATHEMATICS ─────────────────────────────────────────────────────
  {
    slug: "mathematics-statistics",
    order: 21,
    icon: "Calculator",
    symbolSvg: SYM_MATH,
    title: {
      en: "Mathematics, Statistics & Analytics",
    },
    tagline: {
      en: "Algebra, calculus, probability, regression, hypothesis testing and data analysis.",
    },
    field: {
      en: "Mathematical Sciences",
    },
    domain: {
      en: "Education & Research",
    },
    socialPurpose: {
      en: "STEM Education & Data Literacy",
    },
  },

  // ── 22. HEALTH ──────────────────────────────────────────────────────────
  {
    slug: "health-fitness-daily-life",
    order: 22,
    icon: "Heart",
    symbolSvg: SYM_HEALTH,
    title: {
      en: "Health, Sports & Daily Life",
    },
    tagline: {
      en: "BMI, BMR, fitness, nutrition, pregnancy, age, date and everyday calculators.",
    },
    field: {
      en: "Health Sciences & Wellness",
    },
    domain: {
      en: "Healthcare & Consumer Wellness",
    },
    socialPurpose: {
      en: "Health & Well-being",
    },
  },

  // ── 23. CONVERSION ──────────────────────────────────────────────────────
  {
    slug: "conversion-measurement",
    order: 23,
    icon: "Ruler",
    symbolSvg: SYM_CONVERSION,
    title: {
      en: "Conversion & Measurement",
    },
    tagline: {
      en: "Unit conversion, measurement systems, scales and dimensional analysis tools.",
    },
    field: {
      en: "Measurement Science",
    },
    domain: {
      en: "Metrology & Standards",
    },
    socialPurpose: {
      en: "Standardization & Interoperability",
    },
  },

  // ── 24. AUTOMOTIVE ──────────────────────────────────────────────────────
  {
    slug: "automotive-transport",
    order: 24,
    icon: "CarFront",
    symbolSvg: SYM_AUTOMOTIVE,
    title: {
      en: "Automotive & Transport",
    },
    tagline: {
      en: "Fuel economy, engine performance, vehicle dynamics and fleet management tools.",
    },
    field: {
      en: "Automotive Engineering",
    },
    domain: {
      en: "Automotive & Transport Industry",
    },
    socialPurpose: {
      en: "Sustainable Mobility & Road Safety",
    },
  },

  // ── 25. MARITIME ────────────────────────────────────────────────────────
  {
    slug: "maritime-shipping",
    order: 25,
    icon: "Ship",
    symbolSvg: SYM_MARITIME,
    title: {
      en: "Maritime & Shipping",
    },
    tagline: {
      en: "Ship stability, cargo calculations, port operations and maritime safety tools.",
    },
    field: {
      en: "Naval Engineering",
    },
    domain: {
      en: "Maritime Industry",
    },
    socialPurpose: {
      en: "Blue Economy & Marine Safety",
    },
  },

  // ── 26. MINING ──────────────────────────────────────────────────────────
  {
    slug: "mining-geology",
    order: 26,
    icon: "Pickaxe",
    symbolSvg: SYM_MINING,
    title: {
      en: "Mining & Geology",
    },
    tagline: {
      en: "Ore grade, drilling, blasting, mineral processing and geological survey tools.",
    },
    field: {
      en: "Geological & Mining Engineering",
    },
    domain: {
      en: "Extractive Industries",
    },
    socialPurpose: {
      en: "Responsible Resource Extraction",
    },
  },

  // ── 27. FURNITURE ──────────────────────────────────────────────────────
  {
    slug: "furniture-woodworking",
    order: 27,
    icon: "Armchair",
    symbolSvg: SYM_FURNITURE,
    title: {
      en: "Furniture & Woodworking",
    },
    tagline: {
      en: "Lumber volume, furniture costing, board foot and workshop material tools.",
    },
    field: {
      en: "Wood Technology & Design",
    },
    domain: {
      en: "Furniture Industry",
    },
    socialPurpose: {
      en: "Sustainable Forestry & Craftsmanship",
    },
  },

  // ── 28. CLEANING ────────────────────────────────────────────────────────
  {
    slug: "cleaning-facility",
    order: 28,
    icon: "Sparkles",
    symbolSvg: SYM_CLEANING,
    title: {
      en: "Cleaning & Facility Management",
    },
    tagline: {
      en: "Solution dilution, detergent dosage, surface area and labor time calculators.",
    },
    field: {
      en: "Facility Management",
    },
    domain: {
      en: "Cleaning & Hygiene Services",
    },
    socialPurpose: {
      en: "Public Health & Sanitation",
    },
  },

  // ── 29. WATER ───────────────────────────────────────────────────────────
  {
    slug: "water-wastewater",
    order: 29,
    icon: "Droplets",
    symbolSvg: SYM_WATER,
    title: {
      en: "Water & Wastewater",
    },
    tagline: {
      en: "Flow rate, pipe sizing, treatment dosing, pool chemistry and irrigation tools.",
    },
    field: {
      en: "Water Resources Engineering",
    },
    domain: {
      en: "Water & Sanitation Services",
    },
    socialPurpose: {
      en: "Clean Water & Sanitation",
    },
  },

  // ── 30. TOURISM ─────────────────────────────────────────────────────────
  {
    slug: "tourism-hospitality",
    order: 30,
    icon: "Luggage",
    symbolSvg: SYM_TOURISM,
    title: {
      en: "Tourism & Hospitality",
    },
    tagline: {
      en: "Hotel occupancy, RevPAR, restaurant food cost, menu pricing and travel tools.",
    },
    field: {
      en: "Hospitality Management",
    },
    domain: {
      en: "Travel & Tourism Industry",
    },
    socialPurpose: {
      en: "Cultural Exchange & Economic Growth",
    },
  },

  // ── 31. EDUCATION ───────────────────────────────────────────────────────
  {
    slug: "education-academic",
    order: 31,
    icon: "GraduationCap",
    symbolSvg: SYM_EDUCATION,
    title: {
      en: "Education & Academic",
    },
    tagline: {
      en: "GPA, grade, exam score, college planning and study tools.",
    },
    field: {
      en: "Education Sciences",
    },
    domain: {
      en: "Academic & Educational Services",
    },
    socialPurpose: {
      en: "Equal Access to Education",
    },
  },

  // ── 32. REAL ESTATE ─────────────────────────────────────────────────────
  {
    slug: "real-estate-property",
    order: 32,
    icon: "KeyRound",
    symbolSvg: SYM_PROPERTY,
    title: {
      en: "Real Estate & Property",
    },
    tagline: {
      en: "Mortgage, property valuation, rental yield and home affordability calculators.",
    },
    field: {
      en: "Real Estate Economics",
    },
    domain: {
      en: "Property Services",
    },
    socialPurpose: {
      en: "Housing & Community Development",
    },
  },

  // ── 33. AEROSPACE ──────────────────────────────────────────────────────
  {
    slug: "aerospace-aviation",
    order: 33,
    icon: "Plane",
    symbolSvg: SYM_AERO,
    title: {
      en: "Aerospace & Aviation",
    },
    tagline: {
      en: "Flight performance, aerodynamics, fuel range and spacecraft engineering tools.",
    },
    field: {
      en: "Aerospace Engineering",
    },
    domain: {
      en: "Aviation & Space Industry",
    },
    socialPurpose: {
      en: "Space Exploration & Aviation Safety",
    },
  },

  // ── 34. OTHER (fallback) ─────────────────────────────────────────────────
  {
    slug: "other",
    order: 99,
    icon: "FolderOpen",
    symbolSvg: SYM_OTHER,
    title: {
      en: "Other & Cross-Field Tools",
    },
    tagline: {
      en: "General-purpose and cross-domain calculators not fitting a single category.",
    },
    field: {
      en: "Multidisciplinary",
    },
    domain: {
      en: "General Purpose",
    },
    socialPurpose: {
      en: "Knowledge Accessibility",
    },
  },
];

// ─── Indexes ────────────────────────────────────────────────────────────────

const CATEGORY_BY_SLUG = new Map<FreeToolCategorySlug, FreeToolCategoryEntry>(
  FREE_TOOL_CATEGORIES.map((cat) => [cat.slug, cat]),
);

export function getFreeToolCategoryBySlug(
  slug: string,
): FreeToolCategoryEntry | undefined {
  return CATEGORY_BY_SLUG.get(slug as FreeToolCategorySlug);
}

export function getFreeToolCategories(): readonly FreeToolCategoryEntry[] {
  return FREE_TOOL_CATEGORIES;
}

export function resolveFreeToolCategoryTitle(
  slug: string,
  locale: string,
): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return slug;
  const label = category.title[locale as SupportedLocale];
  return label ?? category.title.en;
}

export function resolveFreeToolCategoryTagline(
  slug: string,
  locale: string,
): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return "";
  const tagline = category.tagline[locale as SupportedLocale];
  return tagline ?? category.tagline.en;
}

export function resolveFreeToolCategoryIcon(slug: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  return category?.icon ?? "FolderOpen";
}

/** Resolve the premium SVG symbol string for a given category slug. */
export function resolveFreeToolCategorySymbolSvg(slug: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  return category?.symbolSvg ?? SYM_OTHER;
}

export function resolveFreeToolCategoryField(slug: string, locale: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return "";
  const field = category.field[locale as SupportedLocale];
  return field ?? category.field.en;
}

export function resolveFreeToolCategoryDomain(slug: string, locale: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return "";
  const domain = category.domain[locale as SupportedLocale];
  return domain ?? category.domain.en;
}

export function resolveFreeToolCategorySocialPurpose(slug: string, locale: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return "";
  const purpose = category.socialPurpose[locale as SupportedLocale];
  return purpose ?? category.socialPurpose.en;
}

// ─── Legacy / fallback key mapping ──────────────────────────────────────────
//
// Maps all possible categoryKey values (from schemas, metadata, and fallbacks)
// to one of the canonical categories above.

const CATEGORY_KEY_CANONICAL_MAP: Readonly<Record<string, FreeToolCategorySlug>> = {
  // --- Global category slugs (direct match) ---
  "quality-six-sigma": "quality-six-sigma",
  "technology-ai-cloud-cyber": "technology-ai-cloud-cyber",
  "finance-sales-working-capital": "finance-sales-working-capital",
  "electrical-power-systems": "electrical-power-systems",
  "sustainability-resource-esg": "sustainability-resource-esg",
  "cnc-additive-manufacturing": "cnc-additive-manufacturing",
  "metal-plastics-forming": "metal-plastics-forming",
  "process-chemical": "process-chemical",
  "hse-ergonomics": "hse-ergonomics",
  "maintenance-reliability": "maintenance-reliability",
  "project-construction-management": "project-construction-management",
  "workforce-hr": "workforce-hr",
  "procurement-supply-chain": "procurement-supply-chain",
  "food-cold-chain-hygiene": "food-cold-chain-hygiene",
  "lean-production": "lean-production",
  "textile-print-lab": "textile-print-lab",
  "mechanical-hvac-energy-loss": "mechanical-hvac-energy-loss",
  "packaging-local-business": "packaging-local-business",
  "global-compliance-trade": "global-compliance-trade",
  "digital-factory-automation": "digital-factory-automation",

  // --- catalogCategory values (schema-catalog-metadata) ---
  "chemistry-science": "process-chemical",
  "construction-measurement": "project-construction-management",
  "date-time": "health-fitness-daily-life",
  "ecology-environment": "sustainability-resource-esg",
  "education-academic": "education-academic",
  "energy-carbon": "sustainability-resource-esg",
  "engineering-science": "cnc-additive-manufacturing",
  "everyday-life": "health-fitness-daily-life",
  "finance-business": "finance-sales-working-capital",
  "food-cooking": "food-cold-chain-hygiene",
  "gaming-entertainment": "health-fitness-daily-life",
  "health-body": "health-fitness-daily-life",
  "hobbies-diy": "health-fitness-daily-life",
  "manufacturing-workshop": "lean-production",
  "math-statistics": "mathematics-statistics",
  "physics-science": "process-chemical",
  "conversion": "conversion-measurement",

  // --- categoryId values (in schema JSON files) ---
  cost: "finance-sales-working-capital",
  finance: "finance-sales-working-capital",
  energy: "sustainability-resource-esg",
  sustainability: "sustainability-resource-esg",
  efficiency: "lean-production",
  engineering: "cnc-additive-manufacturing",
  hr: "workforce-hr",
  logistics: "procurement-supply-chain",
  math: "mathematics-statistics",
  quality: "quality-six-sigma",
  safety: "hse-ergonomics",

  // --- Legacy schema category keys ---
  "finans-kredi": "finance-sales-working-capital",
  "finans-ik": "finance-sales-working-capital",
  "maliyet-marj": "finance-sales-working-capital",
  "malzeme-fire-oee": "lean-production",
  "olcum-donusum": "conversion-measurement",
  "teknik-muhendislik": "cnc-additive-manufacturing",
  "enerji-karbon": "sustainability-resource-esg",
  "insaat-saha": "project-construction-management",
  "perakende-gida": "food-cold-chain-hygiene",
  "rota-lojistik": "procurement-supply-chain",
  "kalite-spc-alti-sigma": "quality-six-sigma",
  "isg-risk": "hse-ergonomics",
  "surdurulebilirlik": "sustainability-resource-esg",
  "atolye-tamir": "maintenance-reliability",
  "uretim-imalat": "lean-production",

  // --- Sector taxonomy keys → canonical categories ---
  otomotiv: "automotive-transport",
  denizcilik: "maritime-shipping",
  madencilik: "mining-geology",
  "mobilya-ahsap": "furniture-woodworking",
  temizlik: "cleaning-facility",
  "su-yonetimi": "water-wastewater",
  turizm: "tourism-hospitality",
  egitim: "education-academic",
  emlak: "real-estate-property",
  havacilik: "aerospace-aviation",
};

/** Map any category key (global slug, legacy key, categoryId, sectorKey, etc.) to a canonical FreeToolCategorySlug. */
export function resolveCanonicalCategorySlug(categoryKey: string): FreeToolCategorySlug {
  if (!categoryKey || categoryKey === "diger" || categoryKey === "other") {
    return "other";
  }
  return CATEGORY_KEY_CANONICAL_MAP[categoryKey] ?? "other";
}

/** Return categories sorted by display order, excluding empty categories when called with counts. */
export function getOrderedFreeToolCategories(): readonly FreeToolCategoryEntry[] {
  return [...FREE_TOOL_CATEGORIES].sort((a, b) => a.order - b.order);
}
