/**
 * Tekstil Atığı Risk Değerlendirmesi — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TEXTILEWASTERISK_SCHEMA: PremiumCalculatorSchema = {
  id: "textile-waste-risk-analyzer",
  legacyPaidSlug: "textile-waste-risk-analyzer",
  name: "Tekstil Atığı Risk Değerlendirmesi",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Tekstil Atığı Risk Değerlendirmesi — premium analysis tool.",
  inputs: [
    { id: "giren_kumascikan_urun_kg", label: "Giren Kumaş/Çıkan Ürün kg", type: "number", required: true },
    { id: "kesimdikimboya_fireleri", label: "Kesim/Dikim/Boya Fireleri", type: "number", required: true },
    { id: "kumas_kg_fiyati", label: "Kumaş kg Fiyatı", type: "number", required: true },
    { id: "isleme_maliyeti", label: "İşleme Maliyeti", type: "number", required: true },
    { id: "depolama_ucreti", label: "Depolama Ücreti", type: "number", required: true },
    { id: "hurda_geri_kazanim_degeri", label: "Hurda Geri Kazanım Değeri", type: "number", required: true },
  ],
  outputs: [
    { id: "waste_rate", label: "Waste Rate", unit: "currency", format: "currency" },
    { id: "pre_consumer_waste", label: "Pre Consumer Waste", unit: "currency", format: "currency" },
    { id: "financial_loss", label: "Financial Loss", unit: "currency", format: "currency" },
    { id: "disposal_cost", label: "Disposal Cost", unit: "currency", format: "currency" },
    { id: "circular_revenue", label: "Circular Revenue", unit: "currency", format: "currency" },
    { id: "net_waste_cost", label: "Net Waste Cost", unit: "currency", format: "currency" },
    { id: "risk_score", label: "Risk Score", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.tekstil_atigi_risk_degerlendirmesi_analyzer_0", inputMap: { InputFabric: "input_fabric", OutputGarments: "output_garments" }, outputId: "waste_rate" },
    { formulaId: "custom.tekstil_atigi_risk_degerlendirmesi_analyzer_1", inputMap: { CuttingScrap: "cutting_scrap", SewingDefects: "sewing_defects", DyeingRework: "dyeing_rework" }, outputId: "pre_consumer_waste" },
    { formulaId: "custom.tekstil_atigi_risk_degerlendirmesi_analyzer_2", inputMap: { PreConsumerWaste: "pre_consumer_waste", FabricCostPerKg: "fabric_cost_per_kg", ProcessingCost: "processing_cost" }, outputId: "financial_loss" },
    { formulaId: "custom.tekstil_atigi_risk_degerlendirmesi_analyzer_3", inputMap: { WasteWeight: "waste_weight", LandfillFee: "landfill_fee" }, outputId: "disposal_cost" },
    { formulaId: "custom.tekstil_atigi_risk_degerlendirmesi_analyzer_4", inputMap: { RecycledWasteWeight: "recycled_waste_weight", ScrapValue: "scrap_value" }, outputId: "circular_revenue" },
    { formulaId: "custom.tekstil_atigi_risk_degerlendirmesi_analyzer_5", inputMap: { FinancialLoss: "financial_loss", DisposalCost: "disposal_cost", CircularRevenue: "circular_revenue" }, outputId: "net_waste_cost" },
    { formulaId: "custom.tekstil_atigi_risk_degerlendirmesi_analyzer_6", inputMap: { NetWasteCost: "net_waste_cost", TotalRevenue: "total_revenue" }, outputId: "risk_score" },
  ],
  reportTemplate: {
    title: "Tekstil Atığı Risk Değerlendirmesi Report",
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
