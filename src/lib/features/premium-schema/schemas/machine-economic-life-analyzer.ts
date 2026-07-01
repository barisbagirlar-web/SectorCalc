/**
 * Tool #17 — Makine Ekonomik Ömrü
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const MACHINE_ECONOMIC_LIFE_SCHEMA: PremiumCalculatorSchema = {
  id: "machine-economic-life-analyzer", legacyPaidSlug: "machine-economic-life-analyzer",
  name: "Makine Ekonomik Ömrü Analizi", name_i18n: {"en":"Machine Economic Life Analyzer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Makinenin gerçek ekonomik ömrü bilinmezse ya erken yenileme ya da bakım maliyeti yüksek eski makineyle üretim kaybı oluşur.", painStatement_i18n: {"en":"Makinenin Actual economical ömrü if unknown ya erken replacement ya da bakım Cost high eski makineyle Production Loss oluşur."},
  inputs: [
    { id: "purchaseCost", label: "Initial purchase cost", label_i18n: {"en":"Initial purchase cost"}, type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 1 }, helper: "", expertMeaning: "Initial purchase cost", expertMeaning_i18n: {"en":"Initial purchase cost"} },
    { id: "residualValue", label: "Resale or scrap value", label_i18n: {"en":"Resale or scrap value"}, type: "number", unit: "USD", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Resale or scrap value", expertMeaning_i18n: {"en":"Resale or scrap value"} },
    { id: "lifeYears", label: "Physical life in years", label_i18n: {"en":"Physical life in years"}, type: "number", unit: "yıl", required: true, smartDefault: 10, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Physical life in years", expertMeaning_i18n: {"en":"Physical life in years"} },
    { id: "annualOperatingCost", label: "Annual operating cost", label_i18n: {"en":"Annual operating cost"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating cost", expertMeaning_i18n: {"en":"Annual operating cost"} },
    { id: "discountRate", label: "Discount rate for NPV", label_i18n: {"en":"Discount rate for NPV"}, type: "number", unit: "%", required: true, smartDefault: 12, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV"} },
    { id: "annualEnergy", label: "Annual energy cost", label_i18n: {"en":"Annual energy cost"}, type: "number", unit: "USD/yıl", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Annual energy cost", expertMeaning_i18n: {"en":"Annual energy cost"} },
  ],
  outputs: [
    { id: "euacCapital", label: "EUAC (Sermaye)", label_i18n: {"en":"EUAC (Sermaye)"}, unit: "USD/yıl", format: "currency" },
    { id: "euacOperating", label: "EUAC (Isletme)", label_i18n: {"en":"EUAC (operation)"}, unit: "USD/yıl", format: "currency" },
    { id: "totalEuac", label: "Toplam EUAC", label_i18n: {"en":"Total EUAC"}, unit: "USD/yıl", format: "currency" },
    { id: "economicLife", label: "Ekonomik Ömür", label_i18n: {"en":"economical life"}, unit: "yıl", format: "number" },
  ],
  thresholds: [{ fieldId: "totalEuac", warning: 40000, critical: 75000, direction: "higher_is_bad", warningMessage: "EUAC > $40K — alternatif makineler değerlendirilmeli.", warningMessage_i18n: {"en":"EUAC > $40K — alternatif makineler değerlendirilmeli."}, criticalMessage: "EUAC > $75K — makine yenileme planına alınmalı.", criticalMessage_i18n: {"en":"EUAC > $75K — makine replacement planına alınmalı."} }],
  formulaPipeline: [
    { formulaId: "cost.machine_euac_capital", inputMap: {
        purchaseCost: "purchaseCost",
        discountRate: "discountRate",
        lifeYears: "lifeYears",
        interestRate: "residualValue"
      ,
        purchasePrice: "purchasePrice"}, outputId: "euacCapital" },
    { formulaId: "cost.machine_euac_operating", inputMap: { annualOperatingCost: "annualOperatingCost", annualEnergy: "annualEnergy" ,
        annualOperating: "annualOperating",
        annualMaintenance: "annualMaintenance"}, outputId: "euacOperating" },
    { formulaId: "cost.machine_total_euac", inputMap: { euacCapital: "euacCapital", euacOperating: "euacOperating" }, outputId: "totalEuac" },
    { formulaId: "measurement.machine_economic_life", inputMap: { purchaseCost: "purchaseCost", purchaseResidualAmt: "residualValue", annualOperatingCost: "annualOperatingCost", discountRate: "discountRate" ,
        salvageFactor: "salvageFactor",
        holdingCostRate: "holdingCostRate"}, outputId: "economicLife" },
  ],
  reportTemplate: { title: "Machine Economic Life Report", title_i18n: {"en":"Machine Economic Life Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["EUAC = (P−S)×(A/P,i,n) + S×i + AOC.", "Ekonomik ömür = EUAC'nin minimize olduğu yıl.", "İskonto oranı firma WAACC'sine göre belirlenir."],assumptionNotes_i18n:[{"en":"EUAC = (P−S)×(A/P,i,n) + S×i + AOC."},{"en":"Ekonomik ömür = EUAC'nin minimize olduğu yıl."},{"en":"İskonto oranı firma WAACC'sine göre belirlenir."}] },
};
