/**
 * Tool #40 — YG ve NBD Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ROI_NPV_SCHEMA: PremiumCalculatorSchema = {
  id: "roi-npv-analyzer", legacyPaidSlug: "roi-npv-analyzer",
  name: "YG ve NBD (ROI-NPV) Analizi", name_i18n: {"en":"ROI and NPV Analysis"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "When investment decisions don't jointly evaluate ROI, NPV, IRR, and payback period, incomplete analysis leads to wrong decisions. Each metric reveals a different risk dimension.", painStatement_i18n: {"en":"When investment decisions don't jointly evaluate ROI, NPV, IRR, and payback period, incomplete analysis leads to wrong decisions. Each metric reveals a different risk dimension."},
  inputs: [
    { id: "initialInvestment", label: "Initial Investment", label_i18n: {"en":"Initial Investment"}, type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Initial capital investment", expertMeaning_i18n: {"en":"Initial capital investment"} },
    { id: "annualCashflow", label: "Annual Cash Flow", label_i18n: {"en":"Annual Cash Flow"}, type: "number", unit: "USD/yil", required: true, smartDefault: 30000, validation: { min: 1 }, helper: "", expertMeaning: "Annual net cash flow", expertMeaning_i18n: {"en":"Annual Net cash flow"} },
    { id: "projectLifeYears", label: "Proje Omru", label_i18n: {"en":"Project Life"}, type: "number", unit: "yil", required: true, smartDefault: 5, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Project life in years", expertMeaning_i18n: {"en":"Project life in years"} },
    { id: "discountRate", label: "Discount Rate", label_i18n: {"en":"Discount Rate"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0.1, max: 50 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV"} },
    { id: "operatingCostAnnual", label: "Annual Operating Cost", label_i18n: {"en":"Annual Operating Cost"}, type: "number", unit: "USD/yil", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating costs", expertMeaning_i18n: {"en":"Annual operating costs"} },
    { id: "residualValue", label: "Salvage / Residual Value", label_i18n: {"en":"Salvage / Residual Value"}, type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Salvage value at end of life", expertMeaning_i18n: {"en":"Salvage value at end of life"} },
    { id: "revenueAnnual", label: "Annual Revenue", label_i18n: {"en":"Annual Revenue"}, type: "number", unit: "USD/yil", required: false, smartDefault: 45000, validation: { min: 0 }, helper: "", expertMeaning: "Annual revenue from investment", expertMeaning_i18n: {"en":"Annual revenue from investment"} },
  ],
  outputs: [
    { id: "roiInvestment", label: "Return on Investment (ROI)", label_i18n: {"en":"Return pre Investment (ROI)"}, unit: "%", format: "percentage" },
    { id: "npvInvestment", label: "Net Present Value (NPV)", label_i18n: {"en":"Net Present Value (NPV)"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "irrInvestment", label: "Internal Rate of Return (IRR)", label_i18n: {"en":"Internal Rate of Return (IRR)"}, unit: "%", format: "percentage" },
    { id: "paybackPeriodInv", label: "Geri Odeme Suresi", label_i18n: {"en":"Payback Period"}, unit: "yil", format: "number" },
    { id: "profitabilityIndex", label: "Profitability Index (PI)", label_i18n: {"en":"Profitability Index (PI)"}, unit: "puan", format: "number" },
  ],
  thresholds: [
    { fieldId: "npvInvestment", warning: 0, critical: -20000, direction: "lower_is_bad", warningMessage: "NPV is negative — investment is not creating value.", warningMessage_i18n: {"en":"NPV is negative — investment is not creating value."}, criticalMessage: "NPV < -$20K — investment should definitely not be made.", criticalMessage_i18n: {"en":"NPV < -$20K — investment should definitely not be made."} },
    { fieldId: "irrInvestment", warning: 10, critical: 5, direction: "lower_is_bad", warningMessage: "IRR < 10% — below discount rate, risky investment.", warningMessage_i18n: {"en":"IRR < 10% — below discount rate, risky investment."}, criticalMessage: "IRR < 5% — alternative investments offer better returns.", criticalMessage_i18n: {"en":"IRR < 5% — alternative investments offer better returns."} },
    { fieldId: "paybackPeriodInv", warning: 3, critical: 5, direction: "higher_is_bad", warningMessage: "Payback > 3 years — cash flow should be monitored closely.", warningMessage_i18n: {"en":"Payback > 3 years — cash flow should be monitored closely."}, criticalMessage: "Payback > 5 years — investment has high liquidity risk.", criticalMessage_i18n: {"en":"Payback > 5 years — investment has high liquidity risk."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.roi_investment", inputMap: {
        initialInvestment: "initialInvestment",
        netProfit: "annualCashflow",
        projectLifeYears: "projectLifeYears",
        operatingCostAnnual: "operatingCostAnnual"
      }, outputId: "roiInvestment" },
    { formulaId: "cost.npv_investment", inputMap: {
        initialInvestment: "initialInvestment",
        annualCashFlowNpv: "annualCashflow",
        discountRateNpv: "discountRate",
        lifeYearsNpv: "projectLifeYears",
        purchaseResidualAmt: "residualValue",
        operatingCostAnnual: "operatingCostAnnual"
      }, outputId: "npvInvestment" },
    { formulaId: "cost.irr_investment", inputMap: {
        initialInvestment: "initialInvestment",
        annualCashFlowNpv: "annualCashflow",
        projectLifeYears: "projectLifeYears",
        operatingCostAnnual: "operatingCostAnnual"
      }, outputId: "irrInvestment" },
    { formulaId: "cost.payback_period_inv", inputMap: {
        initialInvestment: "initialInvestment",
        annualCashFlowNpv: "annualCashflow",
        operatingCostAnnual: "operatingCostAnnual"
      }, outputId: "paybackPeriodInv" },
    { formulaId: "cost.profitability_index", inputMap: {
        discountRate: "npvInvestment",
        initialInv: "initialInvestment"
      ,
        cashFlows: "cashFlows"}, outputId: "profitabilityIndex" },
  ],
  reportTemplate: { title: "YG ve NBD Analiz Raporu", title_i18n: {"en":"ROI and NPV Analysis Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "sensitivity", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["NPV = Σ (cash flow / (1+r)^t) - investment.", "IRR is the discount rate that makes NPV zero.", "ROI = (total net profit / investment) × 100.", "Payback period is based on cumulative cash flows."],assumptionNotes_i18n:[{"en":"NPV = Σ (cash flow / (1+r)^t) - investment."},{"en":"IRR is the discount rate that makes NPV zero."},{"en":"ROI = (total net profit / investment) × 100."},{"en":"Payback period is based on cumulative cash flows."}] },
};
