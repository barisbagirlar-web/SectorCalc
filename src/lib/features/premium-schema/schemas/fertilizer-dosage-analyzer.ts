/**
 * Tool #46 — Gübre Dozaj
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FERTILIZER_DOSAGE_SCHEMA: PremiumCalculatorSchema = {
  id: "fertilizer-dosage-analyzer", legacyPaidSlug: "fertilizer-dosage-analyzer",
  name: "Gübre Dozaj & Verim Optimizasyonu", name_i18n: {"en":"Gubre Dozaj & Verim Optimizasyonu","tr":"Gübre Dozaj & Verim Optimizasyonu"}, sectorSlug: "food", category: "measurement",
  painStatement: "Gübre dozajı toprak analizine göre hesaplanmazsa ya eksik gübreleme verimi düşürür ya da fazla gübre çevre kirliliği yaratır.", painStatement_i18n: {"en":"Gübre dozajı toprak analizine göre hesaplanmazsa ya eksik gübreleme verimi düşürür ya da fazla gübre çevre kirliliği yaratır.","tr":"Gübre dozajı toprak analizine göre hesaplanmazsa ya eksik gübreleme verimi düşürür ya da fazla gübre çevre kirliliği yaratır."},
  inputs: [
    { id: "yieldTarget", label: "Hedef Verim", label_i18n: {"en":"Hedef Verim","tr":"Hedef Verim"}, type: "number", unit: "ton/ha", required: true, smartDefault: 8, validation: { min: 0.1 }, helper: "", expertMeaning: "Target yield per hectare", expertMeaning_i18n: {"en":"Target yield per hectare","tr":"Target yield per hectare"} },
    { id: "removalRate", label: "Kaldırma Oranı (N)", label_i18n: {"en":"Nutrient removal rate per ton yield","tr":"Kaldırma Oranı (N)"}, type: "number", unit: "kg/ton", required: true, smartDefault: 24, validation: { min: 0 }, helper: "", expertMeaning: "Nutrient removal rate per ton yield", expertMeaning_i18n: {"en":"Nutrient removal rate per ton yield","tr":"kaldırma oranı (n)"} },
    { id: "soilTestN", label: "Toprak N (ppm)", label_i18n: {"en":"Toprak N (ppm)","tr":"Toprak N (ppm)"}, type: "number", unit: "ppm", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Soil test nitrogen", expertMeaning_i18n: {"en":"Soil test nitrogen","tr":"Soil test nitrogen"} },
    { id: "convFactor", label: "Dönüşüm Faktörü", label_i18n: {"en":"ppm to kg/ha conversion","tr":"Dönüşüm Faktörü"}, type: "number", unit: "", required: false, smartDefault: 2.24, validation: { min: 0 }, helper: "", expertMeaning: "ppm to kg/ha conversion", expertMeaning_i18n: {"en":"ppm to kg/ha conversion","tr":"dönüşüm faktörü"} },
    { id: "efficiency", label: "Gübre Verimliliği", label_i18n: {"en":"Fertilizer use efficiency","tr":"Gübre Verimliliği"}, type: "number", unit: "%", required: true, smartDefault: 60, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Fertilizer use efficiency", expertMeaning_i18n: {"en":"Fertilizer use efficiency","tr":"gübre verimliliği"} },
    { id: "nutrientContentPct", label: "Gübre İçeriği (N)", label_i18n: {"en":"Fertilizer N content","tr":"Gübre İçeriği (N)"}, type: "number", unit: "%", required: true, smartDefault: 46, validation: { min: 0.1, max: 100 }, helper: "", expertMeaning: "Fertilizer N content", expertMeaning_i18n: {"en":"Fertilizer N content","tr":"gübre i̇çeriği (n)"} },
    { id: "fieldArea", label: "Tarla Alanı", label_i18n: {"en":"Field area","tr":"Tarla Alanı"}, type: "number", unit: "ha", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Field area", expertMeaning_i18n: {"en":"Field area","tr":"tarla alanı"} },
    { id: "unitPrice", label: "Gübre Birim Fiyatı", label_i18n: {"en":"Fertilizer unit price","tr":"Gübre Birim Fiyatı"}, type: "number", unit: "USD/kg", required: true, smartDefault: 0.8, validation: { min: 0 }, helper: "", expertMeaning: "Fertilizer unit price", expertMeaning_i18n: {"en":"Fertilizer unit price","tr":"gübre birim fiyatı"} },
    { id: "cropUptake", label: "Bitki Alım Miktarı", label_i18n: {"en":"Crop uptake per ha","tr":"Bitki Alım Miktarı"}, type: "number", unit: "kg/ha", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Crop uptake per ha", expertMeaning_i18n: {"en":"Crop uptake per ha","tr":"bitki alım miktarı"} },
    { id: "leachingFactor", label: "Yıkanma Faktörü", label_i18n: {"en":"Nitrate leaching factor","tr":"Yıkanma Faktörü"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Nitrate leaching factor", expertMeaning_i18n: {"en":"Nitrate leaching factor","tr":"yıkanma faktörü"} },
  ],
  outputs: [
    { id: "fertNeed", label: "Gübre İhtiyacı (Saf N)", label_i18n: {"en":"Gubre Ihtiyac (Saf N)","tr":"Gübre İhtiyacı (Saf N)"}, unit: "kg/ha", format: "number" },
    { id: "appRate", label: "Uygulama Miktarı", label_i18n: {"en":"Uygulama Miktar","tr":"Uygulama Miktarı"}, unit: "kg/ha", format: "number" },
    { id: "totalCost", label: "Toplam Gübre Maliyeti", label_i18n: {"en":"Toplam Gubre Maliyeti","tr":"Toplam Gübre Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalCost", warning: 5000, critical: 10000, direction: "higher_is_bad", warningMessage: "Gübre maliyeti > $5000 — alternatif gübreleme değerlendirilmeli.", warningMessage_i18n: {"en":"Gübre maliyeti > $5000 — alternatif gübreleme değerlendirilmeli.","tr":"Gübre maliyeti > $5000 — alternatif gübreleme değerlendirilmeli."}, criticalMessage: "Maliyet > $10000 — maliyet optimizasyonu acil.", criticalMessage_i18n: {"en":"Maliyet > $10000 — maliyet optimizasyonu acil.","tr":"Maliyet > $10000 — maliyet optimizasyonu acil."} }],
  formulaPipeline: [
    { formulaId: "measurement.fertilizer_need", inputMap: {
        nutReq: "yieldTarget",
        soilSupp: "removalRate"
      }, outputId: "fertNeed" },
    { formulaId: "measurement.fertilizer_application", inputMap: {
        fertNeed: "fertNeed",
        contentPct: "nutrientContentPct",
        efficiency: "efficiency"
      }, outputId: "appRate" },
    { formulaId: "cost.fertilizer_cost", inputMap: {
        appRate: "appRate",
        area: "fieldArea",
        price: "unitPrice"
      }, outputId: "totalCost" },
  ],
  reportTemplate: { title: "Fertilizer Dosage Report", title_i18n: {"en":"Fertilizer Dosage Report","tr":"Fertilizer Dosage Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Need = YieldTarget×RemovalRate.", "FertNeed = (Need-SoilSupply)/Efficiency.", "AppRate = FertNeed/(Content%/100). Cost = AppRate×Area×Price."],assumptionNotes_i18n:[{"en":"Need = YieldTarget×RemovalRate.","tr":"Need = YieldTarget×RemovalRate."},{"en":"FertNeed = (Need-SoilSupply)/Efficiency.","tr":"FertNeed = (Need-SoilSupply)/Efficiency."},{"en":"AppRate = FertNeed/(Content%/100). Cost = AppRate×Area×Price.","tr":"AppRate = FertNeed/(Content%/100). Cost = AppRate×Area×Price."}] },
};
