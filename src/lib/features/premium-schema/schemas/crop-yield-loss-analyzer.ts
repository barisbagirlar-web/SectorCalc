import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CROP_YIELD_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "crop-yield-loss-analyzer", legacyPaidSlug: "crop-yield-loss-analyzer",
  name: "Mahsul Verim Kaybı Analizörü", name_i18n: {"en":"Mahsul Verim Kaybi Analizoru","tr":"Mahsul Verim Kaybı Analizörü"}, sectorSlug: "food", category: "measurement",
  painStatement: "Verim kaybı ve finansal etkisi hesaplanmazsa, tarımsal müdahale kararları gecikir ve kayıp büyür.", painStatement_i18n: {"en":"Verim kaybı ve finansal etkisi hesaplanmazsa, tarımsal müdahale kararları gecikir ve kayıp büyür.","tr":"Verim kaybı ve finansal etkisi hesaplanmazsa, tarımsal müdahale kararları gecikir ve kayıp büyür."},
  inputs: [
    { id: "geneticPotential", label: "Genetik Potansiyel", label_i18n: {"en":"Genetik Potansiyel","tr":"Genetik Potansiyel"}, type: "number", unit: "kg/da", required: true, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Genetic yield potential", expertMeaning_i18n: {"en":"Genetic yield potential","tr":"Genetic yield potential"} },
    { id: "envFactor", label: "Çevre Faktörü", label_i18n: {"en":"Environment factor","tr":"Çevre Faktörü"}, type: "number", unit: "", required: false, smartDefault: 0.8, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Environment factor", expertMeaning_i18n: {"en":"Environment factor","tr":"çevre faktörü"} },
    { id: "harvestedWeight", label: "Hasat Edilen", label_i18n: {"en":"Hasat Edilen","tr":"Hasat Edilen"}, type: "number", unit: "kg", required: true, smartDefault: 700, validation: { min: 0 }, helper: "", expertMeaning: "Harvested weight per unit", expertMeaning_i18n: {"en":"Harvested weight per unit","tr":"Harvested weight per unit"} },
    { id: "area", label: "Alan", label_i18n: {"en":"Alan","tr":"Alan"}, type: "number", unit: "da", required: true, smartDefault: 1, validation: { min: 0.1 }, helper: "", expertMeaning: "Cultivated area", expertMeaning_i18n: {"en":"Cultivated area","tr":"Cultivated area"} },
    { id: "pestLossPct", label: "Zararlı Kaybı", label_i18n: {"en":"Pest damage percentage","tr":"Zararlı Kaybı"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Pest damage percentage", expertMeaning_i18n: {"en":"Pest damage percentage","tr":"zararlı kaybı"} },
    { id: "weatherLossPct", label: "Hava Kaybı", label_i18n: {"en":"Weather stress percentage","tr":"Hava Kaybı"}, type: "number", unit: "%", required: false, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Weather stress percentage", expertMeaning_i18n: {"en":"Weather stress percentage","tr":"hava kaybı"} },
    { id: "nutrientLossPct", label: "Besin Kaybı", label_i18n: {"en":"Nutrient deficiency","tr":"Besin Kaybı"}, type: "number", unit: "%", required: false, smartDefault: 7, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Nutrient deficiency", expertMeaning_i18n: {"en":"Nutrient deficiency","tr":"besin kaybı"} },
    { id: "marketPrice", label: "Piyasa Fiyatı", label_i18n: {"en":"Market price","tr":"Piyasa Fiyatı"}, type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Market price", expertMeaning_i18n: {"en":"Market price","tr":"piyasa fiyatı"} },
    { id: "interventionCost", label: "Müdahale Maliyeti", label_i18n: {"en":"Intervention cost","tr":"Müdahale Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Intervention cost", expertMeaning_i18n: {"en":"Intervention cost","tr":"müdahale maliyeti"} },
  ],
  outputs: [
    { id: "potentialYield", label: "Potansiyel Verim", label_i18n: {"en":"Potansiyel Verim","tr":"Potansiyel Verim"}, unit: "kg", format: "number" },
    { id: "actualYield", label: "Gerçek Verim", label_i18n: {"en":"Gercek Verim","tr":"Gerçek Verim"}, unit: "kg/da", format: "number" },
    { id: "yieldGap", label: "Verim Farkı", label_i18n: {"en":"Verim Fark","tr":"Verim Farkı"}, unit: "kg/da", format: "number" },
    { id: "financialLoss", label: "Finansal Kayıp", label_i18n: {"en":"Finansal Kayp","tr":"Finansal Kayıp"}, unit: "USD/da", format: "currency" },
    { id: "roiIntervention", label: "Müdahale ROI", label_i18n: {"en":"Mudahale ROI","tr":"Müdahale ROI"}, unit: "", format: "number" },
  ],
  thresholds: [{ fieldId: "yieldGap", warning: 100, critical: 300, direction: "higher_is_bad", warningMessage: "Verim farkı > 100 kg/da — müdahale değerlendirilmeli.", warningMessage_i18n: {"en":"Verim farkı > 100 kg/da — müdahale değerlendirilmeli.","tr":"Verim farkı > 100 kg/da — müdahale değerlendirilmeli."}, criticalMessage: "Verim farkı > 300 kg/da — acil önlem gerekli.", criticalMessage_i18n: {"en":"Verim farkı > 300 kg/da — acil önlem gerekli.","tr":"Verim farkı > 300 kg/da — acil önlem gerekli."} }],
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
  reportTemplate: { title: "Mahsul Verim Raporu", title_i18n: {"en":"Mahsul Verim Raporu","tr":"Mahsul Verim Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Potansiyel = Genetik × Çevre.", "Verim farkı = Potansiyel - Gerçek.", "Müdahale ROI = (Geri kazanılan - Maliyet) / Maliyet."],assumptionNotes_i18n:[{"en":"Potansiyel = Genetik × Çevre.","tr":"Potansiyel = Genetik × Çevre."},{"en":"Verim farkı = Potansiyel - Gerçek.","tr":"Verim farkı = Potansiyel - Gerçek."},{"en":"Müdahale ROI = (Geri kazanılan - Maliyet) / Maliyet.","tr":"Müdahale ROI = (Geri kazanılan - Maliyet) / Maliyet."}] },
};
