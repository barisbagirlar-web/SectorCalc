/**
 * Yenilenebilir Enerji YG — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RENEWABLEENERGYIRR_SCHEMA: PremiumCalculatorSchema = {
  id: "renewable-energy-irr-analyzer",
  legacyPaidSlug: "renewable-energy-irr-analyzer",
  name: "Yenilenebilir Enerji YG",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Yenilenebilir Enerji YG — premium analysis tool.",
  inputs: [
    { id: "kurulu_guc_kw", label: "Kurulu Güç kW", type: "number", required: true },
    { id: "kapasite_faktoru", label: "Kapasite Faktörü", type: "number", required: true },
    { id: "sistem_omru_yil", label: "Sistem Ömrü yıl", type: "number", required: true },
    { id: "capex", label: "Capex", type: "number", required: true },
    { id: "wacc", label: "WACC", type: "number", required: true },
    { id: "sebeke_elektrik_fiyati_currencykwh", label: "Şebeke Elektrik Fiyatı currency/kWh", type: "number", required: true },
    { id: "yillik_bakimsigorta", label: "Yıllık Bakım/Sigorta", type: "number", required: true },
    { id: "tesvikler", label: "Teşvikler", type: "number", required: true },
  ],
  outputs: [
    { id: "annual_generation", label: "Annual Generation", unit: "currency", format: "currency" },
    { id: "annual_savings", label: "Annual Savings", unit: "currency", format: "currency" },
    { id: "annual_o_p_e_x", label: "Annual O P E X", unit: "currency", format: "currency" },
    { id: "net_cash_flow", label: "Net Cash Flow", unit: "currency", format: "currency" },
    { id: "payback_period", label: "Payback Period", unit: "currency", format: "currency" },
    { id: "l_c_o_e", label: "L C O E", unit: "currency", format: "currency" },
    { id: "n_p_v", label: "N P V", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.yenilenebilir_enerji_yg_analyzer_0", inputMap: { SystemCapacity: "system_capacity", CapacityFactor: "capacity_factor" }, outputId: "annual_generation" },
    { formulaId: "custom.yenilenebilir_enerji_yg_analyzer_1", inputMap: { AnnualGeneration: "annual_generation", GridElectricityRate: "grid_electricity_rate" }, outputId: "annual_savings" },
    { formulaId: "custom.yenilenebilir_enerji_yg_analyzer_2", inputMap: { Maintenance: "maintenance", Insurance: "insurance", InverterReplacementFund: "inverter_replacement_fund" }, outputId: "annual_o_p_e_x" },
    { formulaId: "custom.yenilenebilir_enerji_yg_analyzer_3", inputMap: { AnnualSavings: "annual_savings", AnnualOPEX: "annual_o_p_e_x", Incentives: "incentives" }, outputId: "net_cash_flow" },
    { formulaId: "custom.yenilenebilir_enerji_yg_analyzer_4", inputMap: { TotalCapex: "capex", NetCashFlow: "net_cash_flow" }, outputId: "payback_period" },
    { formulaId: "custom.yenilenebilir_enerji_yg_analyzer_5", inputMap: { TotalCapex: "capex", OPEX_t: "o_p_e_x_t", Generation_t: "generation_t" }, outputId: "l_c_o_e" },
    { formulaId: "custom.yenilenebilir_enerji_yg_analyzer_6", inputMap: { NetCashFlow_t: "net_cash_flow_t", WACC: "wacc", TotalCapex: "capex" }, outputId: "n_p_v" },
  ],
  reportTemplate: {
    title: "Yenilenebilir Enerji YG Report",
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
