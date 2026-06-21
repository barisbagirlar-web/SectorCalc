/**
 * CBAM MARUZİYET — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CBAMEXPOSURE_SCHEMA: PremiumCalculatorSchema = {
  id: "cbam-exposure-analyzer",
  legacyPaidSlug: "cbam-exposure-analyzer",
  name: "CBAM MARUZİYET",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CBAM MARUZİYET — premium analysis tool.",
  inputs: [
    { id: "uretim_hacmi", label: "Üretim Hacmi", type: "number", required: true },
    { id: "gazkomurelektrik_tuketimi", label: "Gaz/Kömür/Elektrik Tüketimi", type: "number", required: true },
    { id: "proses_emisyonu", label: "Proses Emisyonu", type: "number", required: true },
    { id: "yenilenebilir_orani", label: "Yenilenebilir Oranı", type: "number", required: true },
    { id: "eu_ets_fiyati", label: "EU ETS Fiyatı", type: "number", required: true },
  ],
  outputs: [
    { id: "direct_emissions", label: "Direct Emissions", unit: "currency", format: "currency" },
    { id: "indirect_emissions", label: "Indirect Emissions", unit: "currency", format: "currency" },
    { id: "carbon_intensity", label: "Carbon Intensity", unit: "currency", format: "currency" },
    { id: "c_b_a_m_certificate_cost", label: "C B A M Certificate Cost", unit: "currency", format: "currency" },
    { id: "free_allowance", label: "Free Allowance", unit: "currency", format: "currency" },
    { id: "compliance_score", label: "Compliance Score", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cbam_maruziyet_analyzer_0", inputMap: { ActivityData: "activity_data", EmissionFactor: "emission_factor" }, outputId: "direct_emissions" },
    { formulaId: "custom.cbam_maruziyet_analyzer_1", inputMap: { ElecConsumption: "elec_consumption", GridFactor: "grid_factor" }, outputId: "indirect_emissions" },
    { formulaId: "custom.cbam_maruziyet_analyzer_2", inputMap: { DirectEmissions: "direct_emissions", IndirectEmissions: "indirect_emissions", ProductionVolume: "production_volume" }, outputId: "carbon_intensity" },
    { formulaId: "custom.cbam_maruziyet_analyzer_3", inputMap: { EmbeddedEmissions: "embedded_emissions", FreeAllowance: "free_allowance", EU_ETS_Price: "e_u__e_t_s__price" }, outputId: "c_b_a_m_certificate_cost" },
    { formulaId: "custom.cbam_maruziyet_analyzer_4", inputMap: { Benchmark: "benchmark", ProductionVolume: "production_volume", LeakageFactor: "leakage_factor" }, outputId: "free_allowance" },
    { formulaId: "custom.cbam_maruziyet_analyzer_5", inputMap: { DataComplete: "data_complete", Verification: "verification", Reduction: "reduction" }, outputId: "compliance_score" },
  ],
  reportTemplate: {
    title: "CBAM MARUZİYET Report",
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
