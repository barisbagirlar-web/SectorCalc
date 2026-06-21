/**
 * Malzeme Replacement Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MATERIALREPLACEMENTCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "material-replacement-cost-analyzer",
  legacyPaidSlug: "material-replacement-cost-analyzer",
  name: "Malzeme Replacement Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Malzeme Replacement Maliyet — premium analysis tool.",
  inputs: [
    { id: "mevcutalternatif_malzeme_maliyeti_currencykg", label: "Mevcut/Alternatif Malzeme Maliyeti currency/kg", type: "number", required: true },
    { id: "agirliklar", label: "Ağırlıklar", type: "number", required: true },
    { id: "islemebakimimha_maliyetleri", label: "İşleme/Bakım/İmha Maliyetleri", type: "number", required: true },
    { id: "kalifikasyontest_maliyeti", label: "Kalifikasyon/Test Maliyeti", type: "number", required: true },
    { id: "yakit_tasarrufu_parametreleri", label: "Yakıt Tasarrufu Parametreleri", type: "array", required: true },
    { id: "tooling_yatirimi", label: "Tooling Yatırımı", type: "number", required: true },
  ],
  outputs: [
    { id: "t_c_o__current", label: "T C O_ Current", unit: "currency", format: "currency" },
    { id: "t_c_o__alternative", label: "T C O_ Alternative", unit: "currency", format: "currency" },
    { id: "weight_savings", label: "Weight Savings", unit: "currency", format: "currency" },
    { id: "fuel_savings", label: "Fuel Savings", unit: "currency", format: "currency" },
    { id: "net_benefit", label: "Net Benefit", unit: "currency", format: "currency" },
    { id: "payback", label: "Payback", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.malzeme_replacement_maliyet_analyzer_0", inputMap: { MatCost_Current: "mat_cost__current", ProcessingCost_Current: "processing_cost__current", LifecycleMaint_Current: "lifecycle_maint__current", DisposalCost_Current: "disposal_cost__current" }, outputId: "t_c_o__current" },
    { formulaId: "custom.malzeme_replacement_maliyet_analyzer_1", inputMap: { MatCost_Alt: "mat_cost__alt", ProcessingCost_Alt: "processing_cost__alt", LifecycleMaint_Alt: "lifecycle_maint__alt", DisposalCost_Alt: "disposal_cost__alt" }, outputId: "t_c_o__alternative" },
    { formulaId: "custom.malzeme_replacement_maliyet_analyzer_2", inputMap: { Weight_Current: "weight__current", Weight_Alt: "weight__alt" }, outputId: "weight_savings" },
    { formulaId: "custom.malzeme_replacement_maliyet_analyzer_3", inputMap: { WeightSavings: "weight_savings", FuelFactor: "fuel_factor", LifecycleDistance: "lifecycle_distance", FuelPrice: "fuel_price" }, outputId: "fuel_savings" },
    { formulaId: "custom.malzeme_replacement_maliyet_analyzer_4", inputMap: { TCO_Current: "t_c_o__current", TCO_Alternative: "t_c_o__alternative", FuelSavings: "fuel_savings", QualityPremium: "quality_premium" }, outputId: "net_benefit" },
    { formulaId: "custom.malzeme_replacement_maliyet_analyzer_5", inputMap: { ToolingCost_Alt: "tooling_cost__alt", QualificationCost: "qualification_cost", AnnualNetBenefit: "annual_net_benefit" }, outputId: "payback" },
  ],
  reportTemplate: {
    title: "Malzeme Replacement Maliyet Report",
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
