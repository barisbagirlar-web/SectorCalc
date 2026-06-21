/**
 * Vakum Kaçağı Enerji Kaybı — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const VACUUMLEAKENERGY_SCHEMA: PremiumCalculatorSchema = {
  id: "vacuum-leak-energy-analyzer",
  legacyPaidSlug: "vacuum-leak-energy-analyzer",
  name: "Vakum Kaçağı Enerji Kaybı",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Vakum Kaçağı Enerji Kaybı — premium analysis tool.",
  inputs: [
    { id: "sistem_hacmi_m3", label: "Sistem Hacmi m3", type: "number", required: true },
    { id: "basinc_dusumu_deltap_bar", label: "Basınç Düşümü DeltaP bar", type: "number", required: true },
    { id: "sure_deltat_sn", label: "Süre DeltaT sn", type: "number", required: true },
    { id: "atmosferik_basinc", label: "Atmosferik Basınç", type: "number", required: true },
    { id: "pompa_verimi", label: "Pompa Verimi", type: "number", required: true },
    { id: "yillik_saat", label: "Yıllık Saat", type: "number", required: true },
    { id: "elektrik_tarifesi", label: "Elektrik Tarifesi", type: "number", required: true },
    { id: "emisyon_faktoru", label: "Emisyon Faktörü", type: "number", required: true },
  ],
  outputs: [
    { id: "leak_rate", label: "Leak Rate", unit: "currency", format: "currency" },
    { id: "power_loss_k_w", label: "Power Loss_k W", unit: "currency", format: "currency" },
    { id: "annual_energy_loss", label: "Annual Energy Loss", unit: "currency", format: "currency" },
    { id: "cost_of_leak", label: "Cost Of Leak", unit: "currency", format: "currency" },
    { id: "pump_capacity_waste", label: "Pump Capacity Waste", unit: "currency", format: "currency" },
    { id: "carbon_emissions", label: "Carbon Emissions", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.vakum_kacagi_enerji_kaybi_analyzer_0", inputMap: { Volume: "volume", DeltaP: "delta_p", DeltaT: "delta_t" }, outputId: "leak_rate" },
    { formulaId: "custom.vakum_kacagi_enerji_kaybi_analyzer_1", inputMap: { LeakRate: "leak_rate", P_Atmospheric: "p__atmospheric", PumpEff: "pump_eff" }, outputId: "power_loss_k_w" },
    { formulaId: "custom.vakum_kacagi_enerji_kaybi_analyzer_2", inputMap: { PowerLoss_kW: "power_loss_k_w", OperatingHours: "operating_hours" }, outputId: "annual_energy_loss" },
    { formulaId: "custom.vakum_kacagi_enerji_kaybi_analyzer_3", inputMap: { AnnualEnergyLoss: "annual_energy_loss", ElecRate: "elec_rate" }, outputId: "cost_of_leak" },
    { formulaId: "custom.vakum_kacagi_enerji_kaybi_analyzer_4", inputMap: { LeakRate: "leak_rate", TotalPumpCapacity: "total_pump_capacity" }, outputId: "pump_capacity_waste" },
    { formulaId: "custom.vakum_kacagi_enerji_kaybi_analyzer_5", inputMap: { AnnualEnergyLoss: "annual_energy_loss", GridEmissionFactor: "grid_emission_factor" }, outputId: "carbon_emissions" },
  ],
  reportTemplate: {
    title: "Vakum Kaçağı Enerji Kaybı Report",
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
