/**
 * Tool #48 — Hacimsel Ağırlık
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const VOLUMETRIC_WEIGHT_SCHEMA: PremiumCalculatorSchema = {
  id: "volumetric-weight-chargeable-analyzer", legacyPaidSlug: "volumetric-weight-chargeable-analyzer",
  name: "Hacimsel Ağırlık & Taşıma Maliyet Analizi", name_i18n: {"en":"Volumetric Weight & Transport Cost Analyzer","tr":"Hacimsel Ağırlık & Taşıma Maliyet Analizi"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Hacimsel ağırlık doğru hesaplanmazsa taşıma maliyeti beklenenden yüksek çıkar ve navlun optimizasyonu yapılamaz.", painStatement_i18n: {"en":"Hacimsel ağırlık doğru hesaplanmazsa taşıma maliyeti beklenenden yüksek çıkar ve navlun optimizasyonu yapılamaz.","tr":"Hacimsel ağırlık doğru hesaplanmazsa taşıma maliyeti beklenenden yüksek çıkar ve navlun optimizasyonu yapılamaz."},
  inputs: [
    { id: "length", label: "Uzunluk", label_i18n: {"en":"Uzunluk","tr":"Uzunluk"}, type: "number", unit: "cm", required: true, smartDefault: 60, validation: { min: 0.1 }, helper: "", expertMeaning: "Package length", expertMeaning_i18n: {"en":"Package length","tr":"Package length"} },
    { id: "width", label: "Genişlik", label_i18n: {"en":"Package width","tr":"Genişlik"}, type: "number", unit: "cm", required: true, smartDefault: 40, validation: { min: 0.1 }, helper: "", expertMeaning: "Package width", expertMeaning_i18n: {"en":"Package width","tr":"genişlik"} },
    { id: "height", label: "Yükseklik", label_i18n: {"en":"Package height","tr":"Yükseklik"}, type: "number", unit: "cm", required: true, smartDefault: 30, validation: { min: 0.1 }, helper: "", expertMeaning: "Package height", expertMeaning_i18n: {"en":"Package height","tr":"yükseklik"} },
    { id: "grossWeight", label: "Brüt Ağırlık", label_i18n: {"en":"Gross weight","tr":"Brüt Ağırlık"}, type: "number", unit: "kg", required: true, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Gross weight", expertMeaning_i18n: {"en":"Gross weight","tr":"brüt ağırlık"} },
    { id: "transportMode", label: "Taşıma Modu", label_i18n: {"en":"Transport mode","tr":"Taşıma Modu"}, type: "select", unit: "", enumValues: ["hava", "kara", "deniz"], required: true, smartDefault: "hava", helper: "", expertMeaning: "Transport mode", expertMeaning_i18n: {"en":"Transport mode","tr":"taşıma modu"} },
    { id: "freightRate", label: "Navlun Birim Fiyatı", label_i18n: {"en":"Freight rate per kg","tr":"Navlun Birim Fiyatı"}, type: "number", unit: "USD/kg", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Freight rate per kg", expertMeaning_i18n: {"en":"Freight rate per kg","tr":"navlun birim fiyatı"} },
  ],
  outputs: [
    { id: "volWeight", label: "Hacimsel Ağırlık", label_i18n: {"en":"Hacimsel Agrlk","tr":"Hacimsel Ağırlık"}, unit: "kg", format: "number" },
    { id: "chargeable", label: "Ücrete Esas Ağırlık", label_i18n: {"en":"Ucrete Esas Agrlk","tr":"Ücrete Esas Ağırlık"}, unit: "kg", format: "number" },
    { id: "freightCost", label: "Taşıma Maliyeti", label_i18n: {"en":"Tasma Maliyeti","tr":"Taşıma Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "freightCost", warning: 50, critical: 100, direction: "higher_is_bad", warningMessage: "Taşıma > $50 — ambalaj optimizasyonu önerilir.", warningMessage_i18n: {"en":"Taşıma > $50 — ambalaj optimizasyonu önerilir.","tr":"Taşıma > $50 — ambalaj optimizasyonu önerilir."}, criticalMessage: "Taşıma > $100 — hacimsel ağırlık fazla, ambalaj küçültülmeli.", criticalMessage_i18n: {"en":"Taşıma > $100 — hacimsel ağırlık fazla, ambalaj küçültülmeli.","tr":"Taşıma > $100 — hacimsel ağırlık fazla, ambalaj küçültülmeli."} }],
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
  reportTemplate: { title: "Volumetric Weight Report", title_i18n: {"en":"Volumetric Weight Report","tr":"Volumetric Weight Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Air: (L×W×H)/6000. Road: /5000. Sea: /1000.", "Chargeable = MAX(Gross, VolWeight).", "Freight = Chargeable × Rate."],assumptionNotes_i18n:[{"en":"Air: (L×W×H)/6000. Road: /5000. Sea: /1000.","tr":"Air: (L×W×H)/6000. Road: /5000. Sea: /1000."},{"en":"Chargeable = MAX(Gross, VolWeight).","tr":"Chargeable = MAX(Gross, VolWeight)."},{"en":"Freight = Chargeable × Rate.","tr":"Freight = Chargeable × Rate."}] },
};
