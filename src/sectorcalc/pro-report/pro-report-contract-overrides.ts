// Domain-correct PRO report contracts that supersede legacy generic mappings.
// Keep corrected contracts isolated until the legacy registry is migrated tool-by-tool.

import type { ProReportContract } from "./pro-report-types";

const BREAK_EVEN_SURVIVAL_CASH_CONTRACT: ProReportContract = {
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
        {
          sourceOutputId: "out_stressed_monthly_revenue",
          businessLabel: "Stressed Monthly Revenue",
          format: "currency",
          unit: "currency/month",
        },
        {
          sourceOutputId: "out_monthly_cash_burn",
          businessLabel: "Monthly Cash Burn Under Stress",
          format: "currency",
          unit: "currency/month",
        },
        {
          sourceOutputId: "out_cash_runway_months",
          businessLabel: "Cash Runway Under Stress",
          format: "number",
          unit: "months",
        },
        {
          sourceOutputId: "out_survival_cash_target",
          businessLabel: "Survival Cash Target",
          format: "currency",
          unit: "currency",
        },
        {
          sourceOutputId: "out_funding_gap",
          businessLabel: "Funding Gap to Target",
          format: "currency",
          unit: "currency",
        },
      ],
    },
    {
      sectionTitle: "Control & Evidence",
      priority: 30,
      entries: [
        {
          sourceOutputId: "out_evidence_completeness",
          businessLabel: "Input Confidence",
          format: "percentage",
          unit: "%",
          valueMultiplier: 100,
        },
        {
          sourceOutputId: "out_uncertainty_cash_buffer",
          businessLabel: "Uncertainty Cash Buffer",
          format: "currency",
          unit: "currency",
        },
        {
          sourceOutputId: "out_threshold_crossing",
          businessLabel: "Target Runway Status",
          format: "string",
          valueLabels: {
            "0": "WITHIN TARGET",
            "1": "BREACHED"
          }
        }
      ]
    }
  ]
};

const OVERRIDES: Record<string, ProReportContract> = {
  [BREAK_EVEN_SURVIVAL_CASH_CONTRACT.toolSlug]: BREAK_EVEN_SURVIVAL_CASH_CONTRACT,
};

export function getProReportContractOverride(toolSlug: string): ProReportContract | null {
  return OVERRIDES[toolSlug] ?? null;
}
