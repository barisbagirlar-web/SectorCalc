/**
 * ENERJİ TÜKETİM RAPORU — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ENERGYCONSUMPTIONREPORT_SCHEMA: PremiumCalculatorSchema = {
  id: "energy-consumption-report-analyzer",
  legacyPaidSlug: "energy-consumption-report-analyzer",
  name: "ENERJİ TÜKETİM RAPORU",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ENERJİ TÜKETİM RAPORU — premium analysis tool.",
  inputs: [
    { id: "aktif_t0t3", label: "Aktif T0-T3", type: "array", required: true },
    { id: "reaktif", label: "Reaktif", type: "number", required: true },
    { id: "demax", label: "Demax", type: "number", required: true },
    { id: "pf_hedef", label: "PF Hedef", type: "number", required: true },
    { id: "ceza_esik", label: "Ceza Eşik", type: "number", required: true },
    { id: "aktifreaktifguc_bedeli", label: "Aktif/Reaktif/Güç Bedeli", type: "number", required: true },
    { id: "karbon", label: "Karbon", type: "number", required: true },
  ],
  outputs: [
    { id: "active", label: "Active", unit: "currency", format: "currency" },
    { id: "reactive", label: "Reactive", unit: "currency", format: "currency" },
    { id: "p_f", label: "P F", unit: "currency", format: "currency" },
    { id: "reactive_penalty", label: "Reactive Penalty", unit: "currency", format: "currency" },
    { id: "demand_charge", label: "Demand Charge", unit: "currency", format: "currency" },
    { id: "t_o_u", label: "T O U", unit: "currency", format: "currency" },
    { id: "total", label: "Total", unit: "currency", format: "currency" },
    { id: "carbon", label: "Carbon", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.enerji_tuketim_raporu_analyzer_0", inputMap: { kWh: "k_wh" }, outputId: "active" },
    { formulaId: "custom.enerji_tuketim_raporu_analyzer_1", inputMap: { kVArh: "k_v_arh" }, outputId: "reactive" },
    { formulaId: "custom.enerji_tuketim_raporu_analyzer_2", inputMap: { Active: "active", Reactive: "reactive" }, outputId: "p_f" },
    { formulaId: "custom.enerji_tuketim_raporu_analyzer_3", inputMap: { PF: "p_f", Thresh: "thresh", Reactive: "reactive", Active: "active", Tariff: "tariff" }, outputId: "reactive_penalty" },
    { formulaId: "custom.enerji_tuketim_raporu_analyzer_4", inputMap: { Peak_kW: "peak_k_w", DemandRate: "demand_rate" }, outputId: "demand_charge" },
    { formulaId: "custom.enerji_tuketim_raporu_analyzer_5", inputMap: { kWh: "k_wh", TOU_Rate: "t_o_u__rate" }, outputId: "t_o_u" },
    { formulaId: "custom.enerji_tuketim_raporu_analyzer_6", inputMap: { Base: "base", TOU: "t_o_u", Demand: "demand", Penalty: "penalty", Tax: "tax" }, outputId: "total" },
    { formulaId: "custom.enerji_tuketim_raporu_analyzer_7", inputMap: { Active: "active", EmisFactor: "emis_factor", CarbonPrice: "carbon_price" }, outputId: "carbon" },
  ],
  reportTemplate: {
    title: "ENERJİ TÜKETİM RAPORU Report",
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
