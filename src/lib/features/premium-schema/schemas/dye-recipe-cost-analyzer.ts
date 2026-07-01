/**
 * Tool #33 — Dye Reçete Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DYE_RECIPE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "dye-recipe-cost-analyzer", legacyPaidSlug: "dye-recipe-cost-analyzer",
  name: "Dye Reçete Maliyet Analizi", name_i18n: {"en":"Dye Recipe Cost Analyzer","tr":"Dye Reçete Maliyet Analizi"}, sectorSlug: "textile", category: "cost",
  painStatement: "Boyarmadde reçetesinde fire ve kimyasal maliyeti kontrol edilmezse kg başına maliyet beklenenden yüksek çıkar.", painStatement_i18n: {"en":"Boyarmadde reçetesinde fire ve kimyasal maliyeti kontrol edilmezse kg başına maliyet beklenenden yüksek çıkar.","tr":"Boyarmadde reçetesinde fire ve kimyasal maliyeti kontrol edilmezse kg başına maliyet beklenenden yüksek çıkar."},
  inputs: [
    { id: "bathRatio", label: "Flotte Oranı", label_i18n: {"en":"Liquor ratio (liquid:goods)","tr":"Flotte Oranı"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Liquor ratio (liquid:goods)", expertMeaning_i18n: {"en":"Liquor ratio (liquid:goods)","tr":"flotte oranı"} },
    { id: "fabricWeight", label: "Kumaş Ağırlığı", label_i18n: {"en":"Fabric weight per batch","tr":"Kumaş Ağırlığı"}, type: "number", unit: "kg", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Fabric weight per batch", expertMeaning_i18n: {"en":"Fabric weight per batch","tr":"kumaş ağırlığı"} },
    { id: "dyeConcentrations", label: "Konsantrasyonlar (g/L, virgülle)", label_i18n: {"en":"Dye concentrations","tr":"Konsantrasyonlar (g/L, virgülle)"}, type: "number", unit: "g/L", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Dye concentrations", expertMeaning_i18n: {"en":"Dye concentrations","tr":"konsantrasyonlar (g/l, virgülle)"} },
    { id: "dyePrices", label: "Boyarmadde Fiyatları (USD/kg, virgülle)", label_i18n: {"en":"Dye price per kg","tr":"Boyarmadde Fiyatları (USD/kg, virgülle)"}, type: "number", unit: "USD/kg", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Dye price per kg", expertMeaning_i18n: {"en":"Dye price per kg","tr":"boyarmadde fiyatları (usd/kg, virgülle)"} },
    { id: "dosages", label: "Kimyasal Dozajları (g/L, virgülle)", label_i18n: {"en":"Chemical dosages","tr":"Kimyasal Dozajları (g/L, virgülle)"}, type: "number", unit: "g/L", array: true, required: false, validation: { min: 0 }, helper: "", expertMeaning: "Chemical dosages", expertMeaning_i18n: {"en":"Chemical dosages","tr":"kimyasal dozajları (g/l, virgülle)"} },
    { id: "chemPrices", label: "Kimyasal Fiyatları (USD/kg, virgülle)", label_i18n: {"en":"Chemical prices","tr":"Kimyasal Fiyatları (USD/kg, virgülle)"}, type: "number", unit: "USD/kg", array: true, required: false, validation: { min: 0 }, helper: "", expertMeaning: "Chemical prices", expertMeaning_i18n: {"en":"Chemical prices","tr":"kimyasal fiyatları (usd/kg, virgülle)"} },
    { id: "waterTariff", label: "Su Tarifesi", label_i18n: {"en":"Su Tarifesi","tr":"Su Tarifesi"}, type: "number", unit: "USD/m³", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Water cost per m³", expertMeaning_i18n: {"en":"Water cost per m³","tr":"Water cost per m³"} },
    { id: "heatingCost", label: "Isıtma Maliyeti", label_i18n: {"en":"Heating cost per batch","tr":"Isıtma Maliyeti"}, type: "number", unit: "USD/batch", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Heating cost per batch", expertMeaning_i18n: {"en":"Heating cost per batch","tr":"isıtma maliyeti"} },
    { id: "wasteTreatmentCost", label: "Atık Su Arıtma Maliyeti", label_i18n: {"en":"Effluent treatment cost","tr":"Atık Su Arıtma Maliyeti"}, type: "number", unit: "USD/m³", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Effluent treatment cost", expertMeaning_i18n: {"en":"Effluent treatment cost","tr":"atık su arıtma maliyeti"} },
    { id: "rftPct", label: "RFT Oranı (İlk Seferde Doğru)", label_i18n: {"en":"Right First Time percentage","tr":"RFT Oranı (İlk Seferde Doğru)"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Right First Time percentage", expertMeaning_i18n: {"en":"Right First Time percentage","tr":"rft oranı (i̇lk seferde doğru)"} },
    { id: "reworkCost", label: "Rework Maliyeti/Batch", label_i18n: {"en":"Rework Maliyeti/Batch","tr":"Rework Maliyeti/Batch"}, type: "number", unit: "USD", required: false, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Rework cost per batch", expertMeaning_i18n: {"en":"Rework cost per batch","tr":"Rework cost per batch"} },
  ],
  outputs: [
    { id: "totalBatchCost", label: "Toplam Batch Maliyeti", label_i18n: {"en":"Toplam Batch Maliyeti","tr":"Toplam Batch Maliyeti"}, unit: "USD/batch", format: "currency" },
    { id: "costPerKg", label: "Kg Başına Maliyet", label_i18n: {"en":"Kg Basna Maliyet","tr":"Kg Başına Maliyet"}, unit: "USD/kg", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "costPerKg", warning: 3, critical: 5, direction: "higher_is_bad", warningMessage: "Maliyet > $3/kg — optimizasyon potansiyeli var.", warningMessage_i18n: {"en":"Maliyet > $3/kg — optimizasyon potansiyeli var.","tr":"Maliyet > $3/kg — optimizasyon potansiyeli var."}, criticalMessage: "Maliyet > $5/kg — acil reçete optimizasyonu.", criticalMessage_i18n: {"en":"Maliyet > $5/kg — acil reçete optimizasyonu.","tr":"Maliyet > $5/kg — acil reçete optimizasyonu."} }],
  formulaPipeline: [
    { formulaId: "cost.dye_batch", inputMap: { dyeCost: "dyeConcentrations", chemCost: "dosages", waterCost: "waterTariff", energyCost: "heatingCost", wasteCost: "wasteTreatmentCost" }, outputId: "totalBatchCost" },
    { formulaId: "cost.dye_rft_savings", inputMap: {
        rework: "reworkCost",
        rft: "rftPct"
      }, outputId: "rftSavings" },
    { formulaId: "cost.dye_cost_per_kg", inputMap: { totalBatch: "totalBatchCost", rftSavings: "rftSavings", fabricWeight: "fabricWeight" }, outputId: "costPerKg" },
  ],
  reportTemplate: { title: "Dye Recipe Cost Report", title_i18n: {"en":"Dye Recipe Cost Report","tr":"Dye Recipe Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Dye cost = Σ(Conc×Price)/BathRatio×Weight/1000.", "Chem cost = Σ(Dosage×Price)×Volume/1000.", "Cost/kg = (TotalBatch+RFTSavings)/Weight."],assumptionNotes_i18n:[{"en":"Dye cost = Σ(Conc×Price)/BathRatio×Weight/1000.","tr":"Dye cost = Σ(Conc×Price)/BathRatio×Weight/1000."},{"en":"Chem cost = Σ(Dosage×Price)×Volume/1000.","tr":"Chem cost = Σ(Dosage×Price)×Volume/1000."},{"en":"Cost/kg = (TotalBatch+RFTSavings)/Weight.","tr":"Cost/kg = (TotalBatch+RFTSavings)/Weight."}] },
};
