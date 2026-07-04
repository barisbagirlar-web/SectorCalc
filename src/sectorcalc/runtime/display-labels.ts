// SectorCalc V5.3.1 — Display Label Layer
// Display-only helpers that transform raw internal keys into human-readable text.
// Delegates to the existing pro-form/display-labels implementation.

export {
  getDisplayToolName,
  getDisplayCategoryLabel,
  getDisplayOperationLabel,
  formatDisplayKey,
} from "@/sectorcalc/pro-form/display-labels";

const KNOWN_ACRONYMS = new Set([
  "ROI", "ROIC", "NOPAT", "EBITDA", "EBIT", "CNC", "OEE",
  "USD", "EUR", "GBP", "ISO", "ASTM", "ACI", "EC3",
  "HVAC", "KPI", "PDF", "JSON", "FMEA", "RPN",
]);

export function preserveKnownAcronyms(value: string): string {
  if (!value) return value;
  let result = value;
  for (const acronym of KNOWN_ACRONYMS) {
    const regex = new RegExp(`\\b${acronym}\\b`, "gi");
    result = result.replace(regex, acronym);
  }
  return result;
}
