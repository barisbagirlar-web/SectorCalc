/**
 * Tool #39 — Yenilenebilir Enerji IRR
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const RENEWABLE_ENERGY_IRR_SCHEMA: PremiumCalculatorSchema = {
  id: "renewable-energy-irr-analyzer", legacyPaidSlug: "renewable-energy-irr-analyzer",
  name: "Yenilenebilir Enerji IRR Analizi", sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Yenilenebilir enerji yatırımlarında IRR, NPV ve LCOE hesaplanmazsa yatırımın gerçek getirisi ve fizibilitesi bilinemez. Yanlış kararlar büyük sermaye kaybına yol açar.",
  inputs: [
    { id: "installationCost", label: "Kurulum Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1000 }, helper: "", expertMeaning: "Total installation cost" },
    { id: "annualGeneration", label: "Yıllık Enerji Üretimi", type: "number", unit: "kWh/yıl", required: true, smartDefault: 800000, validation: { min: 1 }, helper: "", expertMeaning: "Annual energy generation" },
    { id: "tariffRate", label: "Enerji Satış Fiyatı", type: "number", unit: "USD/kWh", required: true, smartDefault: 0.10, validation: { min: 0.01 }, helper: "", expertMeaning: "Feed-in tariff or PPA rate" },
    { id: "operatingCost", label: "Yıllık İşletme Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Annual O&M cost" },
    { id: "projectLife", label: "Proje Ömrü", type: "number", unit: "yıl", required: true, smartDefault: 25, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Project economic life" },
    { id: "discountRate", label: "İskonto Oranı", type: "number", unit: "%", required: false, smartDefault: 8, validation: { min: 1, max: 30 }, helper: "", expertMeaning: "Discount rate for NPV" },
    { id: "degradationRate", label: "Yıllık Verim Düşüşü", type: "number", unit: "%", required: false, smartDefault: 0.5, validation: { min: 0, max: 5 }, helper: "", expertMeaning: "Annual degradation rate" },
    { id: "incentiveAmount", label: "Teşvik / Sübvansiyon", type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Government incentive amount" },
  ],
  outputs: [
    { id: "renewableAnnualGen", label: "Net Yıllık Üretim (Degradasyon Sonrası)", unit: "kWh/yıl", format: "number" },
    { id: "renewableNpv", label: "Net Bugünkü Değer (NPV)", unit: "USD", format: "currency", isBigNumber: true },
    { id: "renewableLcoe", label: "Seviyelendirilmiş Enerji Maliyeti (LCOE)", unit: "USD/kWh", format: "currency" },
    { id: "renewableIrr", label: "İç Verim Oranı (IRR)", unit: "%", format: "percentage" },
    { id: "paybackPeriod", label: "Geri Ödeme Süresi", unit: "yıl", format: "number" },
  ],
  thresholds: [
    { fieldId: "renewableNpv", warning: 0, critical: -50000, direction: "lower_is_bad", warningMessage: "NPV pozitif değil — yatırım fizibilitesi zayıf.", criticalMessage: "NPV < -$50K — yatırım yapılmamalı, alternatifler değerlendirilmeli." },
    { fieldId: "renewableLcoe", warning: 0.12, critical: 0.20, direction: "higher_is_bad", warningMessage: "LCOE > $0.12/kWh — şebeke paritesi riski var.", criticalMessage: "LCOE > $0.20/kWh — proje ekonomik olarak sürdürülemez." },
    { fieldId: "renewableIrr", warning: 8, critical: 5, direction: "lower_is_bad", warningMessage: "IRR < %8 — iskonto oranının altında getiri.", criticalMessage: "IRR < %5 — alternatif yatırımlar daha cazip." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.renewable_annual_gen", inputMap: { annualGeneration: "annualGeneration", degradationRate: "degradationRate" }, outputId: "renewableAnnualGen" },
    { formulaId: "cost.renewable_npv", inputMap: { annualGeneration: "annualGeneration", tariffRate: "tariffRate", operatingCost: "operatingCost", discountRate: "discountRate", projectLife: "projectLife", installationCost: "installationCost", incentiveAmount: "incentiveAmount", degradationRate: "degradationRate" }, outputId: "renewableNpv" },
    { formulaId: "cost.renewable_lcoe", inputMap: { installationCost: "installationCost", operatingCost: "operatingCost", annualGeneration: "annualGeneration", discountRate: "discountRate", projectLife: "projectLife", degradationRate: "degradationRate" }, outputId: "renewableLcoe" },
    { formulaId: "cost.renewable_irr", inputMap: { installationCost: "installationCost", annualGeneration: "annualGeneration", tariffRate: "tariffRate", operatingCost: "operatingCost", projectLife: "projectLife", degradationRate: "degradationRate", incentiveAmount: "incentiveAmount" }, outputId: "renewableIrr" },
    { formulaId: "measurement.renewable_payback", inputMap: { installationCost: "installationCost", annualGeneration: "annualGeneration", tariffRate: "tariffRate", operatingCost: "operatingCost", incentiveAmount: "incentiveAmount" }, outputId: "paybackPeriod" },
  ],
  reportTemplate: { title: "Yenilenebilir Enerji IRR Analiz Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "sensitivity", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["LCOE = (CAPEX + PV OPEX) / PV üretim.", "IRR, NPV'yi sıfır yapan iskonto oranıdır.", "Degradasyon yıllık üretimi doğrusal azaltır.", "Teşvik miktarı peşin alınmış varsayılır."] },
};
