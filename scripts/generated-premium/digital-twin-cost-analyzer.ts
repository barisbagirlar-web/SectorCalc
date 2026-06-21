/**
 * DIGITAL TWIN MALİYET — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DIGITALTWINCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "digital-twin-cost-analyzer",
  legacyPaidSlug: "digital-twin-cost-analyzer",
  name: "DIGITAL TWIN MALİYET",
  sectorSlug: "general",
  category: "cost",
  painStatement: "DIGITAL TWIN MALİYET — premium analysis tool.",
  inputs: [
    { id: "prototipsaha_testi", label: "Prototip/Saha Testi", type: "number", required: true },
    { id: "modelleme_iscilik", label: "Modelleme İşçilik", type: "number", required: true },
    { id: "bulutlisans", label: "Bulut/Lisans", type: "number", required: true },
    { id: "garanti_dususu", label: "Garanti Düşüşü", type: "number", required: true },
    { id: "erken_cikis_geliri", label: "Erken Çıkış Geliri", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__trad", label: "Cost_ Trad", unit: "currency", format: "currency" },
    { id: "cost__d_t", label: "Cost_ D T", unit: "currency", format: "currency" },
    { id: "time_gain", label: "Time Gain", unit: "currency", format: "currency" },
    { id: "revenue_gain", label: "Revenue Gain", unit: "currency", format: "currency" },
    { id: "quality_savings", label: "Quality Savings", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.digital_twin_maliyet_analyzer_0", inputMap: { Prototyping: "prototyping", FieldTest: "field_test", Downtime: "downtime", Travel: "travel" }, outputId: "cost__trad" },
    { formulaId: "custom.digital_twin_maliyet_analyzer_1", inputMap: { License: "license", Compute: "compute", Sensor: "sensor", Modeling: "modeling" }, outputId: "cost__d_t" },
    { formulaId: "custom.digital_twin_maliyet_analyzer_2", inputMap: { PhysCycle: "phys_cycle", DigCycle: "dig_cycle", Iterations: "iterations" }, outputId: "time_gain" },
    { formulaId: "custom.digital_twin_maliyet_analyzer_3", inputMap: { TimeGain: "time_gain", DailyRev: "daily_rev" }, outputId: "revenue_gain" },
    { formulaId: "custom.digital_twin_maliyet_analyzer_4", inputMap: { DefectReduction: "defect_reduction", WarrantyCost: "warranty_cost", Volume: "volume" }, outputId: "quality_savings" },
    { formulaId: "custom.digital_twin_maliyet_analyzer_5", inputMap: { Cost_Trad: "cost__trad", Cost_DT: "cost__d_t", RevenueGain: "revenue_gain", QualitySavings: "quality_savings" }, outputId: "r_o_i" },
  ],
  reportTemplate: {
    title: "DIGITAL TWIN MALİYET Report",
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
