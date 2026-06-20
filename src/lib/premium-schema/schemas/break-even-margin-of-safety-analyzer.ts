/**
 * Tool #11 — Başabaş Noktası & Güvenlik Marjı
 * BEP_Units → CMR → BEP_Revenue → MoS → OperatingLeverage → TargetProfit
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const BREAK_EVEN_SCHEMA: PremiumCalculatorSchema = {
  id: "break-even-margin-of-safety-analyzer", legacyPaidSlug: "break-even-margin-of-safety-analyzer",
  name: "Başabaş Noktası & Güvenlik Marjı Analizi", sectorSlug: "financial-planning", category: "finance",
  painStatement: "Başabaş noktası bilinmeden yapılan fiyatlama ya marj baskısı ya da satış kaybına yol açar. Bu araç CVP analizi ile başabaş noktası, güvenlik marjı ve faaliyet kaldıracını hesaplar.",
  inputs: [
    { id: "fixedCosts", label: "Sabit Maliyetler", type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "Kira, maaş, sigorta gibi sabit giderler toplamı.", expertMeaning: "Total fixed costs" },
    { id: "unitVariableCost", label: "Birim Değişken Maliyet", type: "number", unit: "USD", required: true, smartDefault: 30, validation: { min: 0.01 }, helper: "Birim başına değişken maliyet (hammadde, işçilik).", expertMeaning: "Variable cost per unit" },
    { id: "unitPrice", label: "Birim Satış Fiyatı", type: "number", unit: "USD", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "Ürün başına satış fiyatı.", expertMeaning: "Selling price per unit" },
    { id: "actualSalesUnits", label: "Güncel Satış Hacmi", type: "number", unit: "adet", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "Mevcut satış adedi.", expertMeaning: "Actual sales volume" },
    { id: "actualRevenue", label: "Güncel Gelir", type: "number", unit: "USD", required: false, smartDefault: 150000, validation: { min: 0 }, helper: "Toplam ciro.", expertMeaning: "Actual revenue" },
    { id: "targetProfit", label: "Hedef Kâr", type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "Ulaşılmak istenen kâr hedefi.", expertMeaning: "Target profit amount" },
    { id: "contributionMarginTotal", label: "Toplam Katkı Marjı", type: "number", unit: "USD", required: false, smartDefault: 60000, validation: { min: 0 }, helper: "(Birim fiyat - BM) × satış adedi.", expertMeaning: "Total contribution margin" },
    { id: "netOpIncome", label: "Net Faaliyet Kârı", type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "Katkı marjı - sabit giderler.", expertMeaning: "Net operating income" },
    { id: "unitCm", label: "Birim Katkı Marjı", type: "number", unit: "USD", required: false, smartDefault: 20, validation: { min: 0 }, helper: "Birim fiyat - birim değişken maliyet.", expertMeaning: "Unit contribution margin" },
  ],
  outputs: [
    { id: "bepUnits", label: "Başabaş Noktası (Birim)", unit: "adet", format: "number" },
    { id: "bepRevenue", label: "Başabaş Noktası (Gelir)", unit: "USD", format: "currency" },
    { id: "cmr", label: "Katkı Marjı Oranı", unit: "%", format: "percentage" },
    { id: "marginOfSafetyPct", label: "Güvenlik Marjı", unit: "%", format: "percentage" },
    { id: "operatingLeverage", label: "Faaliyet Kaldıracı (DOL)", unit: "", format: "number" },
    { id: "targetProfitUnits", label: "Hedef Kâr İçin Gerekli Satış", unit: "adet", format: "number" },
    { id: "bepVerdict", label: "Kârlılık Durumu", unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "marginOfSafetyPct", warning: 20, critical: 10, direction: "lower_is_bad", warningMessage: "Güvenlik marjı < %20 — satış düşüşüne karşı kırılgan.", criticalMessage: "Güvenlik marjı < %10 — satışdaki küçük düşüş zarara sokar." },
  ],
  formulaPipeline: [
    { formulaId: "cost.bep_units", inputMap: { fixedCosts: "fixedCosts", unitPrice: "unitPrice", unitVariableCost: "unitVariableCost" }, outputId: "bepUnits" },
    { formulaId: "cost.cmr", inputMap: { unitPrice: "unitPrice", unitVariableCost: "unitVariableCost" }, outputId: "cmr" },
    { formulaId: "cost.bep_revenue", inputMap: { fixedCosts: "fixedCosts", cmr: "cmr" }, outputId: "bepRevenue" },
    { formulaId: "cost.margin_of_safety_pct", inputMap: { actualSales: "actualSalesUnits", bepUnits: "bepUnits" }, outputId: "marginOfSafetyPct" },
    { formulaId: "cost.operating_leverage", inputMap: { contributionMargin: "contributionMarginTotal", netOperatingIncome: "netOpIncome" }, outputId: "operatingLeverage" },
    { formulaId: "cost.target_profit_units", inputMap: { fixedCosts: "fixedCosts", targetProfit: "targetProfit", unitContributionMargin: "unitCm" }, outputId: "targetProfitUnits" },
  ],
  reportTemplate: { title: "Break-Even & Margin of Safety Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["BEP Units = Fixed Costs / (Price - Variable Cost).", "CMR = (Price - Variable Cost) / Price.", "Margin of Safety = (Actual Sales - BEP) / Actual Sales * 100.", "DOL = Contribution Margin / Net Operating Income.", "Assumes linear cost behavior and single product."] },
};
