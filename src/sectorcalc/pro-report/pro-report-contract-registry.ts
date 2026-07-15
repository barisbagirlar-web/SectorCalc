import type {
  ProReportContract,
  ReportOutputEntry,
  ReportOutputFormat,
  ReportSection,
} from "./pro-report-types";

function entry(
  sourceOutputId: string,
  businessLabel: string,
  format: ReportOutputFormat = "number",
  unit?: string,
  options: Partial<
    Pick<
      ReportOutputEntry,
      "explanation" | "valueLabels" | "valueMultiplier" | "displayDecimals"
    >
  > = {},
): ReportOutputEntry {
  return { sourceOutputId, businessLabel, format, unit, ...options };
}

function section(
  sectionTitle: string,
  priority: number,
  entries: ReportOutputEntry[],
): ReportSection {
  return { sectionTitle, priority, entries };
}

function contract(
  toolSlug: string,
  sections: ReportSection[],
): ProReportContract {
  return { toolSlug, strict: true, sections };
}

const confidence = entry(
  "out_evidence_completeness",
  "User-Declared Source Confidence",
  "percentage",
  "%",
  {
    valueMultiplier: 100,
    displayDecimals: 1,
    explanation:
      "Confidence entered by the user; it is not an independent audit score.",
  },
);

const genericDecision = entry(
  "out_final_decision_state",
  "Decision State",
  "string",
  undefined,
  {
    valueLabels: { "0": "READY", "1": "REVIEW", "2": "BLOCK" },
  },
);

export const proReportContractRegistry: Record<string, ProReportContract> = {
  "break-even-survival-cash-calculator": contract(
    "break-even-survival-cash-calculator",
    [
      section("Break-Even Position", 10, [
        entry("out_break_even_monthly_revenue", "Break-Even Monthly Revenue", "currency", "currency/month", { displayDecimals: 2 }),
        entry("out_current_revenue_gap", "Current Revenue Gap", "currency", "currency/month", { displayDecimals: 2 }),
        entry("out_margin_of_safety_ratio", "Revenue Margin of Safety", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      ]),
      section("Survival Cash Stress", 20, [
        entry("out_stressed_monthly_revenue", "Stressed Monthly Revenue", "currency", "currency/month", { displayDecimals: 2 }),
        entry("out_monthly_cash_burn", "Monthly Cash Burn", "currency", "currency/month", { displayDecimals: 2 }),
        entry("out_cash_runway_months", "Cash Runway", "number", "months", { displayDecimals: 2 }),
        entry("out_survival_cash_target", "Survival Cash Target", "currency", "currency", { displayDecimals: 2 }),
        entry("out_funding_gap", "Funding Gap", "currency", "currency", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [
        entry("out_source_confidence_ratio", "User-Declared Source Confidence", "percentage", "%", { valueMultiplier: 100, displayDecimals: 1 }),
        entry("out_uncertainty_cash_buffer", "Uncertainty Cash Buffer", "currency", "currency", { displayDecimals: 2 }),
        entry("out_target_runway_breached", "Target Runway Status", "string", undefined, { valueLabels: { "0": "WITHIN TARGET", "1": "BREACHED" } }),
        entry("out_decision_code", "Decision", "string", undefined, { valueLabels: { "0": "READY", "1": "REVIEW", "2": "BLOCK" } }),
      ]),
    ],
  ),

  "machine-hourly-rate-proof-report": contract(
    "machine-hourly-rate-proof-report",
    [
      section("Unit Economics", 10, [
        entry("out_demand_metric", "Machine Cost per Unit", "currency", "currency/unit", { displayDecimals: 4 }),
        entry("out_utilization_margin", "Entered Machine Hourly Rate", "hourly_rate", "currency/hour", { displayDecimals: 2 }),
        entry("out_scenario_delta", "Gross Profit per Unit at Quote Floor", "currency", "currency/unit", { displayDecimals: 4 }),
      ]),
      section("Capacity and Exposure", 20, [
        entry("out_capacity_metric", "Annual Required Productive Hours", "number", "hours/year", { displayDecimals: 2 }),
        entry("out_expanded_uncertainty", "Uncertainty per Unit", "currency", "currency/unit", { displayDecimals: 4 }),
        entry("out_money_at_risk", "Annual Uncertainty Exposure", "currency", "currency", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [confidence, genericDecision]),
    ],
  ),

  "loss-making-job-detector": contract("loss-making-job-detector", [
    section("Job Economics", 10, [
      entry("out_demand_metric", "Margin per Unit", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_capacity_metric", "Target-Margin Price per Unit", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_utilization_margin", "Quoted Margin", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_scenario_delta", "Batch Margin", "currency", "currency", { displayDecimals: 2 }),
    ]),
    section("Exposure", 20, [
      entry("out_money_at_risk", "Annual Loss and Uncertainty Exposure", "currency", "currency", { displayDecimals: 2 }),
      entry("out_reference_deviation", "Price Gap to Target", "currency", "currency/unit", { displayDecimals: 4 }),
    ]),
    section("Evidence and Decision", 30, [confidence, genericDecision]),
  ]),

  "receivables-cost-payment-term-addendum": contract(
    "receivables-cost-payment-term-addendum",
    [
      section("Payment-Term Cost Basis", 10, [
        entry("out_utilization_margin", "Cost per Invoice", "currency", "currency", { displayDecimals: 2 }),
        entry("out_demand_metric", "Annual Receivables Cost", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_capacity_metric", "Invoice Amount Including Cost Basis", "currency", "currency", { displayDecimals: 2 }),
        entry("out_reference_deviation", "Cost-Recovery Addendum Rate", "percentage", "%", { valueMultiplier: 100, displayDecimals: 3 }),
      ]),
      section("Exposure", 20, [
        entry("out_expanded_uncertainty", "Annual Uncertainty", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_money_at_risk", "Annual Cost at Risk", "currency", "currency/year", { displayDecimals: 2 }),
      ]),
      section("Review Requirement", 30, [
        confidence,
        entry("out_final_decision_state", "Decision State", "string", undefined, { valueLabels: { "0": "COST BASIS", "1": "CONTRACT REVIEW", "2": "BLOCK" } }),
      ]),
    ],
  ),

  "setup-time-reduction-roi-smed": contract(
    "setup-time-reduction-roi-smed",
    [
      section("SMED Benefit", 10, [
        entry("out_normalized_demand", "Annual Recovered Capacity", "number", "hours/year", { displayDecimals: 2 }),
        entry("out_demand_metric", "Annual Recoverable Value", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_utilization_margin", "Annual Return on Implementation Cost", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
        entry("out_scenario_delta", "Simple Payback", "number", "months", { displayDecimals: 2 }),
      ]),
      section("Investment and Uncertainty", 20, [
        entry("out_money_at_risk", "Implementation Cost", "currency", "currency", { displayDecimals: 2 }),
        entry("out_expanded_uncertainty", "Annual Value Uncertainty", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_reference_deviation", "Setup-Time Reduction", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [confidence, genericDecision]),
    ],
  ),

  "product-sku-margin-ranker": contract("product-sku-margin-ranker", [
    section("SKU Economics", 10, [
      entry("out_demand_metric", "Contribution per Unit", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_capacity_metric", "Unit Selling Price", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_utilization_margin", "Net Margin", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_scenario_delta", "Annual Contribution", "currency", "currency/year", { displayDecimals: 2 }),
    ]),
    section("Exposure", 20, [
      entry("out_reference_deviation", "Price Gap to Target Margin", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_money_at_risk", "Annual Margin at Risk", "currency", "currency/year", { displayDecimals: 2 }),
    ]),
    section("Evidence and Decision", 30, [confidence, genericDecision]),
  ]),

  "true-employee-cost-statement": contract("true-employee-cost-statement", [
    section("Verified Employer Cost", 10, [
      entry("out_base_annual_compensation", "Annual Base Compensation", "currency", "currency/year", { displayDecimals: 2 }),
      entry("out_workspace_facility_cost", "Other Annual Employer Costs", "currency", "currency/year", { displayDecimals: 2 }),
      entry("out_fully_loaded_annual_cost", "Fully Loaded Annual Employer Cost", "currency", "currency/year", { displayDecimals: 2 }),
      entry("out_monthly_employer_cost", "Monthly Employer Cost", "currency", "currency/month", { displayDecimals: 2 }),
      entry("out_base_to_loaded_multiplier", "Base-to-Loaded Multiplier", "ratio", undefined, { displayDecimals: 4 }),
    ]),
    section("Evidence and Uncertainty", 20, [
      confidence,
      entry("out_expanded_uncertainty", "Cost Uncertainty", "currency", "currency/year", { displayDecimals: 2 }),
      entry("out_decision_state", "Decision State", "string", undefined, { valueLabels: { "0": "READY", "1": "REVIEW", "2": "BLOCK" } }),
    ]),
  ]),

  "job-quote-builder-pro-pack": contract("job-quote-builder-pro-pack", [
    section("Quote Basis", 10, [
      entry("out_demand_metric", "Total Batch Cost", "currency", "currency", { displayDecimals: 2 }),
      entry("out_capacity_metric", "Minimum Risk-Adjusted Quote", "currency", "currency", { displayDecimals: 2 }),
      entry("out_utilization_margin", "Gross Margin at Quote Floor", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_scenario_delta", "Batch Gross Profit", "currency", "currency", { displayDecimals: 2 }),
    ]),
    section("Capacity and Exposure", 20, [
      entry("out_expanded_uncertainty", "Quote Uncertainty Allowance", "currency", "currency", { displayDecimals: 2 }),
      entry("out_money_at_risk", "Money at Risk", "currency", "currency", { displayDecimals: 2 }),
    ]),
    section("Evidence and Decision", 30, [confidence, genericDecision]),
  ]),

  "machine-investment-feasibility-buy-lease-keep": contract(
    "machine-investment-feasibility-buy-lease-keep",
    [
      section("Scenario NPV", 10, [
        entry("out_demand_metric", "Buy NPV", "currency", "currency", { displayDecimals: 2 }),
        entry("out_capacity_metric", "Lease NPV", "currency", "currency", { displayDecimals: 2 }),
        entry("out_utilization_margin", "Keep NPV", "currency", "currency", { displayDecimals: 2 }),
      ]),
      section("Decision Robustness", 20, [
        entry("out_reference_deviation", "NPV Margin Between Leading Options", "currency", "currency", { displayDecimals: 2 }),
        entry("out_scenario_delta", "Downside NPV Delta", "currency", "currency", { displayDecimals: 2 }),
        entry("out_expanded_uncertainty", "Decision Uncertainty Band", "currency", "currency", { displayDecimals: 2 }),
        entry("out_money_at_risk", "Money at Risk", "currency", "currency", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [
        confidence,
        entry("out_final_decision_state", "Preferred Alternative", "string", undefined, { valueLabels: { "0": "BUY", "1": "LEASE", "2": "KEEP", "3": "REVIEW" } }),
      ]),
    ],
  ),

  "capital-equipment-investment-appraisal-npv-irr": contract(
    "capital-equipment-investment-appraisal-npv-irr",
    [
      section("Investment Return", 10, [
        entry("out_demand_metric", "Net Present Value", "currency", "currency", { displayDecimals: 2 }),
        entry("out_capacity_metric", "Internal Rate of Return", "percentage", "%", { valueMultiplier: 100, displayDecimals: 3 }),
        entry("out_utilization_margin", "Profitability Index", "ratio", undefined, { displayDecimals: 4 }),
      ]),
      section("Downside and Exposure", 20, [
        entry("out_reference_deviation", "IRR Minus Discount Rate", "percentage", "%", { valueMultiplier: 100, displayDecimals: 3 }),
        entry("out_scenario_delta", "Base-to-Downside NPV Delta", "currency", "currency", { displayDecimals: 2 }),
        entry("out_expanded_uncertainty", "NPV Uncertainty", "currency", "currency", { displayDecimals: 2 }),
        entry("out_money_at_risk", "Money at Risk", "currency", "currency", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [confidence, genericDecision]),
    ],
  ),

  "customer-sku-profitability-forensics": contract(
    "customer-sku-profitability-forensics",
    [
      section("Net Cost-to-Serve Margin", 10, [
        entry("out_demand_metric", "Net Margin per Unit", "currency", "currency/unit", { displayDecimals: 4 }),
        entry("out_capacity_metric", "Annual Net Margin", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_utilization_margin", "Net Margin Ratio", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
        entry("out_reference_deviation", "Margin Gap to Target", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      ]),
      section("Exposure", 20, [
        entry("out_scenario_delta", "Largest Annual Cost-to-Serve Burden", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_money_at_risk", "Margin at Risk", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_expanded_uncertainty", "Annual Margin Uncertainty", "currency", "currency/year", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [confidence, genericDecision]),
    ],
  ),

  "downtime-scrap-loss-statement": contract("downtime-scrap-loss-statement", [
    section("Loss Statement", 10, [
      entry("out_demand_metric", "Downtime Cost", "currency", "currency", { displayDecimals: 2 }),
      entry("out_capacity_metric", "Total Downtime, Scrap and Rework Loss", "currency", "currency", { displayDecimals: 2 }),
      entry("out_money_at_risk", "Money at Risk", "currency", "currency", { displayDecimals: 2 }),
    ]),
    section("Operating Condition", 20, [
      entry("out_utilization_margin", "Uptime Ratio", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_derating_factor", "Downtime Ratio", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_reference_deviation", "Entered Defect Rate", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_scenario_delta", "Largest-to-Smallest Loss Component Gap", "currency", "currency", { displayDecimals: 2 }),
    ]),
    section("Evidence and Decision", 30, [confidence, genericDecision]),
  ]),

  "oee-loss-monetization-improvement-business-case": contract(
    "oee-loss-monetization-improvement-business-case",
    [
      section("OEE and Loss Components", 10, [
        entry("out_reference_deviation", "Overall Equipment Effectiveness", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
        entry("out_derating_factor", "Availability", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
        entry("out_utilization_margin", "Performance", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
        entry("out_demand_metric", "Availability Loss", "currency", "currency", { displayDecimals: 2 }),
        entry("out_capacity_metric", "Performance Loss", "currency", "currency", { displayDecimals: 2 }),
        entry("out_expanded_uncertainty", "Quality Loss", "currency", "currency", { displayDecimals: 2 }),
      ]),
      section("Business-Case Boundary", 20, [
        entry("out_money_at_risk", "Measured-Period Total OEE Loss", "currency", "currency", { displayDecimals: 2 }),
        entry("out_scenario_delta", "Measured Loss Minus Improvement Cost", "currency", "currency", { displayDecimals: 2, explanation: "This is not ROI; ROI requires an explicit recovery rate and time horizon." }),
      ]),
      section("Evidence and Decision", 30, [
        confidence,
        entry("out_final_decision_state", "Decision State", "string", undefined, { valueLabels: { "0": "READY", "1": "RECOVERY MODEL REQUIRED", "2": "BLOCK" } }),
      ]),
    ],
  ),

  "scrap-rework-cost-tracker": contract("scrap-rework-cost-tracker", [
    section("Quality Cost", 10, [
      entry("out_demand_metric", "Recorded Scrap Cost", "currency", "currency", { displayDecimals: 2 }),
      entry("out_capacity_metric", "Recorded Rework Cost", "currency", "currency", { displayDecimals: 2 }),
      entry("out_utilization_margin", "Cost per Affected Unit", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_money_at_risk", "Recorded-Period Quality Loss", "currency", "currency", { displayDecimals: 2 }),
    ]),
    section("Defect Position", 20, [
      entry("out_reference_deviation", "Observed Defect Rate", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_derating_factor", "Target Defect Rate", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_expanded_uncertainty", "Projected Monthly Uncertainty", "currency", "currency/month", { displayDecimals: 2 }),
      entry("out_scenario_delta", "Scrap Cost Minus Rework Cost", "currency", "currency", { displayDecimals: 2 }),
    ]),
    section("Evidence and Decision", 30, [confidence, genericDecision]),
  ]),

  "outsource-vs-in-house-analyzer": contract("outsource-vs-in-house-analyzer", [
    section("Make-or-Buy Unit Cost", 10, [
      entry("out_demand_metric", "In-House Unit Cost", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_capacity_metric", "Risk-Adjusted Outsource Unit Cost", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_scenario_delta", "Annual Outsource Savings Delta", "currency", "currency/year", { displayDecimals: 2 }),
    ]),
    section("Decision Boundary", 20, [
      entry("out_utilization_margin", "Capacity Utilization", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      entry("out_expanded_uncertainty", "Unit-Cost Uncertainty Band", "currency", "currency/unit", { displayDecimals: 4 }),
      entry("out_money_at_risk", "Annual Uncertainty Exposure", "currency", "currency/year", { displayDecimals: 2 }),
    ]),
    section("Evidence and Decision", 30, [
      confidence,
      entry("out_final_decision_state", "Decision", "string", undefined, { valueLabels: { "0": "MAKE", "1": "BUY", "2": "REVIEW" } }),
    ]),
  ]),

  "plant-wide-shop-rate-cost-structure-audit": contract(
    "plant-wide-shop-rate-cost-structure-audit",
    [
      section("Cost Rates", 10, [
        entry("out_demand_metric", "Plant-Wide Cost Rate", "hourly_rate", "currency/hour", { displayDecimals: 4 }),
        entry("out_capacity_metric", "Machine-Group Cost Rate", "hourly_rate", "currency/hour", { displayDecimals: 4 }),
        entry("out_reference_deviation", "Current Rate Gap to Pricing Floor", "hourly_rate", "currency/hour", { displayDecimals: 4 }),
        entry("out_utilization_margin", "Realized Utilization", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      ]),
      section("Recovery Exposure", 20, [
        entry("out_money_at_risk", "Annual Under-Recovery", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_expanded_uncertainty", "Annual Cost Uncertainty", "currency", "currency/year", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [confidence, genericDecision]),
    ],
  ),

  "fx-commodity-pass-through-pricer": contract(
    "fx-commodity-pass-through-pricer",
    [
      section("Pass-Through Price", 10, [
        entry("out_demand_metric", "Adjusted Unit Price", "currency", "currency/unit", { displayDecimals: 4 }),
        entry("out_capacity_metric", "Annual Escalation", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_utilization_margin", "Net Pass-Through Ratio", "percentage", "%", { valueMultiplier: 100, displayDecimals: 3 }),
        entry("out_scenario_delta", "Escalation per Unit", "currency", "currency/unit", { displayDecimals: 4 }),
      ]),
      section("Exposure", 20, [
        entry("out_reference_deviation", "FX Change vs Budget", "percentage", "%", { valueMultiplier: 100, displayDecimals: 3 }),
        entry("out_money_at_risk", "Annual Pricing Uncertainty", "currency", "currency/year", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [confidence, genericDecision]),
    ],
  ),

  "energy-efficiency-grant-incentive-feasibility-pack": contract(
    "energy-efficiency-grant-incentive-feasibility-pack",
    [
      section("Life-Cycle Economics", 10, [
        entry("out_demand_metric", "Annual Cash Saving", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_capacity_metric", "Project NPV", "currency", "currency", { displayDecimals: 2 }),
        entry("out_utilization_margin", "Discounted Return Ratio", "ratio", undefined, { displayDecimals: 4 }),
        entry("out_reference_deviation", "Annual Energy Reduction", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
      ]),
      section("Impact and Exposure", 20, [
        entry("out_scenario_delta", "Annual CO₂ Reduction", "number", "tCO₂/year", { displayDecimals: 3 }),
        entry("out_expanded_uncertainty", "NPV Uncertainty", "currency", "currency", { displayDecimals: 2 }),
        entry("out_money_at_risk", "Money at Risk", "currency", "currency", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [confidence, genericDecision]),
    ],
  ),

  "motor-compressor-replacement-roi": contract(
    "motor-compressor-replacement-roi",
    [
      section("Energy and Cash Flow", 10, [
        entry("out_demand_metric", "Current Annual Energy Cost", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_capacity_metric", "Replacement Annual Energy Cost", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_utilization_margin", "Annual Energy and Maintenance Saving", "currency", "currency/year", { displayDecimals: 2 }),
        entry("out_scenario_delta", "Simple Payback", "number", "months", { displayDecimals: 2 }),
      ]),
      section("Investment and Exposure", 20, [
        entry("out_reference_deviation", "Efficiency Improvement", "percentage", "%", { valueMultiplier: 100, displayDecimals: 2 }),
        entry("out_money_at_risk", "Replacement Investment", "currency", "currency", { displayDecimals: 2 }),
        entry("out_expanded_uncertainty", "NPV Uncertainty", "currency", "currency", { displayDecimals: 2 }),
      ]),
      section("Evidence and Decision", 30, [confidence, genericDecision]),
    ],
  ),

  "weld-procedure-cost-consumable-estimation-suite": contract(
    "weld-procedure-cost-consumable-estimation-suite",
    [
      section("Calculated Cost Basis", 10, [
        entry("out_total_cost_floor", "Total Weld Cost", "currency", "currency", { displayDecimals: 2 }),
        entry("out_base_production_cost", "Production Cost Before Shop Overhead", "currency", "currency", { displayDecimals: 2 }),
        entry("out_cost_per_meter", "Cost per Metre", "currency", "currency/m", { displayDecimals: 2 }),
      ]),
      section("Consumable and Labor Breakdown", 20, [
        entry("out_wire_mass_kg", "Required Wire Mass", "number", "kg", { displayDecimals: 3 }),
        entry("out_wire_cost", "Wire Cost", "currency", "currency", { displayDecimals: 2 }),
        entry("out_shielding_gas_cost", "Shielding Gas Cost", "currency", "currency", { displayDecimals: 2 }),
        entry("out_labor_cost", "Labor Cost", "currency", "currency", { displayDecimals: 2 }),
        entry("out_shop_overhead", "Shop Overhead", "currency", "currency", { displayDecimals: 2 }),
        entry("out_consumable_efficiency", "Deposition Efficiency", "percentage", "%", { valueMultiplier: 100, displayDecimals: 1 }),
      ]),
      section("Evidence and Review Boundary", 30, [
        confidence,
        entry("out_expanded_uncertainty", "Cost Uncertainty", "currency", "currency", { displayDecimals: 2 }),
        entry("out_decision_state", "Decision State", "string", undefined, { valueLabels: { "0": "COST BASIS", "1": "BENCHMARK REQUIRED", "2": "BLOCK" }, explanation: "No competitive or margin claim is made without an entered benchmark or selling price." }),
      ]),
    ],
  ),
};

export function getProReportContract(toolSlug: string): ProReportContract | null {
  return proReportContractRegistry[toolSlug] ?? null;
}

export function listProReportContractSlugs(): string[] {
  return Object.keys(proReportContractRegistry).sort();
}
