/**
 * Tool #49 — Hafiflik Maliyet Tasarrufu
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const LIGHTWEIGHT_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "lightweight-cost-savings-analyzer", legacyPaidSlug: "lightweight-cost-savings-analyzer",
  name: "Hafifletme Maliyet Tasarrufu Analizi", name_i18n: {"en":"Hafifletme Maliyet Tasarrufu Analizi","tr":"Hafifletme Maliyet Tasarrufu Analizi"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Parça hafifletmenin yakıt, payload ve malzeme primi etkisini hesaplamadan yapılan malzeme değişikliği beklenen tasarrufu sağlamayabilir.", painStatement_i18n: {"en":"Parça hafifletmenin yakıt, payload ve malzeme primi etkisini hesaplamadan yapılan malzeme değişikliği beklenen tasarrufu sağlamayabilir.","tr":"Parça hafifletmenin yakıt, payload ve malzeme primi etkisini hesaplamadan yapılan malzeme değişikliği beklenen tasarrufu sağlamayabilir."},
  inputs: [
    { id: "originalMass", label: "Orijinal Ağırlık", label_i18n: {"en":"Original part mass","tr":"Orijinal Ağırlık"}, type: "number", unit: "kg", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Original part mass", expertMeaning_i18n: {"en":"Original part mass","tr":"orijinal ağırlık"} },
    { id: "lightweightMass", label: "Hafif Ağırlık", label_i18n: {"en":"Lightweight part mass","tr":"Hafif Ağırlık"}, type: "number", unit: "kg", required: true, smartDefault: 35, validation: { min: 0.1 }, helper: "", expertMeaning: "Lightweight part mass", expertMeaning_i18n: {"en":"Lightweight part mass","tr":"hafif ağırlık"} },
    { id: "fuelFactor", label: "Yakıt Tasarruf Faktörü", label_i18n: {"en":"Fuel savings per kg per km","tr":"Yakıt Tasarruf Faktörü"}, type: "number", unit: "L/kg/km", required: false, smartDefault: 0.0005, validation: { min: 0 }, helper: "", expertMeaning: "Fuel savings per kg per km", expertMeaning_i18n: {"en":"Fuel savings per kg per km","tr":"yakıt tasarruf faktörü"} },
    { id: "annualDistance", label: "Yıllık Mesafe", label_i18n: {"en":"Annual driving distance","tr":"Yıllık Mesafe"}, type: "number", unit: "km", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Annual driving distance", expertMeaning_i18n: {"en":"Annual driving distance","tr":"yıllık mesafe"} },
    { id: "fuelPrice", label: "Yakıt Fiyatı", label_i18n: {"en":"Fuel price per liter","tr":"Yakıt Fiyatı"}, type: "number", unit: "USD/L", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Fuel price per liter", expertMeaning_i18n: {"en":"Fuel price per liter","tr":"yakıt fiyatı"} },
    { id: "revenuePerKg", label: "kg Başına Gelir (Payload)", label_i18n: {"en":"Revenue per kg payload","tr":"kg Başına Gelir (Payload)"}, type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Revenue per kg payload", expertMeaning_i18n: {"en":"Revenue per kg payload","tr":"kg başına gelir (payload)"} },
    { id: "materialPremium", label: "Malzeme Prim Farkı (Toplam)", label_i18n: {"en":"Total material premium","tr":"Malzeme Prim Farkı (Toplam)"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total material premium", expertMeaning_i18n: {"en":"Total material premium","tr":"malzeme prim farkı (toplam)"} },
    { id: "productLife", label: "Ürün Ömrü", label_i18n: {"en":"Product life in years","tr":"Ürün Ömrü"}, type: "number", unit: "yıl", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Product life in years", expertMeaning_i18n: {"en":"Product life in years","tr":"ürün ömrü"} },
    { id: "toolDelta", label: "Kalıp/Alet Farkı", label_i18n: {"en":"Tooling cost delta","tr":"Kalıp/Alet Farkı"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Tooling cost delta", expertMeaning_i18n: {"en":"Tooling cost delta","tr":"kalıp/alet farkı"} },
  ],
  outputs: [
    { id: "weightReduction", label: "Ağırlık Azaltma", label_i18n: {"en":"Agrlk Azaltma","tr":"Ağırlık Azaltma"}, unit: "kg", format: "number" },
    { id: "fuelSavings", label: "Yakıt Tasarrufu (Yıllık)", label_i18n: {"en":"Yakt Tasarrufu (Yllk)","tr":"Yakıt Tasarrufu (Yıllık)"}, unit: "USD/yıl", format: "currency" },
    { id: "payloadGain", label: "Payload Gelir Artışı", label_i18n: {"en":"Payload Gelir Arts","tr":"Payload Gelir Artışı"}, unit: "USD/yıl", format: "currency" },
    { id: "netSavings", label: "Net Tasarruf (Ömür Boyu)", label_i18n: {"en":"Net Tasarruf (Omur Boyu)","tr":"Net Tasarruf (Ömür Boyu)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "netSavings", warning: 5000, critical: 0, direction: "lower_is_bad", warningMessage: "Net tasarruf < $5000 — hafifletme yatırımı sorgulanmalı.", warningMessage_i18n: {"en":"Net tasarruf < $5000 — hafifletme yatırımı sorgulanmalı.","tr":"Net tasarruf < $5000 — hafifletme yatırımı sorgulanmalı."}, criticalMessage: "Net tasarruf ≤ $0 — hafifletme ekonomik değil.", criticalMessage_i18n: {"en":"Net tasarruf ≤ $0 — hafifletme ekonomik değil.","tr":"Net tasarruf ≤ $0 — hafifletme ekonomik değil."} }],
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
  reportTemplate: { title: "Lightweight Cost Savings Report", title_i18n: {"en":"Lightweight Cost Savings Report","tr":"Lightweight Cost Savings Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["WeightRed = Mass_Orig - Mass_LW.", "FuelSavings = WtRed×Factor×Dist×Price.", "Net = (Fuel+Payload)×Life - MatPrem - ToolDelta."],assumptionNotes_i18n:[{"en":"WeightRed = Mass_Orig - Mass_LW.","tr":"WeightRed = Mass_Orig - Mass_LW."},{"en":"FuelSavings = WtRed×Factor×Dist×Price.","tr":"FuelSavings = WtRed×Factor×Dist×Price."},{"en":"Net = (Fuel+Payload)×Life - MatPrem - ToolDelta.","tr":"Net = (Fuel+Payload)×Life - MatPrem - ToolDelta."}] },
};
