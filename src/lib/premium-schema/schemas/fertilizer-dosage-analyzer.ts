/**
 * Tool #46 — Gübre Dozaj
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FERTILIZER_DOSAGE_SCHEMA: PremiumCalculatorSchema = {
  id: "fertilizer-dosage-analyzer", legacyPaidSlug: "fertilizer-dosage-analyzer",
  name: "Gübre Dozaj & Verim Optimizasyonu", sectorSlug: "food", category: "measurement",
  painStatement: "Gübre dozajı toprak analizine göre hesaplanmazsa ya eksik gübreleme verimi düşürür ya da fazla gübre çevre kirliliği yaratır.",
  inputs: [
    { id: "yieldTarget", label: "Hedef Verim", type: "number", unit: "ton/ha", required: true, smartDefault: 8, validation: { min: 0.1 }, helper: "", expertMeaning: "Target yield per hectare" },
    { id: "removalRate", label: "Kaldırma Oranı (N)", type: "number", unit: "kg/ton", required: true, smartDefault: 24, validation: { min: 0 }, helper: "", expertMeaning: "Nutrient removal rate per ton yield" },
    { id: "soilTestN", label: "Toprak N (ppm)", type: "number", unit: "ppm", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Soil test nitrogen" },
    { id: "convFactor", label: "Dönüşüm Faktörü", type: "number", unit: "", required: false, smartDefault: 2.24, validation: { min: 0 }, helper: "", expertMeaning: "ppm to kg/ha conversion" },
    { id: "efficiency", label: "Gübre Verimliliği", type: "number", unit: "%", required: true, smartDefault: 60, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Fertilizer use efficiency" },
    { id: "nutrientContentPct", label: "Gübre İçeriği (N)", type: "number", unit: "%", required: true, smartDefault: 46, validation: { min: 0.1, max: 100 }, helper: "", expertMeaning: "Fertilizer N content" },
    { id: "fieldArea", label: "Tarla Alanı", type: "number", unit: "ha", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Field area" },
    { id: "unitPrice", label: "Gübre Birim Fiyatı", type: "number", unit: "USD/kg", required: true, smartDefault: 0.8, validation: { min: 0 }, helper: "", expertMeaning: "Fertilizer unit price" },
    { id: "cropUptake", label: "Bitki Alım Miktarı", type: "number", unit: "kg/ha", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Crop uptake per ha" },
    { id: "leachingFactor", label: "Yıkanma Faktörü", type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Nitrate leaching factor" },
  ],
  outputs: [
    { id: "fertNeed", label: "Gübre İhtiyacı (Saf N)", unit: "kg/ha", format: "number" },
    { id: "appRate", label: "Uygulama Miktarı", unit: "kg/ha", format: "number" },
    { id: "totalCost", label: "Toplam Gübre Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalCost", warning: 5000, critical: 10000, direction: "higher_is_bad", warningMessage: "Gübre maliyeti > $5000 — alternatif gübreleme değerlendirilmeli.", criticalMessage: "Maliyet > $10000 — maliyet optimizasyonu acil." }],
  formulaPipeline: [
    { formulaId: "measurement.fertilizer_need", inputMap: { yieldTarget: "yieldTarget", removalRate: "removalRate" }, outputId: "fertNeed" },
    { formulaId: "measurement.fertilizer_application", inputMap: { fertNeed: "fertNeed", nutrientContentPct: "nutrientContentPct", efficiency: "efficiency" }, outputId: "appRate" },
    { formulaId: "cost.fertilizer_cost", inputMap: { appRate: "appRate", fieldArea: "fieldArea", unitPrice: "unitPrice" }, outputId: "totalCost" },
  ],
  reportTemplate: { title: "Fertilizer Dosage Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Need = YieldTarget×RemovalRate.", "FertNeed = (Need-SoilSupply)/Efficiency.", "AppRate = FertNeed/(Content%/100). Cost = AppRate×Area×Price."] },
};
