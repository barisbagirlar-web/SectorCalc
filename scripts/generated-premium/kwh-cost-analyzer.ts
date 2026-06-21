/**
 * KWh Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const KWHCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "kwh-cost-analyzer",
  legacyPaidSlug: "kwh-cost-analyzer",
  name: "KWh Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "KWh Maliyet — premium analysis tool.",
  inputs: [
    { id: "aktifreaktif_tuketim", label: "Aktif/Reaktif Tüketim", type: "number", required: true },
    { id: "cekilen_guc_kw", label: "Çekilen Güç kW", type: "number", required: true },
    { id: "guc_faktoru", label: "Güç Faktörü", type: "number", required: true },
    { id: "enerjigucreaktif_birim_fiyat", label: "Enerji/Güç/Reaktif Birim Fiyat", type: "number", required: true },
    { id: "ceza_esigi", label: "Ceza Eşiği", type: "number", required: true },
    { id: "vergifon_orani", label: "Vergi/Fon Oranı", type: "number", required: true },
    { id: "tepe_gucu_trafo_kapasitesi", label: "Tepe Gücü Trafo Kapasitesi", type: "number", required: true },
  ],
  outputs: [
    { id: "energy_charge", label: "Energy Charge", unit: "currency", format: "currency" },
    { id: "demand_charge", label: "Demand Charge", unit: "currency", format: "currency" },
    { id: "reactive_penalty", label: "Reactive Penalty", unit: "currency", format: "currency" },
    { id: "taxes_and_fees", label: "Taxes And Fees", unit: "currency", format: "currency" },
    { id: "total_bill", label: "Total Bill", unit: "currency", format: "currency" },
    { id: "unit_cost_k_wh", label: "Unit Cost_k Wh", unit: "currency", format: "currency" },
    { id: "peak_shaving_savings", label: "Peak Shaving Savings", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kwh_maliyet_analyzer_0", inputMap: { ActiveEnergy: "active_energy", EnergyRate: "energy_rate" }, outputId: "energy_charge" },
    { formulaId: "custom.kwh_maliyet_analyzer_1", inputMap: { PeakDemand: "peak_demand", DemandRate: "demand_rate" }, outputId: "demand_charge" },
    { formulaId: "custom.kwh_maliyet_analyzer_2", inputMap: { PowerFactor: "power_factor", Threshold: "threshold", ReactiveEnergy: "reactive_energy", PenaltyRate: "penalty_rate" }, outputId: "reactive_penalty" },
    { formulaId: "custom.kwh_maliyet_analyzer_3", inputMap: { EnergyCharge: "energy_charge", DemandCharge: "demand_charge", TaxRate: "tax_rate" }, outputId: "taxes_and_fees" },
    { formulaId: "custom.kwh_maliyet_analyzer_4", inputMap: { EnergyCharge: "energy_charge", DemandCharge: "demand_charge", ReactivePenalty: "reactive_penalty", TaxesAndFees: "taxes_and_fees" }, outputId: "total_bill" },
    { formulaId: "custom.kwh_maliyet_analyzer_5", inputMap: { TotalBill: "total_bill", ActiveEnergy: "active_energy" }, outputId: "unit_cost_k_wh" },
    { formulaId: "custom.kwh_maliyet_analyzer_6", inputMap: { OldPeak: "old_peak", NewPeak: "new_peak", DemandRate: "demand_rate" }, outputId: "peak_shaving_savings" },
  ],
  reportTemplate: {
    title: "KWh Maliyet Report",
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
