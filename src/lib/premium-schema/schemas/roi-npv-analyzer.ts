/**
 * Tool #40 — YG ve NBD Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ROI_NPV_SCHEMA: PremiumCalculatorSchema = {
  id: "roi-npv-analyzer", legacyPaidSlug: "roi-npv-analyzer",
  name: "YG ve NBD (ROI-NPV) Analizi", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Yatırım kararlarında ROI, NPV, IRR ve geri ödeme süresi birlikte değerlendirilmezse eksik analiz nedeniyle yanlış karar verilir. Her bir metrik farklı bir risk boyutunu ortaya koyar.",
  inputs: [
    { id: "initialInvestment", label: "Başlangıç Yatırımı", type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Initial capital investment" },
    { id: "annualCashflow", label: "Yıllık Nakit Akışı", type: "number", unit: "USD/yıl", required: true, smartDefault: 30000, validation: { min: 1 }, helper: "", expertMeaning: "Annual net cash flow" },
    { id: "projectLifeYears", label: "Proje Ömrü", type: "number", unit: "yıl", required: true, smartDefault: 5, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Project life in years" },
    { id: "discountRate", label: "İskonto Oranı", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0.1, max: 50 }, helper: "", expertMeaning: "Discount rate for NPV" },
    { id: "operatingCostAnnual", label: "Yıllık İşletme Maliyeti", type: "number", unit: "USD/yıl", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating costs" },
    { id: "residualValue", label: "Hurda / Kalıntı Değeri", type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Salvage value at end of life" },
    { id: "revenueAnnual", label: "Yıllık Gelir", type: "number", unit: "USD/yıl", required: false, smartDefault: 45000, validation: { min: 0 }, helper: "", expertMeaning: "Annual revenue from investment" },
  ],
  outputs: [
    { id: "roiInvestment", label: "Yatırım Getirisi (ROI)", unit: "%", format: "percentage" },
    { id: "npvInvestment", label: "Net Bugünkü Değer (NPV)", unit: "USD", format: "currency", isBigNumber: true },
    { id: "irrInvestment", label: "İç Verim Oranı (IRR)", unit: "%", format: "percentage" },
    { id: "paybackPeriodInv", label: "Geri Ödeme Süresi", unit: "yıl", format: "number" },
    { id: "profitabilityIndex", label: "Kârlılık Endeksi (PI)", unit: "puan", format: "number" },
  ],
  thresholds: [
    { fieldId: "npvInvestment", warning: 0, critical: -20000, direction: "lower_is_bad", warningMessage: "NPV negatif — yatırım değer yaratmıyor.", criticalMessage: "NPV < -$20K — yatırım kesinlikle yapılmamalı." },
    { fieldId: "irrInvestment", warning: 10, critical: 5, direction: "lower_is_bad", warningMessage: "IRR < %10 — iskonto oranının altında, riskli yatırım.", criticalMessage: "IRR < %5 — alternatif yatırımlar daha iyi getiri sağlar." },
    { fieldId: "paybackPeriodInv", warning: 3, critical: 5, direction: "higher_is_bad", warningMessage: "Geri ödeme > 3 yıl — nakit akışı dikkatle izlenmeli.", criticalMessage: "Geri ödeme > 5 yıl — yatırımın likidite riski yüksek." },
  ],
  formulaPipeline: [
    { formulaId: "cost.roi_investment", inputMap: { initialInvestment: "initialInvestment", annualCashflow: "annualCashflow", projectLifeYears: "projectLifeYears", operatingCostAnnual: "operatingCostAnnual" }, outputId: "roiInvestment" },
    { formulaId: "cost.npv_investment", inputMap: { initialInvestment: "initialInvestment", annualCashflow: "annualCashflow", discountRate: "discountRate", projectLifeYears: "projectLifeYears", purchaseResidualAmt: "residualValue", operatingCostAnnual: "operatingCostAnnual" }, outputId: "npvInvestment" },
    { formulaId: "cost.irr_investment", inputMap: { initialInvestment: "initialInvestment", annualCashflow: "annualCashflow", projectLifeYears: "projectLifeYears", operatingCostAnnual: "operatingCostAnnual" }, outputId: "irrInvestment" },
    { formulaId: "cost.payback_period_inv", inputMap: { initialInvestment: "initialInvestment", annualCashflow: "annualCashflow", operatingCostAnnual: "operatingCostAnnual" }, outputId: "paybackPeriodInv" },
    { formulaId: "cost.profitability_index", inputMap: { npvInvestment: "npvInvestment", initialInvestment: "initialInvestment" }, outputId: "profitabilityIndex" },
  ],
  reportTemplate: { title: "YG ve NBD Analiz Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "sensitivity", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["NPV = Σ (nakit akışı / (1+r)^t) - yatırım.", "IRR, NPV'yi sıfırlayan iskonto oranıdır.", "ROI = (toplam net kâr / yatırım) × 100.", "Geri ödeme süresi nakit akışlarının kümülatif toplamına dayanır."] },
};
