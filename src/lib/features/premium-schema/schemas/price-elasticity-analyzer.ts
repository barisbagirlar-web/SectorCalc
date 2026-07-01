/**
 * Tool #42 — Fiyat Esnekliği
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PRICE_ELASTICITY_SCHEMA: PremiumCalculatorSchema = {
  id: "price-elasticity-analyzer", legacyPaidSlug: "price-elasticity-analyzer",
  name: "Price Elasticity & Optimal Price Analysis", name_i18n: {"en":"Price Elasticity & Optimal Price Analysis"}, sectorSlug: "ecommerce", category: "cost",
  painStatement: "Price changes made without calculating elasticity can negatively impact demand and profitability.", painStatement_i18n: {"en":"Price changes made without calculating elasticity can negatively impact demand and profitability."},
  inputs: [
    { id: "currentPrice", label: "Mevcut Fiyat", label_i18n: {"en":"Current Price"}, type: "number", unit: "USD", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "", expertMeaning: "Current product price", expertMeaning_i18n: {"en":"Current product price"} },
    { id: "currentDemand", label: "Mevcut Talep", label_i18n: {"en":"Current Demand"}, type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Current demand quantity", expertMeaning_i18n: {"en":"Current demand quantity"} },
    { id: "pctPriceChange", label: "Price Change Percentage", label_i18n: {"en":"Price Change Percentage"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: -100, max: 500 }, helper: "", expertMeaning: "Price change percentage", expertMeaning_i18n: {"en":"Price change percentage"} },
    { id: "pctDemandChange", label: "Demand Change Percentage", label_i18n: {"en":"Demand Change Percentage"}, type: "number", unit: "%", required: true, smartDefault: -5, validation: { min: -100, max: 500 }, helper: "", expertMeaning: "Demand change percentage", expertMeaning_i18n: {"en":"Demand change percentage"} },
    { id: "varCost", label: "Variable Cost", label_i18n: {"en":"Variable Cost"}, type: "number", unit: "USD", required: true, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Variable cost per unit", expertMeaning_i18n: {"en":"Variable cost per unit"} },
    { id: "fixedCost", label: "Sabit Maliyet", label_i18n: {"en":"Fixed Cost"}, type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Fixed costs", expertMeaning_i18n: {"en":"Fixed costs"} },
    { id: "cannibRate", label: "Cannibalization Rate", label_i18n: {"en":"Cannibalization Rate"}, type: "number", unit: "%", required: false, smartDefault: 0, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Cannibalization rate", expertMeaning_i18n: {"en":"Cannibalization rate"} },
    { id: "marginOther", label: "Other Product Margin", label_i18n: {"en":"Other Product Margin"}, type: "number", unit: "USD", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Margin of cannibalized product", expertMeaning_i18n: {"en":"Margin of cannibalized product"} },
  ],
  outputs: [
    { id: "elasticity", label: "Price Elasticity", label_i18n: {"en":"Price Elasticity"}, unit: "", format: "number" },
    { id: "optimalMarkup", label: "Optimal Profit Margin", label_i18n: {"en":"Optimal Profit Margin"}, unit: "%", format: "percentage" },
    { id: "newRevenue", label: "Yeni Gelir", label_i18n: {"en":"New Revenue"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "elasticity", warning: -2, critical: -4, direction: "lower_is_bad", warningMessage: "Elasticity < -2 — price increase significantly reduces demand.", warningMessage_i18n: {"en":"Elasticity < -2 — price increase significantly reduces demand."}, criticalMessage: "Elasticity < -4 — price increase causes severe demand loss.", criticalMessage_i18n: {"en":"Elasticity < -4 — price increase causes severe demand loss."} }],
  formulaPipeline: [
    { formulaId: "measurement.price_elasticity", inputMap: { pctDemandChange: "pctDemandChange", pctPriceChange: "pctPriceChange" ,
        pctChangeDem: "pctChangeDem",
        pctChangePrice: "pctChangePrice"}, outputId: "elasticity" },
    { formulaId: "cost.price_optimal_markup", inputMap: { elasticity: "elasticity" }, outputId: "optimalMarkup" },
  ],
  reportTemplate: { title: "Price Elasticity Report", title_i18n: {"en":"Price Elasticity Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Elasticity = %ΔDemand/%ΔPrice.", "Optimal markup = -1/(Elasticity+1).", "New margin = (NewPrice-VarCost)×NewDem-Fixed."],assumptionNotes_i18n:[{"en":"Elasticity = %ΔDemand/%ΔPrice."},{"en":"Optimal markup = -1/(Elasticity+1)."},{"en":"New margin = (NewPrice-VarCost)×NewDem-Fixed."}] },
};
