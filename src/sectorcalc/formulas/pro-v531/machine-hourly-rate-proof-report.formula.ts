import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "machine-hourly-rate-proof-report";
export const formulaVersion = "5.3.1-pro-baris.2";

export const sampleInputs: Record<string, number> = {
  n_planned_operating_hours: 2000,
  n_utilization_percent: 80,
  n_planned_downtime_percent: 5,
  n_purchase_price: 85000,
  n_residual_value: 5000,
  n_economic_life_years: 8,
  n_maintenance_cost: 6000,
  n_insurance_tax_cost: 2000,
  n_facility_allocation: 18000,
  n_machine_power_kw: 15,
  n_electricity_price: 0.12,
  n_consumables_cost_per_hour: 2.5,
  n_tooling_cost_per_hour: 3,
  n_operator_count: 1,
  n_labor_rate_per_hour: 45,
  n_current_shop_rate: 85,
  n_target_margin_percent: 25,
  n_financing_cost_percent: 0,
  n_other_annual_fixed_cost: 0,
  n_annual_production_volume: 100000,
  n_cycle_time_seconds: 720,
  n_setup_time_minutes: 8,
  n_average_batch_quantity: 500,
};

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}
function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}
function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // ── Read core inputs ──────────────────────────────────────────────────
  const plannedOperatingHours  = get(inputs, "n_planned_operating_hours");
  const utilizationPercent     = get(inputs, "n_utilization_percent");
  const plannedDowntimePercent = get(inputs, "n_planned_downtime_percent");
  const purchasePrice          = get(inputs, "n_purchase_price");
  const residualValue          = get(inputs, "n_residual_value");
  const economicLifeYears      = get(inputs, "n_economic_life_years");
  const maintenanceCost        = get(inputs, "n_maintenance_cost");
  const insuranceTaxCost       = get(inputs, "n_insurance_tax_cost");
  const facilityAllocation     = get(inputs, "n_facility_allocation");
  const machinePowerKw         = get(inputs, "n_machine_power_kw");
  const electricityPrice       = get(inputs, "n_electricity_price");
  const consumablesCostPerHour = get(inputs, "n_consumables_cost_per_hour");
  const toolingCostPerHour     = get(inputs, "n_tooling_cost_per_hour");
  const operatorCount          = get(inputs, "n_operator_count");
  const laborRatePerHour       = get(inputs, "n_labor_rate_per_hour");
  const currentShopRate        = get(inputs, "n_current_shop_rate");
  const targetMarginPercent    = get(inputs, "n_target_margin_percent");

  // ── Read optional core inputs ─────────────────────────────────────────
  const financingCostPercent   = get(inputs, "n_financing_cost_percent");
  const otherAnnualFixedCost   = get(inputs, "n_other_annual_fixed_cost");

  // ── Read optional scenario inputs ─────────────────────────────────────
  const annualProdVolume       = get(inputs, "n_annual_production_volume");
  const cycleTimeSeconds       = get(inputs, "n_cycle_time_seconds");
  const setupTimeMinutes       = get(inputs, "n_setup_time_minutes");
  const avgBatchQuantity       = get(inputs, "n_average_batch_quantity");

  // Determine whether the optional scenario group is fully supplied.
  // All four must be > 0 to consider the scenario active.
  const scenarioComplete =
    annualProdVolume > 0 && cycleTimeSeconds > 0 &&
    setupTimeMinutes >= 0 && avgBatchQuantity > 0;

  // ── Validate & compute decision state ─────────────────────────────────
  const blockers: string[] = [];
  const reviewFlags: string[] = [];

  if (plannedOperatingHours <= 0) blockers.push("planned_operating_hours_must_be_positive");
  if (economicLifeYears <= 0) blockers.push("economic_life_must_be_positive");
  if (residualValue > purchasePrice) blockers.push("residual_value_exceeds_purchase_price");
  if (targetMarginPercent >= 100) blockers.push("target_margin_must_be_below_100_percent");

  if (utilizationPercent < 50) reviewFlags.push("utilization_below_50_percent");

  // ── CAPACITY ──────────────────────────────────────────────────────────
  const scheduledHoursPerYear = plannedOperatingHours;
  const availableHoursPerYear = scheduledHoursPerYear * (1 - plannedDowntimePercent / 100);
  const productiveHoursPerYear = availableHoursPerYear * (utilizationPercent / 100);

  outputs["out_scheduled_hours_per_year"] = round(scheduledHoursPerYear, 2);
  outputs["out_available_hours_per_year"] = round(availableHoursPerYear, 2);
  outputs["out_productive_hours_per_year"] = round(productiveHoursPerYear, 2);

  if (productiveHoursPerYear <= 0) blockers.push("productive_hours_must_be_positive");

  // ── OWNERSHIP & FIXED COSTS ──────────────────────────────────────────
  const annualDepreciationCost = economicLifeYears > 0
    ? (purchasePrice - residualValue) / economicLifeYears
    : 0;

  const annualFinancingCost = purchasePrice * (financingCostPercent / 100);

  const annualFixedCost =
    annualDepreciationCost +
    maintenanceCost +
    insuranceTaxCost +
    facilityAllocation +
    otherAnnualFixedCost +
    annualFinancingCost;

  outputs["out_annual_depreciation_cost"] = round(annualDepreciationCost, 2);
  outputs["out_annual_financing_cost"] = round(annualFinancingCost, 2);
  outputs["out_annual_fixed_cost"] = round(annualFixedCost, 2);

  // Hourly fixed-cost components
  const denom = productiveHoursPerYear > 0 ? productiveHoursPerYear : 1;
  const deprCostPerHr      = annualDepreciationCost / denom;
  const maintCostPerHr     = maintenanceCost / denom;
  const insTaxCostPerHr    = insuranceTaxCost / denom;
  const facilityCostPerHr  = facilityAllocation / denom;
  const financeCostPerHr   = annualFinancingCost / denom;
  const otherFixedCostPerHr = otherAnnualFixedCost / denom;

  outputs["out_depreciation_cost_per_hour"] = round(deprCostPerHr, 4);
  outputs["out_maintenance_cost_per_hour"] = round(maintCostPerHr, 4);
  outputs["out_insurance_tax_cost_per_hour"] = round(insTaxCostPerHr, 4);
  outputs["out_facility_cost_per_hour"] = round(facilityCostPerHr, 4);
  outputs["out_financing_cost_per_hour"] = round(financeCostPerHr, 4);
  outputs["out_other_fixed_cost_per_hour"] = round(otherFixedCostPerHr, 4);

  // Aggregated fixed cost per productive hour
  const fixedCostPerProdHr = annualFixedCost / denom;
  outputs["out_fixed_cost_per_productive_hour"] = round(fixedCostPerProdHr, 4);

  // ── VARIABLE COSTS ────────────────────────────────────────────────────
  const energyCostPerHr   = machinePowerKw * electricityPrice;
  const laborCostPerHr    = operatorCount * laborRatePerHour;
  const variableCostPerHr = energyCostPerHr + laborCostPerHr + consumablesCostPerHour + toolingCostPerHour;

  outputs["out_energy_cost_per_hour"] = round(energyCostPerHr, 4);
  outputs["out_labor_cost_per_hour"] = round(laborCostPerHr, 4);
  outputs["out_consumables_cost_per_hour"] = round(consumablesCostPerHour, 4);
  outputs["out_tooling_cost_per_hour"] = round(toolingCostPerHour, 4);
  outputs["out_variable_cost_per_hour"] = round(variableCostPerHr, 4);

  // ── TOTAL COST ────────────────────────────────────────────────────────
  const totalCostPerHour = fixedCostPerProdHr + variableCostPerHr;
  outputs["out_total_cost_per_hour"] = round(totalCostPerHour, 4);

  // ── RATE & PRICING ────────────────────────────────────────────────────
  const minimumSustainRate = totalCostPerHour;
  outputs["out_minimum_sustainable_rate"] = round(minimumSustainRate, 4);

  const marginSafe = targetMarginPercent >= 0 && targetMarginPercent < 100;
  const targetSellRate = marginSafe && (1 - targetMarginPercent / 100) > 0
    ? totalCostPerHour / (1 - targetMarginPercent / 100)
    : 0;

  outputs["out_target_sell_rate"] = round(targetSellRate, 4);

  const rateGap = currentShopRate - targetSellRate;
  outputs["out_current_rate_gap"] = round(rateGap, 4);

  const annualUnderRecovery = rateGap * productiveHoursPerYear;
  outputs["out_annual_under_recovery_or_surplus"] = round(annualUnderRecovery, 2);

  if (rateGap < 0) reviewFlags.push("current_shop_rate_below_target_sell_rate");

  // ── BREAK-EVEN UTILIZATION ───────────────────────────────────────────
  const breakevenContribution = currentShopRate - variableCostPerHr;
  outputs["out_break_even_contribution_per_hour"] = round(breakevenContribution, 4);

  let breakevenStatus = 0; // 0 = FEASIBLE
  let utilizationBreakevenPct = 0;

  if (breakevenContribution <= 0) {
    breakevenStatus = 1; // IMPOSSIBLE
    outputs["out_utilization_breakeven_percent"] = 0;
    if (currentShopRate <= variableCostPerHr) {
      blockers.push("current_rate_does_not_cover_variable_cost");
    }
  } else if (availableHoursPerYear > 0) {
    utilizationBreakevenPct = (annualFixedCost / breakevenContribution) / availableHoursPerYear * 100;
    outputs["out_utilization_breakeven_percent"] = round(utilizationBreakevenPct, 2);

    if (utilizationBreakevenPct > 85) reviewFlags.push("breakeven_utilization_above_85_percent");
  } else {
    breakevenStatus = 1;
    outputs["out_utilization_breakeven_percent"] = 0;
  }

  outputs["out_break_even_status"] = breakevenStatus;

  // ── PRIMARY COST DRIVER ──────────────────────────────────────────────
  const costDrivers: Array<{ id: number; label: string; value: number }> = [
    { id: 0, label: "fixed", value: fixedCostPerProdHr },
    { id: 1, label: "energy", value: energyCostPerHr },
    { id: 2, label: "labor", value: laborCostPerHr },
    { id: 3, label: "consumables", value: consumablesCostPerHour },
    { id: 4, label: "tooling", value: toolingCostPerHour },
  ];
  const primaryDriver = costDrivers.reduce((a, b) => (a.value >= b.value ? a : b));
  outputs["out_primary_cost_driver"] = primaryDriver.id;

  // ── OPTIONAL SCENARIO ─────────────────────────────────────────────────
  const scenarioStateDefault = -1; // -1 = NOT_COMPUTED
  outputs["out_setup_count_per_year"] = 0;
  outputs["out_required_machine_hours"] = 0;
  outputs["out_capacity_requirement_percent"] = 0;
  outputs["out_cost_per_part"] = 0;
  outputs["out_target_sell_price_per_part"] = 0;
  outputs["out_production_scenario_state"] = scenarioStateDefault;

  if (scenarioComplete) {
    const setupCountPerYear = Math.ceil(annualProdVolume / avgBatchQuantity);
    const reqMachineHours =
      annualProdVolume * cycleTimeSeconds / 3600 +
      setupCountPerYear * setupTimeMinutes / 60;

    outputs["out_setup_count_per_year"] = setupCountPerYear;
    outputs["out_required_machine_hours"] = round(reqMachineHours, 2);

    const capacityReqPct = productiveHoursPerYear > 0
      ? (reqMachineHours / productiveHoursPerYear) * 100
      : 0;
    outputs["out_capacity_requirement_percent"] = round(capacityReqPct, 2);

    if (capacityReqPct > 100) {
      outputs["out_production_scenario_state"] = 1; // CAPACITY_BLOCKED
      blockers.push("capacity_requirement_exceeds_100_percent");
    } else {
      outputs["out_production_scenario_state"] = 0; // OK
    }

    const costPerPart = annualProdVolume > 0
      ? (totalCostPerHour * reqMachineHours) / annualProdVolume
      : 0;
    outputs["out_cost_per_part"] = round(costPerPart, 4);

    const targetSellPricePerPart = marginSafe && (1 - targetMarginPercent / 100) > 0
      ? costPerPart / (1 - targetMarginPercent / 100)
      : 0;
    outputs["out_target_sell_price_per_part"] = round(targetSellPricePerPart, 4);
  }

  // ── FINAL DECISION ────────────────────────────────────────────────────
  // BLOCKED if any blocker exists
  if (blockers.length > 0) {
    outputs["out_final_decision_state"] = 2; // BLOCKED
  } else if (reviewFlags.length > 0 || rateGap < 0) {
    outputs["out_final_decision_state"] = 1; // REVIEW
  } else {
    outputs["out_final_decision_state"] = 0; // GOOD
  }

  // Add warnings from review flags
  for (const flag of reviewFlags) {
    warnings.push(flag);
  }
  for (const blocker of blockers) {
    warnings.push(`BLOCKER: ${blocker}`);
  }

  // ── DETERMINE OVERALL STATUS ──────────────────────────────────────────
  let status: CalculationStatus = "OK";
  if (blockers.length > 0) {
    status = "BLOCKED";
  } else if (reviewFlags.length > 0 || rateGap < 0) {
    status = "REVIEW";
  }

  const allFinite = Object.values(outputs).every(v => isFiniteNumber(v));
  const outputKeys = Object.keys(outputs);

  return {
    status: allFinite ? status : "BLOCKED",
    outputs,
    warnings,
    outputKeys,
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
