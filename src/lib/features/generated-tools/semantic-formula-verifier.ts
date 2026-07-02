/**
 * Semantic Formula Verifier
 *
 * Industrial-grade validation that checks whether each formula's variable
 * references are semantically consistent with the formula's purpose.
 *
 * Example violation: "direct_labor_cost" formula uses "material_cost_per_unit"
 * instead of "labor_cost_per_hour" - the formula compiles and runs but
 * produces WRONG results.
 *
 * This verifier uses domain-specific heuristics derived from the
 * calculation ontology (Mind 2 / Requirement Engine framework).
 */

/* ── Domain-to-keyword mapping ─────────────────── */

type DomainTag = "labor" | "material" | "energy" | "quality" | "downtime"
  | "revenue" | "cost" | "profit" | "margin" | "volume" | "time"
  | "efficiency" | "productivity" | "defect" | "rework" | "waste"
  | "overhead" | "discount" | "tax" | "interest" | "depreciation"
  | "maintenance" | "setup" | "changeover" | "inventory" | "logistics"
  | "safety" | "environment" | "carbon" | "energy" | "water"
  | "risk" | "score" | "index" | "rate" | "count" | "ratio"
  | "distance";

const FORMULA_DOMAIN_KEYWORDS: Record<string, readonly DomainTag[]> = {
  // Labor / personnel
  labor_cost: ["labor", "cost"],
  direct_labor_cost: ["labor", "cost"],
  indirect_labor_cost: ["labor", "cost"],
  labor_hours: ["labor", "time"],
  labor_rate: ["labor", "rate"],
  labor_efficiency: ["labor", "efficiency"],
  labor_productivity: ["labor", "productivity"],

  // Material
  material_cost: ["material", "cost"],
  material_waste: ["material", "waste"],
  material_yield: ["material", "efficiency"],
  material_usage: ["material", "volume"],
  raw_material_cost: ["material", "cost"],

  // Energy
  energy_cost: ["energy", "cost"],
  energy_consumption: ["energy", "volume"],
  energy_efficiency: ["energy", "efficiency"],
  energy_per_unit: ["energy", "rate"],

  // Quality
  quality_cost: ["quality", "cost"],
  quality_rate: ["quality", "rate"],
  defect_rate: ["quality", "defect"],
  rework_cost: ["quality", "rework", "cost"],
  scrap_rate: ["quality", "waste", "defect"],
  first_pass_yield: ["quality", "efficiency"],

  // Downtime
  downtime_cost: ["downtime", "cost"],
  downtime_hours: ["downtime", "time"],
  setup_time: ["setup", "time"],
  changeover_time: ["changeover", "time"],
  maintenance_cost: ["maintenance", "cost"],

  // Financial
  total_cost: ["cost"],
  total_revenue: ["revenue"],
  total_profit: ["profit"],
  gross_margin: ["margin", "profit"],
  net_margin: ["margin", "profit"],
  profit_margin: ["margin", "profit"],
  contribution_margin: ["margin", "profit"],
  breakeven_point: ["volume", "cost", "revenue"],
  breakeven_units: ["volume", "cost", "revenue"],
  roi: ["profit", "rate"],
  payback_period: ["time", "profit"],
  npv: ["cost", "profit", "rate"],
  irr: ["rate", "profit"],

  // OEE / Productivity
  oee: ["efficiency", "productivity"],
  availability: ["time", "efficiency"],
  performance: ["efficiency", "productivity"],
  quality_score: ["quality", "score"],
  overall_equipment_effectiveness: ["efficiency", "productivity"],

  // Cost efficiency
  cost_per_unit: ["cost", "rate"],
  cost_efficiency: ["cost", "efficiency"],
  cost_savings: ["cost", "profit"],
  cost_reduction: ["cost", "efficiency"],

  // Waste / Loss
  total_waste: ["waste", "cost"],
  waste_cost: ["waste", "cost"],
  material_loss: ["material", "waste"],
  yield_loss: ["efficiency", "waste"],

  // Carbon / Environment
  carbon_footprint: ["carbon", "environment"],
  carbon_cost: ["carbon", "cost"],
  energy_carbon: ["energy", "carbon"],
  water_usage: ["water", "volume"],
  total_co2: ["carbon", "energy", "material", "distance" as const],
  total_co2_eq: ["carbon", "energy", "material"],
  co2_emissions: ["carbon", "energy"],
  base_kg_co2: ["carbon", "energy", "distance" as const],
  total_kg_co2e: ["carbon", "energy", "distance" as const],
  monthly_co2: ["carbon", "energy", "time"],
  per_trip_co2: ["carbon", "energy", "distance" as const],
  venue_co2: ["carbon", "energy", "time"],
  electric_emission: ["carbon", "energy"],
  commuting_emissions: ["carbon", "energy", "distance" as const],
  scope1_emissions: ["carbon", "energy", "material"],
  scope2_emissions: ["carbon", "energy"],
  scope3_emissions: ["carbon", "energy", "distance" as const],
  total_carbon_footprint: ["carbon", "energy", "material", "distance" as const],
  net_carbon: ["carbon", "energy", "material"],

  // Fuel cost (naturally crosses distance + energy + cost)
  fuel_cost: ["cost", "energy", "distance" as const],
  fuel_cost_total: ["cost", "energy", "distance" as const],
  fuel_cost_per_km: ["cost", "energy", "rate"],
  fuel_cost_per_mile: ["cost", "energy", "rate"],
  total_fuel_cost: ["cost", "energy", "distance" as const],

  // Energy
  annual_energy_consumption: ["energy", "time"],
  annual_electricity_cost: ["energy", "cost", "time"],
  annual_kwh: ["energy", "time"],
  annual_energy_cost: ["energy", "cost", "time"],
  energy_cost_per_day: ["energy", "cost", "time"],
  power_required: ["energy", "material"],
  power_watts: ["energy", "material", "water"],
  wave_power_per_meter: ["energy", "water"],
  effective_power: ["energy", "material"],
  steam_energy_output_kw: ["energy", "water", "material"],
  monthly_energy: ["energy", "time"],
  min_energy: ["energy", "risk"],
  max_energy: ["energy", "risk"],

  // Water
  total_water: ["water", "time"],
  water_to_remove: ["water", "material"],
  stock_ppm: ["water", "material"],
  stock_volume_l: ["water", "material"],

  // Waste / Material
  total_waste_material: ["material", "waste"],
  scrap_cost: ["material", "cost", "waste"],
  rework_labor_cost: ["labor", "cost", "material"],
  scrap_revenue: ["material", "revenue"],
  total_material_weight: ["material", "count", "waste"],

  // Financial
  net_salary: ["profit", "cost", "revenue"],
  adjusted_purchasing_power: ["revenue", "profit", "time"],
  purchasing_power_loss: ["revenue", "profit", "time"],

  // Quality / Efficiency
  quality: ["quality", "efficiency"],
  quality_yield: ["quality", "efficiency"],

  // Risk
  hazard_rate: ["risk", "time"],
  cumulative_hazard: ["risk", "time"],

  // Time / Delay
  total_delay: ["time", "efficiency"],
  labor_cost_total: ["labor", "cost"],

  // Exposure hours - when formula uses time inputs, this is valid
  annual_exposure_hours: ["time", "risk"],
};

/**
 * Pre-computed input-domain keywords.
 */
function inputDomainTags(inputId: string): readonly string[] {
  const tags: string[] = [];
  if (/labor|worker|operator|staff|personnel|employee|man_?hour|wage|salary/i.test(inputId)) tags.push("labor");
  if (/material|raw_material|supply|component|part|stock|fabric|item/i.test(inputId)) tags.push("material");
  if (/energy|power|kwh|electricity|fuel|gas|steam|utilities|kva|watt/i.test(inputId)) tags.push("energy");
  if (/quality|defect|rework|scrap|reject|fail|inspection/i.test(inputId)) tags.push("quality");
  if (/downtime|idle|breakdown|stoppage|wait|delay|unplanned/i.test(inputId)) tags.push("downtime");
  if (/revenue|price|sell|income|sales|customer|rate\b.*hour|charge|fee|premium/i.test(inputId)) tags.push("revenue");
  if (/cost|expense|overhead|burden|charge|fee|price_per/i.test(inputId)) tags.push("cost");
  if (/profit|margin|markup|earnings|return/i.test(inputId)) tags.push("profit");
  if (/time|hour|minute|second|day|week|month|year|duration|period|cycle|shift|overtime/i.test(inputId)) tags.push("time");
  if (/rate|speed|velocity|frequency|ratio|percentage|factor/i.test(inputId)) tags.push("rate");
  if (/count|number|quantity|volume|unit|piece|item|parts|batch/i.test(inputId)) tags.push("count");
  if (/carbon|co2|emission|environment|sustainability|green|carbon|co2e/i.test(inputId)) tags.push("carbon");
  if (/water|wastewater|liquid|steam|flow|hydraulic/i.test(inputId)) tags.push("water");
  if (/risk|exposure|hazard|uncertainty|volatility/i.test(inputId)) tags.push("risk");
  if (/efficiency|productivity|yield|throughput|utilization|utilisation|effectiveness/i.test(inputId)) tags.push("efficiency");
  if (/setup|changeover|preparation|tooling|fixture|changeover/i.test(inputId)) tags.push("setup");
  if (/distance|mileage|km|mile|travel|trip|route/i.test(inputId)) tags.push("distance");
  if (/fuel|gasoline|diesel|petrol|gas/i.test(inputId)) tags.push("energy");
  return tags;
}

export type SemanticFormulaIssue = {
  readonly formulaKey: string;
  readonly severity: "ERROR" | "WARN";
  readonly message: string;
};

/**
 * Verify that a single formula expression uses variables semantically
 * consistent with its formula key name.
 */
export function verifyFormulaSemantics(
  formulaKey: string,
  expression: string,
  inputIds: readonly string[],
): readonly SemanticFormulaIssue[] {
  const issues: SemanticFormulaIssue[] = [];

  // Extract variable references from the expression
  const usedInputs = inputIds.filter((id) => {
    const pattern = new RegExp(`\\b${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    return pattern.test(expression);
  });

  // Determine expected domain tags from formula key
  const formulaTags = FORMULA_DOMAIN_KEYWORDS[formulaKey] ?? [];
  // Fallback: infer tags from the formula key name itself
  const inferredTags = inputDomainTags(formulaKey);
  const expectedTags = formulaTags.length > 0 ? formulaTags : inferredTags;

  if (expectedTags.length === 0) {
    // Unknown formula key - can't verify
    return issues;
  }

  // Check: at least one used input should match at least one expected tag
  const matchingInputs = usedInputs.filter((id) => {
    const inputTags = inputDomainTags(id);
    return inputTags.some((tag) => expectedTags.includes(tag as DomainTag));
  });

  // Cross-check: if formula is about "labor", at least one of the inputs
  // it uses should also relate to "labor"
  const expectedDomainNames = expectedTags.filter(
    (t) => !["cost", "time", "rate", "count", "efficiency", "score", "index", "volume", "profit", "margin", "revenue"].includes(t),
  );

  for (const domain of expectedDomainNames) {
    const domainInputs = usedInputs.filter((id) => inputDomainTags(id).includes(domain));
    if (domainInputs.length === 0 && usedInputs.length > 0) {
      issues.push({
        formulaKey,
        severity: "WARN",
        message: `Formula "${formulaKey}" expected "${domain}" domain but no referenced input matches. Used inputs: [${usedInputs.join(", ")}]`,
      });
    }
  }

  // Check for identity-multiplication smell (* 1)
  if (/\s*\*\s*1\s*/.test(expression)) {
    issues.push({
      formulaKey,
      severity: "WARN",
      message: `Formula "${formulaKey}" contains pointless * 1 multiplication`,
    });
  }

  // Check for semantic mismatch: formula references only one domain,
  // but its key suggests a different domain
  if (expectedDomainNames.length > 0 && usedInputs.length > 0) {
    const inputDomains = new Set<string>();
    for (const id of usedInputs) {
      for (const tag of inputDomainTags(id)) {
        inputDomains.add(tag);
      }
    }
    const matchedDomains = expectedDomainNames.filter((d) => inputDomains.has(d));
    const expectedList = expectedDomainNames.join(", ");
    if (matchedDomains.length === 0 && inputDomains.size > 0) {
      const inputDomainList = [...inputDomains].join(", ");
      issues.push({
        formulaKey,
        severity: "WARN",
        message: `Formula "${formulaKey}" references inputs from unrelated domains [${inputDomainList}], expected [${expectedList}]`,
      });
    }

    // INDUSTRIAL-GRADE: Cross-domain contamination detection
    // If formula is tagged with specific domains (e.g., "labor"), check that
    // it doesn't use inputs from incompatible other specific domains
    // (e.g., "material" in a labor-cost formula).
    // A "contamination" exists when ANY specific input domain is present
    // that is NOT in the formula's expected domains.
    const specificInputDomains = [...inputDomains].filter(
      (d) => !["cost", "time", "rate", "count", "volume", "efficiency", "score", "index"].includes(d),
    );
    if (specificInputDomains.length > 0 && expectedDomainNames.length > 0) {
      const unexpectedDomains = specificInputDomains.filter(
        (d) => !expectedDomainNames.includes(d),
      );
      if (unexpectedDomains.length > 0) {
        issues.push({
          formulaKey,
          severity: "WARN",
          message: `Cross-domain contamination: Formula "${formulaKey}" (expected [${expectedList}]) uses inputs from unexpected domain(s) [${unexpectedDomains.join(", ")}]. Inputs: [${usedInputs.join(", ")}]`,
        });
      }
    }
  }

  return issues;
}

/**
 * Verify all formulas in a schema for semantic consistency.
 */
export function verifySchemaSemantics(
  formulas: Record<string, string>,
  inputIds: readonly string[],
): readonly SemanticFormulaIssue[] {
  const allIssues: SemanticFormulaIssue[] = [];
  for (const [key, expression] of Object.entries(formulas)) {
    const issues = verifyFormulaSemantics(key, expression, inputIds);
    allIssues.push(...issues);
  }
  return allIssues;
}
