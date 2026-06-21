/**
 * ARAÇ AMORTİSMANI — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const VEHICLEDEPRECIATIONTCO_SCHEMA: PremiumCalculatorSchema = {
  id: "vehicle-depreciation-tco-analyzer",
  legacyPaidSlug: "vehicle-depreciation-tco-analyzer",
  name: "ARAÇ AMORTİSMANI",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ARAÇ AMORTİSMANI — premium analysis tool.",
  inputs: [
    { id: "edinme_bedeli", label: "Edinme Bedeli", type: "number", required: true },
    { id: "kalinti_deger", label: "Kalıntı Değer", type: "number", required: true },
    { id: "faydali_omur", label: "Faydalı Ömür", type: "number", required: true },
    { id: "yillik_km", label: "Yıllık Km", type: "number", required: true },
    { id: "amortisman_yontemi", label: "Amortisman Yöntemi", type: "text", required: true },
    { id: "kurumlar_vergisi", label: "Kurumlar Vergisi", type: "number", required: true },
    { id: "wacc", label: "WACC", type: "number", required: true },
  ],
  outputs: [
    { id: "s_l__annual", label: "S L_ Annual", unit: "currency", format: "currency" },
    { id: "d_b__rate", label: "D B_ Rate", unit: "currency", format: "currency" },
    { id: "d_b__year_t", label: "D B_ Year_t", unit: "currency", format: "currency" },
    { id: "m_a_c_r_s__year_t", label: "M A C R S_ Year_t", unit: "currency", format: "currency" },
    { id: "uo_p__per_unit", label: "Uo P_ Per Unit", unit: "currency", format: "currency" },
    { id: "t_c_o", label: "T C O", unit: "currency", format: "currency" },
    { id: "tax_shield", label: "Tax Shield", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.arac_amortismani_analyzer_0", inputMap: { Cost: "cost", SalvageValue: "salvage_value", UsefulLife: "useful_life" }, outputId: "s_l__annual" },
    { formulaId: "custom.arac_amortismani_analyzer_1", inputMap: { UsefulLife: "useful_life" }, outputId: "d_b__rate" },
    { formulaId: "custom.arac_amortismani_analyzer_2", inputMap: { BookValue_: "book_value_", DB_Rate: "d_b__rate" }, outputId: "d_b__year_t" },
    { formulaId: "custom.arac_amortismani_analyzer_3", inputMap: { Cost: "cost", MACRS_Table: "m_a_c_r_s__table", AssetClass: "asset_class", Year: "year" }, outputId: "m_a_c_r_s__year_t" },
    { formulaId: "custom.arac_amortismani_analyzer_4", inputMap: { Cost: "cost", SalvageValue: "salvage_value", TotalExpectedUnits: "total_expected_units" }, outputId: "uo_p__per_unit" },
    { formulaId: "custom.arac_amortismani_analyzer_5", inputMap: { AcquisitionCost: "acquisition_cost", OpCost_t: "op_cost_t", MaintCost_t: "maint_cost_t", Salvage_t: "salvage_t", DiscountRate: "discount_rate" }, outputId: "t_c_o" },
    { formulaId: "custom.arac_amortismani_analyzer_6", inputMap: { Depreciation: "depreciation", TaxRate: "tax_rate" }, outputId: "tax_shield" },
  ],
  reportTemplate: {
    title: "ARAÇ AMORTİSMANI Report",
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
