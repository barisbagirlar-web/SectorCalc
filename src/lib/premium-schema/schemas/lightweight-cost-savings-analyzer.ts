/**
 * Tool #49 — Hafiflik Maliyet Tasarrufu
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const LIGHTWEIGHT_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "lightweight-cost-savings-analyzer", legacyPaidSlug: "lightweight-cost-savings-analyzer",
  name: "Hafifletme Maliyet Tasarrufu Analizi", sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Parça hafifletmenin yakıt, payload ve malzeme primi etkisini hesaplamadan yapılan malzeme değişikliği beklenen tasarrufu sağlamayabilir.",
  inputs: [
    { id: "originalMass", label: "Orijinal Ağırlık", type: "number", unit: "kg", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Original part mass" },
    { id: "lightweightMass", label: "Hafif Ağırlık", type: "number", unit: "kg", required: true, smartDefault: 35, validation: { min: 0.1 }, helper: "", expertMeaning: "Lightweight part mass" },
    { id: "fuelFactor", label: "Yakıt Tasarruf Faktörü", type: "number", unit: "L/kg/km", required: false, smartDefault: 0.0005, validation: { min: 0 }, helper: "", expertMeaning: "Fuel savings per kg per km" },
    { id: "annualDistance", label: "Yıllık Mesafe", type: "number", unit: "km", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Annual driving distance" },
    { id: "fuelPrice", label: "Yakıt Fiyatı", type: "number", unit: "USD/L", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Fuel price per liter" },
    { id: "revenuePerKg", label: "kg Başına Gelir (Payload)", type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Revenue per kg payload" },
    { id: "materialPremium", label: "Malzeme Prim Farkı (Toplam)", type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total material premium" },
    { id: "productLife", label: "Ürün Ömrü", type: "number", unit: "yıl", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Product life in years" },
    { id: "toolDelta", label: "Kalıp/Alet Farkı", type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Tooling cost delta" },
  ],
  outputs: [
    { id: "weightReduction", label: "Ağırlık Azaltma", unit: "kg", format: "number" },
    { id: "fuelSavings", label: "Yakıt Tasarrufu (Yıllık)", unit: "USD/yıl", format: "currency" },
    { id: "payloadGain", label: "Payload Gelir Artışı", unit: "USD/yıl", format: "currency" },
    { id: "netSavings", label: "Net Tasarruf (Ömür Boyu)", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "netSavings", warning: 5000, critical: 0, direction: "lower_is_bad", warningMessage: "Net tasarruf < $5000 — hafifletme yatırımı sorgulanmalı.", criticalMessage: "Net tasarruf ≤ $0 — hafifletme ekonomik değil." }],
  formulaPipeline: [
    { formulaId: "measurement.lightweight_weight_red", inputMap: { originalMass: "originalMass", lightweightMass: "lightweightMass" }, outputId: "weightReduction" },
    { formulaId: "cost.lightweight_fuel_savings", inputMap: { weightReduction: "weightReduction", fuelFactor: "fuelFactor", annualDistance: "annualDistance", fuelPrice: "fuelPrice" }, outputId: "fuelSavings" },
    { formulaId: "cost.lightweight_payload_gain", inputMap: { weightReduction: "weightReduction", revenuePerKg: "revenuePerKg" }, outputId: "payloadGain" },
    { formulaId: "cost.lightweight_net_savings", inputMap: { fuelSavings: "fuelSavings", payloadGain: "payloadGain", productLife: "productLife", materialPremium: "materialPremium", toolDelta: "toolDelta" }, outputId: "netSavings" },
  ],
  reportTemplate: { title: "Lightweight Cost Savings Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["WeightRed = Mass_Orig - Mass_LW.", "FuelSavings = WtRed×Factor×Dist×Price.", "Net = (Fuel+Payload)×Life - MatPrem - ToolDelta."] },
};
