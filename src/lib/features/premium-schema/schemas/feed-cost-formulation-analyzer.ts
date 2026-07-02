
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FEED_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "feed-cost-formulation-analyzer", legacyPaidSlug: "feed-cost-formulation-analyzer",
  name: "Feed Cost Formulation & FCR Analyzer", name_i18n: {"en":"Feed Cost Formulation & FCR Analyzer"}, sectorSlug: "food", category: "cost",
  painStatement: "If raw material cost, processing, and FCR are not analyzed in feed formulation, cost per kg live weight cannot be controlled.", painStatement_i18n: {"en":"If raw material cost, processing, and FCR are not analyzed in feed formulation, cost per kg live weight cannot be controlled."},
  inputs: [
    { id: "inclusionRates", label: "Ingredient inclusion rates", label_i18n: {"en":"Ingredient inclusion rates"}, type: "number", unit: "%", array: true, required: true, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Ingredient inclusion rates", expertMeaning_i18n: {"en":"Ingredient inclusion rates"} },
    { id: "prices", label: "Ingredient prices", label_i18n: {"en":"Ingredient prices"}, type: "number", unit: "USD/ton", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Ingredient prices", expertMeaning_i18n: {"en":"Ingredient prices"} },
    { id: "grindCost", label: "Grinding cost per ton", label_i18n: {"en":"Grinding cost per ton"}, type: "number", unit: "USD/ton", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Grinding cost per ton", expertMeaning_i18n: {"en":"Grinding cost per ton"} },
    { id: "mixCost", label: "Mixing cost per ton", label_i18n: {"en":"Mixing cost per ton"}, type: "number", unit: "USD/ton", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Mixing cost per ton", expertMeaning_i18n: {"en":"Mixing cost per ton"} },
    { id: "pelletCost", label: "Pelet Cost", label_i18n: {"en":"Pelet Cost"}, type: "number", unit: "USD/ton", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Pelletizing cost", expertMeaning_i18n: {"en":"Pelletizing cost"} },
    { id: "shrinkRate", label: "Shrinkage rate", label_i18n: {"en":"Shrinkage rate"}, type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0, max: 10 }, helper: "", expertMeaning: "Shrinkage rate", expertMeaning_i18n: {"en":"Shrinkage rate"} },
    { id: "feedConsumed", label: "Total feed consumed", label_i18n: {"en":"Total feed consumed"}, type: "number", unit: "kg", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total feed consumed", expertMeaning_i18n: {"en":"Total feed consumed"} },
    { id: "weightGain", label: "Live weight gain", label_i18n: {"en":"Live weight gain"}, type: "number", unit: "kg", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Live weight gain", expertMeaning_i18n: {"en":"Live weight gain"} },
  ],
  outputs: [
    { id: "baseCost", label: "Base Feed Cost", label_i18n: {"en":"Base Feed Cost"}, unit: "USD/ton", format: "currency" },
    { id: "fcr", label: "FCR (Feed Donusum Rate)", label_i18n: {"en":"FCR (Feed Donusum Rate)"}, unit: "scalar", format: "number" },
    { id: "costPerKgGain", label: "kg Gain Cost", label_i18n: {"en":"kg Gain Cost"}, unit: "USD/kg", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "fcr", warning: 2.5, critical: 3.0, direction: "higher_is_bad", warningMessage: "FCR > 2.5 - feed efficiency is low.", warningMessage_i18n: {"en":"FCR > 2.5 - feed efficiency is low."}, criticalMessage: "FCR > 3.0 - rasyon optimizasyonu acil.", criticalMessage_i18n: {"en":"FCR > 3.0 - rasyon optimizasyonu acil."} }],
  formulaPipeline: [
    { formulaId: "cost.feed_base_cost", inputMap: { inclRates: "inclusionRates", prices: "prices" }, outputId: "baseCost" },
    { formulaId: "measurement.feed_fcr", inputMap: {
        weightGain: "weightGain",
        feedCons: "feedConsumed"
      }, outputId: "fcr" },
    { formulaId: "cost.feed_cost_per_kg", inputMap: {
        baseCost: "baseCost",
        shrinkRate: "shrinkRate",
        fcr: "fcr",
        procCost: "grindCost",
        addCost: "mixCost",
        pelletCost: "pelletCost"
      }, outputId: "costPerKgGain" },
  ],
  reportTemplate: { title: "Feed Cost Formulation Report", title_i18n: {"en":"Feed Cost Formulation Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Base = Σ(Inclusion%×Price/100).", "FCR = FeedConsumed/WeightGain.", "Cost/kg = (Base+Proc+Add+Shrink)×FCR/1000."],assumptionNotes_i18n:[{"en":"Base = Σ(Inclusion%×Price/100)."},{"en":"FCR = FeedConsumed/WeightGain."},{"en":"Cost/kg = (Base+Proc+Add+Shrink)×FCR/1000."}] },
};
