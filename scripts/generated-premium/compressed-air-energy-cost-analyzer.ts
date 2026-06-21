/**
 * BASINÇLI HAVA ENERJİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const COMPRESSEDAIRENERGYCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "compressed-air-energy-cost-analyzer",
  legacyPaidSlug: "compressed-air-energy-cost-analyzer",
  name: "BASINÇLI HAVA ENERJİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "BASINÇLI HAVA ENERJİ — premium analysis tool.",
  inputs: [
    { id: "kompresor_gucu", label: "Kompresör Gücü", type: "number", required: true },
    { id: "calisma_saati", label: "Çalışma Saati", type: "number", required: true },
    { id: "yuk_orani", label: "Yük Oranı", type: "number", required: true },
    { id: "izotermalmotor_verimi", label: "İzotermal/Motor Verimi", type: "number", required: true },
    { id: "elektrik_tarifesi", label: "Elektrik Tarifesi", type: "number", required: true },
    { id: "asiri_basinc_dusumu", label: "Aşırı Basınç Düşümü", type: "number", required: true },
  ],
  outputs: [
    { id: "compressor_power", label: "Compressor Power", unit: "currency", format: "currency" },
    { id: "specific_power", label: "Specific Power", unit: "currency", format: "currency" },
    { id: "annual_energy_cost", label: "Annual Energy Cost", unit: "currency", format: "currency" },
    { id: "leakage_cost", label: "Leakage Cost", unit: "currency", format: "currency" },
    { id: "total_annual_cost", label: "Total Annual Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.basincli_hava_enerji_analyzer_0", inputMap: { DeltaP: "delta_p", Eff_isothermal: "eff_isothermal", Eff_motor: "eff_motor", Eff_drive: "eff_drive" }, outputId: "compressor_power" },
    { formulaId: "custom.basincli_hava_enerji_analyzer_1", inputMap: { CompressorPower: "compressor_power", Q_actual: "q_actual" }, outputId: "specific_power" },
    { formulaId: "custom.basincli_hava_enerji_analyzer_2", inputMap: { CompressorPower: "compressor_power", OpHours: "op_hours", ElecRate: "elec_rate", LoadFactor: "load_factor" }, outputId: "annual_energy_cost" },
    { formulaId: "custom.basincli_hava_enerji_analyzer_3", inputMap: { LeakFlow: "leak_flow", OpHours: "op_hours", SpecificPower: "specific_power", ElecRate: "elec_rate" }, outputId: "leakage_cost" },
    { formulaId: "custom.basincli_hava_enerji_analyzer_4", inputMap: { AnnualEnergyCost: "annual_energy_cost", LeakageCost: "leakage_cost", PressureDropCost: "pressure_drop_cost", UnloadWaste: "unload_waste", HeatRecoverySavings: "heat_recovery_savings" }, outputId: "total_annual_cost" },
  ],
  reportTemplate: {
    title: "BASINÇLI HAVA ENERJİ Report",
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
