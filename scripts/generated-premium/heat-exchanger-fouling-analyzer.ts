/**
 * ISI EXCHANGER FOULING — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HEATEXCHANGERFOULING_SCHEMA: PremiumCalculatorSchema = {
  id: "heat-exchanger-fouling-analyzer",
  legacyPaidSlug: "heat-exchanger-fouling-analyzer",
  name: "ISI EXCHANGER FOULING",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ISI EXCHANGER FOULING — premium analysis tool.",
  inputs: [
    { id: "ucleandirty", label: "U_clean/dirty", type: "number", required: true },
    { id: "alan", label: "Alan", type: "number", required: true },
    { id: "lmtd", label: "LMTD", type: "number", required: true },
    { id: "dp_artis", label: "DP Artış", type: "number", required: true },
    { id: "temizlik", label: "Temizlik", type: "number", required: true },
    { id: "yakit", label: "Yakıt", type: "number", required: true },
    { id: "kazan_verim", label: "Kazan Verim", type: "number", required: true },
  ],
  outputs: [
    { id: "r_foul", label: "R_foul", unit: "currency", format: "currency" },
    { id: "loss", label: "Loss", unit: "currency", format: "currency" },
    { id: "energy_pen", label: "Energy Pen", unit: "currency", format: "currency" },
    { id: "cost__energy", label: "Cost_ Energy", unit: "currency", format: "currency" },
    { id: "d_p__inc", label: "D P_ Inc", unit: "currency", format: "currency" },
    { id: "pump_inc", label: "Pump Inc", unit: "currency", format: "currency" },
    { id: "total", label: "Total", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.isi_exchanger_fouling_analyzer_0", inputMap: { U_dirty: "u_dirty", U_clean: "u_clean" }, outputId: "r_foul" },
    { formulaId: "custom.isi_exchanger_fouling_analyzer_1", inputMap: { Area: "area", U_clean: "u_clean", LMTD: "lmtd", U_dirty: "u_dirty" }, outputId: "loss" },
    { formulaId: "custom.isi_exchanger_fouling_analyzer_2", inputMap: { Loss: "loss", Hours: "hours", BoilEff: "boil_eff" }, outputId: "energy_pen" },
    { formulaId: "custom.isi_exchanger_fouling_analyzer_3", inputMap: { EnergyPen: "energy_pen", FuelCost: "fuel_cost" }, outputId: "cost__energy" },
    { formulaId: "custom.isi_exchanger_fouling_analyzer_4", inputMap: { DeltaP_dirty: "delta_p_dirty", DeltaP_clean: "delta_p_clean" }, outputId: "d_p__inc" },
    { formulaId: "custom.isi_exchanger_fouling_analyzer_5", inputMap: { DP_Inc: "d_p__inc", Flow: "flow", Hours: "hours", PumpEff: "pump_eff" }, outputId: "pump_inc" },
    { formulaId: "custom.isi_exchanger_fouling_analyzer_6", inputMap: { Cost_Energy: "cost__energy", PumpInc: "pump_inc" }, outputId: "total" },
    { formulaId: "custom.isi_exchanger_fouling_analyzer_7", inputMap: { Total: "total", CleanCost: "clean_cost" }, outputId: "r_o_i" },
  ],
  reportTemplate: {
    title: "ISI EXCHANGER FOULING Report",
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
