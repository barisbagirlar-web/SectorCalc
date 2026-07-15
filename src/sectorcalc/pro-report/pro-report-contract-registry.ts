// SectorCalc PRO V2 — Report Contract Registry
// Maps every LIVE PRO tool slug to its ProReportContract.
// Each contract defines tool-specific business-labeled sections and entries.

import type {
  ProReportContract,
  ReportSection,
  ReportOutputEntry,
} from "./pro-report-types";

// ---- Helper builders ----

function primarySection(
  heading: string,
  entries: ReportOutputEntry[]
): ReportSection {
  return { sectionTitle: heading, priority: 0, entries };
}

function section(
  title: string,
  priority: number,
  entries: ReportOutputEntry[]
): ReportSection {
  return { sectionTitle: title, priority, entries };
}

function entry(
  sourceOutputId: string,
  businessLabel: string,
  format?: string,
  unit?: string,
  explanation?: string
): ReportOutputEntry {
  return {
    sourceOutputId,
    businessLabel,
    format: format as any,
    unit,
    explanation,
  };
}

// ---- Registry ----

export const proReportContractRegistry: Record<string, ProReportContract> = {};

function register(contract: ProReportContract): void {
  proReportContractRegistry[contract.toolSlug] = contract;
}

// ---------------------------------------------------------------------------
// 1. break-even-survival-cash-calculator
// ---------------------------------------------------------------------------
register({
  toolSlug: "break-even-survival-cash-calculator",
  sections: [
    {
      sectionTitle: "Break-Even Position",
      priority: 10,
      entries: [
        {
          sourceOutputId: "out_break_even_monthly_revenue",
          businessLabel: "Break-Even Monthly Revenue",
          format: "currency",
          unit: "currency/month",
          explanation: "Monthly revenue required to cover fixed cash costs and debt service at the entered contribution margin.",
        },
        {
          sourceOutputId: "out_current_revenue_gap",
          businessLabel: "Current Revenue Gap vs Break-Even",
          format: "currency",
          unit: "currency/month",
          explanation: "Positive values are headroom; negative values are the monthly revenue shortfall.",
        },
        {
          sourceOutputId: "out_margin_of_safety_ratio",
          businessLabel: "Revenue Margin of Safety",
          format: "percentage",
          unit: "%",
          valueMultiplier: 100,
          explanation: "Current revenue headroom relative to current monthly revenue.",
        },
      ],
    },
    {
      sectionTitle: "Survival Cash Stress",
      priority: 20,
      entries: [
        { sourceOutputId: "out_stressed_monthly_revenue", businessLabel: "Stressed Monthly Revenue", format: "currency", unit: "currency/month" },
        { sourceOutputId: "out_monthly_cash_burn", businessLabel: "Monthly Cash Burn Under Stress", format: "currency", unit: "currency/month" },
        { sourceOutputId: "out_cash_runway_months", businessLabel: "Cash Runway Under Stress", format: "number", unit: "months" },
        { sourceOutputId: "out_survival_cash_target", businessLabel: "Survival Cash Target", format: "currency", unit: "currency" },
        { sourceOutputId: "out_funding_gap", businessLabel: "Funding Gap to Target", format: "currency", unit: "currency" },
      ],
    },
    {
      sectionTitle: "Control & Evidence",
      priority: 30,
      entries: [
        { sourceOutputId: "out_evidence_completeness", businessLabel: "Input Confidence", format: "percentage", unit: "%", valueMultiplier: 100 },
        { sourceOutputId: "out_uncertainty_cash_buffer", businessLabel: "Uncertainty Cash Buffer", format: "currency", unit: "currency" },
        {
          sourceOutputId: "out_threshold_crossing",
          businessLabel: "Target Runway Status",
          format: "string",
          valueLabels: { "0": "WITHIN TARGET", "1": "BREACHED" },
        },
      ],
    },
  ],
  sensitivityTargetOutput: "out_break_even_monthly_revenue",
  sensitivityDrivers: [
    { inputId: "n_monthly_fixed_cash_cost", label: "Monthly Fixed Cash Cost" },
    { inputId: "n_monthly_debt_service", label: "Monthly Debt Service" },
    { inputId: "n_contribution_margin_ratio", label: "Contribution Margin Ratio" },
    { inputId: "n_current_monthly_revenue", label: "Current Monthly Revenue" },
    { inputId: "n_unrestricted_cash_balance", label: "Unrestricted Cash Balance" },
    { inputId: "n_minimum_cash_buffer", label: "Minimum Cash Buffer" },
    { inputId: "n_target_survival_months", label: "Target Survival Months" },
    { inputId: "n_downside_revenue_factor", label: "Downside Revenue Retention" },
  ],
  insights: [
    {
      id: "break-even-runway-critical",
      severity: "critical",
      when: (o) => o.out_threshold_crossing === 1,
      message: (o) =>
        `Under the stressed scenario, cash runway is ${(o.out_cash_runway_months ?? 0).toFixed(1)} months against a ${'$'}${(o.out_funding_gap ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})} funding gap to the survival target -- this needs a funding or cost-cutting decision now, not at the next board meeting.`,
    },
    {
      id: "break-even-margin-of-safety-opportunity",
      severity: "opportunity",
      when: (o) => o.out_threshold_crossing === 0 && o.out_margin_of_safety_ratio > 0.20,
      message: (o) =>
        `Revenue margin of safety is ${((o.out_margin_of_safety_ratio ?? 0) * 100).toFixed(0)}% -- current revenue could drop by that much before hitting break-even. Comfortable room to absorb a slow month.`,
    },
  ],
});
// ---------------------------------------------------------------------------
register({
  toolSlug: "machine-hourly-rate-proof-report",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "True Machine Hourly Rate (Productive Hours Only)", "hourly_rate", "USD/hr"),
      entry("out_normalized_demand", "Naive Rate (Ignores Idle Time)", "hourly_rate", "USD/hr"),
      entry("out_scenario_delta", "Hidden Idle Premium", "hourly_rate", "USD/hr"),
      entry("out_demand_metric", "Total Annual Cost", "currency", "USD"),
      entry("out_capacity_metric", "Productive Hours / Year", "number", "hrs"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_money_at_risk", "Annual Idle-Time Cost Exposure", "currency", "USD"),
      entry("out_sensitivity_driver", "Dominant Cost Driver", "string"),
      entry("out_fmea_trigger", "Idle Premium Above 15% Flag", "boolean"),
      entry("out_threshold_crossing", "Rate Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Rate Uncertainty Band", "hourly_rate", "USD/hr"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Idle Premium as % of Rate", "ratio"),
      entry("out_derating_factor", "Productive Hours Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Escalate Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_purchase_price", label: "Purchase Price" },
    { inputId: "n_useful_life", label: "Useful Life" },
    { inputId: "n_annual_hours", label: "Annual Hours" },
    { inputId: "n_wage_rate", label: "Operator Wage" },
    { inputId: "n_power_draw", label: "Power Draw" },
    { inputId: "n_energy_price", label: "Energy Price" },
    { inputId: "n_idle_share", label: "Idle Share" },
    { inputId: "n_maintenance_rate", label: "Maintenance Rate" },
  ],
  insights: [
    {
      id: "idle-premium-critical",
      severity: "critical",
      when: (o) => o.out_reference_deviation > 0.15,
      message: (o) =>
        `<strong>${(o.out_reference_deviation * 100).toFixed(0)}% of your hourly rate finances idle capacity</strong> (${o.out_scenario_delta.toFixed(2)}/h). Quoting on the naive rate of ${o.out_normalized_demand.toFixed(2)}/h loses that amount on every hour that actually produces something sellable. Cutting idle share by 5 points is worth more than most price negotiations.`,
    },
    {
      id: "energy-share-opportunity",
      severity: "opportunity",
      when: (o) => o.out_energy_share_pct > 0.15,
      message: (o) =>
        `Energy is <strong>${(o.out_energy_share_pct * 100).toFixed(1)}% of total cost</strong> -- well above a typical ~5-10% share. A motor efficiency audit or load-shifting review on this machine is worth investigating.`,
    },
    {
      id: "labor-share-info",
      severity: "info",
      when: (o) => o.out_labor_share_pct > 0.60,
      message: (o) =>
        `Labor is <strong>${(o.out_labor_share_pct * 100).toFixed(0)}% of the cost base</strong> -- this rate is wage-driven. Multi-machine tending or automation moves the needle here; negotiating the purchase price does not.`,
    },
    {
      id: "capital-light-info",
      severity: "info",
      when: (o) => o.out_capital_share_pct < 0.15,
      message: (o) =>
        `Capital is only <strong>${(o.out_capital_share_pct * 100).toFixed(0)}% of cost</strong> -- this machine is cheap to own, expensive to run. Uptime and labor efficiency matter far more than the purchase price you negotiated.`,
    },
    {
      id: "three-shift-context",
      severity: "info",
      when: (o) => o.out_planned_hours_value > 6000,
      message: (o) =>
        `${Math.round(o.out_planned_hours_value).toLocaleString("en-US")} planned hours/year is 3-shift territory. Confirm maintenance windows are excluded from "planned" hours -- a common source of 5-8% silent rate error when they aren't.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 3. loss-making-job-detector
// ---------------------------------------------------------------------------
register({
  toolSlug: "loss-making-job-detector",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Job Margin", "percentage"),
      entry("out_demand_metric", "Total Job Cost", "currency", "USD"),
      entry("out_capacity_metric", "Loss Exposure", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Primary Loss Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Loss Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Cost Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Margin Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_machine_rate", label: "Machine Hourly Rate" },
    { inputId: "n_cycle_time", label: "Cycle Time per Unit" },
    { inputId: "n_setup_time", label: "Batch Setup Time" },
    { inputId: "n_batch_quantity", label: "Batch Quantity" },
    { inputId: "n_material_cost", label: "Material Cost per Unit" },
    { inputId: "n_target_margin", label: "Target Gross Margin" },
    { inputId: "n_annual_volume", label: "Annual Decision Volume" },
    { inputId: "n_labor_rate", label: "Fully Loaded Labor Rate" },
  ],
  insights: [
    {
      id: "loss-making-job-detector-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `This job is priced below its true fully-loaded cost. Annualized loss exposure is ${(o.out_money_at_risk ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}. Do not quote at the current price without renegotiating or cutting cost.`,
    },
    {
      id: "loss-making-job-detector-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `Contribution margin clears the target with room to spare -- this job is priced to actually make money, not just cover cost.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 4. receivables-cost-payment-term-addendum
// ---------------------------------------------------------------------------
register({
  toolSlug: "receivables-cost-payment-term-addendum",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Cost of Extended Terms", "currency", "USD"),
      entry("out_demand_metric", "Annual Receivables Cost", "currency", "USD"),
      entry("out_capacity_metric", "Working Capital Impact", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Cost Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Cost Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Cost Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Payment Risk Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_average_receivable_balance", label: "Average Receivable Balance" },
    { inputId: "n_annual_interest_rate", label: "Annual Cost of Capital / Interest Rate" },
    { inputId: "n_average_collection_days", label: "Average Collection Period (DSO)" },
    { inputId: "n_invoice_volume", label: "Annual Invoice Volume" },
  ],
  insights: [
    {
      id: "receivables-cost-payment-term-addendum-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `The financing cost of these payment terms exceeds the review threshold (${(o.out_demand_metric ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}/yr). Either shorten the terms or price the credit cost into the quote.`,
    },
    {
      id: "receivables-cost-payment-term-addendum-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `Financing cost of these terms is within a normal range -- no repricing needed on payment terms alone.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 5. setup-time-reduction-roi-smed
// ---------------------------------------------------------------------------
register({
  toolSlug: "setup-time-reduction-roi-smed",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "SMED ROI Multiplier", "ratio"),
      entry("out_demand_metric", "Annual Setup Cost", "currency", "USD"),
      entry("out_capacity_metric", "Recovered Capacity Hours", "number", "hrs"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "ROI Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "ROI Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "ROI Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Improvement Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_machine_rate", label: "Machine Hourly Rate" },
    { inputId: "n_setup_time", label: "Batch Setup Time" },
    { inputId: "n_batch_quantity", label: "Batch Quantity" },
    { inputId: "n_annual_volume", label: "Annual Decision Volume" },
    { inputId: "n_labor_rate", label: "Fully Loaded Labor Rate" },
    { inputId: "n_smed_investment_cost", label: "SMED Program Investment Cost" },
    { inputId: "n_setup_time_reduction_target_pct", label: "Target Setup Time Reduction" },
  ],
  insights: [
    {
      id: "setup-time-reduction-roi-smed-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `Payback on this SMED investment (${(o.out_money_at_risk ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})} committed) is too long to justify at current volumes -- the setup-time savings don't cover the investment fast enough.`,
    },
    {
      id: "setup-time-reduction-roi-smed-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `This SMED investment pays back inside the target window -- a defensible capital request.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 6. product-sku-margin-ranker
// ---------------------------------------------------------------------------
register({
  toolSlug: "product-sku-margin-ranker",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Ranked Margin Score", "percentage"),
      entry("out_demand_metric", "SKU Contribution Margin", "currency", "USD"),
      entry("out_capacity_metric", "Volume-Weighted Margin", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Margin Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Margin Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Margin Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Margin Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_machine_rate", label: "Machine Hourly Rate" },
    { inputId: "n_cycle_time", label: "Cycle Time per Unit" },
    { inputId: "n_setup_time", label: "Batch Setup Time" },
    { inputId: "n_batch_quantity", label: "Batch Quantity" },
    { inputId: "n_material_cost", label: "Material Cost per Unit" },
    { inputId: "n_target_margin", label: "Target Gross Margin" },
    { inputId: "n_annual_volume", label: "Annual Decision Volume" },
    { inputId: "n_labor_rate", label: "Fully Loaded Labor Rate" },
  ],
  insights: [
    {
      id: "product-sku-margin-ranker-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `This SKU's contribution margin is below target at current volume -- annualized margin exposure is ${(o.out_capacity_metric ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}. Reprice or delist before scaling volume further.`,
    },
    {
      id: "product-sku-margin-ranker-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `This SKU clears its target margin -- safe to grow volume on.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 7. true-employee-cost-statement
// ---------------------------------------------------------------------------
register({
  toolSlug: "true-employee-cost-statement",
  sections: [
    section("Primary Results", 10, [
      entry("out_fully_loaded_annual_cost", "Fully Loaded Annual Cost", "currency", "USD"),
      entry("out_base_annual_compensation", "Base Annual Compensation", "currency", "USD"),
      entry("out_productive_hourly_cost", "Productive Hourly Cost", "hourly_rate", "USD/hr"),
    ]),
    section("Cost Breakdown", 15, [
      entry("out_employer_payroll_taxes", "Employer Payroll Taxes", "currency", "USD"),
      entry("out_benefits_cost", "Benefits Cost", "currency", "USD"),
      entry("out_paid_leave_cost", "Paid Leave Cost", "currency", "USD"),
      entry("out_training_allocation", "Training Allocation", "currency", "USD"),
      entry("out_equipment_it_cost", "Equipment & IT Cost", "currency", "USD"),
      entry("out_workspace_facility_cost", "Workspace / Facility Cost", "currency", "USD"),
      entry("out_insurance_burden", "Insurance Burden", "currency", "USD"),
    ]),
    section("Productivity Metrics", 20, [
      entry("out_productive_hours_annual", "Productive Hours (Annual)", "number", "hrs"),
      entry("out_monthly_employer_cost", "Monthly Employer Cost", "currency", "USD"),
      entry("out_base_to_loaded_multiplier", "Base-to-Loaded Multiplier", "ratio"),
    ]),
    section("Risk Assessment", 25, [
      entry("out_primary_cost_driver", "Primary Cost Driver", "string"),
      entry("out_expanded_uncertainty", "Cost Uncertainty Band", "currency", "USD"),
      entry("out_threshold_crossing", "Burden Threshold Crossed", "boolean"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_decision_state", "Decision State", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_fully_loaded_annual_cost",
  sensitivityDrivers: [
    { inputId: "n_annual_base_salary", label: "Annual Base Salary" },
    { inputId: "n_payroll_tax_rate", label: "Employer Payroll Tax Rate" },
    { inputId: "n_annual_benefits_cost", label: "Annual Benefits Cost" },
    { inputId: "n_annual_insurance_cost", label: "Annual Health/Life Insurance Cost" },
    { inputId: "n_annual_training_cost", label: "Annual Training & Development Cost" },
    { inputId: "n_annual_equipment_it_cost", label: "Annual Equipment & IT Cost" },
    { inputId: "n_annual_workspace_facility_cost", label: "Annual Workspace & Facility Cost" },
    { inputId: "n_target_billable_utilization_ratio", label: "Target Billable Utilization" },
  ],
  insights: [
    {
      id: "true-employee-cost-statement-critical",
      severity: "critical",
      when: (o) => o.out_threshold_crossing === 1,
      message: (o) =>
        `Fully loaded cost is running well above base compensation -- ${(o.out_base_to_loaded_multiplier ?? 0).toFixed(2)}x the base salary. Budgeting or pricing against base salary alone understates true cost by this multiplier.`,
    },
    {
      id: "true-employee-cost-statement-context",
      severity: "info",
      when: (o) => o.out_base_to_loaded_multiplier > 0,
      message: (o) =>
        `Fully loaded annual cost is $${(o.out_fully_loaded_annual_cost ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})} against $${(o.out_base_annual_compensation ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})} base -- use the loaded figure, not base salary, for margin and pricing decisions involving this role.`,
    },
  ],
});
// ---------------------------------------------------------------------------
register({
  toolSlug: "job-quote-builder-pro-pack",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Quote Margin", "percentage"),
      entry("out_demand_metric", "Total Quote Cost", "currency", "USD"),
      entry("out_capacity_metric", "Quote Capacity Score", "number"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Quote Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Margin Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Quote Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Quote Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_machine_rate", label: "Machine Hourly Rate" },
    { inputId: "n_cycle_time", label: "Cycle Time per Unit" },
    { inputId: "n_setup_time", label: "Batch Setup Time" },
    { inputId: "n_batch_quantity", label: "Batch Quantity" },
    { inputId: "n_material_cost", label: "Material Cost per Unit" },
    { inputId: "n_target_margin", label: "Target Gross Margin" },
    { inputId: "n_annual_volume", label: "Annual Decision Volume" },
    { inputId: "n_labor_rate", label: "Fully Loaded Labor Rate" },
  ],
  insights: [
    {
      id: "job-quote-builder-pro-pack-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `This quote's margin is below the safety threshold against a ${(o.out_demand_metric ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})} cost base -- sending it as-is risks a loss-making job.`,
    },
    {
      id: "job-quote-builder-pro-pack-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `This quote holds margin above target -- defensible to send as-is.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 9. machine-investment-feasibility-buy-lease-keep
// ---------------------------------------------------------------------------
register({
  toolSlug: "machine-investment-feasibility-buy-lease-keep",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Investment Feasibility Score", "ratio"),
      entry("out_demand_metric", "Total Cost of Ownership", "currency", "USD"),
      entry("out_capacity_metric", "Capacity Utilization Impact", "number", "hrs"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Investment Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Feasibility Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "TCO Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Investment Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_initial_investment", label: "Initial Investment" },
    { inputId: "n_annual_net_cash_flow", label: "Annual Net Cash Flow" },
    { inputId: "n_discount_rate", label: "Discount Rate" },
    { inputId: "n_analysis_years", label: "Analysis Period" },
    { inputId: "n_residual_value", label: "Residual Value" },
    { inputId: "n_stress_downside_factor", label: "Downside Stress Factor" },
    { inputId: "n_annual_volume", label: "Annual Decision Volume" },
    { inputId: "n_labor_rate", label: "Fully Loaded Labor Rate" },
  ],
  insights: [
    {
      id: "machine-investment-feasibility-buy-lease-keep-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `The total cost of ownership (${(o.out_demand_metric ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}) makes this option unfavorable against the alternatives -- do not commit capital on this path without revisiting the comparison.`,
    },
    {
      id: "machine-investment-feasibility-buy-lease-keep-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `This option's total cost of ownership is favorable -- a defensible buy/lease/keep decision.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 10. capital-equipment-investment-appraisal-npv-irr
// ---------------------------------------------------------------------------
register({
  toolSlug: "capital-equipment-investment-appraisal-npv-irr",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "NPV / IRR Score", "ratio"),
      entry("out_demand_metric", "Net Present Value", "currency", "USD"),
      entry("out_capacity_metric", "Capital Efficiency Ratio", "ratio"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "NPV Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "NPV Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "NPV Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Appraisal Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_initial_investment", label: "Initial Investment" },
    { inputId: "n_annual_net_cash_flow", label: "Annual Net Cash Flow" },
    { inputId: "n_discount_rate", label: "Discount Rate" },
    { inputId: "n_analysis_years", label: "Analysis Period" },
    { inputId: "n_residual_value", label: "Residual Value" },
    { inputId: "n_stress_downside_factor", label: "Downside Stress Factor" },
    { inputId: "n_annual_volume", label: "Annual Decision Volume" },
    { inputId: "n_labor_rate", label: "Fully Loaded Labor Rate" },
  ],
  insights: [
    {
      id: "capital-equipment-investment-appraisal-npv-irr-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `Net present value (${(o.out_demand_metric ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}) does not clear the hurdle -- this investment destroys value at the current discount rate and cash flow assumptions.`,
    },
    {
      id: "capital-equipment-investment-appraisal-npv-irr-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `NPV is positive and clears the hurdle rate -- this investment creates value at the assumptions entered.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 11. customer-sku-profitability-forensics
// ---------------------------------------------------------------------------
register({
  toolSlug: "customer-sku-profitability-forensics",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Customer Profitability Score", "percentage"),
      entry("out_demand_metric", "Net Profit per SKU", "currency", "USD"),
      entry("out_capacity_metric", "Total Account Profit", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Profit Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Profit Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Profit Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Profit Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_unit_price", label: "Unit Price" },
    { inputId: "n_unit_variable_cost", label: "Unit Variable Cost" },
    { inputId: "n_annual_volume", label: "Annual Volume" },
    { inputId: "n_logistics_cost_pct", label: "Logistics Cost %" },
    { inputId: "n_service_cost_pct", label: "Service Cost %" },
    { inputId: "n_return_rate_pct", label: "Return Rate %" },
    { inputId: "n_target_margin", label: "Target Margin" },
    { inputId: "n_labor_rate", label: "Labor Rate" },
  ],
  insights: [
    {
      id: "customer-sku-profitability-forensics-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `This SKU is toxic at the account level -- net margin after logistics, service, and return costs is negative, with ${(o.out_capacity_metric ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})} in annualized exposure. Cut, reprice, or renegotiate terms.`,
    },
    {
      id: "customer-sku-profitability-forensics-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `This SKU is genuinely profitable after all servicing costs are accounted for, not just on paper gross margin.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 12. downtime-scrap-loss-statement
// ---------------------------------------------------------------------------
register({
  toolSlug: "downtime-scrap-loss-statement",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Total Loss Statement", "currency", "USD"),
      entry("out_demand_metric", "Downtime Cost", "currency", "USD"),
      entry("out_capacity_metric", "Scrap & Rework Cost", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Loss Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Loss Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Loss Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Loss Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_productive_hours", label: "Productive Hours" },
    { inputId: "n_actual_hours", label: "Actual Hours" },
    { inputId: "n_hourly_rate", label: "Hourly Rate" },
    { inputId: "n_scrap_quantity", label: "Scrap Quantity" },
    { inputId: "n_unit_cost", label: "Unit Cost" },
    { inputId: "n_rework_hours", label: "Rework Hours" },
    { inputId: "n_rework_rate", label: "Rework Rate" },
    { inputId: "n_material_cost", label: "Material Cost" },
  ],
  insights: [
    {
      id: "downtime-scrap-loss-statement-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `Combined downtime, scrap, and rework loss (${(o.out_money_at_risk ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}) has crossed the escalation threshold against your material cost base -- this needs a root-cause review, not just tracking.`,
    },
    {
      id: "downtime-scrap-loss-statement-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `Losses from downtime, scrap, and rework are within a controlled range relative to material cost.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 13. oee-loss-monetization-improvement-business-case
// ---------------------------------------------------------------------------
register({
  toolSlug: "oee-loss-monetization-improvement-business-case",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "OEE Improvement ROI", "ratio"),
      entry("out_demand_metric", "Annual Loss Monetization", "currency", "USD"),
      entry("out_capacity_metric", "Recoverable Capacity Value", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "OEE Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "OEE Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Improvement Uncertainty", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Improvement Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_planned_production_time", label: "Planned Production Time" },
    { inputId: "n_operating_time", label: "Operating Time" },
    { inputId: "n_net_operating_time", label: "Net Operating Time" },
    { inputId: "n_valuable_operating_time", label: "Valuable Operating Time" },
    { inputId: "n_ideal_cycle_time", label: "Ideal Cycle Time" },
    { inputId: "n_total_parts", label: "Total Parts" },
    { inputId: "n_good_parts", label: "Good Parts" },
    { inputId: "n_hourly_contribution", label: "Hourly Contribution" },
  ],
  insights: [
    {
      id: "oee-loss-monetization-improvement-business-case-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `The monetized value of closing this OEE gap (${(o.out_demand_metric ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}/yr) justifies an improvement project -- the business case clears the threshold.`,
    },
    {
      id: "oee-loss-monetization-improvement-business-case-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `Recoverable OEE loss value is modest at current performance -- other improvement levers likely pay back faster.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 14. scrap-rework-cost-tracker
// ---------------------------------------------------------------------------
register({
  toolSlug: "scrap-rework-cost-tracker",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Total Scrap & Rework Cost", "currency", "USD"),
      entry("out_demand_metric", "Monthly Scrap Cost", "currency", "USD"),
      entry("out_capacity_metric", "Monthly Rework Cost", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Cost Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Cost Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Cost Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Quality Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_total_produced", label: "Total Produced" },
    { inputId: "n_scrap_quantity", label: "Scrap Quantity" },
    { inputId: "n_rework_quantity", label: "Rework Quantity" },
    { inputId: "n_unit_material_cost", label: "Unit Material Cost" },
    { inputId: "n_unit_labor_cost", label: "Unit Labor Cost" },
    { inputId: "n_rework_labor_rate", label: "Rework Labor Rate" },
    { inputId: "n_rework_time_per_unit", label: "Rework Time Per Unit" },
    { inputId: "n_defect_rate_target_pct", label: "Defect Rate Target %" },
  ],
  insights: [
    {
      id: "scrap-rework-cost-tracker-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `Defect rate is above target and the combined scrap/rework cost (${(o.out_money_at_risk ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}) is materially eating into unit economics -- this is a quality escalation, not routine tracking.`,
    },
    {
      id: "scrap-rework-cost-tracker-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `Defect rate is at or below target -- scrap and rework cost is under control.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 15. outsource-vs-in-house-analyzer
// ---------------------------------------------------------------------------
register({
  toolSlug: "outsource-vs-in-house-analyzer",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Net Cost Delta", "currency", "USD"),
      entry("out_demand_metric", "In-House Unit Cost", "currency", "USD"),
      entry("out_capacity_metric", "Outsource Unit Cost", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Decision Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Cost Delta Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Decision Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Quality Risk Derating", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_in_house_material_cost", label: "In-House Material Cost" },
    { inputId: "n_in_house_labor_cost", label: "In-House Labor Cost" },
    { inputId: "n_in_house_overhead", label: "In-House Overhead" },
    { inputId: "n_in_house_setup_cost", label: "In-House Setup Cost" },
    { inputId: "n_outsource_unit_price", label: "Outsource Unit Price" },
    { inputId: "n_outsource_logistics_cost", label: "Outsource Logistics Cost" },
    { inputId: "n_annual_volume", label: "Annual Volume" },
    { inputId: "n_quality_risk_premium_pct", label: "Quality Risk Premium %" },
  ],
  insights: [
    {
      id: "outsource-vs-in-house-analyzer-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `The risk-adjusted cost delta (${(o.out_money_at_risk ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})} exposure) favors a decision change -- re-run this analysis before the next sourcing commitment.`,
    },
    {
      id: "outsource-vs-in-house-analyzer-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `The current in-house/outsource split is cost-favorable once capacity opportunity cost and quality risk premium are both priced in.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 16. plant-wide-shop-rate-cost-structure-audit
// ---------------------------------------------------------------------------
register({
  toolSlug: "plant-wide-shop-rate-cost-structure-audit",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Calculated Shop Rate", "hourly_rate", "USD/hr"),
      entry("out_demand_metric", "Total Annual Cost", "currency", "USD"),
      entry("out_capacity_metric", "Total Productive Hours", "number", "hrs"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Rate Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Rate Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Audit Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Cost Structure Derating", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_total_annual_cost", label: "Total Annual Cost" },
    { inputId: "n_total_productive_hours", label: "Total Productive Hours" },
    { inputId: "n_machine_group_cost", label: "Machine Group Cost" },
    { inputId: "n_machine_group_hours", label: "Machine Group Hours" },
    { inputId: "n_overhead_pool", label: "Overhead Pool" },
    { inputId: "n_overhead_allocation_base", label: "Overhead Allocation Base" },
    { inputId: "n_current_shop_rate", label: "Current Shop Rate" },
    { inputId: "n_target_margin_pct", label: "Target Margin %" },
  ],
  insights: [
    {
      id: "plant-wide-shop-rate-cost-structure-audit-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `The audited plant-wide rate under-recovers cost at current utilization -- quoting on the naive rate alone (ignoring this audit) is losing money on every job.`,
    },
    {
      id: "plant-wide-shop-rate-cost-structure-audit-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `The plant-wide shop rate recovers full cost at current utilization -- safe to quote against.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 17. fx-commodity-pass-through-pricer
// ---------------------------------------------------------------------------
register({
  toolSlug: "fx-commodity-pass-through-pricer",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Adjusted Price", "currency", "USD"),
      entry("out_demand_metric", "FX Impact on Cost", "currency", "USD"),
      entry("out_capacity_metric", "Commodity Impact on Cost", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Price Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Price Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Price Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Pass-Through Derating", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_base_price", label: "Base Price" },
    { inputId: "n_fx_rate_spot", label: "FX Rate (Spot)" },
    { inputId: "n_fx_rate_budget", label: "FX Rate (Budget)" },
    { inputId: "n_commodity_index_current", label: "Commodity Index (Current)" },
    { inputId: "n_commodity_index_budget", label: "Commodity Index (Budget)" },
    { inputId: "n_material_cost_pct", label: "Material Cost %" },
    { inputId: "n_fx_hedge_pct", label: "FX Hedge %" },
    { inputId: "n_commodity_hedge_pct", label: "Commodity Hedge %" },
  ],
  insights: [
    {
      id: "fx-commodity-pass-through-pricer-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `Combined FX and commodity movement has crossed the repricing threshold -- ${(o.out_money_at_risk ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}/yr is exposed if the quote isn't repriced to reflect current rates.`,
    },
    {
      id: "fx-commodity-pass-through-pricer-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `FX and commodity movement is within the no-reprice band -- the existing quote still holds.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 18. energy-efficiency-grant-incentive-feasibility-pack
// ---------------------------------------------------------------------------
register({
  toolSlug: "energy-efficiency-grant-incentive-feasibility-pack",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Grant-Adjusted ROI", "ratio"),
      entry("out_demand_metric", "Energy Cost Savings", "currency", "USD"),
      entry("out_capacity_metric", "Grant Amount", "currency", "USD"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Feasibility Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "ROI Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "Feasibility Uncertainty", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Grant Derating Factor", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_current_kwh_per_year", label: "Current kWh/Year" },
    { inputId: "n_target_kwh_per_year", label: "Target kWh/Year" },
    { inputId: "n_avg_kwh_rate", label: "Avg kWh Rate" },
    { inputId: "n_implementation_cost", label: "Implementation Cost" },
    { inputId: "n_grant_coverage_pct", label: "Grant Coverage %" },
    { inputId: "n_maintenance_cost_saving", label: "Maintenance Cost Saving" },
    { inputId: "n_emission_factor_kgco2_per_kwh", label: "Emission Factor (kgCO₂/kWh)" },
    { inputId: "n_equipment_life_years", label: "Equipment Life (Years)" },
  ],
  insights: [
    {
      id: "energy-efficiency-grant-incentive-feasibility-pack-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `Even after the grant offset, payback on this energy-efficiency project is too long to proceed at current energy prices and savings estimates.`,
    },
    {
      id: "energy-efficiency-grant-incentive-feasibility-pack-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `Grant-adjusted payback clears the proceed threshold -- a defensible capital request even without further incentive negotiation.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 19. motor-compressor-replacement-roi
// ---------------------------------------------------------------------------
register({
  toolSlug: "motor-compressor-replacement-roi",
  sections: [
    section("Primary Results", 10, [
      entry("out_utilization_margin", "Replacement ROI", "ratio"),
      entry("out_demand_metric", "Energy Cost Savings", "currency", "USD"),
      entry("out_capacity_metric", "Payback Period", "number", "years"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "ROI Sensitivity Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "ROI Threshold Crossed", "boolean"),
      entry("out_expanded_uncertainty", "ROI Uncertainty Band", "currency", "USD"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Replacement Derating", "ratio"),
      entry("out_final_decision_state", "Go / Review / Block Decision", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_utilization_margin",
  sensitivityDrivers: [
    { inputId: "n_motor_power_kw", label: "Motor Power (kW)" },
    { inputId: "n_annual_operating_hours", label: "Annual Operating Hours" },
    { inputId: "n_current_efficiency_pct", label: "Current Efficiency %" },
    { inputId: "n_new_efficiency_pct", label: "New Efficiency %" },
    { inputId: "n_avg_kwh_rate", label: "Avg kWh Rate" },
    { inputId: "n_replacement_cost", label: "Replacement Cost" },
    { inputId: "n_installation_cost", label: "Installation Cost" },
    { inputId: "n_maintenance_saving_per_year", label: "Maintenance Saving/Year" },
  ],
  insights: [
    {
      id: "motor-compressor-replacement-roi-critical",
      severity: "critical",
      when: (o) => o.out_final_decision_state === 2,
      message: (o) => `Payback on this motor/compressor replacement (${(o.out_money_at_risk ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})} committed) is long, but NPV over the equipment's life may still be positive -- check the NPV figure before rejecting on payback alone.`,
    },
    {
      id: "motor-compressor-replacement-roi-favorable",
      severity: "opportunity",
      when: (o) => o.out_final_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `This replacement pays back inside a reasonable window and NPV is positive over the equipment's life -- a defensible upgrade.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// 20. weld-procedure-cost-consumable-estimation-suite
// ---------------------------------------------------------------------------
register({
  toolSlug: "weld-procedure-cost-consumable-estimation-suite",
  sections: [
    section("Primary Results", 10, [
      entry("out_total_cost_floor", "Total Weld Cost", "currency", "USD"),
      entry("out_base_production_cost", "Base Production Cost", "currency", "USD"),
      entry("out_cost_per_meter", "Cost per Meter", "currency", "USD/m"),
    ]),
    section("Cost Breakdown", 15, [
      entry("out_wire_mass_kg", "Wire Mass", "number", "kg"),
      entry("out_wire_cost", "Wire / Electrode Cost", "currency", "USD"),
      entry("out_shielding_gas_cost", "Shielding Gas Cost", "currency", "USD"),
      entry("out_labor_cost", "Labor Cost", "currency", "USD"),
      entry("out_shop_overhead", "Shop Overhead", "currency", "USD"),
    ]),
    section("Efficiency Metrics", 20, [
      entry("out_consumable_efficiency", "Deposition Efficiency", "percentage"),
      entry("out_expanded_uncertainty", "Cost Uncertainty", "currency", "USD"),
    ]),
    section("Risk Assessment", 25, [
      entry("out_sensitivity_driver", "Primary Cost Driver", "string"),
      entry("out_fmea_trigger", "FMEA Trigger Flag", "boolean"),
      entry("out_threshold_crossing", "Cost Threshold Crossed", "boolean"),
    ]),
    section("Quality & Decision", 30, [
      entry("out_evidence_completeness", "Input Confidence Score", "ratio"),
      entry("out_decision_state", "Decision State", "number"),
    ]),
  ],
  sensitivityTargetOutput: "out_total_cost_floor",
  sensitivityDrivers: [
    { inputId: "n_weld_length_m", label: "Weld Length (m)" },
    { inputId: "n_weld_throat_mm", label: "Weld Throat (mm)" },
    { inputId: "n_weld_density_g_per_cm3", label: "Weld Density (g/cm³)" },
    { inputId: "n_wire_cost_per_kg", label: "Wire Cost per kg" },
    { inputId: "n_gas_cost_per_min", label: "Gas Cost per Minute" },
    { inputId: "n_arc_time_min", label: "Arc Time (min)" },
    { inputId: "n_weld_time_min", label: "Weld Time (min)" },
    { inputId: "n_labor_rate", label: "Labor Rate" },
  ],
  insights: [
    {
      id: "weld-procedure-cost-consumable-estimation-suite-critical",
      severity: "critical",
      when: (o) => o.out_decision_state === 2,
      message: (o) => `Cost per meter on this weld procedure (total ${(o.out_total_cost_floor ?? 0).toLocaleString("en-US", {maximumFractionDigits: 0})}) is above the review threshold -- check wire mass, deposition efficiency, and shop rate before quoting on this procedure.`,
    },
    {
      id: "weld-procedure-cost-consumable-estimation-suite-favorable",
      severity: "opportunity",
      when: (o) => o.out_decision_state === 0 && o.out_threshold_crossing === 0,
      message: () => `Cost per meter on this weld procedure is within the normal range -- safe to use as the basis for a quote.`,
    },
  ],
});

// ---------------------------------------------------------------------------
// BASIC_FALLBACK — for tools not explicitly mapped
// ---------------------------------------------------------------------------
export const BASIC_FALLBACK_CONTRACT: ProReportContract = {
  toolSlug: "__fallback__",
  sections: [
    section("Results", 10, [
      entry("out_utilization_margin", "Primary Metric", "number"),
      entry("out_demand_metric", "Demand Metric", "number"),
      entry("out_capacity_metric", "Capacity Metric", "number"),
    ]),
    section("Risk Assessment", 20, [
      entry("out_sensitivity_driver", "Primary Risk Driver", "string"),
      entry("out_fmea_trigger", "Process Risk Trigger", "boolean"),
      entry("out_threshold_crossing", "Threshold Crossing Flag", "boolean"),
      entry("out_expanded_uncertainty", "Expanded Uncertainty", "number"),
    ]),
    section("Decision State", 30, [
      entry("out_evidence_completeness", "Evidence Completeness", "ratio"),
      entry("out_reference_deviation", "Reference Deviation", "number"),
      entry("out_derating_factor", "Derating Factor", "ratio"),
      entry("out_final_decision_state", "Final Decision State", "number"),
    ]),
  ],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getProReportContract(toolSlug: string): ProReportContract | null {
  return proReportContractRegistry[toolSlug] ?? null;
}
