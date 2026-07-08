// SectorCalc V5.4 — Public Tool Copy Adapter
// Single source of truth for ALL customer-facing copy.
// No raw schema/scope/jargon leaks through this layer.
// All public surfaces must use this adapter, never raw schema fields.

// ── Forbidden public jargon patterns ──────────────────────────────────────────
const FORBIDDEN_PUBLIC_JARGON_PATTERNS = [
  /\bSuperV\d+\b/gi,
  /single-operation[-\s]+decision[-\s]+support[-\s]+schema/gi,
  /schema\s+for\s+screening/gi,
  /audit\s+evidence\s+and\s+commercial\s+risk\s+interpretation/gi,
  /Free\s+industrial\s+decision[- /]support\s+calculator/gi,
  /formula-free\s+decision\s+support/gi,
  /raw\s+schema\s+scope/gi,
  /raw\s+variable-driven\s+description/gi,
];

/** True if text contains any forbidden public jargon. */
export function containsForbiddenPublicJargon(text: string): boolean {
  return FORBIDDEN_PUBLIC_JARGON_PATTERNS.some((p) => p.test(text));
}

/** Strip all forbidden jargon from text — safe fallback, not primary path. */
export function stripPublicJargon(text: string): string {
  let result = text;
  for (const pattern of FORBIDDEN_PUBLIC_JARGON_PATTERNS) {
    result = result.replace(pattern, "");
  }
  result = result.replace(/\s{2,}/g, " ").replace(/\s+\./g, ".").trim();
  return result;
}

// ── Known tool copy database ─────────────────────────────────────────────────
// Maps tool_key -> clean public copy for all surfaces.
// This is the authoritative source. Schema data is NEVER used directly.

interface ToolPublicCopy {
  title: string;
  metaDescription: string;
  heroDescription: string;
  catalogTitle: string;
}

const KNOWN_TOOL_COPY: Record<string, ToolPublicCopy> = {
  "knurling-drill-point-depth": {
    title: "Knurling & Drill Point Depth",
    metaDescription:
      "Estimate drill point depth and knurling-related shop-floor dimensions using simple machining inputs. Use this quick check before final process validation.",
    heroDescription:
      "Estimate drill point depth and knurling-related shop-floor dimensions using simple machining inputs. Use this quick calculator for early checks before final process validation.",
    catalogTitle: "Knurling & Drill Point Depth",
  },
  "beam-load-deflection-quick-check": {
    title: "Beam Load & Deflection Quick Check",
    metaDescription:
      "Estimate beam deflection and load capacity for simple structural members. Use for early-stage design checks before detailed structural analysis.",
    heroDescription:
      "Estimate beam deflection and load capacity for simple structural members. Use this quick check before final structural validation.",
    catalogTitle: "Beam Load & Deflection Quick Check",
  },
  "break-even-and-margin-of-safety-analysis": {
    title: "Break-Even & Margin of Safety Analysis",
    metaDescription:
      "Find how many units you must sell to cover costs and how much sales buffer you have. Quick break-even analysis for pricing and planning.",
    heroDescription:
      "Find how many units you must sell to cover costs and how much sales buffer you have. Use this calculator for quick break-even checks before pricing decisions.",
    catalogTitle: "Break-Even & Margin of Safety Analysis",
  },
};

// ── Fallback: derive clean copy from tool key + name + category ──────────────

function cleanToolName(name: string): string {
  return name
    .replace(/ Quick Calculator$/i, "")
    .replace(/ Calculator$/i, "")
    .replace(/ Quick Check$/i, "")
    .trim();
}

function fallbackTitle(toolKey: string, schemaName: string): string {
  return toolKey
    .split(/[-_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function fallbackMetaDescription(toolName: string, category: string): string {
  const clean = cleanToolName(toolName);
  const cat = (category || "industrial").toLowerCase();
  return `Calculate ${clean.toLowerCase()} using simple ${cat} inputs. Quick, browser-first estimate for early checks before detailed analysis.`;
}

function fallbackHeroDescription(toolName: string, category: string): string {
  const clean = cleanToolName(toolName);
  const cat = (category || "industrial").toLowerCase();
  return `Estimate ${clean.toLowerCase()} using simple ${cat} inputs. Use this quick calculator for early checks before final process validation.`;
}

// ── Public API ───────────────────────────────────────────────────────────────

function normalizeKey(toolKey: string): string {
  return toolKey.replace(/[_-]/g, "-").toLowerCase();
}

/** Get the public display title for a tool (no "Quick Calculator" suffix). */
export function getPublicToolTitle(toolKey: string, schemaName: string): string {
  const key = normalizeKey(toolKey);
  const known = KNOWN_TOOL_COPY[key];
  if (known) return known.title;
  return cleanToolName(schemaName) || fallbackTitle(toolKey, schemaName);
}

/** Get the meta description for a tool page (for SEO / Google snippet). */
export function getPublicToolMetaDescription(
  toolKey: string,
  schemaName: string,
  category: string,
): string {
  const key = normalizeKey(toolKey);
  const known = KNOWN_TOOL_COPY[key];
  if (known) return known.metaDescription;
  return fallbackMetaDescription(schemaName, category);
}

/** Get the hero description shown on the tool detail page. */
export function getPublicToolHeroDescription(
  toolKey: string,
  schemaName: string,
  category: string,
): string {
  const key = normalizeKey(toolKey);
  const known = KNOWN_TOOL_COPY[key];
  if (known) return known.heroDescription;
  return fallbackHeroDescription(schemaName, category);
}

/** Get the catalog card title for a tool listing page. */
export function getPublicCatalogTitle(toolKey: string, schemaName: string): string {
  const key = normalizeKey(toolKey);
  const known = KNOWN_TOOL_COPY[key];
  if (known) return known.catalogTitle;
  return cleanToolName(schemaName);
}

// ── Field help text ──────────────────────────────────────────────────────────

const GENERIC_HELP_PATTERNS = [
  "enter the verified shop-floor value",
  "reference ranges are advisory only",
  "enter the verified",
];

/** True if help text is the generic schema fallback with no useful guidance. */
export function isGenericHelpText(text: string | null | undefined): boolean {
  if (!text) return true;
  const lower = text.toLowerCase().trim();
  return GENERIC_HELP_PATTERNS.some((p) => lower.includes(p)) || lower.length < 15;
}

/** Derive a meaningful field description from the field name and context. */
export function deriveFieldHelpText(
  fieldName: string,
  _toolKey?: string,
  _unit?: string | null,
): string {
  const name = fieldName.toLowerCase();
  if (name.includes("diameter") || name.includes("drill"))
    return `Enter the ${fieldName} used for the operation.`;
  if (name.includes("angle") || name.includes("point angle"))
    return "Enter the included point angle.";
  if (name.includes("length") || name.includes("depth"))
    return `Enter the ${fieldName} dimension.`;
  if (name.includes("cost") || name.includes("price") || name.includes("rate"))
    return `Enter the ${fieldName} value.`;
  if (name.includes("speed") || name.includes("rpm") || name.includes("feed"))
    return `Enter the ${fieldName} for the operation.`;
  if (name.includes("width") || name.includes("height") || name.includes("thickness"))
    return `Enter the ${fieldName} dimension.`;
  if (name.includes("weight") || name.includes("mass") || name.includes("density"))
    return `Enter the ${fieldName} value.`;
  if (name.includes("time") || name.includes("hours") || name.includes("minutes"))
    return `Enter the ${fieldName}.`;
  if (name.includes("quantity") || name.includes("count") || name.includes("volume"))
    return `Enter the ${fieldName}.`;
  if (
    name.includes("efficiency") ||
    name.includes("factor") ||
    name.includes("ratio")
  )
    return `Enter the ${fieldName}. Use decimal format (e.g. 0.85 for 85%).`;
  return `Enter the ${fieldName} value.`;
}

// ── Pro tool description ─────────────────────────────────────────────────────

/** Generate a clean pro tool description for metadata. */
export function getPublicProMetaDescription(
  toolKey: string,
  schemaName: string,
  category: string,
): string {
  const cat = (category || "industrial").toLowerCase();
  const clean = cleanToolName(schemaName);
  return `Professional ${cat} tool: ${clean}. Deterministic, auditable calculation with server-side execution for decision reports.`;
}

/** Generate a clean pro tool hero description. */
export function getPublicProHeroDescription(
  toolKey: string,
  schemaName: string,
  category: string,
): string {
  const cat = (category || "industrial").toLowerCase();
  const clean = cleanToolName(schemaName);
  return `Professional ${cat} analysis using ${clean.toLowerCase()} inputs. Use the result as a decision-support report for commercial and engineering review.`;
}
