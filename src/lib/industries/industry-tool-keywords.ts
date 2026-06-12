import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { getIndustryRegistryEntry } from "@/lib/tools/industry-registry";

/** Extra match terms per industry slug (EN + TR where useful). */
const INDUSTRY_EXTRA_KEYWORDS: Partial<Record<IndustrySlug, readonly string[]>> = {
  "sheet-metal": [
    "sheet-metal",
    "sac-metal",
    "sac metal",
    "sac metal imalatı",
    "metal",
    "laser",
    "lazer kesim",
    "bending",
    "büküm",
    "cnc",
    "quote",
    "teklif",
    "cost",
    "maliyet",
    "margin",
    "marj",
    "material",
    "malzeme",
    "waste",
    "fire",
    "scrap",
    "oee",
    "machine",
    "makine saati",
    "energy",
    "enerji",
    "setup",
    "hazırlık",
    "tolerance",
    "tolerans",
    "fastener",
    "bağlantı",
    "welding",
    "kaynak",
    "sheet metal",
    "sheetmetal",
    "laser cutting",
    "bend",
    "gauge",
    "weight",
    "ağırlık",
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
