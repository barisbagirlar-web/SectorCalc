/**
 * BASINÇ VESSEL KALINLIK — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ASMEPRESSUREVESSEL_SCHEMA: PremiumCalculatorSchema = {
  id: "asme-pressure-vessel-analyzer",
  legacyPaidSlug: "asme-pressure-vessel-analyzer",
  name: "BASINÇ VESSEL KALINLIK",
  sectorSlug: "general",
  category: "cost",
  painStatement: "BASINÇ VESSEL KALINLIK — premium analysis tool.",
  inputs: [
    { id: "ic_basinc_p", label: "İç Basınç P", type: "number", required: true },
    { id: "ic_yaricap_r", label: "İç Yarıçap R", type: "number", required: true },
    { id: "kapak_tipi", label: "Kapak Tipi", type: "text", required: true },
    { id: "malzeme", label: "Malzeme", type: "text", required: true },
    { id: "tasarim_sicakligi", label: "Tasarım Sıcaklığı", type: "number", required: true },
    { id: "gerilme_s", label: "Gerilme S", type: "number", required: true },
    { id: "kaynak_verimi_e", label: "Kaynak Verimi E", type: "number", required: true },
    { id: "korozyon_payi_ca", label: "Korozyon Payı C_A", type: "number", required: true },
  ],
  outputs: [
    { id: "t_shell", label: "t_shell", unit: "currency", format: "currency" },
    { id: "t_sphere", label: "t_sphere", unit: "currency", format: "currency" },
    { id: "t_head_ellip", label: "t_head_ellip", unit: "currency", format: "currency" },
    { id: "m", label: "M", unit: "currency", format: "currency" },
    { id: "t_head_tori", label: "t_head_tori", unit: "currency", format: "currency" },
    { id: "m_a_w_p", label: "M A W P", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.basinc_vessel_kalinlik_analyzer_0", inputMap: { C_A: "c__a" }, outputId: "t_shell" },
    { formulaId: "custom.basinc_vessel_kalinlik_analyzer_1", inputMap: { C_A: "c__a" }, outputId: "t_sphere" },
    { formulaId: "custom.basinc_vessel_kalinlik_analyzer_2", inputMap: { C_A: "c__a" }, outputId: "t_head_ellip" },
    { formulaId: "custom.basinc_vessel_kalinlik_analyzer_3", inputMap: {  }, outputId: "m" },
    { formulaId: "custom.basinc_vessel_kalinlik_analyzer_4", inputMap: { C_A: "c__a" }, outputId: "t_head_tori" },
    { formulaId: "custom.basinc_vessel_kalinlik_analyzer_5", inputMap: { C_A: "c__a" }, outputId: "m_a_w_p" },
  ],
  reportTemplate: {
    title: "BASINÇ VESSEL KALINLIK Report",
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
