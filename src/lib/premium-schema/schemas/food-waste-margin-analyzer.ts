/**
 * Tool #45 — Gıda Fire Marj
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FOOD_WASTE_MARGIN_SCHEMA: PremiumCalculatorSchema = {
  id: "food-waste-margin-analyzer", legacyPaidSlug: "food-waste-margin-analyzer",
  name: "Gıda Fire Marj & Verim Analizi", name_i18n: {"en":"Gida Fire Marj & Verim Analizi","tr":"Gıda Fire Marj & Verim Analizi"}, sectorSlug: "food", category: "cost",
  painStatement: "Gıda üretiminde fire, bozulma ve aşırı üretim maliyetleri ayrıştırılmazsa marj kaybının kaynağı tespit edilemez.", painStatement_i18n: {"en":"Gıda üretiminde fire, bozulma ve aşırı üretim maliyetleri ayrıştırılmazsa marj kaybının kaynağı tespit edilemez.","tr":"Gıda üretiminde fire, bozulma ve aşırı üretim maliyetleri ayrıştırılmazsa marj kaybının kaynağı tespit edilemez."},
  inputs: [
    { id: "rawWeight", label: "Giren Ürün Ağırlığı", label_i18n: {"en":"Raw material input weight","tr":"Giren Ürün Ağırlığı"}, type: "number", unit: "kg", required: true, smartDefault: 1000, validation: { min: 0.1 }, helper: "", expertMeaning: "Raw material input weight", expertMeaning_i18n: {"en":"Raw material input weight","tr":"giren ürün ağırlığı"} },
    { id: "finishedWeight", label: "Çıkan Ürün Ağırlığı", label_i18n: {"en":"Finished product weight","tr":"Çıkan Ürün Ağırlığı"}, type: "number", unit: "kg", required: true, smartDefault: 750, validation: { min: 0 }, helper: "", expertMeaning: "Finished product weight", expertMeaning_i18n: {"en":"Finished product weight","tr":"çıkan ürün ağırlığı"} },
    { id: "rawCost", label: "Hammadde Maliyeti", label_i18n: {"en":"Hammadde Maliyeti","tr":"Hammadde Maliyeti"}, type: "number", unit: "USD/kg", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Raw material cost per kg", expertMeaning_i18n: {"en":"Raw material cost per kg","tr":"Raw material cost per kg"} },
    { id: "spoiled", label: "Bozulma Miktarı", label_i18n: {"en":"Spoiled product quantity","tr":"Bozulma Miktarı"}, type: "number", unit: "kg", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Spoiled product quantity", expertMeaning_i18n: {"en":"Spoiled product quantity","tr":"bozulma miktarı"} },
    { id: "prodCost", label: "Üretim Maliyeti", label_i18n: {"en":"Production cost per kg","tr":"Üretim Maliyeti"}, type: "number", unit: "USD/kg", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Production cost per kg", expertMeaning_i18n: {"en":"Production cost per kg","tr":"üretim maliyeti"} },
    { id: "excess", label: "Aşırı Üretim Miktarı", label_i18n: {"en":"Overproduction quantity","tr":"Aşırı Üretim Miktarı"}, type: "number", unit: "kg", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Overproduction quantity", expertMeaning_i18n: {"en":"Overproduction quantity","tr":"aşırı üretim miktarı"} },
    { id: "unitCost", label: "Birim Maliyet", label_i18n: {"en":"Birim Maliyet","tr":"Birim Maliyet"}, type: "number", unit: "USD/kg", required: false, smartDefault: 7, validation: { min: 0 }, helper: "", expertMeaning: "Unit cost of product", expertMeaning_i18n: {"en":"Unit cost of product","tr":"Unit cost of product"} },
    { id: "salvage", label: "Kurtarma Değeri", label_i18n: {"en":"Salvage value per kg","tr":"Kurtarma Değeri"}, type: "number", unit: "USD/kg", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Salvage value per kg", expertMeaning_i18n: {"en":"Salvage value per kg","tr":"kurtarma değeri"} },
    { id: "actualUsage", label: "Gerçek Kullanım", label_i18n: {"en":"Actual ingredient usage","tr":"Gerçek Kullanım"}, type: "number", unit: "kg", required: false, smartDefault: 950, validation: { min: 0 }, helper: "", expertMeaning: "Actual ingredient usage", expertMeaning_i18n: {"en":"Actual ingredient usage","tr":"gerçek kullanım"} },
    { id: "theoreticalUsage", label: "Teorik Kullanım (Reçete)", label_i18n: {"en":"Theoretical recipe usage","tr":"Teorik Kullanım (Reçete)"}, type: "number", unit: "kg", required: false, smartDefault: 850, validation: { min: 0 }, helper: "", expertMeaning: "Theoretical recipe usage", expertMeaning_i18n: {"en":"Theoretical recipe usage","tr":"teorik kullanım (reçete)"} },
  ],
  outputs: [
    { id: "yield", label: "Verim Oranı", label_i18n: {"en":"Verim Oran","tr":"Verim Oranı"}, unit: "%", format: "percentage" },
    { id: "marginLeak", label: "Marj Kaybı (Toplam)", label_i18n: {"en":"Marj Kayb (Toplam)","tr":"Marj Kaybı (Toplam)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "yield", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — fire azaltma programı başlatılmalı.", warningMessage_i18n: {"en":"Verim < %80 — fire azaltma programı başlatılmalı.","tr":"Verim < %80 — fire azaltma programı başlatılmalı."}, criticalMessage: "Verim < %70 — proses iyileştirme acil.", criticalMessage_i18n: {"en":"Verim < %70 — proses iyileştirme acil.","tr":"Verim < %70 — proses iyileştirme acil."} }],
  formulaPipeline: [
    { formulaId: "measurement.food_yield", inputMap: { finishedWeight: "finishedWeight", rawWeight: "rawWeight" }, outputId: "yield" },
    { formulaId: "cost.food_margin_leak", inputMap: { shrinkageCost: "rawCost", spoilageCost: "prodCost", overProductionCost: "unitCost" }, outputId: "marginLeak" },
  ],
  reportTemplate: { title: "Food Waste Margin Report", title_i18n: {"en":"Food Waste Margin Report","tr":"Food Waste Margin Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Yield = Finished/Raw.", "Margin leak = Shrinkage+Spoilage+Overproduction.", "Variance = Actual - Theoretical usage."],assumptionNotes_i18n:[{"en":"Yield = Finished/Raw.","tr":"Yield = Finished/Raw."},{"en":"Margin leak = Shrinkage+Spoilage+Overproduction.","tr":"Margin leak = Shrinkage+Spoilage+Overproduction."},{"en":"Variance = Actual - Theoretical usage.","tr":"Variance = Actual - Theoretical usage."}] },
};
