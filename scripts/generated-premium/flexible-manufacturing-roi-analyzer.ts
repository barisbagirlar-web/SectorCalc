/**
 * FLEXIBLE MANUFACTURING ROI — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FLEXIBLEMANUFACTURINGROI_SCHEMA: PremiumCalculatorSchema = {
  id: "flexible-manufacturing-roi-analyzer",
  legacyPaidSlug: "flexible-manufacturing-roi-analyzer",
  name: "FLEXIBLE MANUFACTURING ROI",
  sectorSlug: "general",
  category: "cost",
  painStatement: "FLEXIBLE MANUFACTURING ROI — premium analysis tool.",
  inputs: [
    { id: "dedicatedfms_bedel", label: "Dedicated/FMS Bedel", type: "number", required: true },
    { id: "setup_sayisi", label: "Setup Sayısı", type: "number", required: true },
    { id: "wiphurda_azalma", label: "WIP/Hurda Azalma", type: "number", required: true },
    { id: "ttm_kazanc", label: "TTM Kazanç", type: "number", required: true },
    { id: "prim_marj", label: "Prim Marj", type: "number", required: true },
    { id: "tasima", label: "Taşıma", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__ded", label: "Cost_ Ded", unit: "currency", format: "currency" },
    { id: "cost__flex", label: "Cost_ Flex", unit: "currency", format: "currency" },
    { id: "flex_val", label: "Flex Val", unit: "currency", format: "currency" },
    { id: "inv_sav", label: "Inv Sav", unit: "currency", format: "currency" },
    { id: "scrap_red", label: "Scrap Red", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.flexible_manufacturing_roi_analyzer_0", inputMap: { Mach_Ded: "mach__ded", Setup_Ded: "setup__ded", Changeovers: "changeovers", Inv_High: "inv__high" }, outputId: "cost__ded" },
    { formulaId: "custom.flexible_manufacturing_roi_analyzer_1", inputMap: { Mach_FMS: "mach__f_m_s", Tool_FMS: "tool__f_m_s", Prog: "prog", Maint: "maint" }, outputId: "cost__flex" },
    { formulaId: "custom.flexible_manufacturing_roi_analyzer_2", inputMap: { TTM_Red: "t_t_m__red", RevGain: "rev_gain", CustPrem: "cust_prem", Vol: "vol" }, outputId: "flex_val" },
    { formulaId: "custom.flexible_manufacturing_roi_analyzer_3", inputMap: { WIP_Ded: "w_i_p__ded", WIP_Flex: "w_i_p__flex", CarryCost: "carry_cost" }, outputId: "inv_sav" },
    { formulaId: "custom.flexible_manufacturing_roi_analyzer_4", inputMap: { Scrap_Ded: "scrap__ded", Scrap_Flex: "scrap__flex", Vol: "vol", UnitCost: "unit_cost" }, outputId: "scrap_red" },
    { formulaId: "custom.flexible_manufacturing_roi_analyzer_5", inputMap: { Cost_Ded: "cost__ded", Cost_Flex: "cost__flex", FlexVal: "flex_val", InvSav: "inv_sav", ScrapRed: "scrap_red", Capex: "capex" }, outputId: "r_o_i" },
  ],
  reportTemplate: {
    title: "FLEXIBLE MANUFACTURING ROI Report",
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
