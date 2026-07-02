
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FERTILIZER_DOSAGE_SCHEMA: PremiumCalculatorSchema = {
  id: "fertilizer-dosage-analyzer", legacyPaidSlug: "fertilizer-dosage-analyzer",
  name: "Fertilizer Dosage & Yield Optimization", name_i18n: {"en":"Fertilizer Dosage & Yield Optimization"}, sectorSlug: "food", category: "measurement",
  painStatement: "If fertilizer dosage is not calculated per soil analysis, either insufficient fertilization reduces efficiency or excess fertilizer creates environmental pollution.", painStatement_i18n: {"en":"If fertilizer dosage is not calculated per soil analysis, either insufficient fertilization reduces efficiency or excess fertilizer creates environmental pollution."},
  inputs: [
    {
      id: "eff",
      label: "Eff",
      label_i18n: { en: "Eff" },
      type: "number",
      unit: "-",

      group: "General"
    },
    { id: "yieldTarget", label: "Hedef Efficiency", label_i18n: {"en":"Hedef Efficiency"}, type: "number", unit: "ton/ha", required: true, smartDefault: 8, validation: { min: 0.1 }, helper: "", expertMeaning: "Target yield per hectare", expertMeaning_i18n: {"en":"Target yield per hectare"} },
    { id: "removalRate", label: "Nutrient removal rate per ton yield", label_i18n: {"en":"Nutrient removal rate per ton yield"}, type: "number", unit: "kg/ton", required: true, smartDefault: 24, validation: { min: 0 }, helper: "", expertMeaning: "Nutrient removal rate per ton yield", expertMeaning_i18n: {"en":"Nutrient removal rate per ton yield"} },
    { id: "soilTestN", label: "Toprak N (PPM)", label_i18n: {"en":"Toprak N (PPM)"}, type: "number", unit: "ppm", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Soil test nitrogen", expertMeaning_i18n: {"en":"Soil test nitrogen"} },
    { id: "convFactor", label: "PPM to kg/ha conversion", label_i18n: {"en":"PPM to kg/ha conversion"}, type: "number", unit: "scalar", required: false, smartDefault: 2.24, validation: { min: 0 }, helper: "", expertMeaning: "PPM to kg/ha conversion", expertMeaning_i18n: {"en":"PPM to kg/ha conversion"} },
    { id: "efficiency", label: "Fertilizer use efficiency", label_i18n: {"en":"Fertilizer use efficiency"}, type: "number", unit: "%", required: true, smartDefault: 60, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Fertilizer use efficiency", expertMeaning_i18n: {"en":"Fertilizer use efficiency"} },
    { id: "nutrientContentPct", label: "Fertilizer N content", label_i18n: {"en":"Fertilizer N content"}, type: "number", unit: "%", required: true, smartDefault: 46, validation: { min: 0.1, max: 100 }, helper: "", expertMeaning: "Fertilizer N content", expertMeaning_i18n: {"en":"Fertilizer N content"} },
    { id: "fieldArea", label: "Field area", label_i18n: {"en":"Field area"}, type: "number", unit: "ha", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Field area", expertMeaning_i18n: {"en":"Field area"} },
    { id: "unitPrice", label: "Fertilizer unit price", label_i18n: {"en":"Fertilizer unit price"}, type: "number", unit: "USD/kg", required: true, smartDefault: 0.8, validation: { min: 0 }, helper: "", expertMeaning: "Fertilizer unit price", expertMeaning_i18n: {"en":"Fertilizer unit price"} },
    { id: "cropUptake", label: "Crop uptake per ha", label_i18n: {"en":"Crop uptake per ha"}, type: "number", unit: "kg/ha", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Crop uptake per ha", expertMeaning_i18n: {"en":"Crop uptake per ha"} },
    { id: "leachingFactor", label: "Nitrate leaching factor", label_i18n: {"en":"Nitrate leaching factor"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Nitrate leaching factor", expertMeaning_i18n: {"en":"Nitrate leaching factor"} },
  ],
  outputs: [
    { id: "fertNeed", label: "Gubre Ihtiyac (Saf N)", label_i18n: {"en":"Gubre Ihtiyac (Saf N)"}, unit: "kg/ha", format: "number" },
    { id: "appRate", label: "application Miktar", label_i18n: {"en":"application Miktar"}, unit: "kg/ha", format: "number" },
    { id: "totalCost", label: "Total Gubre Cost", label_i18n: {"en":"Total Gubre Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalCost", warning: 5000, critical: 10000, direction: "higher_is_bad", warningMessage: "Fertilizer Cost > $5000 - alternative fertilization should be evaluated.", warningMessage_i18n: {"en":"Fertilizer Cost > $5000 - alternative fertilization should be evaluated."}, criticalMessage: "Cost > $10000 - Cost optimizasyonu acil.", criticalMessage_i18n: {"en":"Cost > $10000 - Cost optimizasyonu acil."} }],
  formulaPipeline: [
    { formulaId: "measurement.fertilizer_need", inputMap: {
        nutReq: "yieldTarget",
        soilSupp: "removalRate"
      ,
        eff: "eff"}, outputId: "fertNeed" },
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
  reportTemplate: { title: "Fertilizer Dosage Report", title_i18n: {"en":"Fertilizer Dosage Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Need = YieldTarget×RemovalRate.", "FertNeed = (Need-SoilSupply)/Efficiency.", "AppRate = FertNeed/(Content%/100). Cost = AppRate×Area×Price."],assumptionNotes_i18n:[{"en":"Need = YieldTarget×RemovalRate."},{"en":"FertNeed = (Need-SoilSupply)/Efficiency."},{"en":"AppRate = FertNeed/(Content%/100). Cost = AppRate×Area×Price."}] },
};
