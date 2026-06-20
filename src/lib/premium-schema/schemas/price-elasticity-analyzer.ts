/**
 * Tool #42 — Fiyat Esnekliği
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PRICE_ELASTICITY_SCHEMA: PremiumCalculatorSchema = {
  id: "price-elasticity-analyzer", legacyPaidSlug: "price-elasticity-analyzer",
  name: "Fiyat Esnekliği & Optimal Fiyat Analizi", sectorSlug: "ecommerce", category: "cost",
  painStatement: "Fiyat esnekliği hesaplanmadan yapılan fiyat değişiklikleri talebi ve kârlılığı olumsuz etkileyebilir.",
  inputs: [
    { id: "currentPrice", label: "Mevcut Fiyat", type: "number", unit: "USD", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "", expertMeaning: "Current product price" },
    { id: "currentDemand", label: "Mevcut Talep", type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Current demand quantity" },
    { id: "pctPriceChange", label: "Fiyat Değişim Yüzdesi", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: -100, max: 500 }, helper: "", expertMeaning: "Price change percentage" },
    { id: "pctDemandChange", label: "Talep Değişim Yüzdesi", type: "number", unit: "%", required: true, smartDefault: -5, validation: { min: -100, max: 500 }, helper: "", expertMeaning: "Demand change percentage" },
    { id: "varCost", label: "Değişken Maliyet", type: "number", unit: "USD", required: true, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Variable cost per unit" },
    { id: "fixedCost", label: "Sabit Maliyet", type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Fixed costs" },
    { id: "cannibRate", label: "Kanibalizasyon Oranı", type: "number", unit: "%", required: false, smartDefault: 0, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Cannibalization rate" },
    { id: "marginOther", label: "Diğer Ürün Marjı", type: "number", unit: "USD", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Margin of cannibalized product" },
  ],
  outputs: [
    { id: "elasticity", label: "Fiyat Esnekliği", unit: "", format: "number" },
    { id: "optimalMarkup", label: "Optimal Kar Marjı", unit: "%", format: "percentage" },
    { id: "newRevenue", label: "Yeni Gelir", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "elasticity", warning: -2, critical: -4, direction: "lower_is_bad", warningMessage: "Esneklik < -2 — fiyat artışı talebi çok düşürüyor.", criticalMessage: "Esneklik < -4 — fiyat artışı ciddi talep kaybına yol açıyor." }],
  formulaPipeline: [
    { formulaId: "measurement.price_elasticity", inputMap: { pctDemandChange: "pctDemandChange", pctPriceChange: "pctPriceChange" }, outputId: "elasticity" },
    { formulaId: "cost.price_optimal_markup", inputMap: { elasticity: "elasticity" }, outputId: "optimalMarkup" },
  ],
  reportTemplate: { title: "Price Elasticity Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Elasticity = %ΔDemand/%ΔPrice.", "Optimal markup = -1/(Elasticity+1).", "New margin = (NewPrice-VarCost)×NewDem-Fixed."] },
};
