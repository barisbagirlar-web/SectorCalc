/**
 * Tool - Dairy Profit Detector
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DAIRY_PROFIT_DETECTOR_ANALYZER: PremiumCalculatorSchema = {
  id: "dairy-profit-detector-analyzer", legacyPaidSlug: "dairy-profit-detector-analyzer",
  name: "Dairy Profit Detector", name_i18n: {"en":"Dairy Profit Detector"}, sectorSlug: "food", category: "cost",
  painStatement: "If the gap between feed cost and milk income is not tracked on dairy farms, profitability silently erodes and the operation incurs losses.", painStatement_i18n: {"en":"If the gap between feed cost and milk income is not tracked on dairy farms, profitability silently erodes and the operation incurs losses."},
  inputs: [
    { id: "milkYieldPerCow", label: "Daily milk yield per cow", label_i18n: {"en":"Daily milk yield per cow"}, type: "number", unit: "kg/gun", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Daily milk yield per cow", expertMeaning_i18n: {"en":"Daily milk yield per cow"} },
    { id: "milkFatPct", label: "Milk fat percentage", label_i18n: {"en":"Milk fat percentage"}, type: "number", unit: "%", required: true, smartDefault: 3.8, validation: { min: 2, max: 7 }, helper: "", expertMeaning: "Milk fat percentage", expertMeaning_i18n: {"en":"Milk fat percentage"} },
    { id: "milkProteinPct", label: "Milk protein percentage", label_i18n: {"en":"Milk protein percentage"}, type: "number", unit: "%", required: true, smartDefault: 3.2, validation: { min: 2, max: 5 }, helper: "", expertMeaning: "Milk protein percentage", expertMeaning_i18n: {"en":"Milk protein percentage"} },
    { id: "milkPrice", label: "Milk price per kg", label_i18n: {"en":"Milk price per kg"}, type: "number", unit: "USD/kg", required: true, smartDefault: 0.45, validation: { min: 0.01 }, helper: "", expertMeaning: "Milk price per kg", expertMeaning_i18n: {"en":"Milk price per kg"} },
    { id: "dailyFeedCostPerCow", label: "Daily feed cost per cow", label_i18n: {"en":"Daily feed cost per cow"}, type: "number", unit: "USD/day", required: true, smartDefault: 6.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Daily feed cost per cow", expertMeaning_i18n: {"en":"Daily feed cost per cow"} },
    { id: "herdSize", label: "Number of milking cows", label_i18n: {"en":"Number of milking cows"}, type: "number", unit: "bas", required: false, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Number of milking cows", expertMeaning_i18n: {"en":"Number of milking cows"} },
    { id: "sccCount", label: "Somatic cell count", label_i18n: {"en":"Somatic cell count"}, type: "number", unit: "hucre/mL", required: false, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Somatic cell count", expertMeaning_i18n: {"en":"Somatic cell count"} },
    { id: "otherCostsPerCow", label: "Other daily costs per cow", label_i18n: {"en":"Other daily costs per cow"}, type: "number", unit: "USD/day", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Other daily costs per cow", expertMeaning_i18n: {"en":"Other daily costs per cow"} },
  ],
  outputs: [
    { id: "fcmMilk", label: "Corrected Milk Yield (FCM)", label_i18n: {"en":"Corrected Milk Yield (FCM)"}, unit: "kg/gun", format: "number" },
    { id: "dairyIncomeOverFeed", label: "Income Over Feed Cost (IOFC)", label_i18n: {"en":"Income Over Feed Cost (IOFC)"}, unit: "USD/day", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "dairyIncomeOverFeed", warning: 3, critical: 1.5, direction: "lower_is_bad", warningMessage: "Feed Over Income <$3/cow/day - profitability is contracting.", warningMessage_i18n: {"en":"Feed Over Income <$3/cow/day - profitability is contracting."}, criticalMessage: "Feed Over Income <$1.5/cow/day - operation loss risk is high.", criticalMessage_i18n: {"en":"Feed Over Income <$1.5/cow/day - operation loss risk is high."} }],
  formulaPipeline: [
    { formulaId: "measurement.fcm_milk", inputMap: {
        milkYield: "milkYieldPerCow",
        fatYield: "milkFatPct",
        milkProteinPct: "milkProteinPct"
      }, outputId: "fcmMilk" },
    { formulaId: "cost.dairy_income_over_feed", inputMap: {
        milkPrice: "milkPrice",
        milkYield: "fcmMilk",
        totalFeedCost: "dailyFeedCostPerCow",
        herdSize: "herdSize",
        otherCostsPerCow: "otherCostsPerCow"
      }, outputId: "dairyIncomeOverFeed" },
  ],
  reportTemplate: { title: "Milk Profit Detector Report", title_i18n: {"en":"Milk Profit Detector Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: [],assumptionNotes_i18n:[{"en":"FCM = yield × (0.4324 + 0.1625 × fat% + 0.0345 × protein%)."},{"en":"IOFC = (FCM × milk price) − (feed cost + other costs)."},{"en":"SCC >400K cells/mL leads to quality premium loss."},{"en":"NRC 2001 feed standards are used as the basis."}] },
};
