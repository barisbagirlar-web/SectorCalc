/**
 * Rüzgar Türbini Yatırım Getirisi — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WINDTURBINEINVESTMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "wind-turbine-investment-analyzer",
  legacyPaidSlug: "wind-turbine-investment-analyzer",
  name: "Rüzgar Türbini Yatırım Getirisi",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Rüzgar Türbini Yatırım Getirisi — premium analysis tool.",
  inputs: [
    { id: "turbin_gucu_kw", label: "Türbin Gücü kW", type: "number", required: true },
    { id: "guc_egrisi", label: "Güç Eğrisi", type: "array", required: true },
    { id: "ruzgar_frekansi", label: "Rüzgar Frekansı", type: "array", required: true },
    { id: "capex", label: "Capex", type: "number", required: true },
    { id: "wacc", label: "WACC", type: "number", required: true },
    { id: "tesviktarife_currencykwh", label: "Teşvik/Tarife currency/kWh", type: "number", required: true },
    { id: "kirabakimsigorta", label: "Kira/Bakım/Sigorta", type: "number", required: true },
    { id: "turbin_omru_yil", label: "Türbin Ömrü yıl", type: "number", required: true },
  ],
  outputs: [
    { id: "a_e_p", label: "A E P", unit: "currency", format: "currency" },
    { id: "capacity_factor", label: "Capacity Factor", unit: "currency", format: "currency" },
    { id: "annual_revenue", label: "Annual Revenue", unit: "currency", format: "currency" },
    { id: "o_p_e_x", label: "O P E X", unit: "currency", format: "currency" },
    { id: "e_b_i_t_d_a", label: "E B I T D A", unit: "currency", format: "currency" },
    { id: "l_c_o_e", label: "L C O E", unit: "currency", format: "currency" },
    { id: "n_p_v", label: "N P V", unit: "currency", format: "currency" },
    { id: "i_r_r", label: "I R R", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.ruzgar_turbini_yatirim_getirisi_analyzer_0", inputMap: { PowerCurve_v: "power_curve_v", Frequency_v: "frequency_v" }, outputId: "a_e_p" },
    { formulaId: "custom.ruzgar_turbini_yatirim_getirisi_analyzer_1", inputMap: { AEP: "a_e_p", RatedPower: "rated_power" }, outputId: "capacity_factor" },
    { formulaId: "custom.ruzgar_turbini_yatirim_getirisi_analyzer_2", inputMap: { AEP: "a_e_p", FeedInTariff: "feed_in_tariff" }, outputId: "annual_revenue" },
    { formulaId: "custom.ruzgar_turbini_yatirim_getirisi_analyzer_3", inputMap: { LandLease: "land_lease", Maintenance: "maintenance", Insurance: "insurance", GridFees: "grid_fees" }, outputId: "o_p_e_x" },
    { formulaId: "custom.ruzgar_turbini_yatirim_getirisi_analyzer_4", inputMap: { AnnualRevenue: "annual_revenue", OPEX: "o_p_e_x" }, outputId: "e_b_i_t_d_a" },
    { formulaId: "custom.ruzgar_turbini_yatirim_getirisi_analyzer_5", inputMap: { Capex: "capex", Opex_t: "opex_t", AEP_t: "a_e_p_t" }, outputId: "l_c_o_e" },
    { formulaId: "custom.ruzgar_turbini_yatirim_getirisi_analyzer_6", inputMap: { EBITDA_t: "e_b_i_t_d_a_t", WACC: "wacc", Capex: "capex" }, outputId: "n_p_v" },
    { formulaId: "custom.ruzgar_turbini_yatirim_getirisi_analyzer_7", inputMap: { where: "where", NPV: "n_p_v" }, outputId: "i_r_r" },
  ],
  reportTemplate: {
    title: "Rüzgar Türbini Yatırım Getirisi Report",
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
