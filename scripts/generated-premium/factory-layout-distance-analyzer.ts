/**
 * FABRİKA YERLEŞİM MESAFE — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FACTORYLAYOUTDISTANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "factory-layout-distance-analyzer",
  legacyPaidSlug: "factory-layout-distance-analyzer",
  name: "FABRİKA YERLEŞİM MESAFE",
  sectorSlug: "general",
  category: "cost",
  painStatement: "FABRİKA YERLEŞİM MESAFE — premium analysis tool.",
  inputs: [
    { id: "akis_matrisi", label: "Akış Matrisi", type: "matrix", required: true },
    { id: "y", label: "Y", type: "array", required: true },
    { id: "alanlar", label: "Alanlar", type: "array", required: true },
    { id: "tasima_maliyet", label: "Taşıma Maliyet", type: "number", required: true },
    { id: "ekipman", label: "Ekipman", type: "text", required: true },
    { id: "koridor", label: "Koridor", type: "number", required: true },
    { id: "bitisiklik", label: "Bitişiklik", type: "matrix", required: true },
  ],
  outputs: [
    { id: "dist_ij", label: "Dist_ij", unit: "currency", format: "currency" },
    { id: "flow_cost", label: "Flow Cost", unit: "currency", format: "currency" },
    { id: "adj_score", label: "Adj Score", unit: "currency", format: "currency" },
    { id: "space_util", label: "Space Util", unit: "currency", format: "currency" },
    { id: "mat_hand_cost", label: "Mat Hand Cost", unit: "currency", format: "currency" },
    { id: "congestion", label: "Congestion", unit: "currency", format: "currency" },
    { id: "total_cost", label: "Total Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.fabrika_yerlesim_mesafe_analyzer_0", inputMap: { X_i: "x_i", X_j: "x_j", Y_i: "y", Y_j: "y" }, outputId: "dist_ij" },
    { formulaId: "custom.fabrika_yerlesim_mesafe_analyzer_1", inputMap: { Flow_ij: "flow_ij", Dist_ij: "dist_ij", CostPerDist: "cost_per_dist" }, outputId: "flow_cost" },
    { formulaId: "custom.fabrika_yerlesim_mesafe_analyzer_2", inputMap: { Flow_ij: "flow_ij", AdjFactor_ij: "adj_factor_ij" }, outputId: "adj_score" },
    { formulaId: "custom.fabrika_yerlesim_mesafe_analyzer_3", inputMap: { EquipArea: "equip_area", FacArea: "fac_area" }, outputId: "space_util" },
    { formulaId: "custom.fabrika_yerlesim_mesafe_analyzer_4", inputMap: { FlowCost: "flow_cost", HandRate: "hand_rate" }, outputId: "mat_hand_cost" },
    { formulaId: "custom.fabrika_yerlesim_mesafe_analyzer_5", inputMap: { CrossTraffic: "cross_traffic", AisleCap: "aisle_cap" }, outputId: "congestion" },
    { formulaId: "custom.fabrika_yerlesim_mesafe_analyzer_6", inputMap: { MatHand: "mat_hand", Space: "space", Congestion: "congestion" }, outputId: "total_cost" },
  ],
  reportTemplate: {
    title: "FABRİKA YERLEŞİM MESAFE Report",
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
