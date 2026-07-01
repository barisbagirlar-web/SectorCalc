/**
 * Tool #45 — Gıda Fire Marj
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FOOD_WASTE_MARGIN_SCHEMA: PremiumCalculatorSchema = {
  id: "food-waste-margin-analyzer", legacyPaidSlug: "food-waste-margin-analyzer",
  name: "Food Waste Margin & Yield Analyzer", name_i18n: {"en":"Food Waste Margin & Yield Analyzer"}, sectorSlug: "food", category: "cost",
  painStatement: "Gıda üretiminde fire, bozulma ve aşırı üretim maliyetleri ayrıştırılmazsa marj kaybının kaynağı tespit edilemez.", painStatement_i18n: {"en":"If waste, spoilage, and excessive production costs in food manufacturing are not disaggregated, the source of margin loss cannot be detected."},
  inputs: [
    { id: "rawWeight", label: "Raw material input weight", label_i18n: {"en":"Raw material input weight"}, type: "number", unit: "kg", required: true, smartDefault: 1000, validation: { min: 0.1 }, helper: "", expertMeaning: "Raw material input weight", expertMeaning_i18n: {"en":"Raw material input weight"} },
    { id: "finishedWeight", label: "Finished product weight", label_i18n: {"en":"Finished product weight"}, type: "number", unit: "kg", required: true, smartDefault: 750, validation: { min: 0 }, helper: "", expertMeaning: "Finished product weight", expertMeaning_i18n: {"en":"Finished product weight"} },
    { id: "rawCost", label: "Hammadde Maliyeti", label_i18n: {"en":"raw material Cost"}, type: "number", unit: "USD/kg", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Raw material cost per kg", expertMeaning_i18n: {"en":"Raw material cost per kg"} },
    { id: "spoiled", label: "Spoiled product quantity", label_i18n: {"en":"Spoiled product quantity"}, type: "number", unit: "kg", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Spoiled product quantity", expertMeaning_i18n: {"en":"Spoiled product quantity"} },
    { id: "prodCost", label: "Üretim Maliyeti", label_i18n: {"en":"Production cost per kg"}, type: "number", unit: "USD/kg", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Production cost per kg", expertMeaning_i18n: {"en":"Production cost per kg"} },
    { id: "excess", label: "Overproduction quantity", label_i18n: {"en":"Overproduction quantity"}, type: "number", unit: "kg", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Overproduction quantity", expertMeaning_i18n: {"en":"Overproduction quantity"} },
    { id: "unitCost", label: "Unit Cost", label_i18n: {"en":"Unit Cost"}, type: "number", unit: "USD/kg", required: false, smartDefault: 7, validation: { min: 0 }, helper: "", expertMeaning: "Unit cost of product", expertMeaning_i18n: {"en":"Unit cost of product"} },
    { id: "salvage", label: "Salvage value per kg", label_i18n: {"en":"Salvage value per kg"}, type: "number", unit: "USD/kg", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Salvage value per kg", expertMeaning_i18n: {"en":"Salvage value per kg"} },
    { id: "actualUsage", label: "Actual ingredient usage", label_i18n: {"en":"Actual ingredient usage"}, type: "number", unit: "kg", required: false, smartDefault: 950, validation: { min: 0 }, helper: "", expertMeaning: "Actual ingredient usage", expertMeaning_i18n: {"en":"Actual ingredient usage"} },
    { id: "theoreticalUsage", label: "Theoretical recipe usage", label_i18n: {"en":"Theoretical recipe usage"}, type: "number", unit: "kg", required: false, smartDefault: 850, validation: { min: 0 }, helper: "", expertMeaning: "Theoretical recipe usage", expertMeaning_i18n: {"en":"Theoretical recipe usage"} },
  ],
  outputs: [
    { id: "yield", label: "Verim Oran", label_i18n: {"en":"Efficiency Rate"}, unit: "%", format: "percentage" },
    { id: "marginLeak", label: "Marj Kayb (Toplam)", label_i18n: {"en":"Margin Loss (Total)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "yield", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — fire azaltma programı başlatılmalı.", warningMessage_i18n: {"en":"Efficiency < %80 — a waste reduction program should be initiated."}, criticalMessage: "Verim < %70 — proses iyileştirme acil.", criticalMessage_i18n: {"en":"Efficiency < %70 — proses improvement acil."} }],
  formulaPipeline: [
    { formulaId: "measurement.food_yield", inputMap: {
        finished: "finishedWeight",
        raw: "rawWeight"
      }, outputId: "yield" },
    { formulaId: "cost.food_margin_leak", inputMap: {
        shrinkCost: "rawCost",
        spoilCost: "prodCost",
        overCost: "unitCost"
      }, outputId: "marginLeak" },
  ],
  reportTemplate: { title: "Food Waste Margin Report", title_i18n: {"en":"Food Waste Margin Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Yield = Finished/Raw.", "Margin leak = Shrinkage+Spoilage+Overproduction.", "Variance = Actual - Theoretical usage."],assumptionNotes_i18n:[{"en":"Yield = Finished/Raw."},{"en":"Margin leak = Shrinkage+Spoilage+Overproduction."},{"en":"Variance = Actual - Theoretical usage."}] },
};
