/**
 * Tohum Oranı — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SEEDRATE_SCHEMA: PremiumCalculatorSchema = {
  id: "seed-rate-analyzer",
  legacyPaidSlug: "seed-rate-analyzer",
  name: "Tohum Oranı",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Tohum Oranı — premium analysis tool.",
  inputs: [
    { id: "alan_m2", label: "Alan m2", type: "number", required: true },
    { id: "hedef_bitki_sayisi_m2", label: "Hedef Bitki Sayısı m2", type: "number", required: true },
    { id: "cimlenmetarla_cikis_orani", label: "Çimlenme/Tarla Çıkış Oranı", type: "number", required: true },
    { id: "tohum_kg_fiyati", label: "Tohum kg Fiyatı", type: "number", required: true },
    { id: "mahsul_piyasa_fiyati_currencykg", label: "Mahsul Piyasa Fiyatı currency/kg", type: "number", required: true },
    { id: "hedef_verim_kg", label: "Hedef Verim kg", type: "number", required: true },
  ],
  outputs: [
    { id: "target_plant_population", label: "Target Plant Population", unit: "currency", format: "currency" },
    { id: "seed_requirement", label: "Seed Requirement", unit: "currency", format: "currency" },
    { id: "seed_cost", label: "Seed Cost", unit: "currency", format: "currency" },
    { id: "optimal_yield", label: "Optimal Yield", unit: "currency", format: "currency" },
    { id: "financial_loss__under", label: "Financial Loss_ Under", unit: "currency", format: "currency" },
    { id: "financial_loss__over", label: "Financial Loss_ Over", unit: "currency", format: "currency" },
    { id: "r_o_i__seed", label: "R O I_ Seed", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.tohum_orani_analyzer_0", inputMap: { Area: "area", DesiredPlantsPerSqm: "desired_plants_per_sqm" }, outputId: "target_plant_population" },
    { formulaId: "custom.tohum_orani_analyzer_1", inputMap: { TargetPlantPopulation: "target_plant_population", GerminationRate: "germination_rate", FieldEmergenceRate: "field_emergence_rate" }, outputId: "seed_requirement" },
    { formulaId: "custom.tohum_orani_analyzer_2", inputMap: { SeedRequirement: "seed_requirement", PricePerKg: "price_per_kg" }, outputId: "seed_cost" },
    { formulaId: "custom.tohum_orani_analyzer_3", inputMap: { PlantPopulation: "plant_population", SoilFertility: "soil_fertility", Water: "water" }, outputId: "optimal_yield" },
    { formulaId: "custom.tohum_orani_analyzer_4", inputMap: { TargetYield: "target_yield", ActualYield: "actual_yield", CropPrice: "crop_price" }, outputId: "financial_loss__under" },
    { formulaId: "custom.tohum_orani_analyzer_5", inputMap: { ActualSeed: "actual_seed", OptimalSeed: "optimal_seed", SeedCost: "seed_cost" }, outputId: "financial_loss__over" },
    { formulaId: "custom.tohum_orani_analyzer_6", inputMap: { OptimalYield: "optimal_yield", CropPrice: "crop_price", SeedCost: "seed_cost" }, outputId: "r_o_i__seed" },
  ],
  reportTemplate: {
    title: "Tohum Oranı Report",
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
