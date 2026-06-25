import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { getIndustryRegistryEntry } from "@/lib/tools/industry-registry";

/** Extra match terms per industry slug (EN only). */
const INDUSTRY_EXTRA_KEYWORDS: Partial<Record<IndustrySlug, readonly string[]>> = {
  "sheet-metal": [
    "sheet-metal",
    "metal",
    "laser",
    "bending",
    "cnc",
    "quote",
    "cost",
    "margin",
    "material",
    "waste",
    "fire",
    "scrap",
    "oee",
    "machine",
    "energy",
    "setup",
    "tolerance",
    "fastener",
    "welding",
    "sheet metal",
    "sheetmetal",
    "laser cutting",
    "bend",
    "gauge",
    "weight",
  ],
};

export function buildIndustryToolKeywords(industrySlug: IndustrySlug): readonly string[] {
  const entry = getIndustryRegistryEntry(industrySlug);
  const slugTerms = industrySlug.split("-").filter((part) => part.length > 1);
  const extra = INDUSTRY_EXTRA_KEYWORDS[industrySlug] ?? [];

  const fromRegistry = entry
    ? [
        entry.name,
        entry.description,
        entry.painStatement,
        ...entry.seoKeywords,
        entry.category,
      ]
    : [];

  const normalized = new Set<string>();
  for (const term of [...slugTerms, industrySlug, ...extra, ...fromRegistry]) {
    const trimmed = term.trim().toLowerCase();
    if (trimmed.length > 1) {
      normalized.add(trimmed);
    }
  }

  return Array.from(normalized);
}
