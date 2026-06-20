/**
 * Tool #33 — Dye Reçete Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const DYE_RECIPE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "dye-recipe-cost-analyzer", legacyPaidSlug: "dye-recipe-cost-analyzer",
  name: "Dye Reçete Maliyet Analizi", sectorSlug: "textile", category: "cost",
  painStatement: "Boyarmadde reçetesinde fire ve kimyasal maliyeti kontrol edilmezse kg başına maliyet beklenenden yüksek çıkar.",
  inputs: [
    { id: "bathRatio", label: "Flotte Oranı", type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Liquor ratio (liquid:goods)" },
    { id: "fabricWeight", label: "Kumaş Ağırlığı", type: "number", unit: "kg", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Fabric weight per batch" },
    { id: "dyeConcentrations", label: "Konsantrasyonlar (g/L, virgülle)", type: "number", unit: "g/L", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Dye concentrations" },
    { id: "dyePrices", label: "Boyarmadde Fiyatları (USD/kg, virgülle)", type: "number", unit: "USD/kg", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Dye price per kg" },
    { id: "dosages", label: "Kimyasal Dozajları (g/L, virgülle)", type: "number", unit: "g/L", array: true, required: false, validation: { min: 0 }, helper: "", expertMeaning: "Chemical dosages" },
    { id: "chemPrices", label: "Kimyasal Fiyatları (USD/kg, virgülle)", type: "number", unit: "USD/kg", array: true, required: false, validation: { min: 0 }, helper: "", expertMeaning: "Chemical prices" },
    { id: "waterTariff", label: "Su Tarifesi", type: "number", unit: "USD/m³", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Water cost per m³" },
    { id: "heatingCost", label: "Isıtma Maliyeti", type: "number", unit: "USD/batch", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Heating cost per batch" },
    { id: "wasteTreatmentCost", label: "Atık Su Arıtma Maliyeti", type: "number", unit: "USD/m³", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Effluent treatment cost" },
    { id: "rftPct", label: "RFT Oranı (İlk Seferde Doğru)", type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Right First Time percentage" },
    { id: "reworkCost", label: "Rework Maliyeti/Batch", type: "number", unit: "USD", required: false, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Rework cost per batch" },
  ],
  outputs: [
    { id: "totalBatchCost", label: "Toplam Batch Maliyeti", unit: "USD/batch", format: "currency" },
    { id: "costPerKg", label: "Kg Başına Maliyet", unit: "USD/kg", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "costPerKg", warning: 3, critical: 5, direction: "higher_is_bad", warningMessage: "Maliyet > $3/kg — optimizasyon potansiyeli var.", criticalMessage: "Maliyet > $5/kg — acil reçete optimizasyonu." }],
  formulaPipeline: [
    { formulaId: "cost.dye_batch", inputMap: { dyeCost: "dyeConcentrations", chemCost: "dosages", waterCost: "waterTariff", energyCost: "heatingCost", wasteCost: "wasteTreatmentCost" }, outputId: "totalBatchCost" },
    { formulaId: "cost.dye_rft_savings", inputMap: { reworkCost: "reworkCost", rftPct: "rftPct" }, outputId: "rftSavings" },
    { formulaId: "cost.dye_cost_per_kg", inputMap: { totalBatch: "totalBatchCost", rftSavings: "rftSavings", fabricWeight: "fabricWeight" }, outputId: "costPerKg" },
  ],
  reportTemplate: { title: "Dye Recipe Cost Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Dye cost = Σ(Conc×Price)/BathRatio×Weight/1000.", "Chem cost = Σ(Dosage×Price)×Volume/1000.", "Cost/kg = (TotalBatch+RFTSavings)/Weight."] },
};
