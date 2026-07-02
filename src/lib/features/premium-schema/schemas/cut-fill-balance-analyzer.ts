import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CUT_FILL_BALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "cut-fill-balance-analyzer", legacyPaidSlug: "cut-fill-balance-analyzer",
  name: "Cut and Fill Balance Analyzer", name_i18n: {"en":"Cut and Fill Balance Analyzer"}, sectorSlug: "construction", category: "measurement",
  painStatement: "If cut-fill balance is not calculated, overtime excavation or borrow material cost cannot be controlled.", painStatement_i18n: {"en":"If cut-fill balance is not calculated, overtime excavation or borrow material cost cannot be controlled."},
  inputs: [
    { id: "cutVolume", label: "Total cut volume", label_i18n: {"en":"Total cut volume"}, type: "number", unit: "m³", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Total cut volume", expertMeaning_i18n: {"en":"Total cut volume"} },
    { id: "fillVolume", label: "Filler Volume", label_i18n: {"en":"Filler Volume"}, type: "number", unit: "m³", required: true, smartDefault: 4500, validation: { min: 0 }, helper: "", expertMeaning: "Total fill volume", expertMeaning_i18n: {"en":"Total fill volume"} },
    { id: "shrinkageFactor", label: "Compaction shrinkage", label_i18n: {"en":"Compaction shrinkage"}, type: "number", unit: "scalar", required: false, smartDefault: 0.85, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Compaction shrinkage", expertMeaning_i18n: {"en":"Compaction shrinkage"} },
    { id: "swellFactor", label: "Material swell factor", label_i18n: {"en":"Material swell factor"}, type: "number", unit: "scalar", required: false, smartDefault: 1.25, validation: { min: 1 }, helper: "", expertMeaning: "Material swell factor", expertMeaning_i18n: {"en":"Material swell factor"} },
    { id: "haulCost", label: "Haul cost per m³-km", label_i18n: {"en":"Haul cost per m³-km"}, type: "number", unit: "USD/m³-km", required: true, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Haul cost per m³-km", expertMeaning_i18n: {"en":"Haul cost per m³-km"} },
    { id: "borrowDistance", label: "Borrow pit distance", label_i18n: {"en":"Borrow pit distance"}, type: "number", unit: "km", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Borrow pit distance", expertMeaning_i18n: {"en":"Borrow pit distance"} },
    { id: "wasteDistance", label: "Waste site distance", label_i18n: {"en":"Waste site distance"}, type: "number", unit: "km", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Waste site distance", expertMeaning_i18n: {"en":"Waste site distance"} },
  ],
  outputs: [
    { id: "netBalance", label: "Net balance", label_i18n: {"en":"Net balance"}, unit: "m³", format: "number" },
    { id: "borrowRequired", label: "borrow material", label_i18n: {"en":"borrow material"}, unit: "m³", format: "number" },
    { id: "wasteRequired", label: "Overtime material", label_i18n: {"en":"Overtime material"}, unit: "m³", format: "number" },
    { id: "totalHaulCost", label: "Total Nakliye Cost", label_i18n: {"en":"Total Nakliye Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "borrowRequired", warning: 500, critical: 2000, direction: "higher_is_bad", warningMessage: "borrow > 500m³ - cost increase expected.", warningMessage_i18n: {"en":"borrow > 500m³ - cost increase expected."}, criticalMessage: "borrow > 2000m³ - proje ekonomisi riskli.", criticalMessage_i18n: {"en":"borrow > 2000m³ - proje ekonomisi riskli."} }],
  formulaPipeline: [
    { formulaId: "measurement.cut_fill_net", inputMap: { cutVolume: "cutVolume", fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor" }, outputId: "netBalance" },
    { formulaId: "measurement.cut_fill_borrow", inputMap: { fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor", cutVolume: "cutVolume" }, outputId: "borrowRequired" },
    { formulaId: "measurement.cut_fill_waste", inputMap: { cutVolume: "cutVolume", fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor" }, outputId: "wasteRequired" },
    { formulaId: "cost.cut_fill_haul", inputMap: {
        cutVolume: "borrowRequired",
        fillVolume: "borrowDistance",
        haulRate: "wasteRequired",
        wasteDistance: "wasteDistance",
        haulCost: "haulCost"
      }, outputId: "totalHaulCost" },
  ],
  reportTemplate: { title: "Kesme-Dolgu balance Raporu", title_i18n: {"en":"Kesme-Dolgu balance Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Net Denge = Kazi - (Dolgu × Sikisma).", "Odunc = max(0, Dolgu×Sikisma - Kazi).", "Nakliye = Hacim × Mesafe × Birim Fiyat."],assumptionNotes_i18n:[{"en":"Net Balance = Cut - (Fill × Compaction)."},{"en":"Borrow = max(0, Fill×Compaction - Cut)."},{"en":"Nakliye = Hacim × Mesafe × Birim Fiyat."}] },
};
