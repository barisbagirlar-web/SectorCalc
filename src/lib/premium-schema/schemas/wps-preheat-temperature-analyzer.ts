/**
 * Tool #35 — WPS Ön Isıtma Sıcaklık
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const WPS_PREHEAT_SCHEMA: PremiumCalculatorSchema = {
  id: "wps-preheat-temperature-analyzer", legacyPaidSlug: "wps-preheat-temperature-analyzer",
  name: "WPS Ön Isıtma Sıcaklık Analizi", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Kaynak öncesi ön ısıtma sıcaklığı doğru hesaplanmazsa çatlama riski artar ve enerji maliyeti yükselir. Karbon eşdeğeri ve malzeme kalınlığına göre optimum sıcaklık belirlenmelidir.",
  inputs: [
    { id: "carbonContent", label: "Karbon Oranı", type: "number", unit: "%", required: true, smartDefault: 0.2, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Carbon percentage in material" },
    { id: "manganeseContent", label: "Mangan Oranı", type: "number", unit: "%", required: true, smartDefault: 1.2, validation: { min: 0, max: 5 }, helper: "", expertMeaning: "Manganese percentage" },
    { id: "chromiumContent", label: "Krom Oranı", type: "number", unit: "%", required: false, smartDefault: 0.5, validation: { min: 0, max: 10 }, helper: "", expertMeaning: "Chromium percentage" },
    { id: "molybdenumContent", label: "Molibden Oranı", type: "number", unit: "%", required: false, smartDefault: 0.1, validation: { min: 0, max: 5 }, helper: "", expertMeaning: "Molybdenum percentage" },
    { id: "nickelContent", label: "Nikel Oranı", type: "number", unit: "%", required: false, smartDefault: 0.3, validation: { min: 0, max: 10 }, helper: "", expertMeaning: "Nickel percentage" },
    { id: "materialThickness", label: "Malzeme Kalınlığı", type: "number", unit: "mm", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Material thickness" },
    { id: "energyCostPerKwh", label: "Enerji Birim Maliyeti", type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per kWh for preheat" },
    { id: "weldLength", label: "Kaynak Uzunluğu", type: "number", unit: "m", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Total weld length" },
  ],
  outputs: [
    { id: "carbonEquivalent", label: "Karbon Eşdeğeri (CEV)", unit: "%", format: "number" },
    { id: "preheatRequired", label: "Gerekli Ön Isıtma Sıcaklığı", unit: "°C", format: "number" },
    { id: "preheatEnergyCost", label: "Ön Isıtma Enerji Maliyeti", unit: "USD", format: "currency" },
    { id: "crackRisk", label: "Çatlama Riski", unit: "puan", format: "score" },
  ],
  thresholds: [
    { fieldId: "carbonEquivalent", warning: 0.4, critical: 0.55, direction: "higher_is_bad", warningMessage: "CEV > 0.4 — ön ısıtma gereklidir, hidrojen kontrolü yapılmalı.", criticalMessage: "CEV > 0.55 — yüksek çatlama riski, kaynak prosedürü gözden geçirilmeli." },
    { fieldId: "preheatEnergyCost", warning: 500, critical: 1500, direction: "higher_is_bad", warningMessage: "Ön ısıtma maliyeti > $500 — enerji verimliliği değerlendirilmeli.", criticalMessage: "Ön ısıtma maliyeti > $1,500 — alternatif kaynak yöntemleri araştırılmalı." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.carbon_equivalent", inputMap: { carbonContent: "carbonContent", manganeseContent: "manganeseContent", chromiumContent: "chromiumContent", molybdenumContent: "molybdenumContent", nickelContent: "nickelContent" }, outputId: "carbonEquivalent" },
    { formulaId: "measurement.preheat_required", inputMap: { carbonEquivalent: "carbonEquivalent", materialThickness: "materialThickness" }, outputId: "preheatRequired" },
    { formulaId: "cost.preheat_energy_cost", inputMap: { preheatRequired: "preheatRequired", materialThickness: "materialThickness", energyCostPerKwh: "energyCostPerKwh", weldLength: "weldLength" }, outputId: "preheatEnergyCost" },
    { formulaId: "measurement.crack_risk_score", inputMap: { carbonEquivalent: "carbonEquivalent", materialThickness: "materialThickness" }, outputId: "crackRisk" },
  ],
  reportTemplate: { title: "WPS Ön Isıtma Sıcaklık Analiz Raporu", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 formülü ile hesaplanır.", "Ön ısıtma sıcaklığı CEV ve kalınlığa göre IIW standardı baz alınır.", "Enerji maliyeti tahmini olup bölgesel tarifelere göre değişir."] },
};
