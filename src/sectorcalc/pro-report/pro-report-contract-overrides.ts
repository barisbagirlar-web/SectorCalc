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
            "Monthly revenue required to cover payroll, other fixed operating cost, debt obligations, and variable cash cost.",
        },
        {
          sourceOutputId: "out_monthly_revenue_gap_to_break_even",
          businessLabel: "Monthly Revenue Gap vs Break-Even",
          format: "currency",
          unit: "currency/month",
          displayDecimals: 2,
          explanation:
            "Positive values are monthly headroom; negative values are the current revenue shortfall.",
        },
        {
          sourceOutputId: "out_contribution_margin_ratio",
          businessLabel: "Cash Contribution Margin",
          format: "percentage",
          unit: "%",
          valueMultiplier: 100,
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_monthly_fixed_cash_cost",
          businessLabel: "Monthly Fixed Cash Cost",
          format: "currency",
          unit: "currency/month",
          displayDecimals: 2,
        },
      ],
    },
    {
      sectionTitle: "Cash Forecast",
      priority: 20,
      entries: [
        {
          sourceOutputId: "out_monthly_net_cash_flow",
          businessLabel: "Base Monthly Net Cash Flow",
          format: "currency",
          unit: "currency/month",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_base_ending_cash",
          businessLabel: "Base Forecast Ending Cash",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_stressed_monthly_revenue",
          businessLabel: "Stressed Monthly Revenue",
          format: "currency",
          unit: "currency/month",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_stressed_monthly_net_cash_flow",
          businessLabel: "Stressed Monthly Net Cash Flow",
          format: "currency",
          unit: "currency/month",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_stressed_ending_cash",
          businessLabel: "Stressed Forecast Ending Cash",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
      ],
    },
    {
      sectionTitle: "Survival & Funding",
      priority: 30,
      entries: [
        {
          sourceOutputId: "out_stressed_runway_within_horizon_months",
          businessLabel: "Stressed Runway Within Forecast Horizon",
          format: "number",
          unit: "months",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_required_opening_cash_for_stress_horizon",
          businessLabel: "Required Opening Cash for Stress Horizon",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_additional_funding_required",
          businessLabel: "Additional Funding Required",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_stressed_cash_lower_bound",
          businessLabel: "Stressed Cash Lower Bound",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_stressed_cash_upper_bound",
          businessLabel: "Stressed Cash Upper Bound",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_money_at_risk",
          businessLabel: "Cash at Risk Below Reserve",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
      ],
    },
    {
      sectionTitle: "Control & Evidence",
      priority: 40,
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
          sourceOutputId: "out_cash_uncertainty",
          businessLabel: "Forecast Cash Uncertainty",
          format: "currency",
          unit: "currency",
          displayDecimals: 2,
        },
        {
          sourceOutputId: "out_primary_cash_cost_driver",
          businessLabel: "Primary Monthly Cash Cost Driver",
          format: "string",
          valueLabels: {
            "0": "Payroll",
            "1": "Other fixed operating cost",
            "2": "Debt and fixed obligations",
            "3": "Stressed variable cash cost",
          },
        },
        {
          sourceOutputId: "out_decision_state",
          businessLabel: "Cash Survival Decision",
          format: "string",
          valueLabels: {
            "0": "PASS",
            "1": "REVIEW",
            "2": "HOLD",
          },
        },
      ],
    },
  ],
};

const OVERRIDES: Readonly<Record<string, ProReportContract>> = Object.freeze({
  [BREAK_EVEN_SURVIVAL_CASH_CONTRACT.toolSlug]: BREAK_EVEN_SURVIVAL_CASH_CONTRACT,
});

export function getProReportContractOverride(
  toolSlug: string,
): ProReportContract | null {
  return OVERRIDES[toolSlug] ?? null;
}
