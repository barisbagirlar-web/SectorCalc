/**
 * CBAM UYUMLULUK — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CBAMCOMPLIANCEVERDICT_SCHEMA: PremiumCalculatorSchema = {
  id: "cbam-compliance-verdict-analyzer",
  legacyPaidSlug: "cbam-compliance-verdict-analyzer",
  name: "CBAM UYUMLULUK",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CBAM UYUMLULUK — premium analysis tool.",
  inputs: [
    { id: "toplam_kutle", label: "Toplam Kütle", type: "number", required: true },
    { id: "mense_ulke", label: "Menşe Ülke", type: "text", required: true },
    { id: "kapsam_12_emisyon", label: "Kapsam 1/2 Emisyon", type: "number", required: true },
    { id: "mense_karbon_vergisi", label: "Menşe Karbon Vergisi", type: "number", required: true },
    { id: "kr_marji_esigi", label: "Kâr Marjı Eşiği", type: "number", required: true },
  ],
  outputs: [
    { id: "total_mass", label: "Total Mass", unit: "currency", format: "currency" },
    { id: "total_embedded", label: "Total Embedded", unit: "currency", format: "currency" },
    { id: "specific_embedded", label: "Specific Embedded", unit: "currency", format: "currency" },
    { id: "actual_vs_default", label: "Actual Vs Default", unit: "currency", format: "currency" },
    { id: "financial_liability", label: "Financial Liability", unit: "currency", format: "currency" },
    { id: "compliance_decision", label: "Compliance Decision", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cbam_uyumluluk_analyzer_0", inputMap: { Mass: "mass" }, outputId: "total_mass" },
    { formulaId: "custom.cbam_uyumluluk_analyzer_1", inputMap: { Direct: "direct", Indirect: "indirect" }, outputId: "total_embedded" },
    { formulaId: "custom.cbam_uyumluluk_analyzer_2", inputMap: { TotalEmbedded: "total_embedded", TotalMass: "total_mass" }, outputId: "specific_embedded" },
    { formulaId: "custom.cbam_uyumluluk_analyzer_3", inputMap: { SpecificEmbedded: "specific_embedded", DefaultEmissionFactor: "default_emission_factor" }, outputId: "actual_vs_default" },
    { formulaId: "custom.cbam_uyumluluk_analyzer_4", inputMap: { TotalEmbedded: "total_embedded", EU_ETS_Price: "e_u__e_t_s__price", CarbonPricePaidOrigin: "carbon_price_paid_origin" }, outputId: "financial_liability" },
    { formulaId: "custom.cbam_uyumluluk_analyzer_5", inputMap: { ActualVsDefault: "actual_vs_default", Liability: "liability", MarginThreshold: "margin_threshold", Proceed: "proceed", Reevaluate: "reevaluate" }, outputId: "compliance_decision" },
  ],
  reportTemplate: {
    title: "CBAM UYUMLULUK Report",
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
