import type { ProReportContract } from "./pro-report-types";

const BREAK_EVEN_SURVIVAL_CASH_CONTRACT: ProReportContract = {
  toolSlug: "break-even-survival-cash-calculator",
  strict: true,
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
          displayDecimals: 2,
          explanation:
            "Monthly revenue required to cover fixed cash costs and debt service at the entered contribution margin.",
        },
        {
          sourceOutputId: "out_current_revenue_gap",
          businessLabel: "Current Revenue Gap vs Break-Even",
          format: "currency",
          unit: "currency/month",
          displayDecimals: 2,
          explanation:
            "Positive values are headroom; negative values are the monthly revenue shortfall.",
        },
        {
          sourceOutputId: "out_margin_of_safety_ratio",
          businessLabel: "Revenue Margin of Safety",
          format: "percentage",
          unit: "%",
          valueMultiplier: 100,
          displayDecimals: 2,
          explanation: "Current revenue headroom relative to current monthly revenue.",
        },
      ],
    },
    {
      sectionTitle: "Survival Cash Stress",
      priority: 20,
      entries: [
        {
          sourceOutputId: "out_stressed_monthly_revenue",
          businessLabel: "Stressed Monthly Revenue",
          format: "currency",
          unit: "currency/month",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_monthly_cash_burn",
          businessLabel: "Monthly Cash Burn Under Stress",
          format: "currency",
          unit: "currency/month",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_cash_runway_months",
          businessLabel: "Cash Runway Under Stress",
          format: "number",
          unit: "months",
          displayDecimals: 2,
          explanation: "A displayed value of 120 means at least 120 months.",
        },
        {
          sourceOutputId: "out_survival_cash_target",
          businessLabel: "Survival Cash Target",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_funding_gap",
          businessLabel: "Funding Gap to Target",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
      ],
    },
    {
      sectionTitle: "Control & Evidence",
      priority: 30,
      entries: [
        {
          sourceOutputId: "out_source_confidence_ratio",
          businessLabel: "Source Confidence",
          format: "percentage",
          unit: "%",
          valueMultiplier: 100,
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_uncertainty_cash_buffer",
          businessLabel: "Uncertainty Cash Buffer",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_target_runway_breached",
          businessLabel: "Target Runway Status",
          format: "string",
          valueLabels: {
            "0": "WITHIN TARGET",
            "1": "BREACHED",
          },
        },
        {
          sourceOutputId: "out_decision_code",
          businessLabel: "Decision",
          format: "string",
          valueLabels: {
            "0": "GO",
            "1": "REVIEW",
            "2": "BLOCK",
          },
        },
      ],
    },
  ],
};

const LOSS_MAKING_JOB_CONTRACT: ProReportContract = {
  toolSlug: "loss-making-job-detector",
  strict: true,
  sections: [
    {
      sectionTitle: "Quote Economics",
      priority: 10,
      entries: [
        {
          sourceOutputId: "out_normalized_demand",
          businessLabel: "Quoted Batch Revenue",
          format: "currency",
          unit: "currency/batch",
          displayDecimals: 2,
          explanation:
            "Quoted selling price per unit multiplied by batch quantity.",
        },
        {
          sourceOutputId: "out_demand_metric",
          businessLabel: "Gross Margin per Unit",
          format: "currency",
          unit: "currency/unit",
          displayDecimals: 2,
          explanation:
            "Quoted selling price less material, labor, overhead and defect/loss cost after all amounts are normalized to a per-unit basis.",
        },
        {
          sourceOutputId: "out_utilization_margin",
          businessLabel: "Gross Margin Ratio",
          format: "percentage",
          unit: "%",
          valueMultiplier: 100,
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_capacity_metric",
          businessLabel: "Minimum Price at Target Gross Margin",
          format: "currency",
          unit: "currency/unit",
          displayDecimals: 2,
          explanation:
            "Fully loaded unit cost divided by one minus the target gross-margin ratio.",
        },
      ],
    },
    {
      sectionTitle: "Exposure & Decision",
      priority: 20,
      entries: [
        {
          sourceOutputId: "out_scenario_delta",
          businessLabel: "Gross Margin per Batch",
          format: "currency",
          unit: "currency/batch",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_money_at_risk",
          businessLabel: "Annual Loss Exposure plus Uncertainty",
          format: "currency",
          unit: "currency/year",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_evidence_completeness",
          businessLabel: "Source Confidence",
          format: "percentage",
          unit: "%",
          valueMultiplier: 100,
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_final_decision_state",
          businessLabel: "Job Decision",
          format: "string",
          valueLabels: {
            "0": "PROFITABLE",
            "1": "BELOW TARGET / REVIEW",
            "2": "LOSS-MAKING",
          },
        },
      ],
    },
  ],
};

const OVERRIDES: Readonly<Record<string, ProReportContract>> = {
  [BREAK_EVEN_SURVIVAL_CASH_CONTRACT.toolSlug]: BREAK_EVEN_SURVIVAL_CASH_CONTRACT,
  [LOSS_MAKING_JOB_CONTRACT.toolSlug]: LOSS_MAKING_JOB_CONTRACT,
};

export function getProReportContractOverride(
  toolSlug: string,
): ProReportContract | null {
  return OVERRIDES[toolSlug] ?? null;
}
