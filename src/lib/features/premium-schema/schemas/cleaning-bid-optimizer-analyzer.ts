
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CLEANING_BID_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "cleaning-bid-optimizer-analyzer", legacyPaidSlug: "cleaning-bid-optimizer-analyzer",
  name: "Cleaning Bid Optimizer", name_i18n: {"en":"Cleaning Bid Optimizer"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "If labor, materials, and profit margin are not clearly separated in cleaning service quotes, pricing becomes inaccurate.", painStatement_i18n: {"en":"If labor, materials, and profit margin are not clearly separated in cleaning service quotes, pricing becomes inaccurate."},
  inputs: [
    { id: "totalSquareMeters", label: "Total Metrekare", label_i18n: {"en":"Total Metrekare"}, type: "number", unit: "m²", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Total cleaning area in sqm", expertMeaning_i18n: {"en":"Total cleaning area in sqm"} },
    { id: "cleaningFrequency", label: "Cleaning frequency", label_i18n: {"en":"Cleaning frequency"}, type: "select", unit: "scalar", required: true, smartDefault: "weekly", validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Cleaning frequency", expertMeaning_i18n: {"en":"Cleaning frequency"}, enumValues: ["daily", "weekly", "biweekly", "monthly"] },
    { id: "laborRate", label: "Hourly labor rate", label_i18n: {"en":"Hourly labor rate"}, type: "number", unit: "USD/hour", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Hourly labor rate", expertMeaning_i18n: {"en":"Hourly labor rate"} },
    { id: "hoursPerVisit", label: "Hours per cleaning visit", label_i18n: {"en":"Hours per cleaning visit"}, type: "number", unit: "hours", required: true, smartDefault: 4, validation: { min: 0.5 }, helper: "", expertMeaning: "Hours per cleaning visit", expertMeaning_i18n: {"en":"Hours per cleaning visit"} },
    { id: "materialCostPerVisit", label: "Material cost per cleaning visit", label_i18n: {"en":"Material cost per cleaning visit"}, type: "number", unit: "USD", required: true, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Material cost per cleaning visit", expertMeaning_i18n: {"en":"Material cost per cleaning visit"} },
    { id: "desiredMargin", label: "Target profit margin", label_i18n: {"en":"Target profit margin"}, type: "number", unit: "%", required: false, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target profit margin", expertMeaning_i18n: {"en":"Target profit margin"} },
    { id: "competitorBid", label: "Rakip Teklifi", label_i18n: {"en":"Rakip Teklifi"}, type: "number", unit: "USD/month", required: false, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Competitor monthly bid", expertMeaning_i18n: {"en":"Competitor monthly bid"} },
  ],
  outputs: [
    { id: "cleaningLaborCost", label: "Labor Cost", label_i18n: {"en":"Labor Cost"}, unit: "USD/month", format: "currency" },
    { id: "cleaningBidPrice", label: "Onerilen quote Fiyat", label_i18n: {"en":"Onerilen quote Fiyat"}, unit: "USD/month", format: "currency" },
  ],
  thresholds: [{ fieldId: "cleaningBidPrice", warning: 0, critical: 0, direction: "higher_is_bad", warningMessage: "quote > competitor — competitiveness may decline.", warningMessage_i18n: {"en":"quote > competitor — competitiveness may decline."}, criticalMessage: "quote below cost — Loss risk present.", criticalMessage_i18n: {"en":"quote below cost — Loss risk present."} }],
  formulaPipeline: [
    { formulaId: "cost.cleaning_labor_cost", inputMap: {
        cleaningHours: "laborRate",
        cleaningRate: "hoursPerVisit",
        cleaningFrequency: "cleaningFrequency"
      }, outputId: "cleaningLaborCost" },
    { formulaId: "cost.cleaning_bid_price", inputMap: {
        cleaningLaborCost: "cleaningLaborCost",
        cleaningMaterialCost: "materialCostPerVisit",
        cleaningOverhead: "desiredMargin"
      ,
        cleaningMargin: "cleaningMargin"}, outputId: "cleaningBidPrice" },
  ],
  reportTemplate: { title: "Cleaning Bid Optimization Report", title_i18n: {"en":"Cleaning Bid Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 25, assumptionNotes: ["Labor cost = Rate × Hours × Visits/month.", "Bid price = (Labor + Material) / (1 − Margin%).", "Competitor benchmark adjusts strategy."],assumptionNotes_i18n:[{"en":"Labor cost = Rate × Hours × Visits/month."},{"en":"Bid price = (Labor + Material) / (1 − Margin%)."},{"en":"Competitor benchmark adjusts strategy."}] },
};
