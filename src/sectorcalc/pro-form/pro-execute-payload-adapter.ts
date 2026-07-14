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

function identityMap<const T extends readonly string[]>(ids: T): FormToSchemaMap {
  return Object.freeze(Object.fromEntries(ids.map((id) => [id, id])));
}

const GENERIC_JOB_COST_INPUT_IDS = [
  "machine_rate", "cycle_time", "setup_time", "batch_quantity", "material_cost", "target_margin",
  "annual_volume", "labor_rate", "overhead_rate", "defect_or_loss_cost", "source_confidence_ratio",
  "uncertainty_multiplier",
] as const;

const INVESTMENT_INPUT_IDS = [
  "initial_investment", "annual_net_cash_flow", "discount_rate", "analysis_years", "residual_value",
  "stress_downside_factor", "annual_volume", "labor_rate", "overhead_rate", "defect_or_loss_cost",
  "source_confidence_ratio", "uncertainty_multiplier",
] as const;

export const breakEvenFormToSchemaMap = identityMap([
  "initial_investment", "annual_net_cash_flow", "discount_rate", "analysis_years", "residual_value",
  "stress_downside_factor", "labor_rate", "overhead_rate", "defect_or_loss_cost",
  "source_confidence_ratio", "uncertainty_multiplier",
] as const);
export const machineHourlyFormToSchemaMap = identityMap([
  "machine_rate", "cycle_time", "setup_time", "batch_quantity", "material_cost", "target_margin",
  "annual_volume", "labor_rate", "overhead_rate", "source_confidence_ratio",
] as const);
export const lossMakingJobFormToSchemaMap = identityMap(GENERIC_JOB_COST_INPUT_IDS);
export const receivablesCostFormToSchemaMap = identityMap([
  "machine_rate", "cycle_time", "setup_time", "material_cost", "target_margin", "annual_volume",
  "labor_rate", "defect_or_loss_cost", "source_confidence_ratio", "uncertainty_multiplier",
] as const);
export const setupTimeRoiFormToSchemaMap = identityMap([
  "machine_rate", "cycle_time", "setup_time", "batch_quantity", "material_cost", "annual_volume",
  "labor_rate", "overhead_rate", "source_confidence_ratio", "uncertainty_multiplier",
] as const);
export const productSkuFormToSchemaMap = identityMap([
  "machine_rate", "cycle_time", "material_cost", "target_margin", "annual_volume", "labor_rate",
  "overhead_rate", "defect_or_loss_cost", "source_confidence_ratio", "uncertainty_multiplier",
] as const);
export const trueEmployeeCostFormToSchemaMap = identityMap([
  "machine_rate", "material_cost", "target_margin", "annual_volume", "labor_rate", "overhead_rate",
  "defect_or_loss_cost", "source_confidence_ratio", "uncertainty_multiplier",
] as const);
export const jobQuoteFormToSchemaMap = identityMap(GENERIC_JOB_COST_INPUT_IDS);
export const machineFeasibilityFormToSchemaMap = identityMap(INVESTMENT_INPUT_IDS);
export const capitalEquipmentFormToSchemaMap = identityMap([
  "initial_investment", "annual_net_cash_flow", "discount_rate", "analysis_years", "residual_value",
  "stress_downside_factor", "source_confidence_ratio", "uncertainty_multiplier",
] as const);

export const customerSkuFormToSchemaMap = identityMap([
  "unit_price", "unit_variable_cost", "annual_volume", "logistics_cost_pct", "service_cost_pct",
  "return_rate_pct", "target_margin", "labor_rate", "overhead_rate", "source_confidence",
] as const);

export const downtimeScrapFormToSchemaMap = identityMap([
  "productive_hours", "actual_hours", "hourly_rate", "scrap_quantity", "unit_cost", "rework_hours",
  "rework_rate", "material_cost", "defect_rate_pct", "source_confidence",
] as const);

export const oeeLossFormToSchemaMap = identityMap([
  "planned_production_time", "operating_time", "ideal_cycle_time", "total_parts", "good_parts",
  "hourly_contribution", "improvement_cost", "source_confidence",
] as const);

export const scrapReworkFormToSchemaMap = identityMap([
  "total_produced", "scrap_quantity", "rework_quantity", "unit_material_cost", "unit_labor_cost",
  "rework_labor_rate", "rework_time_per_unit", "defect_rate_target", "monthly_volume", "source_confidence",
] as const);

export const outsourceFormToSchemaMap = identityMap([
  "in_house_material_cost", "in_house_labor_cost", "in_house_overhead", "in_house_setup_cost",
  "outsource_unit_price", "outsource_logistics", "annual_volume", "quality_risk_premium",
  "source_confidence",
] as const);

export const plantWideFormToSchemaMap = identityMap([
  "total_annual_cost", "total_productive_hours", "machine_group_cost", "machine_group_hours",
  "overhead_pool", "overhead_allocation_base", "current_shop_rate", "target_margin_pct",
  "utilization_pct", "source_confidence",
] as const);

export const fxCommodityFormToSchemaMap = identityMap([
  "base_price", "fx_rate_spot", "fx_rate_budget", "commodity_index_current", "commodity_index_budget",
  "material_cost_pct", "fx_hedge_pct", "commodity_hedge_pct", "annual_volume", "source_confidence",
] as const);

export const energyEfficiencyFormToSchemaMap = identityMap([
  "current_kwh_per_year", "target_kwh_per_year", "avg_kwh_rate", "implementation_cost",
  "grant_coverage_pct", "maintenance_saving", "emission_factor", "equipment_life_years",
  "discount_rate", "source_confidence",
] as const);

export const motorCompressorFormToSchemaMap = identityMap([
  "motor_power_kw", "annual_operating_hours", "current_efficiency_pct", "new_efficiency_pct",
  "avg_kwh_rate", "replacement_cost", "installation_cost", "maintenance_saving_yr",
  "equipment_life_years", "discount_rate", "source_confidence",
] as const);

export const weldFormToSchemaMap = identityMap([
  "weld_length_m", "weld_throat_mm", "weld_density", "wire_cost_per_kg", "gas_cost_per_min",
  "arc_time_min", "weld_time_min", "labor_rate", "overhead_rate", "deposition_efficiency",
  "source_confidence",
] as const);

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

type AdapterValue = string | number | boolean | null;

export interface AdapterInput<TValue extends AdapterValue = AdapterValue> {
  formState: Record<string, TValue>;
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

export interface AdapterPayload<TValue extends AdapterValue = AdapterValue> {
  tool_key: string;
  tool_id: string;
  schema_version: string;
  usageSessionId?: string | null;
  raw_inputs: Record<string, TValue>;
  selected_units: Record<string, string>;
  output_units?: Record<string, string>;
  display_currency?: string | null;
  scenario_request?: unknown;
  user_profile_mode?: string;
  client_schema_hash?: string;
}

export function buildExecutePayload<TValue extends AdapterValue>(
  input: AdapterInput<TValue>,
): AdapterPayload<TValue> {
  const { formState, selectedUnits, toolKey, toolId, schemaVersion, usageSessionId, formToSchemaMap } = input;

  const mappingEntries = Object.entries(formToSchemaMap);
  if (mappingEntries.length === 0) {
    throw new Error(`FORM_SCHEMA_MAP_EMPTY:${toolKey}`);
  }

  const mappedFormIds = new Set(mappingEntries.map(([formFieldId]) => formFieldId));
  const mappedSchemaIds = mappingEntries.map(([, schemaInputId]) => schemaInputId);
  if (new Set(mappedSchemaIds).size !== mappedSchemaIds.length) {
    throw new Error(`FORM_SCHEMA_MAP_NON_BIJECTIVE:${toolKey}`);
  }

  const unknownFormIds = Object.keys(formState).filter((id) => !mappedFormIds.has(id));
  const unknownUnitIds = Object.keys(selectedUnits).filter((id) => !mappedFormIds.has(id));
  if (unknownFormIds.length > 0 || unknownUnitIds.length > 0) {
    throw new Error(
      `FORM_SCHEMA_CONTRACT_VIOLATION:${toolKey}:` +
      `form=[${unknownFormIds.join(",")}]:units=[${unknownUnitIds.join(",")}]`,
    );
  }

  const raw_inputs: Record<string, TValue> = {};
  const selected_units: Record<string, string> = {};

  for (const [formFieldId, schemaInputId] of mappingEntries) {
    if (formFieldId in formState) {
      raw_inputs[schemaInputId] = formState[formFieldId];
    }
    if (formFieldId in selectedUnits) {
      selected_units[schemaInputId] = selectedUnits[formFieldId];
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
