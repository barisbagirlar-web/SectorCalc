/**
 * Sulama Maliyet Check — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const IRRIGATIONCOSTCHECK_SCHEMA: PremiumCalculatorSchema = {
  id: "irrigation-cost-check-analyzer",
  legacyPaidSlug: "irrigation-cost-check-analyzer",
  name: "Sulama Maliyet Check",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Sulama Maliyet Check — premium analysis tool.",
  inputs: [
    { id: "etc_mmgun", label: "ETc mm/gün", type: "number", required: true },
    { id: "alan_dekar", label: "Alan dekar", type: "number", required: true },
    { id: "efektif_yagis_mm", label: "Efektif Yağış mm", type: "number", required: true },
    { id: "toplam_manometrik_yukseklik_m", label: "Toplam Manometrik Yükseklik m", type: "number", required: true },
    { id: "pompamotor_verimi", label: "Pompa/Motor Verimi", type: "number", required: true },
    { id: "elektrik_tarifesi_currencykwh", label: "Elektrik Tarifesi currency/kWh", type: "number", required: true },
    { id: "bakim_currencyda", label: "Bakım currency/da", type: "number", required: true },
  ],
  outputs: [
    { id: "water_requirement", label: "Water Requirement", unit: "currency", format: "currency" },
    { id: "pump_energy", label: "Pump Energy", unit: "currency", format: "currency" },
    { id: "energy_cost", label: "Energy Cost", unit: "currency", format: "currency" },
    { id: "maint_cost", label: "Maint Cost", unit: "currency", format: "currency" },
    { id: "total_irrigation_cost", label: "Total Irrigation Cost", unit: "currency", format: "currency" },
    { id: "cost_per_m3", label: "Cost Per M3", unit: "currency", format: "currency" },
    { id: "water_use_efficiency", label: "Water Use Efficiency", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.sulama_maliyet_check_analyzer_0", inputMap: { ETc: "e_tc", Area: "area", EffectiveRainfall: "effective_rainfall" }, outputId: "water_requirement" },
    { formulaId: "custom.sulama_maliyet_check_analyzer_1", inputMap: { WaterRequirement: "water_requirement", TotalHead: "total_head", PumpEff: "pump_eff", MotorEff: "motor_eff" }, outputId: "pump_energy" },
    { formulaId: "custom.sulama_maliyet_check_analyzer_2", inputMap: { PumpEnergy: "pump_energy", ElecRate: "elec_rate" }, outputId: "energy_cost" },
    { formulaId: "custom.sulama_maliyet_check_analyzer_3", inputMap: { Area: "area", MaintRatePerHa: "maint_rate_per_ha" }, outputId: "maint_cost" },
    { formulaId: "custom.sulama_maliyet_check_analyzer_4", inputMap: { EnergyCost: "energy_cost", MaintCost: "maint_cost", LaborCost: "labor_cost", Depreciation: "depreciation" }, outputId: "total_irrigation_cost" },
    { formulaId: "custom.sulama_maliyet_check_analyzer_5", inputMap: { TotalIrrigationCost: "total_irrigation_cost", WaterRequirement: "water_requirement" }, outputId: "cost_per_m3" },
    { formulaId: "custom.sulama_maliyet_check_analyzer_6", inputMap: { WaterRequirement: "water_requirement", Losses: "losses" }, outputId: "water_use_efficiency" },
  ],
  reportTemplate: {
    title: "Sulama Maliyet Check Report",
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
