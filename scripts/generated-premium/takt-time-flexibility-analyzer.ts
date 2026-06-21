/**
 * Takt Süre Flexibility Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TAKTTIMEFLEXIBILITY_SCHEMA: PremiumCalculatorSchema = {
  id: "takt-time-flexibility-analyzer",
  legacyPaidSlug: "takt-time-flexibility-analyzer",
  name: "Takt Süre Flexibility Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Takt Süre Flexibility Maliyet — premium analysis tool.",
  inputs: [
    { id: "cevrim_sureleri_array", label: "Çevrim Süreleri array", type: "number", required: true },
    { id: "kullanilabilir_sure_dk", label: "Kullanılabilir Süre dk", type: "number", required: true },
    { id: "musteri_talebi_adet", label: "Müşteri Talebi adet", type: "number", required: true },
    { id: "operator_sayisi", label: "Operatör Sayısı", type: "number", required: true },
    { id: "capraz_egitim_saati", label: "Çapraz Eğitim Saati", type: "number", required: true },
    { id: "iscilikdenge_kaybi_maliyeti", label: "İşçilik/Denge Kaybı Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "takt_time", label: "Takt Time", unit: "currency", format: "currency" },
    { id: "cycle_time_flexibility", label: "Cycle Time Flexibility", unit: "currency", format: "currency" },
    { id: "balance_loss", label: "Balance Loss", unit: "currency", format: "currency" },
    { id: "cross_training_cost", label: "Cross Training Cost", unit: "currency", format: "currency" },
    { id: "flexibility_premium", label: "Flexibility Premium", unit: "currency", format: "currency" },
    { id: "volume_variation_cost", label: "Volume Variation Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.takt_sure_flexibility_maliyet_analyzer_0", inputMap: { AvailableTime: "available_time", CustomerDemand: "customer_demand" }, outputId: "takt_time" },
    { formulaId: "custom.takt_sure_flexibility_maliyet_analyzer_1", inputMap: { CycleTime_i: "cycle_time_i" }, outputId: "cycle_time_flexibility" },
    { formulaId: "custom.takt_sure_flexibility_maliyet_analyzer_2", inputMap: { TaktTime: "takt_time", CycleTime_i: "cycle_time_i", LaborRate: "labor_rate" }, outputId: "balance_loss" },
    { formulaId: "custom.takt_sure_flexibility_maliyet_analyzer_3", inputMap: { Operators: "operators", TrainingHours: "training_hours", TrainerRate: "trainer_rate" }, outputId: "cross_training_cost" },
    { formulaId: "custom.takt_sure_flexibility_maliyet_analyzer_4", inputMap: { CrossTrainingCost: "cross_training_cost", AnnualProduction: "annual_production" }, outputId: "flexibility_premium" },
    { formulaId: "custom.takt_sure_flexibility_maliyet_analyzer_5", inputMap: { Demand: "demand", Capacity: "capacity", OvertimeRate: "overtime_rate", IdleLaborCost: "idle_labor_cost" }, outputId: "volume_variation_cost" },
  ],
  reportTemplate: {
    title: "Takt Süre Flexibility Maliyet Report",
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
