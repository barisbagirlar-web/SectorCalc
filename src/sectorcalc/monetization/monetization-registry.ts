// SectorCalc V5.3.1 — Metadata-Only Monetization Registry
// No function values. No Stripe price IDs. No exact formula expressions.

import type { MonetizationConfig } from "./monetization-types";

export const B2B_MONETIZATION_REGISTRY: Record<string, MonetizationConfig> = {
  "overall-equipment-effectiveness": {
    toolKey: "overall-equipment-effectiveness",
    freeOutputKey: "oee_percentage",
    painMetricKey: "estimated_monthly_downtime_loss",
    painMetricKind: "MONTHLY_DOWNTIME_LOSS",
    impactModelId: "OEE_GAP_TO_MONTHLY_LOSS_V1",
    premiumUnlockType: "MACHINE_LEVEL_BREAKDOWN",
    ctaLabel: "Unlock machine-level loss breakdown",
    ctaSubtext: "See downtime, availability, performance, quality, and PDF proof pack.",
    priceLookupKey: "sectorcalc_pro_monthly",
    safetyLabel: "ESTIMATED_DECISION_SUPPORT_ONLY",
    publicMethodologySummary:
      "Estimates financial exposure of the OEE gap using user-entered production time and cost context.",
    requiredCommercialInputs: ["shift_hours", "machine_hourly_rate"],
  },

  "smed-setup-time": {
    toolKey: "smed-setup-time",
    freeOutputKey: "setup_time_minutes",
    painMetricKey: "estimated_annual_setup_cost",
    painMetricKind: "ANNUAL_SETUP_COST",
    impactModelId: "SETUP_TIME_TO_ANNUAL_COST_V1",
    premiumUnlockType: "COST_DRIVER_BREAKDOWN",
    ctaLabel: "Unlock setup-loss breakdown",
    ctaSubtext:
      "See batch-level setup cost, lost capacity, scenario comparison, and PDF export.",
    priceLookupKey: "sectorcalc_pro_monthly",
    safetyLabel: "ESTIMATED_DECISION_SUPPORT_ONLY",
    publicMethodologySummary:
      "Estimates annual setup cost from user-entered setup time, batch frequency, operating days, and machine-hour rate.",
    requiredCommercialInputs: [
      "daily_batches",
      "operating_days_per_year",
      "machine_hourly_rate",
    ],
  },

  "cbam-risk-auditor": {
    toolKey: "cbam-risk-auditor",
    freeOutputKey: "embedded_emissions_tco2e",
    painMetricKey: "estimated_carbon_cost_exposure",
    painMetricKind: "CARBON_COST_EXPOSURE",
    impactModelId: "CARBON_EXPOSURE_SCREENING_V1",
    premiumUnlockType: "PDF_PROOF_PACK",
    ctaLabel: "Unlock carbon exposure proof pack",
    ctaSubtext:
      "Generate a review-ready source-evidence summary and exportable calculation record.",
    priceLookupKey: "sectorcalc_pro_monthly",
    safetyLabel: "ESTIMATED_DECISION_SUPPORT_ONLY",
    publicMethodologySummary:
      "Estimates carbon cost exposure using emissions quantity and a user-verified carbon price assumption.",
    requiredCommercialInputs: ["assumed_carbon_price_eur"],
  },
};
