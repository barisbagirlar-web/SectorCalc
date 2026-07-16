// SectorCalc PRO V2 — Execute Payload Adapter (Form State → API Payload)
// Every PRO V2 tool must have an explicit formFieldId → schemaInputId mapping.
// In the current architecture, the form state keys ARE schema input IDs (identity mapping).
// This adapter formalizes the contract and prevents regression.

// ── Explicit form→schema mapping for each LIVE PRO V2 tool ──
// formFieldId (visible form state key) → schemaInputId (API/schema validation key)
// When both are identical (identity), the adapter passes through unchanged.

export type FormToSchemaMap = Record<string, string>;

export interface AdapterContract {
  formToSchemaInputMap: FormToSchemaMap;
  requiredSchemaInputIds: string[];
  optionalSchemaInputIds: string[];
  expectedOutputKeys: string[];
}

// ── 1. break-even-survival-cash-calculator ──
export const breakEvenFormToSchemaMap: FormToSchemaMap = {
  monthly_fixed_cash_cost: "monthly_fixed_cash_cost",
  monthly_debt_service: "monthly_debt_service",
  contribution_margin_ratio: "contribution_margin_ratio",
  current_monthly_revenue: "current_monthly_revenue",
  unrestricted_cash_balance: "unrestricted_cash_balance",
  minimum_cash_buffer: "minimum_cash_buffer",
  target_survival_months: "target_survival_months",
  downside_revenue_factor: "downside_revenue_factor",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
};

// ── 2. machine-hourly-rate-proof-report ──
export const machineHourlyFormToSchemaMap: FormToSchemaMap = {
  purchase_price: "purchase_price",
  useful_life: "useful_life",
  annual_hours: "annual_hours",
  wage_rate: "wage_rate",
  power_draw: "power_draw",
  energy_price: "energy_price",
  idle_share: "idle_share",
  maintenance_rate: "maintenance_rate",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 3. loss-making-job-detector ──
// Rebuilt 2026-07-15: the previous map referenced a stale draft schema (labor_hours,
// machine_cost, setup_cost, tooling_cost, selling_price, defect_rate) that does not match
// any field in loss-making-job-detector.schema.json's current "inputs" array. Because none
// of those keys ever matched real form state, buildExecutePayload's identity-passthrough
// fallback silently carried the actual values — this map was dead code. Replaced with the
// real schema field ids (1:1 identity, matching the convention used elsewhere in this file).
export const lossMakingJobFormToSchemaMap: FormToSchemaMap = {
  machine_rate: "machine_rate",
  cycle_time: "cycle_time",
  setup_time: "setup_time",
  batch_quantity: "batch_quantity",
  material_cost: "material_cost",
  target_margin: "target_margin",
  annual_volume: "annual_volume",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  defect_or_loss_cost: "defect_or_loss_cost",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
  quoted_job_price: "quoted_job_price",
};

// ── 4. receivables-cost-payment-term-addendum ──
export const receivablesCostFormToSchemaMap: FormToSchemaMap = {
  average_receivable_balance: "average_receivable_balance",
  annual_interest_rate: "annual_interest_rate",
  average_collection_days: "average_collection_days",
  invoice_volume: "invoice_volume",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
};

// ── 5. setup-time-reduction-roi-smed ──
// Rebuilt 2026-07-15: previous map referenced a stale draft (current_setup_time_min,
// implementation_cost, project_life_years, discount_rate...) that does not match the
// current schema. Notably it DID have "implementation_cost" — confirming the investment-cost
// input restored in this audit (n_smed_investment_cost) is a regression fix, not a new concept.
export const setupTimeRoiFormToSchemaMap: FormToSchemaMap = {
  machine_rate: "machine_rate",
  setup_time: "setup_time",
  batch_quantity: "batch_quantity",
  labor_rate: "labor_rate",
  annual_volume: "annual_volume",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
  smed_investment_cost: "smed_investment_cost",
  setup_time_reduction_target_pct: "setup_time_reduction_target_pct",
};

// ── 6. product-sku-margin-ranker ──
// Rebuilt 2026-07-15: previous map referenced a stale draft (product_name, unit_price,
// competitor_price...) that does not match the current schema. It DID have "unit_price" —
// confirming the selling-price input restored in this audit (n_unit_selling_price) is a
// regression fix, not a new concept.
export const productSkuFormToSchemaMap: FormToSchemaMap = {
  machine_rate: "machine_rate",
  cycle_time: "cycle_time",
  setup_time: "setup_time",
  batch_quantity: "batch_quantity",
  material_cost: "material_cost",
  target_margin: "target_margin",
  annual_volume: "annual_volume",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  defect_or_loss_cost: "defect_or_loss_cost",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
  unit_selling_price: "unit_selling_price",
};

// ── 7. true-employee-cost-statement ──
export const trueEmployeeCostFormToSchemaMap: FormToSchemaMap = {
  annual_base_salary: "annual_base_salary",
  payroll_tax_rate: "payroll_tax_rate",
  annual_benefits_cost: "annual_benefits_cost",
  annual_insurance_cost: "annual_insurance_cost",
  annual_training_cost: "annual_training_cost",
  annual_equipment_it_cost: "annual_equipment_it_cost",
  annual_workspace_facility_cost: "annual_workspace_facility_cost",
  target_billable_utilization_ratio: "target_billable_utilization_ratio",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
};

// ── 8. job-quote-builder-pro-pack ──
export const jobQuoteFormToSchemaMap: FormToSchemaMap = {
  machine_rate: "machine_rate",
  cycle_time: "cycle_time",
  setup_time: "setup_time",
  batch_quantity: "batch_quantity",
  material_cost: "material_cost",
  target_margin: "target_margin",
  annual_volume: "annual_volume",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  defect_or_loss_cost: "defect_or_loss_cost",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
};

// ── 9. machine-investment-feasibility-buy-lease-keep ──
export const machineFeasibilityFormToSchemaMap: FormToSchemaMap = {
  initial_investment: "initial_investment",
  annual_net_cash_flow: "annual_net_cash_flow",
  discount_rate: "discount_rate",
  analysis_years: "analysis_years",
  residual_value: "residual_value",
  stress_downside_factor: "stress_downside_factor",
  annual_volume: "annual_volume",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  defect_or_loss_cost: "defect_or_loss_cost",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
};

// ── 10. capital-equipment-investment-appraisal-npv-irr ──
export const capitalEquipmentFormToSchemaMap: FormToSchemaMap = {
  initial_investment: "initial_investment",
  annual_net_cash_flow: "annual_net_cash_flow",
  discount_rate: "discount_rate",
  analysis_years: "analysis_years",
  residual_value: "residual_value",
  stress_downside_factor: "stress_downside_factor",
  annual_volume: "annual_volume",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  defect_or_loss_cost: "defect_or_loss_cost",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
};

// ── 11. customer-sku-profitability-forensics ──
export const customerSkuFormToSchemaMap: FormToSchemaMap = {
  unit_price: "unit_price",
  unit_variable_cost: "unit_variable_cost",
  annual_volume: "annual_volume",
  logistics_cost_pct: "logistics_cost_pct",
  service_cost_pct: "service_cost_pct",
  return_rate_pct: "return_rate_pct",
  target_margin: "target_margin",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  source_confidence: "source_confidence",
};

// ── 12. downtime-scrap-loss-statement ──
export const downtimeScrapFormToSchemaMap: FormToSchemaMap = {
  productive_hours: "productive_hours",
  actual_hours: "actual_hours",
  hourly_rate: "hourly_rate",
  scrap_quantity: "scrap_quantity",
  unit_cost: "unit_cost",
  rework_hours: "rework_hours",
  rework_rate: "rework_rate",
  material_cost: "material_cost",
  defect_rate_pct: "defect_rate_pct",
  source_confidence: "source_confidence",
};

// ── 13. oee-loss-monetization-improvement-business-case ──
export const oeeLossFormToSchemaMap: FormToSchemaMap = {
  planned_production_time: "planned_production_time",
  operating_time: "operating_time",
  net_operating_time: "net_operating_time",
  valuable_operating_time: "valuable_operating_time",
  ideal_cycle_time: "ideal_cycle_time",
  total_parts: "total_parts",
  good_parts: "good_parts",
  hourly_contribution: "hourly_contribution",
  improvement_cost: "improvement_cost",
  source_confidence: "source_confidence",
};

// ── 14. scrap-rework-cost-tracker ──
export const scrapReworkFormToSchemaMap: FormToSchemaMap = {
  total_produced: "total_produced",
  scrap_quantity: "scrap_quantity",
  rework_quantity: "rework_quantity",
  unit_material_cost: "unit_material_cost",
  unit_labor_cost: "unit_labor_cost",
  rework_labor_rate: "rework_labor_rate",
  rework_time_per_unit: "rework_time_per_unit",
  defect_rate_target: "defect_rate_target",
  monthly_volume: "monthly_volume",
  source_confidence: "source_confidence",
};

// ── 15. outsource-vs-in-house-analyzer ──
export const outsourceFormToSchemaMap: FormToSchemaMap = {
  in_house_material_cost: "in_house_material_cost",
  in_house_labor_cost: "in_house_labor_cost",
  in_house_overhead: "in_house_overhead",
  in_house_setup_cost: "in_house_setup_cost",
  outsource_unit_price: "outsource_unit_price",
  outsource_logistics: "outsource_logistics",
  annual_volume: "annual_volume",
  quality_risk_premium: "quality_risk_premium",
  capacity_utilization: "capacity_utilization",
  source_confidence: "source_confidence",
};

// ── 16. plant-wide-shop-rate-cost-structure-audit ──
export const plantWideFormToSchemaMap: FormToSchemaMap = {
  total_annual_cost: "total_annual_cost",
  total_productive_hours: "total_productive_hours",
  machine_group_cost: "machine_group_cost",
  machine_group_hours: "machine_group_hours",
  overhead_pool: "overhead_pool",
  overhead_allocation_base: "overhead_allocation_base",
  current_shop_rate: "current_shop_rate",
  target_margin_pct: "target_margin_pct",
  utilization_pct: "utilization_pct",
  source_confidence: "source_confidence",
};

// ── 17. fx-commodity-pass-through-pricer ──
export const fxCommodityFormToSchemaMap: FormToSchemaMap = {
  base_price: "base_price",
  fx_rate_spot: "fx_rate_spot",
  fx_rate_budget: "fx_rate_budget",
  commodity_index_current: "commodity_index_current",
  commodity_index_budget: "commodity_index_budget",
  material_cost_pct: "material_cost_pct",
  fx_hedge_pct: "fx_hedge_pct",
  commodity_hedge_pct: "commodity_hedge_pct",
  annual_volume: "annual_volume",
  source_confidence: "source_confidence",
};

// ── 18. energy-efficiency-grant-incentive-feasibility-pack ──
export const energyEfficiencyFormToSchemaMap: FormToSchemaMap = {
  current_kwh_per_year: "current_kwh_per_year",
  target_kwh_per_year: "target_kwh_per_year",
  avg_kwh_rate: "avg_kwh_rate",
  implementation_cost: "implementation_cost",
  grant_coverage_pct: "grant_coverage_pct",
  maintenance_saving: "maintenance_saving",
  emission_factor: "emission_factor",
  equipment_life_years: "equipment_life_years",
  discount_rate: "discount_rate",
  source_confidence: "source_confidence",
};

// ── 19. motor-compressor-replacement-roi ──
export const motorCompressorFormToSchemaMap: FormToSchemaMap = {
  motor_power_kw: "motor_power_kw",
  annual_operating_hours: "annual_operating_hours",
  current_efficiency_pct: "current_efficiency_pct",
  new_efficiency_pct: "new_efficiency_pct",
  avg_kwh_rate: "avg_kwh_rate",
  replacement_cost: "replacement_cost",
  installation_cost: "installation_cost",
  maintenance_saving_yr: "maintenance_saving_yr",
  equipment_life_years: "equipment_life_years",
  discount_rate: "discount_rate",
  source_confidence: "source_confidence",
};

// ── 20. weld-procedure-cost-consumable-estimation-suite ──
export const weldFormToSchemaMap: FormToSchemaMap = {
  weld_length_m: "weld_length_m",
  weld_throat_mm: "weld_throat_mm",
  weld_density: "weld_density",
  wire_cost_per_kg: "wire_cost_per_kg",
  gas_cost_per_min: "gas_cost_per_min",
  arc_time_min: "arc_time_min",
  weld_time_min: "weld_time_min",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  deposition_efficiency: "deposition_efficiency",
  source_confidence: "source_confidence",
};

// ── Registry: slug → FormToSchemaMap ──
export const formToSchemaMapRegistry: Record<string, FormToSchemaMap> = {
  "break-even-survival-cash-calculator": breakEvenFormToSchemaMap,
  "machine-hourly-rate-proof-report": machineHourlyFormToSchemaMap,
  "loss-making-job-detector": lossMakingJobFormToSchemaMap,
  "receivables-cost-payment-term-addendum": receivablesCostFormToSchemaMap,
  "setup-time-reduction-roi-smed": setupTimeRoiFormToSchemaMap,
  "product-sku-margin-ranker": productSkuFormToSchemaMap,
  "true-employee-cost-statement": trueEmployeeCostFormToSchemaMap,
  "job-quote-builder-pro-pack": jobQuoteFormToSchemaMap,
  "machine-investment-feasibility-buy-lease-keep": machineFeasibilityFormToSchemaMap,
  "capital-equipment-investment-appraisal-npv-irr": capitalEquipmentFormToSchemaMap,
  "customer-sku-profitability-forensics": customerSkuFormToSchemaMap,
  "downtime-scrap-loss-statement": downtimeScrapFormToSchemaMap,
  "oee-loss-monetization-improvement-business-case": oeeLossFormToSchemaMap,
  "scrap-rework-cost-tracker": scrapReworkFormToSchemaMap,
  "outsource-vs-in-house-analyzer": outsourceFormToSchemaMap,
  "plant-wide-shop-rate-cost-structure-audit": plantWideFormToSchemaMap,
  "fx-commodity-pass-through-pricer": fxCommodityFormToSchemaMap,
  "energy-efficiency-grant-incentive-feasibility-pack": energyEfficiencyFormToSchemaMap,
  "motor-compressor-replacement-roi": motorCompressorFormToSchemaMap,
  "weld-procedure-cost-consumable-estimation-suite": weldFormToSchemaMap,
};

export function getFormToSchemaMap(slug: string): FormToSchemaMap | null {
  return formToSchemaMapRegistry[slug] ?? null;
}

// ── BuildExecutePayload ──
// Transforms form state + selected units into the API execute request payload.
// Uses the explicit formToSchemaInputMap to ensure every form field maps to the correct schema input ID.

export interface AdapterInput {
  formState: Record<string, string | number | boolean | null>;
  selectedUnits: Record<string, string>;
  toolKey: string;
  toolId: string;
  schemaVersion: string;
  usageSessionId?: string | null;
  formToSchemaMap: FormToSchemaMap;
  outputUnits?: Record<string, string>;
  displayCurrency?: string | null;
  scenarioRequest?: unknown;
  userProfileMode?: string;
  clientSchemaHash?: string;
}

export interface AdapterPayload {
  tool_key: string;
  tool_id: string;
  schema_version: string;
  usageSessionId?: string | null;
  raw_inputs: Record<string, string | number | boolean | null>;
  selected_units: Record<string, string>;
  output_units?: Record<string, string>;
  display_currency?: string | null;
  scenario_request?: unknown;
  user_profile_mode?: string;
  client_schema_hash?: string;
}

export function buildExecutePayload(input: AdapterInput): AdapterPayload {
  const { formState, selectedUnits, toolKey, toolId, schemaVersion, usageSessionId, formToSchemaMap } = input;

  // Map form state keys → schema input IDs using the explicit mapping
  // Parse string values to numbers so the server accepts them.
  const raw_inputs: Record<string, string | number | boolean | null> = {};
  const selected_units: Record<string, string> = {};

  const coerceValue = (v: string | number | boolean | null): string | number | boolean | null => {
    if (typeof v === "string") {
      if (v === "" || v === "." || v === "-" || v === "+") return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : v;
    }
    return v;
  };

  for (const [formFieldId, schemaInputId] of Object.entries(formToSchemaMap)) {
    if (formFieldId in formState) {
      raw_inputs[schemaInputId] = coerceValue(formState[formFieldId]);
    }
    // Map selected_units: if the selectedUnits use formFieldId, convert to schemaInputId
    if (formFieldId in selectedUnits) {
      selected_units[schemaInputId] = selectedUnits[formFieldId];
    }
  }

  // Also carry over any schemaInputId keys directly present in formState/selectedUnits
  // (the form uses schema input IDs as state keys, so this handles the identity mapping)
  for (const [key, value] of Object.entries(formState)) {
    if (!(key in raw_inputs)) {
      raw_inputs[key] = coerceValue(value);
    }
  }
  for (const [key, value] of Object.entries(selectedUnits)) {
    if (!(key in selected_units)) {
      selected_units[key] = value;
    }
  }

  return {
    tool_key: toolKey,
    tool_id: toolId,
    schema_version: schemaVersion,
    usageSessionId: usageSessionId ?? null,
    raw_inputs,
    selected_units,
    output_units: input.outputUnits,
    display_currency: input.displayCurrency ?? null,
    scenario_request: input.scenarioRequest ?? null,
    user_profile_mode: input.userProfileMode ?? "engineering",
    client_schema_hash: input.clientSchemaHash,
  };
}
