/**
 * Muda Atık Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MUDAWASTECOST_SCHEMA: PremiumCalculatorSchema = {
  id: "muda-waste-cost-analyzer",
  legacyPaidSlug: "muda-waste-cost-analyzer",
  name: "Muda Atık Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Muda Atık Maliyet — premium analysis tool.",
  inputs: [
    { id: "asiri_uretim_adedi", label: "Aşırı Üretim Adedi", type: "number", required: true },
    { id: "beklemehareket_suresi", label: "Bekleme/Hareket Süresi", type: "number", required: true },
    { id: "tasima_mesafesisefer", label: "Taşıma Mesafesi/Sefer", type: "number", required: true },
    { id: "fazla_islem_suresi", label: "Fazla İşlem Süresi", type: "number", required: true },
    { id: "hatali_adet", label: "Hatalı Adet", type: "number", required: true },
    { id: "birimstok_tasimaiscilik_maliyetleri", label: "Birim/Stok Taşıma/İşçilik Maliyetleri", type: "number", required: true },
  ],
  outputs: [
    { id: "overproduction", label: "Overproduction", unit: "currency", format: "currency" },
    { id: "waiting", label: "Waiting", unit: "currency", format: "currency" },
    { id: "transport", label: "Transport", unit: "currency", format: "currency" },
    { id: "overprocessing", label: "Overprocessing", unit: "currency", format: "currency" },
    { id: "inventory", label: "Inventory", unit: "currency", format: "currency" },
    { id: "motion", label: "Motion", unit: "currency", format: "currency" },
    { id: "defects", label: "Defects", unit: "currency", format: "currency" },
    { id: "total_muda_cost", label: "Total Muda Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.muda_atik_maliyet_analyzer_0", inputMap: { ExcessUnits: "excess_units", UnitCost: "unit_cost" }, outputId: "overproduction" },
    { formulaId: "custom.muda_atik_maliyet_analyzer_1", inputMap: { WaitingHours: "waiting_hours", LaborRate: "labor_rate", MachineRate: "machine_rate" }, outputId: "waiting" },
    { formulaId: "custom.muda_atik_maliyet_analyzer_2", inputMap: { TransportDistance: "transport_distance", CostPerMeter: "cost_per_meter", Trips: "trips" }, outputId: "transport" },
    { formulaId: "custom.muda_atik_maliyet_analyzer_3", inputMap: { ActualTime: "actual_time", StandardTime: "standard_time", LaborRate: "labor_rate" }, outputId: "overprocessing" },
    { formulaId: "custom.muda_atik_maliyet_analyzer_4", inputMap: { ExcessInventory: "excess_inventory", HoldingCostRate: "holding_cost_rate", Time: "time" }, outputId: "inventory" },
    { formulaId: "custom.muda_atik_maliyet_analyzer_5", inputMap: { UnnecessaryMotionTime: "unnecessary_motion_time", LaborRate: "labor_rate" }, outputId: "motion" },
    { formulaId: "custom.muda_atik_maliyet_analyzer_6", inputMap: { DefectUnits: "defect_units", MaterialCost: "material_cost", ReworkCost: "rework_cost" }, outputId: "defects" },
    { formulaId: "custom.muda_atik_maliyet_analyzer_7", inputMap: { Overproduction: "overproduction", Waiting: "waiting", Transport: "transport", Overprocessing: "overprocessing", Inventory: "inventory", Motion: "motion", Defects: "defects" }, outputId: "total_muda_cost" },
  ],
  reportTemplate: {
    title: "Muda Atık Maliyet Report",
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
