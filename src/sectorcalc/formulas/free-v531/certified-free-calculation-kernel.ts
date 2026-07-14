import "server-only";

import type { Decimal, DomainError, DomainResult } from "@/sectorcalc/formulas/pro-v531/pro-decimal-domain";
import {
  createDecimalContext,
  decimalToPresentationNumber,
  err,
  ok,
} from "@/sectorcalc/formulas/pro-v531/pro-decimal-domain";
import {
  FREE_DECIMAL_ARITHMETIC_MODE,
  getFreeFormulaCertification,
  type FreeArithmeticMode,
} from "./free-formula-verification-manifest";

type OutputRole = "PRIMARY_DECISION" | "SECONDARY_METRIC" | "BUSINESS_IMPACT";
type InputConstraint = "FINITE" | "NON_NEGATIVE" | "POSITIVE" | "PERCENT" | "POSITIVE_INTEGER";

export interface CertifiedFreeOutput {
  readonly id: string;
  readonly exactValue: string;
  readonly value: number;
  readonly unit: string;
  readonly role: OutputRole;
  readonly lowerBound?: number;
  readonly upperBound?: number;
  readonly exactLowerBound?: string;
  readonly exactUpperBound?: string;
  readonly ulpErrorMargin?: number;
}

export interface CertifiedFreeCalculation {
  readonly toolKey: string;
  readonly formulaVersion: string;
  readonly modelId: string;
  readonly arithmeticMode: FreeArithmeticMode;
  readonly status: "OK" | "REVIEW" | "HOLD" | "REPAIR" | "REPRICE";
  readonly outputs: readonly CertifiedFreeOutput[];
  readonly normalizedInputs: Readonly<Record<string, string>>;
  readonly warnings: readonly string[];
}

interface EvaluationContext {
  readonly input: (id: string, constraint: InputConstraint) => DomainResult<Decimal>;
  readonly output: (id: string, value: Decimal, unit: string, role: OutputRole) => DomainResult<CertifiedFreeOutput>;
  readonly normalizedInputs: Record<string, string>;
}

type Evaluator = (context: EvaluationContext) => DomainResult<{
  status: CertifiedFreeCalculation["status"];
  outputs: CertifiedFreeOutput[];
  warnings: string[];
}>;

function domainError(field: string, message: string): DomainResult<never> {
  return err({ code: "DOMAIN_VIOLATION", field, message });
}

function createEvaluationContext(rawInputs: Readonly<Record<string, unknown>>): EvaluationContext {
  const decimalContext = createDecimalContext();
  const normalizedInputs: Record<string, string> = {};

  return {
    normalizedInputs,
    input(id, constraint) {
      const raw = rawInputs[id];
      if (typeof raw !== "string" && typeof raw !== "number") {
        return err({ code: "MISSING_INPUT", field: id, message: id + " is required." });
      }
      const parsed = decimalContext.decimal(raw, id);
      if (!parsed.ok) return parsed;
      const value = parsed.value;
      if (constraint === "NON_NEGATIVE" && value.lt("0")) return domainError(id, id + " must be non-negative.");
      if (constraint === "POSITIVE" && value.lte("0")) return domainError(id, id + " must be greater than zero.");
      if (constraint === "PERCENT" && (value.lt("0") || value.gt("100"))) return domainError(id, id + " must be within [0, 100].");
      if (constraint === "POSITIVE_INTEGER" && (value.lte("0") || !value.round(0, 0).eq(value))) {
        return domainError(id, id + " must be a positive integer.");
      }
      normalizedInputs[id] = value.toString();
      return ok(value);
    },
    output(id, value, unit, role) {
      const presented = decimalToPresentationNumber(value, id);
      if (!presented.ok) return presented;
      return ok({ id, exactValue: value.toString(), value: presented.value, unit, role });
    },
  };
}

function collectInputs(
  context: EvaluationContext,
  specifications: readonly (readonly [string, InputConstraint])[],
): DomainResult<Record<string, Decimal>> {
  const values: Record<string, Decimal> = {};
  for (const [id, constraint] of specifications) {
    const parsed = context.input(id, constraint);
    if (!parsed.ok) return parsed;
    values[id] = parsed.value;
  }
  return ok(values);
}

function collectOutputs(
  context: EvaluationContext,
  definitions: readonly (readonly [string, Decimal, string, OutputRole])[],
): DomainResult<CertifiedFreeOutput[]> {
  const outputs: CertifiedFreeOutput[] = [];
  for (const [id, value, unit, role] of definitions) {
    const output = context.output(id, value, unit, role);
    if (!output.ok) return output;
    outputs.push(output.value);
  }
  return ok(outputs);
}

const evaluateDowntimeCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["downtime_hours", "NON_NEGATIVE"], ["planned_units_per_hour", "NON_NEGATIVE"],
    ["contribution_margin_per_unit", "NON_NEGATIVE"], ["idle_labor_cost_per_hour", "NON_NEGATIVE"],
    ["repair_cost", "NON_NEGATIVE"], ["delivery_penalty_cost", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const lostUnits = v.downtime_hours.times(v.planned_units_per_hour);
  const lostContribution = lostUnits.times(v.contribution_margin_per_unit);
  const idleCost = v.downtime_hours.times(v.idle_labor_cost_per_hour);
  const totalLoss = lostContribution.plus(idleCost).plus(v.repair_cost).plus(v.delivery_penalty_cost);
  const outputs = collectOutputs(context, [
    ["lost_units", lostUnits, "units", "SECONDARY_METRIC"],
    ["lost_contribution", lostContribution, "currency", "BUSINESS_IMPACT"],
    ["downtime_loss", totalLoss, "currency", "PRIMARY_DECISION"],
  ]);
  if (!outputs.ok) return outputs;
  const repairPriority = totalLoss.gt(v.repair_cost.times("3"));
  return ok({ status: repairPriority ? "REPAIR" : "OK", outputs: outputs.value, warnings: repairPriority ? ["Production loss exceeds three times the entered repair cost."] : [] });
};

const evaluateEnergyCostPerPart: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["average_machine_power_kw", "NON_NEGATIVE"], ["cycle_seconds_per_part", "NON_NEGATIVE"],
    ["auxiliary_kwh_per_part", "NON_NEGATIVE"], ["electricity_rate", "NON_NEGATIVE"],
    ["parts_per_batch", "POSITIVE_INTEGER"], ["batch_idle_kwh", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const processKwh = v.average_machine_power_kw.times(v.cycle_seconds_per_part).div("3600");
  const allocatedIdle = v.batch_idle_kwh.div(v.parts_per_batch);
  const totalKwh = processKwh.plus(v.auxiliary_kwh_per_part).plus(allocatedIdle);
  const cost = totalKwh.times(v.electricity_rate);
  const outputs = collectOutputs(context, [
    ["kwh_per_part", totalKwh, "kWh/part", "PRIMARY_DECISION"],
    ["energy_cost_per_part", cost, "currency/part", "BUSINESS_IMPACT"],
    ["allocated_idle_energy_per_part", allocatedIdle, "kWh/part", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const review = allocatedIdle.gt(processKwh);
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Allocated idle energy exceeds process energy per part."] : [] });
};

const evaluateQuoteMargin: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["direct_cost", "NON_NEGATIVE"], ["overhead_cost", "NON_NEGATIVE"],
    ["risk_allowance", "NON_NEGATIVE"], ["selling_price", "POSITIVE"],
    ["commission_percent", "PERCENT"], ["minimum_margin_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const commission = v.selling_price.times(v.commission_percent).div("100");
  const totalCost = v.direct_cost.plus(v.overhead_cost).plus(v.risk_allowance).plus(commission);
  if (totalCost.eq("0")) return domainError("quote_total_cost", "Total quote cost must be greater than zero to define markup.");
  const grossProfit = v.selling_price.minus(totalCost);
  const marginPercent = grossProfit.div(v.selling_price).times("100");
  const markupPercent = grossProfit.div(totalCost).times("100");
  const outputs = collectOutputs(context, [
    ["quote_total_cost", totalCost, "currency", "BUSINESS_IMPACT"],
    ["quote_margin_percent", marginPercent, "percent", "PRIMARY_DECISION"],
    ["quote_markup_percent", markupPercent, "percent", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const reprice = marginPercent.lt(v.minimum_margin_percent);
  return ok({ status: reprice ? "REPRICE" : "OK", outputs: outputs.value, warnings: reprice ? ["Quote margin is below the entered minimum margin."] : [] });
};

const evaluateConcreteOrder: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["length_m", "POSITIVE"], ["width_m", "POSITIVE"], ["depth_m", "POSITIVE"],
    ["waste_percent", "PERCENT"], ["truck_capacity_m3", "POSITIVE"],
    ["concrete_cost_per_m3", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const netVolume = v.length_m.times(v.width_m).times(v.depth_m);
  const orderVolume = netVolume.times(v.waste_percent.div("100").plus("1"));
  const truckLoads = orderVolume.div(v.truck_capacity_m3).round(0, 3);
  const materialCost = orderVolume.times(v.concrete_cost_per_m3);
  const outputs = collectOutputs(context, [
    ["net_concrete_volume_m3", netVolume, "m3", "SECONDARY_METRIC"],
    ["concrete_order_volume", orderVolume, "m3", "PRIMARY_DECISION"],
    ["estimated_truck_loads", truckLoads, "loads", "SECONDARY_METRIC"],
    ["concrete_material_cost", materialCost, "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.waste_percent.gt("12");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Waste allowance exceeds 12% and requires site justification."] : [] });
};

const evaluatePalletCbm: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["item_length_m", "POSITIVE"], ["item_width_m", "POSITIVE"], ["item_height_m", "POSITIVE"],
    ["item_quantity", "POSITIVE_INTEGER"], ["container_capacity_cbm", "POSITIVE"],
    ["void_allowance_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const itemCbm = v.item_length_m.times(v.item_width_m).times(v.item_height_m);
  const grossCbm = itemCbm.times(v.item_quantity).times(v.void_allowance_percent.div("100").plus("1"));
  const utilization = grossCbm.div(v.container_capacity_cbm).times("100");
  const outputs = collectOutputs(context, [
    ["item_cbm", itemCbm, "m3/unit", "SECONDARY_METRIC"],
    ["gross_load_cbm", grossCbm, "m3", "PRIMARY_DECISION"],
    ["load_utilization_percent", utilization, "percent", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const hold = utilization.gt("100");
  return ok({ status: hold ? "HOLD" : "OK", outputs: outputs.value, warnings: hold ? ["Volumetric load exceeds stated container capacity; geometry and mass constraints remain separate checks."] : [] });
};

const evaluateScrapCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["produced_quantity", "POSITIVE_INTEGER"], ["scrap_quantity", "NON_NEGATIVE"],
    ["material_cost_per_unit", "NON_NEGATIVE"], ["conversion_cost_per_unit", "NON_NEGATIVE"],
    ["reinspection_cost_per_scrap", "NON_NEGATIVE"], ["salvage_value_per_unit", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (!v.scrap_quantity.round(0, 0).eq(v.scrap_quantity)) return domainError("scrap_quantity", "Scrap quantity must be an integer.");
  if (v.scrap_quantity.gte(v.produced_quantity)) return domainError("scrap_quantity", "Scrap quantity must be less than produced quantity.");
  const grossCost = v.material_cost_per_unit.plus(v.conversion_cost_per_unit).plus(v.reinspection_cost_per_scrap);
  if (v.salvage_value_per_unit.gt(grossCost)) return domainError("salvage_value_per_unit", "Salvage value cannot exceed documented scrap cost per unit.");
  const scrapRate = v.scrap_quantity.div(v.produced_quantity);
  const scrapLoss = v.scrap_quantity.times(grossCost.minus(v.salvage_value_per_unit));
  const lossPerGood = scrapLoss.div(v.produced_quantity.minus(v.scrap_quantity));
  const outputs = collectOutputs(context, [
    ["scrap_rate", scrapRate, "ratio", "PRIMARY_DECISION"],
    ["scrap_loss", scrapLoss, "currency", "BUSINESS_IMPACT"],
    ["loss_per_good_unit", lossPerGood, "currency/good unit", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const review = scrapRate.gt("0.05");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Scrap rate exceeds 5%."] : [] });
};

const evaluateSetupCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["setup_minutes", "NON_NEGATIVE"], ["machine_hourly_rate", "NON_NEGATIVE"],
    ["labor_hourly_rate", "NON_NEGATIVE"], ["batch_quantity", "POSITIVE_INTEGER"],
    ["changeovers_per_month", "NON_NEGATIVE"], ["target_setup_cost_per_part", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const setupCost = v.setup_minutes.div("60").times(v.machine_hourly_rate.plus(v.labor_hourly_rate));
  const perPart = setupCost.div(v.batch_quantity);
  const monthly = setupCost.times(v.changeovers_per_month);
  const outputs = collectOutputs(context, [
    ["setup_cost_per_changeover", setupCost, "currency", "SECONDARY_METRIC"],
    ["setup_cost_per_part", perPart, "currency/part", "PRIMARY_DECISION"],
    ["monthly_setup_burden", monthly, "currency/month", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const reprice = perPart.gt(v.target_setup_cost_per_part);
  return ok({ status: reprice ? "REPRICE" : "OK", outputs: outputs.value, warnings: reprice ? ["Setup cost per part exceeds the entered target."] : [] });
};

const evaluateLineBalance: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["total_task_time_seconds", "POSITIVE"], ["number_of_stations", "POSITIVE_INTEGER"],
    ["line_cycle_time_seconds", "POSITIVE"], ["labor_cost_per_hour_per_station", "NON_NEGATIVE"],
    ["shift_hours", "POSITIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const availableWork = v.number_of_stations.times(v.line_cycle_time_seconds);
  const efficiency = v.total_task_time_seconds.div(availableWork);
  if (efficiency.gt("1")) return domainError("total_task_time_seconds", "Task content exceeds station-cycle capacity.");
  const delay = BigOne(efficiency).minus(efficiency);
  const idleCost = delay.times(v.number_of_stations).times(v.labor_cost_per_hour_per_station).times(v.shift_hours);
  const outputs = collectOutputs(context, [
    ["line_efficiency_percent", efficiency.times("100"), "percent", "PRIMARY_DECISION"],
    ["balance_delay_percent", delay.times("100"), "percent", "SECONDARY_METRIC"],
    ["daily_idle_cost", idleCost, "currency/day", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const repair = efficiency.lt("0.75");
  return ok({ status: repair ? "REPAIR" : "OK", outputs: outputs.value, warnings: repair ? ["Line balance efficiency is below 75%."] : [] });
};

function BigOne(reference: Decimal): Decimal {
  return reference.minus(reference).plus("1");
}

const evaluateMotorCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["motor_power_kw", "POSITIVE"], ["load_factor_percent", "PERCENT"],
    ["motor_efficiency_percent", "PERCENT"], ["operating_hours", "NON_NEGATIVE"],
    ["electricity_rate", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.motor_efficiency_percent.eq("0")) return domainError("motor_efficiency_percent", "Motor efficiency must be greater than zero.");
  const inputPower = v.motor_power_kw.times(v.load_factor_percent).div(v.motor_efficiency_percent);
  const energy = inputPower.times(v.operating_hours);
  const cost = energy.times(v.electricity_rate);
  const outputs = collectOutputs(context, [
    ["input_power_kw", inputPower, "kW", "SECONDARY_METRIC"],
    ["energy_kwh", energy, "kWh", "PRIMARY_DECISION"],
    ["motor_energy_cost", cost, "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.motor_efficiency_percent.lt("75");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Entered motor efficiency is below 75%."] : [] });
};

const evaluateInventoryCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["average_inventory_value", "POSITIVE"], ["capital_cost_percent", "PERCENT"],
    ["annual_storage_cost", "NON_NEGATIVE"], ["insurance_tax_percent", "PERCENT"],
    ["shrinkage_percent", "PERCENT"], ["obsolescence_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const percentageBurden = v.capital_cost_percent.plus(v.insurance_tax_percent).plus(v.shrinkage_percent).plus(v.obsolescence_percent);
  const annual = v.average_inventory_value.times(percentageBurden).div("100").plus(v.annual_storage_cost);
  const rate = annual.div(v.average_inventory_value).times("100");
  const outputs = collectOutputs(context, [
    ["annual_carrying_cost", annual, "currency/year", "PRIMARY_DECISION"],
    ["carrying_rate_percent", rate, "percent", "SECONDARY_METRIC"],
    ["monthly_inventory_burden", annual.div("12"), "currency/month", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const hold = rate.gt("30");
  return ok({ status: hold ? "HOLD" : "OK", outputs: outputs.value, warnings: hold ? ["Annual carrying rate exceeds 30%."] : [] });
};

const evaluateFreightCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["distance_km", "NON_NEGATIVE"], ["rate_per_km", "NON_NEGATIVE"], ["fixed_trip_cost", "NON_NEGATIVE"],
    ["waiting_cost", "NON_NEGATIVE"], ["fuel_surcharge_percent", "PERCENT"],
    ["units_shipped", "POSITIVE_INTEGER"], ["economic_minimum_units", "POSITIVE_INTEGER"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const base = v.distance_km.times(v.rate_per_km).plus(v.fixed_trip_cost).plus(v.waiting_cost);
  const surcharge = base.times(v.fuel_surcharge_percent).div("100");
  const total = base.plus(surcharge);
  const outputs = collectOutputs(context, [
    ["total_trip_freight_cost", total, "currency/trip", "PRIMARY_DECISION"],
    ["freight_cost_per_unit", total.div(v.units_shipped), "currency/unit", "BUSINESS_IMPACT"],
    ["fuel_surcharge_value", surcharge, "currency", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const reprice = v.units_shipped.lt(v.economic_minimum_units);
  return ok({ status: reprice ? "REPRICE" : "OK", outputs: outputs.value, warnings: reprice ? ["Shipment quantity is below the entered economic minimum."] : [] });
};

const evaluateEmployeeCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["gross_salary", "POSITIVE"], ["employer_tax_percent", "PERCENT"],
    ["monthly_benefits_cost", "NON_NEGATIVE"], ["monthly_insurance_cost", "NON_NEGATIVE"],
    ["monthly_severance_accrual", "NON_NEGATIVE"], ["monthly_overtime_cost", "NON_NEGATIVE"],
    ["monthly_productive_hours", "POSITIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const loaded = v.gross_salary.times(v.employer_tax_percent.div("100").plus("1"))
    .plus(v.monthly_benefits_cost).plus(v.monthly_insurance_cost).plus(v.monthly_severance_accrual).plus(v.monthly_overtime_cost);
  const outputs = collectOutputs(context, [
    ["loaded_employee_monthly_cost", loaded, "currency/month", "PRIMARY_DECISION"],
    ["loaded_employee_cost", loaded.div(v.monthly_productive_hours), "currency/hour", "BUSINESS_IMPACT"],
    ["burden_multiplier", loaded.div(v.gross_salary), "ratio", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.monthly_productive_hours.lt("120");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Monthly productive hours are below 120."] : [] });
};

const evaluateBreakEven: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["monthly_fixed_cost", "NON_NEGATIVE"], ["selling_price_per_unit", "POSITIVE"],
    ["variable_cost_per_unit", "NON_NEGATIVE"], ["target_monthly_profit", "NON_NEGATIVE"],
    ["expected_sales_units", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const contribution = v.selling_price_per_unit.minus(v.variable_cost_per_unit);
  if (contribution.lte("0")) return domainError("unit_contribution_margin", "Selling price must exceed variable cost.");
  const breakEven = v.monthly_fixed_cost.div(contribution);
  const target = v.monthly_fixed_cost.plus(v.target_monthly_profit).div(contribution);
  const outputs = collectOutputs(context, [
    ["unit_contribution_margin", contribution, "currency/unit", "SECONDARY_METRIC"],
    ["break_even_units", breakEven, "units", "PRIMARY_DECISION"],
    ["target_profit_units", target, "units", "SECONDARY_METRIC"],
    ["safety_margin_units", v.expected_sales_units.minus(breakEven), "units", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const hold = v.expected_sales_units.lt(breakEven);
  return ok({ status: hold ? "HOLD" : "OK", outputs: outputs.value, warnings: hold ? ["Expected sales are below break-even volume."] : [] });
};

const evaluateCustomerProfitability: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["customer_revenue", "POSITIVE"], ["product_cost", "NON_NEGATIVE"], ["service_cost", "NON_NEGATIVE"],
    ["return_rework_cost", "NON_NEGATIVE"], ["logistics_cost", "NON_NEGATIVE"],
    ["payment_delay_cost", "NON_NEGATIVE"], ["sales_support_cost", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const total = v.product_cost.plus(v.service_cost).plus(v.return_rework_cost).plus(v.logistics_cost).plus(v.payment_delay_cost).plus(v.sales_support_cost);
  const profit = v.customer_revenue.minus(total);
  const margin = profit.div(v.customer_revenue).times("100");
  const outputs = collectOutputs(context, [
    ["customer_total_hidden_cost", total, "currency", "BUSINESS_IMPACT"],
    ["customer_profit", profit, "currency", "PRIMARY_DECISION"],
    ["customer_profit_margin_percent", margin, "percent", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const reprice = profit.lt("0");
  return ok({ status: reprice ? "REPRICE" : "OK", outputs: outputs.value, warnings: reprice ? ["Customer profit is negative after entered service costs."] : [] });
};

const evaluateMachiningCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["machine_hourly_rate", "NON_NEGATIVE"], ["labor_hourly_rate", "NON_NEGATIVE"],
    ["setup_minutes", "NON_NEGATIVE"], ["cycle_seconds", "NON_NEGATIVE"],
    ["batch_quantity", "POSITIVE_INTEGER"], ["material_cost_per_blank", "NON_NEGATIVE"],
    ["tooling_cost_per_edge", "NON_NEGATIVE"], ["edge_life_parts", "POSITIVE_INTEGER"],
    ["overhead_percent", "PERCENT"], ["scrap_percent", "PERCENT"], ["target_margin_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.scrap_percent.gte("100")) return domainError("scrap_percent", "Scrap percent must be below 100%.");
  if (v.target_margin_percent.gte("100")) return domainError("target_margin_percent", "Target margin must be below 100%.");
  const timeHours = v.setup_minutes.div("60").div(v.batch_quantity).plus(v.cycle_seconds.div("3600"));
  const machineCost = timeHours.times(v.machine_hourly_rate);
  const laborCost = timeHours.times(v.labor_hourly_rate);
  const toolCost = v.tooling_cost_per_edge.div(v.edge_life_parts);
  const direct = v.material_cost_per_blank.plus(machineCost).plus(laborCost).plus(toolCost);
  const overhead = direct.times(v.overhead_percent).div("100");
  const preScrap = direct.plus(overhead);
  const cost = preScrap.div(BigOne(v.scrap_percent).minus(v.scrap_percent.div("100")));
  const quote = cost.div(BigOne(v.target_margin_percent).minus(v.target_margin_percent.div("100")));
  const batchMargin = quote.minus(cost).times(v.batch_quantity);
  const outputs = collectOutputs(context, [
    ["cost_per_part", cost, "currency/part", "PRIMARY_DECISION"],
    ["quote_price_per_part", quote, "currency/part", "SECONDARY_METRIC"],
    ["batch_margin_value", batchMargin, "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.scrap_percent.gt("8");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Scrap allowance exceeds 8%."] : [] });
};

const evaluateCncShopRate: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["annual_fixed_cost", "NON_NEGATIVE"], ["annual_depreciation", "NON_NEGATIVE"],
    ["annual_maintenance_cost", "NON_NEGATIVE"], ["annual_floor_cost", "NON_NEGATIVE"],
    ["annual_admin_allocation", "NON_NEGATIVE"], ["annual_operator_cost", "NON_NEGATIVE"],
    ["annual_available_machine_hours", "POSITIVE"], ["utilization_percent", "PERCENT"],
    ["average_power_kw", "NON_NEGATIVE"], ["electricity_rate", "NON_NEGATIVE"],
    ["consumables_per_hour", "NON_NEGATIVE"], ["current_shop_rate", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.utilization_percent.eq("0")) return domainError("utilization_percent", "Utilization must be greater than zero.");
  const productiveHours = v.annual_available_machine_hours.times(v.utilization_percent).div("100");
  const annualCost = v.annual_fixed_cost.plus(v.annual_depreciation).plus(v.annual_maintenance_cost)
    .plus(v.annual_floor_cost).plus(v.annual_admin_allocation).plus(v.annual_operator_cost);
  const fixedHourly = annualCost.div(productiveHours);
  const variableHourly = v.average_power_kw.times(v.electricity_rate).plus(v.consumables_per_hour);
  const trueRate = fixedHourly.plus(variableHourly);
  const rateGap = trueRate.minus(v.current_shop_rate);
  const exposure = rateGap.gt("0") ? rateGap.times(productiveHours) : rateGap.minus(rateGap);
  const outputs = collectOutputs(context, [
    ["true_hourly_rate", trueRate, "currency/hour", "PRIMARY_DECISION"],
    ["fixed_hourly_burden", fixedHourly, "currency/hour", "SECONDARY_METRIC"],
    ["variable_hourly_burden", variableHourly, "currency/hour", "SECONDARY_METRIC"],
    ["annual_underpricing_exposure", exposure, "currency/year", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.utilization_percent.lt("45");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Utilization is below 45%."] : [] });
};

const evaluateMaterialRemoval: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["width_of_cut_mm", "POSITIVE"], ["depth_of_cut_mm", "POSITIVE"], ["feed_rate_mm_min", "POSITIVE"],
    ["material_density_kg_m3", "POSITIVE"], ["machine_hourly_rate", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const mrrMm3Min = v.width_of_cut_mm.times(v.depth_of_cut_mm).times(v.feed_rate_mm_min);
  const mrrCm3Min = mrrMm3Min.div("1000");
  const massKgHour = mrrMm3Min.times("60").times(v.material_density_kg_m3).div("1000000000");
  const outputs = collectOutputs(context, [
    ["mrr_cm3_min", mrrCm3Min, "cm3/min", "PRIMARY_DECISION"],
    ["mass_removal_kg_hour", massKgHour, "kg/hour", "SECONDARY_METRIC"],
    ["machine_cost_per_removed_kg", v.machine_hourly_rate.div(massKgHour), "currency/kg", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  return ok({ status: "OK", outputs: outputs.value, warnings: [] });
};

const evaluateCompressedAirLeak: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["estimated_leak_flow_cfm", "POSITIVE"], ["compressor_specific_power_kw_per_cfm", "POSITIVE"],
    ["annual_operating_hours", "POSITIVE"], ["electricity_rate", "POSITIVE"],
    ["estimated_repair_cost", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const wasted = v.estimated_leak_flow_cfm.times(v.compressor_specific_power_kw_per_cfm).times(v.annual_operating_hours);
  const annualCost = wasted.times(v.electricity_rate);
  const payback = v.estimated_repair_cost.times("12").div(annualCost);
  const outputs = collectOutputs(context, [
    ["annual_wasted_kwh", wasted, "kWh/year", "SECONDARY_METRIC"],
    ["annual_leak_cost", annualCost, "currency/year", "PRIMARY_DECISION"],
    ["repair_payback_months", payback, "months", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const repair = payback.lt("6");
  return ok({ status: repair ? "REPAIR" : "OK", outputs: outputs.value, warnings: repair ? ["Entered repair cost pays back in under six months."] : [] });
};

const evaluateCarbonExposure: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["exposed_emissions_tco2e", "NON_NEGATIVE"], ["low_carbon_price", "NON_NEGATIVE"],
    ["base_carbon_price", "NON_NEGATIVE"], ["high_carbon_price", "NON_NEGATIVE"],
    ["customer_pass_through_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.low_carbon_price.gt(v.base_carbon_price) || v.base_carbon_price.gt(v.high_carbon_price)) {
    return domainError("base_carbon_price", "Carbon price scenarios must satisfy low <= base <= high.");
  }
  const retainedShare = BigOne(v.customer_pass_through_percent).minus(v.customer_pass_through_percent.div("100"));
  const low = v.exposed_emissions_tco2e.times(v.low_carbon_price).times(retainedShare);
  const base = v.exposed_emissions_tco2e.times(v.base_carbon_price).times(retainedShare);
  const high = v.exposed_emissions_tco2e.times(v.high_carbon_price).times(retainedShare);
  const outputs = collectOutputs(context, [
    ["low_case_exposure", low, "currency", "SECONDARY_METRIC"],
    ["carbon_price_exposure", base, "currency", "PRIMARY_DECISION"],
    ["high_case_exposure", high, "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const hold = base.gt("0") && high.gt(base.times("1.5"));
  return ok({ status: hold ? "HOLD" : "OK", outputs: outputs.value, warnings: hold ? ["High-price exposure exceeds 150% of base exposure."] : [] });
};

const evaluatePaymentTermCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["invoice_amount", "POSITIVE"], ["payment_term_days", "NON_NEGATIVE"],
    ["annual_finance_rate_percent", "PERCENT"], ["default_risk_percent", "PERCENT"],
    ["cash_discount_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const financeCost = v.invoice_amount.times(v.annual_finance_rate_percent).times(v.payment_term_days).div("36500");
  const expectedDefaultCost = v.invoice_amount.times(v.default_risk_percent).div("100");
  const discountCost = v.invoice_amount.times(v.cash_discount_percent).div("100");
  const total = financeCost.plus(expectedDefaultCost).plus(discountCost);
  const outputs = collectOutputs(context, [
    ["finance_cost", financeCost, "currency", "SECONDARY_METRIC"],
    ["expected_default_cost", expectedDefaultCost, "currency", "BUSINESS_IMPACT"],
    ["payment_term_cost", total, "currency", "PRIMARY_DECISION"],
  ]);
  if (!outputs.ok) return outputs;
  const reprice = total.div(v.invoice_amount).gt("0.03");
  return ok({ status: reprice ? "REPRICE" : "OK", outputs: outputs.value, warnings: reprice ? ["Payment-term cost exceeds 3% of invoice value."] : [] });
};

const evaluateMachinePayback: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["machine_capex", "POSITIVE"], ["installation_cost", "NON_NEGATIVE"],
    ["annual_labor_savings", "NON_NEGATIVE"], ["annual_scrap_savings", "NON_NEGATIVE"],
    ["annual_extra_margin", "NON_NEGATIVE"], ["annual_incremental_maintenance", "NON_NEGATIVE"],
    ["residual_value", "NON_NEGATIVE"], ["maximum_payback_months", "POSITIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const grossInvestment = v.machine_capex.plus(v.installation_cost);
  if (v.residual_value.gt(grossInvestment)) {
    return domainError("residual_value", "Immediate trade-in or disposal credit cannot exceed capital plus installation cost.");
  }
  const netInvestment = grossInvestment.minus(v.residual_value);
  const annualNetBenefit = v.annual_labor_savings.plus(v.annual_scrap_savings).plus(v.annual_extra_margin).minus(v.annual_incremental_maintenance);
  if (annualNetBenefit.lte("0")) {
    return domainError("annual_incremental_maintenance", "Documented annual net benefit must be greater than zero for simple payback.");
  }
  const paybackMonths = netInvestment.times("12").div(annualNetBenefit);
  const outputs = collectOutputs(context, [
    ["net_investment", netInvestment, "currency", "SECONDARY_METRIC"],
    ["annual_net_benefit", annualNetBenefit, "currency/year", "BUSINESS_IMPACT"],
    ["payback_months", paybackMonths, "months", "PRIMARY_DECISION"],
  ]);
  if (!outputs.ok) return outputs;
  const hold = paybackMonths.gt(v.maximum_payback_months);
  return ok({ status: hold ? "HOLD" : "OK", outputs: outputs.value, warnings: hold ? ["Simple payback exceeds the entered maximum payback period."] : [] });
};

const evaluateCurrencyAdjustedPricing: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["base_cost_local_currency", "NON_NEGATIVE"], ["current_fx_rate", "POSITIVE"],
    ["quote_fx_rate", "POSITIVE"], ["fx_buffer_percent", "PERCENT"],
    ["target_margin_percent", "PERCENT"], ["freight_cost_local_currency", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.target_margin_percent.gte("100")) return domainError("target_margin_percent", "Target margin must be below 100%.");
  const bufferedFxFactor = BigOne(v.fx_buffer_percent).plus(v.fx_buffer_percent.div("100"));
  const adjustedCost = v.base_cost_local_currency.times(v.current_fx_rate).div(v.quote_fx_rate).times(bufferedFxFactor).plus(v.freight_cost_local_currency);
  if (adjustedCost.lte("0")) return domainError("base_cost_local_currency", "FX-adjusted cost must be greater than zero.");
  const quotePrice = adjustedCost.div(BigOne(v.target_margin_percent).minus(v.target_margin_percent.div("100")));
  const movement = v.current_fx_rate.minus(v.quote_fx_rate).abs().div(v.quote_fx_rate);
  const riskValue = v.base_cost_local_currency.times(movement);
  const outputs = collectOutputs(context, [
    ["fx_adjusted_cost", adjustedCost, "currency", "SECONDARY_METRIC"],
    ["currency_adjusted_price", quotePrice, "currency", "PRIMARY_DECISION"],
    ["fx_risk_value", riskValue, "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const reprice = v.fx_buffer_percent.lt("2") && movement.gt("0.05");
  return ok({ status: reprice ? "REPRICE" : "OK", outputs: outputs.value, warnings: reprice ? ["FX movement exceeds 5% while the entered FX buffer is below 2%."] : [] });
};

const evaluateEoq: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["annual_demand_units", "POSITIVE"], ["ordering_cost_per_order", "POSITIVE"],
    ["unit_cost", "POSITIVE"], ["annual_carrying_rate_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.annual_carrying_rate_percent.eq("0")) return domainError("annual_carrying_rate_percent", "Annual carrying rate must be greater than zero.");
  const holdingCostPerUnitYear = v.unit_cost.times(v.annual_carrying_rate_percent).div("100");
  const quantity = v.annual_demand_units.times(v.ordering_cost_per_order).times("2").div(holdingCostPerUnitYear).sqrt();
  const annualOrderingCost = v.annual_demand_units.div(quantity).times(v.ordering_cost_per_order);
  const annualHoldingCost = quantity.div("2").times(holdingCostPerUnitYear);
  const outputs = collectOutputs(context, [
    ["economic_order_quantity", quantity, "units", "PRIMARY_DECISION"],
    ["annual_ordering_cost", annualOrderingCost, "currency/year", "SECONDARY_METRIC"],
    ["annual_holding_cost", annualHoldingCost, "currency/year", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.annual_carrying_rate_percent.gt("35");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Annual carrying rate exceeds 35%; verify the inventory-cost basis."] : [] });
};

const evaluateSafetyStock: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["average_daily_demand", "POSITIVE"], ["lead_time_days", "POSITIVE"],
    ["daily_demand_std_dev", "NON_NEGATIVE"], ["lead_time_std_dev_days", "NON_NEGATIVE"],
    ["service_level_z_score", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const variance = v.lead_time_days.times(v.daily_demand_std_dev.pow(2))
    .plus(v.average_daily_demand.pow(2).times(v.lead_time_std_dev_days.pow(2)));
  const safetyStock = v.service_level_z_score.times(variance.sqrt());
  const leadTimeDemand = v.average_daily_demand.times(v.lead_time_days);
  const reorderPoint = leadTimeDemand.plus(safetyStock);
  const outputs = collectOutputs(context, [
    ["safety_stock_units", safetyStock, "units", "SECONDARY_METRIC"],
    ["reorder_point_units", reorderPoint, "units", "PRIMARY_DECISION"],
    ["cycle_stock_days", reorderPoint.div(v.average_daily_demand), "days", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.service_level_z_score.gt("2.05");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Entered z-score exceeds 2.05; verify the service-level policy and distribution assumption."] : [] });
};

const evaluateRecipePricing: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["ingredient_cost_per_batch", "POSITIVE"], ["batch_yield_portions", "POSITIVE"],
    ["kitchen_waste_percent", "PERCENT"], ["labor_cost_per_portion", "NON_NEGATIVE"],
    ["overhead_cost_per_portion", "NON_NEGATIVE"], ["target_food_cost_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.kitchen_waste_percent.gte("100")) return domainError("kitchen_waste_percent", "Kitchen waste must be below 100%.");
  if (v.target_food_cost_percent.lte("0") || v.target_food_cost_percent.gte("100")) {
    return domainError("target_food_cost_percent", "Target food-cost percentage must be greater than zero and below 100%.");
  }
  const yieldFactor = BigOne(v.kitchen_waste_percent).minus(v.kitchen_waste_percent.div("100"));
  const effectivePortions = v.batch_yield_portions.times(yieldFactor);
  const foodCost = v.ingredient_cost_per_batch.div(effectivePortions);
  const loadedCost = foodCost.plus(v.labor_cost_per_portion).plus(v.overhead_cost_per_portion);
  const menuPrice = foodCost.div(v.target_food_cost_percent.div("100"));
  const warnings: string[] = [];
  if (v.kitchen_waste_percent.gt("12")) warnings.push("Kitchen waste exceeds 12%; verify recipe yield and preparation loss.");
  if (menuPrice.lt(loadedCost)) warnings.push("Food-cost target produces a menu price below loaded cost; reprice or revise the target.");
  const outputs = collectOutputs(context, [
    ["food_cost_per_portion", foodCost, "currency/portion", "SECONDARY_METRIC"],
    ["total_cost_per_portion", loadedCost, "currency/portion", "BUSINESS_IMPACT"],
    ["menu_price", menuPrice, "currency/portion", "PRIMARY_DECISION"],
  ]);
  if (!outputs.ok) return outputs;
  return ok({ status: warnings.length > 0 ? "REPRICE" : "OK", outputs: outputs.value, warnings });
};

const evaluateFabricConsumption: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["garment_area_m2", "POSITIVE"], ["fabric_gsm", "POSITIVE"],
    ["marker_efficiency_percent", "PERCENT"], ["fabric_cost_per_kg", "NON_NEGATIVE"],
    ["shrinkage_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.marker_efficiency_percent.eq("0")) return domainError("marker_efficiency_percent", "Marker efficiency must be greater than zero.");
  const markerEfficiency = v.marker_efficiency_percent.div("100");
  const shrinkageFactor = BigOne(v.shrinkage_percent).plus(v.shrinkage_percent.div("100"));
  const effectiveArea = v.garment_area_m2.div(markerEfficiency).times(shrinkageFactor);
  const fabricKg = effectiveArea.times(v.fabric_gsm).div("1000");
  const fabricCost = fabricKg.times(v.fabric_cost_per_kg);
  const outputs = collectOutputs(context, [
    ["effective_fabric_area_m2", effectiveArea, "m2", "SECONDARY_METRIC"],
    ["fabric_consumption_kg", fabricKg, "kg", "PRIMARY_DECISION"],
    ["fabric_consumption_cost", fabricCost, "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.marker_efficiency_percent.lt("78");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Marker efficiency is below 78%; verify marker utilization and fabric waste."] : [] });
};

const evaluateOee: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["planned_production_minutes", "POSITIVE"], ["downtime_minutes", "NON_NEGATIVE"],
    ["ideal_cycle_seconds", "POSITIVE"], ["total_count", "POSITIVE_INTEGER"],
    ["good_count", "NON_NEGATIVE"], ["contribution_margin_per_good_unit", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (!v.good_count.round(0, 0).eq(v.good_count)) return domainError("good_count", "Good count must be an integer.");
  if (v.good_count.gt(v.total_count)) return domainError("good_count", "Good count cannot exceed total count.");
  if (v.downtime_minutes.gte(v.planned_production_minutes)) return domainError("downtime_minutes", "Downtime must be less than planned production time.");
  const operatingMinutes = v.planned_production_minutes.minus(v.downtime_minutes);
  const availability = operatingMinutes.div(v.planned_production_minutes);
  const performance = v.ideal_cycle_seconds.times(v.total_count).div(operatingMinutes.times("60"));
  if (performance.gt("1")) return domainError("ideal_cycle_seconds", "Ideal cycle, total count and operating time imply performance above 100%.");
  const quality = v.good_count.div(v.total_count);
  const oee = availability.times(performance).times(quality);
  const idealPlannedCapacity = v.planned_production_minutes.times("60").div(v.ideal_cycle_seconds);
  const opportunityUnits = idealPlannedCapacity.minus(v.good_count);
  const opportunityLoss = opportunityUnits.times(v.contribution_margin_per_good_unit);
  const outputs = collectOutputs(context, [
    ["availability", availability, "ratio", "SECONDARY_METRIC"],
    ["performance", performance, "ratio", "SECONDARY_METRIC"],
    ["quality", quality, "ratio", "SECONDARY_METRIC"],
    ["oee_percent", oee.times("100"), "percent", "PRIMARY_DECISION"],
    ["estimated_hidden_factory_loss", opportunityLoss, "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const repair = oee.lt("0.65");
  return ok({ status: repair ? "REPAIR" : "OK", outputs: outputs.value, warnings: repair ? ["OEE is below 65%; investigate availability, performance and quality losses."] : [] });
};

const evaluateTaktCapacity: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["available_production_minutes", "POSITIVE"], ["customer_demand_units", "POSITIVE"],
    ["actual_cycle_seconds", "POSITIVE"], ["expected_uptime_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.expected_uptime_percent.eq("0")) return domainError("expected_uptime_percent", "Expected uptime must be greater than zero.");
  const availableSeconds = v.available_production_minutes.times("60");
  const takt = availableSeconds.div(v.customer_demand_units);
  const uptime = v.expected_uptime_percent.div("100");
  const effectiveCycle = v.actual_cycle_seconds.div(uptime);
  const capacityGap = effectiveCycle.minus(takt);
  const capacityUnits = availableSeconds.div(effectiveCycle);
  const outputs = collectOutputs(context, [
    ["takt_time_seconds", takt, "s/unit", "SECONDARY_METRIC"],
    ["effective_cycle_seconds", effectiveCycle, "s/unit", "SECONDARY_METRIC"],
    ["capacity_gap_seconds", capacityGap, "s/unit", "PRIMARY_DECISION"],
    ["capacity_units", capacityUnits, "units", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const hold = capacityGap.gt("0");
  return ok({ status: hold ? "HOLD" : "OK", outputs: outputs.value, warnings: hold ? ["Effective cycle time exceeds takt time; entered demand cannot be met within available time."] : [] });
};

const evaluateReworkVsScrap: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["rework_labor_cost", "NON_NEGATIVE"], ["rework_material_cost", "NON_NEGATIVE"],
    ["reinspection_cost", "NON_NEGATIVE"], ["rework_success_probability_percent", "PERCENT"],
    ["scrap_replacement_cost", "NON_NEGATIVE"], ["delivery_penalty_cost", "NON_NEGATIVE"],
    ["scrap_salvage_credit", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const grossScrapConsequence = v.scrap_replacement_cost.plus(v.delivery_penalty_cost);
  if (v.scrap_salvage_credit.gt(grossScrapConsequence)) return domainError("scrap_salvage_credit", "Scrap salvage credit cannot exceed replacement plus delivery consequence.");
  const failureProbability = BigOne(v.rework_success_probability_percent).minus(v.rework_success_probability_percent.div("100"));
  const expectedRework = v.rework_labor_cost.plus(v.rework_material_cost).plus(v.reinspection_cost)
    .plus(failureProbability.times(grossScrapConsequence));
  const immediateScrap = grossScrapConsequence.minus(v.scrap_salvage_credit);
  const decisionDelta = immediateScrap.minus(expectedRework);
  const outputs = collectOutputs(context, [
    ["expected_rework_cost", expectedRework, "currency", "SECONDARY_METRIC"],
    ["immediate_scrap_cost", immediateScrap, "currency", "BUSINESS_IMPACT"],
    ["decision_delta", decisionDelta, "currency", "PRIMARY_DECISION"],
  ]);
  if (!outputs.ok) return outputs;
  const scrapPreferred = decisionDelta.lt("0");
  return ok({ status: scrapPreferred ? "HOLD" : "REPAIR", outputs: outputs.value, warnings: scrapPreferred ? ["Immediate scrap has lower expected cost than the entered rework path."] : [] });
};

const evaluateWeldingCost: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["travel_speed_mm_min", "POSITIVE"], ["arc_on_ratio_percent", "PERCENT"],
    ["labor_hourly_rate", "NON_NEGATIVE"], ["machine_hourly_rate", "NON_NEGATIVE"],
    ["consumable_kg_per_meter", "NON_NEGATIVE"], ["consumable_cost_per_kg", "NON_NEGATIVE"],
    ["shielding_gas_cost_per_meter", "NON_NEGATIVE"], ["energy_cost_per_meter", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.arc_on_ratio_percent.eq("0")) return domainError("arc_on_ratio_percent", "Arc-on ratio must be greater than zero.");
  const minutesPerMeter = v.travel_speed_mm_min.times(v.arc_on_ratio_percent.div("100")).div("1000").pow(-1);
  const laborMachineCost = minutesPerMeter.div("60").times(v.labor_hourly_rate.plus(v.machine_hourly_rate));
  const consumableCost = v.consumable_kg_per_meter.times(v.consumable_cost_per_kg);
  const total = laborMachineCost.plus(consumableCost).plus(v.shielding_gas_cost_per_meter).plus(v.energy_cost_per_meter);
  if (total.eq("0")) return domainError("welding_cost_per_meter", "At least one documented welding cost driver must be greater than zero.");
  const outputs = collectOutputs(context, [
    ["minutes_per_meter", minutesPerMeter, "min/m", "SECONDARY_METRIC"],
    ["welding_cost_per_meter", total, "currency/m", "PRIMARY_DECISION"],
    ["consumable_cost_share", consumableCost.div(total), "ratio", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.arc_on_ratio_percent.lt("25");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Arc-on ratio is below 25%; verify handling and setup allowance."] : [] });
};

const evaluateWeldingHeatInput: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["arc_voltage_v", "POSITIVE"], ["welding_current_a", "POSITIVE"],
    ["travel_speed_mm_min", "POSITIVE"], ["process_efficiency_percent", "PERCENT"],
    ["user_verified_max_heat_input_kj_mm", "POSITIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.process_efficiency_percent.eq("0")) return domainError("process_efficiency_percent", "Process efficiency must be greater than zero.");
  const heatInput = v.arc_voltage_v.times(v.welding_current_a).times("60").times(v.process_efficiency_percent)
    .div(v.travel_speed_mm_min.times("100000"));
  const utilization = heatInput.div(v.user_verified_max_heat_input_kj_mm);
  const outputs = collectOutputs(context, [
    ["heat_input_kj_mm", heatInput, "kJ/mm", "PRIMARY_DECISION"],
    ["heat_input_limit_utilization", utilization, "ratio", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  if (utilization.gt("1")) return ok({ status: "HOLD", outputs: outputs.value, warnings: ["Calculated heat input exceeds the user-verified maximum."] });
  const review = utilization.gt("0.9");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Heat input exceeds 90% of the user-verified maximum."] : [] });
};

const evaluateElectricityEmissions: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["electricity_kwh", "NON_NEGATIVE"], ["user_verified_grid_factor_kgco2e_kwh", "NON_NEGATIVE"],
    ["renewable_share_percent", "PERCENT"], ["evidence_confidence_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const residualShare = BigOne(v.renewable_share_percent).minus(v.renewable_share_percent.div("100"));
  const emissionsKg = v.electricity_kwh.times(v.user_verified_grid_factor_kgco2e_kwh).times(residualShare);
  const confidence = v.evidence_confidence_percent.div("100");
  const outputs = collectOutputs(context, [
    ["electricity_emissions_kgco2e", emissionsKg, "kgCO2e", "SECONDARY_METRIC"],
    ["electricity_emissions_tco2e", emissionsKg.div("1000"), "tCO2e", "PRIMARY_DECISION"],
    ["evidence_confidence_index", confidence, "ratio", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = confidence.lt("0.75");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Evidence confidence is below 75%; do not use the screening result for external reporting."] : [] });
};

const evaluateDieselEmissions: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["fuel_volume_liters", "NON_NEGATIVE"], ["user_verified_emission_factor_kgco2e_liter", "NON_NEGATIVE"],
    ["bio_blend_reduction_percent", "PERCENT"], ["payload_ton_km", "POSITIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const retainedFactor = BigOne(v.bio_blend_reduction_percent).minus(v.bio_blend_reduction_percent.div("100"));
  const emissionsKg = v.fuel_volume_liters.times(v.user_verified_emission_factor_kgco2e_liter).times(retainedFactor);
  const outputs = collectOutputs(context, [
    ["fuel_emissions_kgco2e", emissionsKg, "kgCO2e", "SECONDARY_METRIC"],
    ["fuel_emissions_tco2e", emissionsKg.div("1000"), "tCO2e", "PRIMARY_DECISION"],
    ["emission_intensity_kgco2e_ton_km", emissionsKg.div(v.payload_ton_km), "kgCO2e/ton-km", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  return ok({ status: "OK", outputs: outputs.value, warnings: [] });
};

const evaluateProductFootprint: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["scope1_emissions_kgco2e", "NON_NEGATIVE"], ["scope2_emissions_kgco2e", "NON_NEGATIVE"],
    ["allocated_process_emissions_kgco2e", "NON_NEGATIVE"], ["production_units", "POSITIVE"],
    ["scrap_rate_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.scrap_rate_percent.gte("100")) return domainError("scrap_rate_percent", "Scrap rate must be below 100%.");
  const totalEmissions = v.scope1_emissions_kgco2e.plus(v.scope2_emissions_kgco2e).plus(v.allocated_process_emissions_kgco2e);
  const goodShare = BigOne(v.scrap_rate_percent).minus(v.scrap_rate_percent.div("100"));
  const goodUnits = v.production_units.times(goodShare);
  const footprint = totalEmissions.div(goodUnits);
  const outputs = collectOutputs(context, [
    ["total_allocated_emissions_kgco2e", totalEmissions, "kgCO2e", "SECONDARY_METRIC"],
    ["good_units_after_scrap", goodUnits, "units", "SECONDARY_METRIC"],
    ["product_footprint_kgco2e", footprint, "kgCO2e/unit", "PRIMARY_DECISION"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.scrap_rate_percent.gt("8");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Scrap rate exceeds 8%; verify production allocation and scrap evidence."] : [] });
};

const evaluateRebarWeight: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["bar_diameter_mm", "POSITIVE"], ["bar_length_m", "POSITIVE"],
    ["bar_count", "POSITIVE_INTEGER"], ["lap_waste_percent", "PERCENT"],
    ["rebar_cost_per_kg", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const kgPerMeter = v.bar_diameter_mm.pow(2).div("162");
  const netWeight = kgPerMeter.times(v.bar_length_m).times(v.bar_count);
  const grossWeight = netWeight.times(BigOne(v.lap_waste_percent).plus(v.lap_waste_percent.div("100")));
  const outputs = collectOutputs(context, [
    ["kg_per_meter", kgPerMeter, "kg/m", "SECONDARY_METRIC"],
    ["rebar_weight_kg", grossWeight, "kg", "PRIMARY_DECISION"],
    ["rebar_material_cost", grossWeight.times(v.rebar_cost_per_kg), "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.lap_waste_percent.gt("15");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Lap and waste allowance exceeds 15%; verify it against the bar schedule."] : [] });
};

const evaluateSteelWeight: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["length_m", "POSITIVE"], ["cross_section_area_mm2", "POSITIVE"],
    ["density_kg_m3", "POSITIVE"], ["waste_percent", "PERCENT"],
    ["material_cost_per_kg", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const netWeight = v.length_m.times(v.cross_section_area_mm2).times(v.density_kg_m3).div("1000000");
  const grossWeight = netWeight.times(BigOne(v.waste_percent).plus(v.waste_percent.div("100")));
  const outputs = collectOutputs(context, [
    ["net_steel_weight_kg", netWeight, "kg", "SECONDARY_METRIC"],
    ["gross_steel_weight_with_waste_kg", grossWeight, "kg", "PRIMARY_DECISION"],
    ["steel_material_cost", grossWeight.times(v.material_cost_per_kg), "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.waste_percent.gt("12");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Waste allowance exceeds 12%; verify the cutting plan."] : [] });
};

const evaluateWeldConsumableMass: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["weld_length_m", "POSITIVE"], ["weld_cross_section_area_mm2", "POSITIVE"],
    ["deposit_density_kg_m3", "POSITIVE"], ["deposition_efficiency_percent", "PERCENT"],
    ["consumable_cost_per_kg", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.deposition_efficiency_percent.eq("0")) return domainError("deposition_efficiency_percent", "Deposition efficiency must be greater than zero.");
  const depositedMass = v.weld_length_m.times(v.weld_cross_section_area_mm2).times(v.deposit_density_kg_m3).div("1000000");
  const purchasedMass = depositedMass.div(v.deposition_efficiency_percent.div("100"));
  const outputs = collectOutputs(context, [
    ["deposited_weld_metal_kg", depositedMass, "kg", "SECONDARY_METRIC"],
    ["purchased_consumable_kg", purchasedMass, "kg", "PRIMARY_DECISION"],
    ["weld_consumable_cost", purchasedMass.times(v.consumable_cost_per_kg), "currency", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = v.deposition_efficiency_percent.lt("45");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Deposition efficiency is below 45%; verify process and consumable evidence."] : [] });
};

const evaluateBoltTorque: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["nut_factor_k", "POSITIVE"], ["desired_preload_kn", "POSITIVE"],
    ["nominal_diameter_mm", "POSITIVE"], ["torque_scatter_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const torque = v.nut_factor_k.times(v.desired_preload_kn).times(v.nominal_diameter_mm);
  const scatter = v.torque_scatter_percent.div("100");
  const outputs = collectOutputs(context, [
    ["tightening_torque_nm", torque, "N*m", "PRIMARY_DECISION"],
    ["estimated_lower_clamp_kn", v.desired_preload_kn.times(BigOne(scatter).minus(scatter)), "kN", "BUSINESS_IMPACT"],
    ["estimated_upper_clamp_kn", v.desired_preload_kn.times(BigOne(scatter).plus(scatter)), "kN", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const warnings: string[] = [];
  if (v.torque_scatter_percent.gt("30")) warnings.push("Torque-control scatter exceeds 30%; direct preload evidence is recommended.");
  if (v.nut_factor_k.lt("0.08") || v.nut_factor_k.gt("0.30")) warnings.push("Entered nut factor is outside the broad screening range; verify it by joint-specific test evidence.");
  return ok({ status: warnings.length > 0 ? "REVIEW" : "OK", outputs: outputs.value, warnings });
};

const evaluateBoltClamp: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["user_verified_proof_load_kn", "POSITIVE"], ["target_preload_percent", "PERCENT"],
    ["joint_settlement_loss_percent", "PERCENT"], ["external_tension_kn", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.target_preload_percent.eq("0")) return domainError("target_preload_percent", "Target preload must be greater than zero.");
  const initialPreload = v.user_verified_proof_load_kn.times(v.target_preload_percent).div("100");
  const retainedPreload = initialPreload.times(BigOne(v.joint_settlement_loss_percent).minus(v.joint_settlement_loss_percent.div("100")));
  const separationMargin = retainedPreload.minus(v.external_tension_kn);
  const zero = v.user_verified_proof_load_kn.minus(v.user_verified_proof_load_kn);
  const residualClamp = separationMargin.gt("0") ? separationMargin : zero;
  const outputs = collectOutputs(context, [
    ["initial_preload_kn", initialPreload, "kN", "SECONDARY_METRIC"],
    ["residual_clamp_force_kn", residualClamp, "kN", "BUSINESS_IMPACT"],
    ["joint_separation_margin_kn", separationMargin, "kN", "PRIMARY_DECISION"],
    ["proof_load_utilization", initialPreload.div(v.user_verified_proof_load_kn), "ratio", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  const hold = separationMargin.lte("0");
  return ok({ status: hold ? "HOLD" : "OK", outputs: outputs.value, warnings: hold ? ["Conservative retained preload does not exceed the entered external tension."] : [] });
};

const evaluateBeamQuickCheck: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["span_m", "POSITIVE"], ["uniform_load_kn_m", "POSITIVE"],
    ["elastic_modulus_gpa", "POSITIVE"], ["second_moment_area_cm4", "POSITIVE"],
    ["section_modulus_cm3", "POSITIVE"], ["user_verified_yield_stress_mpa", "POSITIVE"],
    ["deflection_limit_ratio", "POSITIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const loadNm = v.uniform_load_kn_m.times("1000");
  const elasticModulus = v.elastic_modulus_gpa.times("1000000000");
  const inertia = v.second_moment_area_cm4.times("0.00000001");
  const sectionModulus = v.section_modulus_cm3.times("0.000001");
  const yieldStress = v.user_verified_yield_stress_mpa.times("1000000");
  const maximumMoment = loadNm.times(v.span_m.pow(2)).div("8");
  const bendingStress = maximumMoment.div(sectionModulus);
  const deflection = loadNm.times(v.span_m.pow(4)).times("5").div(elasticModulus.times(inertia).times("384"));
  const deflectionLimit = v.span_m.div(v.deflection_limit_ratio);
  const stressUtilization = bendingStress.div(yieldStress);
  const deflectionUtilization = deflection.div(deflectionLimit);
  const outputs = collectOutputs(context, [
    ["bending_stress_utilization", stressUtilization, "ratio", "SECONDARY_METRIC"],
    ["deflection_m", deflection, "m", "BUSINESS_IMPACT"],
    ["deflection_utilization", deflectionUtilization, "ratio", "PRIMARY_DECISION"],
  ]);
  if (!outputs.ok) return outputs;
  const governing = stressUtilization.gt(deflectionUtilization) ? stressUtilization : deflectionUtilization;
  if (governing.gt("1")) return ok({ status: "HOLD", outputs: outputs.value, warnings: ["Elastic simply-supported UDL screening utilization exceeds 100%."] });
  const review = governing.gt("0.8");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Elastic simply-supported UDL screening utilization exceeds 80%."] : [] });
};

const evaluateRoughnessApproximation: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["ra_um", "POSITIVE"], ["rz_to_ra_ratio", "POSITIVE"], ["rms_to_ra_ratio", "POSITIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const outputs = collectOutputs(context, [
    ["roughness_ra_um", v.ra_um, "um", "PRIMARY_DECISION"],
    ["roughness_rz_um", v.ra_um.times(v.rz_to_ra_ratio), "um", "SECONDARY_METRIC"],
    ["roughness_rms_um", v.ra_um.times(v.rms_to_ra_ratio), "um", "SECONDARY_METRIC"],
  ]);
  if (!outputs.ok) return outputs;
  return ok({ status: "REVIEW", outputs: outputs.value, warnings: ["Rz and RMS are user-ratio approximations; measured drawing requirements remain controlling."] });
};

const evaluateTapDrill: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["major_diameter_mm", "POSITIVE"], ["thread_pitch_mm", "POSITIVE"],
    ["material_allowance_mm", "NON_NEGATIVE"], ["plating_allowance_mm", "NON_NEGATIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const drillDiameter = v.major_diameter_mm.minus(v.thread_pitch_mm).plus(v.material_allowance_mm).plus(v.plating_allowance_mm);
  if (drillDiameter.lte("0") || drillDiameter.gte(v.major_diameter_mm)) {
    return domainError("tap_drill_diameter_mm", "Calculated tap-drill diameter must be greater than zero and below major diameter.");
  }
  const engagementIndex = v.major_diameter_mm.minus(drillDiameter).div(v.thread_pitch_mm);
  const outputs = collectOutputs(context, [
    ["tap_drill_diameter_mm", drillDiameter, "mm", "PRIMARY_DECISION"],
    ["thread_engagement_index", engagementIndex, "ratio", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = engagementIndex.lt("0.55") || engagementIndex.gt("1");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Thread engagement index is outside [0.55, 1.00]; verify against controlled thread and material data."] : [] });
};

const evaluateThreadReference: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["major_diameter_mm", "POSITIVE"], ["pitch_mm", "POSITIVE"],
    ["allowance_mm", "FINITE"], ["engagement_length_mm", "POSITIVE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const pitchDiameter = v.major_diameter_mm.minus(v.pitch_mm.times("0.649519")).plus(v.allowance_mm);
  const minorDiameter = v.major_diameter_mm.minus(v.pitch_mm.times("1.226869")).plus(v.allowance_mm);
  if (minorDiameter.lte("0") || minorDiameter.gte(pitchDiameter) || pitchDiameter.gte(v.major_diameter_mm)) {
    return domainError("allowance_mm", "Allowance produces invalid basic-profile diameter ordering.");
  }
  const outputs = collectOutputs(context, [
    ["pitch_diameter_approx_mm", pitchDiameter, "mm", "PRIMARY_DECISION"],
    ["minor_diameter_approx_mm", minorDiameter, "mm", "SECONDARY_METRIC"],
    ["engagement_length_ratio", v.engagement_length_mm.div(v.major_diameter_mm), "ratio", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  return ok({ status: "REVIEW", outputs: outputs.value, warnings: ["Dimensions are basic-profile approximations; controlled thread tables and gauges govern release."] });
};

const evaluateIsoFit: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["nominal_diameter_mm", "POSITIVE"], ["hole_lower_deviation_um", "FINITE"],
    ["hole_upper_deviation_um", "FINITE"], ["shaft_lower_deviation_um", "FINITE"],
    ["shaft_upper_deviation_um", "FINITE"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  if (v.hole_lower_deviation_um.gt(v.hole_upper_deviation_um)) return domainError("hole_lower_deviation_um", "Hole lower deviation cannot exceed hole upper deviation.");
  if (v.shaft_lower_deviation_um.gt(v.shaft_upper_deviation_um)) return domainError("shaft_lower_deviation_um", "Shaft lower deviation cannot exceed shaft upper deviation.");
  const minHole = v.nominal_diameter_mm.plus(v.hole_lower_deviation_um.div("1000"));
  const maxHole = v.nominal_diameter_mm.plus(v.hole_upper_deviation_um.div("1000"));
  const minShaft = v.nominal_diameter_mm.plus(v.shaft_lower_deviation_um.div("1000"));
  const maxShaft = v.nominal_diameter_mm.plus(v.shaft_upper_deviation_um.div("1000"));
  if (minHole.lte("0") || minShaft.lte("0")) return domainError("nominal_diameter_mm", "Entered deviations produce a non-positive limit size.");
  const minimumClearance = minHole.minus(maxShaft);
  const maximumClearance = maxHole.minus(minShaft);
  const zero = v.nominal_diameter_mm.minus(v.nominal_diameter_mm);
  const one = zero.plus("1");
  const transition = minimumClearance.lt("0") && maximumClearance.gt("0") ? one : zero;
  const outputs = collectOutputs(context, [
    ["minimum_clearance_mm", minimumClearance, "mm", "PRIMARY_DECISION"],
    ["maximum_clearance_mm", maximumClearance, "mm", "SECONDARY_METRIC"],
    ["transition_fit_risk", transition, "0/1", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const review = transition.eq("1");
  return ok({ status: review ? "REVIEW" : "OK", outputs: outputs.value, warnings: review ? ["Entered limit deviations span interference and clearance; inspection planning is required."] : [] });
};

const evaluateCbamScenario: Evaluator = (context) => {
  const inputs = collectInputs(context, [
    ["export_product_mass_ton", "NON_NEGATIVE"], ["embedded_emission_tco2e_per_ton", "NON_NEGATIVE"],
    ["free_allocation_factor_percent", "PERCENT"], ["carbon_price_per_tco2e", "NON_NEGATIVE"],
    ["evidence_confidence_percent", "PERCENT"],
  ]);
  if (!inputs.ok) return inputs;
  const v = inputs.value;
  const adjustment = BigOne(v.free_allocation_factor_percent).minus(v.free_allocation_factor_percent.div("100"));
  const exposedEmissions = v.export_product_mass_ton.times(v.embedded_emission_tco2e_per_ton).times(adjustment);
  const exposureCost = exposedEmissions.times(v.carbon_price_per_tco2e);
  const evidenceRisk = BigOne(v.evidence_confidence_percent).minus(v.evidence_confidence_percent.div("100"));
  const outputs = collectOutputs(context, [
    ["exposed_emissions_tco2e", exposedEmissions, "tCO2e", "SECONDARY_METRIC"],
    ["cbam_exposure_cost", exposureCost, "currency", "PRIMARY_DECISION"],
    ["evidence_risk_index", evidenceRisk, "ratio", "BUSINESS_IMPACT"],
  ]);
  if (!outputs.ok) return outputs;
  const hold = v.evidence_confidence_percent.lt("70");
  const warnings = ["This is a user-input scenario estimate, not an EU CBAM certificate or compliance calculation."];
  if (hold) warnings.push("Evidence confidence is below 70%.");
  return ok({ status: hold ? "HOLD" : "REVIEW", outputs: outputs.value, warnings });
};

const evaluators: Readonly<Record<string, Evaluator>> = Object.freeze({
  "downtime-cost": evaluateDowntimeCost,
  "energy-cost-per-part": evaluateEnergyCostPerPart,
  "quote-margin-markup": evaluateQuoteMargin,
  "concrete-volume-order-quantity": evaluateConcreteOrder,
  "pallet-container-load-cbm": evaluatePalletCbm,
  "scrap-cost": evaluateScrapCost,
  "setup-time-cost": evaluateSetupCost,
  "line-balancing-efficiency": evaluateLineBalance,
  "electric-motor-running-cost": evaluateMotorCost,
  "inventory-carrying-cost": evaluateInventoryCost,
  "freight-cost-per-km-trip": evaluateFreightCost,
  "true-employee-cost": evaluateEmployeeCost,
  "break-even-point": evaluateBreakEven,
  "customer-profitability": evaluateCustomerProfitability,
  "machining-cost-per-part": evaluateMachiningCost,
  "cnc-shop-hourly-rate": evaluateCncShopRate,
  "material-removal-rate": evaluateMaterialRemoval,
  "compressed-air-leak-cost": evaluateCompressedAirLeak,
  "carbon-price-exposure": evaluateCarbonExposure,
  "payment-term-cost": evaluatePaymentTermCost,
  "machine-investment-payback": evaluateMachinePayback,
  "currency-adjusted-pricing": evaluateCurrencyAdjustedPricing,
  "eoq": evaluateEoq,
  "safety-stock-reorder-point": evaluateSafetyStock,
  "recipe-cost-menu-price": evaluateRecipePricing,
  "fabric-consumption-gsm": evaluateFabricConsumption,
  "oee": evaluateOee,
  "takt-time-cycle-time": evaluateTaktCapacity,
  "rework-vs-scrap-decision": evaluateReworkVsScrap,
  "welding-cost-per-meter": evaluateWeldingCost,
  "welding-heat-input": evaluateWeldingHeatInput,
  "electricity-co2-emissions": evaluateElectricityEmissions,
  "diesel-fuel-co2-emissions": evaluateDieselEmissions,
  "product-carbon-footprint-basic": evaluateProductFootprint,
  "rebar-weight-count": evaluateRebarWeight,
  "steel-weight": evaluateSteelWeight,
  "weld-metal-weight-consumable": evaluateWeldConsumableMass,
  "bolt-torque": evaluateBoltTorque,
  "bolt-preload-clamp-force": evaluateBoltClamp,
  "beam-load-deflection-quick-check": evaluateBeamQuickCheck,
  "surface-roughness-converter": evaluateRoughnessApproximation,
  "tap-drill-size": evaluateTapDrill,
  "thread-dimensions-reference": evaluateThreadReference,
  "iso-286-tolerance-fit": evaluateIsoFit,
  "cbam-cost-quick-estimator": evaluateCbamScenario,
});

export function executeCertifiedFreeCalculation(
  toolKey: string,
  rawInputs: Readonly<Record<string, unknown>>,
): DomainResult<CertifiedFreeCalculation> {
  const certification = getFreeFormulaCertification(toolKey);
  const evaluator = evaluators[toolKey];
  if (!certification || certification.arithmeticMode !== FREE_DECIMAL_ARITHMETIC_MODE || !evaluator) {
    return err({ code: "DOMAIN_VIOLATION", field: toolKey, message: "Tool has no certified Decimal evaluator." });
  }
  const context = createEvaluationContext(rawInputs);
  const evaluated = evaluator(context);
  if (!evaluated.ok) return evaluated;
  return ok({
    toolKey,
    formulaVersion: certification.formulaVersion,
    modelId: certification.modelId,
    arithmeticMode: certification.arithmeticMode,
    status: evaluated.value.status,
    outputs: evaluated.value.outputs,
    normalizedInputs: Object.freeze({ ...context.normalizedInputs }),
    warnings: evaluated.value.warnings,
  });
}

export function formatCertifiedFreeError(error: DomainError): string {
  return `${error.code}:${error.field}:${error.message}`;
}
