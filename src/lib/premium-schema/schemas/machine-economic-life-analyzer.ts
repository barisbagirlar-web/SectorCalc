/**
 * Tool #17 — Makine Ekonomik Ömrü
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const MACHINE_ECONOMIC_LIFE_SCHEMA: PremiumCalculatorSchema = {
  id: "machine-economic-life-analyzer", legacyPaidSlug: "machine-economic-life-analyzer",
  name: "Makine Ekonomik Ömrü Analizi", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Makinenin gerçek ekonomik ömrü bilinmezse ya erken yenileme ya da bakım maliyeti yüksek eski makineyle üretim kaybı oluşur.",
  inputs: [
    { id: "purchaseCost", label: "Satın Alma Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 1 }, helper: "", expertMeaning: "Initial purchase cost" },
    { id: "residualValue", label: "Hurda/İkinci El Değeri", type: "number", unit: "USD", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Resale or scrap value" },
    { id: "lifeYears", label: "Fiziksel Ömür (yıl)", type: "number", unit: "yıl", required: true, smartDefault: 10, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Physical life in years" },
    { id: "annualOperatingCost", label: "Yıllık İşletme Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating cost" },
    { id: "discountRate", label: "İskonto Oranı", type: "number", unit: "%", required: true, smartDefault: 12, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV" },
    { id: "annualEnergy", label: "Yıllık Enerji Maliyeti", type: "number", unit: "USD/yıl", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Annual energy cost" },
  ],
  outputs: [
    { id: "euacCapital", label: "EUAC (Sermaye)", unit: "USD/yıl", format: "currency" },
    { id: "euacOperating", label: "EUAC (İşletme)", unit: "USD/yıl", format: "currency" },
    { id: "totalEuac", label: "Toplam EUAC", unit: "USD/yıl", format: "currency" },
    { id: "economicLife", label: "Ekonomik Ömür", unit: "yıl", format: "number" },
  ],
  thresholds: [{ fieldId: "totalEuac", warning: 40000, critical: 75000, direction: "higher_is_bad", warningMessage: "EUAC > $40K — alternatif makineler değerlendirilmeli.", criticalMessage: "EUAC > $75K — makine yenileme planına alınmalı." }],
  formulaPipeline: [
    { formulaId: "cost.machine_euac_capital", inputMap: { purchaseCost: "purchaseCost", purchaseResidualAmt: "residualValue", lifeYears: "lifeYears", discountRate: "discountRate" }, outputId: "euacCapital" },
    { formulaId: "cost.machine_euac_operating", inputMap: { annualOperatingCost: "annualOperatingCost", annualEnergy: "annualEnergy" }, outputId: "euacOperating" },
    { formulaId: "cost.machine_total_euac", inputMap: { euacCapital: "euacCapital", euacOperating: "euacOperating" }, outputId: "totalEuac" },
    { formulaId: "measurement.machine_economic_life", inputMap: { purchaseCost: "purchaseCost", purchaseResidualAmt: "residualValue", annualOperatingCost: "annualOperatingCost", discountRate: "discountRate" }, outputId: "economicLife" },
  ],
  reportTemplate: { title: "Machine Economic Life Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["EUAC = (P−S)×(A/P,i,n) + S×i + AOC.", "Ekonomik ömür = EUAC'nin minimize olduğu yıl.", "İskonto oranı firma WAACC'sine göre belirlenir."] },
};
