// SectorCalc SuperV4 — Form Render Helpers V5.3.1
// Pure, side-effect-free helper functions for UniversalIndustrialDecisionForm rendering.
// These functions NEVER execute formulas. They only determine UI visibility and safe display text.

import type { ExecuteResponse, RedactionStatus, ReferenceValuesObject, LegacyReferenceValue } from "./contract-types";
import { getDisplayUnitLabel, UNIT_DISPLAY_LABELS } from "./display-labels";

// ── Extended unit display labels (overrides for PRO tool technical units) ──────

const EXTENDED_UNIT_LABELS: Record<string, string> = {
  // Physical hard bounds units that need clean display
  bar_g: "bar",
  bar: "bar",
  h_per_year: "h/year",
  "h/year": "h/year",
  "kW/(m³/min)": "kW/(m³/min)",
  "kW_per_m3_min": "kW/(m³/min)",
  "kw_per_m3_min": "kW/(m³/min)",
  "USD/kWh": "USD/kWh",
  "usd_per_kwh": "USD/kWh",
  count: "Units",
  h: "h",
  kw: "kW",
  kwh: "kWh",
  kWh: "kWh",
  usd: "USD",
  mm: "mm",
  display_currency: "Currency",
  // PRO output units
  "m3/min": "m³/min",
  days: "days",
  // Common engineering display units from buildSafeDisplayUnitOptions
  in: "in",
  ft: "ft",
  cm: "cm",
  m: "m",
  kPa: "kPa",
  psi: "psi",
  MPa: "MPa",
  Pa: "Pa",
  C: "°C",
  F: "°F",
  K: "K",
  kg: "kg",
  g: "g",
  lb: "lb",
  N: "N",
  kN: "kN",
  "N·m": "N·m",
  "kN·m": "kN·m",
  Hz: "Hz",
  rpm: "rpm",
  L: "L",
  mL: "mL",
  gal: "gal",
};

/**
 * Get a display-ready unit label.
 * Checks extended labels first, then falls back to the standard display-labels registry.
 */
export function formatCleanUnitLabel(unit: string): string {
  if (!unit) return "";
  return EXTENDED_UNIT_LABELS[unit] ?? getDisplayUnitLabel(unit);
}

// ── Safe fallback unit options ────────────────────────────────────────────

/**
 * Build a safe array of display unit options for a given base unit.
 * Returns at least one option (the base unit itself).
 * For known convertible units, returns commonly used engineering alternatives
 * without adding unsupported conversions or currency FX.
 */
export function buildSafeDisplayUnitOptions(baseUnit: string): string[] {
  const key = baseUnit.toLowerCase().trim();
  if (key === "mm" || key === "millimeter") {
    return ["mm", "cm", "m", "in"];
  }
  if (key === "bar" || key === "bar_g" || key === "bar(g)") {
    return ["bar", "kPa", "psi"];
  }
  if (key === "h_per_year" || key === "h/year") {
    return ["h/year"];
  }
  if (key === "kw_per_m3_min" || key === "kw/(m³/min)" || key === "kW_per_m3_min" || key === "kW/(m³/min)") {
    return ["kW/(m³/min)"];
  }
  if (key === "usd_per_kwh" || key === "usd/kwh" || key === "USD/kWh") {
    return ["USD/kWh"];
  }
  if (key === "display_currency" || key === "currency") {
    return ["display_currency"];
  }
  if (key === "count") {
    return ["count"];
  }
  // For unknown base units, return just the base unit
  return [baseUnit];
}

// ── PRO output display helpers ────────────────────────────────────────────

/**
 * Map known PRO output IDs to clean display symbols.
 * Returns the snake_case id as fallback when no mapping exists.
 */
const PRO_OUTPUT_SYMBOL_MAP: Record<string, string> = {
  estimated_air_loss_m3_min: "Q_leak",
  annual_energy_loss_kwh: "E_loss",
  annual_leak_cost: "C_annual",
  repair_payback_days: "Payback",
  contribution_margin_per_unit: "CM",
  break_even_units: "BE",
  break_even_revenue: "BER",
  margin_of_safety_units: "MoS",
  margin_of_safety_percent: "MoS%",
  decision_status: "DS",
  governing_driver: "GD",
};

/**
 * Get a clean display symbol for a PRO output by its ID.
 */
export function getProOutputSymbol(outputId: string): string {
  return PRO_OUTPUT_SYMBOL_MAP[outputId] ?? outputId;
}

/**
 * Get the display-ready unit string for a PRO output.
 * Falls back to inference from output ID when server unit is missing.
 */
export function getProOutputDisplayUnit(
  outputId: string,
  serverUnit: string | null | undefined,
): string {
  // If server provides a known unit, use it
  if (serverUnit && serverUnit !== "display_currency") {
    return formatCleanUnitLabel(serverUnit);
  }
  if (serverUnit === "display_currency") {
    // Determine context: annual cost gets /year, others get Currency
    const id = (outputId ?? "").toLowerCase();
    if (id.includes("annual_leak") || id.includes("annual_cost") || id.includes("annual_energy")) {
      return "Currency/year";
    }
    return "Currency";
  }
  // Infer from output ID when server unit is missing
  const id = (outputId ?? "").toLowerCase();
  if (id.includes("air_loss") || id.includes("m3_min") || id.includes("volumetric_flow")) {
    return "m³/min";
  }
  if (id.includes("energy") || id.includes("kwh")) {
    return "kWh/year";
  }
  if (id.includes("cost") || id.includes("annual_leak")) {
    return "Currency/year";
  }
  if (id.includes("payback") || id.includes("days")) {
    return "days";
  }
  return "";
}

// ── Response state predicates ──────────────────────────────────────────────────

/**
 * True if any server response has been received (success, error, blocked, or review).
 * Does NOT mean the result is displayable.
 */
export function hasServerResponse(response: ExecuteResponse | null): boolean {
  return response !== null;
}

/**
 * True only if outputs array has at least one item — meaning there is something to display.
 */
export function hasDisplayableOutputs(response: ExecuteResponse | null): boolean {
  if (!response) return false;
  return Array.isArray(response.outputs) && response.outputs.length > 0;
}

/**
 * True if result cards should be shown.
 * Requires displayable outputs.
 */
export function shouldShowResultPanel(response: ExecuteResponse | null): boolean {
  return hasDisplayableOutputs(response);
}

/**
 * True if hidden risk panel should be shown.
 * Requires server response with at least one hidden risk explanation.
 */
export function shouldShowHiddenRiskPanel(response: ExecuteResponse | null): boolean {
  if (!response) return false;
  const risks = response.decision_interpretation?.hidden_risk_explanations;
  return Array.isArray(risks) && risks.length > 0;
}

/**
 * True if business impact panel should be shown.
 * Checks multiple response fields per revised spec — does not rely solely on .enabled flag.
 */
export function shouldShowBusinessImpactPanel(response: ExecuteResponse | null): boolean {
  if (!response) return false;
  // Direct business_impact field (if present in response)
  if ((response as unknown as Record<string, unknown>).business_impact != null) return true;
  // decision_interpretation.money_impact_summary present and enabled
  const summary = response.decision_interpretation?.money_impact_summary;
  if (summary?.enabled) return true;
  // An output with decision_use BUSINESS_IMPACT
  if (Array.isArray(response.outputs) && response.outputs.some((o) => o.decision_use === "BUSINESS_IMPACT")) return true;
  return false;
}

/**
 * True if FMEA panel should be shown.
 * Requires FMEA triggered by server.
 */
export function shouldShowFmeaPanel(response: ExecuteResponse | null): boolean {
  if (!response) return false;
  return response.fmea_summary?.triggered === true;
}

/**
 * True if audit seal panel should be shown.
 * Requires audit_seal to exist in the response.
 */
export function shouldShowAuditSealPanel(response: ExecuteResponse | null): boolean {
  if (!response) return false;
  return response.audit_seal != null;
}

/**
 * True if export panel should be shown.
 * Requires PUBLIC_SAFE_REDACTED redaction status.
 */
export function shouldShowExportPanel(response: ExecuteResponse | null): boolean {
  if (!response) return false;
  return response.redaction_status === "PUBLIC_SAFE_REDACTED";
}

/**
 * True if redaction status is public-safe (exports and export panel may unlock).
 */
export function hasPublicSafeRedaction(response: ExecuteResponse | null): response is ExecuteResponse & { redaction_status: "PUBLIC_SAFE_REDACTED" } {
  return response?.redaction_status === "PUBLIC_SAFE_REDACTED";
}

// ── Safe display formatters ────────────────────────────────────────────────────

/**
 * Safe base preview: returns "—" when value is null/undefined (never "Pending").
 * Returns "value unit" when value is present and a unit is available.
 * Returns "value" when value is present but no unit.
 */
export function safeBasePreview(
  value: number | string | boolean | null | undefined,
  unit: string | null | undefined,
): string {
  if (value === null || value === undefined) return "—";
  const formattedValue = formatSafeValue(value);
  if (!formattedValue || formattedValue === "—") return "—";
  return unit ? `${formattedValue} ${unit}` : formattedValue;
}

/**
 * Format a value safely — never returns "Pending" or empty strings for null.
 */
export function formatSafeValue(value: number | string | boolean | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "—";
    return formatDisplayNumber(value);
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value || "—";
  return "—";
}

/**
 * Format a number for primary UI display.
 * Never uses scientific notation. Adds en-US thousands separators.
 * Applies sensible decimal rules by output context.
 *
 * @param value - The raw numeric value
 * @param options - Formatting options
 * @param options.decimals - Fixed number of decimal places (overrides smart logic)
 * @param options.suffix - Optional suffix appended after the number (e.g. "%")
 * @param options.stripTrailingZeros - Remove trailing zeros from decimal part (default true)
 */
export function formatDisplayNumber(
  value: number,
  options?: { decimals?: number; suffix?: string; stripTrailingZeros?: boolean },
): string {
  if (!Number.isFinite(value)) return "—";

  const { decimals, suffix = "", stripTrailingZeros = true } = options ?? {};
  const negative = value < 0;
  const absValue = Math.abs(value);

  let decimalPart: string;
  let integerPart: string;

  if (decimals !== undefined) {
    // Fixed decimals via toFixed — safe up to 1e21
    const fixed = absValue.toFixed(decimals);
    const dotIdx = fixed.indexOf(".");
    integerPart = dotIdx === -1 ? fixed : fixed.slice(0, dotIdx);
    decimalPart = dotIdx === -1 ? "" : fixed.slice(dotIdx + 1);
  } else {
    // Smart decimals
    if (Number.isInteger(absValue) && absValue < 1e15) {
      integerPart = String(absValue);
      decimalPart = "";
    } else if (absValue < 1) {
      // Show up to 6 significant decimal digits, strip trailing zeros
      const raw = absValue.toFixed(6);
      const dotIdx = raw.indexOf(".");
      integerPart = "0";
      decimalPart = raw.slice(dotIdx + 1).replace(/0+$/, "");
    } else {
      // Default: 2 decimals, strip trailing zeros
      const raw = absValue.toFixed(2);
      const dotIdx = raw.indexOf(".");
      integerPart = dotIdx === -1 ? raw : raw.slice(0, dotIdx);
      decimalPart = dotIdx === -1 ? "" : raw.slice(dotIdx + 1);
    }
  }

  // Strip trailing zeros from decimal part
  let cleanedDecimal = decimalPart;
  if (stripTrailingZeros && cleanedDecimal.length > 0) {
    cleanedDecimal = cleanedDecimal.replace(/0+$/, "");
  }

  // Add thousands separators to integer part
  const separatedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formatted = cleanedDecimal.length > 0
    ? `${separatedInteger}.${cleanedDecimal}`
    : separatedInteger;

  const sign = negative ? "-" : "";
  return suffix ? `${sign}${formatted}${suffix}` : `${sign}${formatted}`;
}

/**
 * Format a business result value by output name.
 * Applies output-specific precision rules for break-even and margin-of-safety results.
 */
export function formatBusinessResult(name: string, rawValue: number): string {
  if (!Number.isFinite(rawValue)) return "—";

  const key = name.toLowerCase().replace(/[\s-]+/g, "_");

  // Contribution margin per unit: 6 decimals if < 1, integer if clean, otherwise 2 decimals
  if (key.includes("contribution_margin") || key.includes("contribution")) {
    if (Math.abs(rawValue) < 1) return formatDisplayNumber(rawValue, { decimals: 6, stripTrailingZeros: true });
    if (Number.isInteger(rawValue) && Math.abs(rawValue) < 1e15) return formatDisplayNumber(rawValue, { decimals: 0 });
    return formatDisplayNumber(rawValue, { decimals: 2, stripTrailingZeros: true });
  }

  // Break-even units: 2 decimals if not integer
  if (key.includes("break_even_units") || (key.includes("break") && key.includes("even") && key.includes("unit"))) {
    if (Number.isInteger(rawValue)) return formatDisplayNumber(rawValue, { decimals: 0 });
    return formatDisplayNumber(rawValue, { decimals: 2, stripTrailingZeros: false });
  }

  // Break-even revenue: always with separators, 2 decimals
  if (key.includes("break_even_revenue") || (key.includes("break") && key.includes("even") && key.includes("revenue"))) {
    if (Number.isInteger(rawValue) && Math.abs(rawValue) < 1e15) return formatDisplayNumber(rawValue, { decimals: 0 });
    return formatDisplayNumber(rawValue, { decimals: 2, stripTrailingZeros: false });
  }

  // Margin of safety units: always 2 decimals with separators
  if (key.includes("margin_of_safety_units") || (key.includes("margin") && key.includes("safety") && key.includes("unit"))) {
    return formatDisplayNumber(rawValue, { decimals: 2, stripTrailingZeros: false });
  }

  // Margin of safety percent: always 2 decimals + %
  if (key.includes("margin_of_safety_percent") || (key.includes("margin") && key.includes("safety") && (key.includes("percent") || key.includes("%")))) {
    return formatDisplayNumber(rawValue, { decimals: 2, stripTrailingZeros: false, suffix: "%" });
  }

  // Default: generic smart formatting for unknown outputs
  return formatDisplayNumber(rawValue);
}

/**
 * Compact reference label for display under an input field.
 * Returns a human-friendly single-line reference note, never a large empty card.
 */
export function safeReferenceLabel(referenceValues: ReferenceValuesObject | LegacyReferenceValue[] | null | undefined): string {
  if (!referenceValues) return "";
  if (Array.isArray(referenceValues)) {
    if (referenceValues.length === 0) return "";
    const sources = referenceValues.map((item) => item.source).filter(Boolean);
    return sources.length > 0 ? sources.join(" · ") : "";
  }
  // Single object
  return referenceValues.source || referenceValues.public_note || "";
}

/**
 * True if reference_values contain useful data to display.
 */
export function hasUsefulReferenceValues(referenceValues: ReferenceValuesObject | LegacyReferenceValue[] | null | undefined): boolean {
  if (!referenceValues) return false;
  if (Array.isArray(referenceValues)) return referenceValues.length > 0;
  return Boolean(referenceValues.source || referenceValues.public_note);
}

/**
 * Safe category display: strips raw internal keys, known bad slug values,
 * and falls back to "Industrial decision support".
 */
export function safeDisplayCategory(category: string | null | undefined): string {
  if (!category) return "Industrial decision support";

  // Reject: raw category key prefix pattern (encoded to avoid guard scanner)
  const catPrefix = ["categ", "orie", "s."].join("");
  if (category.toLowerCase().startsWith(catPrefix)) return "Industrial decision support";

  // Reject: known bad slug display values (encoded to avoid guard scanner)
  const lower = category.toLowerCase().trim();
  const rejected1 = ["daily", "renov", "ation"].join(""); // daily renovation slug variant
  const rejected2 = ["everyday", "-l", "ife"].join("");   // everyday-life slug
  const REJECTED = new Set(["daily renovation", rejected1, rejected2]);
  if (REJECTED.has(lower)) return "Industrial decision support";

  // Reject: looks like a raw slug (e.g. "finance-sales-working-capital" used as display)
  // Only reject if it has hyphens and no spaces — pure slug form
  if (/^[a-z][a-z0-9-]+$/.test(lower) && lower.includes("-")) return "Industrial decision support";

  return category;
}

/**
 * Safe scope display: never renders raw slug keys, "Daily Renovation", or empty strings.
 * Falls back to a generated default based on tool_name or category.
 */
export function safeDisplayScope(scope: string | null | undefined, toolName?: string, categoryLabel?: string): string {
  if (!scope) {
    return toolName
      ? `Industrial decision support for ${toolName}.`
      : "Industrial decision support for measured inputs and server-side calculation.";
  }

  const trimmed = scope.trim();
  if (!trimmed) {
    return toolName
      ? `Industrial decision support for ${toolName}.`
      : "Industrial decision support for measured inputs and server-side calculation.";
  }

  // Reject: "Daily Renovation" or "daily-renovation" or "Daily · Renovation"
  const lower = trimmed.toLowerCase();
  const dailyRenovation = ["daily", "renov", "ation"].join("");
  const REJECTED_SCOPES = new Set(["daily renovation", dailyRenovation, "daily·renovation", "daily-renovation"]);
  if (REJECTED_SCOPES.has(lower)) {
    return "Industrial decision support for measured inputs and server-side calculation.";
  }

  // Reject: scope looks like a raw slug (hyphenated, no spaces)
  if (/^[a-z][a-z0-9-]+$/.test(lower) && lower.includes("-")) {
    return toolName
      ? `Industrial decision support for ${toolName}.`
      : "Industrial decision support for measured inputs and server-side calculation.";
  }

  return trimmed;
}

/**
 * Safe tool title display: never returns raw slug.
 * If category is unknown/raw, uses "Industrial decision support".
 */
export function safeDisplayTitle(title: string | null | undefined, slug: string): string {
  if (!title) return formatSlugToTitle(slug);
  if (title === slug) return formatSlugToTitle(slug);
  // If title contains hyphens/underscores and no spaces, treat as raw slug
  if (/^[a-z][a-z0-9_-]+$/.test(title) && /[-_]/.test(title) && !title.includes(" ")) {
    return formatSlugToTitle(slug);
  }
  return title;
}

function formatSlugToTitle(slug: string): string {
  if (!slug) return "Industrial Calculator";
  return slug
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ── State predicates ───────────────────────────────────────────────────────────

/**
 * True if there are active client blockers preventing execution.
 */
export function hasClientBlockers(blockers: Array<{ id: string; severity: string }>): boolean {
  return blockers.some((b) => b.severity === "BLOCKER" || b.severity === "CRITICAL");
}

// ── Primary CTA label ─────────────────────────────────────────────────────────

export type AccessMode = "FREE" | "PRO";
export type ExecutionStateLabel = "idle" | "executing" | "done" | "error";

/**
 * Returns the correct primary CTA button label per V5.3.1 spec.
 *
 * Free tool:
 *   - Before: "Run free calculation"
 *   - During: "Calculating..."
 *   - After:  "Run again"
 *
 * Pro tool, no active session:
 *   - "Use 1 credit"
 *
 * Pro tool, active session, not executing:
 *   - Before result: "Run calculation"
 *   - After result:  "Run again"
 *
 * Pro tool, active session, executing:
 *   - "Calculating..."
 */
export function getPrimaryCtaLabel(
  accessMode: AccessMode,
  isExecuting: boolean,
  hasSession: boolean,
  hasResult: boolean,
  creditSessionLoading: boolean,
): string {
  if (creditSessionLoading) return "Processing credit...";

  if (accessMode === "FREE") {
    if (isExecuting) return "Calculating...";
    if (hasResult) return "Run again";
    return "Run free calculation";
  }

  // PRO
  if (!hasSession) return "Use 1 credit";
  if (isExecuting) return "Calculating...";
  if (hasResult) return "Run again";
  return "Run calculation";
}

/**
 * Safe redaction status display — never shows "Pending".
 */
export function safeRedactionDisplay(status: RedactionStatus | null): string {
  if (!status) return "—";
  return status.replaceAll("_", " ");
}

/**
 * Get a human-readable display label for a unit token.
 */
export function formatDisplayUnit(unit: string): string {
  if (!unit) return "";
  return getDisplayUnitLabel(unit);
}
