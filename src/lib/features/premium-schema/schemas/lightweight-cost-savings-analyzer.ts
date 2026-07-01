/**
 * Tool #49 — Hafiflik Maliyet Tasarrufu
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const LIGHTWEIGHT_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "lightweight-cost-savings-analyzer", legacyPaidSlug: "lightweight-cost-savings-analyzer",
  name: "Lightweight Cost Savings Analyzer", name_i18n: {"en":"Lightweight Cost Savings Analyzer"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Parça hafifletmenin yakıt, payload ve malzeme primi etkisini hesaplamadan yapılan malzeme değişikliği beklenen tasarrufu sağlamayabilir.", painStatement_i18n: {"en":"Parts hafifletmenin Fuel, payload ve material primi etkisini hesaplamadan yapılan material change Expected tasarrufu sağlamayabilir."},
  inputs: [
    { id: "originalMass", label: "Original part mass", label_i18n: {"en":"Original part mass"}, type: "number", unit: "kg", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Original part mass", expertMeaning_i18n: {"en":"Original part mass"} },
    { id: "lightweightMass", label: "Lightweight part mass", label_i18n: {"en":"Lightweight part mass"}, type: "number", unit: "kg", required: true, smartDefault: 35, validation: { min: 0.1 }, helper: "", expertMeaning: "Lightweight part mass", expertMeaning_i18n: {"en":"Lightweight part mass"} },
    { id: "fuelFactor", label: "Fuel savings per kg per km", label_i18n: {"en":"Fuel savings per kg per km"}, type: "number", unit: "L/kg/km", required: false, smartDefault: 0.0005, validation: { min: 0 }, helper: "", expertMeaning: "Fuel savings per kg per km", expertMeaning_i18n: {"en":"Fuel savings per kg per km"} },
    { id: "annualDistance", label: "Annual driving distance", label_i18n: {"en":"Annual driving distance"}, type: "number", unit: "km", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Annual driving distance", expertMeaning_i18n: {"en":"Annual driving distance"} },
    { id: "fuelPrice", label: "Fuel price per liter", label_i18n: {"en":"Fuel price per liter"}, type: "number", unit: "USD/L", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Fuel price per liter", expertMeaning_i18n: {"en":"Fuel price per liter"} },
    { id: "revenuePerKg", label: "Revenue per kg payload", label_i18n: {"en":"Revenue per kg payload"}, type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Revenue per kg payload", expertMeaning_i18n: {"en":"Revenue per kg payload"} },
    { id: "materialPremium", label: "Total material premium", label_i18n: {"en":"Total material premium"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total material premium", expertMeaning_i18n: {"en":"Total material premium"} },
    { id: "productLife", label: "Ürün Ömrü", label_i18n: {"en":"Product life in years"}, type: "number", unit: "yıl", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Product life in years", expertMeaning_i18n: {"en":"Product life in years"} },
    { id: "toolDelta", label: "Tooling cost delta", label_i18n: {"en":"Tooling cost delta"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Tooling cost delta", expertMeaning_i18n: {"en":"Tooling cost delta"} },
  ],
  outputs: [
    { id: "weightReduction", label: "Agrlk Azaltma", label_i18n: {"en":"Weight Azaltma"}, unit: "kg", format: "number" },
    { id: "fuelSavings", label: "Yakt Tasarrufu (Yllk)", label_i18n: {"en":"Fuel Tasarrufu (Annual)"}, unit: "USD/yıl", format: "currency" },
    { id: "payloadGain", label: "Payload Gelir Arts", label_i18n: {"en":"Payload Income Arts"}, unit: "USD/yıl", format: "currency" },
    { id: "netSavings", label: "Net Tasarruf (Ömür Boyu)", label_i18n: {"en":"Net Tasarruf (life Boyu)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "netSavings", warning: 5000, critical: 0, direction: "lower_is_bad", warningMessage: "Net tasarruf < $5000 — hafifletme yatırımı sorgulanmalı.", warningMessage_i18n: {"en":"Net tasarruf < $5000 — hafifletme yatırımı sorgulanmalı."}, criticalMessage: "Net tasarruf ≤ $0 — hafifletme ekonomik değil.", criticalMessage_i18n: {"en":"Net tasarruf ≤ $0 — hafifletme economical değil."} }],
  formulaPipeline: [
    { formulaId: "measurement.lightweight_weight_red", inputMap: { originalMass: "originalMass", lightweightMass: "lightweightMass" ,
        massOrig: "massOrig",
        massLw: "massLw"}, outputId: "weightReduction" },
    { formulaId: "cost.lightweight_fuel_savings", inputMap: { weightReduction: "weightReduction", fuelFactor: "fuelFactor", annualDistance: "annualDistance", fuelPrice: "fuelPrice" ,
        weightRed: "weightRed",
        distance: "distance"}, outputId: "fuelSavings" },
    { formulaId: "cost.lightweight_payload_gain", inputMap: { weightReduction: "weightReduction", revenuePerKg: "revenuePerKg" ,
        weightRed: "weightRed",
        revPerKg: "revPerKg"}, outputId: "payloadGain" },
    { formulaId: "cost.lightweight_net_savings", inputMap: { fuelSavings: "fuelSavings", payloadGain: "payloadGain", productLife: "productLife", materialPremium: "materialPremium", toolDelta: "toolDelta" ,
        fuelSav: "fuelSav",
        life: "life",
        matPrem: "matPrem"}, outputId: "netSavings" },
  ],
  reportTemplate: { title: "Lightweight Cost Savings Report", title_i18n: {"en":"Lightweight Cost Savings Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["WeightRed = Mass_Orig - Mass_LW.", "FuelSavings = WtRed×Factor×Dist×Price.", "Net = (Fuel+Payload)×Life - MatPrem - ToolDelta."],assumptionNotes_i18n:[{"en":"WeightRed = Mass_Orig - Mass_LW."},{"en":"FuelSavings = WtRed×Factor×Dist×Price."},{"en":"Net = (Fuel+Payload)×Life - MatPrem - ToolDelta."}] },
};
