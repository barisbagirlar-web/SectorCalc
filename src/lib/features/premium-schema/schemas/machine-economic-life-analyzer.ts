
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const MACHINE_ECONOMIC_LIFE_SCHEMA: PremiumCalculatorSchema = {
  id: "machine-economic-life-analyzer", legacyPaidSlug: "machine-economic-life-analyzer",
  name: "Machine Economic Life Analyzer", name_i18n: {"en":"Machine Economic Life Analyzer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "If the actual economic life of the machine is unknown, either early replacement occurs or production loss occurs with the old machine due to high maintenance cost.", painStatement_i18n: {"en":"If the actual economic life of the machine is unknown, either early replacement occurs or production loss occurs with the old machine due to high maintenance cost."},
  inputs: [
    { id: "purchaseCost", label: "Initial purchase cost", label_i18n: {"en":"Initial purchase cost"}, type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 1 }, helper: "", expertMeaning: "Initial purchase cost", expertMeaning_i18n: {"en":"Initial purchase cost"} },
    { id: "residualValue", label: "Resale or scrap value", label_i18n: {"en":"Resale or scrap value"}, type: "number", unit: "USD", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Resale or scrap value", expertMeaning_i18n: {"en":"Resale or scrap value"} },
    { id: "lifeYears", label: "Physical life in years", label_i18n: {"en":"Physical life in years"}, type: "number", unit: "years", required: true, smartDefault: 10, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Physical life in years", expertMeaning_i18n: {"en":"Physical life in years"} },
    { id: "annualOperatingCost", label: "Annual operating cost", label_i18n: {"en":"Annual operating cost"}, type: "number", unit: "USD/year", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating cost", expertMeaning_i18n: {"en":"Annual operating cost"} },
    { id: "discountRate", label: "Discount rate for NPV", label_i18n: {"en":"Discount rate for NPV"}, type: "number", unit: "%", required: true, smartDefault: 12, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV"} },
    { id: "annualEnergy", label: "Annual energy cost", label_i18n: {"en":"Annual energy cost"}, type: "number", unit: "USD/year", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Annual energy cost", expertMeaning_i18n: {"en":"Annual energy cost"} },
  ],
  outputs: [
    { id: "euacCapital", label: "EUAC (Sermaye)", label_i18n: {"en":"EUAC (Sermaye)"}, unit: "USD/year", format: "currency" },
    { id: "euacOperating", label: "EUAC (operation)", label_i18n: {"en":"EUAC (operation)"}, unit: "USD/year", format: "currency" },
    { id: "totalEuac", label: "Total EUAC", label_i18n: {"en":"Total EUAC"}, unit: "USD/year", format: "currency" },
    { id: "economicLife", label: "economical life", label_i18n: {"en":"economical life"}, unit: "years", format: "number" },
  ],
  thresholds: [{ fieldId: "totalEuac", warning: 40000, critical: 75000, direction: "higher_is_bad", warningMessage: "EUAC > $40K — alternative machines should be evaluated.", warningMessage_i18n: {"en":"EUAC > $40K — alternative machines should be evaluated."}, criticalMessage: "EUAC > $75K — machine should be scheduled for replacement.", criticalMessage_i18n: {"en":"EUAC > $75K — machine should be scheduled for replacement."} }],
  formulaPipeline: [
    { formulaId: "cost.machine_euac_capital", inputMap: { purchaseCost: "purchaseCost", discountRate: "discountRate", lifeYears: "lifeYears", residualValue: "residualValue" }, outputId: "euacCapital" },
    { formulaId: "cost.machine_euac_operating", inputMap: { annualOperatingCost: "annualOperatingCost", annualEnergy: "annualEnergy" }, outputId: "euacOperating" },
    { formulaId: "cost.machine_total_euac", inputMap: { euacCapital: "euacCapital", euacOperating: "euacOperating" }, outputId: "totalEuac" },
    { formulaId: "measurement.machine_economic_life", inputMap: { purchaseCost: "purchaseCost", purchaseResidualAmt: "residualValue", annualOperatingCost: "annualOperatingCost", discountRate: "discountRate" ,
        salvageFactor: "salvageFactor",
        holdingCostRate: "holdingCostRate"}, outputId: "economicLife" },
  ],
  reportTemplate: { title: "Machine Economic Life Report", title_i18n: {"en":"Machine Economic Life Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["EUAC = (P−S)×(A/P,i,n) + S×i + AOC.", "Ekonomik omur = EUAC'nin minimize oldugu yil.", "Iskonto orani firma WAACC'sine gore belirlenir."],assumptionNotes_i18n:[{"en":"EUAC = (P−S)×(A/P,i,n) + S×i + AOC."},{"en":"Economic life = the year in which EUAC is minimized."},{"en":"Discount rate is determined according to the firm's WACC."}] },
};
