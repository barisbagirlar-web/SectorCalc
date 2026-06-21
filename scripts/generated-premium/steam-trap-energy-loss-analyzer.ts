/**
 * Steam Trap Enerji kayıp — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const STEAMTRAPENERGYLOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "steam-trap-energy-loss-analyzer",
  legacyPaidSlug: "steam-trap-energy-loss-analyzer",
  name: "Steam Trap Enerji kayıp",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Steam Trap Enerji kayıp — premium analysis tool.",
  inputs: [
    { id: "delik_capi_mm", label: "Delik Çapı mm", type: "number", required: true },
    { id: "basinc_farki_bar", label: "Basınç Farkı bar", type: "number", required: true },
    { id: "buhar_entalpisi_kjkg", label: "Buhar Entalpisi kJ/kg", type: "number", required: true },
    { id: "arizalisaglam_kapan_sayisi", label: "Arızalı/Sağlam Kapan Sayısı", type: "number", required: true },
    { id: "yillik_calisma_saat", label: "Yıllık Çalışma saat", type: "number", required: true },
    { id: "buhar_uretim_maliyeti_currencykwh", label: "Buhar Üretim Maliyeti currency/kWh", type: "number", required: true },
    { id: "kapan_degisim_maliyeti", label: "Kapan Değişim Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "orifice_flow", label: "Orifice Flow", unit: "currency", format: "currency" },
    { id: "steam_loss_kg_h", label: "Steam Loss_kg_h", unit: "currency", format: "currency" },
    { id: "energy_loss_k_w", label: "Energy Loss_k W", unit: "currency", format: "currency" },
    { id: "annual_cost", label: "Annual Cost", unit: "currency", format: "currency" },
    { id: "trap_failure_rate", label: "Trap Failure Rate", unit: "currency", format: "currency" },
    { id: "total_system_loss", label: "Total System Loss", unit: "currency", format: "currency" },
    { id: "repair_r_o_i", label: "Repair R O I", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.steam_trap_enerji_kayip_analyzer_0", inputMap: { C_d: "c_d", DeltaP: "delta_p", Density: "density" }, outputId: "orifice_flow" },
    { formulaId: "custom.steam_trap_enerji_kayip_analyzer_1", inputMap: { OrificeFlow: "orifice_flow" }, outputId: "steam_loss_kg_h" },
    { formulaId: "custom.steam_trap_enerji_kayip_analyzer_2", inputMap: { SteamLoss_kg_h: "steam_loss_kg_h", Enthalpy_Steam: "enthalpy__steam" }, outputId: "energy_loss_k_w" },
    { formulaId: "custom.steam_trap_enerji_kayip_analyzer_3", inputMap: { EnergyLoss_kW: "energy_loss_k_w", OperatingHours: "operating_hours", SteamCost_per_kWh: "steam_cost_per_k_wh" }, outputId: "annual_cost" },
    { formulaId: "custom.steam_trap_enerji_kayip_analyzer_4", inputMap: { FailedTraps: "failed_traps", TotalTraps: "total_traps" }, outputId: "trap_failure_rate" },
    { formulaId: "custom.steam_trap_enerji_kayip_analyzer_5", inputMap: { AnnualCost_i: "annual_cost_i" }, outputId: "total_system_loss" },
    { formulaId: "custom.steam_trap_enerji_kayip_analyzer_6", inputMap: { TotalSystemLoss: "total_system_loss", TrapCost: "trap_cost", LaborCost: "labor_cost" }, outputId: "repair_r_o_i" },
  ],
  reportTemplate: {
    title: "Steam Trap Enerji kayıp Report",
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
