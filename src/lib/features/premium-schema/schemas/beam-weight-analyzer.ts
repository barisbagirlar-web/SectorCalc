import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const BEAM_WEIGHT_SCHEMA: PremiumCalculatorSchema = {
  id: "beam-weight-analyzer", legacyPaidSlug: "beam-weight-analyzer",
  name: "Kiriş Ağırlığı Hesaplama", name_i18n: {"en":"Beam Weight Calculation","tr":"Kiriş Ağırlığı Hesaplama"}, sectorSlug: "construction", category: "measurement",
  painStatement: "Çelik kiriş ağırlığı ve maliyeti hesaplanmazsa, yapısal tasarım ve bütçe sapmaları oluşur.", painStatement_i18n: {"en":"Without calculating steel beam weight and cost, structural design and budget deviations occur.","tr":"Çelik kiriş ağırlığı ve maliyeti hesaplanmazsa, yapısal tasarım ve bütçe sapmaları oluşur."},
  inputs: [
    { id: "profileType", label: "Profil Tipi", label_i18n: {"en":"Profile Type","tr":"Profil Tipi"}, type: "select", unit: "", enumValues: ["HEA", "HEB", "IPE", "UPN", "kutu"], required: true, smartDefault: "HEA", helper: "", expertMeaning: "Steel profile type", expertMeaning_i18n: {"en":"Steel profile type","tr":"Çelik profil tipi"} },
    { id: "profileSize", label: "Profil Boyutu", label_i18n: {"en":"Profile Size","tr":"Profil Boyutu"}, type: "number", unit: "mm", required: true, smartDefault: 200, validation: { min: 50 }, helper: "", expertMeaning: "Profile nominal size", expertMeaning_i18n: {"en":"Profile nominal size","tr":"Profil nominal boyutu"} },
    { id: "beamLength", label: "Kiriş Uzunluğu", label_i18n: {"en":"Beam Length","tr":"Kiriş Uzunluğu"}, type: "number", unit: "m", required: true, smartDefault: 6, validation: { min: 0.5 }, helper: "", expertMeaning: "Beam length", expertMeaning_i18n: {"en":"Beam length","tr":"Kiriş uzunluğu"} },
    { id: "quantity", label: "Adet", label_i18n: {"en":"Quantity","tr":"Adet"}, type: "number", unit: "", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of beams", expertMeaning_i18n: {"en":"Number of beams","tr":"Kiriş sayısı"} },
    { id: "steelDensity", label: "Çelik Yoğunluğu", label_i18n: {"en":"Steel Density","tr":"Çelik Yoğunluğu"}, type: "number", unit: "kg/m³", required: false, smartDefault: 7850, validation: { min: 0 }, helper: "", expertMeaning: "Steel density", expertMeaning_i18n: {"en":"Steel density","tr":"Çelik yoğunluğu"} },
    { id: "pricePerTon", label: "Ton Fiyatı", label_i18n: {"en":"Price Per Ton","tr":"Ton Fiyatı"}, type: "number", unit: "USD/ton", required: true, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Steel price per ton", expertMeaning_i18n: {"en":"Steel price per ton","tr":"Ton başına çelik fiyatı"} },
    { id: "modulusE", label: "Elastisite Modülü E", label_i18n: {"en":"Young's Modulus E","tr":"Elastisite Modülü E"}, type: "number", unit: "GPa", required: false, smartDefault: 210, validation: { min: 0 }, helper: "", expertMeaning: "Young's modulus", expertMeaning_i18n: {"en":"Young's modulus","tr":"Elastisite modülü"} },
    { id: "uniformLoad", label: "Düzgün Yayılı Yük w", label_i18n: {"en":"Uniform Load w","tr":"Düzgün Yayılı Yük w"}, type: "number", unit: "kN/m", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Uniform distributed load", expertMeaning_i18n: {"en":"Uniform distributed load","tr":"Düzgün yayılı yük"} },
  ],
  outputs: [
    { id: "totalWeight", label: "Toplam Ağırlık", label_i18n: {"en":"Toplam Agrlk","tr":"Toplam Ağırlık"}, unit: "ton", format: "number" },
    { id: "materialCost", label: "Malzeme Maliyeti", label_i18n: {"en":"Malzeme Maliyeti","tr":"Malzeme Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "materialCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Malzeme > $50K — alternatif profil değerlendirilmeli.", warningMessage_i18n: {"en":"Malzeme > $50K — alternatif profil değerlendirilmeli.","tr":"Malzeme > $50K — alternatif profil değerlendirilmeli."}, criticalMessage: "Malzeme > $150K — bütçe revizyonu gerekli.", criticalMessage_i18n: {"en":"Malzeme > $150K — bütçe revizyonu gerekli.","tr":"Malzeme > $150K — bütçe revizyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "cost.beam_material", inputMap: {
        beamLength: "beamLength",
        beamWeightPerM: "profileSize",
        materialPricePerKg: "quantity",
        steelDensity: "steelDensity",
        pricePerTon: "pricePerTon"
      }, outputId: "totalWeight" },
  ],
  reportTemplate: { title: "Kiriş Ağırlık Raporu", title_i18n: {"en":"Kiriş Ağırlık Raporu","tr":"Kiriş Ağırlık Raporu"}, sections: ["executive_summary", "thresholds", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Ağırlık = Kesit × Uzunluk × Adet × Yoğunluk.", "Kesit alanı profil tipine göre lookup tablosundan."],assumptionNotes_i18n:[{"en":"Ağırlık = Kesit × Uzunluk × Adet × Yoğunluk.","tr":"Ağırlık = Kesit × Uzunluk × Adet × Yoğunluk."},{"en":"Kesit alanı profil tipine göre lookup tablosundan.","tr":"Kesit alanı profil tipine göre lookup tablosundan."}]},
};
