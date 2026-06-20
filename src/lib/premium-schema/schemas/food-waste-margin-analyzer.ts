/**
 * Tool #45 — Gıda Fire Marj
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FOOD_WASTE_MARGIN_SCHEMA: PremiumCalculatorSchema = {
  id: "food-waste-margin-analyzer", legacyPaidSlug: "food-waste-margin-analyzer",
  name: "Gıda Fire Marj & Verim Analizi", sectorSlug: "food", category: "cost",
  painStatement: "Gıda üretiminde fire, bozulma ve aşırı üretim maliyetleri ayrıştırılmazsa marj kaybının kaynağı tespit edilemez.",
  inputs: [
    { id: "rawWeight", label: "Giren Ürün Ağırlığı", type: "number", unit: "kg", required: true, smartDefault: 1000, validation: { min: 0.1 }, helper: "", expertMeaning: "Raw material input weight" },
    { id: "finishedWeight", label: "Çıkan Ürün Ağırlığı", type: "number", unit: "kg", required: true, smartDefault: 750, validation: { min: 0 }, helper: "", expertMeaning: "Finished product weight" },
    { id: "rawCost", label: "Hammadde Maliyeti", type: "number", unit: "USD/kg", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Raw material cost per kg" },
    { id: "spoiled", label: "Bozulma Miktarı", type: "number", unit: "kg", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Spoiled product quantity" },
    { id: "prodCost", label: "Üretim Maliyeti", type: "number", unit: "USD/kg", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Production cost per kg" },
    { id: "excess", label: "Aşırı Üretim Miktarı", type: "number", unit: "kg", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Overproduction quantity" },
    { id: "unitCost", label: "Birim Maliyet", type: "number", unit: "USD/kg", required: false, smartDefault: 7, validation: { min: 0 }, helper: "", expertMeaning: "Unit cost of product" },
    { id: "salvage", label: "Kurtarma Değeri", type: "number", unit: "USD/kg", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Salvage value per kg" },
    { id: "actualUsage", label: "Gerçek Kullanım", type: "number", unit: "kg", required: false, smartDefault: 950, validation: { min: 0 }, helper: "", expertMeaning: "Actual ingredient usage" },
    { id: "theoreticalUsage", label: "Teorik Kullanım (Reçete)", type: "number", unit: "kg", required: false, smartDefault: 850, validation: { min: 0 }, helper: "", expertMeaning: "Theoretical recipe usage" },
  ],
  outputs: [
    { id: "yield", label: "Verim Oranı", unit: "%", format: "percentage" },
    { id: "marginLeak", label: "Marj Kaybı (Toplam)", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "yield", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — fire azaltma programı başlatılmalı.", criticalMessage: "Verim < %70 — proses iyileştirme acil." }],
  formulaPipeline: [
    { formulaId: "measurement.food_yield", inputMap: { finishedWeight: "finishedWeight", rawWeight: "rawWeight" }, outputId: "yield" },
    { formulaId: "cost.food_margin_leak", inputMap: { shrinkageCost: "rawCost", spoilageCost: "prodCost", overProductionCost: "unitCost" }, outputId: "marginLeak" },
  ],
  reportTemplate: { title: "Food Waste Margin Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Yield = Finished/Raw.", "Margin leak = Shrinkage+Spoilage+Overproduction.", "Variance = Actual - Theoretical usage."] },
};
