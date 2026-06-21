/**
 * CNC ÇEVRİM SÜRESİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CNCCYCLETIME_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-cycle-time-analyzer",
  legacyPaidSlug: "cnc-cycle-time-analyzer",
  name: "CNC ÇEVRİM SÜRESİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CNC ÇEVRİM SÜRESİ — premium analysis tool.",
  inputs: [
    { id: "vc", label: "V_c", type: "number", required: true },
    { id: "fz", label: "f_z", type: "number", required: true },
    { id: "ap", label: "a_p", type: "number", required: true },
    { id: "dtool", label: "D_tool", type: "number", required: true },
    { id: "l", label: "L", type: "number", required: true },
    { id: "vrapid", label: "V_rapid", type: "number", required: true },
    { id: "takim_degisim", label: "Takım Değişim", type: "number", required: true },
    { id: "yuklemebosaltma", label: "Yükleme/Boşaltma", type: "number", required: true },
  ],
  outputs: [
    { id: "t_cut", label: "T_cut", unit: "currency", format: "currency" },
    { id: "v_f", label: "V_f", unit: "currency", format: "currency" },
    { id: "n", label: "n", unit: "currency", format: "currency" },
    { id: "t_rapid", label: "T_rapid", unit: "currency", format: "currency" },
    { id: "t_toolchange", label: "T_toolchange", unit: "currency", format: "currency" },
    { id: "t_total", label: "T_total", unit: "currency", format: "currency" },
    { id: "o_e_e__availability", label: "O E E_ Availability", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cnc_cevrim_suresi_analyzer_0", inputMap: { V_f: "v_f", a_p: "a_p" }, outputId: "t_cut" },
    { formulaId: "custom.cnc_cevrim_suresi_analyzer_1", inputMap: { f_z: "f_z" }, outputId: "v_f" },
    { formulaId: "custom.cnc_cevrim_suresi_analyzer_2", inputMap: { V_c: "v_c", D_tool: "l" }, outputId: "n" },
    { formulaId: "custom.cnc_cevrim_suresi_analyzer_3", inputMap: { Distance_rapid: "ap", V_rapid: "ap" }, outputId: "t_rapid" },
    { formulaId: "custom.cnc_cevrim_suresi_analyzer_4", inputMap: { Changes: "changes", TimePerChange: "time_per_change" }, outputId: "t_toolchange" },
    { formulaId: "custom.cnc_cevrim_suresi_analyzer_5", inputMap: { T_cut: "t_cut", T_rapid: "ap", T_toolchange: "l", T_noncutting: "t_noncutting", T_load_unload: "l" }, outputId: "t_total" },
    { formulaId: "custom.cnc_cevrim_suresi_analyzer_6", inputMap: { Planned: "l", Downtime: "downtime" }, outputId: "o_e_e__availability" },
  ],
  reportTemplate: {
    title: "CNC ÇEVRİM SÜRESİ Report",
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
