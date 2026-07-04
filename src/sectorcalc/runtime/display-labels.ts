const KNOWN_ACRONYMS = new Set([
  "ROI",
  "ROIC",
  "NOPAT",
  "EBITDA",
  "EBIT",
  "CNC",
  "OEE",
  "USD",
  "EUR",
  "GBP",
  "ISO",
  "ASTM",
  "ACI",
  "EC3",
  "HVAC",
  "KPI",
  "PDF",
  "JSON",
  "FMEA",
  "RPN",
  "PB",
]);

const ACRONYM_ALIASES: Record<string, string> = {
  roi: "ROI",
  roic: "ROIC",
  nopat: "NOPAT",
  ebitda: "EBITDA",
  ebit: "EBIT",
  cnc: "CNC",
  oee: "OEE",
  usd: "USD",
  eur: "EUR",
  gbp: "GBP",
  iso: "ISO",
  astm: "ASTM",
  aci: "ACI",
  ec3: "EC3",
  hvac: "HVAC",
  kpi: "KPI",
  pdf: "PDF",
  json: "JSON",
  fmea: "FMEA",
  rpn: "RPN",
  pb: "PB",
};

function toWords(value: string): string[] {
  return value
    .replace(/[_/]+/g, "-")
    .split("-")
    .flatMap((part) => part.split(/\s+/))
    .map((part) => part.trim())
    .filter(Boolean);
}

function titleWord(word: string): string {
  const lower = word.toLowerCase();

  if (ACRONYM_ALIASES[lower]) {
    return ACRONYM_ALIASES[lower];
  }

  const upper = word.toUpperCase();
  if (KNOWN_ACRONYMS.has(upper)) {
    return upper;
  }

  if (/^\d+$/.test(word)) {
    return word;
  }

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatDisplayKey(value: unknown, separator = " "): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  return toWords(trimmed).map(titleWord).join(separator);
}

export function formatCategoryLabel(value: unknown): string {
  if (typeof value !== "string") return "General";
  const trimmed = value.trim();
  if (!trimmed) return "General";
  return formatDisplayKey(trimmed, " · ");
}

export function getDisplayToolName(schema: Record<string, unknown>, slug: string): string {
  const direct = schema.tool_name ?? schema.toolName ?? schema.title ?? schema.name;

  if (typeof direct === "string" && direct.trim()) {
    return formatDisplayKey(direct);
  }

  return formatDisplayKey(slug);
}

export function getDisplayCategoryLabel(schema: Record<string, unknown>): string {
  const direct =
    schema.category_label ??
    schema.categoryLabel ??
    schema.category_name ??
    schema.categoryName ??
    schema.category;

  return formatCategoryLabel(direct);
}

export function getDisplayOperationLabel(schema: Record<string, unknown>): string {
  const direct =
    schema.primary_operation ??
    schema.primaryOperation ??
    schema.operation ??
    schema.operation_key ??
    schema.operationKey;

  const label = formatDisplayKey(direct);
  return label || "Calculate";
}

export function isRawSlugLike(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+){1,}$/.test(value.trim());
}

export function isRawCategoryKeyLike(value: string): boolean {
  return /^[a-z]+(?:-[a-z]+){2,}$/.test(value.trim());
}
