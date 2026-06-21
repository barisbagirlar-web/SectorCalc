/**
 * Yangın Hidrantı Akış — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FIREHYDRANTFLOW_SCHEMA: PremiumCalculatorSchema = {
  id: "fire-hydrant-flow-analyzer",
  legacyPaidSlug: "fire-hydrant-flow-analyzer",
  name: "Yangın Hidrantı Akış",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Yangın Hidrantı Akış — premium analysis tool.",
  inputs: [
    { id: "hidrant_capi_mm", label: "Hidrant Çapı mm", type: "number", required: true },
    { id: "statikpitot_basinc_bar", label: "Statik/Pitot Basınç bar", type: "number", required: true },
    { id: "akis_katsayisi_cd", label: "Akış Katsayısı c_d", type: "number", required: true },
    { id: "boru_uzunlugucapi", label: "Boru Uzunluğu/Çapı", type: "number", required: true },
    { id: "surtunme_katsayisi_f", label: "Sürtünme Katsayısı f", type: "number", required: true },
    { id: "gerekli_akis_lmin", label: "Gerekli Akış L/min", type: "number", required: true },
    { id: "gerekli_basinc_bar", label: "Gerekli Basınç bar", type: "number", required: true },
  ],
  outputs: [
    { id: "flow_rate__q", label: "Flow Rate_ Q", unit: "currency", format: "currency" },
    { id: "residual_pressure", label: "Residual Pressure", unit: "currency", format: "currency" },
    { id: "available_flow__at20psi", label: "Available Flow_ At20psi", unit: "currency", format: "currency" },
    { id: "friction_loss", label: "Friction Loss", unit: "currency", format: "currency" },
    { id: "required_pump_head", label: "Required Pump Head", unit: "currency", format: "currency" },
    { id: "compliance", label: "Compliance", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.yangin_hidranti_akis_analyzer_0", inputMap: { c_d: "c_d", P_Pitot: "p__pitot" }, outputId: "flow_rate__q" },
    { formulaId: "custom.yangin_hidranti_akis_analyzer_1", inputMap: { P_Static: "p__static", FlowRate_Q: "flow_rate__q", Coefficient: "coefficient" }, outputId: "residual_pressure" },
    { formulaId: "custom.yangin_hidranti_akis_analyzer_2", inputMap: { FlowRate_Q: "flow_rate__q", P_Static: "p__static", P_Residual: "p__residual" }, outputId: "available_flow__at20psi" },
    { formulaId: "custom.yangin_hidranti_akis_analyzer_3", inputMap: { Length: "length", Diameter: "diameter", Velocity: "velocity" }, outputId: "friction_loss" },
    { formulaId: "custom.yangin_hidranti_akis_analyzer_4", inputMap: { ElevationHead: "elevation_head", FrictionLoss: "friction_loss", NozzlePressure: "nozzle_pressure" }, outputId: "required_pump_head" },
    { formulaId: "custom.yangin_hidranti_akis_analyzer_5", inputMap: { AvailableFlow_At20psi: "available_flow__at20psi", RequiredFlow: "required_flow", PASS: "p_a_s_s", FAIL: "f_a_i_l" }, outputId: "compliance" },
  ],
  reportTemplate: {
    title: "Yangın Hidrantı Akış Report",
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
