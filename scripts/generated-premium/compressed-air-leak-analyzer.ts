/**
 * Kompresör Kaçağı Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const COMPRESSEDAIRLEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "compressed-air-leak-analyzer",
  legacyPaidSlug: "compressed-air-leak-analyzer",
  name: "Kompresör Kaçağı Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kompresör Kaçağı Maliyet — premium analysis tool.",
  inputs: [
    { id: "kacak_capi_d", label: "Kaçak Çapı d", type: "number", required: true },
    { id: "hat_basinci", label: "Hat Basıncı", type: "number", required: true },
    { id: "kacak_sayisi", label: "Kaçak Sayısı", type: "number", required: true },
    { id: "kompresor_verimi", label: "Kompresör Verimi", type: "number", required: true },
    { id: "yillik_calisma_saati", label: "Yıllık Çalışma Saati", type: "number", required: true },
    { id: "elektrik_tarifesi", label: "Elektrik Tarifesi", type: "number", required: true },
    { id: "tamir_maliyeti", label: "Tamir Maliyeti", type: "number", required: true },
    { id: "emisyon_faktoru", label: "Emisyon Faktörü", type: "number", required: true },
  ],
  outputs: [
    { id: "leak_flow__c_f_m", label: "Leak Flow_ C F M", unit: "currency", format: "currency" },
    { id: "power__loss_k_w", label: "Power_ Loss_k W", unit: "currency", format: "currency" },
    { id: "annual_energy_loss", label: "Annual Energy Loss", unit: "currency", format: "currency" },
    { id: "cost__leak", label: "Cost_ Leak", unit: "currency", format: "currency" },
    { id: "total_leak_cost", label: "Total Leak Cost", unit: "currency", format: "currency" },
    { id: "carbon_emissions", label: "Carbon Emissions", unit: "currency", format: "currency" },
    { id: "payback__repair", label: "Payback_ Repair", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kompresor_kacagi_maliyet_analyzer_0", inputMap: { P_Line: "p__line", T_Abs: "t__abs" }, outputId: "leak_flow__c_f_m" },
    { formulaId: "custom.kompresor_kacagi_maliyet_analyzer_1", inputMap: { LeakFlow_CFM: "leak_flow__c_f_m", P_Line: "p__line", Eff_Compressor: "eff__compressor" }, outputId: "power__loss_k_w" },
    { formulaId: "custom.kompresor_kacagi_maliyet_analyzer_2", inputMap: { Power_Loss_kW: "power__loss_k_w", OperatingHours: "operating_hours" }, outputId: "annual_energy_loss" },
    { formulaId: "custom.kompresor_kacagi_maliyet_analyzer_3", inputMap: { AnnualEnergyLoss: "annual_energy_loss", ElectricityRate: "electricity_rate" }, outputId: "cost__leak" },
    { formulaId: "custom.kompresor_kacagi_maliyet_analyzer_4", inputMap: { Cost_Leak_i: "cost__leak_i" }, outputId: "total_leak_cost" },
    { formulaId: "custom.kompresor_kacagi_maliyet_analyzer_5", inputMap: { AnnualEnergyLoss: "annual_energy_loss", GridEmissionFactor: "grid_emission_factor" }, outputId: "carbon_emissions" },
    { formulaId: "custom.kompresor_kacagi_maliyet_analyzer_6", inputMap: { RepairCost: "repair_cost", Cost_Leak: "cost__leak" }, outputId: "payback__repair" },
  ],
  reportTemplate: {
    title: "Kompresör Kaçağı Maliyet Report",
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
