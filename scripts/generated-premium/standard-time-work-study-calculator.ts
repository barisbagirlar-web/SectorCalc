/**
 * Zaman Etüdü Analizörü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const STANDARDTIMEWORKSTUDYCALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "standard-time-work-study-calculator",
  legacyPaidSlug: "standard-time-work-study-calculator",
  name: "Zaman Etüdü Analizörü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Zaman Etüdü Analizörü — premium analysis tool.",
  inputs: [
    { id: "gozlemlenen_sureler_array", label: "Gözlemlenen Süreler array", type: "number", required: true },
    { id: "performans_degerlendirme", label: "Performans Değerlendirme", type: "number", required: true },
    { id: "kisiselyorgunlukgecikme_paylari", label: "Kişisel/Yorgunluk/Gecikme Payları", type: "number", required: true },
    { id: "saatlik_ucret", label: "Saatlik Ücret", type: "number", required: true },
    { id: "vardiya_suresi_dk", label: "Vardiya Süresi dk", type: "number", required: true },
    { id: "gercek_uretim_adedi", label: "Gerçek Üretim Adedi", type: "number", required: true },
  ],
  outputs: [
    { id: "observed_time", label: "Observed Time", unit: "currency", format: "currency" },
    { id: "normal_time", label: "Normal Time", unit: "currency", format: "currency" },
    { id: "allowance_pct", label: "Allowance Pct", unit: "currency", format: "currency" },
    { id: "standard_time", label: "Standard Time", unit: "currency", format: "currency" },
    { id: "standard_output", label: "Standard Output", unit: "currency", format: "currency" },
    { id: "labor_cost_per_unit", label: "Labor Cost Per Unit", unit: "currency", format: "currency" },
    { id: "efficiency_variance", label: "Efficiency Variance", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.zaman_etudu_analizoru_analyzer_0", inputMap: { CycleTimes: "cycle_times", NumberOfCycles: "number_of_cycles" }, outputId: "observed_time" },
    { formulaId: "custom.zaman_etudu_analizoru_analyzer_1", inputMap: { ObservedTime: "observed_time", PerformanceRating: "performance_rating" }, outputId: "normal_time" },
    { formulaId: "custom.zaman_etudu_analizoru_analyzer_2", inputMap: { Personal: "personal", Fatigue: "fatigue", Delay: "delay" }, outputId: "allowance_pct" },
    { formulaId: "custom.zaman_etudu_analizoru_analyzer_3", inputMap: { NormalTime: "normal_time", AllowancePct: "allowance_pct" }, outputId: "standard_time" },
    { formulaId: "custom.zaman_etudu_analizoru_analyzer_4", inputMap: { ShiftDuration: "shift_duration", StandardTime: "standard_time" }, outputId: "standard_output" },
    { formulaId: "custom.zaman_etudu_analizoru_analyzer_5", inputMap: { StandardTime: "standard_time", HourlyRate: "hourly_rate" }, outputId: "labor_cost_per_unit" },
    { formulaId: "custom.zaman_etudu_analizoru_analyzer_6", inputMap: { StandardTime: "standard_time", ActualTime: "actual_time", ActualProduction: "actual_production", HourlyRate: "hourly_rate" }, outputId: "efficiency_variance" },
  ],
  reportTemplate: {
    title: "Zaman Etüdü Analizörü Report",
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
