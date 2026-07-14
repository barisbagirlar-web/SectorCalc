import type {
  ServerOutput,
  SuperV4Input,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";
import {
  INVESTMENT_APPRAISAL_FORMULA_VERSION,
  INVESTMENT_APPRAISAL_MODEL_ID,
  INVESTMENT_APPRAISAL_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/investment-appraisal-core";
import {
  DOWNTIME_LOSS_FORMULA_VERSION,
  DOWNTIME_LOSS_MODEL_ID,
  DOWNTIME_LOSS_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/downtime-loss-core";
import {
  QUALITY_LOSS_FORMULA_VERSION,
  QUALITY_LOSS_MODEL_ID,
  QUALITY_LOSS_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/quality-loss-core";
import {
  OEE_LOSS_FORMULA_VERSION,
  OEE_LOSS_MODEL_ID,
  OEE_LOSS_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/oee-loss-core";
import {
  MACHINE_HOURLY_RATE_FORMULA_VERSION,
  MACHINE_HOURLY_RATE_MODEL_ID,
  MACHINE_HOURLY_RATE_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-core";
import {
  MOTOR_REPLACEMENT_FORMULA_VERSION,
  MOTOR_REPLACEMENT_MODEL_ID,
  MOTOR_REPLACEMENT_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/motor-replacement-roi-core";
import {
  MAKE_BUY_FORMULA_VERSION,
  MAKE_BUY_MODEL_ID,
  MAKE_BUY_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/make-buy-core";
import {
  PLANT_SHOP_RATE_FORMULA_VERSION,
  PLANT_SHOP_RATE_MODEL_ID,
  PLANT_SHOP_RATE_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/plant-shop-rate-core";
import {
  SMED_ROI_FORMULA_VERSION,
  SMED_ROI_MODEL_ID,
  SMED_ROI_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/smed-roi-core";
import {
  EMPLOYEE_COST_FORMULA_VERSION,
  EMPLOYEE_COST_MODEL_ID,
  EMPLOYEE_COST_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/employee-cost-core";
import {
  JOB_QUOTE_FORMULA_VERSION,
  JOB_QUOTE_MODEL_ID,
  JOB_QUOTE_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/job-quote-core";
import {
  SKU_MARGIN_FORMULA_VERSION,
  SKU_MARGIN_MODEL_ID,
  SKU_MARGIN_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/sku-margin-core";
import {
  LOSS_MAKING_JOB_FORMULA_VERSION,
  LOSS_MAKING_JOB_MODEL_ID,
  LOSS_MAKING_JOB_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/loss-making-job-core";
import {
  CASH_SURVIVAL_FORMULA_VERSION,
  CASH_SURVIVAL_MODEL_ID,
  CASH_SURVIVAL_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/cash-survival-core";
import {
  RECEIVABLES_COST_FORMULA_VERSION,
  RECEIVABLES_COST_MODEL_ID,
  RECEIVABLES_COST_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/receivables-cost-core";
import {
  MACHINE_OPTION_FORMULA_VERSION,
  MACHINE_OPTION_MODEL_ID,
  MACHINE_OPTION_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/machine-option-core";
import {
  CUSTOMER_SKU_FORMULA_VERSION,
  CUSTOMER_SKU_MODEL_ID,
  CUSTOMER_SKU_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-core";
import {
  ENERGY_INCENTIVE_FORMULA_VERSION,
  ENERGY_INCENTIVE_MODEL_ID,
  ENERGY_INCENTIVE_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/energy-incentive-core";
import { FX_COMMODITY_FORMULA_VERSION, FX_COMMODITY_MODEL_ID, FX_COMMODITY_SCHEMA_VERSION } from "@/sectorcalc/formulas/pro-v531/fx-commodity-core";
import {
  WELD_COST_FORMULA_VERSION,
  WELD_COST_MODEL_ID,
  WELD_COST_SCHEMA_VERSION,
} from "@/sectorcalc/formulas/pro-v531/weld-cost-core";

const INVESTMENT_TOOL_KEY = "capital-equipment-investment-appraisal-npv-irr";
const DOWNTIME_LOSS_TOOL_KEY = "downtime-scrap-loss-statement";
const QUALITY_LOSS_TOOL_KEY = "scrap-rework-cost-tracker";
const OEE_LOSS_TOOL_KEY = "oee-loss-monetization-improvement-business-case";
const MACHINE_HOURLY_RATE_TOOL_KEY = "machine-hourly-rate-proof-report";
const MOTOR_REPLACEMENT_TOOL_KEY = "motor-compressor-replacement-roi";
const MAKE_BUY_TOOL_KEY = "outsource-vs-in-house-analyzer";
const PLANT_SHOP_RATE_TOOL_KEY = "plant-wide-shop-rate-cost-structure-audit";
const SMED_ROI_TOOL_KEY = "setup-time-reduction-roi-smed";
const EMPLOYEE_COST_TOOL_KEY = "true-employee-cost-statement";
const JOB_QUOTE_TOOL_KEY = "job-quote-builder-pro-pack";
const SKU_MARGIN_TOOL_KEY = "product-sku-margin-ranker";
const LOSS_MAKING_JOB_TOOL_KEY = "loss-making-job-detector";
const CASH_SURVIVAL_TOOL_KEY = "break-even-survival-cash-calculator";
const RECEIVABLES_COST_TOOL_KEY = "receivables-cost-payment-term-addendum";
const MACHINE_OPTION_TOOL_KEY = "machine-investment-feasibility-buy-lease-keep";
const CUSTOMER_SKU_TOOL_KEY = "customer-sku-profitability-forensics";
const ENERGY_INCENTIVE_TOOL_KEY = "energy-efficiency-grant-incentive-feasibility-pack";
const FX_COMMODITY_TOOL_KEY = "fx-commodity-pass-through-pricer";
const WELD_COST_TOOL_KEY = "weld-procedure-cost-consumable-estimation-suite";
const INVESTMENT_INPUT_IDS = new Set([
  "initial_investment",
  "annual_net_cash_flow",
  "discount_rate",
  "analysis_years",
  "residual_value",
  "stress_downside_factor",
  "source_confidence_ratio",
  "uncertainty_multiplier",
]);

function output(
  id: string,
  name: string,
  unit: string | null,
  decisionUse: string,
  explanation: string,
): ServerOutput {
  return {
    id,
    name,
    value: null,
    unit,
    status: "REVIEW",
    formula_source: null,
    public_explanation: explanation,
    decision_use: decisionUse,
    evidence_level: "USER_VERIFIED_REQUIRED",
  };
}

const INVESTMENT_OUTPUTS: ServerOutput[] = [
  output(
    "out_net_present_value",
    "Net Present Value",
    "currency_unit",
    "PRIMARY_DECISION",
    "Present value of annual cash flows and the terminal residual value, less the initial investment.",
  ),
  output(
    "out_internal_rate_of_return_percent",
    "Internal Rate of Return",
    "percent",
    "PRIMARY_DECISION",
    "Unique bracketed IRR for the conventional cash-flow pattern.",
  ),
  output(
    "out_simple_payback_years",
    "Simple Payback Period",
    "year",
    "SECONDARY_METRIC",
    "Undiscounted time required to recover the initial investment.",
  ),
  output(
    "out_profitability_index",
    "Profitability Index",
    "ratio",
    "SECONDARY_METRIC",
    "Discounted inflows divided by the initial investment.",
  ),
  output(
    "out_stressed_net_present_value",
    "Stressed Net Present Value",
    "currency_unit",
    "RISK",
    "NPV after applying the stated downside factor to annual cash flow.",
  ),
  output(
    "out_npv_uncertainty_amount",
    "NPV Uncertainty Amount",
    "currency_unit",
    "RISK",
    "Transparent uncertainty allowance derived from source confidence and the coverage multiplier.",
  ),
  output(
    "out_npv_lower_bound",
    "NPV Lower Bound",
    "currency_unit",
    "RISK",
    "Base NPV less the uncertainty allowance.",
  ),
  output(
    "out_npv_upper_bound",
    "NPV Upper Bound",
    "currency_unit",
    "RISK",
    "Base NPV plus the uncertainty allowance.",
  ),
  output(
    "out_break_even_annual_cash_flow",
    "Break-Even Annual Cash Flow",
    "currency_unit",
    "SECONDARY_METRIC",
    "Level annual cash flow required for NPV to equal zero.",
  ),
  output(
    "out_hurdle_rate_margin_percent",
    "IRR Margin Over Hurdle Rate",
    "percent",
    "SECONDARY_METRIC",
    "IRR less the entered discount rate.",
  ),
  output(
    "out_source_confidence_ratio",
    "Source Confidence",
    "ratio",
    "EVIDENCE",
    "User-entered confidence attached to the source data.",
  ),
  output(
    "out_decision_state",
    "Investment Decision State",
    null,
    "STATUS",
    "0 = pass, 1 = review, 2 = hold.",
  ),
];

const DOWNTIME_LOSS_OUTPUTS: ServerOutput[] = [
  output("out_downtime_hours", "Downtime", "h", "SECONDARY_METRIC", "Planned productive time less actual productive time."),
  output("out_downtime_cost", "Downtime Cost", "currency_unit", "BUSINESS_IMPACT", "Downtime hours multiplied by the entered hourly loss rate."),
  output("out_scrap_cost", "Scrap Cost", "currency_unit", "BUSINESS_IMPACT", "Scrap quantity multiplied by the entered unit cost."),
  output("out_rework_cost", "Rework Cost", "currency_unit", "BUSINESS_IMPACT", "Rework hours multiplied by the entered rework rate."),
  output("out_total_loss", "Total Downtime, Scrap and Rework Loss", "currency_unit", "PRIMARY_DECISION", "Sum of downtime, scrap and rework costs."),
  output("out_loss_to_material_cost_ratio", "Loss to Material Cost Ratio", "ratio", "PRIMARY_DECISION", "Total loss divided by the positive entered material-cost exposure."),
  output("out_uptime_ratio", "Productive Time Ratio", "ratio", "SECONDARY_METRIC", "Actual productive time divided by planned productive time."),
  output("out_defect_rate_ratio", "Entered Defect Rate", "ratio", "EVIDENCE", "Normalized user-entered defect rate used by the decision thresholds."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to the source data."),
  output("out_uncertainty_amount", "Evidence Uncertainty Amount", "currency_unit", "RISK", "Total loss multiplied by the source-confidence shortfall."),
  output("out_loss_lower_bound", "Loss Lower Bound", "currency_unit", "RISK", "Total loss less the transparent evidence uncertainty amount."),
  output("out_loss_upper_bound", "Loss Upper Bound", "currency_unit", "RISK", "Total loss plus the transparent evidence uncertainty amount."),
  output("out_primary_loss_driver", "Primary Loss Driver", "0/1/2", "SECONDARY_METRIC", "0 = downtime, 1 = scrap, 2 = rework; deterministic ties retain the earlier category."),
  output("out_decision_state", "Loss Decision State", "0/1/2", "STATUS", "0 = pass, 1 = review, 2 = hold."),
];

function applyDowntimeLossContract(schema: SuperV4Schema): SuperV4Schema {
  const timeInputs = new Set(["productive_hours", "actual_hours", "rework_hours"]);
  for (const input of schema.inputs) {
    input.output_bindings = DOWNTIME_LOSS_OUTPUTS.map((item) => item.id);
    if (timeInputs.has(input.id)) {
      input.base_unit = "s";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = input.id === "rework_hours" ? 36_000_000 : 180_000_000;
        input.physical_hard_bounds.unit = "s";
      }
    }
    if (input.id === "scrap_quantity") {
      input.base_unit = "count";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      input.type = "integer";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = 1_000_000;
        input.physical_hard_bounds.unit = "count";
      }
    }
    if (input.id === "defect_rate_pct" && input.physical_hard_bounds) {
      input.base_unit = "ratio";
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.max = 1;
      input.physical_hard_bounds.unit = "ratio";
    }
    if (input.id === "material_cost" && input.physical_hard_bounds) {
      input.physical_hard_bounds.min = 0.01;
    }
  }
  schema.normalized_inputs = schema.normalized_inputs.map((input) => {
    if (timeInputs.has(input.from_input)) return { ...input, base_unit: "s" };
    if (input.from_input === "scrap_quantity") return { ...input, base_unit: "count" };
    if (input.from_input === "defect_rate_pct") return { ...input, base_unit: "ratio" };
    return input;
  });
  schema.outputs = DOWNTIME_LOSS_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = DOWNTIME_LOSS_FORMULA_VERSION;
  schema.metadata.schema_version = DOWNTIME_LOSS_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal downtime, scrap, and rework loss decomposition",
    model_id: DOWNTIME_LOSS_MODEL_ID,
    time_normalization: "SECONDS_TO_HOURS_EXACT_DIVISION_BY_3600",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_total_loss",
    secondary_metrics: [
      "out_loss_to_material_cost_ratio",
      "out_downtime_cost",
      "out_scrap_cost",
      "out_rework_cost",
    ],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_total_loss", "out_loss_upper_bound", "out_decision_state"],
    money_at_risk_output_id: "out_loss_upper_bound",
    main_cost_driver_output_id: "out_primary_loss_driver",
    quote_or_decision_impact_output_id: "out_decision_state",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "LOSS_SOURCE_CONFIDENCE_ALLOWANCE_V1",
    description: "Total loss plus or minus total loss multiplied by the entered source-confidence shortfall.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const QUALITY_LOSS_OUTPUTS: ServerOutput[] = [
  output("out_scrap_cost", "Scrap Cost", "currency_unit", "BUSINESS_IMPACT", "Scrap quantity multiplied by entered material and labor cost per unit."),
  output("out_rework_cost", "Rework Cost", "currency_unit", "BUSINESS_IMPACT", "Rework quantity multiplied by exact rework hours and entered labor rate."),
  output("out_total_quality_loss", "Observed Quality Loss", "currency_unit", "PRIMARY_DECISION", "Sum of observed scrap and rework cost."),
  output("out_total_defect_units", "Observed Defect Units", "count", "SECONDARY_METRIC", "Scrap plus rework quantity, constrained not to exceed total production."),
  output("out_defect_rate_ratio", "Observed Defect Rate", "ratio", "PRIMARY_DECISION", "Observed defect units divided by positive total production."),
  output("out_defect_rate_target_ratio", "Defect Rate Target", "ratio", "EVIDENCE", "Normalized user-entered defect-rate target."),
  output("out_loss_per_produced_unit", "Quality Loss per Produced Unit", "currency_unit/unit", "SECONDARY_METRIC", "Observed quality loss divided by total production."),
  output("out_projected_monthly_quality_loss", "Projected Monthly Quality Loss", "currency_unit/month", "BUSINESS_IMPACT", "Observed loss per produced unit multiplied by entered monthly volume."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to source data."),
  output("out_uncertainty_amount", "Evidence Uncertainty Amount", "currency_unit/month", "RISK", "Projected monthly loss multiplied by source-confidence shortfall."),
  output("out_loss_lower_bound", "Monthly Loss Lower Bound", "currency_unit/month", "RISK", "Projected monthly loss less transparent evidence uncertainty."),
  output("out_loss_upper_bound", "Monthly Loss Upper Bound", "currency_unit/month", "RISK", "Projected monthly loss plus transparent evidence uncertainty."),
  output("out_primary_loss_driver", "Primary Quality Loss Driver", "0/1", "SECONDARY_METRIC", "0 = scrap, 1 = rework; a tie resolves to scrap deterministically."),
  output("out_decision_state", "Quality Loss Decision State", "0/1/2", "STATUS", "0 = pass, 1 = review, 2 = hold."),
];

function applyQualityLossContract(schema: SuperV4Schema): SuperV4Schema {
  const countInputs = new Set(["total_produced", "scrap_quantity", "rework_quantity", "monthly_volume"]);
  for (const input of schema.inputs) {
    input.output_bindings = QUALITY_LOSS_OUTPUTS.map((item) => item.id);
    if (countInputs.has(input.id)) {
      input.base_unit = input.id === "monthly_volume" ? "count/month" : "count";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      input.type = "integer";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = input.id === "total_produced" ? 1 : 0;
        input.physical_hard_bounds.unit = input.base_unit;
      }
    }
    if (input.id === "defect_rate_target" && input.physical_hard_bounds) {
      input.base_unit = "ratio";
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.max = 1;
      input.physical_hard_bounds.unit = "ratio";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs.map((input) => {
    if (countInputs.has(input.from_input)) {
      return { ...input, base_unit: input.from_input === "monthly_volume" ? "count/month" : "count" };
    }
    if (input.from_input === "defect_rate_target") return { ...input, base_unit: "ratio" };
    return input;
  });
  schema.outputs = QUALITY_LOSS_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = QUALITY_LOSS_FORMULA_VERSION;
  schema.metadata.schema_version = QUALITY_LOSS_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal scrap and rework quality-loss decomposition",
    model_id: QUALITY_LOSS_MODEL_ID,
    time_normalization: "REWORK_SECONDS_TO_HOURS_EXACT_DIVISION_BY_3600",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_projected_monthly_quality_loss",
    secondary_metrics: ["out_defect_rate_ratio", "out_scrap_cost", "out_rework_cost", "out_loss_upper_bound"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_projected_monthly_quality_loss", "out_loss_upper_bound", "out_decision_state"],
    money_at_risk_output_id: "out_loss_upper_bound",
    main_cost_driver_output_id: "out_primary_loss_driver",
    quote_or_decision_impact_output_id: "out_decision_state",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "QUALITY_LOSS_SOURCE_CONFIDENCE_ALLOWANCE_V1",
    description: "Projected monthly quality loss plus or minus its source-confidence shortfall allowance.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const OEE_LOSS_INPUT_IDS = new Set([
  "planned_production_time", "operating_time", "ideal_cycle_time", "total_parts",
  "good_parts", "hourly_contribution", "improvement_cost", "source_confidence",
]);

const OEE_LOSS_OUTPUTS: ServerOutput[] = [
  output("out_availability", "Availability", "ratio", "SECONDARY_METRIC", "Operating time divided by planned production time."),
  output("out_performance", "Performance", "ratio", "SECONDARY_METRIC", "Ideal cycle time multiplied by total count, divided by operating time."),
  output("out_quality", "Quality", "ratio", "SECONDARY_METRIC", "Good count divided by total count."),
  output("out_oee", "Overall Equipment Effectiveness", "ratio", "PRIMARY_DECISION", "Exact product of availability, performance, and quality."),
  output("out_net_operating_seconds", "Derived Net Operating Time", "s", "EVIDENCE", "Ideal cycle time multiplied by total count; not entered independently."),
  output("out_valuable_operating_seconds", "Derived Valuable Operating Time", "s", "EVIDENCE", "Ideal cycle time multiplied by good count; not entered independently."),
  output("out_availability_loss", "Availability Loss Value", "currency_unit", "BUSINESS_IMPACT", "Availability-loss seconds monetized at the entered hourly contribution."),
  output("out_performance_loss", "Performance Loss Value", "currency_unit", "BUSINESS_IMPACT", "Performance-loss seconds monetized at the entered hourly contribution."),
  output("out_quality_loss", "Quality Loss Value", "currency_unit", "BUSINESS_IMPACT", "Quality-loss seconds monetized at the entered hourly contribution."),
  output("out_total_oee_loss", "Total OEE Loss Value", "currency_unit", "PRIMARY_DECISION", "Sum of availability, performance, and quality loss values for the observed period."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to the source data."),
  output("out_uncertainty_amount", "Evidence Uncertainty Amount", "currency_unit", "RISK", "Total OEE loss multiplied by source-confidence shortfall."),
  output("out_loss_lower_bound", "OEE Loss Lower Bound", "currency_unit", "RISK", "Total OEE loss less transparent evidence uncertainty."),
  output("out_loss_upper_bound", "OEE Loss Upper Bound", "currency_unit", "RISK", "Total OEE loss plus transparent evidence uncertainty."),
  output("out_primary_loss_driver", "Primary OEE Loss Driver", "0/1/2", "SECONDARY_METRIC", "0 = availability, 1 = performance, 2 = quality; ties resolve deterministically."),
  output("out_decision_state", "Improvement Decision State", "0/1/2", "STATUS", "0 = lower bound covers cost, 1 = uncertainty interval crosses cost, 2 = upper bound is below cost."),
];

function applyOeeLossContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => OEE_LOSS_INPUT_IDS.has(input.id));
  for (const input of schema.inputs) {
    input.output_bindings = OEE_LOSS_OUTPUTS.map((item) => item.id);
    if (["planned_production_time", "operating_time", "ideal_cycle_time"].includes(input.id)) {
      input.base_unit = "s";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = input.id === "ideal_cycle_time" ? 0.000001 : 0.000001;
        input.physical_hard_bounds.max = input.id === "ideal_cycle_time" ? 10_000 : 180_000_000;
        input.physical_hard_bounds.unit = "s";
      }
    }
    if (["total_parts", "good_parts"].includes(input.id)) {
      input.base_unit = "count";
      input.type = "integer";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = input.id === "total_parts" ? 1 : 0;
        input.physical_hard_bounds.unit = "count";
      }
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => OEE_LOSS_INPUT_IDS.has(input.from_input))
    .map((input) => ["total_parts", "good_parts"].includes(input.from_input)
      ? { ...input, base_unit: "count" }
      : input);
  const groups = schema.ui_contract?.input_groups ?? [];
  for (const group of groups) {
    group.fields = Array.isArray(group.fields) ? group.fields.filter((id) => OEE_LOSS_INPUT_IDS.has(id)) : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) {
        rule.affected_inputs = rule.affected_inputs.filter((id) => OEE_LOSS_INPUT_IDS.has(id));
      }
    }
  }
  schema.outputs = OEE_LOSS_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = OEE_LOSS_FORMULA_VERSION;
  schema.metadata.schema_version = OEE_LOSS_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal OEE time-loss decomposition and observed-period monetization",
    model_id: OEE_LOSS_MODEL_ID,
    redundant_input_policy: "NET_AND_VALUABLE_TIME_DERIVED_NOT_ENTERED",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_total_oee_loss",
    secondary_metrics: ["out_oee", "out_availability_loss", "out_performance_loss", "out_quality_loss", "out_loss_upper_bound"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_total_oee_loss", "out_loss_lower_bound", "out_loss_upper_bound", "out_decision_state"],
    money_at_risk_output_id: "out_loss_upper_bound",
    main_cost_driver_output_id: "out_primary_loss_driver",
    quote_or_decision_impact_output_id: "out_decision_state",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "OEE_LOSS_SOURCE_CONFIDENCE_ALLOWANCE_V1",
    description: "Observed-period OEE loss plus or minus its source-confidence shortfall allowance.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const MACHINE_HOURLY_RATE_INPUT_IDS = new Set([
  "machine_rate", "cycle_time", "setup_time", "batch_quantity", "material_cost",
  "target_margin", "annual_volume", "labor_rate", "overhead_rate", "source_confidence_ratio",
]);

const MACHINE_HOURLY_RATE_OUTPUTS: ServerOutput[] = [
  output("out_setup_seconds_per_unit", "Setup Time per Unit", "s/unit", "SECONDARY_METRIC", "Batch setup time divided by positive integer batch quantity."),
  output("out_effective_cycle_seconds", "Effective Cycle Time", "s/unit", "PRIMARY_DECISION", "Run cycle time plus amortized setup time per unit."),
  output("out_capacity_units_per_hour", "Theoretical Capacity", "unit/h", "SECONDARY_METRIC", "Exactly 3,600 seconds divided by effective cycle time."),
  output("out_annual_productive_hours", "Required Annual Productive Hours", "h/year", "RISK", "Annual volume multiplied by effective cycle time and divided by 3,600."),
  output("out_direct_hourly_rate", "Direct Machine and Labor Rate", "currency_unit/h", "BUSINESS_IMPACT", "Machine ownership and operating rate plus direct labor rate."),
  output("out_overhead_hourly_rate", "Allocated Overhead Rate", "currency_unit/h", "BUSINESS_IMPACT", "Annual overhead pool divided by required annual productive hours."),
  output("out_fully_loaded_hourly_rate", "Fully Loaded Hourly Rate", "currency_unit/h", "PRIMARY_DECISION", "Direct hourly rate plus allocated overhead hourly rate."),
  output("out_machine_cost_per_unit", "Machine Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Machine hourly rate applied to effective cycle time."),
  output("out_labor_cost_per_unit", "Labor Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Labor hourly rate applied to effective cycle time."),
  output("out_overhead_cost_per_unit", "Overhead Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Annual overhead pool divided by annual production volume."),
  output("out_material_cost_per_unit", "Material Cost per Unit", "currency_unit/unit", "EVIDENCE", "User-entered material cost per produced unit."),
  output("out_fully_loaded_cost_per_unit", "Fully Loaded Cost per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Material, machine, labor, and allocated overhead cost per unit."),
  output("out_quote_price_per_unit", "Required Quote Price per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Fully loaded unit cost divided by one minus target gross margin."),
  output("out_profit_per_unit", "Target Profit per Unit", "currency_unit/unit", "SECONDARY_METRIC", "Required quote price less fully loaded unit cost."),
  output("out_annual_profit", "Target Annual Profit", "currency_unit/year", "BUSINESS_IMPACT", "Target profit per unit multiplied by annual volume."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to the rate evidence."),
  output("out_rate_uncertainty_amount", "Rate Evidence Uncertainty", "currency_unit/h", "RISK", "Fully loaded hourly rate multiplied by source-confidence shortfall."),
  output("out_rate_lower_bound", "Hourly Rate Lower Bound", "currency_unit/h", "RISK", "Fully loaded hourly rate less the transparent evidence allowance."),
  output("out_rate_upper_bound", "Hourly Rate Upper Bound", "currency_unit/h", "RISK", "Fully loaded hourly rate plus the transparent evidence allowance."),
  output("out_primary_cost_driver", "Primary Unit Cost Driver", "0/1/2/3", "SECONDARY_METRIC", "0 = machine, 1 = labor, 2 = overhead, 3 = material; ties retain the earlier category."),
  output("out_decision_state", "Rate Evidence Decision State", "0/1/2", "STATUS", "0 = confidence at least 90%, 1 = 75% to below 90%, 2 = below 75%."),
];

function applyMachineHourlyRateContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => MACHINE_HOURLY_RATE_INPUT_IDS.has(input.id));
  const currencyPerHour = new Set(["machine_rate", "labor_rate"]);
  const timeInputs = new Set(["cycle_time", "setup_time"]);
  for (const input of schema.inputs) {
    input.output_bindings = MACHINE_HOURLY_RATE_OUTPUTS.map((item) => item.id);
    if (currencyPerHour.has(input.id)) {
      input.base_unit = "currency_unit_per_h";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      input.name = input.id === "machine_rate"
        ? "Machine Ownership and Operating Rate"
        : "Direct Labor Rate";
    }
    if (timeInputs.has(input.id)) {
      input.base_unit = "s";
      input.allowed_display_units = ["s", "min", "h"];
      input.name = input.id === "cycle_time" ? "Run Cycle Time per Unit" : "Setup Time per Batch";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = input.id === "cycle_time" ? 0.000001 : 0;
        input.physical_hard_bounds.max = 31_536_000;
        input.physical_hard_bounds.unit = "s";
      }
    }
    if (input.id === "batch_quantity" || input.id === "annual_volume") {
      input.base_unit = input.id === "batch_quantity" ? "count" : "count/year";
      input.type = "integer";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      input.name = input.id === "batch_quantity" ? "Batch Quantity" : "Annual Production Volume";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.unit = input.base_unit;
      }
    }
    if (input.id === "material_cost") {
      input.base_unit = "currency_unit/unit";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      input.name = "Material Cost per Unit";
      if (input.physical_hard_bounds) input.physical_hard_bounds.min = 0;
    }
    if (input.id === "overhead_rate") {
      input.base_unit = "currency_unit/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      input.name = "Annual Overhead Pool";
      if (input.physical_hard_bounds) input.physical_hard_bounds.min = 0;
    }
    if (input.id === "target_margin" && input.physical_hard_bounds) {
      input.base_unit = "ratio";
      input.name = "Target Gross Margin";
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.max = 0.999999;
      input.physical_hard_bounds.unit = "ratio";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "No universal reference range exists; the user must verify this commercial input against controlled source evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => MACHINE_HOURLY_RATE_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (currencyPerHour.has(input.from_input)) return { ...input, base_unit: "currency_unit_per_h" };
      if (timeInputs.has(input.from_input)) return { ...input, base_unit: "s" };
      if (input.from_input === "batch_quantity") return { ...input, base_unit: "count" };
      if (input.from_input === "annual_volume") return { ...input, base_unit: "count/year" };
      if (input.from_input === "material_cost") return { ...input, base_unit: "currency_unit/unit" };
      if (input.from_input === "overhead_rate") return { ...input, base_unit: "currency_unit/year" };
      return input;
    });
  for (const group of schema.ui_contract?.input_groups ?? []) {
    group.fields = Array.isArray(group.fields)
      ? group.fields.filter((id) => MACHINE_HOURLY_RATE_INPUT_IDS.has(id))
      : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) {
        rule.affected_inputs = rule.affected_inputs.filter((id) => MACHINE_HOURLY_RATE_INPUT_IDS.has(id));
      }
    }
  }
  schema.outputs = MACHINE_HOURLY_RATE_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = MACHINE_HOURLY_RATE_FORMULA_VERSION;
  schema.metadata.schema_version = MACHINE_HOURLY_RATE_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal single-machine productive-hour cost buildup and gross-margin quote model",
    model_id: MACHINE_HOURLY_RATE_MODEL_ID,
    setup_allocation: "SETUP_SECONDS_PER_BATCH_DIVIDED_BY_POSITIVE_INTEGER_BATCH_QUANTITY",
    annual_capacity_ceiling: "8760_PRODUCTIVE_HOURS_PER_SINGLE_MACHINE",
    overhead_allocation: "ANNUAL_OVERHEAD_POOL_DIVIDED_BY_ANNUAL_PRODUCTIVE_HOURS_AND_VOLUME",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_fully_loaded_hourly_rate",
    secondary_metrics: [
      "out_fully_loaded_cost_per_unit", "out_quote_price_per_unit",
      "out_annual_productive_hours", "out_rate_upper_bound",
    ],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_fully_loaded_hourly_rate", "out_quote_price_per_unit", "out_annual_profit", "out_decision_state"],
    money_at_risk_output_id: "out_rate_upper_bound",
    main_cost_driver_output_id: "out_primary_cost_driver",
    quote_or_decision_impact_output_id: "out_quote_price_per_unit",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "MACHINE_RATE_SOURCE_CONFIDENCE_ALLOWANCE_V1",
    description: "Fully loaded hourly rate plus or minus its source-confidence shortfall allowance.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const MOTOR_REPLACEMENT_OUTPUTS: ServerOutput[] = [
  output("out_current_energy_kwh_per_year", "Current Electrical Energy", "kWh/year", "EVIDENCE", "Required shaft energy divided by current efficiency."),
  output("out_new_energy_kwh_per_year", "Replacement Electrical Energy", "kWh/year", "EVIDENCE", "Required shaft energy divided by replacement efficiency."),
  output("out_annual_energy_saving_kwh", "Annual Electrical Energy Saving", "kWh/year", "BUSINESS_IMPACT", "Current less replacement electrical energy; negative values expose an energy penalty."),
  output("out_current_energy_cost_per_year", "Current Annual Energy Cost", "currency_unit/year", "BUSINESS_IMPACT", "Current electrical energy multiplied by the entered energy tariff."),
  output("out_new_energy_cost_per_year", "Replacement Annual Energy Cost", "currency_unit/year", "BUSINESS_IMPACT", "Replacement electrical energy multiplied by the entered energy tariff."),
  output("out_annual_energy_cost_saving", "Annual Energy Cost Saving", "currency_unit/year", "PRIMARY_DECISION", "Current less replacement annual energy cost."),
  output("out_annual_maintenance_saving", "Annual Maintenance Saving", "currency_unit/year", "EVIDENCE", "User-entered annual maintenance saving."),
  output("out_annual_net_saving", "Annual Net Saving", "currency_unit/year", "PRIMARY_DECISION", "Energy cost saving plus maintenance saving."),
  output("out_total_investment", "Total Installed Investment", "currency_unit", "BUSINESS_IMPACT", "Replacement plus installation cost."),
  output("out_present_value_factor", "Savings Present Value Factor", "ratio", "SECONDARY_METRIC", "Exact end-of-year annuity factor over the entered equipment life."),
  output("out_discounted_savings", "Present Value of Savings", "currency_unit", "BUSINESS_IMPACT", "Annual net saving multiplied by the present value factor."),
  output("out_net_present_value", "Net Present Value", "currency_unit", "PRIMARY_DECISION", "Present value of savings less total installed investment."),
  output("out_annual_roi_ratio", "Annual Saving to Investment Ratio", "ratio", "SECONDARY_METRIC", "Annual net saving divided by positive total installed investment."),
  output("out_break_even_annual_saving", "Break-Even Annual Saving", "currency_unit/year", "SECONDARY_METRIC", "Annual saving required for zero NPV."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to energy and cost evidence."),
  output("out_annual_saving_uncertainty", "Annual Saving Uncertainty", "currency_unit/year", "RISK", "Absolute annual saving multiplied by source-confidence shortfall."),
  output("out_npv_uncertainty_amount", "NPV Uncertainty Amount", "currency_unit", "RISK", "Annual saving uncertainty propagated through the exact present value factor."),
  output("out_npv_lower_bound", "NPV Lower Bound", "currency_unit", "RISK", "Base NPV less propagated evidence uncertainty."),
  output("out_npv_upper_bound", "NPV Upper Bound", "currency_unit", "RISK", "Base NPV plus propagated evidence uncertainty."),
  output("out_primary_saving_driver", "Primary Saving Driver", "0/1", "SECONDARY_METRIC", "0 = absolute energy-cost effect, 1 = maintenance saving."),
  output("out_decision_state", "Replacement Decision State", "0/1/2", "STATUS", "0 = NPV lower bound non-negative, 1 = bounds cross zero, 2 = NPV upper bound negative."),
];

function applyMotorReplacementContract(schema: SuperV4Schema): SuperV4Schema {
  for (const input of schema.inputs) {
    input.output_bindings = MOTOR_REPLACEMENT_OUTPUTS.map((item) => item.id);
    if (input.id === "motor_power_kw") {
      input.base_unit = "kW";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0.000001;
        input.physical_hard_bounds.max = 1_000_000;
        input.physical_hard_bounds.unit = "kW";
      }
    }
    if (input.id === "annual_operating_hours") {
      input.base_unit = "h/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0.000001;
        input.physical_hard_bounds.max = 8760;
        input.physical_hard_bounds.unit = "h/year";
      }
    }
    if (["current_efficiency_pct", "new_efficiency_pct"].includes(input.id) && input.physical_hard_bounds) {
      input.base_unit = "ratio";
      input.name = input.id === "current_efficiency_pct" ? "Current Efficiency Ratio" : "Replacement Efficiency Ratio";
      input.physical_hard_bounds.min = 0.000001;
      input.physical_hard_bounds.max = 1;
      input.physical_hard_bounds.unit = "ratio";
    }
    if (input.id === "equipment_life_years") {
      input.type = "integer";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) input.physical_hard_bounds.min = 1;
    }
    if (input.id === "maintenance_saving_yr") {
      input.base_unit = "currency_unit/year";
      input.name = "Annual Maintenance Saving";
      if (input.physical_hard_bounds) input.physical_hard_bounds.unit = "currency_unit/year";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "No universal project range exists; verify this input against motor, meter, tariff, and commercial source evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs.map((input) => {
    if (input.from_input === "motor_power_kw") return { ...input, base_unit: "kW" };
    if (input.from_input === "annual_operating_hours") return { ...input, base_unit: "h/year" };
    if (["current_efficiency_pct", "new_efficiency_pct"].includes(input.from_input)) return { ...input, base_unit: "ratio" };
    if (input.from_input === "maintenance_saving_yr") return { ...input, base_unit: "currency_unit/year" };
    return input;
  });
  schema.outputs = MOTOR_REPLACEMENT_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = MOTOR_REPLACEMENT_FORMULA_VERSION;
  schema.metadata.schema_version = MOTOR_REPLACEMENT_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal constant-shaft-load energy model with end-of-year discounted savings",
    model_id: MOTOR_REPLACEMENT_MODEL_ID,
    power_basis: "USER_ENTERED_REQUIRED_SHAFT_POWER_KW",
    efficiency_basis: "ELECTRICAL_INPUT_EQUALS_SHAFT_OUTPUT_DIVIDED_BY_EFFICIENCY_RATIO",
    cash_flow_timing: "ANNUAL_END_OF_PERIOD",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_net_present_value",
    secondary_metrics: ["out_annual_net_saving", "out_annual_energy_saving_kwh", "out_break_even_annual_saving", "out_npv_upper_bound"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_annual_net_saving", "out_net_present_value", "out_npv_lower_bound", "out_npv_upper_bound", "out_decision_state"],
    money_at_risk_output_id: "out_npv_lower_bound",
    main_cost_driver_output_id: "out_primary_saving_driver",
    quote_or_decision_impact_output_id: "out_decision_state",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "MOTOR_REPLACEMENT_SAVING_CONFIDENCE_NPV_V1",
    description: "Absolute annual net saving confidence allowance propagated through the exact discounted annuity factor.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const MAKE_BUY_INPUT_IDS = new Set([
  "in_house_material_cost", "in_house_labor_cost", "in_house_overhead",
  "in_house_setup_cost", "outsource_unit_price", "outsource_logistics",
  "annual_volume", "quality_risk_premium", "source_confidence",
]);

const MAKE_BUY_OUTPUTS: ServerOutput[] = [
  output("out_in_house_variable_cost_per_unit", "In-House Variable Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Material, labor, and overhead cost per unit."),
  output("out_setup_cost_per_unit", "Allocated Setup Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Annual setup cost divided by positive integer annual volume."),
  output("out_in_house_total_cost_per_unit", "In-House Total Cost per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Variable cost plus allocated setup cost per unit."),
  output("out_outsource_base_cost_per_unit", "Outsource Base Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Supplier price plus logistics cost per unit."),
  output("out_quality_risk_premium_per_unit", "Outsource Quality-Risk Premium per Unit", "currency_unit/unit", "RISK", "Outsource base cost multiplied by the entered risk ratio."),
  output("out_outsource_risk_adjusted_cost_per_unit", "Risk-Adjusted Outsource Cost per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Outsource base cost plus transparent quality-risk premium."),
  output("out_in_house_annual_cost", "In-House Annual Cost", "currency_unit/year", "BUSINESS_IMPACT", "In-house variable cost times annual volume plus annual setup cost."),
  output("out_outsource_annual_cost", "Risk-Adjusted Outsource Annual Cost", "currency_unit/year", "BUSINESS_IMPACT", "Risk-adjusted outsource unit cost multiplied by annual volume."),
  output("out_annual_cost_delta", "Annual Cost Delta", "currency_unit/year", "PRIMARY_DECISION", "Outsource annual cost less in-house annual cost; positive favors MAKE."),
  output("out_cost_delta_per_unit", "Cost Delta per Unit", "currency_unit/unit", "SECONDARY_METRIC", "Risk-adjusted outsource cost less in-house cost per unit."),
  output("out_absolute_annual_cost_difference", "Absolute Annual Cost Difference", "currency_unit/year", "BUSINESS_IMPACT", "Absolute magnitude of the annual make-or-buy cost difference."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to the cost evidence."),
  output("out_delta_uncertainty_amount", "Cost-Delta Uncertainty", "currency_unit/year", "RISK", "Larger annual cost exposure multiplied by source-confidence shortfall."),
  output("out_delta_lower_bound", "Annual Cost Delta Lower Bound", "currency_unit/year", "RISK", "Annual cost delta less transparent evidence uncertainty."),
  output("out_delta_upper_bound", "Annual Cost Delta Upper Bound", "currency_unit/year", "RISK", "Annual cost delta plus transparent evidence uncertainty."),
  output("out_primary_in_house_cost_driver", "Primary In-House Cost Driver", "0/1/2/3", "SECONDARY_METRIC", "0 = material, 1 = labor, 2 = overhead, 3 = allocated setup."),
  output("out_decision_state", "Make-or-Buy Decision State", "0/1/2", "STATUS", "0 = MAKE, 1 = BUY, 2 = REVIEW because bounds cross zero."),
];

function applyMakeBuyContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => MAKE_BUY_INPUT_IDS.has(input.id));
  const perUnitCosts = new Set([
    "in_house_material_cost", "in_house_labor_cost", "in_house_overhead",
    "outsource_unit_price", "outsource_logistics",
  ]);
  for (const input of schema.inputs) {
    input.output_bindings = MAKE_BUY_OUTPUTS.map((item) => item.id);
    if (perUnitCosts.has(input.id)) {
      input.base_unit = "currency_unit/unit";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) input.physical_hard_bounds.unit = "currency_unit/unit";
    }
    if (input.id === "in_house_setup_cost") {
      input.base_unit = "currency_unit/year";
      input.name = "In-House Annual Setup Cost";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) input.physical_hard_bounds.unit = "currency_unit/year";
    }
    if (input.id === "annual_volume") {
      input.base_unit = "count/year";
      input.type = "integer";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.unit = "count/year";
      }
    }
    if (input.id === "quality_risk_premium") {
      input.name = "Outsource Quality-Risk Premium Ratio";
      input.base_unit = "ratio";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "No universal commercial reference range exists; verify against supplier quotes, routings, and controlled cost records.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => MAKE_BUY_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (perUnitCosts.has(input.from_input)) return { ...input, base_unit: "currency_unit/unit" };
      if (input.from_input === "in_house_setup_cost") return { ...input, base_unit: "currency_unit/year" };
      if (input.from_input === "annual_volume") return { ...input, base_unit: "count/year" };
      return input;
    });
  for (const group of schema.ui_contract?.input_groups ?? []) {
    group.fields = Array.isArray(group.fields) ? group.fields.filter((id) => MAKE_BUY_INPUT_IDS.has(id)) : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) {
        rule.affected_inputs = rule.affected_inputs.filter((id) => MAKE_BUY_INPUT_IDS.has(id));
      }
    }
  }
  schema.outputs = MAKE_BUY_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = MAKE_BUY_FORMULA_VERSION;
  schema.metadata.schema_version = MAKE_BUY_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal risk-adjusted make-or-buy annual cost delta",
    model_id: MAKE_BUY_MODEL_ID,
    annual_volume_basis: "POSITIVE_INTEGER_UNITS_PER_YEAR_NO_TIME_RATE_CONVERSION",
    setup_allocation: "ANNUAL_SETUP_COST_DIVIDED_BY_ANNUAL_VOLUME",
    capacity_policy: "CAPACITY_CLAIMS_EXCLUDED_WITHOUT_CYCLE_TIME_AND_AVAILABLE_CAPACITY_INPUTS",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_annual_cost_delta",
    secondary_metrics: ["out_in_house_total_cost_per_unit", "out_outsource_risk_adjusted_cost_per_unit", "out_delta_lower_bound", "out_delta_upper_bound"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_annual_cost_delta", "out_delta_lower_bound", "out_delta_upper_bound", "out_decision_state"],
    money_at_risk_output_id: "out_absolute_annual_cost_difference",
    main_cost_driver_output_id: "out_primary_in_house_cost_driver",
    quote_or_decision_impact_output_id: "out_decision_state",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "MAKE_BUY_COST_EXPOSURE_CONFIDENCE_ALLOWANCE_V1",
    description: "The larger annual cost exposure multiplied by source-confidence shortfall and applied symmetrically to the annual cost delta.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const PLANT_SHOP_RATE_OUTPUTS: ServerOutput[] = [
  output("out_expected_billable_hours", "Expected Billable Hours", "h/year", "EVIDENCE", "Available annual hours multiplied by expected utilization."),
  output("out_plant_cost_recovery_rate", "Plant Cost-Recovery Rate", "currency_unit/h", "PRIMARY_DECISION", "Total annual cost divided by expected billable hours."),
  output("out_target_shop_rate", "Target Shop Rate", "currency_unit/h", "PRIMARY_DECISION", "Cost-recovery rate divided by one minus target gross margin."),
  output("out_current_shop_rate", "Current Shop Rate", "currency_unit/h", "EVIDENCE", "User-entered current commercial shop rate."),
  output("out_target_rate_gap", "Target Rate Gap", "currency_unit/h", "BUSINESS_IMPACT", "Target shop rate less current shop rate."),
  output("out_machine_group_cost_rate", "Machine-Group Cost Rate", "currency_unit/h", "SECONDARY_METRIC", "Machine-group annual cost divided by machine-group annual hours."),
  output("out_overhead_absorption_rate", "Overhead Absorption Rate", "currency_unit/h", "SECONDARY_METRIC", "Annual overhead pool divided by its positive allocation-hour base."),
  output("out_current_annual_revenue", "Current-Rate Annual Revenue", "currency_unit/year", "BUSINESS_IMPACT", "Current shop rate multiplied by expected billable hours."),
  output("out_target_annual_revenue", "Target Annual Revenue", "currency_unit/year", "BUSINESS_IMPACT", "Target shop rate multiplied by expected billable hours."),
  output("out_annual_pricing_delta", "Annual Pricing Delta", "currency_unit/year", "PRIMARY_DECISION", "Target annual revenue less current-rate annual revenue."),
  output("out_annual_cost_recovery_delta", "Annual Cost-Recovery Delta", "currency_unit/year", "RISK", "Total annual cost less current-rate annual revenue."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to cost and hour evidence."),
  output("out_target_rate_uncertainty", "Target-Rate Uncertainty", "currency_unit/h", "RISK", "Target rate multiplied by source-confidence shortfall."),
  output("out_target_rate_lower_bound", "Target Rate Lower Bound", "currency_unit/h", "RISK", "Target rate less transparent evidence uncertainty."),
  output("out_target_rate_upper_bound", "Target Rate Upper Bound", "currency_unit/h", "RISK", "Target rate plus transparent evidence uncertainty."),
  output("out_annual_money_at_risk", "Annual Money at Risk", "currency_unit/year", "BUSINESS_IMPACT", "Positive upper-bound rate exposure multiplied by expected billable hours."),
  output("out_primary_rate_driver", "Primary Rate Driver", "0/1/2", "SECONDARY_METRIC", "0 = plant cost recovery, 1 = machine group, 2 = overhead absorption."),
  output("out_decision_state", "Shop-Rate Decision State", "0/1/2", "STATUS", "0 = current rate covers upper bound, 1 = within bounds, 2 = below lower bound."),
];

function applyPlantShopRateContract(schema: SuperV4Schema): SuperV4Schema {
  const annualCosts = new Set(["total_annual_cost", "machine_group_cost", "overhead_pool"]);
  const annualHours = new Set(["total_productive_hours", "machine_group_hours", "overhead_allocation_base"]);
  for (const input of schema.inputs) {
    input.output_bindings = PLANT_SHOP_RATE_OUTPUTS.map((item) => item.id);
    if (annualCosts.has(input.id)) {
      input.base_unit = "currency_unit/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) input.physical_hard_bounds.unit = "currency_unit/year";
    }
    if (annualHours.has(input.id)) {
      input.base_unit = "h/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0.000001;
        input.physical_hard_bounds.unit = "h/year";
      }
    }
    if (input.id === "total_productive_hours") input.name = "Available Annual Productive Hours";
    if (input.id === "target_margin_pct" && input.physical_hard_bounds) {
      input.name = "Target Gross Margin";
      input.base_unit = "ratio";
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.max = 0.999999;
      input.physical_hard_bounds.unit = "ratio";
    }
    if (input.id === "utilization_pct" && input.physical_hard_bounds) {
      input.name = "Expected Billable Utilization";
      input.base_unit = "ratio";
      input.physical_hard_bounds.min = 0.000001;
      input.physical_hard_bounds.max = 1;
      input.physical_hard_bounds.unit = "ratio";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "No universal plant-cost reference range exists; verify against controlled ledger, routing, and productive-hour records.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs.map((input) => {
    if (annualCosts.has(input.from_input)) return { ...input, base_unit: "currency_unit/year" };
    if (annualHours.has(input.from_input)) return { ...input, base_unit: "h/year" };
    if (["target_margin_pct", "utilization_pct"].includes(input.from_input)) return { ...input, base_unit: "ratio" };
    return input;
  });
  schema.outputs = PLANT_SHOP_RATE_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = PLANT_SHOP_RATE_FORMULA_VERSION;
  schema.metadata.schema_version = PLANT_SHOP_RATE_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal utilization-adjusted plant cost recovery and gross-margin shop-rate model",
    model_id: PLANT_SHOP_RATE_MODEL_ID,
    hour_basis: "ANNUAL_HOURS_NO_SECONDS_CONVERSION",
    billable_hours: "AVAILABLE_ANNUAL_HOURS_TIMES_UTILIZATION_RATIO",
    gross_margin_identity: "TARGET_RATE_TIMES_ONE_MINUS_MARGIN_EQUALS_COST_RECOVERY_RATE",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_target_shop_rate",
    secondary_metrics: ["out_plant_cost_recovery_rate", "out_annual_pricing_delta", "out_target_rate_lower_bound", "out_target_rate_upper_bound"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_target_shop_rate", "out_annual_pricing_delta", "out_annual_money_at_risk", "out_decision_state"],
    money_at_risk_output_id: "out_annual_money_at_risk",
    main_cost_driver_output_id: "out_primary_rate_driver",
    quote_or_decision_impact_output_id: "out_decision_state",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "PLANT_SHOP_RATE_SOURCE_CONFIDENCE_ALLOWANCE_V1",
    description: "Target shop rate plus or minus its source-confidence shortfall allowance.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const SMED_ROI_INPUT_IDS = new Set([
  "machine_rate", "cycle_time", "setup_time", "batch_quantity", "material_cost",
  "annual_volume", "labor_rate", "overhead_rate", "source_confidence_ratio",
  "uncertainty_multiplier",
]);

const SMED_ROI_OUTPUTS: ServerOutput[] = [
  output("out_annual_changeover_equivalents", "Annual Changeover Equivalents", "changeover/year", "EVIDENCE", "Annual volume divided by positive integer batch quantity."),
  output("out_current_setup_seconds", "Current Setup Time", "s/changeover", "EVIDENCE", "User-entered current setup time."),
  output("out_target_setup_seconds", "Target Setup Time", "s/changeover", "PRIMARY_DECISION", "Current setup time less the explicit reduction target."),
  output("out_saved_seconds_per_changeover", "Saved Time per Changeover", "s/changeover", "PRIMARY_DECISION", "Current setup time multiplied by target reduction ratio."),
  output("out_annual_saved_hours", "Annual Saved Setup Hours", "h/year", "BUSINESS_IMPACT", "Saved setup seconds times annual changeover equivalents divided by 3,600."),
  output("out_additional_capacity_units", "Equivalent Additional Capacity", "unit/year", "SECONDARY_METRIC", "Annual saved seconds divided by cycle seconds per unit."),
  output("out_avoidable_hourly_rate", "Avoidable Hourly Cost Rate", "currency_unit/h", "EVIDENCE", "Machine, labor, and explicitly avoidable overhead hourly rates."),
  output("out_annual_gross_saving", "Annual Gross SMED Saving", "currency_unit/year", "PRIMARY_DECISION", "Annual saved setup hours multiplied by avoidable hourly rate."),
  output("out_implementation_cost", "SMED Implementation Cost", "currency_unit", "BUSINESS_IMPACT", "User-entered one-time implementation cost."),
  output("out_first_year_net_benefit", "First-Year Net Benefit", "currency_unit", "BUSINESS_IMPACT", "Annual gross saving less implementation cost."),
  output("out_simple_payback_years", "Simple Payback", "year", "PRIMARY_DECISION", "Positive implementation cost divided by positive annual gross saving."),
  output("out_annual_roi_ratio", "Annual Saving to Investment Ratio", "ratio", "SECONDARY_METRIC", "Annual gross saving divided by implementation cost."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to setup and cost evidence."),
  output("out_annual_saving_uncertainty", "Annual Saving Uncertainty", "currency_unit/year", "RISK", "Annual gross saving multiplied by source-confidence shortfall."),
  output("out_saving_lower_bound", "Annual Saving Lower Bound", "currency_unit/year", "RISK", "Annual gross saving less transparent evidence uncertainty."),
  output("out_saving_upper_bound", "Annual Saving Upper Bound", "currency_unit/year", "RISK", "Annual gross saving plus transparent evidence uncertainty."),
  output("out_primary_saving_rate_driver", "Primary Saving-Rate Driver", "0/1/2", "SECONDARY_METRIC", "0 = machine, 1 = labor, 2 = avoidable overhead."),
  output("out_decision_state", "SMED Decision State", "0/1/2", "STATUS", "0 = lower bound covers one-year cost, 1 = bounds cross cost, 2 = upper bound does not cover cost."),
];

function applySmedRoiContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => SMED_ROI_INPUT_IDS.has(input.id));
  const hourlyRates = new Set(["machine_rate", "labor_rate", "overhead_rate"]);
  const timeInputs = new Set(["cycle_time", "setup_time"]);
  for (const input of schema.inputs) {
    input.output_bindings = SMED_ROI_OUTPUTS.map((item) => item.id);
    if (hourlyRates.has(input.id)) {
      input.base_unit = "currency_unit_per_h";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.id === "overhead_rate") input.name = "Avoidable Overhead Rate";
      if (input.physical_hard_bounds) input.physical_hard_bounds.unit = "currency_unit_per_h";
    }
    if (timeInputs.has(input.id)) {
      input.base_unit = "s";
      input.allowed_display_units = ["s", "min", "h"];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0.000001;
        input.physical_hard_bounds.unit = "s";
      }
    }
    if (input.id === "batch_quantity" || input.id === "annual_volume") {
      input.base_unit = input.id === "batch_quantity" ? "count" : "count/year";
      input.type = "integer";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.unit = input.base_unit;
      }
    }
    if (input.id === "material_cost") {
      input.name = "SMED Implementation Cost";
      input.base_unit = "currency_unit";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) input.physical_hard_bounds.min = 0.000001;
    }
    if (input.id === "uncertainty_multiplier" && input.physical_hard_bounds) {
      input.name = "Target Setup Reduction Ratio";
      input.base_unit = "ratio";
      input.physical_hard_bounds.min = 0.000001;
      input.physical_hard_bounds.max = 1;
      input.physical_hard_bounds.unit = "ratio";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "No universal SMED reference range exists; verify against time studies, routings, payroll, and approved implementation quotations.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => SMED_ROI_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (hourlyRates.has(input.from_input)) return { ...input, base_unit: "currency_unit_per_h" };
      if (timeInputs.has(input.from_input)) return { ...input, base_unit: "s" };
      if (input.from_input === "batch_quantity") return { ...input, base_unit: "count" };
      if (input.from_input === "annual_volume") return { ...input, base_unit: "count/year" };
      return input;
    });
  for (const group of schema.ui_contract?.input_groups ?? []) {
    group.fields = Array.isArray(group.fields) ? group.fields.filter((id) => SMED_ROI_INPUT_IDS.has(id)) : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) rule.affected_inputs = rule.affected_inputs.filter((id) => SMED_ROI_INPUT_IDS.has(id));
    }
  }
  schema.outputs = SMED_ROI_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = SMED_ROI_FORMULA_VERSION;
  schema.metadata.schema_version = SMED_ROI_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal SMED changeover-time reduction, capacity, and simple ROI model",
    model_id: SMED_ROI_MODEL_ID,
    reduction_policy: "EXPLICIT_USER_ENTERED_RATIO_NO_HIDDEN_PERCENTAGE",
    investment_policy: "EXPLICIT_USER_ENTERED_IMPLEMENTATION_COST_NO_DEFAULT",
    changeover_frequency: "ANNUAL_VOLUME_DIVIDED_BY_BATCH_QUANTITY",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_annual_gross_saving",
    secondary_metrics: ["out_simple_payback_years", "out_annual_saved_hours", "out_additional_capacity_units", "out_saving_lower_bound"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_annual_gross_saving", "out_implementation_cost", "out_saving_lower_bound", "out_saving_upper_bound", "out_decision_state"],
    money_at_risk_output_id: "out_implementation_cost",
    main_cost_driver_output_id: "out_primary_saving_rate_driver",
    quote_or_decision_impact_output_id: "out_decision_state",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "SMED_SAVING_SOURCE_CONFIDENCE_ALLOWANCE_V1",
    description: "Annual gross saving plus or minus its source-confidence shortfall allowance.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const EMPLOYEE_COST_INPUT_IDS = new Set([
  "machine_rate", "material_cost", "target_margin", "annual_volume", "labor_rate",
  "overhead_rate", "defect_or_loss_cost", "source_confidence_ratio", "uncertainty_multiplier",
]);

const EMPLOYEE_COST_OUTPUTS: ServerOutput[] = [
  output("out_base_annual_compensation", "Base Annual Compensation", "currency_unit/year", "PRIMARY_DECISION", "Base hourly wage multiplied by annual paid hours."),
  output("out_employer_payroll_taxes", "Employer Payroll Taxes", "currency_unit/year", "BUSINESS_IMPACT", "Base annual compensation multiplied by the entered employer tax ratio."),
  output("out_annual_benefits_cost", "Annual Benefits Cost", "currency_unit/year", "BUSINESS_IMPACT", "User-entered annual benefits cost."),
  output("out_paid_non_productive_hours", "Paid Non-Productive Hours", "h/year", "SECONDARY_METRIC", "Annual paid hours less productive hours."),
  output("out_paid_non_productive_cost", "Paid Non-Productive Cost Disclosure", "currency_unit/year", "SECONDARY_METRIC", "Non-productive paid hours multiplied by base wage; already included in base compensation and not added twice."),
  output("out_annual_training_cost", "Annual Training Cost", "currency_unit/year", "BUSINESS_IMPACT", "User-entered annual training allocation."),
  output("out_annual_equipment_it_cost", "Annual Equipment and IT Cost", "currency_unit/year", "BUSINESS_IMPACT", "User-entered annual equipment and IT allocation."),
  output("out_annual_workspace_facility_cost", "Annual Workspace and Facility Cost", "currency_unit/year", "BUSINESS_IMPACT", "User-entered annual workspace and facility allocation."),
  output("out_fully_loaded_annual_cost", "Fully Loaded Annual Employee Cost", "currency_unit/year", "PRIMARY_DECISION", "Base compensation, payroll taxes, benefits, training, equipment, and workspace cost."),
  output("out_monthly_employer_cost", "Monthly Employer Cost", "currency_unit/month", "SECONDARY_METRIC", "Fully loaded annual cost divided by 12."),
  output("out_productive_hours_annual", "Annual Productive Hours", "h/year", "PRIMARY_DECISION", "Annual paid hours multiplied by productive-time ratio."),
  output("out_productive_hourly_cost", "Productive-Hour Employee Cost", "currency_unit/h", "PRIMARY_DECISION", "Fully loaded annual cost divided by positive productive hours."),
  output("out_base_to_loaded_multiplier", "Base-to-Loaded Cost Multiplier", "ratio", "SECONDARY_METRIC", "Fully loaded annual cost divided by base annual compensation."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to payroll and burden evidence."),
  output("out_annual_cost_uncertainty", "Annual Cost Uncertainty", "currency_unit/year", "RISK", "Fully loaded annual cost multiplied by source-confidence shortfall."),
  output("out_annual_cost_lower_bound", "Annual Cost Lower Bound", "currency_unit/year", "RISK", "Fully loaded annual cost less transparent evidence uncertainty."),
  output("out_annual_cost_upper_bound", "Annual Cost Upper Bound", "currency_unit/year", "RISK", "Fully loaded annual cost plus transparent evidence uncertainty."),
  output("out_primary_additive_cost_driver", "Primary Additive Cost Driver", "0/1/2/3/4/5", "SECONDARY_METRIC", "0 = base pay, 1 = taxes, 2 = benefits, 3 = training, 4 = equipment/IT, 5 = workspace."),
  output("out_decision_state", "Employee-Cost Evidence State", "0/1/2", "STATUS", "0 = confidence at least 90%, 1 = 75% to below 90%, 2 = below 75%."),
];

function applyEmployeeCostContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => EMPLOYEE_COST_INPUT_IDS.has(input.id));
  const annualCostIds = new Set(["machine_rate", "material_cost", "overhead_rate", "defect_or_loss_cost"]);
  for (const input of schema.inputs) {
    input.output_bindings = EMPLOYEE_COST_OUTPUTS.map((item) => item.id);
    if (input.id === "labor_rate") {
      input.name = "Base Hourly Wage";
      input.base_unit = "currency_unit_per_h";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "annual_volume") {
      input.name = "Annual Paid Hours";
      input.base_unit = "h/year";
      input.type = "integer";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.max = 8784;
        input.physical_hard_bounds.unit = "h/year";
      }
    }
    if (input.id === "target_margin" && input.physical_hard_bounds) {
      input.name = "Productive-Time Ratio";
      input.base_unit = "ratio";
      input.physical_hard_bounds.min = 0.000001;
      input.physical_hard_bounds.max = 1;
      input.physical_hard_bounds.unit = "ratio";
    }
    if (input.id === "uncertainty_multiplier" && input.physical_hard_bounds) {
      input.name = "Employer Payroll Tax Ratio";
      input.base_unit = "ratio";
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.max = 1;
      input.physical_hard_bounds.unit = "ratio";
    }
    if (annualCostIds.has(input.id)) {
      input.base_unit = "currency_unit/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.id === "machine_rate") input.name = "Annual Equipment and IT Cost";
      if (input.id === "material_cost") input.name = "Annual Benefits Cost";
      if (input.id === "overhead_rate") input.name = "Annual Workspace and Facility Cost";
      if (input.id === "defect_or_loss_cost") input.name = "Annual Training Cost";
      if (input.physical_hard_bounds) input.physical_hard_bounds.unit = "currency_unit/year";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "Employment costs are jurisdiction and policy specific; verify against payroll, tax, benefits, and facility records.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => EMPLOYEE_COST_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (input.from_input === "annual_volume") return { ...input, base_unit: "h/year" };
      if (annualCostIds.has(input.from_input)) return { ...input, base_unit: "currency_unit/year" };
      if (["target_margin", "uncertainty_multiplier"].includes(input.from_input)) return { ...input, base_unit: "ratio" };
      return input;
    });
  for (const group of schema.ui_contract?.input_groups ?? []) {
    group.fields = Array.isArray(group.fields) ? group.fields.filter((id) => EMPLOYEE_COST_INPUT_IDS.has(id)) : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) rule.affected_inputs = rule.affected_inputs.filter((id) => EMPLOYEE_COST_INPUT_IDS.has(id));
    }
  }
  schema.outputs = EMPLOYEE_COST_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = EMPLOYEE_COST_FORMULA_VERSION;
  schema.metadata.schema_version = EMPLOYEE_COST_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal fully loaded employee cost and productive-hour allocation",
    model_id: EMPLOYEE_COST_MODEL_ID,
    hidden_default_policy: "NO_STATUTORY_OR_BENEFIT_DEFAULTS",
    paid_leave_policy: "NON_PRODUCTIVE_PAID_TIME_DISCLOSED_AS_BASE_PAY_SUBSET_NOT_DOUBLE_COUNTED",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_productive_hourly_cost",
    secondary_metrics: ["out_fully_loaded_annual_cost", "out_base_to_loaded_multiplier", "out_paid_non_productive_cost", "out_annual_cost_upper_bound"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_fully_loaded_annual_cost", "out_productive_hourly_cost", "out_annual_cost_upper_bound", "out_decision_state"],
    money_at_risk_output_id: "out_annual_cost_upper_bound",
    main_cost_driver_output_id: "out_primary_additive_cost_driver",
    quote_or_decision_impact_output_id: "out_productive_hourly_cost",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "EMPLOYEE_COST_SOURCE_CONFIDENCE_ALLOWANCE_V1",
    description: "Fully loaded annual cost plus or minus its source-confidence shortfall allowance.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const JOB_QUOTE_OUTPUTS: ServerOutput[] = [
  output("out_setup_seconds_per_unit", "Setup Time per Unit", "s/unit", "SECONDARY_METRIC", "Job setup seconds divided by positive integer job quantity."),
  output("out_effective_seconds_per_unit", "Effective Route Time per Unit", "s/unit", "PRIMARY_DECISION", "Cycle seconds plus allocated setup seconds per unit."),
  output("out_machine_cost_per_unit", "Machine Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Machine hourly rate applied to effective route time."),
  output("out_labor_cost_per_unit", "Labor Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Labor hourly rate applied to effective route time."),
  output("out_overhead_cost_per_unit", "Overhead Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Annual overhead pool divided by positive integer annual volume."),
  output("out_material_cost_per_unit", "Material Cost per Unit", "currency_unit/unit", "EVIDENCE", "User-entered material cost per unit."),
  output("out_other_direct_cost_per_unit", "Other Direct Job Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Other direct job cost divided by job quantity."),
  output("out_fully_loaded_cost_per_unit", "Fully Loaded Cost per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Material, machine, labor, overhead, and other direct cost per unit."),
  output("out_fully_loaded_job_cost", "Fully Loaded Job Cost", "currency_unit/job", "PRIMARY_DECISION", "Fully loaded unit cost multiplied by job quantity."),
  output("out_target_quote_per_unit", "Target Quote per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Fully loaded unit cost divided by one minus target gross margin."),
  output("out_target_quote_total", "Target Quote Total", "currency_unit/job", "PRIMARY_DECISION", "Target quote per unit multiplied by job quantity."),
  output("out_gross_profit_per_unit", "Gross Profit per Unit", "currency_unit/unit", "SECONDARY_METRIC", "Target quote per unit less fully loaded cost per unit."),
  output("out_gross_profit_total", "Gross Profit Total", "currency_unit/job", "BUSINESS_IMPACT", "Target quote total less fully loaded job cost."),
  output("out_achieved_gross_margin_ratio", "Achieved Gross Margin", "ratio", "PRIMARY_DECISION", "Gross profit per unit divided by target quote per unit."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to quote evidence."),
  output("out_cost_uncertainty_per_unit", "Cost Uncertainty per Unit", "currency_unit/unit", "RISK", "Unit cost multiplied by confidence shortfall and explicit coverage multiplier."),
  output("out_cost_lower_bound_per_unit", "Unit Cost Lower Bound", "currency_unit/unit", "RISK", "Unit cost less transparent uncertainty."),
  output("out_cost_upper_bound_per_unit", "Unit Cost Upper Bound", "currency_unit/unit", "RISK", "Unit cost plus transparent uncertainty."),
  output("out_quote_lower_bound_per_unit", "Quote Lower Bound per Unit", "currency_unit/unit", "RISK", "Lower cost bound converted at target gross margin."),
  output("out_quote_upper_bound_per_unit", "Quote Upper Bound per Unit", "currency_unit/unit", "RISK", "Upper cost bound converted at target gross margin."),
  output("out_primary_unit_cost_driver", "Primary Unit Cost Driver", "0/1/2/3/4", "SECONDARY_METRIC", "0 = material, 1 = machine, 2 = labor, 3 = overhead, 4 = other direct."),
  output("out_decision_state", "Quote Evidence State", "0/1/2", "STATUS", "0 = relative uncertainty at most 10%, 1 = at most 25%, 2 = above 25%."),
];

function applyJobQuoteContract(schema: SuperV4Schema): SuperV4Schema {
  const hourlyRates = new Set(["machine_rate", "labor_rate"]);
  const timeInputs = new Set(["cycle_time", "setup_time"]);
  for (const input of schema.inputs) {
    input.output_bindings = JOB_QUOTE_OUTPUTS.map((item) => item.id);
    if (hourlyRates.has(input.id)) {
      input.base_unit = "currency_unit_per_h";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (timeInputs.has(input.id)) {
      input.base_unit = "s";
      input.allowed_display_units = ["s", "min", "h"];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = input.id === "cycle_time" ? 0.000001 : 0;
        input.physical_hard_bounds.unit = "s";
      }
    }
    if (input.id === "batch_quantity" || input.id === "annual_volume") {
      input.base_unit = input.id === "batch_quantity" ? "count/job" : "count/year";
      input.type = "integer";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.id === "batch_quantity") input.name = "Job Quantity";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.unit = input.base_unit;
      }
    }
    if (input.id === "material_cost") {
      input.base_unit = "currency_unit/unit";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "overhead_rate") {
      input.name = "Annual Overhead Pool";
      input.base_unit = "currency_unit/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "defect_or_loss_cost") {
      input.name = "Other Direct Job Cost";
      input.base_unit = "currency_unit/job";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "target_margin" && input.physical_hard_bounds) {
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.max = 0.999999;
      input.physical_hard_bounds.unit = "ratio";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "No universal quote-cost range exists; verify against routings, supplier quotes, payroll, and ledger evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs.map((input) => {
    if (hourlyRates.has(input.from_input)) return { ...input, base_unit: "currency_unit_per_h" };
    if (timeInputs.has(input.from_input)) return { ...input, base_unit: "s" };
    if (input.from_input === "batch_quantity") return { ...input, base_unit: "count/job" };
    if (input.from_input === "annual_volume") return { ...input, base_unit: "count/year" };
    if (input.from_input === "material_cost") return { ...input, base_unit: "currency_unit/unit" };
    if (input.from_input === "overhead_rate") return { ...input, base_unit: "currency_unit/year" };
    if (input.from_input === "defect_or_loss_cost") return { ...input, base_unit: "currency_unit/job" };
    return input;
  });
  schema.outputs = JOB_QUOTE_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = JOB_QUOTE_FORMULA_VERSION;
  schema.metadata.schema_version = JOB_QUOTE_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal full-cost job quote with gross-margin pricing and explicit evidence bounds",
    model_id: JOB_QUOTE_MODEL_ID,
    setup_allocation: "SETUP_SECONDS_PER_JOB_DIVIDED_BY_JOB_QUANTITY",
    overhead_allocation: "ANNUAL_OVERHEAD_POOL_DIVIDED_BY_ANNUAL_VOLUME",
    gross_margin_identity: "QUOTE_TIMES_ONE_MINUS_MARGIN_EQUALS_FULL_COST",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_target_quote_total",
    secondary_metrics: ["out_fully_loaded_job_cost", "out_achieved_gross_margin_ratio", "out_quote_lower_bound_per_unit", "out_quote_upper_bound_per_unit"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_fully_loaded_job_cost", "out_target_quote_total", "out_quote_upper_bound_per_unit", "out_decision_state"],
    money_at_risk_output_id: "out_cost_uncertainty_per_unit",
    main_cost_driver_output_id: "out_primary_unit_cost_driver",
    quote_or_decision_impact_output_id: "out_target_quote_total",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "JOB_QUOTE_COST_CONFIDENCE_COVERAGE_V1",
    description: "Fully loaded unit cost plus or minus confidence shortfall multiplied by the explicit coverage multiplier.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const SKU_MARGIN_INPUT_IDS = new Set([
  "machine_rate", "cycle_time", "material_cost", "target_margin", "annual_volume",
  "labor_rate", "overhead_rate", "defect_or_loss_cost", "source_confidence_ratio",
  "uncertainty_multiplier",
]);

const SKU_MARGIN_OUTPUTS: ServerOutput[] = [
  output("out_machine_cost_per_unit", "Machine Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Machine hourly rate applied to cycle time."),
  output("out_labor_cost_per_unit", "Labor Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Labor hourly rate applied to cycle time."),
  output("out_material_cost_per_unit", "Material Cost per Unit", "currency_unit/unit", "EVIDENCE", "User-entered material cost per unit."),
  output("out_overhead_cost_per_unit", "Overhead Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Annual overhead pool divided by annual volume."),
  output("out_quality_service_cost_per_unit", "Quality and Service Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Annual SKU quality/service burden divided by annual volume."),
  output("out_fully_loaded_cost_per_unit", "Fully Loaded SKU Cost per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Material, machine, labor, overhead, and quality/service cost per unit."),
  output("out_current_selling_price_per_unit", "Current Selling Price per Unit", "currency_unit/unit", "EVIDENCE", "User-entered current SKU selling price."),
  output("out_gross_profit_per_unit", "Gross Profit per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Selling price less fully loaded cost per unit."),
  output("out_gross_margin_ratio", "Current Gross Margin", "ratio", "PRIMARY_DECISION", "Gross profit per unit divided by positive selling price."),
  output("out_target_gross_margin_ratio", "Target Gross Margin", "ratio", "EVIDENCE", "User-entered target gross margin."),
  output("out_target_price_per_unit", "Target Price per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Fully loaded cost divided by one minus target gross margin."),
  output("out_price_gap_to_target", "Price Gap to Target", "currency_unit/unit", "BUSINESS_IMPACT", "Current selling price less target price."),
  output("out_margin_gap_to_target", "Margin Gap to Target", "ratio", "RISK", "Current gross margin less target gross margin."),
  output("out_annual_revenue", "Annual SKU Revenue", "currency_unit/year", "BUSINESS_IMPACT", "Current selling price multiplied by annual volume."),
  output("out_annual_fully_loaded_cost", "Annual Fully Loaded SKU Cost", "currency_unit/year", "BUSINESS_IMPACT", "Fully loaded unit cost multiplied by annual volume."),
  output("out_annual_gross_profit", "Annual Gross Profit", "currency_unit/year", "PRIMARY_DECISION", "Annual revenue less annual fully loaded cost."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to SKU cost evidence."),
  output("out_annual_profit_uncertainty", "Annual Profit Uncertainty", "currency_unit/year", "RISK", "Annual fully loaded cost multiplied by source-confidence shortfall."),
  output("out_annual_profit_lower_bound", "Annual Profit Lower Bound", "currency_unit/year", "RISK", "Annual gross profit less transparent cost uncertainty."),
  output("out_annual_profit_upper_bound", "Annual Profit Upper Bound", "currency_unit/year", "RISK", "Annual gross profit plus transparent cost uncertainty."),
  output("out_primary_unit_cost_driver", "Primary Unit Cost Driver", "0/1/2/3/4", "SECONDARY_METRIC", "0 = material, 1 = machine, 2 = labor, 3 = overhead, 4 = quality/service."),
  output("out_decision_state", "SKU Margin Decision State", "0/1/2", "STATUS", "0 = profitable lower bound and target margin met, 1 = review/reprice, 2 = profit upper bound negative."),
];

function applySkuMarginContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => SKU_MARGIN_INPUT_IDS.has(input.id));
  const rates = new Set(["machine_rate", "labor_rate"]);
  for (const input of schema.inputs) {
    input.output_bindings = SKU_MARGIN_OUTPUTS.map((item) => item.id);
    if (rates.has(input.id)) {
      input.base_unit = "currency_unit_per_h";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "cycle_time") {
      input.base_unit = "s";
      input.allowed_display_units = ["s", "min", "h"];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0.000001;
        input.physical_hard_bounds.unit = "s";
      }
    }
    if (input.id === "annual_volume") {
      input.base_unit = "count/year";
      input.type = "integer";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.unit = "count/year";
      }
    }
    if (input.id === "material_cost") {
      input.base_unit = "currency_unit/unit";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "overhead_rate" || input.id === "defect_or_loss_cost") {
      input.base_unit = "currency_unit/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      input.name = input.id === "overhead_rate" ? "Annual Overhead Pool" : "Annual SKU Quality and Service Cost";
    }
    if (input.id === "uncertainty_multiplier") {
      input.name = "Current Selling Price per Unit";
      input.base_unit = "currency_unit/unit";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0.000001;
        input.physical_hard_bounds.max = 50_000_000;
        input.physical_hard_bounds.unit = "currency_unit/unit";
      }
    }
    if (input.id === "target_margin" && input.physical_hard_bounds) {
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.max = 0.999999;
      input.physical_hard_bounds.unit = "ratio";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "SKU economics are portfolio specific; verify against ERP price, routing, quality, service, and ledger records.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => SKU_MARGIN_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (rates.has(input.from_input)) return { ...input, base_unit: "currency_unit_per_h" };
      if (input.from_input === "annual_volume") return { ...input, base_unit: "count/year" };
      if (["overhead_rate", "defect_or_loss_cost"].includes(input.from_input)) return { ...input, base_unit: "currency_unit/year" };
      if (["material_cost", "uncertainty_multiplier"].includes(input.from_input)) return { ...input, base_unit: "currency_unit/unit" };
      return input;
    });
  for (const group of schema.ui_contract?.input_groups ?? []) {
    group.fields = Array.isArray(group.fields) ? group.fields.filter((id) => SKU_MARGIN_INPUT_IDS.has(id)) : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) rule.affected_inputs = rule.affected_inputs.filter((id) => SKU_MARGIN_INPUT_IDS.has(id));
    }
  }
  schema.outputs = SKU_MARGIN_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = SKU_MARGIN_FORMULA_VERSION;
  schema.metadata.schema_version = SKU_MARGIN_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal single-SKU full-cost margin scorecard",
    model_id: SKU_MARGIN_MODEL_ID,
    ranking_scope: "ONE_SKU_RECORD_ONLY_CROSS_SKU_RANKING_REQUIRES_MULTIPLE_CERTIFIED_RECORDS",
    price_policy: "EXPLICIT_USER_ENTERED_PRICE_NO_MATERIAL_MARKUP_DEFAULT",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_annual_gross_profit",
    secondary_metrics: ["out_gross_margin_ratio", "out_target_price_per_unit", "out_margin_gap_to_target", "out_annual_profit_lower_bound"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_annual_gross_profit", "out_gross_margin_ratio", "out_annual_profit_lower_bound", "out_decision_state"],
    money_at_risk_output_id: "out_annual_profit_lower_bound",
    main_cost_driver_output_id: "out_primary_unit_cost_driver",
    quote_or_decision_impact_output_id: "out_target_price_per_unit",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "SKU_MARGIN_COST_CONFIDENCE_ALLOWANCE_V1",
    description: "Annual gross profit plus or minus annual fully loaded cost multiplied by source-confidence shortfall.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const LOSS_MAKING_JOB_INPUT_IDS = new Set([
  "machine_rate", "cycle_time", "setup_time", "batch_quantity", "material_cost",
  "target_margin", "annual_volume", "labor_rate", "overhead_rate",
  "defect_or_loss_cost", "source_confidence_ratio", "uncertainty_multiplier",
]);

const LOSS_MAKING_JOB_OUTPUTS: ServerOutput[] = [
  output("out_setup_seconds_per_unit", "Allocated Setup Time per Unit", "s/unit", "SECONDARY_METRIC", "Entered setup time divided by the positive job quantity."),
  output("out_effective_seconds_per_unit", "Effective Processing Time per Unit", "s/unit", "BUSINESS_IMPACT", "Cycle time plus allocated setup time per unit."),
  output("out_machine_cost_per_unit", "Machine Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Machine hourly rate applied to effective processing time."),
  output("out_labor_cost_per_unit", "Labor Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Labor hourly rate applied to effective processing time."),
  output("out_material_cost_per_unit", "Material Cost per Unit", "currency_unit/unit", "EVIDENCE", "User-entered direct material cost per unit."),
  output("out_overhead_cost_per_unit", "Allocated Overhead per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Annual overhead pool divided by annual production volume."),
  output("out_other_direct_cost_per_unit", "Other Direct Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Other direct job cost divided by job quantity."),
  output("out_fully_loaded_cost_per_unit", "Fully Loaded Cost per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Sum of material, machine, labor, allocated overhead, and other direct unit costs."),
  output("out_fully_loaded_job_cost", "Fully Loaded Job Cost", "currency_unit/job", "PRIMARY_DECISION", "Fully loaded unit cost multiplied by job quantity."),
  output("out_quoted_job_revenue", "Quoted Job Revenue", "currency_unit/job", "EVIDENCE", "Explicit user-entered total revenue for this job; no price is inferred."),
  output("out_gross_profit", "Quoted Job Gross Profit", "currency_unit/job", "PRIMARY_DECISION", "Quoted job revenue less fully loaded job cost."),
  output("out_gross_margin_ratio", "Quoted Job Gross Margin", "ratio", "PRIMARY_DECISION", "Gross profit divided by positive quoted job revenue."),
  output("out_target_gross_margin_ratio", "Target Gross Margin", "ratio", "EVIDENCE", "User-entered target gross margin ratio."),
  output("out_minimum_quote_total", "Minimum Quote for Target Margin", "currency_unit/job", "PRIMARY_DECISION", "Fully loaded job cost divided by one minus target gross margin."),
  output("out_quote_gap_to_target", "Quote Gap to Target", "currency_unit/job", "BUSINESS_IMPACT", "Quoted job revenue less the minimum quote required for target margin."),
  output("out_annual_equivalent_jobs", "Annual Equivalent Jobs", "job/year", "SECONDARY_METRIC", "Annual volume divided by this job quantity; fractional equivalents are retained."),
  output("out_annual_equivalent_gross_profit", "Annual Equivalent Gross Profit", "currency_unit/year", "BUSINESS_IMPACT", "Quoted job gross profit multiplied by annual equivalent jobs."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to job cost evidence."),
  output("out_profit_uncertainty", "Job Profit Uncertainty", "currency_unit/job", "RISK", "Fully loaded job cost multiplied by the source-confidence shortfall."),
  output("out_profit_lower_bound", "Job Profit Lower Bound", "currency_unit/job", "RISK", "Gross profit less transparent cost-evidence uncertainty."),
  output("out_profit_upper_bound", "Job Profit Upper Bound", "currency_unit/job", "RISK", "Gross profit plus transparent cost-evidence uncertainty."),
  output("out_money_at_risk", "Money at Risk", "currency_unit/job", "RISK", "Absolute negative profit lower bound, or zero when the lower bound is non-negative."),
  output("out_primary_unit_cost_driver", "Primary Unit Cost Driver", "0/1/2/3/4", "SECONDARY_METRIC", "0 = material, 1 = machine, 2 = labor, 3 = overhead, 4 = other direct cost; deterministic ties retain the earlier category."),
  output("out_decision_state", "Job Profitability Decision State", "0/1/2", "STATUS", "0 = target margin and profit lower bound pass, 1 = review, 2 = profit upper bound remains negative."),
];

function applyLossMakingJobContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => LOSS_MAKING_JOB_INPUT_IDS.has(input.id));
  const hourlyRates = new Set(["machine_rate", "labor_rate"]);
  const timeInputs = new Set(["cycle_time", "setup_time"]);
  for (const input of schema.inputs) {
    input.output_bindings = LOSS_MAKING_JOB_OUTPUTS.map((item) => item.id);
    if (hourlyRates.has(input.id)) {
      input.base_unit = "currency_unit_per_h";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (timeInputs.has(input.id)) {
      input.base_unit = "s";
      input.allowed_display_units = ["s", "min", "h"];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = input.id === "cycle_time" ? 0.000001 : 0;
        input.physical_hard_bounds.unit = "s";
      }
    }
    if (input.id === "batch_quantity" || input.id === "annual_volume") {
      input.type = "integer";
      input.base_unit = input.id === "batch_quantity" ? "count/job" : "count/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.unit = input.base_unit;
      }
    }
    if (input.id === "material_cost") {
      input.name = "Direct Material Cost per Unit";
      input.base_unit = "currency_unit/unit";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "overhead_rate") {
      input.name = "Annual Overhead Pool";
      input.base_unit = "currency_unit/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "defect_or_loss_cost") {
      input.name = "Other Direct Job Cost";
      input.base_unit = "currency_unit/job";
      input.unit_selectable = false;
      input.allowed_display_units = [];
    }
    if (input.id === "uncertainty_multiplier") {
      input.name = "Quoted Job Revenue";
      input.base_unit = "currency_unit/job";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0.000001;
        input.physical_hard_bounds.max = 50_000_000;
        input.physical_hard_bounds.unit = "currency_unit/job";
      }
    }
    if (input.id === "target_margin" && input.physical_hard_bounds) {
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.max = 0.999999;
      input.physical_hard_bounds.unit = "ratio";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "Job economics are contract and routing specific; verify against the quote, routing, payroll, purchasing, and ledger evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => LOSS_MAKING_JOB_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (hourlyRates.has(input.from_input)) return { ...input, base_unit: "currency_unit_per_h" };
      if (timeInputs.has(input.from_input)) return { ...input, base_unit: "s" };
      if (input.from_input === "batch_quantity") return { ...input, base_unit: "count/job" };
      if (input.from_input === "annual_volume") return { ...input, base_unit: "count/year" };
      if (input.from_input === "material_cost") return { ...input, base_unit: "currency_unit/unit" };
      if (input.from_input === "overhead_rate") return { ...input, base_unit: "currency_unit/year" };
      if (input.from_input === "defect_or_loss_cost" || input.from_input === "uncertainty_multiplier") {
        return { ...input, base_unit: "currency_unit/job" };
      }
      return input;
    });
  for (const group of schema.ui_contract?.input_groups ?? []) {
    group.fields = Array.isArray(group.fields) ? group.fields.filter((id) => LOSS_MAKING_JOB_INPUT_IDS.has(id)) : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) rule.affected_inputs = rule.affected_inputs.filter((id) => LOSS_MAKING_JOB_INPUT_IDS.has(id));
    }
  }
  schema.outputs = LOSS_MAKING_JOB_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = LOSS_MAKING_JOB_FORMULA_VERSION;
  schema.metadata.schema_version = LOSS_MAKING_JOB_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal full-cost job profitability with explicit quoted revenue and evidence bounds",
    model_id: LOSS_MAKING_JOB_MODEL_ID,
    revenue_policy: "EXPLICIT_USER_ENTERED_TOTAL_JOB_REVENUE_NO_INFERRED_PRICE",
    setup_allocation: "SETUP_SECONDS_PER_JOB_DIVIDED_BY_JOB_QUANTITY",
    overhead_allocation: "ANNUAL_OVERHEAD_POOL_DIVIDED_BY_ANNUAL_VOLUME",
    gross_margin_identity: "GROSS_PROFIT_DIVIDED_BY_POSITIVE_QUOTED_JOB_REVENUE",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_gross_profit",
    secondary_metrics: ["out_gross_margin_ratio", "out_minimum_quote_total", "out_profit_lower_bound", "out_money_at_risk"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_fully_loaded_job_cost", "out_gross_profit", "out_profit_lower_bound", "out_decision_state"],
    money_at_risk_output_id: "out_money_at_risk",
    main_cost_driver_output_id: "out_primary_unit_cost_driver",
    quote_or_decision_impact_output_id: "out_minimum_quote_total",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "JOB_PROFIT_COST_CONFIDENCE_ALLOWANCE_V1",
    description: "Quoted job gross profit plus or minus fully loaded job cost multiplied by source-confidence shortfall.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const CASH_SURVIVAL_INPUT_IDS = new Set([
  "initial_investment", "annual_net_cash_flow", "discount_rate", "analysis_years",
  "residual_value", "stress_downside_factor", "labor_rate", "overhead_rate",
  "defect_or_loss_cost", "source_confidence_ratio", "uncertainty_multiplier",
]);

const CASH_SURVIVAL_OUTPUTS: ServerOutput[] = [
  output("out_contribution_margin_ratio", "Cash Contribution Margin", "ratio", "PRIMARY_DECISION", "One minus the entered variable cash cost ratio."),
  output("out_monthly_variable_cash_cost", "Monthly Variable Cash Cost", "currency_unit/month", "BUSINESS_IMPACT", "Current monthly revenue multiplied by the variable cash cost ratio."),
  output("out_monthly_contribution", "Monthly Cash Contribution", "currency_unit/month", "BUSINESS_IMPACT", "Current monthly revenue less monthly variable cash cost."),
  output("out_monthly_fixed_cash_cost", "Monthly Fixed Cash Cost", "currency_unit/month", "BUSINESS_IMPACT", "Payroll, other fixed operating cost, and debt or fixed obligations."),
  output("out_monthly_net_cash_flow", "Monthly Net Operating Cash Flow", "currency_unit/month", "PRIMARY_DECISION", "Monthly cash contribution less monthly fixed cash cost."),
  output("out_break_even_monthly_revenue", "Break-Even Monthly Revenue", "currency_unit/month", "PRIMARY_DECISION", "Monthly fixed cash cost divided by the positive cash contribution margin ratio."),
  output("out_monthly_revenue_gap_to_break_even", "Monthly Revenue Gap to Break-Even", "currency_unit/month", "PRIMARY_DECISION", "Current monthly revenue less break-even monthly revenue."),
  output("out_stressed_monthly_revenue", "Stressed Monthly Revenue", "currency_unit/month", "RISK", "Current monthly revenue multiplied by the explicit stressed revenue retention ratio."),
  output("out_stressed_monthly_net_cash_flow", "Stressed Monthly Net Cash Flow", "currency_unit/month", "RISK", "Stressed contribution less monthly fixed cash cost."),
  output("out_base_ending_cash", "Base Forecast Ending Cash", "currency_unit", "BUSINESS_IMPACT", "Opening cash plus monthly net cash flow across the forecast horizon."),
  output("out_stressed_ending_cash", "Stressed Forecast Ending Cash", "currency_unit", "PRIMARY_DECISION", "Opening cash plus stressed monthly net cash flow across the forecast horizon."),
  output("out_minimum_cash_reserve", "Minimum Cash Reserve", "currency_unit", "EVIDENCE", "User-entered cash balance that must remain protected."),
  output("out_cash_available_above_reserve", "Opening Cash Above Reserve", "currency_unit", "SECONDARY_METRIC", "Positive opening cash balance in excess of the minimum reserve."),
  output("out_stressed_monthly_burn", "Stressed Monthly Cash Burn", "currency_unit/month", "RISK", "Absolute stressed monthly net outflow, or zero when stressed cash flow is non-negative."),
  output("out_stressed_runway_within_horizon_months", "Stressed Runway Within Forecast Horizon", "month", "PRIMARY_DECISION", "Months before cash reaches reserve, explicitly capped at the entered forecast horizon."),
  output("out_required_opening_cash_for_stress_horizon", "Required Opening Cash for Stress Horizon", "currency_unit", "RISK", "Minimum reserve plus stressed monthly burn across the forecast horizon."),
  output("out_additional_funding_required", "Additional Funding Required", "currency_unit", "BUSINESS_IMPACT", "Positive gap between required and actual opening cash before evidence uncertainty."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to cash-flow evidence."),
  output("out_cash_uncertainty", "Forecast Cash Uncertainty", "currency_unit", "RISK", "Stressed operating cash exposure multiplied by horizon, confidence shortfall, and explicit coverage multiplier."),
  output("out_stressed_cash_lower_bound", "Stressed Cash Lower Bound", "currency_unit", "RISK", "Stressed ending cash less transparent evidence uncertainty."),
  output("out_stressed_cash_upper_bound", "Stressed Cash Upper Bound", "currency_unit", "RISK", "Stressed ending cash plus transparent evidence uncertainty."),
  output("out_money_at_risk", "Cash at Risk Below Reserve", "currency_unit", "RISK", "Positive gap between the minimum reserve and stressed cash lower bound."),
  output("out_primary_cash_cost_driver", "Primary Monthly Cash Cost Driver", "0/1/2/3", "SECONDARY_METRIC", "0 = payroll, 1 = other fixed operating cost, 2 = debt and fixed obligations, 3 = stressed variable cash cost."),
  output("out_decision_state", "Cash Survival Decision State", "0/1/2", "STATUS", "0 = break-even and lower-bound reserve pass, 1 = review, 2 = even the upper bound breaches reserve."),
];

function applyCashSurvivalContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => CASH_SURVIVAL_INPUT_IDS.has(input.id));
  const monthlyCurrencyInputs = new Set([
    "annual_net_cash_flow", "labor_rate", "overhead_rate", "defect_or_loss_cost",
  ]);
  for (const input of schema.inputs) {
    input.output_bindings = CASH_SURVIVAL_OUTPUTS.map((item) => item.id);
    input.unit_selectable = false;
    input.allowed_display_units = [];
    if (input.id === "initial_investment") {
      input.name = "Opening Unrestricted Cash Balance";
      input.base_unit = "currency_unit";
    }
    if (input.id === "annual_net_cash_flow") {
      input.name = "Current Monthly Revenue";
      input.base_unit = "currency_unit/month";
    }
    if (input.id === "discount_rate") {
      input.name = "Variable Cash Cost Ratio";
      input.base_unit = "ratio";
      input.unit_selectable = true;
      input.allowed_display_units = ["percent", "ratio"];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = 0.999999;
        input.physical_hard_bounds.unit = "ratio";
      }
    }
    if (input.id === "analysis_years") {
      input.name = "Forecast Horizon Months";
      input.type = "integer";
      input.base_unit = "month";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.max = 120;
        input.physical_hard_bounds.unit = "month";
      }
    }
    if (input.id === "residual_value") {
      input.name = "Minimum Cash Reserve";
      input.base_unit = "currency_unit";
    }
    if (input.id === "stress_downside_factor") {
      input.name = "Stressed Revenue Retention Ratio";
      input.base_unit = "ratio";
      input.unit_selectable = true;
      input.allowed_display_units = ["ratio", "percent"];
    }
    if (input.id === "labor_rate") {
      input.name = "Monthly Payroll Cash Cost";
      input.base_unit = "currency_unit/month";
    }
    if (input.id === "overhead_rate") {
      input.name = "Monthly Other Fixed Operating Cost";
      input.base_unit = "currency_unit/month";
    }
    if (input.id === "defect_or_loss_cost") {
      input.name = "Monthly Debt and Fixed Obligations";
      input.base_unit = "currency_unit/month";
    }
    if (input.id === "source_confidence_ratio") {
      input.unit_selectable = true;
      input.allowed_display_units = ["ratio", "percent"];
    }
    if (input.id === "uncertainty_multiplier") {
      input.name = "Uncertainty Coverage Multiplier";
      input.base_unit = "ratio";
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = 10;
        input.physical_hard_bounds.unit = "ratio";
      }
    }
    if (input.physical_hard_bounds && (monthlyCurrencyInputs.has(input.id) || ["initial_investment", "residual_value"].includes(input.id))) {
      input.physical_hard_bounds.min = 0;
      input.physical_hard_bounds.unit = input.base_unit ?? input.physical_hard_bounds.unit;
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "Cash survival thresholds are entity specific; reconcile to bank, receivables, payroll, debt, and general-ledger evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => CASH_SURVIVAL_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (monthlyCurrencyInputs.has(input.from_input)) return { ...input, base_unit: "currency_unit/month" };
      if (input.from_input === "analysis_years") return { ...input, base_unit: "month" };
      return input;
    });
  for (const group of schema.ui_contract?.input_groups ?? []) {
    group.fields = Array.isArray(group.fields) ? group.fields.filter((id) => CASH_SURVIVAL_INPUT_IDS.has(id)) : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) rule.affected_inputs = rule.affected_inputs.filter((id) => CASH_SURVIVAL_INPUT_IDS.has(id));
    }
  }
  schema.outputs = CASH_SURVIVAL_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = CASH_SURVIVAL_FORMULA_VERSION;
  schema.metadata.schema_version = CASH_SURVIVAL_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal monthly contribution break-even and horizon-capped stressed cash survival",
    model_id: CASH_SURVIVAL_MODEL_ID,
    timing_basis: "MONTHLY_END_OF_PERIOD_CONSTANT_RUN_RATE",
    runway_policy: "CAPPED_AT_EXPLICIT_FORECAST_HORIZON_NO_SENTINEL",
    investment_appraisal_excluded: "NPV_AND_IRR_BELONG_TO_THE_SEPARATE_INVESTMENT_APPRAISAL_TOOL",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_stressed_cash_lower_bound",
    secondary_metrics: ["out_break_even_monthly_revenue", "out_stressed_runway_within_horizon_months", "out_additional_funding_required", "out_money_at_risk"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_break_even_monthly_revenue", "out_stressed_cash_lower_bound", "out_money_at_risk", "out_decision_state"],
    money_at_risk_output_id: "out_money_at_risk",
    main_cost_driver_output_id: "out_primary_cash_cost_driver",
    quote_or_decision_impact_output_id: "out_additional_funding_required",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "CASH_SURVIVAL_OPERATING_EXPOSURE_CONFIDENCE_V1",
    description: "Stressed ending cash plus or minus stressed operating cash exposure multiplied by horizon, source-confidence shortfall, and explicit coverage multiplier.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const RECEIVABLES_COST_INPUT_IDS = new Set([
  "material_cost", "cycle_time", "setup_time", "target_margin",
  "defect_or_loss_cost", "machine_rate", "labor_rate", "annual_volume",
  "source_confidence_ratio", "uncertainty_multiplier",
]);

const RECEIVABLES_COST_OUTPUTS: ServerOutput[] = [
  output("out_invoice_principal", "Invoice Principal", "currency_unit/invoice", "EVIDENCE", "User-entered invoice amount before payment-term addendum."),
  output("out_standard_payment_days", "Standard Payment Term", "day", "EVIDENCE", "Current standard payment term in whole calendar days."),
  output("out_proposed_payment_days", "Proposed Payment Term", "day", "EVIDENCE", "Proposed extended payment term in whole calendar days."),
  output("out_incremental_payment_days", "Incremental Payment Days", "day", "PRIMARY_DECISION", "Proposed payment days less standard payment days."),
  output("out_annual_financing_rate", "Annual Financing Rate", "ratio", "EVIDENCE", "Explicit user-entered annual financing rate used on an ACT/365 simple-interest basis."),
  output("out_financing_cost_per_invoice", "Incremental Financing Cost per Invoice", "currency_unit/invoice", "PRIMARY_DECISION", "Invoice principal multiplied by annual financing rate and incremental days divided by 365."),
  output("out_credit_loss_allowance_per_invoice", "Incremental Credit-Loss Allowance per Invoice", "currency_unit/invoice", "RISK", "Invoice principal multiplied by the user-entered incremental credit-loss ratio."),
  output("out_administration_cost_per_invoice", "Administration and Collection Cost per Invoice", "currency_unit/invoice", "BUSINESS_IMPACT", "Explicit payment-term administration and collection cost per invoice."),
  output("out_required_addendum_per_invoice", "Required Payment-Term Addendum per Invoice", "currency_unit/invoice", "PRIMARY_DECISION", "Financing cost, incremental credit-loss allowance, and administration cost."),
  output("out_required_addendum_ratio", "Required Addendum to Invoice Ratio", "ratio", "PRIMARY_DECISION", "Required addendum divided by positive invoice principal."),
  output("out_adjusted_invoice_amount", "Invoice Amount Including Required Addendum", "currency_unit/invoice", "BUSINESS_IMPACT", "Invoice principal plus required payment-term addendum."),
  output("out_quoted_term_uplift_per_invoice", "Quoted Payment-Term Uplift per Invoice", "currency_unit/invoice", "EVIDENCE", "User-entered uplift already proposed to the customer."),
  output("out_quoted_uplift_gap_to_required", "Quoted Uplift Gap to Required Addendum", "currency_unit/invoice", "PRIMARY_DECISION", "Quoted uplift less required addendum; negative values indicate under-recovery."),
  output("out_annual_invoice_count", "Annual Invoice Count", "invoice/year", "EVIDENCE", "Positive whole-number invoice count used for annual exposure."),
  output("out_annual_required_addendum", "Annual Required Addendum", "currency_unit/year", "BUSINESS_IMPACT", "Required addendum per invoice multiplied by annual invoice count."),
  output("out_annual_quoted_term_uplift", "Annual Quoted Term Uplift", "currency_unit/year", "BUSINESS_IMPACT", "Quoted uplift per invoice multiplied by annual invoice count."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to financing and credit evidence."),
  output("out_addendum_uncertainty_per_invoice", "Addendum Uncertainty per Invoice", "currency_unit/invoice", "RISK", "Required addendum multiplied by confidence shortfall and explicit coverage multiplier."),
  output("out_addendum_lower_bound_per_invoice", "Addendum Lower Bound per Invoice", "currency_unit/invoice", "RISK", "Non-negative lower evidence bound for required addendum."),
  output("out_addendum_upper_bound_per_invoice", "Addendum Upper Bound per Invoice", "currency_unit/invoice", "RISK", "Upper evidence bound for required addendum."),
  output("out_annual_money_at_risk", "Annual Money at Risk", "currency_unit/year", "RISK", "Positive uncovered upper-bound addendum multiplied by annual invoice count."),
  output("out_primary_addendum_driver", "Primary Addendum Driver", "0/1/2", "SECONDARY_METRIC", "0 = financing cost, 1 = incremental credit loss, 2 = administration and collection cost."),
  output("out_decision_state", "Payment-Term Addendum Decision State", "0/1/2", "STATUS", "0 = quoted uplift covers upper bound, 1 = covers lower bound only, 2 = below lower bound."),
];

function applyReceivablesCostContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => RECEIVABLES_COST_INPUT_IDS.has(input.id));
  const invoiceCurrencyInputs = new Set(["material_cost", "machine_rate", "labor_rate"]);
  const dayInputs = new Set(["cycle_time", "setup_time"]);
  const ratioInputs = new Set(["target_margin", "defect_or_loss_cost", "source_confidence_ratio"]);
  for (const input of schema.inputs) {
    input.output_bindings = RECEIVABLES_COST_OUTPUTS.map((item) => item.id);
    if (invoiceCurrencyInputs.has(input.id)) {
      input.base_unit = "currency_unit/invoice";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = input.id === "material_cost" ? 0.000001 : 0;
        input.physical_hard_bounds.unit = "currency_unit/invoice";
      }
      input.name = input.id === "material_cost"
        ? "Invoice Principal"
        : input.id === "machine_rate"
          ? "Administration and Collection Cost per Invoice"
          : "Quoted Payment-Term Uplift per Invoice";
    }
    if (dayInputs.has(input.id)) {
      input.name = input.id === "cycle_time" ? "Standard Payment Term Days" : "Proposed Payment Term Days";
      input.type = "integer";
      input.base_unit = "day";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = 3650;
        input.physical_hard_bounds.unit = "day";
      }
    }
    if (input.id === "annual_volume") {
      input.name = "Annual Invoice Count";
      input.type = "integer";
      input.base_unit = "invoice/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.unit = "invoice/year";
      }
    }
    if (ratioInputs.has(input.id)) {
      input.base_unit = "ratio";
      input.quantity_kind = "dimensionless";
      input.unit_selectable = true;
      input.allowed_display_units = ["percent", "ratio"];
      input.name = input.id === "target_margin"
        ? "Annual Financing Rate"
        : input.id === "defect_or_loss_cost"
          ? "Incremental Credit-Loss Ratio"
          : input.name;
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = 1;
        input.physical_hard_bounds.unit = "ratio";
      }
    }
    if (input.id === "uncertainty_multiplier") {
      input.name = "Uncertainty Coverage Multiplier";
      input.base_unit = "ratio";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = 10;
        input.physical_hard_bounds.unit = "ratio";
      }
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "Receivables economics are contract and counterparty specific; verify against signed terms, treasury rate, aging, credit-loss, and collection evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => RECEIVABLES_COST_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (invoiceCurrencyInputs.has(input.from_input)) return { ...input, base_unit: "currency_unit/invoice" };
      if (dayInputs.has(input.from_input)) return { ...input, base_unit: "day" };
      if (input.from_input === "annual_volume") return { ...input, base_unit: "invoice/year" };
      if (ratioInputs.has(input.from_input) || input.from_input === "uncertainty_multiplier") return { ...input, base_unit: "ratio" };
      return input;
    });
  for (const group of schema.ui_contract?.input_groups ?? []) {
    group.fields = Array.isArray(group.fields) ? group.fields.filter((id) => RECEIVABLES_COST_INPUT_IDS.has(id)) : [];
  }
  const rules = (schema.validation_contract as { rules?: Array<{ affected_inputs?: string[] }> }).rules;
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      if (Array.isArray(rule.affected_inputs)) rule.affected_inputs = rule.affected_inputs.filter((id) => RECEIVABLES_COST_INPUT_IDS.has(id));
    }
  }
  schema.outputs = RECEIVABLES_COST_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = RECEIVABLES_COST_FORMULA_VERSION;
  schema.metadata.schema_version = RECEIVABLES_COST_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal ACT/365 simple-interest payment-term cost recovery",
    model_id: RECEIVABLES_COST_MODEL_ID,
    day_count_convention: "ACT_365_FIXED",
    term_extension_invariant: "PROPOSED_PAYMENT_DAYS_GTE_STANDARD_PAYMENT_DAYS",
    rate_policy: "EXPLICIT_ANNUAL_FINANCING_RATE_NO_DERIVED_OR_CLAMPED_DEFAULT",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_quoted_uplift_gap_to_required",
    secondary_metrics: ["out_required_addendum_per_invoice", "out_addendum_upper_bound_per_invoice", "out_annual_money_at_risk"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_required_addendum_per_invoice", "out_quoted_uplift_gap_to_required", "out_annual_money_at_risk", "out_decision_state"],
    money_at_risk_output_id: "out_annual_money_at_risk",
    main_cost_driver_output_id: "out_primary_addendum_driver",
    quote_or_decision_impact_output_id: "out_adjusted_invoice_amount",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "RECEIVABLES_ADDENDUM_CONFIDENCE_COVERAGE_V1",
    description: "Required addendum plus or minus required addendum multiplied by source-confidence shortfall and explicit coverage multiplier; the lower cost bound is floored at zero.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const MACHINE_OPTION_INPUT_IDS = new Set([
  "initial_investment", "annual_net_cash_flow", "discount_rate", "analysis_years",
  "residual_value", "stress_downside_factor", "annual_volume", "labor_rate",
  "overhead_rate", "defect_or_loss_cost", "source_confidence_ratio", "uncertainty_multiplier",
]);

const MACHINE_OPTION_OUTPUTS: ServerOutput[] = [
  output("out_annuity_present_value_factor", "Annuity Present-Value Factor", "year", "SECONDARY_METRIC", "Sum of year-end discount factors over the common analysis horizon."),
  output("out_residual_present_value_factor", "Final-Year Present-Value Factor", "ratio", "SECONDARY_METRIC", "Discount factor applied once to buy residual value in the final year."),
  output("out_buy_residual_present_value", "Buy Residual Present Value", "currency_unit", "BUSINESS_IMPACT", "Buy residual value discounted once from the final analysis year."),
  output("out_buy_present_cost", "Buy Present Cost", "currency_unit", "PRIMARY_DECISION", "Purchase and installation plus present value of annual buy O&M, less residual present value."),
  output("out_lease_present_cost", "Lease Present Cost", "currency_unit", "PRIMARY_DECISION", "Lease upfront cost plus present value of annual lease payment and service cost."),
  output("out_keep_present_cost", "Keep Present Cost", "currency_unit", "PRIMARY_DECISION", "Immediate refurbishment plus present value of annual keep maintenance and downtime cost."),
  output("out_stressed_buy_present_cost", "Stressed Buy Present Cost", "currency_unit", "RISK", "Buy present cost after explicit recurring-cost increase and residual-value reduction."),
  output("out_stressed_lease_present_cost", "Stressed Lease Present Cost", "currency_unit", "RISK", "Lease present cost after explicit recurring-cost increase."),
  output("out_stressed_keep_present_cost", "Stressed Keep Present Cost", "currency_unit", "RISK", "Keep present cost after explicit recurring-cost increase."),
  output("out_stressed_buy_equivalent_annual_cost", "Stressed Buy Equivalent Annual Cost", "currency_unit/year", "PRIMARY_DECISION", "Stressed buy present cost divided by the annuity present-value factor."),
  output("out_stressed_lease_equivalent_annual_cost", "Stressed Lease Equivalent Annual Cost", "currency_unit/year", "PRIMARY_DECISION", "Stressed lease present cost divided by the annuity present-value factor."),
  output("out_stressed_keep_equivalent_annual_cost", "Stressed Keep Equivalent Annual Cost", "currency_unit/year", "PRIMARY_DECISION", "Stressed keep present cost divided by the annuity present-value factor."),
  output("out_recommended_option", "Lowest Stressed Present-Cost Option", "0/1/2", "PRIMARY_DECISION", "0 = buy, 1 = lease, 2 = keep; deterministic ties retain the earlier option."),
  output("out_runner_up_option", "Runner-Up Stressed Present-Cost Option", "0/1/2", "SECONDARY_METRIC", "Second-lowest stressed present-cost option."),
  output("out_stressed_cost_advantage", "Stressed Cost Advantage over Runner-Up", "currency_unit", "PRIMARY_DECISION", "Runner-up stressed present cost less winning stressed present cost."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to purchase, lease, maintenance, and residual evidence."),
  output("out_winner_cost_uncertainty", "Winner Present-Cost Uncertainty", "currency_unit", "RISK", "Winning stressed present cost multiplied by confidence shortfall and explicit coverage multiplier."),
  output("out_runner_up_cost_uncertainty", "Runner-Up Present-Cost Uncertainty", "currency_unit", "RISK", "Runner-up stressed present cost multiplied by confidence shortfall and explicit coverage multiplier."),
  output("out_winner_cost_upper_bound", "Winner Cost Upper Bound", "currency_unit", "RISK", "Winning stressed present cost plus evidence uncertainty."),
  output("out_runner_up_cost_lower_bound", "Runner-Up Cost Lower Bound", "currency_unit", "RISK", "Non-negative runner-up stressed present cost less evidence uncertainty."),
  output("out_robust_cost_advantage_lower_bound", "Robust Cost Advantage Lower Bound", "currency_unit", "RISK", "Runner-up lower cost bound less winner upper cost bound."),
  output("out_selection_money_at_risk", "Selection Uncertainty Overlap", "currency_unit", "RISK", "Absolute negative robust advantage, or zero when the selected option remains cheaper across bounds."),
  output("out_decision_state", "Selection Evidence Decision State", "0/1", "STATUS", "0 = robustly separated option, 1 = winner and runner-up evidence intervals overlap."),
];

function applyMachineOptionContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => MACHINE_OPTION_INPUT_IDS.has(input.id));
  const annualCurrencyInputs = new Set(["annual_net_cash_flow", "labor_rate", "defect_or_loss_cost"]);
  const upfrontCurrencyInputs = new Set(["initial_investment", "residual_value", "annual_volume", "overhead_rate"]);
  const ratioInputs = new Set(["discount_rate", "stress_downside_factor", "source_confidence_ratio"]);
  const names: Record<string, string> = {
    initial_investment: "Buy Purchase and Installation Cost",
    annual_net_cash_flow: "Annual Buy Operating and Maintenance Cost",
    discount_rate: "Discount Rate",
    analysis_years: "Common Analysis Horizon",
    residual_value: "Buy Residual Value at Horizon End",
    stress_downside_factor: "Downside Annual Cost Increase Ratio",
    annual_volume: "Lease Upfront Cost",
    labor_rate: "Annual Lease Payment and Service Cost",
    overhead_rate: "Keep Refurbishment Cost Today",
    defect_or_loss_cost: "Annual Keep Maintenance and Downtime Cost",
  };
  for (const input of schema.inputs) {
    input.output_bindings = MACHINE_OPTION_OUTPUTS.map((item) => item.id);
    if (names[input.id]) input.name = names[input.id];
    if (annualCurrencyInputs.has(input.id)) {
      input.base_unit = "currency_unit/year";
      input.quantity_kind = "currency";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.unit = "currency_unit/year";
      }
    }
    if (upfrontCurrencyInputs.has(input.id)) {
      input.base_unit = "currency_unit";
      input.quantity_kind = "currency";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.unit = "currency_unit";
      }
    }
    if (input.id === "analysis_years") {
      input.type = "integer";
      input.base_unit = "year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.max = 50;
        input.physical_hard_bounds.unit = "year";
      }
    }
    if (ratioInputs.has(input.id)) {
      input.base_unit = "ratio";
      input.quantity_kind = "dimensionless";
      input.unit_selectable = true;
      input.allowed_display_units = input.id === "discount_rate" ? ["percent", "ratio"] : ["ratio", "percent"];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = 1;
        input.physical_hard_bounds.unit = "ratio";
      }
    }
    if (input.id === "uncertainty_multiplier") {
      input.name = "Uncertainty Coverage Multiplier";
      input.base_unit = "ratio";
      input.quantity_kind = "dimensionless";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = 10;
        input.physical_hard_bounds.unit = "ratio";
      }
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "Machine option economics are contract and asset specific; reconcile to vendor, lease, maintenance, downtime, residual, and treasury evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs.map((input) => {
    if (annualCurrencyInputs.has(input.from_input)) return { ...input, base_unit: "currency_unit/year" };
    if (upfrontCurrencyInputs.has(input.from_input)) return { ...input, base_unit: "currency_unit" };
    if (input.from_input === "analysis_years") return { ...input, base_unit: "year" };
    if (ratioInputs.has(input.from_input) || input.from_input === "uncertainty_multiplier") return { ...input, base_unit: "ratio" };
    return input;
  });
  schema.outputs = MACHINE_OPTION_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = MACHINE_OPTION_FORMULA_VERSION;
  schema.metadata.schema_version = MACHINE_OPTION_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal common-horizon buy, lease, and keep present-cost comparison",
    model_id: MACHINE_OPTION_MODEL_ID,
    cash_flow_timing: "UPFRONT_AT_T0_RECURRING_COSTS_AT_YEAR_END_RESIDUAL_ONCE_AT_FINAL_YEAR",
    stress_policy: "RECURRING_COSTS_TIMES_ONE_PLUS_STRESS_AND_BUY_RESIDUAL_TIMES_ONE_MINUS_STRESS",
    selection_policy: "LOWEST_STRESSED_PRESENT_COST_WITH_DETERMINISTIC_TIES",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_recommended_option",
    secondary_metrics: ["out_stressed_cost_advantage", "out_robust_cost_advantage_lower_bound", "out_selection_money_at_risk"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_recommended_option", "out_stressed_cost_advantage", "out_robust_cost_advantage_lower_bound", "out_decision_state"],
    money_at_risk_output_id: "out_selection_money_at_risk",
    main_cost_driver_output_id: "out_recommended_option",
    quote_or_decision_impact_output_id: "out_stressed_cost_advantage",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "MACHINE_OPTION_PRESENT_COST_CONFIDENCE_V1",
    description: "Winner and runner-up stressed present costs receive independent symmetric confidence allowances before robust separation is tested.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const CUSTOMER_SKU_INPUT_IDS = new Set([
  "unit_price", "unit_variable_cost", "annual_volume", "logistics_cost_pct",
  "service_cost_pct", "return_rate_pct", "target_margin", "labor_rate",
  "overhead_rate", "source_confidence",
]);

const CUSTOMER_SKU_OUTPUTS: ServerOutput[] = [
  output("out_variable_cost_per_unit", "Variable Cost per Unit", "currency_unit/unit", "EVIDENCE", "User-entered direct variable cost per unit."),
  output("out_logistics_cost_per_unit", "Customer Logistics Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Selling price multiplied by the customer logistics cost ratio."),
  output("out_service_cost_per_unit", "Customer Service Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Selling price multiplied by the customer service cost ratio."),
  output("out_return_credit_cost_per_unit", "Return and Credit Cost per Unit", "currency_unit/unit", "RISK", "Selling price multiplied by the return and credit cost ratio."),
  output("out_customer_support_cost_per_unit", "Allocated Customer Support Cost per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Annual customer support cost divided by annual customer-SKU volume."),
  output("out_collection_overhead_per_unit", "Allocated Collection and Commercial Overhead per Unit", "currency_unit/unit", "BUSINESS_IMPACT", "Annual collection and commercial overhead divided by annual customer-SKU volume."),
  output("out_fully_loaded_customer_sku_cost_per_unit", "Fully Loaded Customer-SKU Cost per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Variable, logistics, service, return, support, and collection costs per unit."),
  output("out_selling_price_per_unit", "Selling Price per Unit", "currency_unit/unit", "EVIDENCE", "Explicit user-entered selling price for this customer-SKU record."),
  output("out_net_contribution_per_unit", "Net Contribution per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Selling price less fully loaded customer-SKU cost per unit."),
  output("out_net_contribution_margin_ratio", "Net Contribution Margin", "ratio", "PRIMARY_DECISION", "Net contribution per unit divided by positive selling price."),
  output("out_target_gross_margin_ratio", "Target Gross Margin", "ratio", "EVIDENCE", "User-entered target gross margin ratio."),
  output("out_target_price_per_unit", "Target Price per Unit", "currency_unit/unit", "PRIMARY_DECISION", "Fully loaded customer-SKU cost divided by one minus target margin."),
  output("out_price_gap_to_target", "Price Gap to Target", "currency_unit/unit", "BUSINESS_IMPACT", "Current selling price less target price."),
  output("out_annual_revenue", "Annual Customer-SKU Revenue", "currency_unit/year", "BUSINESS_IMPACT", "Selling price multiplied by annual customer-SKU volume."),
  output("out_annual_fully_loaded_cost", "Annual Fully Loaded Customer-SKU Cost", "currency_unit/year", "BUSINESS_IMPACT", "Fully loaded unit cost multiplied by annual volume."),
  output("out_annual_net_contribution", "Annual Net Customer-SKU Contribution", "currency_unit/year", "PRIMARY_DECISION", "Annual revenue less annual fully loaded cost."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to customer and SKU evidence."),
  output("out_annual_profit_uncertainty", "Annual Contribution Uncertainty", "currency_unit/year", "RISK", "Annual fully loaded cost multiplied by source-confidence shortfall."),
  output("out_annual_profit_lower_bound", "Annual Contribution Lower Bound", "currency_unit/year", "RISK", "Annual net contribution less transparent evidence uncertainty."),
  output("out_annual_profit_upper_bound", "Annual Contribution Upper Bound", "currency_unit/year", "RISK", "Annual net contribution plus transparent evidence uncertainty."),
  output("out_money_at_risk", "Money at Risk", "currency_unit/year", "RISK", "Absolute negative annual contribution lower bound, or zero when non-negative."),
  output("out_primary_cost_driver", "Primary Customer-SKU Cost Driver", "0/1/2/3/4/5", "SECONDARY_METRIC", "0 = variable, 1 = logistics, 2 = service, 3 = return/credit, 4 = support, 5 = collection overhead."),
  output("out_decision_state", "Customer-SKU Profitability Decision State", "0/1/2", "STATUS", "0 = target margin and lower bound pass, 1 = review/reprice, 2 = upper-bound contribution remains negative."),
];

function applyCustomerSkuContract(schema: SuperV4Schema): SuperV4Schema {
  schema.inputs = schema.inputs.filter((input) => CUSTOMER_SKU_INPUT_IDS.has(input.id));
  const ratioInputs = new Set(["logistics_cost_pct", "service_cost_pct", "return_rate_pct", "target_margin", "source_confidence"]);
  for (const input of schema.inputs) {
    input.output_bindings = CUSTOMER_SKU_OUTPUTS.map((item) => item.id);
    if (input.id === "unit_price" || input.id === "unit_variable_cost") {
      input.base_unit = "currency_unit/unit";
      input.quantity_kind = "currency";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = input.id === "unit_price" ? 0.000001 : 0;
        input.physical_hard_bounds.unit = "currency_unit/unit";
      }
    }
    if (input.id === "annual_volume") {
      input.name = "Annual Customer-SKU Volume";
      input.type = "integer";
      input.base_unit = "count/year";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 1;
        input.physical_hard_bounds.unit = "count/year";
      }
    }
    if (ratioInputs.has(input.id)) {
      input.base_unit = "ratio";
      input.quantity_kind = "dimensionless";
      input.unit_selectable = true;
      input.allowed_display_units = ["percent", "ratio"];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.max = input.id === "target_margin" ? 0.999999 : 1;
        input.physical_hard_bounds.unit = "ratio";
      }
      if (input.id === "logistics_cost_pct") input.name = "Customer Logistics Cost Ratio of Revenue";
      if (input.id === "service_cost_pct") input.name = "Customer Service Cost Ratio of Revenue";
      if (input.id === "return_rate_pct") input.name = "Return and Credit Cost Ratio of Revenue";
    }
    if (input.id === "labor_rate" || input.id === "overhead_rate") {
      input.name = input.id === "labor_rate" ? "Annual Customer Support Cost" : "Annual Collection and Commercial Overhead";
      input.base_unit = "currency_unit/year";
      input.quantity_kind = "currency";
      input.unit_selectable = false;
      input.allowed_display_units = [];
      if (input.physical_hard_bounds) {
        input.physical_hard_bounds.min = 0;
        input.physical_hard_bounds.unit = "currency_unit/year";
      }
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) {
      referenceRange.unit = input.base_unit;
      referenceRange.warning_behavior = "NOT_APPLICABLE";
      referenceRange.not_applicable_reason = "Customer-SKU economics are account specific; reconcile to price, volume, logistics, returns, service, collections, and ledger evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => CUSTOMER_SKU_INPUT_IDS.has(input.from_input))
    .map((input) => {
      if (["unit_price", "unit_variable_cost"].includes(input.from_input)) return { ...input, base_unit: "currency_unit/unit" };
      if (input.from_input === "annual_volume") return { ...input, base_unit: "count/year" };
      if (ratioInputs.has(input.from_input)) return { ...input, base_unit: "ratio" };
      if (["labor_rate", "overhead_rate"].includes(input.from_input)) return { ...input, base_unit: "currency_unit/year" };
      return input;
    });
  schema.outputs = CUSTOMER_SKU_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = CUSTOMER_SKU_FORMULA_VERSION;
  schema.metadata.schema_version = CUSTOMER_SKU_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal single customer-SKU full-cost profitability forensics",
    model_id: CUSTOMER_SKU_MODEL_ID,
    scope: "ONE_CUSTOMER_SKU_RECORD_NO_CROSS_RECORD_RANKING",
    annualization_policy: "UNIT_ECONOMICS_TIMES_EXPLICIT_ANNUAL_COUNT_NO_RATE_MULTIPLIER",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_annual_net_contribution",
    secondary_metrics: ["out_net_contribution_margin_ratio", "out_target_price_per_unit", "out_annual_profit_lower_bound", "out_money_at_risk"],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: ["out_annual_net_contribution", "out_net_contribution_margin_ratio", "out_annual_profit_lower_bound", "out_decision_state"],
    money_at_risk_output_id: "out_money_at_risk",
    main_cost_driver_output_id: "out_primary_cost_driver",
    quote_or_decision_impact_output_id: "out_target_price_per_unit",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "CUSTOMER_SKU_COST_CONFIDENCE_ALLOWANCE_V1",
    description: "Annual net contribution plus or minus annual fully loaded customer-SKU cost multiplied by source-confidence shortfall.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

const ENERGY_INCENTIVE_OUTPUTS: ServerOutput[] = [
  output("out_annual_energy_saving_kwh", "Verified Annual Energy Saving", "kWh/year", "PRIMARY_DECISION", "Current annual energy less target annual energy."),
  output("out_energy_reduction_ratio", "Annual Energy Reduction Ratio", "ratio", "SECONDARY_METRIC", "Annual energy saving divided by positive current annual energy."),
  output("out_annual_energy_cost_saving", "Annual Energy Cost Saving", "currency_unit/year", "BUSINESS_IMPACT", "Annual energy saving multiplied by the entered energy rate."),
  output("out_annual_maintenance_saving", "Annual Maintenance Saving", "currency_unit/year", "EVIDENCE", "Explicit user-entered annual maintenance cash saving."),
  output("out_annual_total_cash_saving", "Annual Total Cash Saving", "currency_unit/year", "PRIMARY_DECISION", "Annual energy cost saving plus annual maintenance saving."),
  output("out_grant_amount", "Grant Amount", "currency_unit", "BUSINESS_IMPACT", "Implementation cost multiplied by the entered grant coverage ratio."),
  output("out_net_investment_cost", "Grant-Adjusted Net Investment Cost", "currency_unit", "PRIMARY_DECISION", "Implementation cost less grant amount."),
  output("out_annuity_present_value_factor", "Savings Annuity Present-Value Factor", "year", "SECONDARY_METRIC", "Sum of year-end discount factors over equipment life."),
  output("out_discounted_lifetime_savings", "Discounted Lifetime Cash Savings", "currency_unit", "PRIMARY_DECISION", "Annual total cash saving multiplied by the annuity present-value factor."),
  output("out_grant_adjusted_net_present_value", "Grant-Adjusted Net Present Value", "currency_unit", "PRIMARY_DECISION", "Discounted lifetime cash savings less grant-adjusted net investment cost."),
  output("out_gross_investment_benefit_cost_ratio", "Gross-Investment Benefit-Cost Ratio", "ratio", "SECONDARY_METRIC", "Discounted cash savings plus grant amount divided by positive gross implementation cost."),
  output("out_gross_investment_discounted_roi_ratio", "Gross-Investment Discounted ROI", "ratio", "SECONDARY_METRIC", "Grant-adjusted NPV divided by positive gross implementation cost."),
  output("out_simple_payback_years", "Grant-Adjusted Simple Payback", "year", "SECONDARY_METRIC", "Grant-adjusted net investment cost divided by positive annual total cash saving."),
  output("out_annual_co2e_reduction_tonnes", "Annual CO2e Reduction", "tCO2e/year", "BUSINESS_IMPACT", "Annual energy saving multiplied by the entered emission factor and divided by 1000."),
  output("out_lifetime_energy_saving_kwh", "Undiscounted Lifetime Energy Saving", "kWh", "BUSINESS_IMPACT", "Annual physical energy saving multiplied by equipment life."),
  output("out_lifetime_co2e_reduction_tonnes", "Undiscounted Lifetime CO2e Reduction", "tCO2e", "BUSINESS_IMPACT", "Annual physical CO2e reduction multiplied by equipment life."),
  output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to energy, tariff, grant, and cost evidence."),
  output("out_npv_uncertainty", "NPV Uncertainty", "currency_unit", "RISK", "Discounted lifetime savings multiplied by source-confidence shortfall."),
  output("out_npv_lower_bound", "Grant-Adjusted NPV Lower Bound", "currency_unit", "RISK", "Grant-adjusted NPV less evidence uncertainty."),
  output("out_npv_upper_bound", "Grant-Adjusted NPV Upper Bound", "currency_unit", "RISK", "Grant-adjusted NPV plus evidence uncertainty."),
  output("out_money_at_risk", "Money at Risk", "currency_unit", "RISK", "Absolute negative NPV lower bound, or zero when non-negative."),
  output("out_primary_benefit_driver", "Primary Benefit Driver", "0/1/2", "SECONDARY_METRIC", "0 = discounted energy saving, 1 = discounted maintenance saving, 2 = grant amount."),
  output("out_decision_state", "Energy Investment Decision State", "0/1/2", "STATUS", "0 = NPV lower bound non-negative, 1 = NPV interval crosses zero, 2 = NPV upper bound negative."),
];

function applyEnergyIncentiveContract(schema: SuperV4Schema): SuperV4Schema {
  const ratioInputs = new Set(["grant_coverage_pct", "discount_rate", "source_confidence"]);
  for (const input of schema.inputs) {
    input.output_bindings = ENERGY_INCENTIVE_OUTPUTS.map((item) => item.id);
    if (["current_kwh_per_year", "target_kwh_per_year"].includes(input.id)) {
      input.base_unit = "kWh/year"; input.unit_selectable = false; input.allowed_display_units = [];
      if (input.physical_hard_bounds) { input.physical_hard_bounds.min = input.id === "current_kwh_per_year" ? 0.000001 : 0; input.physical_hard_bounds.unit = "kWh/year"; }
    }
    if (input.id === "avg_kwh_rate") {
      input.base_unit = "currency_unit_per_kWh"; input.unit_selectable = false; input.allowed_display_units = [];
      if (input.physical_hard_bounds) { input.physical_hard_bounds.min = 0; input.physical_hard_bounds.unit = "currency_unit_per_kWh"; }
    }
    if (input.id === "implementation_cost") {
      input.base_unit = "currency_unit"; input.unit_selectable = false; input.allowed_display_units = [];
      if (input.physical_hard_bounds) input.physical_hard_bounds.min = 0.000001;
    }
    if (input.id === "maintenance_saving") {
      input.name = "Annual Maintenance Cash Saving"; input.base_unit = "currency_unit/year"; input.unit_selectable = false; input.allowed_display_units = [];
      if (input.physical_hard_bounds) { input.physical_hard_bounds.min = 0; input.physical_hard_bounds.unit = "currency_unit/year"; }
    }
    if (input.id === "emission_factor") {
      input.name = "Emission Factor"; input.base_unit = "kgCO2e/kWh"; input.unit_selectable = false; input.allowed_display_units = [];
      if (input.physical_hard_bounds) { input.physical_hard_bounds.min = 0; input.physical_hard_bounds.unit = "kgCO2e/kWh"; }
    }
    if (input.id === "equipment_life_years") {
      input.type = "integer"; input.base_unit = "year"; input.unit_selectable = false; input.allowed_display_units = [];
      if (input.physical_hard_bounds) { input.physical_hard_bounds.min = 1; input.physical_hard_bounds.max = 50; input.physical_hard_bounds.unit = "year"; }
    }
    if (ratioInputs.has(input.id)) {
      input.base_unit = "ratio"; input.quantity_kind = "dimensionless"; input.unit_selectable = true;
      input.allowed_display_units = input.id === "source_confidence" ? ["ratio", "percent"] : ["percent", "ratio"];
      if (input.physical_hard_bounds) { input.physical_hard_bounds.min = 0; input.physical_hard_bounds.max = 1; input.physical_hard_bounds.unit = "ratio"; }
      if (input.id === "grant_coverage_pct") input.name = "Grant Coverage Ratio";
    }
    const referenceRange = input.engineering_reference_range ?? input.engineering_range;
    if (referenceRange && input.base_unit) { referenceRange.unit = input.base_unit; referenceRange.warning_behavior = "NOT_APPLICABLE"; referenceRange.not_applicable_reason = "Energy projects are site and program specific; verify against metering, tariff, vendor, grant, maintenance, and emission-factor evidence."; }
  }
  schema.normalized_inputs = schema.normalized_inputs.map((input) => {
    if (["current_kwh_per_year", "target_kwh_per_year"].includes(input.from_input)) return { ...input, base_unit: "kWh/year" };
    if (input.from_input === "maintenance_saving") return { ...input, base_unit: "currency_unit/year" };
    if (input.from_input === "emission_factor") return { ...input, base_unit: "kgCO2e/kWh" };
    if (input.from_input === "equipment_life_years") return { ...input, base_unit: "year" };
    return input;
  });
  schema.outputs = ENERGY_INCENTIVE_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = ENERGY_INCENTIVE_FORMULA_VERSION; schema.metadata.schema_version = ENERGY_INCENTIVE_SCHEMA_VERSION;
  schema.calculation_basis = { ...schema.calculation_basis, method: "Exact Decimal grant-adjusted discounted energy and maintenance savings", model_id: ENERGY_INCENTIVE_MODEL_ID,
    cash_flow_timing: "IMPLEMENTATION_AND_GRANT_AT_T0_SAVINGS_AT_EACH_YEAR_END", physical_savings_policy: "ENERGY_AND_CO2E_ARE_UNDISCOUNTED_PHYSICAL_TOTALS", roi_denominator: "POSITIVE_GROSS_IMPLEMENTATION_COST_NO_SENTINEL" };
  schema.decision_context = { ...schema.decision_context, primary_metric: "out_grant_adjusted_net_present_value", secondary_metrics: ["out_simple_payback_years", "out_gross_investment_benefit_cost_ratio", "out_npv_lower_bound", "out_annual_co2e_reduction_tonnes"] };
  schema.business_impact_contract = { ...schema.business_impact_contract, required_outputs: ["out_grant_adjusted_net_present_value", "out_npv_lower_bound", "out_money_at_risk", "out_decision_state"], money_at_risk_output_id: "out_money_at_risk", main_cost_driver_output_id: "out_primary_benefit_driver", quote_or_decision_impact_output_id: "out_net_investment_cost" };
  schema.uncertainty_model = { method: "ANALYTICAL", model_id: "ENERGY_DISCOUNTED_SAVINGS_CONFIDENCE_V1", description: "Grant-adjusted NPV plus or minus discounted lifetime cash savings multiplied by source-confidence shortfall." };
  schema.derating_contract = { rules: [] };
  return schema;
}

const FX_COMMODITY_OUTPUTS: ServerOutput[] = [
  output("out_fx_market_factor", "FX Market Factor", "ratio", "EVIDENCE", "Current FX rate divided by positive budget FX rate."), output("out_commodity_market_factor", "Commodity Market Factor", "ratio", "EVIDENCE", "Current commodity index divided by positive budget index."),
  output("out_hedge_adjusted_fx_factor", "Hedge-Adjusted FX Factor", "ratio", "PRIMARY_DECISION", "One plus FX factor change multiplied by the unhedged FX share."), output("out_hedge_adjusted_commodity_factor", "Hedge-Adjusted Commodity Factor", "ratio", "PRIMARY_DECISION", "One plus commodity factor change multiplied by the unhedged commodity share."),
  output("out_combined_material_factor", "Combined Material Escalation Factor", "ratio", "PRIMARY_DECISION", "Multiplicative hedge-adjusted FX and commodity factors."), output("out_non_material_price_component", "Non-Material Base Price Component", "currency_unit/unit", "BUSINESS_IMPACT", "Base price multiplied by one minus material cost share; this component is not escalated."),
  output("out_material_price_component", "Material Base Price Component", "currency_unit/unit", "BUSINESS_IMPACT", "Base price multiplied by material cost share."), output("out_fx_price_impact", "FX Price Impact", "currency_unit/unit", "PRIMARY_DECISION", "Material price component multiplied by hedge-adjusted FX factor change."),
  output("out_commodity_interaction_price_impact", "Commodity and Interaction Price Impact", "currency_unit/unit", "PRIMARY_DECISION", "Commodity factor effect after the hedge-adjusted FX factor, including multiplicative interaction."), output("out_total_price_adjustment", "Total Price Adjustment", "currency_unit/unit", "PRIMARY_DECISION", "FX price impact plus commodity and interaction impact."),
  output("out_pass_through_ratio", "Required Pass-Through Ratio", "ratio", "PRIMARY_DECISION", "Total price adjustment divided by positive base price."), output("out_adjusted_price", "Hedge-Adjusted Price", "currency_unit/unit", "PRIMARY_DECISION", "Base price plus total price adjustment."),
  output("out_annual_base_revenue", "Annual Base Revenue", "currency_unit/year", "BUSINESS_IMPACT", "Base price multiplied by annual unit volume."), output("out_annual_adjusted_revenue", "Annual Adjusted Revenue", "currency_unit/year", "BUSINESS_IMPACT", "Adjusted price multiplied by annual unit volume."),
  output("out_annual_price_adjustment", "Annual Price Adjustment", "currency_unit/year", "BUSINESS_IMPACT", "Per-unit price adjustment multiplied by annual unit volume."), output("out_source_confidence_ratio", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to market, hedge, share, and volume evidence."),
  output("out_price_adjustment_uncertainty", "Price Adjustment Uncertainty", "currency_unit/unit", "RISK", "Absolute price adjustment multiplied by source-confidence shortfall."), output("out_adjusted_price_lower_bound", "Adjusted Price Lower Bound", "currency_unit/unit", "RISK", "Non-negative adjusted price less evidence uncertainty."),
  output("out_adjusted_price_upper_bound", "Adjusted Price Upper Bound", "currency_unit/unit", "RISK", "Adjusted price plus evidence uncertainty."), output("out_annual_money_at_risk", "Annual Pass-Through Uncertainty", "currency_unit/year", "RISK", "Per-unit price uncertainty multiplied by annual unit volume."),
  output("out_primary_market_driver", "Primary Market Driver", "0/1", "SECONDARY_METRIC", "0 = FX, 1 = commodity plus interaction; deterministic ties retain FX."), output("out_adjustment_direction", "Price Adjustment Direction", "-1/0/1", "STATUS", "-1 = decrease, 0 = unchanged, 1 = increase."),
  output("out_decision_state", "Pass-Through Evidence Decision State", "0/1", "STATUS", "0 = adjustment direction is robust or unchanged, 1 = evidence bounds cross the base price."),
];
function applyFxCommodityContract(schema: SuperV4Schema): SuperV4Schema {
  const ratios=new Set(["material_cost_pct","fx_hedge_pct","commodity_hedge_pct","source_confidence"]); const positiveFactors=new Set(["fx_rate_spot","fx_rate_budget","commodity_index_current","commodity_index_budget"]);
  for(const input of schema.inputs){input.output_bindings=FX_COMMODITY_OUTPUTS.map(i=>i.id);
    if(input.id==="base_price"){input.base_unit="currency_unit/unit";input.unit_selectable=false;input.allowed_display_units=[];if(input.physical_hard_bounds){input.physical_hard_bounds.min=0.000001;input.physical_hard_bounds.unit="currency_unit/unit";}}
    if(positiveFactors.has(input.id)){input.base_unit=input.id.startsWith("fx_")?"fx_quote_per_base":"index_point";input.unit_selectable=false;input.allowed_display_units=[];if(input.physical_hard_bounds){input.physical_hard_bounds.min=0.000001;input.physical_hard_bounds.unit=input.base_unit;}}
    if(ratios.has(input.id)){input.base_unit="ratio";input.quantity_kind="dimensionless";input.unit_selectable=true;input.allowed_display_units=input.id==="source_confidence"?["ratio","percent"]:["percent","ratio"];if(input.physical_hard_bounds){input.physical_hard_bounds.min=0;input.physical_hard_bounds.max=1;input.physical_hard_bounds.unit="ratio";}}
    if(input.id==="annual_volume"){input.type="integer";input.base_unit="count/year";input.unit_selectable=false;input.allowed_display_units=[];if(input.physical_hard_bounds){input.physical_hard_bounds.min=1;input.physical_hard_bounds.unit="count/year";}}
    const rr=input.engineering_reference_range??input.engineering_range;if(rr&&input.base_unit){rr.unit=input.base_unit;rr.warning_behavior="NOT_APPLICABLE";rr.not_applicable_reason="Pass-through terms are contract and market specific; verify against signed price clauses, treasury rates, hedge records, index publications, BOM share, and volume evidence.";}}
  schema.normalized_inputs=schema.normalized_inputs.map(i=>{if(i.from_input==="base_price")return{...i,base_unit:"currency_unit/unit"};if(positiveFactors.has(i.from_input))return{...i,base_unit:i.from_input.startsWith("fx_")?"fx_quote_per_base":"index_point"};if(ratios.has(i.from_input))return{...i,base_unit:"ratio"};if(i.from_input==="annual_volume")return{...i,base_unit:"count/year"};return i;});
  schema.outputs=FX_COMMODITY_OUTPUTS.map(i=>({...i}));schema.metadata.formula_version=FX_COMMODITY_FORMULA_VERSION;schema.metadata.schema_version=FX_COMMODITY_SCHEMA_VERSION;
  schema.calculation_basis={...schema.calculation_basis,method:"Exact Decimal hedge-adjusted multiplicative FX and commodity pass-through",model_id:FX_COMMODITY_MODEL_ID,material_factor_policy:"HEDGE_ADJUSTED_FX_FACTOR_TIMES_HEDGE_ADJUSTED_COMMODITY_FACTOR",interaction_allocation:"ASSIGNED_TO_COMMODITY_IMPACT_AFTER_FX",annualization_policy:"PER_UNIT_ADJUSTMENT_TIMES_EXPLICIT_ANNUAL_COUNT"};
  schema.decision_context={...schema.decision_context,primary_metric:"out_total_price_adjustment",secondary_metrics:["out_pass_through_ratio","out_adjusted_price_lower_bound","out_adjusted_price_upper_bound","out_annual_money_at_risk"]};
  schema.business_impact_contract={...schema.business_impact_contract,required_outputs:["out_adjusted_price","out_annual_price_adjustment","out_adjusted_price_lower_bound","out_decision_state"],money_at_risk_output_id:"out_annual_money_at_risk",main_cost_driver_output_id:"out_primary_market_driver",quote_or_decision_impact_output_id:"out_adjusted_price"};
  schema.uncertainty_model={method:"ANALYTICAL",model_id:"FX_COMMODITY_ADJUSTMENT_CONFIDENCE_V1",description:"Adjusted price plus or minus absolute per-unit pass-through multiplied by source-confidence shortfall."};schema.derating_contract={rules:[]};return schema;
}

const WELD_COST_OUTPUTS: ServerOutput[] = [
  output("out_cross_section_area_mm2", "Equivalent Weld Cross-Section", "mm2", "SECONDARY_METRIC", "For one equivalent equal-leg fillet, effective throat a gives deposited cross-section a squared."),
  output("out_deposited_weld_metal_mass_kg", "Deposited Weld Metal Mass", "kg", "PRIMARY_DECISION", "Weld length multiplied by equivalent cross-section and weld-metal density with exact dimensional conversion."),
  output("out_wire_mass_kg", "Required Wire or Electrode Mass", "kg", "PRIMARY_DECISION", "Deposited weld-metal mass divided by the positive deposition-efficiency ratio."),
  output("out_wire_cost", "Wire or Electrode Cost", "currency_unit", "BUSINESS_IMPACT", "Required wire or electrode mass multiplied by verified cost per kilogram."),
  output("out_shielding_gas_cost", "Shielding Gas Cost", "currency_unit", "BUSINESS_IMPACT", "Shielding-gas cost per minute multiplied by arc-on minutes."),
  output("out_labor_cost", "Labor Cost", "currency_unit", "BUSINESS_IMPACT", "Labor cost per hour multiplied by elapsed weld-operation hours."),
  output("out_shop_overhead", "Shop Overhead", "currency_unit", "BUSINESS_IMPACT", "Shop overhead per hour multiplied by elapsed weld-operation hours."),
  output("out_base_production_cost", "Base Production Cost", "currency_unit", "BUSINESS_IMPACT", "Wire, shielding-gas, and labor cost before shop overhead."),
  output("out_total_estimated_cost", "Total Estimated Weld Cost", "currency_unit", "PRIMARY_DECISION", "Exact sum of wire, shielding-gas, labor, and shop-overhead cost components."),
  output("out_cost_per_meter", "Estimated Cost per Meter", "currency_unit/m", "PRIMARY_DECISION", "Total estimated weld cost divided by positive weld length."),
  output("out_arc_time_ratio", "Arc-Time Ratio", "ratio", "SECONDARY_METRIC", "Arc-on minutes divided by elapsed weld-operation minutes; values above one are blocked."),
  output("out_consumable_efficiency", "Deposition Efficiency", "ratio", "EVIDENCE", "User-verified deposited-metal to consumed-wire mass ratio."),
  output("out_evidence_completeness", "Source Confidence", "ratio", "EVIDENCE", "User-entered confidence attached to geometry, density, time, efficiency, and cost evidence."),
  output("out_expanded_uncertainty", "Cost Evidence Allowance", "currency_unit", "RISK", "Total estimated cost multiplied by the source-confidence shortfall."),
  output("out_total_cost_floor", "Total Cost Lower Bound", "currency_unit", "RISK", "Total estimated cost less the analytical evidence allowance."),
  output("out_total_cost_ceiling", "Total Cost Upper Bound", "currency_unit", "RISK", "Total estimated cost plus the analytical evidence allowance."),
  output("out_cost_per_meter_lower_bound", "Cost per Meter Lower Bound", "currency_unit/m", "RISK", "Total cost lower bound divided by positive weld length."),
  output("out_cost_per_meter_upper_bound", "Cost per Meter Upper Bound", "currency_unit/m", "RISK", "Total cost upper bound divided by positive weld length."),
  output("out_sensitivity_driver", "Primary Cost Driver", "0/1/2/3", "SECONDARY_METRIC", "0 = wire, 1 = shielding gas, 2 = labor, 3 = overhead; deterministic ties retain the lower code."),
  output("out_decision_state", "Estimate Evidence State", "0/1", "STATUS", "0 = positive evidence-adjusted cost floor, 1 = the evidence interval reaches zero and requires review."),
];

function applyWeldCostContract(schema: SuperV4Schema): SuperV4Schema {
  const units: Record<string, string> = {
    weld_length_m: "m",
    weld_throat_mm: "mm",
    weld_density: "g_per_cm3",
    wire_cost_per_kg: "currency_unit_per_kg",
    gas_cost_per_min: "currency_unit_per_min",
    arc_time_min: "min",
    weld_time_min: "min",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_h",
    deposition_efficiency: "ratio",
    source_confidence: "ratio",
  };
  const strictlyPositive = new Set([
    "weld_length_m",
    "weld_throat_mm",
    "weld_density",
    "arc_time_min",
    "weld_time_min",
    "deposition_efficiency",
  ]);
  const ratios = new Set(["deposition_efficiency", "source_confidence"]);
  for (const input of schema.inputs) {
    input.output_bindings = WELD_COST_OUTPUTS.map((item) => item.id);
    input.base_unit = units[input.id] ?? input.base_unit;
    input.unit_selectable = ratios.has(input.id);
    input.allowed_display_units = ratios.has(input.id) ? ["percent", "ratio"] : [];
    if (ratios.has(input.id)) input.quantity_kind = "dimensionless";
    if (input.physical_hard_bounds) {
      input.physical_hard_bounds.unit = input.base_unit;
      if (strictlyPositive.has(input.id)) input.physical_hard_bounds.min = 0.000001;
      if (ratios.has(input.id)) input.physical_hard_bounds.max = 1;
    }
    const range = input.engineering_reference_range ?? input.engineering_range;
    if (range) {
      range.unit = input.base_unit;
      range.warning_behavior = "NOT_APPLICABLE";
      range.not_applicable_reason = "Weld geometry, process efficiency, time, density, and cost rates are procedure- and facility-specific; verify against the WPS, consumable certificate, time study, supplier invoice, and approved shop-rate evidence.";
    }
  }
  schema.normalized_inputs = schema.normalized_inputs.map((input) => ({
    ...input,
    base_unit: units[input.from_input] ?? input.base_unit,
  }));
  schema.outputs = WELD_COST_OUTPUTS.map((item) => ({ ...item }));
  schema.metadata.formula_version = WELD_COST_FORMULA_VERSION;
  schema.metadata.schema_version = WELD_COST_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Exact Decimal equivalent equal-leg single-fillet mass and component cost balance",
    model_id: WELD_COST_MODEL_ID,
    geometry_policy: "ONE_EQUIVALENT_EQUAL_LEG_FILLET_EFFECTIVE_THROAT_AREA_EQUALS_A_SQUARED",
    density_conversion: "ONE_G_PER_CM3_EQUALS_ONE_THOUSAND_KG_PER_M3",
    time_policy: "ARC_MINUTES_NOT_GREATER_THAN_ELAPSED_OPERATION_MINUTES",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_total_estimated_cost",
    secondary_metrics: [
      "out_wire_mass_kg",
      "out_cost_per_meter",
      "out_total_cost_floor",
      "out_total_cost_ceiling",
    ],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: [
      "out_total_estimated_cost",
      "out_cost_per_meter",
      "out_total_cost_floor",
      "out_total_cost_ceiling",
      "out_decision_state",
    ],
    money_at_risk_output_id: "out_expanded_uncertainty",
    main_cost_driver_output_id: "out_sensitivity_driver",
    quote_or_decision_impact_output_id: "out_total_estimated_cost",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "WELD_COST_CONFIDENCE_ALLOWANCE_V1",
    description: "Total estimated cost plus or minus total cost multiplied by the source-confidence shortfall.",
  };
  schema.derating_contract = { rules: [] };
  return schema;
}

function configureInput(input: SuperV4Input): void {
  input.output_bindings = INVESTMENT_OUTPUTS.map((item) => item.id);

  if (input.id === "analysis_years") {
    input.type = "integer";
    input.unit_selectable = false;
    input.base_unit = "year";
    input.allowed_display_units = ["year"];
    if (input.physical_hard_bounds) input.physical_hard_bounds.min = 1;
  }

  if (input.id === "initial_investment" && input.physical_hard_bounds) {
    input.physical_hard_bounds.min = 0.01;
  }
}

/**
 * Applies reviewed tool-specific calculation contracts after legacy schema
 * normalization while generated schema packages are migrated in stages.
 */
export function applyProCalculationContractOverrides(
  schema: SuperV4Schema,
): SuperV4Schema {
  if (schema.tool_key === DOWNTIME_LOSS_TOOL_KEY) {
    return applyDowntimeLossContract(schema);
  }
  if (schema.tool_key === QUALITY_LOSS_TOOL_KEY) {
    return applyQualityLossContract(schema);
  }
  if (schema.tool_key === OEE_LOSS_TOOL_KEY) {
    return applyOeeLossContract(schema);
  }
  if (schema.tool_key === MACHINE_HOURLY_RATE_TOOL_KEY) {
    return applyMachineHourlyRateContract(schema);
  }
  if (schema.tool_key === MOTOR_REPLACEMENT_TOOL_KEY) {
    return applyMotorReplacementContract(schema);
  }
  if (schema.tool_key === MAKE_BUY_TOOL_KEY) {
    return applyMakeBuyContract(schema);
  }
  if (schema.tool_key === PLANT_SHOP_RATE_TOOL_KEY) {
    return applyPlantShopRateContract(schema);
  }
  if (schema.tool_key === SMED_ROI_TOOL_KEY) {
    return applySmedRoiContract(schema);
  }
  if (schema.tool_key === EMPLOYEE_COST_TOOL_KEY) {
    return applyEmployeeCostContract(schema);
  }
  if (schema.tool_key === JOB_QUOTE_TOOL_KEY) {
    return applyJobQuoteContract(schema);
  }
  if (schema.tool_key === SKU_MARGIN_TOOL_KEY) {
    return applySkuMarginContract(schema);
  }
  if (schema.tool_key === LOSS_MAKING_JOB_TOOL_KEY) {
    return applyLossMakingJobContract(schema);
  }
  if (schema.tool_key === CASH_SURVIVAL_TOOL_KEY) {
    return applyCashSurvivalContract(schema);
  }
  if (schema.tool_key === RECEIVABLES_COST_TOOL_KEY) {
    return applyReceivablesCostContract(schema);
  }
  if (schema.tool_key === MACHINE_OPTION_TOOL_KEY) {
    return applyMachineOptionContract(schema);
  }
  if (schema.tool_key === CUSTOMER_SKU_TOOL_KEY) {
    return applyCustomerSkuContract(schema);
  }
  if (schema.tool_key === ENERGY_INCENTIVE_TOOL_KEY) {
    return applyEnergyIncentiveContract(schema);
  }
  if (schema.tool_key === FX_COMMODITY_TOOL_KEY) return applyFxCommodityContract(schema);
  if (schema.tool_key === WELD_COST_TOOL_KEY) return applyWeldCostContract(schema);
  if (schema.tool_key !== INVESTMENT_TOOL_KEY) return schema;

  schema.inputs = schema.inputs.filter((input) => INVESTMENT_INPUT_IDS.has(input.id));
  schema.inputs.forEach(configureInput);
  schema.normalized_inputs = schema.normalized_inputs
    .filter((input) => INVESTMENT_INPUT_IDS.has(input.from_input))
    .map((input) => input.from_input === "analysis_years"
      ? { ...input, base_unit: "year" }
      : input);
  schema.outputs = INVESTMENT_OUTPUTS.map((item) => ({ ...item }));

  const groups = schema.ui_contract?.input_groups ?? [];
  for (const group of groups) {
    group.fields = Array.isArray(group.fields)
      ? group.fields.filter((id) => INVESTMENT_INPUT_IDS.has(id))
      : [];
  }

  const validationRules = (
    schema.validation_contract as {
      rules?: Array<{ affected_inputs?: string[] }>;
    }
  ).rules;
  if (Array.isArray(validationRules)) {
    for (const rule of validationRules) {
      if (Array.isArray(rule.affected_inputs)) {
        rule.affected_inputs = rule.affected_inputs.filter((id) =>
          INVESTMENT_INPUT_IDS.has(id),
        );
      }
    }
  }

  schema.metadata.formula_version = INVESTMENT_APPRAISAL_FORMULA_VERSION;
  schema.metadata.schema_version = INVESTMENT_APPRAISAL_SCHEMA_VERSION;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    method: "Discrete end-of-period discounted cash-flow appraisal",
    model_id: INVESTMENT_APPRAISAL_MODEL_ID,
    cash_flow_timing: "ANNUAL_END_OF_PERIOD",
    residual_value_timing: "FINAL_PERIOD_ONLY_ONCE",
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: "out_net_present_value",
    secondary_metrics: [
      "out_internal_rate_of_return_percent",
      "out_simple_payback_years",
      "out_profitability_index",
      "out_stressed_net_present_value",
    ],
  };
  schema.business_impact_contract = {
    ...schema.business_impact_contract,
    required_outputs: [
      "out_net_present_value",
      "out_stressed_net_present_value",
      "out_decision_state",
    ],
    money_at_risk_output_id: "out_npv_lower_bound",
    main_cost_driver_output_id: "out_break_even_annual_cash_flow",
    quote_or_decision_impact_output_id: "out_decision_state",
  };
  schema.uncertainty_model = {
    method: "ANALYTICAL",
    model_id: "NPV_CONFIDENCE_ALLOWANCE_V1",
    description: "NPV plus or minus absolute NPV multiplied by confidence shortfall and the user-entered coverage multiplier.",
  };
  // Downside stress is an explicit Decimal model input. Legacy generic
  // derating rules would duplicate that adjustment and are not part of V2.
  schema.derating_contract = { rules: [] };

  return schema;
}
