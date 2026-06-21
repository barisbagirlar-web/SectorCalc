/**
 * DYE REÇETE MALİYET — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DYERECIPECOST_SCHEMA: PremiumCalculatorSchema = {
  id: "dye-recipe-cost-analyzer",
  legacyPaidSlug: "dye-recipe-cost-analyzer",
  name: "DYE REÇETE MALİYET",
  sectorSlug: "general",
  category: "cost",
  painStatement: "DYE REÇETE MALİYET — premium analysis tool.",
  inputs: [
    { id: "flotte_orani", label: "Flotte Oranı", type: "number", required: true },
    { id: "kumas_agirlik", label: "Kumaş Ağırlık", type: "number", required: true },
    { id: "konsantrasyon", label: "Konsantrasyon", type: "array", required: true },
    { id: "dozaj", label: "Dozaj", type: "array", required: true },
    { id: "isitma", label: "Isıtma", type: "number", required: true },
    { id: "koi_esik", label: "KOI Eşik", type: "number", required: true },
    { id: "rft", label: "RFT", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__dye", label: "Cost_ Dye", unit: "currency", format: "currency" },
    { id: "cost__chem", label: "Cost_ Chem", unit: "currency", format: "currency" },
    { id: "cost__water", label: "Cost_ Water", unit: "currency", format: "currency" },
    { id: "cost__energy", label: "Cost_ Energy", unit: "currency", format: "currency" },
    { id: "cost__waste", label: "Cost_ Waste", unit: "currency", format: "currency" },
    { id: "total_batch", label: "Total Batch", unit: "currency", format: "currency" },
    { id: "r_f_t__savings", label: "R F T_ Savings", unit: "currency", format: "currency" },
    { id: "cost_per_kg", label: "Cost Per Kg", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.dye_recete_maliyet_analyzer_0", inputMap: { Conc: "conc", Price: "price", BathRatio: "bath_ratio" }, outputId: "cost__dye" },
    { formulaId: "custom.dye_recete_maliyet_analyzer_1", inputMap: { Dosage: "dosage", Price: "price" }, outputId: "cost__chem" },
    { formulaId: "custom.dye_recete_maliyet_analyzer_2", inputMap: { LiquorRatio: "liquor_ratio", Weight: "weight", WaterTariff: "water_tariff" }, outputId: "cost__water" },
    { formulaId: "custom.dye_recete_maliyet_analyzer_3", inputMap: { Heating: "heating", Holding: "holding", Drying: "drying" }, outputId: "cost__energy" },
    { formulaId: "custom.dye_recete_maliyet_analyzer_4", inputMap: { Effluent: "effluent", TreatCost: "treat_cost", Surcharge: "surcharge" }, outputId: "cost__waste" },
    { formulaId: "custom.dye_recete_maliyet_analyzer_5", inputMap: { Dye: "dye", Chem: "chem", Water: "water", Energy: "energy", Waste: "waste" }, outputId: "total_batch" },
    { formulaId: "custom.dye_recete_maliyet_analyzer_6", inputMap: { Rework: "rework", RFT: "rft" }, outputId: "r_f_t__savings" },
    { formulaId: "custom.dye_recete_maliyet_analyzer_7", inputMap: { TotalBatch: "total_batch", RFT_Savings: "rft", Weight: "weight" }, outputId: "cost_per_kg" },
  ],
  reportTemplate: {
    title: "DYE REÇETE MALİYET Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
