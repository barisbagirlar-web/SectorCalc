// SectorCalc — Industrial Example Value Resolver V1
// Central resolver for industrially sensible initial/example input values.
// Uses tool-specific maps, schema defaults, semantic heuristics, and range fallbacks.
// Never hardcodes values inside JSX.
// Never replaces the schema default_value system — only supplements it.

type ExamplePrimitive = number | string;

export interface IndustrialExampleValueContext {
  toolSlug?: string | null;
  toolKey?: string | null;
  inputId: string;
  inputName?: string | null;
  unit?: string | null;
  rangeMin?: number | null;
  rangeMax?: number | null;
  schemaExampleValue?: unknown;
  schemaDefaultValue?: unknown;
}

// ── Tool-specific example value overrides ─────────────────────────────────
// Keyed by tool slug → input id → value.
// Highest priority — overrides schema defaults and heuristics.
const TOOL_EXAMPLE_VALUES: Record<string, Record<string, ExamplePrimitive>> = {
  "break-even-and-margin-of-safety-analysis": {
    fixed_costs: 12000,
    selling_price_per_unit: 85,
    variable_cost_per_unit: 52,
    actual_sales_units: 520,
  },

  "compressed-air-leak-cost-calculator": {
    leak_orifice_diameter_mm: 3,
    system_pressure_bar_g: 7,
    operating_hours_per_year: 6000,
    compressor_specific_power_kw_per_m3_min: 6.5,
    electricity_cost_per_kwh: 0.15,
    repair_cost: 180,
  },
};

// ── Internal helpers ──────────────────────────────────────────────────────

function normalizeKey(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
}

function normalizeText(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = value.trim().replace(",", ".");
    if (!n) return null;
    const parsed = Number(n);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isInsideRange(
  value: number,
  min?: number | null,
  max?: number | null,
): boolean {
  if (typeof min === "number" && Number.isFinite(min) && value < min) return false;
  if (typeof max === "number" && Number.isFinite(max) && value > max) return false;
  return true;
}

/** Round a value to a "nice" industrial number for display as an example. */
function niceNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const abs = Math.abs(value);
  if (abs === 0) return 0;
  if (abs < 1) return Number(value.toFixed(3));
  if (abs < 10) return Number(value.toFixed(2));
  if (abs < 100) return Math.round(value);
  if (abs < 1000) return Math.round(value / 5) * 5;
  if (abs < 10000) return Math.round(value / 50) * 50;
  if (abs < 100000) return Math.round(value / 500) * 500;
  if (abs < 1000000) return Math.round(value / 5000) * 5000;
  return Math.round(value / 10000) * 10000;
}

/** Derive a candidate from physical range bounds when nothing else is available. */
function rangeFallback(min?: number | null, max?: number | null): number | null {
  const hasMin = typeof min === "number" && Number.isFinite(min);
  const hasMax = typeof max === "number" && Number.isFinite(max);

  if (!hasMin && !hasMax) return null;
  if (hasMin && !hasMax) return niceNumber(Math.max(1, min as number));
  if (!hasMin && hasMax) return niceNumber((max as number) * 0.1);

  const rMin = min as number;
  const rMax = max as number;

  if (rMax <= rMin) return niceNumber(rMin);
  if (rMin > 0 && rMax / rMin > 100) return niceNumber(Math.sqrt(rMin * rMax));
  if (rMin === 0 && rMax > 0) return niceNumber(rMax * 0.1);

  return niceNumber(rMin + (rMax - rMin) * 0.35);
}

/**
 * Semantic heuristics based on input id, name, and unit.
 * Only fires when no tool-specific, schema example, or schema default is available.
 */
function semanticFallback(ctx: IndustrialExampleValueContext): number | string | null {
  const id = normalizeText(ctx.inputId);
  const name = normalizeText(ctx.inputName);
  const unit = normalizeText(ctx.unit);
  const text = `${id} ${name} ${unit}`;

  // Energy / electricity
  if (text.includes("electricity") && text.includes("kwh")) return 0.15;
  if (text.includes("energy") && text.includes("price")) return 0.15;
  if (text.includes("cost_per_kwh") || text.includes("cost per kwh")) return 0.15;
  if (text.includes("usd_per_kwh") || text.includes("usd/kwh")) return 0.15;

  // Pressure
  if (text.includes("pressure") && (text.includes("bar") || text.includes("bar_g"))) return 7;

  // Diameter / orifice
  if ((text.includes("diameter") || text.includes("orifice")) && text.includes("mm")) return 3;

  // Operating hours
  if (text.includes("operating") && (text.includes("hour") || text.includes("h/"))) return 6000;
  if (text.includes("hours_per_year") || text.includes("h/year") || text.includes("h_per_year")) return 6000;

  // Compressor specific power
  if (text.includes("specific") && text.includes("power")) return 6.5;
  if (text.includes("kw_per_m3_min") || text.includes("kw/(m³/min)")) return 6.5;

  // Repair cost
  if (text.includes("repair") && (text.includes("cost") || text.includes("price"))) return 180;

  // Fixed cost
  if (text.includes("fixed") && text.includes("cost")) return 12000;

  // Selling price
  if (text.includes("selling") && text.includes("price")) return 85;

  // Variable cost
  if (text.includes("variable") && text.includes("cost")) return 52;

  // Sales units
  if (text.includes("sales") && text.includes("unit")) return 520;

  // Generic quantity/count/units
  if (text.includes("quantity") || text.includes("count") || (text.includes("units") && !text.includes("sales"))) return 1000;

  // Rate or percentage
  if (text.includes("percent") || text.includes("%") || text.includes("rate")) return 75;
  if (text.includes("efficiency") || text.includes("yield")) return 85;

  // Temperature
  if (text.includes("temperature")) return 25;

  // Density
  if (text.includes("density") && (text.includes("steel") || text.includes("iron"))) return 7850;
  if (text.includes("density")) return 1000;

  // Length / dimension
  if (text.includes("length") && text.includes("mm")) return 1000;
  if (text.includes("width") && text.includes("mm")) return 500;
  if (text.includes("height") && text.includes("mm")) return 500;
  if (text.includes("thickness") && text.includes("mm")) return 10;

  // Generic currency-denominated cost
  if (text.includes("currency") || text.includes("cost") || text.includes("price")) return 1000;

  return null;
}

/** Validate a candidate against range and return it if suitable. */
function pickValidCandidate(
  value: unknown,
  min?: number | null,
  max?: number | null,
): ExamplePrimitive | null {
  const numeric = toFiniteNumber(value);
  if (numeric !== null && isInsideRange(numeric, min, max)) return numeric;
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Resolve an industrially sensible example value for a calculator input.
 *
 * Precedence (highest first):
 * 1. Tool-specific override map
 * 2. Schema example value (if valid and in range)
 * 3. Schema default value (if valid and in range)
 * 4. Unit/input semantic heuristic
 * 5. Reference range heuristic
 * 6. Safe fallback empty string
 */
export function resolveIndustrialExampleValue(
  ctx: IndustrialExampleValueContext,
): ExamplePrimitive | "" {
  const slug = normalizeKey(ctx.toolSlug);
  const key = normalizeKey(ctx.toolKey);
  const inputId = String(ctx.inputId ?? "");

  // Priority 1: Tool-specific override
  const toolOverride =
    TOOL_EXAMPLE_VALUES[slug]?.[inputId] ??
    TOOL_EXAMPLE_VALUES[key]?.[inputId];
  const override = pickValidCandidate(toolOverride, ctx.rangeMin, ctx.rangeMax);
  if (override !== null) return override;

  // Priority 2: Schema example value
  const schemaExample = pickValidCandidate(ctx.schemaExampleValue, ctx.rangeMin, ctx.rangeMax);
  if (schemaExample !== null) return schemaExample;

  // Priority 3: Schema default value
  const schemaDefault = pickValidCandidate(ctx.schemaDefaultValue, ctx.rangeMin, ctx.rangeMax);
  if (schemaDefault !== null) return schemaDefault;

  // Priority 4: Semantic heuristic
  const semantic = pickValidCandidate(semanticFallback(ctx), ctx.rangeMin, ctx.rangeMax);
  if (semantic !== null) return semantic;

  // Priority 5: Range heuristic
  const ranged = rangeFallback(ctx.rangeMin, ctx.rangeMax);
  if (ranged !== null && isInsideRange(ranged, ctx.rangeMin, ctx.rangeMax)) {
    return ranged;
  }

  // Priority 6: Fallback empty — caller decides what to do
  return "";
}
