import type { ToolArchetype } from "@/lib/features/decision-engine/decision-engine-types";

/** Exact slug → primary archetype(s). Secondary tags resolved in resolver. */
export const SLUG_ARCHETYPE_MAP: Readonly<Record<string, readonly ToolArchetype[]>> = {
  "cnc-quote-risk-analyzer": ["cost-margin", "production-operations"],
  "concrete-volume-calculator": ["construction-field", "technical-measurement"],
  "compressor-leak-cost-calculator": ["energy-loss"],
  "employee-total-cost-calculator": ["finance-hr"],
  "pressure-vessel-wall-thickness-calculator": ["engineering-standard"],
  "bolt-tightening-torque-calculator": ["engineering-standard", "technical-measurement"],
  "welding-bid-risk-analyzer": ["cost-margin", "production-operations"],
  "sheet-metal-scrap-risk": ["quality-lean", "production-operations"],
  "logistics-route-loss": ["logistics-route", "cost-margin"],
  "oee-equipment-effectiveness-calculator": ["production-operations", "quality-lean"],
  "break-even-safety-margin-calculator": ["cost-margin", "finance-hr"],
  "quote-price-profit-margin-calculator": ["cost-margin"],
  "shop-rate-hourly-cost-calculator": ["cost-margin", "production-operations"],
  "machine-time-calculator": ["production-operations", "technical-measurement"],
  "machine-hour-estimator": ["production-operations", "cost-margin"],
  "project-cost-estimator": ["construction-field", "cost-margin"],
  "cleaning-cost-estimator": ["cost-margin", "finance-hr"],
  "food-cost-calculator": ["cost-margin", "finance-hr"],
  "menu-profit-leak-detector": ["cost-margin", "quality-lean"],
  "return-rate-profit-erosion-tool": ["cost-margin", "quality-lean"],
  "change-order-impact-analyzer": ["construction-field", "cost-margin"],
  "office-cleaning-bid-optimizer": ["cost-margin", "finance-hr"],
  "product-margin-calculator": ["cost-margin"],
  "cnc-minimum-safe-quote-analyzer": ["cost-margin", "production-operations"],
};

const CATEGORY_ARCHETYPE_MAP: Readonly<Record<string, ToolArchetype>> = {
  construction: "construction-field",
  manufacturing: "production-operations",
  energy: "energy-loss",
  logistics: "logistics-route",
  finance: "finance-hr",
  hr: "finance-hr",
  quality: "quality-lean",
  welding: "engineering-standard",
  structural: "engineering-standard",
  measurement: "technical-measurement",
  volume: "technical-measurement",
  area: "technical-measurement",
  margin: "cost-margin",
  pricing: "cost-margin",
  oee: "production-operations",
  lean: "quality-lean",
};

const KEYWORD_ARCHETYPE_HINTS: ReadonlyArray<{ pattern: RegExp; archetype: ToolArchetype }> = [
  { pattern: /concrete|mortar|brick|stair|roof|foundation|excavat/i, archetype: "construction-field" },
  { pattern: /compressor|energy|kwh|carbon|fuel|leak|peak/i, archetype: "energy-loss" },
  { pattern: /route|logistics|fuel|mile|km|delivery|deadhead/i, archetype: "logistics-route" },
  { pattern: /oee|scrap|fire|waste|yield|downtime|cycle.?time|machine.?time/i, archetype: "production-operations" },
  { pattern: /margin|quote|bid|price|profit|cost|break.?even|payroll|salary|tax/i, archetype: "cost-margin" },
  { pattern: /employee|personnel|hr|payroll|benefit|compliance/i, archetype: "finance-hr" },
  { pattern: /pressure|vessel|welding|bolt|thread|torque|gdt|steel.?section|asme|iso.?metric/i, archetype: "engineering-standard" },
  { pattern: /volume|area|length|width|height|diameter|radius|angle|measure/i, archetype: "technical-measurement" },
  { pattern: /quality|paf|lean|six.?sigma|defect/i, archetype: "quality-lean" },
];

export function resolveArchetypesFromSlug(slug: string): readonly ToolArchetype[] | undefined {
  const direct = SLUG_ARCHETYPE_MAP[slug];
  if (direct && direct.length > 0) {
    return direct;
  }
  return undefined;
}

export function resolveArchetypeFromCategory(category: string | undefined): ToolArchetype | undefined {
  if (!category) {
    return undefined;
  }
  const normalized = category.trim().toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_ARCHETYPE_MAP[normalized];
}

export function resolveArchetypeFromKeywords(slug: string, sector?: string): ToolArchetype | undefined {
  const haystack = `${slug} ${sector ?? ""}`.toLowerCase();
  for (const hint of KEYWORD_ARCHETYPE_HINTS) {
    if (hint.pattern.test(haystack)) {
      return hint.archetype;
    }
  }
  return undefined;
}

export function primaryArchetype(archetypes: readonly ToolArchetype[]): ToolArchetype {
  return archetypes[0] ?? "generic";
}
