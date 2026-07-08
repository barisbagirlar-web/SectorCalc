// SectorCalc SuperV4 — Display Label Normalization Layer
// UI-only helpers: transform raw internal keys into human-readable text.
// NEVER used for resolver matching, formula bindings, or schema identity.
// NEVER mutates tool_key, input IDs, or any non-display field.

const KNOWN_ACRONYMS = new Set([
  "ROI", "ROIC", "NOPAT", "EBITDA", "EBIT", "CNC", "OEE",
  "USD", "EUR", "GBP", "ISO", "ASTM", "ACI", "EC3",
  "HVAC", "KPI", "PDF", "JSON", "FMEA", "RPN", "RSU",
  "ESOP", "ESPP", "DCF", "WACC", "CAGR", "NPV", "IRR",
  "ROE", "ROA", "EVA", "PE", "PB", "PS", "EV",
  "VSWR", "SQNR", "PID", "RLC", "LED", "LCD", "SLA",
  "API", "ERP", "CRM", "SEO", "ATS", "EDI", "SCM",
]);

const KNOWN_CATEGORY_LABELS: Record<string, string> = {
  "everyday-life": "Everyday Life",
  "finance-sales-working-capital": "Finance · Sales · Working Capital",
  "construction-measurement": "Construction · Measurement",
  "manufacturing-production": "Manufacturing · Production",
  "energy-sustainability": "Energy · Sustainability",
  "agriculture-food": "Agriculture · Food",
  "logistics-supply-chain": "Logistics · Supply Chain",
  "quality-six-sigma": "Quality · Six Sigma",
  "digital-factory-automation": "Digital Factory · Automation",
  "hvac-mechanical": "HVAC · Mechanical Systems",
  "electrical-power": "Electrical · Power Systems",
  "food-cold-chain": "Food · Cold Chain · Hygiene",
  "textile-printing-lab": "Textile · Printing · Lab",
  "hse-ergonomics": "HSE · Ergonomics",
  "mechanical-hvac-energy-loss": "Mechanical · HVAC · Energy",
  "business-operations": "Business · Operations",
  "general": "General",
};

const KNOWN_OPERATION_LABELS: Record<string, string> = {
  "calculate": "Calculate",
  "estimate": "Estimate",
  "analyze": "Analyze",
  "evaluate": "Evaluate",
  "compare": "Compare",
  "optimize": "Optimize",
  "design": "Design",
  "check": "Check",
  "verify": "Verify",
  "assess": "Assess",
  "forecast": "Forecast",
  "plan": "Plan",
  "simulate": "Simulate",
  "convert": "Convert",
  "size": "Size",
  "select": "Select",
};

/**
 * Transform a kebab-case/snake_case key into human-readable text.
 * Preserves known acronyms (ROI, EBITDA, CNC, etc.).
 *
 * Examples:
 *   roic-calculator       -> ROIC Calculator
 *   equity-dilution       -> Equity Dilution
 *   pb-ratio-calculator   -> PB Ratio Calculator
 *   finance-sales-capital -> Finance Sales Capital
 *   calculate             -> Calculate
 *   some_field_key        -> Some Field Key
 */
export function formatDisplayKey(value: string): string {
  if (!value) return "";

  // Split on hyphens, underscores, or spaces
  const parts = value.split(/[-_\s]+/).filter(Boolean);

  const formatted = parts.map((part) => {
    const upper = part.toUpperCase();
    if (KNOWN_ACRONYMS.has(upper)) return upper;
    // Capitalize first letter, lowercase rest
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });

  return formatted.join(" ");
}

/**
 * Get a human-readable tool name from the schema.
 * Preferred source is schema.tool_name (string).
 * Falls back to formatting the tool_key.
 * NEVER returns raw slug as-is.
 */
export function getDisplayToolName(toolName: string | null | undefined, toolKey: string): string {
  if (toolName && typeof toolName === "string" && toolName.trim()) {
    const formatted = formatDisplayKey(toolName);
    // If the formatted result still looks like a raw slug (contains hyphens/underscores), run through formatDisplayKey
    if (/[-_]/.test(toolName)) return formatDisplayKey(toolName);
    return formatted;
  }
  // Fallback: format the tool_key (never show raw slug)
  return formatDisplayKey(toolKey);
}

/**
 * Get a human-readable category label.
 */
export function getDisplayCategoryLabel(category: string | null | undefined): string {
  if (!category) return "General";
  const lower = category.toLowerCase().trim();
  if (KNOWN_CATEGORY_LABELS[lower]) return KNOWN_CATEGORY_LABELS[lower];
  // Fallback: format the raw key
  return formatDisplayKey(lower);
}

/**
 * Get a human-readable operation label.
 */
export function getDisplayOperationLabel(operation: string | null | undefined): string {
  if (!operation) return "Calculate";
  const lower = operation.toLowerCase().trim();
  if (KNOWN_OPERATION_LABELS[lower]) return KNOWN_OPERATION_LABELS[lower];
  return formatDisplayKey(lower);
}

/**
 * Format a label-value pair with proper spacing.
 * Ensures label text and value text are always separated.
 */
export function formatLabelValue(label: string, value: string): { label: string; value: string } {
  return { label, value };
}

/**
 * Map internal unit tokens to human-readable labels.
 */
export const UNIT_DISPLAY_LABELS: Record<string, string> = {
  display_currency: "Currency",
  currency: "Currency",
  fraction: "Ratio",
  index: "Index",
  s: "seconds",
  min: "minutes",
  h: "hours",
  day: "days",
  month: "months",
  year: "years",
  kg: "kg",
  m: "m",
  mm: "mm",
  cm: "cm",
  m2: "m²",
  m3: "m³",
  kw: "kW",
  kwh: "kWh",
  rpm: "rpm",
  pct: "%",
  percent: "%",
  ratio: "Ratio",
  usd: "USD",
  currency_unit: "Currency",
  currency_unit_per_h: "Currency/h",
  unit_per_s: "units/s",
};

/**
 * Transform a raw token (e.g. n_thickness_mm, display_currency) into human-readable form.
 */
export function humanizeToken(value: string): string {
  if (!value) return "";
  return value
    .replace(/^n_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Get a human-readable unit label.
 */
export function getDisplayUnitLabel(unit: string): string {
  if (!unit) return "";
  return UNIT_DISPLAY_LABELS[unit] ?? humanizeToken(unit);
}

/**
 * Transform a raw enum value into human-readable text.
 * Special-cases known long enum keys like DECISION_SUPPORT_ONLY_NOT_CERTIFICATION.
 */
export function humanizeEnum(value: string): string {
  if (!value) return "";
  return value
    .replace(/^DECISION_SUPPORT_ONLY_NOT_CERTIFICATION$/, "Decision support only \u2014 not certification")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Check if a string is a known raw internal key (kebab-case, snake_case).
 */
export function isRawInternalKey(value: string): boolean {
  if (!value) return false;
  return /[-_]/.test(value) || /^[a-z]{2,}(?:[-_][a-z0-9]+)+$/.test(value);
}
