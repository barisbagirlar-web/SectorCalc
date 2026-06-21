/**
 * AUTO REPAIR COMEBACK — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AUTOREPAIRCOMEBACK_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-repair-comeback-analyzer",
  legacyPaidSlug: "auto-repair-comeback-analyzer",
  name: "AUTO REPAIR COMEBACK",
  sectorSlug: "general",
  category: "cost",
  painStatement: "AUTO REPAIR COMEBACK — premium analysis tool.",
  inputs: [
    { id: "tamamlanan_ro", label: "Tamamlanan RO", type: "number", required: true },
    { id: "geri_donus_ro", label: "Geri Dönüş RO", type: "number", required: true },
    { id: "teshis_suresi", label: "Teşhis Süresi", type: "number", required: true },
    { id: "israf_parca_degeri", label: "İsraf Parça Değeri", type: "number", required: true },
    { id: "korfez_doluluk_suresi", label: "Körfez Doluluk Süresi", type: "number", required: true },
    { id: "churn_olasiligi", label: "Churn Olasılığı", type: "number", required: true },
  ],
  outputs: [
    { id: "comeback_rate", label: "Comeback Rate", unit: "currency", format: "currency" },
    { id: "comeback_cost__direct", label: "Comeback Cost_ Direct", unit: "currency", format: "currency" },
    { id: "comeback_cost__parts", label: "Comeback Cost_ Parts", unit: "currency", format: "currency" },
    { id: "comeback_cost__opportunity", label: "Comeback Cost_ Opportunity", unit: "currency", format: "currency" },
    { id: "d_p_m_o", label: "D P M O", unit: "currency", format: "currency" },
    { id: "total_cost", label: "Total Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.auto_repair_comeback_analyzer_0", inputMap: { ComebackOrders: "comeback_orders", TotalCompleted: "total_completed" }, outputId: "comeback_rate" },
    { formulaId: "custom.auto_repair_comeback_analyzer_1", inputMap: { ComebackOrders: "comeback_orders", DiagTime: "diag_time", RepairTime: "repair_time", LaborRate: "labor_rate" }, outputId: "comeback_cost__direct" },
    { formulaId: "custom.auto_repair_comeback_analyzer_2", inputMap: { ComebackOrders: "comeback_orders", WastedPartsValue: "wasted_parts_value" }, outputId: "comeback_cost__parts" },
    { formulaId: "custom.auto_repair_comeback_analyzer_3", inputMap: { ComebackOrders: "comeback_orders", BayOccupancyHours: "bay_occupancy_hours", RevenuePerBayHour: "revenue_per_bay_hour" }, outputId: "comeback_cost__opportunity" },
    { formulaId: "custom.auto_repair_comeback_analyzer_4", inputMap: { ComebackOrders: "comeback_orders", TotalCompleted: "total_completed" }, outputId: "d_p_m_o" },
    { formulaId: "custom.auto_repair_comeback_analyzer_5", inputMap: { Direct: "direct", Parts: "parts", Warranty: "warranty", Goodwill: "goodwill", Opportunity: "opportunity" }, outputId: "total_cost" },
  ],
  reportTemplate: {
    title: "AUTO REPAIR COMEBACK Report",
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
