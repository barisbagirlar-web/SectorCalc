import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CROP_YIELD_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "crop-yield-loss-analyzer", legacyPaidSlug: "crop-yield-loss-analyzer",
  name: "Mahsul Verim Kaybı Analizörü", sectorSlug: "food", category: "measurement",
  painStatement: "Verim kaybı ve finansal etkisi hesaplanmazsa, tarımsal müdahale kararları gecikir ve kayıp büyür.",
  inputs: [
    { id: "geneticPotential", label: "Genetik Potansiyel", type: "number", unit: "kg/da", required: true, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Genetic yield potential" },
    { id: "envFactor", label: "Çevre Faktörü", type: "number", unit: "", required: false, smartDefault: 0.8, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Environment factor" },
    { id: "harvestedWeight", label: "Hasat Edilen", type: "number", unit: "kg", required: true, smartDefault: 700, validation: { min: 0 }, helper: "", expertMeaning: "Harvested weight per unit" },
    { id: "area", label: "Alan", type: "number", unit: "da", required: true, smartDefault: 1, validation: { min: 0.1 }, helper: "", expertMeaning: "Cultivated area" },
    { id: "pestLossPct", label: "Zararlı Kaybı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Pest damage percentage" },
    { id: "weatherLossPct", label: "Hava Kaybı", type: "number", unit: "%", required: false, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Weather stress percentage" },
    { id: "nutrientLossPct", label: "Besin Kaybı", type: "number", unit: "%", required: false, smartDefault: 7, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Nutrient deficiency" },
    { id: "marketPrice", label: "Piyasa Fiyatı", type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Market price" },
    { id: "interventionCost", label: "Müdahale Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Intervention cost" },
  ],
  outputs: [
    { id: "potentialYield", label: "Potansiyel Verim", unit: "kg", format: "number" },
    { id: "actualYield", label: "Gerçek Verim", unit: "kg/da", format: "number" },
    { id: "yieldGap", label: "Verim Farkı", unit: "kg/da", format: "number" },
    { id: "financialLoss", label: "Finansal Kayıp", unit: "USD/da", format: "currency" },
    { id: "roiIntervention", label: "Müdahale ROI", unit: "", format: "number" },
  ],
  thresholds: [{ fieldId: "yieldGap", warning: 100, critical: 300, direction: "higher_is_bad", warningMessage: "Verim farkı > 100 kg/da — müdahale değerlendirilmeli.", criticalMessage: "Verim farkı > 300 kg/da — acil önlem gerekli." }],
  formulaPipeline: [
    { formulaId: "measurement.crop_potential_yield", inputMap: { geneticPotential: "geneticPotential", envFactor: "envFactor" }, outputId: "potentialYield" },
    { formulaId: "measurement.crop_actual_yield", inputMap: { harvestedWeight: "harvestedWeight", area: "area" }, outputId: "actualYield" },
    { formulaId: "measurement.crop_yield_gap", inputMap: { potentialYield: "potentialYield", actualYield: "actualYield" }, outputId: "yieldGap" },
    { formulaId: "cost.crop_financial_loss", inputMap: { yieldGap: "yieldGap", marketPrice: "marketPrice" }, outputId: "financialLoss" },
    { formulaId: "cost.crop_roi_intervention", inputMap: { financialLoss: "financialLoss", interventionCost: "interventionCost", pestLossPct: "pestLossPct", weatherLossPct: "weatherLossPct", nutrientLossPct: "nutrientLossPct" }, outputId: "roiIntervention" },
  ],
  reportTemplate: { title: "Mahsul Verim Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Potansiyel = Genetik × Çevre.", "Verim farkı = Potansiyel - Gerçek.", "Müdahale ROI = (Geri kazanılan - Maliyet) / Maliyet."] },
};
