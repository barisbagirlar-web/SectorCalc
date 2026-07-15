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
  machine_name: "machine_name",
  purchase_price: "purchase_price",
  useful_life_years: "useful_life_years",
  annual_operating_hours: "annual_operating_hours",
  maintenance_cost_pct: "maintenance_cost_pct",
  floor_space_cost: "floor_space_cost",
  power_consumption_kw: "power_consumption_kw",
  electricity_rate: "electricity_rate",
  tooling_cost: "tooling_cost",
  labor_cost_per_hour: "labor_cost_per_hour",
  overhead_rate: "overhead_rate",
  operator_count: "operator_count",
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
  cost_per_invoice: "cost_per_invoice",
  discount_rate_early: "discount_rate_early",
  early_payment_rate: "early_payment_rate",
  bad_debt_rate: "bad_debt_rate",
  days_early: "days_early",
  overdue_penalty_rate: "overdue_penalty_rate",
  overdue_rate: "overdue_rate",
  source_confidence: "source_confidence",
};

// ── 5. setup-time-reduction-roi-smed ──
export const setupTimeRoiFormToSchemaMap: FormToSchemaMap = {
  current_setup_time_min: "current_setup_time_min",
  target_setup_time_min: "target_setup_time_min",
  setups_per_year: "setups_per_year",
  labor_rate_per_hour: "labor_rate_per_hour",
  overhead_rate_per_hour: "overhead_rate_per_hour",
  lost_production_margin_per_hour: "lost_production_margin_per_hour",
  implementation_cost: "implementation_cost",
  annual_maintenance_cost: "annual_maintenance_cost",
  project_life_years: "project_life_years",
  discount_rate: "discount_rate",
  defect_reduction_pct: "defect_reduction_pct",
  source_confidence: "source_confidence",
};

// ── 6. product-sku-margin-ranker ──
export const productSkuFormToSchemaMap: FormToSchemaMap = {
  product_name: "product_name",
  unit_price: "unit_price",
  unit_cost: "unit_cost",
  labor_per_unit: "labor_per_unit",
  overhead_per_unit: "overhead_per_unit",
  material_cost_per_unit: "material_cost_per_unit",
  shipping_cost_per_unit: "shipping_cost_per_unit",
  duty_cost_per_unit: "duty_cost_per_unit",
  annual_volume: "annual_volume",
  target_margin: "target_margin",
  competitor_price: "competitor_price",
  source_confidence: "source_confidence",
};

// ── 7. true-employee-cost-statement ──
export const trueEmployeeCostFormToSchemaMap: FormToSchemaMap = {
  employee_name: "employee_name",
  base_salary: "base_salary",
  bonus_target_pct: "bonus_target_pct",
  employer_tax_pct: "employer_tax_pct",
  benefits_cost: "benefits_cost",
  training_cost: "training_cost",
  equipment_cost: "equipment_cost",
  overhead_allocation: "overhead_allocation",
  productive_hours_per_year: "productive_hours_per_year",
  billable_target_pct: "billable_target_pct",
  turnover_risk_pct: "turnover_risk_pct",
  source_confidence: "source_confidence",
};

// ── 8. job-quote-builder-pro-pack ──
export const jobQuoteFormToSchemaMap: FormToSchemaMap = {
  material_cost: "material_cost",
  labor_hours: "labor_hours",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  machine_hours: "machine_hours",
  machine_rate: "machine_rate",
  setup_cost: "setup_cost",
  tooling_cost: "tooling_cost",
  markup_pct: "markup_pct",
  contingency_pct: "contingency_pct",
  annual_volume: "annual_volume",
  source_confidence: "source_confidence",
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
  contribution_margin: "contribution_margin",
  unit_price: "unit_price",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  target_margin: "target_margin",
  annual_volume: "annual_volume",
  logistics_burden: "logistics_burden",
  service_burden: "service_burden",
  return_burden: "return_burden",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 12. downtime-scrap-loss-statement ──
export const downtimeScrapFormToSchemaMap: FormToSchemaMap = {
  machine_hourly_rate: "machine_hourly_rate",
  downtime_hours: "downtime_hours",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  scrap_quantity: "scrap_quantity",
  scrap_cost_per_unit: "scrap_cost_per_unit",
  rework_hours: "rework_hours",
  rework_labor_rate: "rework_labor_rate",
  annual_volume: "annual_volume",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 13. oee-loss-monetization-improvement-business-case ──
export const oeeLossFormToSchemaMap: FormToSchemaMap = {
  machine_hourly_rate: "machine_hourly_rate",
  downtime_hours: "downtime_hours",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  scrap_quantity: "scrap_quantity",
  scrap_cost_per_unit: "scrap_cost_per_unit",
  rework_hours: "rework_hours",
  rework_labor_rate: "rework_labor_rate",
  annual_volume: "annual_volume",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 14. scrap-rework-cost-tracker ──
export const scrapReworkFormToSchemaMap: FormToSchemaMap = {
  machine_hourly_rate: "machine_hourly_rate",
  downtime_hours: "downtime_hours",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  scrap_quantity: "scrap_quantity",
  scrap_cost_per_unit: "scrap_cost_per_unit",
  rework_hours: "rework_hours",
  rework_labor_rate: "rework_labor_rate",
  annual_volume: "annual_volume",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 15. outsource-vs-in-house-analyzer ──
export const outsourceFormToSchemaMap: FormToSchemaMap = {
  in_house_cost_per_unit: "in_house_cost_per_unit",
  outsource_cost_per_unit: "outsource_cost_per_unit",
  annual_volume: "annual_volume",
  switching_cost: "switching_cost",
  quality_defect_rate_in_house: "quality_defect_rate_in_house",
  quality_defect_rate_outsource: "quality_defect_rate_outsource",
  lead_time_days_in_house: "lead_time_days_in_house",
  lead_time_days_outsource: "lead_time_days_outsource",
  strategic_importance: "strategic_importance",
  source_confidence: "source_confidence",
};

// ── 16. plant-wide-shop-rate-cost-structure-audit ──
export const plantWideFormToSchemaMap: FormToSchemaMap = {
  machine_hourly_rate: "machine_hourly_rate",
  downtime_hours: "downtime_hours",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  scrap_quantity: "scrap_quantity",
  scrap_cost_per_unit: "scrap_cost_per_unit",
  rework_hours: "rework_hours",
  rework_labor_rate: "rework_labor_rate",
  annual_volume: "annual_volume",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 17. fx-commodity-pass-through-pricer ──
export const fxCommodityFormToSchemaMap: FormToSchemaMap = {
  contribution_margin: "contribution_margin",
  unit_price: "unit_price",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  target_margin: "target_margin",
  annual_volume: "annual_volume",
  logistics_burden: "logistics_burden",
  service_burden: "service_burden",
  return_burden: "return_burden",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 18. energy-efficiency-grant-incentive-feasibility-pack ──
export const energyEfficiencyFormToSchemaMap: FormToSchemaMap = {
  machine_hourly_rate: "machine_hourly_rate",
  downtime_hours: "downtime_hours",
  labor_rate: "labor_rate",
  overhead_rate: "overhead_rate",
  scrap_quantity: "scrap_quantity",
  scrap_cost_per_unit: "scrap_cost_per_unit",
  rework_hours: "rework_hours",
  rework_labor_rate: "rework_labor_rate",
  annual_volume: "annual_volume",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 19. motor-compressor-replacement-roi ──
export const motorCompressorFormToSchemaMap: FormToSchemaMap = {
  machine_name: "machine_name",
  current_energy_kwh: "current_energy_kwh",
  new_energy_kwh: "new_energy_kwh",
  operating_hours: "operating_hours",
  electricity_rate: "electricity_rate",
  equipment_cost: "equipment_cost",
  installation_cost: "installation_cost",
  annual_maintenance_saving: "annual_maintenance_saving",
  useful_life_years: "useful_life_years",
  discount_rate: "discount_rate",
  source_confidence_ratio: "source_confidence_ratio",
};

// ── 20. weld-procedure-cost-consumable-estimation-suite ──
export const weldFormToSchemaMap: FormToSchemaMap = {
  weld_length_m: "weld_length_m",
  weld_throat_mm: "weld_throat_mm",
  weld_density: "weld_density",
  wire_cost_per_kg: "wire_cost_per_kg",
  shielding_gas_cost_per_min: "shielding_gas_cost_per_min",
  arc_time_min: "arc_time_min",
  weld_time_min: "weld_time_min",
  labor_rate_per_hour: "labor_rate_per_hour",
  shop_overhead_rate_per_hour: "shop_overhead_rate_per_hour",
  deposition_efficiency_pct: "deposition_efficiency_pct",
  material: "material",
  source_confidence: "source_confidence",
  planned_quote: "planned_quote",
  contingency_pct: "contingency_pct",
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
  const raw_inputs: Record<string, string | number | boolean | null> = {};
  const selected_units: Record<string, string> = {};

  for (const [formFieldId, schemaInputId] of Object.entries(formToSchemaMap)) {
    if (formFieldId in formState) {
      raw_inputs[schemaInputId] = formState[formFieldId];
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
      raw_inputs[key] = value;
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
