/**
 * SectorCalc — Category SVG Line-Art Symbols
 *
 * Premium-quality SVG symbols for all 33 free-tool categories.
 * 48×48 viewBox, stroke-width="1.5", stroke-linecap="round", stroke-linejoin="round".
 * ECMI / ISO 9001 — TUV-certifiable engineering illustration standard.
 *
 * Symbols from premium-categories.ts are re-exported here for unified access.
 * New symbols are designed for the remaining 13 categories.
 */

import type { FreeToolCategorySlug } from "@/lib/features/free-tools/free-tool-categories";

const SYMBOL_BASE =
  'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

// ── Re-exports from premium-categories.ts (20 symbols) ────────────

export const SYMBOL_LEAN = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="18"/><path d="M12 24h24M24 12v24"/><path d="M18 24l6-6 6 6M24 18l-6 6 6 6"/></svg>`;
export const SYMBOL_QUALITY = `<svg ${SYMBOL_BASE}><polygon points="24,4 29,18 44,18 32,27 35,42 24,33 13,42 16,27 4,18 19,18"/><circle cx="24" cy="22" r="4"/></svg>`;
export const SYMBOL_PROCESS = `<svg ${SYMBOL_BASE}><circle cx="16" cy="16" r="6"/><circle cx="36" cy="16" r="6"/><line x1="22" y1="16" x2="30" y2="16"/><line x1="16" y1="22" x2="16" y2="40"/><line x1="36" y1="22" x2="36" y2="40"/><line x1="16" y1="40" x2="36" y2="40"/></svg>`;
export const SYMBOL_CNC = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="8"/><path d="M24 8v6M24 34v6M8 24h6M34 24h6"/><path d="M14 14l4 4M30 30l4 4M30 14l-4 4M14 30l4-4"/></svg>`;
export const SYMBOL_METAL = `<svg ${SYMBOL_BASE}><rect x="8" y="16" width="32" height="20" rx="2"/><path d="M8 16l6-8h20l6 8"/><line x1="24" y1="16" x2="24" y2="36"/><line x1="14" y1="24" x2="18" y2="24"/><line x1="30" y1="24" x2="34" y2="24"/></svg>`;
export const SYMBOL_PROJECT = `<svg ${SYMBOL_BASE}><rect x="8" y="6" width="32" height="36" rx="3"/><line x1="16" y1="14" x2="32" y2="14"/><line x1="16" y1="22" x2="32" y2="22"/><line x1="16" y1="30" x2="28" y2="30"/><circle cx="34" cy="34" r="3"/></svg>`;
export const SYMBOL_FACTORY = `<svg ${SYMBOL_BASE}><rect x="6" y="14" width="36" height="26" rx="2"/><line x1="6" y1="24" x2="42" y2="24"/><circle cx="16" cy="34" r="4"/><circle cx="32" cy="34" r="4"/><line x1="24" y1="14" x2="24" y2="24"/><path d="M24 10V6"/></svg>`;
export const SYMBOL_MAINTENANCE = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="14"/><path d="M24 10v14l8 8"/><path d="M10 8l4 4M38 8l-4 4M10 40l4-4M38 40l-4-4"/></svg>`;
export const SYMBOL_HSE = `<svg ${SYMBOL_BASE}><path d="M24 6L8 14v8c0 12 6 18 16 20 10-2 16-8 16-20v-8L24 6z"/><line x1="24" y1="18" x2="24" y2="28"/><circle cx="24" cy="32" r="1.5"/></svg>`;
export const SYMBOL_PROCUREMENT = `<svg ${SYMBOL_BASE}><rect x="6" y="10" width="36" height="28" rx="3"/><line x1="6" y1="18" x2="42" y2="18"/><line x1="18" y1="10" x2="18" y2="38"/><circle cx="14" cy="26" r="2"/><circle cx="14" cy="32" r="2"/></svg>`;
export const SYMBOL_WORKFORCE = `<svg ${SYMBOL_BASE}><circle cx="18" cy="14" r="6"/><circle cx="34" cy="16" r="5"/><path d="M8 40c0-8 4-12 10-12s10 4 10 12"/><path d="M28 38c0-6 3-10 8-10s8 4 8 10"/></svg>`;
export const SYMBOL_FINANCE = `<svg ${SYMBOL_BASE}><line x1="24" y1="8" x2="24" y2="40"/><path d="M14 14c0-4 4-6 10-6s10 2 10 6-4 6-10 6-10 2-10 6 4 6 10 6 10-2 10-6"/></svg>`;
export const SYMBOL_LEAF = `<svg ${SYMBOL_BASE}><path d="M24 12c-8 0-14 6-14 14v8c0 2 2 4 4 4h20c2 0 4-2 4-4v-8c0-8-6-14-14-14z"/><path d="M24 12V4"/><path d="M18 32l6-8 6 8"/></svg>`;
export const SYMBOL_FOOD = `<svg ${SYMBOL_BASE}><path d="M12 40V8h6v14h4V8h6v14h4V8h6v32"/><line x1="8" y1="40" x2="40" y2="40"/></svg>`;
export const SYMBOL_TEXTILE = `<svg ${SYMBOL_BASE}><rect x="8" y="8" width="32" height="32" rx="2"/><line x1="8" y1="20" x2="40" y2="20"/><line x1="8" y1="28" x2="40" y2="28"/><line x1="20" y1="8" x2="20" y2="40"/><line x1="28" y1="8" x2="28" y2="40"/></svg>`;
export const SYMBOL_ELECTRIC = `<svg ${SYMBOL_BASE}><path d="M20 4l-8 20h8l-4 20 16-24h-8l8-16z"/></svg>`;
export const SYMBOL_THERMAL = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="14"/><path d="M24 10c-3 0-6 2-6 6 0 4 6 8 6 8s6-4 6-8c0-4-3-6-6-6z"/><path d="M14 36l24-24"/></svg>`;
export const SYMBOL_BOX = `<svg ${SYMBOL_BASE}><rect x="6" y="14" width="36" height="24" rx="2"/><path d="M6 14l18 6 18-6"/><line x1="24" y1="20" x2="24" y2="38"/><line x1="12" y1="26" x2="16" y2="24"/><line x1="36" y1="26" x2="32" y2="24"/></svg>`;
export const SYMBOL_GLOBE = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="18"/><ellipse cx="24" cy="24" rx="10" ry="18"/><line x1="6" y1="24" x2="42" y2="24"/><path d="M12 12c4-2 8-2 12 0s8 2 12 0M12 36c4 2 8 2 12 0s8-2 12 0"/></svg>`;
export const SYMBOL_CHIP = `<svg ${SYMBOL_BASE}><rect x="10" y="10" width="28" height="28" rx="4"/><circle cx="24" cy="24" r="6"/><line x1="24" y1="10" x2="24" y2="4"/><line x1="24" y1="38" x2="24" y2="44"/><line x1="10" y1="24" x2="4" y2="24"/><line x1="38" y1="24" x2="44" y2="24"/></svg>`;

// ── New premium line-art symbols (13 categories) ─────────────────

/** Mathematics & Statistics — sigma / distribution curve */
export const SYMBOL_MATH = `<svg ${SYMBOL_BASE}><path d="M8 40h32"/><path d="M12 8h24l-12 16 12 16H12"/><circle cx="28" cy="12" r="2"/><circle cx="36" cy="24" r="2"/><circle cx="28" cy="36" r="2"/><path d="M20 12l-4 4 4 4"/></svg>`;

/** Health & Fitness — heart rate / pulse */
export const SYMBOL_HEALTH = `<svg ${SYMBOL_BASE}><path d="M24 12c-8-10-20-4-20 6 0 8 8 14 20 22 12-8 20-14 20-22 0-10-12-16-20-6z"/><polyline points="6,24 14,24 18,18 24,30 28,20 32,24 42,24"/></svg>`;

/** Conversion & Measurement — ruler / caliper */
export const SYMBOL_CONVERSION = `<svg ${SYMBOL_BASE}><rect x="6" y="18" width="36" height="14" rx="2"/><line x1="10" y1="18" x2="10" y2="32"/><line x1="18" y1="18" x2="18" y2="32"/><line x1="26" y1="18" x2="26" y2="32"/><line x1="34" y1="18" x2="34" y2="32"/><line x1="14" y1="22" x2="14" y2="28"/><line x1="22" y1="22" x2="22" y2="28"/><line x1="30" y1="22" x2="30" y2="28"/></svg>`;

/** Automotive & Transport — steering wheel / gear */
export const SYMBOL_AUTOMOTIVE = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="6"/><line x1="24" y1="12" x2="24" y2="6"/><line x1="24" y1="36" x2="24" y2="42"/><line x1="12" y1="24" x2="6" y2="24"/><line x1="36" y1="24" x2="42" y2="24"/><path d="M14 14l4 4M30 30l4 4M30 14l-4 4M14 30l4-4"/></svg>`;

/** Maritime & Shipping — anchor / wave */
export const SYMBOL_MARITIME = `<svg ${SYMBOL_BASE}><path d="M24 6v28"/><line x1="16" y1="12" x2="32" y2="12"/><path d="M24 34c-8 0-14-4-14-10s6-10 14-10 14 4 14 10-6 10-14 10z"/><path d="M12 38h24"/><path d="M18 42h12"/></svg>`;

/** Mining & Geology — pickaxe / cross-section */
export const SYMBOL_MINING = `<svg ${SYMBOL_BASE}><path d="M28 6L14 24l6 6L38 14z"/><path d="M8 32l8-8"/><line x1="6" y1="42" x2="42" y2="42"/><path d="M16 26l-4 2"/><circle cx="28" cy="22" r="2"/><circle cx="34" cy="18" r="2"/></svg>`;

/** Furniture & Woodworking — cabinet / saw cut */
export const SYMBOL_FURNITURE = `<svg ${SYMBOL_BASE}><rect x="8" y="8" width="32" height="32" rx="2"/><line x1="8" y1="24" x2="40" y2="24"/><line x1="24" y1="8" x2="24" y2="40"/><rect x="12" y="28" width="8" height="8" rx="1"/><rect x="28" y="28" width="8" height="8" rx="1"/><path d="M30 6l4 14"/></svg>`;

/** Cleaning & Facility — sparkle / droplet */
export const SYMBOL_CLEANING = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="16"/><path d="M24 14v20M14 24h20"/><path d="M18 18l4 4M30 30l4 4M30 18l-4 4M18 30l4-4"/><circle cx="24" cy="10" r="2"/><circle cx="24" cy="38" r="2"/><circle cx="10" cy="24" r="2"/><circle cx="38" cy="24" r="2"/></svg>`;

/** Water & Wastewater — water drop / flow */
export const SYMBOL_WATER = `<svg ${SYMBOL_BASE}><path d="M24 6c-6 10-14 16-14 24 0 8 6 12 14 12s14-4 14-12c0-8-8-14-14-24z"/><path d="M18 30c0-4 3-6 6-6s6 2 6 6"/><line x1="24" y1="30" x2="24" y2="36"/></svg>`;

/** Tourism & Hospitality — compass / sun */
export const SYMBOL_TOURISM = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="18"/><path d="M24 8L20 20l-12 4 12 4 4 12 4-12 12-4-12-4z"/><circle cx="24" cy="24" r="4"/></svg>`;

/** Education & Academic — graduation cap / book */
export const SYMBOL_EDUCATION = `<svg ${SYMBOL_BASE}><path d="M6 20l18-10 18 10-18 10z"/><path d="M14 24v6c0 4 4 8 10 8s10-4 10-8v-6"/><line x1="6" y1="20" x2="6" y2="34"/><line x1="42" y1="20" x2="42" y2="34"/></svg>`;

/** Real Estate & Property — house / building */
export const SYMBOL_REAL_ESTATE = `<svg ${SYMBOL_BASE}><path d="M8 26L24 8l16 18"/><line x1="12" y1="22" x2="12" y2="40"/><line x1="36" y1="22" x2="36" y2="40"/><rect x="14" y="30" width="20" height="10"/><rect x="18" y="34" width="6" height="6"/><line x1="24" y1="8" x2="24" y2="4"/></svg>`;

/** Aerospace & Aviation — rocket / wing */
export const SYMBOL_AEROSPACE = `<svg ${SYMBOL_BASE}><path d="M24 42c-4-8-6-16-6-24 0-6 2-10 6-14 4 4 6 8 6 14 0 8-2 16-6 24z"/><path d="M18 18l-8 4 8 4"/><path d="M30 18l8 4-8 4"/><path d="M22 30l2 6 2-6"/><circle cx="24" cy="18" r="4"/></svg>`;

/** Other / catch-all — folder / ellipsis */
export const SYMBOL_OTHER = `<svg ${SYMBOL_BASE}><rect x="8" y="12" width="32" height="26" rx="2"/><path d="M8 12l6-6h8l6 6"/><circle cx="18" cy="26" r="2"/><circle cx="24" cy="26" r="2"/><circle cx="30" cy="26" r="2"/></svg>`;

/**
 * Maps every FreeToolCategorySlug to its premium SVG symbol string.
 */
export const CATEGORY_SVG_SYMBOL: Record<FreeToolCategorySlug, string> = {
  "quality-six-sigma": SYMBOL_QUALITY,
  "technology-ai-cloud-cyber": SYMBOL_CHIP,
  "finance-sales-working-capital": SYMBOL_FINANCE,
  "electrical-power-systems": SYMBOL_ELECTRIC,
  "sustainability-resource-esg": SYMBOL_LEAF,
  "cnc-additive-manufacturing": SYMBOL_CNC,
  "metal-plastics-forming": SYMBOL_METAL,
  "process-chemical": SYMBOL_PROCESS,
  "hse-ergonomics": SYMBOL_HSE,
  "maintenance-reliability": SYMBOL_MAINTENANCE,
  "project-construction-management": SYMBOL_PROJECT,
  "workforce-hr": SYMBOL_WORKFORCE,
  "procurement-supply-chain": SYMBOL_PROCUREMENT,
  "food-cold-chain-hygiene": SYMBOL_FOOD,
  "lean-production": SYMBOL_LEAN,
  "textile-print-lab": SYMBOL_TEXTILE,
  "mechanical-hvac-energy-loss": SYMBOL_THERMAL,
  "packaging-local-business": SYMBOL_BOX,
  "global-compliance-trade": SYMBOL_GLOBE,
  "digital-factory-automation": SYMBOL_FACTORY,
  "mathematics-statistics": SYMBOL_MATH,
  "health-fitness-daily-life": SYMBOL_HEALTH,
  "conversion-measurement": SYMBOL_CONVERSION,
  "automotive-transport": SYMBOL_AUTOMOTIVE,
  "maritime-shipping": SYMBOL_MARITIME,
  "mining-geology": SYMBOL_MINING,
  "furniture-woodworking": SYMBOL_FURNITURE,
  "cleaning-facility": SYMBOL_CLEANING,
  "water-wastewater": SYMBOL_WATER,
  "tourism-hospitality": SYMBOL_TOURISM,
  "education-academic": SYMBOL_EDUCATION,
  "real-estate-property": SYMBOL_REAL_ESTATE,
  "aerospace-aviation": SYMBOL_AEROSPACE,
  other: SYMBOL_OTHER,
};

/**
 * Resolve the SVG symbol string for a given category slug.
 */
export function resolveCategorySvgSymbol(slug: string): string {
  return CATEGORY_SVG_SYMBOL[slug as FreeToolCategorySlug] ?? SYMBOL_OTHER;
}
