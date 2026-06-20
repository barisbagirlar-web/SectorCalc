import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const BEAM_WEIGHT_SCHEMA: PremiumCalculatorSchema = {
  id: "beam-weight-analyzer", legacyPaidSlug: "beam-weight-analyzer",
  name: "Kiriş Ağırlığı Hesaplama", sectorSlug: "construction", category: "measurement",
  painStatement: "Çelik kiriş ağırlığı ve maliyeti hesaplanmazsa, yapısal tasarım ve bütçe sapmaları oluşur.",
  inputs: [
    { id: "profileType", label: "Profil Tipi", type: "select", unit: "", enumValues: ["HEA", "HEB", "IPE", "UPN", "kutu"], required: true, smartDefault: "HEA", helper: "", expertMeaning: "Steel profile type" },
    { id: "profileSize", label: "Profil Boyutu", type: "number", unit: "mm", required: true, smartDefault: 200, validation: { min: 50 }, helper: "", expertMeaning: "Profile nominal size" },
    { id: "beamLength", label: "Kiriş Uzunluğu", type: "number", unit: "m", required: true, smartDefault: 6, validation: { min: 0.5 }, helper: "", expertMeaning: "Beam length" },
    { id: "quantity", label: "Adet", type: "number", unit: "", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of beams" },
    { id: "steelDensity", label: "Çelik Yoğunluğu", type: "number", unit: "kg/m³", required: false, smartDefault: 7850, validation: { min: 0 }, helper: "", expertMeaning: "Steel density" },
    { id: "pricePerTon", label: "Ton Fiyatı", type: "number", unit: "USD/ton", required: true, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Steel price per ton" },
    { id: "modulusE", label: "Elastisite Modülü E", type: "number", unit: "GPa", required: false, smartDefault: 210, validation: { min: 0 }, helper: "", expertMeaning: "Young's modulus" },
    { id: "uniformLoad", label: "Düzgün Yayılı Yük w", type: "number", unit: "kN/m", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Uniform distributed load" },
  ],
  outputs: [
    { id: "totalWeight", label: "Toplam Ağırlık", unit: "ton", format: "number" },
    { id: "materialCost", label: "Malzeme Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "materialCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Malzeme > $50K — alternatif profil değerlendirilmeli.", criticalMessage: "Malzeme > $150K — bütçe revizyonu gerekli." }],
  formulaPipeline: [
    { formulaId: "cost.beam_material", inputMap: { profileSize: "profileSize", beamLength: "beamLength", quantity: "quantity", steelDensity: "steelDensity", pricePerTon: "pricePerTon" }, outputId: "totalWeight" },
  ],
  reportTemplate: { title: "Kiriş Ağırlık Raporu", sections: ["executive_summary", "thresholds", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Ağırlık = Kesit × Uzunluk × Adet × Yoğunluk.", "Kesit alanı profil tipine göre lookup tablosundan."] },
};
