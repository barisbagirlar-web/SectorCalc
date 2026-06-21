/**
 * Mahsul Verim Kaybı Analizörü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CROPYIELDLOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "crop-yield-loss-analyzer",
  legacyPaidSlug: "crop-yield-loss-analyzer",
  name: "Mahsul Verim Kaybı Analizörü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Mahsul Verim Kaybı Analizörü — premium analysis tool.",
  inputs: [
    { id: "genetik_potansiyel_kgda", label: "Genetik Potansiyel kg/da", type: "number", required: true },
    { id: "cevre_faktoru", label: "Çevre Faktörü", type: "number", required: true },
    { id: "hasat_edilen_kg", label: "Hasat Edilen kg", type: "number", required: true },
    { id: "zararlihavabesin_kayip_oranlari", label: "Zararlı/Hava/Besin Kayıp Oranları", type: "number", required: true },
    { id: "piyasa_fiyati_currencykg", label: "Piyasa Fiyatı currency/kg", type: "number", required: true },
    { id: "mudahale_maliyeti", label: "Müdahale Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "potential_yield", label: "Potential Yield", unit: "currency", format: "currency" },
    { id: "actual_yield", label: "Actual Yield", unit: "currency", format: "currency" },
    { id: "yield_gap", label: "Yield Gap", unit: "currency", format: "currency" },
    { id: "loss__pest", label: "Loss_ Pest", unit: "currency", format: "currency" },
    { id: "loss__weather", label: "Loss_ Weather", unit: "currency", format: "currency" },
    { id: "loss__nutrient", label: "Loss_ Nutrient", unit: "currency", format: "currency" },
    { id: "financial_loss", label: "Financial Loss", unit: "currency", format: "currency" },
    { id: "r_o_i__intervention", label: "R O I_ Intervention", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.mahsul_verim_kaybi_analizoru_analyzer_0", inputMap: { GeneticPotential: "genetic_potential", EnvironmentFactor: "environment_factor" }, outputId: "potential_yield" },
    { formulaId: "custom.mahsul_verim_kaybi_analizoru_analyzer_1", inputMap: { HarvestedWeight: "harvested_weight", Area: "area" }, outputId: "actual_yield" },
    { formulaId: "custom.mahsul_verim_kaybi_analizoru_analyzer_2", inputMap: { PotentialYield: "potential_yield", ActualYield: "actual_yield" }, outputId: "yield_gap" },
    { formulaId: "custom.mahsul_verim_kaybi_analizoru_analyzer_3", inputMap: { PestDamagePct: "pest_damage_pct", PotentialYield: "potential_yield" }, outputId: "loss__pest" },
    { formulaId: "custom.mahsul_verim_kaybi_analizoru_analyzer_4", inputMap: { WeatherStressPct: "weather_stress_pct", PotentialYield: "potential_yield" }, outputId: "loss__weather" },
    { formulaId: "custom.mahsul_verim_kaybi_analizoru_analyzer_5", inputMap: { NutrientDeficiencyPct: "nutrient_deficiency_pct", PotentialYield: "potential_yield" }, outputId: "loss__nutrient" },
    { formulaId: "custom.mahsul_verim_kaybi_analizoru_analyzer_6", inputMap: { YieldGap: "yield_gap", MarketPrice: "market_price" }, outputId: "financial_loss" },
    { formulaId: "custom.mahsul_verim_kaybi_analizoru_analyzer_7", inputMap: { FinancialLoss_Recovered: "financial_loss__recovered", InterventionCost: "intervention_cost" }, outputId: "r_o_i__intervention" },
  ],
  reportTemplate: {
    title: "Mahsul Verim Kaybı Analizörü Report",
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
