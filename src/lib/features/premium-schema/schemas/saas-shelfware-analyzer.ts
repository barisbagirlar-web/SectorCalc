/**
 * Tool - SaaS Shelfware
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SAAS_SHELFWARE_ANALYZER: PremiumCalculatorSchema = {
  id: "saas-shelfware-analyzer", legacyPaidSlug: "saas-shelfware-analyzer",
  name: "SaaS Shelfware Analysis", name_i18n: {"en":"SaaS Shelfware Analysis"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Unused or underused SaaS licenses create a large hidden loss in the budget, with companies wasting up to 30% of annual license costs.", painStatement_i18n: {"en":"Unused or underused SaaS licenses create a large hidden loss in the budget, with companies wasting up to 30% of annual license costs."},
  inputs: [
    { id: "totalLicenses", label: "Total License Count", label_i18n: {"en":"Total License Count"}, type: "number", unit: "units", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Total active licenses", expertMeaning_i18n: {"en":"Total active licenses"} },
    { id: "activeUsers", label: "Active User Count", label_i18n: {"en":"Active User Count"}, type: "number", unit: "units", required: true, smartDefault: 320, validation: { min: 0 }, helper: "", expertMeaning: "Monthly active users", expertMeaning_i18n: {"en":"Monthly active users"} },
    { id: "licenseCostPerSeat", label: "License Cost per Seat", label_i18n: {"en":"License Cost per Seat"}, type: "number", unit: "USD/month", required: true, smartDefault: 25, validation: { min: 0.01 }, helper: "", expertMeaning: "Monthly cost per license", expertMeaning_i18n: {"en":"Monthly cost per license"} },
    { id: "lowUsageThreshold", label: "Low Usage Threshold", label_i18n: {"en":"Low Usage Threshold"}, type: "number", unit: "saat/ay", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Hours per month threshold for low usage", expertMeaning_i18n: {"en":"Hours per month threshold for low usage"} },
    { id: "annualBudget", label: "Annual SaaS Budget", label_i18n: {"en":"Annual SaaS Budget"}, type: "number", unit: "USD/year", required: false, smartDefault: 150000, validation: { min: 1 }, helper: "", expertMeaning: "Total annual SaaS spend", expertMeaning_i18n: {"en":"Total annual SaaS spend"} },
  ],
  outputs: [
    { id: "shelfwarePct", label: "Shelfware Rate", label_i18n: {"en":"Shelfware Rate"}, unit: "%", format: "percentage" },
    { id: "shelfwareCost", label: "Shelfware Cost", label_i18n: {"en":"Shelfware Cost"}, unit: "USD/year", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "shelfwarePct", warning: 20, critical: 40, direction: "higher_is_bad", warningMessage: "Shelfware rate > 20% - license optimization recommended.", warningMessage_i18n: {"en":"Shelfware rate > 20% - license optimization recommended."}, criticalMessage: "Shelfware rate > 40% - urgent license audit and cancellation needed.", criticalMessage_i18n: {"en":"Shelfware rate > 40% - urgent license audit and cancellation needed."} }],
  formulaPipeline: [
    { formulaId: "measurement.saas_shelfware_pct", inputMap: { totalLicenses: "totalLicenses", activeUsers: "activeUsers" }, outputId: "shelfwarePct" },
    { formulaId: "cost.saas_shelfware_cost", inputMap: { totalLicenses: "totalLicenses", activeUsers: "activeUsers", licenseCostPerSeat: "licenseCostPerSeat" ,
        shelfwarePct: "shelfwarePct",
        totalContract: "totalContract"}, outputId: "shelfwareCost" },
  ],
  reportTemplate: { title: "SaaS Shelfware Report", title_i18n: {"en":"SaaS Shelfware Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: [],assumptionNotes_i18n:[{"en":"Shelfware % = (licenses − active) / licenses × 100."},{"en":"Cost = (licenses − active) × seat cost × 12."},{"en":"Users below low usage threshold are considered shelfware."}] },
};
