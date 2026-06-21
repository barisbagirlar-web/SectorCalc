/**
 * Makine Ekonomik Ömrü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MACHINEECONOMICLIFE_SCHEMA: PremiumCalculatorSchema = {
  id: "machine-economic-life-analyzer",
  legacyPaidSlug: "machine-economic-life-analyzer",
  name: "Makine Ekonomik Ömrü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Makine Ekonomik Ömrü — premium analysis tool.",
  inputs: [
    { id: "ilk_maliyetpiyasa_degeri", label: "İlk Maliyet/Piyasa Değeri", type: "number", required: true },
    { id: "kalinti_deger", label: "Kalıntı Değer", type: "number", required: true },
    { id: "yillik_isletmebakim_maliyetleri", label: "Yıllık İşletme/Bakım Maliyetleri", type: "array", required: true },
    { id: "iskonto_orani_i", label: "İskonto Oranı i", type: "number", required: true },
    { id: "analiz_periyodu_n", label: "Analiz Periyodu n", type: "number", required: true },
    { id: "yeni_makine_teklifi", label: "Yeni Makine Teklifi", type: "number", required: true },
  ],
  outputs: [
    { id: "e_u_a_c__capital", label: "E U A C_ Capital", unit: "currency", format: "currency" },
    { id: "e_u_a_c__operating", label: "E U A C_ Operating", unit: "currency", format: "currency" },
    { id: "total_e_u_a_c", label: "Total E U A C", unit: "currency", format: "currency" },
    { id: "economic_life", label: "Economic Life", unit: "currency", format: "currency" },
    { id: "defender__e_u_a_c", label: "Defender_ E U A C", unit: "currency", format: "currency" },
    { id: "challenger__e_u_a_c", label: "Challenger_ E U A C", unit: "currency", format: "currency" },
    { id: "replacement_decision", label: "Replacement Decision", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.makine_ekonomik_omru_analyzer_0", inputMap: { InitialCost: "initial_cost", SalvageValue: "salvage_value" }, outputId: "e_u_a_c__capital" },
    { formulaId: "custom.makine_ekonomik_omru_analyzer_1", inputMap: { OpCost_t: "op_cost_t" }, outputId: "e_u_a_c__operating" },
    { formulaId: "custom.makine_ekonomik_omru_analyzer_2", inputMap: { EUAC_Capital: "e_u_a_c__capital", EUAC_Operating: "e_u_a_c__operating" }, outputId: "total_e_u_a_c" },
    { formulaId: "custom.makine_ekonomik_omru_analyzer_3", inputMap: { where: "where", TotalEUAC: "total_e_u_a_c", is: "yillik_isletmebakim_maliyetleri", MINIMUM: "m_i_n_i_m_u_m" }, outputId: "economic_life" },
    { formulaId: "custom.makine_ekonomik_omru_analyzer_4", inputMap: { CurrentMarketValue: "current_market_value", OpCost_Defender: "op_cost__defender" }, outputId: "defender__e_u_a_c" },
    { formulaId: "custom.makine_ekonomik_omru_analyzer_5", inputMap: { EUAC_NewMachine: "e_u_a_c__new_machine" }, outputId: "challenger__e_u_a_c" },
    { formulaId: "custom.makine_ekonomik_omru_analyzer_6", inputMap: { Defender_EUAC: "defender__e_u_a_c", Challenger_EUAC: "challenger__e_u_a_c", Replace: "replace", Keep: "keep" }, outputId: "replacement_decision" },
  ],
  reportTemplate: {
    title: "Makine Ekonomik Ömrü Report",
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
