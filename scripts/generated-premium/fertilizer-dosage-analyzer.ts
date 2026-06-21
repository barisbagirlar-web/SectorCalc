/**
 * GÜBRE DOZAJ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FERTILIZERDOSAGE_SCHEMA: PremiumCalculatorSchema = {
  id: "fertilizer-dosage-analyzer",
  legacyPaidSlug: "fertilizer-dosage-analyzer",
  name: "GÜBRE DOZAJ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "GÜBRE DOZAJ — premium analysis tool.",
  inputs: [
    { id: "hedef_verim", label: "Hedef Verim", type: "number", required: true },
    { id: "toprak_npk", label: "Toprak N-P-K", type: "array", required: true },
    { id: "ihtiyac", label: "İhtiyaç", type: "array", required: true },
    { id: "verimlilik", label: "Verimlilik", type: "number", required: true },
    { id: "alan", label: "Alan", type: "number", required: true },
    { id: "icerik", label: "İçerik", type: "number", required: true },
    { id: "fiyat", label: "Fiyat", type: "number", required: true },
  ],
  outputs: [
    { id: "nut_req", label: "Nut Req", unit: "currency", format: "currency" },
    { id: "soil_supp", label: "Soil Supp", unit: "currency", format: "currency" },
    { id: "fert_need", label: "Fert Need", unit: "currency", format: "currency" },
    { id: "app_rate", label: "App Rate", unit: "currency", format: "currency" },
    { id: "cost", label: "Cost", unit: "currency", format: "currency" },
    { id: "env_risk", label: "Env Risk", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
    { id: "precision", label: "Precision", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.gubre_dozaj_analyzer_0", inputMap: { YieldTarget: "yield_target", RemRate: "rem_rate" }, outputId: "nut_req" },
    { formulaId: "custom.gubre_dozaj_analyzer_1", inputMap: { SoilTest: "soil_test", ConvFactor: "conv_factor" }, outputId: "soil_supp" },
    { formulaId: "custom.gubre_dozaj_analyzer_2", inputMap: { NutReq: "nut_req", SoilSupp: "soil_supp", Eff: "eff" }, outputId: "fert_need" },
    { formulaId: "custom.gubre_dozaj_analyzer_3", inputMap: { FertNeed: "fert_need", ContentPct: "content_pct" }, outputId: "app_rate" },
    { formulaId: "custom.gubre_dozaj_analyzer_4", inputMap: { AppRate: "app_rate", Area: "area", Price: "price" }, outputId: "cost" },
    { formulaId: "custom.gubre_dozaj_analyzer_5", inputMap: { AppRate: "app_rate", Uptake: "uptake", Leach: "leach" }, outputId: "env_risk" },
    { formulaId: "custom.gubre_dozaj_analyzer_6", inputMap: { YieldInc: "yield_inc", CropPrice: "crop_price", Cost: "cost" }, outputId: "r_o_i" },
    { formulaId: "custom.gubre_dozaj_analyzer_7", inputMap: { BaseRate: "base_rate", ZoneFactor: "zone_factor" }, outputId: "precision" },
  ],
  reportTemplate: {
    title: "GÜBRE DOZAJ Report",
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
