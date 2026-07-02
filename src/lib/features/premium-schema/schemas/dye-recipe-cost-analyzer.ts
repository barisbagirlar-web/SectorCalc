
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DYE_RECIPE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "dye-recipe-cost-analyzer", legacyPaidSlug: "dye-recipe-cost-analyzer",
  name: "Dye Recipe Cost Analyzer", name_i18n: {"en":"Dye Recipe Cost Analyzer"}, sectorSlug: "textile", category: "cost",
  painStatement: "If waste and chemical cost in the dye recipe are not controlled, cost per kg turns out higher than expected.", painStatement_i18n: {"en":"If waste and chemical cost in the dye recipe are not controlled, cost per kg turns out higher than expected."},
  inputs: [
    { id: "bathRatio", label: "Liquor ratio (liquid:goods)", label_i18n: {"en":"Liquor ratio (liquid:goods)"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Liquor ratio (liquid:goods)", expertMeaning_i18n: {"en":"Liquor ratio (liquid:goods)"} },
    { id: "fabricWeight", label: "Fabric weight per batch", label_i18n: {"en":"Fabric weight per batch"}, type: "number", unit: "kg", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Fabric weight per batch", expertMeaning_i18n: {"en":"Fabric weight per batch"} },
    { id: "dyeConcentrations", label: "Dye concentrations", label_i18n: {"en":"Dye concentrations"}, type: "number", unit: "g/L", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Dye concentrations", expertMeaning_i18n: {"en":"Dye concentrations"} },
    { id: "dyePrices", label: "Dye price per kg", label_i18n: {"en":"Dye price per kg"}, type: "number", unit: "USD/kg", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Dye price per kg", expertMeaning_i18n: {"en":"Dye price per kg"} },
    { id: "dosages", label: "Chemical dosages", label_i18n: {"en":"Chemical dosages"}, type: "number", unit: "g/L", array: true, required: false, validation: { min: 0 }, helper: "", expertMeaning: "Chemical dosages", expertMeaning_i18n: {"en":"Chemical dosages"} },
    { id: "chemPrices", label: "Chemical prices", label_i18n: {"en":"Chemical prices"}, type: "number", unit: "USD/kg", array: true, required: false, validation: { min: 0 }, helper: "", expertMeaning: "Chemical prices", expertMeaning_i18n: {"en":"Chemical prices"} },
    { id: "waterTariff", label: "Water Tarifesi", label_i18n: {"en":"Water Tarifesi"}, type: "number", unit: "USD/m³", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Water cost per m³", expertMeaning_i18n: {"en":"Water cost per m³"} },
    { id: "heatingCost", label: "Heating cost per batch", label_i18n: {"en":"Heating cost per batch"}, type: "number", unit: "USD/batch", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Heating cost per batch", expertMeaning_i18n: {"en":"Heating cost per batch"} },
    { id: "wasteTreatmentCost", label: "Effluent treatment cost", label_i18n: {"en":"Effluent treatment cost"}, type: "number", unit: "USD/m³", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Effluent treatment cost", expertMeaning_i18n: {"en":"Effluent treatment cost"} },
    { id: "rftPct", label: "Right First Time percentage", label_i18n: {"en":"Right First Time percentage"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Right First Time percentage", expertMeaning_i18n: {"en":"Right First Time percentage"} },
    { id: "reworkCost", label: "Rework Cost/Batch", label_i18n: {"en":"Rework Cost/Batch"}, type: "number", unit: "USD", required: false, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Rework cost per batch", expertMeaning_i18n: {"en":"Rework cost per batch"} },
  ],
  outputs: [
    { id: "totalBatchCost", label: "Total Batch Cost", label_i18n: {"en":"Total Batch Cost"}, unit: "USD/batch", format: "currency" },
    { id: "costPerKg", label: "Kg Per Cost", label_i18n: {"en":"Kg Per Cost"}, unit: "USD/kg", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "costPerKg", warning: 3, critical: 5, direction: "higher_is_bad", warningMessage: "Cost > $3/kg — optimization potansiyeli var.", warningMessage_i18n: {"en":"Cost > $3/kg — optimization potansiyeli var."}, criticalMessage: "Cost > $5/kg — urgent recipe optimizasyonu.", criticalMessage_i18n: {"en":"Cost > $5/kg — urgent recipe optimizasyonu."} }],
  formulaPipeline: [
    { formulaId: "cost.dye_material_cost", inputMap: { concentrations: "dyeConcentrations", prices: "dyePrices", bathRatio: "bathRatio", fabricWeight: "fabricWeight" }, outputId: "dyeCost" },
    { formulaId: "cost.dye_material_cost", inputMap: { concentrations: "dosages", prices: "chemPrices", bathRatio: "bathRatio", fabricWeight: "fabricWeight" }, outputId: "chemCost" },
    { formulaId: "cost.dye_batch", inputMap: { dyeCost: "dyeCost", chemCost: "chemCost", waterCost: "waterTariff", energyCost: "heatingCost", wasteCost: "wasteTreatmentCost" }, outputId: "totalBatchCost" },
    { formulaId: "cost.dye_rft_savings", inputMap: {
        rework: "reworkCost",
        rft: "rftPct"
      }, outputId: "rftSavings" },
    { formulaId: "cost.dye_cost_per_kg", inputMap: { totalBatch: "totalBatchCost", rftSavings: "rftSavings", fabricWeight: "fabricWeight" }, outputId: "costPerKg" },
  ],
  reportTemplate: { title: "Dye Recipe Cost Report", title_i18n: {"en":"Dye Recipe Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Dye cost = Σ(Conc×Price)/BathRatio×Weight/1000.", "Chem cost = Σ(Dosage×Price)×Volume/1000.", "Cost/kg = (TotalBatch+RFTSavings)/Weight."],assumptionNotes_i18n:[{"en":"Dye cost = Σ(Conc×Price)/BathRatio×Weight/1000."},{"en":"Chem cost = Σ(Dosage×Price)×Volume/1000."},{"en":"Cost/kg = (TotalBatch+RFTSavings)/Weight."}] },
};
