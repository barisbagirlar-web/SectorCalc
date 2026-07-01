/**
 * Tool #11 — Başabaş Noktası & Güvenlik Marjı
 * BEP_Units → CMR → BEP_Revenue → MoS → OperatingLeverage → TargetProfit
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const BREAK_EVEN_SCHEMA: PremiumCalculatorSchema = {
  id: "break-even-margin-of-safety-analyzer", legacyPaidSlug: "break-even-margin-of-safety-analyzer",
  name: "Break-Even & Margin of Safety Analysis", name_i18n: {"en":"Break-Even & Margin of Safety Analysis"}, sectorSlug: "financial-planning", category: "finance",
  painStatement: "Pricing without knowing the break-even point causes either margin pressure or lost sales. This tool calculates break-even, margin of safety, and operating leverage via CVP analysis.", painStatement_i18n: {"en":"Pricing without knowing the break-even point causes either margin pressure or lost sales. This tool calculates break-even, margin of safety, and operating leverage via CVP analysis."},
  inputs: [
    { id: "fixedCosts", label: "Sabit Maliyetler", label_i18n: {"en":"Fixed Costs"}, type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "Kira, maaş, sigorta gibi sabit giderler toplamı.", helper_i18n: {"en":"Total fixed expenses such as rent, salary, insurance."}, expertMeaning: "Total fixed costs", expertMeaning_i18n: {"en":"Total fixed costs"} },
    { id: "unitVariableCost", label: "Unit Variable Cost", label_i18n: {"en":"Unit Variable Cost"}, type: "number", unit: "USD", required: true, smartDefault: 30, validation: { min: 0.01 }, helper: "Birim başına değişken maliyet (hammadde, işçilik).", helper_i18n: {"en":"Variable cost per unit (raw material, labor)."}, expertMeaning: "Variable cost per unit", expertMeaning_i18n: {"en":"Variable cost per unit"} },
    { id: "unitPrice", label: "Unit Selling Price", label_i18n: {"en":"Unit Selling Price"}, type: "number", unit: "USD", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "Ürün başına satış fiyatı.", helper_i18n: {"en":"Selling price per product."}, expertMeaning: "Selling price per unit", expertMeaning_i18n: {"en":"Selling price per unit"} },
    { id: "actualSalesUnits", label: "Current Sales Volume", label_i18n: {"en":"Current Sales Volume"}, type: "number", unit: "adet", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "Mevcut satış adedi.", helper_i18n: {"en":"Current sales quantity."}, expertMeaning: "Actual sales volume", expertMeaning_i18n: {"en":"Actual sales volume"} },
    { id: "actualRevenue", label: "Güncel Gelir", label_i18n: {"en":"Current Revenue"}, type: "number", unit: "USD", required: false, smartDefault: 150000, validation: { min: 0 }, helper: "Toplam ciro.", helper_i18n: {"en":"Total revenue."}, expertMeaning: "Actual revenue", expertMeaning_i18n: {"en":"Actual revenue"} },
    { id: "targetProfit", label: "Hedef Kâr", label_i18n: {"en":"Target Profit"}, type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "Ulaşılmak istenen kâr hedefi.", helper_i18n: {"en":"Target profit to be achieved."}, expertMeaning: "Target profit amount", expertMeaning_i18n: {"en":"Target profit amount"} },
    { id: "contributionMarginTotal", label: "Total Contribution Margin", label_i18n: {"en":"Total Contribution Margin"}, type: "number", unit: "USD", required: false, smartDefault: 60000, validation: { min: 0 }, helper: "(Birim fiyat - BM) × satış adedi.", helper_i18n: {"en":"(Unit price - BM) × sales quantity."}, expertMeaning: "Total contribution margin", expertMeaning_i18n: {"en":"Total contribution margin"} },
    { id: "netOpIncome", label: "Net Operating Income", label_i18n: {"en":"Net Operating Income"}, type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "Katkı marjı - sabit giderler.", helper_i18n: {"en":"Contribution margin - fixed expenses."}, expertMeaning: "Net operating income", expertMeaning_i18n: {"en":"Net operating income"} },
    { id: "unitCm", label: "Unit Contribution Margin", label_i18n: {"en":"Unit Contribution Margin"}, type: "number", unit: "USD", required: false, smartDefault: 20, validation: { min: 0 }, helper: "Birim fiyat - birim değişken maliyet.", helper_i18n: {"en":"Unit price - unit variable cost."}, expertMeaning: "Unit contribution margin", expertMeaning_i18n: {"en":"Unit contribution margin"} },
  ],
  outputs: [
    { id: "bepUnits", label: "Break-Even Point (Units)", label_i18n: {"en":"Break-Even Point (Units)"}, unit: "adet", format: "number" },
    { id: "bepRevenue", label: "Break-Even Point (Revenue)", label_i18n: {"en":"Break-Even Point (Revenue)"}, unit: "USD", format: "currency" },
    { id: "cmr", label: "Contribution Margin Ratio", label_i18n: {"en":"Contribution Margin Ratio"}, unit: "%", format: "percentage" },
    { id: "marginOfSafetyPct", label: "Guvenlik Marj", label_i18n: {"en":"Guvenlik Margin"}, unit: "%", format: "percentage" },
    { id: "operatingLeverage", label: "Faaliyet Kaldrac (DOL)", label_i18n: {"en":"activity Kaldrac (DOL)"}, unit: "", format: "number" },
    { id: "targetProfitUnits", label: "Hedef Kar Icin Gerekli Sats", label_i18n: {"en":"Hedef profit Icin required Sats"}, unit: "adet", format: "number" },
    { id: "bepVerdict", label: "Karllk Durumu", label_i18n: {"en":"Karllk Durumu"}, unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "marginOfSafetyPct", warning: 20, critical: 10, direction: "lower_is_bad", warningMessage: "Margin of safety < 20% — vulnerable to sales decline.", warningMessage_i18n: {"en":"Margin of safety < 20% — vulnerable to sales decline."}, criticalMessage: "Margin of safety < 10% — small sales decline causes loss.", criticalMessage_i18n: {"en":"Margin of safety < 10% — small sales decline causes loss."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.bep_units", inputMap: { fixedCosts: "fixedCosts", unitPrice: "unitPrice", unitVariableCost: "unitVariableCost" }, outputId: "bepUnits" },
    { formulaId: "cost.cmr", inputMap: { unitPrice: "unitPrice", unitVariableCost: "unitVariableCost" }, outputId: "cmr" },
    { formulaId: "cost.bep_revenue", inputMap: { fixedCosts: "fixedCosts", cmr: "cmr" }, outputId: "bepRevenue" },
    { formulaId: "cost.margin_of_safety_pct", inputMap: { actualSales: "actualSalesUnits", bepUnits: "bepUnits" }, outputId: "marginOfSafetyPct" },
    { formulaId: "cost.operating_leverage", inputMap: { contributionMargin: "contributionMarginTotal", netOperatingIncome: "netOpIncome" }, outputId: "operatingLeverage" },
    { formulaId: "cost.target_profit_units", inputMap: { fixedCosts: "fixedCosts", targetProfit: "targetProfit", unitContributionMargin: "unitCm" }, outputId: "targetProfitUnits" },
  ],
  reportTemplate: { title: "Break-Even & Margin of Safety Report", title_i18n: {"en":"Break-Even & Margin of Safety Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["BEP Units = Fixed Costs / (Price - Variable Cost).", "CMR = (Price - Variable Cost) / Price.", "Margin of Safety = (Actual Sales - BEP) / Actual Sales * 100.", "DOL = Contribution Margin / Net Operating Income.", "Assumes linear cost behavior and single product."],assumptionNotes_i18n:[{"en":"BEP Units = Fixed Costs / (Price - Variable Cost)."},{"en":"CMR = (Price - Variable Cost) / Price."},{"en":"Margin of Safety = (Actual Sales - BEP) / Actual Sales * 100."},{"en":"DOL = Contribution Margin / Net Operating Income."},{"en":"Assumes linear cost behavior and single product."}]},
};
