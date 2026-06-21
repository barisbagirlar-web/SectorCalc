/**
 * DEVAMSIZLIK MALİYETİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ABSENTEEISMCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "absenteeism-cost-analyzer",
  legacyPaidSlug: "absenteeism-cost-analyzer",
  name: "DEVAMSIZLIK MALİYETİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "DEVAMSIZLIK MALİYETİ — premium analysis tool.",
  inputs: [
    { id: "kayip_saat", label: "Kayıp Saat", type: "number", required: true },
    { id: "ucret", label: "Ücret", type: "number", required: true },
    { id: "yan_hak", label: "Yan Hak", type: "number", required: true },
    { id: "olay_sayisi_s", label: "Olay Sayısı S", type: "number", required: true },
    { id: "fazla_mesai", label: "Fazla Mesai", type: "number", required: true },
    { id: "gecici_isci", label: "Geçici İşçi", type: "number", required: true },
    { id: "verim_dusus", label: "Verim Düşüş", type: "number", required: true },
  ],
  outputs: [
    { id: "direct_cost", label: "Direct Cost", unit: "currency", format: "currency" },
    { id: "overtime_premium", label: "Overtime Premium", unit: "currency", format: "currency" },
    { id: "temp_cost", label: "Temp Cost", unit: "currency", format: "currency" },
    { id: "prod_loss", label: "Prod Loss", unit: "currency", format: "currency" },
    { id: "admin_cost", label: "Admin Cost", unit: "currency", format: "currency" },
    { id: "bradford_factor", label: "Bradford Factor", unit: "currency", format: "currency" },
    { id: "total_cost", label: "Total Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.devamsizlik_maliyeti_analyzer_0", inputMap: { AbsentHours: "absent_hours", HourlyRate: "hourly_rate", Burden: "burden" }, outputId: "direct_cost" },
    { formulaId: "custom.devamsizlik_maliyeti_analyzer_1", inputMap: { ReplaceOT: "replace_o_t", OTRate: "o_t_rate", RegRate: "reg_rate" }, outputId: "overtime_premium" },
    { formulaId: "custom.devamsizlik_maliyeti_analyzer_2", inputMap: { TempHours: "temp_hours", TempRate: "temp_rate", Markup: "markup" }, outputId: "temp_cost" },
    { formulaId: "custom.devamsizlik_maliyeti_analyzer_3", inputMap: { AbsentHours: "absent_hours", OutputPerHour: "output_per_hour", Margin: "margin", EffDrop: "eff_drop" }, outputId: "prod_loss" },
    { formulaId: "custom.devamsizlik_maliyeti_analyzer_4", inputMap: { Events: "events", HR_Time: "h_r__time", HRRate: "h_r_rate" }, outputId: "admin_cost" },
    { formulaId: "custom.devamsizlik_maliyeti_analyzer_5", inputMap: {  }, outputId: "bradford_factor" },
    { formulaId: "custom.devamsizlik_maliyeti_analyzer_6", inputMap: { Direct: "direct", OT: "o_t", Temp: "temp", Prod: "prod", Admin: "admin" }, outputId: "total_cost" },
  ],
  reportTemplate: {
    title: "DEVAMSIZLIK MALİYETİ Report",
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
