/**
 * Tool #35 — WPS Ön Isıtma Sıcaklık
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const WPS_PREHEAT_SCHEMA: PremiumCalculatorSchema = {
  id: "wps-preheat-temperature-analyzer", legacyPaidSlug: "wps-preheat-temperature-analyzer",
  name: "WPS Ön Isıtma Sıcaklık Analizi", name_i18n: {"en":"WPS Preheat Temperature Analyzer","tr":"WPS Ön Isıtma Sıcaklık Analizi"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Kaynak öncesi ön ısıtma sıcaklığı doğru hesaplanmazsa çatlama riski artar ve enerji maliyeti yükselir. Karbon eşdeğeri ve malzeme kalınlığına göre optimum sıcaklık belirlenmelidir.", painStatement_i18n: {"en":"Kaynak öncesi ön ısıtma sıcaklığı doğru hesaplanmazsa çatlama riski artar ve enerji maliyeti yükselir. Karbon eşdeğeri ve malzeme kalınlığına göre optimum sıcaklık belirlenmelidir.","tr":"Kaynak öncesi ön ısıtma sıcaklığı doğru hesaplanmazsa çatlama riski artar ve enerji maliyeti yükselir. Karbon eşdeğeri ve malzeme kalınlığına göre optimum sıcaklık belirlenmelidir."},
  inputs: [
    { id: "carbonContent", label: "Karbon Oranı", label_i18n: {"en":"Carbon percentage in material","tr":"Karbon Oranı"}, type: "number", unit: "%", required: true, smartDefault: 0.2, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Carbon percentage in material", expertMeaning_i18n: {"en":"Carbon percentage in material","tr":"karbon oranı"} },
    { id: "manganeseContent", label: "Mangan Oranı", label_i18n: {"en":"Manganese percentage","tr":"Mangan Oranı"}, type: "number", unit: "%", required: true, smartDefault: 1.2, validation: { min: 0, max: 5 }, helper: "", expertMeaning: "Manganese percentage", expertMeaning_i18n: {"en":"Manganese percentage","tr":"mangan oranı"} },
    { id: "chromiumContent", label: "Krom Oranı", label_i18n: {"en":"Chromium percentage","tr":"Krom Oranı"}, type: "number", unit: "%", required: false, smartDefault: 0.5, validation: { min: 0, max: 10 }, helper: "", expertMeaning: "Chromium percentage", expertMeaning_i18n: {"en":"Chromium percentage","tr":"krom oranı"} },
    { id: "molybdenumContent", label: "Molibden Oranı", label_i18n: {"en":"Molybdenum percentage","tr":"Molibden Oranı"}, type: "number", unit: "%", required: false, smartDefault: 0.1, validation: { min: 0, max: 5 }, helper: "", expertMeaning: "Molybdenum percentage", expertMeaning_i18n: {"en":"Molybdenum percentage","tr":"molibden oranı"} },
    { id: "nickelContent", label: "Nikel Oranı", label_i18n: {"en":"Nickel percentage","tr":"Nikel Oranı"}, type: "number", unit: "%", required: false, smartDefault: 0.3, validation: { min: 0, max: 10 }, helper: "", expertMeaning: "Nickel percentage", expertMeaning_i18n: {"en":"Nickel percentage","tr":"nikel oranı"} },
    { id: "materialThickness", label: "Malzeme Kalınlığı", label_i18n: {"en":"Material thickness","tr":"Malzeme Kalınlığı"}, type: "number", unit: "mm", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Material thickness", expertMeaning_i18n: {"en":"Material thickness","tr":"malzeme kalınlığı"} },
    { id: "energyCostPerKwh", label: "Enerji Birim Maliyeti", label_i18n: {"en":"Enerji Birim Maliyeti","tr":"Enerji Birim Maliyeti"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per kWh for preheat", expertMeaning_i18n: {"en":"Cost per kWh for preheat","tr":"Cost per kWh for preheat"} },
    { id: "weldLength", label: "Kaynak Uzunluğu", label_i18n: {"en":"Total weld length","tr":"Kaynak Uzunluğu"}, type: "number", unit: "m", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Total weld length", expertMeaning_i18n: {"en":"Total weld length","tr":"kaynak uzunluğu"} },
  ],
  outputs: [
    { id: "carbonEquivalent", label: "Karbon Eşdeğeri (CEV)", label_i18n: {"en":"Karbon Esdegeri (CEV)","tr":"Karbon Eşdeğeri (CEV)"}, unit: "%", format: "number" },
    { id: "preheatRequired", label: "Gerekli Ön Isıtma Sıcaklığı", label_i18n: {"en":"Gerekli On Istma Scaklg","tr":"Gerekli Ön Isıtma Sıcaklığı"}, unit: "°C", format: "number" },
    { id: "preheatEnergyCost", label: "Ön Isıtma Enerji Maliyeti", label_i18n: {"en":"On Istma Enerji Maliyeti","tr":"Ön Isıtma Enerji Maliyeti"}, unit: "USD", format: "currency" },
    { id: "crackRisk", label: "Çatlama Riski", label_i18n: {"en":"Catlama Riski","tr":"Çatlama Riski"}, unit: "puan", format: "score" },
  ],
  thresholds: [
    { fieldId: "carbonEquivalent", warning: 0.4, critical: 0.55, direction: "higher_is_bad", warningMessage: "CEV > 0.4 — ön ısıtma gereklidir, hidrojen kontrolü yapılmalı.", warningMessage_i18n: {"en":"CEV > 0.4 — ön ısıtma gereklidir, hidrojen kontrolü yapılmalı.","tr":"CEV > 0.4 — ön ısıtma gereklidir, hidrojen kontrolü yapılmalı."}, criticalMessage: "CEV > 0.55 — yüksek çatlama riski, kaynak prosedürü gözden geçirilmeli.", criticalMessage_i18n: {"en":"CEV > 0.55 — yüksek çatlama riski, kaynak prosedürü gözden geçirilmeli.","tr":"CEV > 0.55 — yüksek çatlama riski, kaynak prosedürü gözden geçirilmeli."} },
    { fieldId: "preheatEnergyCost", warning: 500, critical: 1500, direction: "higher_is_bad", warningMessage: "Ön ısıtma maliyeti > $500 — enerji verimliliği değerlendirilmeli.", warningMessage_i18n: {"en":"Ön ısıtma maliyeti > $500 — enerji verimliliği değerlendirilmeli.","tr":"Ön ısıtma maliyeti > $500 — enerji verimliliği değerlendirilmeli."}, criticalMessage: "Ön ısıtma maliyeti > $1,500 — alternatif kaynak yöntemleri araştırılmalı.", criticalMessage_i18n: {"en":"Ön ısıtma maliyeti > $1,500 — alternatif kaynak yöntemleri araştırılmalı.","tr":"Ön ısıtma maliyeti > $1,500 — alternatif kaynak yöntemleri araştırılmalı."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.carbon_equivalent", inputMap: {
        carbonContent: "carbonContent",
        manganeseContent: "manganeseContent",
        chromiumContent: "chromiumContent",
        molybdenumContent: "molybdenumContent",
        nickelContent: "nickelContent"
      ,
        carbonPct: "carbonPct",
        mnPct: "mnPct",
        crPct: "crPct",
        moPct: "moPct",
        vPct: "vPct",
        niPct: "niPct",
        cuPct: "cuPct"}, outputId: "carbonEquivalent" },
    { formulaId: "measurement.preheat_required", inputMap: { carbonEquivalent: "carbonEquivalent", materialThickness: "materialThickness" ,
        thresholdCe: "thresholdCe"}, outputId: "preheatRequired" },
    { formulaId: "cost.preheat_energy_cost", inputMap: { preheatRequired: "preheatRequired", materialThickness: "materialThickness", energyCostPerKwh: "energyCostPerKwh", weldLength: "weldLength" ,
        preheatHours: "preheatHours",
        energyRate: "energyRate",
        preheatPower: "preheatPower"}, outputId: "preheatEnergyCost" },
    { formulaId: "measurement.crack_risk_score", inputMap: { carbonEquivalent: "carbonEquivalent", materialThickness: "materialThickness" ,
        thresholdCe: "thresholdCe"}, outputId: "crackRisk" },
  ],
  reportTemplate: { title: "WPS Ön Isıtma Sıcaklık Analiz Raporu", title_i18n: {"en":"WPS Ön Isıtma Sıcaklık Analiz Raporu","tr":"WPS Ön Isıtma Sıcaklık Analiz Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 formülü ile hesaplanır.", "Ön ısıtma sıcaklığı CEV ve kalınlığa göre IIW standardı baz alınır.", "Enerji maliyeti tahmini olup bölgesel tarifelere göre değişir."],assumptionNotes_i18n:[{"en":"CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 formülü ile hesaplanır.","tr":"CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 formülü ile hesaplanır."},{"en":"Ön ısıtma sıcaklığı CEV ve kalınlığa göre IIW standardı baz alınır.","tr":"Ön ısıtma sıcaklığı CEV ve kalınlığa göre IIW standardı baz alınır."},{"en":"Enerji maliyeti tahmini olup bölgesel tarifelere göre değişir.","tr":"Enerji maliyeti tahmini olup bölgesel tarifelere göre değişir."}] },
};
