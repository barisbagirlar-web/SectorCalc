import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CROP_YIELD_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "crop-yield-loss-analyzer", legacyPaidSlug: "crop-yield-loss-analyzer",
  name: "Crop Yield Loss Analyzer", name_i18n: {"en":"Crop Yield Loss Analyzer"}, sectorSlug: "food", category: "measurement",
  painStatement: "Verim loss ve finansal etkisi hesaplanmazsa, tarimsal mudahale kararlari gecikir ve kayip buyur.", painStatement_i18n: {"en":"If Efficiency Loss and its financial impact are not calculated, agricultural intervention decisions are delayed and losses grow."},
  inputs: [
    { id: "geneticPotential", label: "Genetik Potansiyel", label_i18n: {"en":"Genetik Potansiyel"}, type: "number", unit: "kg/da", required: true, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Genetic yield potential", expertMeaning_i18n: {"en":"Genetic yield potential"} },
    { id: "envFactor", label: "Environment factor", label_i18n: {"en":"Environment factor"}, type: "number", unit: "", required: false, smartDefault: 0.8, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Environment factor", expertMeaning_i18n: {"en":"Environment factor"} },
    { id: "harvestedWeight", label: "Hasat Edilen", label_i18n: {"en":"Hasat Edilen"}, type: "number", unit: "kg", required: true, smartDefault: 700, validation: { min: 0 }, helper: "", expertMeaning: "Harvested weight per unit", expertMeaning_i18n: {"en":"Harvested weight per unit"} },
    { id: "area", label: "Alan", label_i18n: {"en":"Alan"}, type: "number", unit: "da", required: true, smartDefault: 1, validation: { min: 0.1 }, helper: "", expertMeaning: "Cultivated area", expertMeaning_i18n: {"en":"Cultivated area"} },
    { id: "pestLossPct", label: "Pest damage percentage", label_i18n: {"en":"Pest damage percentage"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Pest damage percentage", expertMeaning_i18n: {"en":"Pest damage percentage"} },
    { id: "weatherLossPct", label: "Weather stress percentage", label_i18n: {"en":"Weather stress percentage"}, type: "number", unit: "%", required: false, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Weather stress percentage", expertMeaning_i18n: {"en":"Weather stress percentage"} },
    { id: "nutrientLossPct", label: "Nutrient deficiency", label_i18n: {"en":"Nutrient deficiency"}, type: "number", unit: "%", required: false, smartDefault: 7, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Nutrient deficiency", expertMeaning_i18n: {"en":"Nutrient deficiency"} },
    { id: "marketPrice", label: "Market price", label_i18n: {"en":"Market price"}, type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Market price", expertMeaning_i18n: {"en":"Market price"} },
    { id: "interventionCost", label: "Mudahale Maliyeti", label_i18n: {"en":"Intervention cost"}, type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Intervention cost", expertMeaning_i18n: {"en":"Intervention cost"} },
  ],
  outputs: [
    { id: "potentialYield", label: "Potansiyel Verim", label_i18n: {"en":"Potansiyel Efficiency"}, unit: "kg", format: "number" },
    { id: "actualYield", label: "Gercek Verim", label_i18n: {"en":"Actual Efficiency"}, unit: "kg/da", format: "number" },
    { id: "yieldGap", label: "Verim Fark", label_i18n: {"en":"Efficiency difference"}, unit: "kg/da", format: "number" },
    { id: "financialLoss", label: "Finansal Kayp", label_i18n: {"en":"Finansal Loss"}, unit: "USD/da", format: "currency" },
    { id: "roiIntervention", label: "Mudahale ROI", label_i18n: {"en":"intervention ROI"}, unit: "", format: "number" },
  ],
  thresholds: [{ fieldId: "yieldGap", warning: 100, critical: 300, direction: "higher_is_bad", warningMessage: "Verim farki > 100 kg/da — mudahale degerlendirilmeli.", warningMessage_i18n: {"en":"Efficiency difference > 100 kg/da — intervention should be evaluated."}, criticalMessage: "Verim farki > 300 kg/da — acil onlem gerekli.", criticalMessage_i18n: {"en":"Efficiency difference > 300 kg/da — urgent measure required."} }],
  formulaPipeline: [
    { formulaId: "measurement.crop_potential_yield", inputMap: {
        area: "geneticPotential",
        potentialPerHa: "envFactor"
      }, outputId: "potentialYield" },
    { formulaId: "measurement.crop_actual_yield", inputMap: {
        area: "area",
        actualPerHa: "harvestedWeight"
      }, outputId: "actualYield" },
    { formulaId: "measurement.crop_yield_gap", inputMap: { potentialYield: "potentialYield", actualYield: "actualYield" }, outputId: "yieldGap" },
    { formulaId: "cost.crop_financial_loss", inputMap: {
        yieldGap: "yieldGap",
        pricePerTon: "marketPrice"
      }, outputId: "financialLoss" },
    { formulaId: "cost.crop_roi_intervention", inputMap: { financialLoss: "financialLoss", interventionCost: "interventionCost", pestLossPct: "pestLossPct", weatherLossPct: "weatherLossPct", nutrientLossPct: "nutrientLossPct" }, outputId: "roiIntervention" },
  ],
  reportTemplate: { title: "Mahsul Verim Raporu", title_i18n: {"en":"Mahsul Efficiency Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Potansiyel = Genetik × Cevre.", "Verim farki = Potansiyel - Gercek.", "Mudahale ROI = (Geri kazanilan - Maliyet) / Maliyet."],assumptionNotes_i18n:[{"en":"Potential = Genetic × Environment."},{"en":"Yield difference = Potential - Actual."},{"en":"Intervention ROI = (Recovered - Cost) / Cost."}] },
};
