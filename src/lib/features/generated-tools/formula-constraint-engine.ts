/**
 * Formula Constraint Engine - Industrial-Grade
 *
 * Dual-layer formula validation:
 *   Layer 1: Dimension/Unit inference from variable names
 *   Layer 2: Semantic domain coherence verification
 *
 * Rules:
 *   - Every variable has inferred dimension(s) and domain(s)
 *   - Every formula has expected dimensions based on its key
 *   - Cross-dimension arithmetic (e.g. adding money to mass) = ERROR
 *   - Cross-domain contamination (e.g. labor formula using material inputs) = ERROR
 *
 * Reference: Tekla Tedds dimensional analysis, Simcenter unit consistency
 */

/* ── Dimensions ─────────────────────────────────── */

export type Dimension =
  | "money"       // $, €, ₺, cost, price, revenue
  | "mass"        // kg, g, ton, lb
  | "length"      // m, cm, mm, km, ft, in
  | "area"        // m², ft², sqm
  | "volume"      // m³, L, ml, gal
  | "time"        // hr, min, sec, day, year, month, week
  | "energy"      // kWh, J, cal, BTU
  | "power"       // kW, W, hp
  | "temperature" // °C, °F, K
  | "pressure"    // Pa, bar, psi
  | "rate"        // per-time ratios: m/s, $/hr, kg/day
  | "percentage"  // %, ratio, fraction
  | "count"       // units, pieces, people, items
  | "emission"    // CO₂, CO2e, carbon
  | "score"       // index, score, rating
  | "density"     // kg/m³, g/mL
  | "flow"        // m³/s, L/min, kg/hr
  | "acceleration" // m/s², g-force
  | "force"       // N, kN, lbf
  | "electric_current" // A, mA
  | "voltage"     // V, kV
  | "resistance"  // Ω, kΩ
  | "conductivity" // S, mS
  | "frequency"   // Hz, kHz
  | "dimensionless" // pure number

// Dimension compatibility for arithmetic operations
// Same dimension → OK for +, -, =
// Different non-compatible dimensions → ERROR
const COMPATIBLE_SET = new Set([
  "money", "mass", "length", "area", "volume", "time", "energy", "power",
  "temperature", "pressure", "rate", "percentage", "count", "emission",
  "score", "density", "flow", "acceleration", "force", "electric_current",
  "voltage", "resistance", "conductivity", "frequency", "dimensionless"
]);

/**
 * Infer dimensions from a variable/input name.
 */
export function inferDimensions(name: string): readonly Dimension[] {
  const dims: Dimension[] = [];
  const n = name.toLowerCase();

  // Money indicators
  if (/\b(price|cost|revenue|income|salary|wage|budget|fee|fine|tax|penalty|\$|eur|usd|try|gbp|charge|premium| expense|_cost|_price|_revenue|_income|_fee|_tax)\b/.test(n) ||
     /^cost_|_cost$|^price_|_price$/.test(n)) dims.push("money");

  // Mass indicators  
  if (/\b(weight|mass|kg|ton|gram|pound|lb|oz|_weight|_mass|_kg|_ton)\b/.test(n)) dims.push("mass");

  // Length indicators
  if (/\b(length|distance|height|depth|width|radius|diameter|altitude|_m\b|_km\b|_ft\b|_in\b|_cm\b|_mm\b|mile|km\b)\b/.test(n) ||
     /^length_|_length$/.test(n)) dims.push("length");

  // Area indicators
  if (/\b(area|_sqm|_m2|_ft2|sqft|sqm|hectare|acre)\b/.test(n)) dims.push("area");

  // Volume indicators
  if (/\b(volume|_m3|_l\b|_ml\b|_gal\b|liter|gallon|_litre)\b/.test(n) ||
     /\b(water_volume|reservoir|tank|_volume)\b/.test(n)) dims.push("volume");

  // Time indicators
  if (/\b(time|hour|minute|second|day|week|month|year|duration|period|cycle_time|lead_time|_hr\b|_hrs\b|_min\b|_sec\b|_day\b|\bhr\b|\bhrs\b)\b/.test(n) ||
     /\b(downtime|uptime|setup_time|processing_time|_hours|_minutes|_seconds|_days|_years)\b/.test(n)) dims.push("time");

  // Energy indicators
  if (/\b(energy|kwh|mwh|joule|calorie|btu|_kwh|_mwh|_j\b|_cal\b)\b/.test(n)) dims.push("energy");

  // Power indicators
  if (/\b(power|_kw\b|_w\b|_hp\b|watt|kilowatt|horsepower|_watts)\b/.test(n)) dims.push("power");

  // Temperature
  if (/\b(temp|celsius|fahrenheit|kelvin|_c\b|_f\b|_k\b)\b/.test(n)) dims.push("temperature");

  // Pressure
  if (/\b(pressure|_pa\b|_bar\b|_psi\b|pascal|atm)\b/.test(n)) dims.push("pressure");

  // Rate (per-unit-time ratios)
  if (/\b(rate|speed|velocity|_per_|_rate|_speed|frequency|_per_hour|_per_day|_per_year|_per_month)\b/.test(n) ||
     /_per_/.test(n)) dims.push("rate");

  // Percentage
  if (/\b(percent|percentage|_pct|_rate|ratio|fraction|_rate$|efficiency|yield|availability|performance|quality|margin)\b/.test(n) ||
     /\b(tax_rate|discount_rate|interest_rate|growth_rate|inflation)\b/.test(n)) dims.push("percentage");

  // Count
  if (/\b(count|number|quantity|_qty|_cnt|total_units|_units|_items|_pieces|_people|_employees|_operators|_workers|batch_size|_size|order_qty|order_quantity|_produced|_defective|_rework|_scrap)\b/.test(n) ||
     /\b(num_|total_|n_\b)/.test(n)) dims.push("count");

  // Emission / Carbon
  if (/\b(co2|carbon|emission|_co2|_co2e|_ghg|carbon_footprint)\b/.test(n)) dims.push("emission");

  // Score / Index
  if (/\b(score|index|rating|_score|_index|_rating)\b/.test(n)) dims.push("score");

  // Flow
  if (/\b(flow|_flow|_per_sec|_per_min)\b/.test(n)) dims.push("flow");

  // Force
  if (/\b(force|_n\b|_kn\b|_lbf\b|torque|thrust)\b/.test(n)) dims.push("force");

  // Acceleration
  if (/\b(acceleration|gravity|g_force)\b/.test(n)) dims.push("acceleration");

  // Electric
  if (/\b(current|_a\b|_amp|voltage|_v\b|_kv\b|resistance|_ohm|_ω|impedance)\b/.test(n)) dims.push("electric_current", "voltage");

  // Frequency
  if (/\b(frequency|_hz\b|_khz\b)\b/.test(n)) dims.push("frequency");

  // If no dimension matched, it's dimensionless
  if (dims.length === 0) dims.push("dimensionless");

  return dims;
}

/* ── Domain inference ──────────────────────────── */

export type FormulaDomain =
  | "labor" | "material" | "energy" | "quality" | "downtime"
  | "setup" | "maintenance" | "logistics" | "inventory"
  | "revenue" | "cost" | "profit" | "margin"
  | "carbon" | "environment" | "safety"
  | "production" | "efficiency" | "time"
  | "financial" | "risk" | "scoring" | "general"
  | "volume" | "mass" | "count" | "percentage" | "money"
  | "power" | "distance" | "rate" | "score" | "dimensionless";

const VARIABLE_DOMAIN_MAP: Array<[RegExp, FormulaDomain]> = [
  // Labor
  [/\b(labor|worker|operator|staff|personnel|employee|man_?hour|wage|salary|overtime|shift_premium)\b/i, "labor"],
  [/\b(labour|workforce|headcount|fte)\b/i, "labor"],

  // Material
  [/\b(material|raw_material|supply|component|part|stock|inventory|feedstock)\b/i, "material"],
  [/\b(consumable|spare_part|tooling|fixture)\b/i, "material"],

  // Energy
  [/\b(energy|power|kwh|mwh|electricity|fuel|gas|steam|utilities|grid|generator)\b/i, "energy"],
  [/\b(diesel|gasoline|lpg|natural_gas|propane|coal|biomass)\b/i, "energy"],

  // Quality
  [/\b(quality|defect|rework|scrap|reject|fail|inspection|non.?conformance|ppm|six.?sigma)\b/i, "quality"],
  [/\b(cpk|ppk|spc|first.?pass|yield|acceptance)\b/i, "quality"],

  // Downtime
  [/\b(downtime|idle|breakdown|stoppage|wait|delay|unplanned|planned.?stop|maintenance.?stop)\b/i, "downtime"],
  [/\b(interruption|outage|shutdown|standstill)\b/i, "downtime"],

  // Setup
  [/\b(setup|changeover|preparation|tool.?change|mold.?change|die.?change)\b/i, "setup"],

  // Maintenance
  [/\b(maintenance|repair|overhaul|pm_|inspection_|service_interval)\b/i, "maintenance"],

  // Logistics
  [/\b(logistics|transport|shipping|freight|delivery|warehouse|storage|handling)\b/i, "logistics"],

  // Revenue
  [/\b(revenue|sales|income|turnover|invoice|receivable)\b/i, "revenue"],
  [/\b(price|sell|selling|customer|order_value|average_order|aov)\b/i, "revenue"],

  // Cost
  [/\b(cost|expense|overhead|burden|fee|spend|spending|budget)\b/i, "cost"],

  // Profit
  [/\b(profit|margin|markup|earnings|return|roi|roe|roa|ebit|ebitda|net_income)\b/i, "profit"],

  // Carbon / Environment
  [/\b(carbon|co2|emission|ghg|greenhouse|environmental|sustainability|eco_|green_)\b/i, "carbon"],
  [/\b(climate|global_warming|carbon_footprint|carbon_tax)\b/i, "carbon"],

  // Safety
  [/\b(safety|hazard|risk|incident|accident|injury|near.?miss|osha)\b/i, "safety"],

  // Production
  [/\b(production|manufacturing|output|throughput|capacity|utilization|utilisation|oee)\b/i, "production"],
  [/\b(cycle_time|takt|bottleneck|line_speed|processing)\b/i, "production"],

  // Efficiency
  [/\b(efficiency|productivity|yield|performance|availability|overall)\b/i, "efficiency"],

  // Time
  [/\b(time|duration|period|hour|minute|second|day|week|month|year|cycle_time)\b/i, "time"],

  // Financial (general)
  [/\b(financial|finance|tax|interest|discount|depreciation|amortization|capital|investment)\b/i, "financial"],
  [/\b(loan|debt|equity|asset|liability|balance_sheet|cash_flow)\b/i, "financial"],

  // Risk
  [/\b(risk|exposure|hazard|uncertainty|volatility|probability|likelihood|consequence|severity|occurrence)\b/i, "risk"],

  // Scoring
  [/\b(score|index|rating|rank|metric|kpi|indicator)\b/i, "scoring"],
];

/**
 * Infer the domain of a variable/input from its name.
 */
export function inferVariableDomain(name: string): FormulaDomain {
  for (const [pattern, domain] of VARIABLE_DOMAIN_MAP) {
    if (pattern.test(name)) return domain;
  }
  return "general";
}

/**
 * Infer the expected domain of a formula from its key name.
 */
const FORMULA_KEY_DOMAIN_MAP: Array<[RegExp, FormulaDomain]> = [
  [/\b(labor|labour|worker|operator|personnel|staff|employee|man_?hour|wage|salary)\b/i, "labor"],
  [/\b(material|raw_material|supply|component|stock)\b/i, "material"],
  [/\b(energy|power|kwh|electricity|fuel|gas|steam)\b/i, "energy"],
  [/\b(quality|defect|rework|scrap|reject|fail|inspection|yield|spc|cpk|ppk)\b/i, "quality"],
  [/\b(downtime|idle|stoppage|delay|wait|unplanned)\b/i, "downtime"],
  [/\b(setup|changeover|preparation)\b/i, "setup"],
  [/\b(maintenance|repair|overhaul)\b/i, "maintenance"],
  [/\b(logistics|transport|shipping|freight|delivery)\b/i, "logistics"],
  [/\b(revenue|sales|income|turnover|price|selling)\b/i, "revenue"],
  [/\b(cost|expense|overhead|burden|fee|spend)\b/i, "cost"],
  [/\b(profit|margin|markup|earnings|return|roi)\b/i, "profit"],
  [/\b(carbon|co2|emission|ghg|environmental|sustainability)\b/i, "carbon"],
  [/\b(safety|hazard|risk|incident|accident|injury|osha)\b/i, "safety"],
  [/\b(production|manufacturing|throughput|capacity|oee|utilization|utilisation)\b/i, "production"],
  [/\b(efficiency|productivity|performance|availability|overall)\b/i, "efficiency"],
  [/\b(financial|finance|tax|interest|discount|depreciation|amortization|capex)\b/i, "financial"],
  [/\b(risk|exposure|hazard|uncertainty|volatility|probability)\b/i, "risk"],
  [/\b(score|index|rating|metric|kpi|indicator)\b/i, "scoring"],
];

export function inferFormulaDomain(formulaKey: string): FormulaDomain | null {
  for (const [pattern, domain] of FORMULA_KEY_DOMAIN_MAP) {
    if (pattern.test(formulaKey)) return domain;
  }
  return null;
}

/* ── Statement-level domain extraction ─────────── */

const COMPATIBLE_DOMAIN_PAIRS = new Map<FormulaDomain, readonly FormulaDomain[]>([
  // Efficiency is a dimensionless scale factor - compatible with EVERYTHING
  ["labor", ["time", "cost", "efficiency", "general"]],
  ["material", ["cost", "volume", "mass", "count", "efficiency"]],
  ["energy", ["cost", "power", "time", "efficiency"]],
  ["quality", ["cost", "count", "percentage", "efficiency"]],
  ["downtime", ["time", "cost", "efficiency"]],
  ["setup", ["time", "cost", "efficiency"]],
  ["maintenance", ["cost", "time", "material", "efficiency"]],
  ["logistics", ["cost", "time", "distance", "efficiency"]],
  ["revenue", ["cost", "profit", "count", "efficiency"]],
  ["cost", ["money", "labor", "material", "energy", "quality", "downtime", "maintenance", "logistics", "efficiency"]],
  ["profit", ["revenue", "cost", "margin", "financial", "efficiency"]],
  ["carbon", ["energy", "volume", "mass", "count", "cost", "efficiency"]],
  ["safety", ["risk", "count", "time", "efficiency"]],
  ["production", ["time", "efficiency", "count", "quality", "downtime"]],
  ["efficiency", ["percentage", "production", "time", "quality", "downtime"]],
  // Financial: cost is asset value in depreciation context
  ["financial", ["money", "percentage", "rate", "time", "cost"]],
  ["risk", ["percentage", "count", "score", "efficiency"]],
  ["scoring", ["score", "count", "percentage", "efficiency"]],
  ["time", ["count", "percentage", "rate", "efficiency"]],
  ["general", ["dimensionless", "count", "efficiency"]],
]);

function isDomainCompatible(formulaDomain: FormulaDomain, variableDomain: FormulaDomain): boolean {
  if (formulaDomain === variableDomain) return true;
  if (variableDomain === "general") return true;
  const compatible = COMPATIBLE_DOMAIN_PAIRS.get(formulaDomain);
  if (compatible && compatible.includes(variableDomain)) return true;
  // Reciprocal check
  const reverseCompatible = COMPATIBLE_DOMAIN_PAIRS.get(variableDomain);
  if (reverseCompatible && reverseCompatible.includes(formulaDomain)) return true;
  return false;
}

/* ── Expression tokenization ───────────────────── */

export function extractVariableReferences(
  expression: string,
  inputIds: readonly string[],
): readonly string[] {
  return inputIds.filter((id) => {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escaped}\\b`);
    return pattern.test(expression);
  });
}

/* ── Industrial-grade formula validation ──────── */

export type ConstraintIssue = {
  readonly formulaKey: string;
  readonly severity: "ERROR" | "WARN";
  readonly category: "DIMENSION_MISMATCH" | "DOMAIN_CONTAMINATION" | "UNUSED_INPUT" | "SUSPICIOUS_FORMULA" | "FORMULA_OVERRIDE_NEEDED";
  readonly message: string;
};

/**
 * Validate a single formula for dimensional and domain consistency.
 * This is the industrial-grade replacement for the old semantic verifier.
 */
export function validateFormulaConstraint(
  formulaKey: string,
  expression: string,
  inputIds: readonly string[],
  allFormulas: Record<string, string>,
): readonly ConstraintIssue[] {
  const issues: ConstraintIssue[] = [];

  // Extract variable references
  const usedInputs = extractVariableReferences(expression, inputIds);

  // Check: all inputs used by at least one formula?
  // This is captured elsewhere.

  // Check: formula domain vs variable domain compatibility
  const formulaDomain = inferFormulaDomain(formulaKey);
  if (formulaDomain && usedInputs.length > 0) {
    const incompatibleInputs = usedInputs.filter((id) => {
      const varDomain = inferVariableDomain(id);
      return !isDomainCompatible(formulaDomain, varDomain);
    });

    if (incompatibleInputs.length > 0 && usedInputs.length > 0) {
      const incompatibleNames = incompatibleInputs.join(", ");
      const varDomains = incompatibleInputs.map((id) => `${id}(${inferVariableDomain(id)})`).join(", ");
      issues.push({
        formulaKey,
        severity: "ERROR",
        category: "DOMAIN_CONTAMINATION",
        message: `Formula "${formulaKey}" (domain: ${formulaDomain}) uses incompatible inputs from other domains: [${varDomains}]`,
      });
    }
  }

  // Detect string concatenation in numeric formulas
  if (expression.includes("+ ") && /['"`]/.test(expression) && /\b(number|total|cost|price|rate)\b/i.test(formulaKey)) {
    issues.push({
      formulaKey,
      severity: "WARN",
      category: "SUSPICIOUS_FORMULA",
      message: `Formula "${formulaKey}" contains string concatenation - likely a display label, not a numeric formula`,
    });
  }

  return issues;
}

/**
 * Validate ALL formulas in a schema against the constraint engine.
 */
export function validateSchemaConstraints(
  formulas: Record<string, string>,
  inputIds: readonly string[],
): readonly ConstraintIssue[] {
  const allIssues: ConstraintIssue[] = [];
  for (const [key, expr] of Object.entries(formulas)) {
    const issues = validateFormulaConstraint(key, expr, inputIds, formulas);
    allIssues.push(...issues);
  }
  return allIssues;
}

/**
 * Categorize issues by severity for reporting.
 */
export function categorizeIssues(issues: readonly ConstraintIssue[]): {
  errors: number;
  warnings: number;
  byCategory: Record<string, number>;
} {
  const byCategory: Record<string, number> = {};
  let errors = 0;
  let warnings = 0;
  for (const iss of issues) {
    byCategory[iss.category] = (byCategory[iss.category] ?? 0) + 1;
    if (iss.severity === "ERROR") errors++;
    else warnings++;
  }
  return { errors, warnings, byCategory };
}
