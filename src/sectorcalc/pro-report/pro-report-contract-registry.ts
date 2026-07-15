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
});

// ---------------------------------------------------------------------------
// 2. machine-hourly-rate-proof-report
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
  // Ported from Baris's reference implementation (verified 8/8 semantic tests before this
  // registry entry existed). "outputs" here are the raw numeric out_* values from calculate(),
  // exactly as ProReportAdapterInput.outputs delivers them -- no re-derivation, no client-side
  // unit math, so these can't drift from what the server actually computed.
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
});

// ---------------------------------------------------------------------------
// 8. job-quote-builder-pro-pack
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
