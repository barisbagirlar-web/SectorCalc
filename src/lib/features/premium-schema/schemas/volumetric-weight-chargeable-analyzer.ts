/**
 * Tool #48 — Hacimsel Ağırlık
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const VOLUMETRIC_WEIGHT_SCHEMA: PremiumCalculatorSchema = {
  id: "volumetric-weight-chargeable-analyzer", legacyPaidSlug: "volumetric-weight-chargeable-analyzer",
  name: "Volumetric Weight & Transport Cost Analyzer", name_i18n: {"en":"Volumetric Weight & Transport Cost Analyzer"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Hacimsel ağırlık doğru hesaplanmazsa taşıma maliyeti beklenenden yüksek çıkar ve navlun optimizasyonu yapılamaz.", painStatement_i18n: {"en":"If Dimensional Weight is not accurately calculated, Carrying Cost turns out higher than expected and freight optimization cannot be performed."},
  inputs: [
    { id: "length", label: "Uzunluk", label_i18n: {"en":"Uzunluk"}, type: "number", unit: "cm", required: true, smartDefault: 60, validation: { min: 0.1 }, helper: "", expertMeaning: "Package length", expertMeaning_i18n: {"en":"Package length"} },
    { id: "width", label: "Package width", label_i18n: {"en":"Package width"}, type: "number", unit: "cm", required: true, smartDefault: 40, validation: { min: 0.1 }, helper: "", expertMeaning: "Package width", expertMeaning_i18n: {"en":"Package width"} },
    { id: "height", label: "Yükseklik", label_i18n: {"en":"Package height"}, type: "number", unit: "cm", required: true, smartDefault: 30, validation: { min: 0.1 }, helper: "", expertMeaning: "Package height", expertMeaning_i18n: {"en":"Package height"} },
    { id: "grossWeight", label: "Gross weight", label_i18n: {"en":"Gross weight"}, type: "number", unit: "kg", required: true, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Gross weight", expertMeaning_i18n: {"en":"Gross weight"} },
    { id: "transportMode", label: "Transport mode", label_i18n: {"en":"Transport mode"}, type: "select", unit: "", enumValues: ["hava", "kara", "deniz"], required: true, smartDefault: "hava", helper: "", expertMeaning: "Transport mode", expertMeaning_i18n: {"en":"Transport mode"} },
    { id: "freightRate", label: "Freight rate per kg", label_i18n: {"en":"Freight rate per kg"}, type: "number", unit: "USD/kg", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Freight rate per kg", expertMeaning_i18n: {"en":"Freight rate per kg"} },
  ],
  outputs: [
    { id: "volWeight", label: "Hacimsel Agrlk", label_i18n: {"en":"Hacimsel Weight"}, unit: "kg", format: "number" },
    { id: "chargeable", label: "Ucrete Esas Agrlk", label_i18n: {"en":"Ucrete Esas Weight"}, unit: "kg", format: "number" },
    { id: "freightCost", label: "Tasma Maliyeti", label_i18n: {"en":"Carrying Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "freightCost", warning: 50, critical: 100, direction: "higher_is_bad", warningMessage: "Taşıma > $50 — ambalaj optimizasyonu önerilir.", warningMessage_i18n: {"en":"Carrying > $50 — Packaging optimization is recommended."}, criticalMessage: "Taşıma > $100 — hacimsel ağırlık fazla, ambalaj küçültülmeli.", criticalMessage_i18n: {"en":"Carrying > $100 — Dimensional Weight overtime, packaging must be reduced."} }],
  formulaPipeline: [
    { formulaId: "measurement.volumetric_weight_air", inputMap: { length: "length", width: "width", height: "height" }, outputId: "volWeight" },
    { formulaId: "measurement.volumetric_chargeable", inputMap: {
        length: "grossWeight",
        width: "volWeight"
      ,
        height: "height",
        mode: "mode",
        gross: "gross"}, outputId: "chargeable" },
    { formulaId: "cost.volumetric_freight", inputMap: {
        gross: "chargeable",
        volWeight: "freightRate"
      ,
        rate: "rate"}, outputId: "freightCost" },
  ],
  reportTemplate: { title: "Volumetric Weight Report", title_i18n: {"en":"Volumetric Weight Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Air: (L×W×H)/6000. Road: /5000. Sea: /1000.", "Chargeable = MAX(Gross, VolWeight).", "Freight = Chargeable × Rate."],assumptionNotes_i18n:[{"en":"Air: (L×W×H)/6000. Road: /5000. Sea: /1000."},{"en":"Chargeable = MAX(Gross, VolWeight)."},{"en":"Freight = Chargeable × Rate."}] },
};
