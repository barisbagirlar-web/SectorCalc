/**
 * Vardiya Maliyet Verimliliği — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SHIFTCOSTEFFICIENCY_SCHEMA: PremiumCalculatorSchema = {
  id: "shift-cost-efficiency-analyzer",
  legacyPaidSlug: "shift-cost-efficiency-analyzer",
  name: "Vardiya Maliyet Verimliliği",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Vardiya Maliyet Verimliliği — premium analysis tool.",
  inputs: [
    { id: "vardiyaplanliplansiz_durus_suresi_dk", label: "Vardiya/Planlı/Plansız Duruş Süresi dk", type: "number", required: true },
    { id: "operator_sayisi", label: "Operatör Sayısı", type: "number", required: true },
    { id: "makine_gucu_kw", label: "Makine Gücü kW", type: "number", required: true },
    { id: "elektrik_tarifesi", label: "Elektrik Tarifesi", type: "number", required: true },
    { id: "saatlik_ucret", label: "Saatlik Ücret", type: "number", required: true },
    { id: "saglam_uretim_adedi", label: "Sağlam Üretim Adedi", type: "number", required: true },
    { id: "birim_marj", label: "Birim Marj", type: "number", required: true },
  ],
  outputs: [
    { id: "planned_production_time", label: "Planned Production Time", unit: "currency", format: "currency" },
    { id: "actual_run_time", label: "Actual Run Time", unit: "currency", format: "currency" },
    { id: "labor_cost", label: "Labor Cost", unit: "currency", format: "currency" },
    { id: "energy_cost", label: "Energy Cost", unit: "currency", format: "currency" },
    { id: "output_value", label: "Output Value", unit: "currency", format: "currency" },
    { id: "shift_efficiency", label: "Shift Efficiency", unit: "currency", format: "currency" },
    { id: "cost_per_unit", label: "Cost Per Unit", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.vardiya_maliyet_verimliligi_analyzer_0", inputMap: { ShiftDuration: "shift_duration", PlannedDowntime: "planned_downtime" }, outputId: "planned_production_time" },
    { formulaId: "custom.vardiya_maliyet_verimliligi_analyzer_1", inputMap: { PlannedProductionTime: "planned_production_time", UnplannedDowntime: "unplanned_downtime" }, outputId: "actual_run_time" },
    { formulaId: "custom.vardiya_maliyet_verimliligi_analyzer_2", inputMap: { Operators: "operators", ShiftHours: "shift_hours", HourlyRate: "hourly_rate" }, outputId: "labor_cost" },
    { formulaId: "custom.vardiya_maliyet_verimliligi_analyzer_3", inputMap: { MachinePower: "machine_power", ActualRunTime: "actual_run_time", ElecRate: "elec_rate" }, outputId: "energy_cost" },
    { formulaId: "custom.vardiya_maliyet_verimliligi_analyzer_4", inputMap: { GoodUnits: "good_units", UnitContributionMargin: "unit_contribution_margin" }, outputId: "output_value" },
    { formulaId: "custom.vardiya_maliyet_verimliligi_analyzer_5", inputMap: { OutputValue: "output_value", LaborCost: "labor_cost", EnergyCost: "energy_cost", Overhead: "overhead" }, outputId: "shift_efficiency" },
    { formulaId: "custom.vardiya_maliyet_verimliligi_analyzer_6", inputMap: { LaborCost: "labor_cost", EnergyCost: "energy_cost", Overhead: "overhead", GoodUnits: "good_units" }, outputId: "cost_per_unit" },
  ],
  reportTemplate: {
    title: "Vardiya Maliyet Verimliliği Report",
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
