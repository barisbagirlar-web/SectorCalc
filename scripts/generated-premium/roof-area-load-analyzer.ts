/**
 * ÇATI ALANI — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ROOFAREALOAD_SCHEMA: PremiumCalculatorSchema = {
  id: "roof-area-load-analyzer",
  legacyPaidSlug: "roof-area-load-analyzer",
  name: "ÇATI ALANI",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ÇATI ALANI — premium analysis tool.",
  inputs: [
    { id: "uzunlukgenislik", label: "Uzunluk/Genişlik", type: "number", required: true },
    { id: "sacak_payi", label: "Saçak Payı", type: "number", required: true },
    { id: "cati_tipi", label: "Çatı Tipi", type: "text", required: true },
    { id: "egim_acisi", label: "Eğim Açısı", type: "number", required: true },
    { id: "kar_yuku_bolgesi", label: "Kar Yükü Bölgesi", type: "text", required: true },
    { id: "fire_orani", label: "Fire Oranı", type: "number", required: true },
  ],
  outputs: [
    { id: "area__footprint", label: "Area_ Footprint", unit: "currency", format: "currency" },
    { id: "area__gable", label: "Area_ Gable", unit: "currency", format: "currency" },
    { id: "overhang_area", label: "Overhang Area", unit: "currency", format: "currency" },
    { id: "total_material_area", label: "Total Material Area", unit: "currency", format: "currency" },
    { id: "ridge_length", label: "Ridge Length", unit: "currency", format: "currency" },
    { id: "load__dead", label: "Load_ Dead", unit: "currency", format: "currency" },
    { id: "load__snow", label: "Load_ Snow", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cati_alani_analyzer_0", inputMap: { Length: "length", Width: "width" }, outputId: "area__footprint" },
    { formulaId: "custom.cati_alani_analyzer_1", inputMap: { Footprint: "footprint", PitchAngle: "pitch_angle" }, outputId: "area__gable" },
    { formulaId: "custom.cati_alani_analyzer_2", inputMap: { Perimeter: "perimeter", OverhangWidth: "overhang_width" }, outputId: "overhang_area" },
    { formulaId: "custom.cati_alani_analyzer_3", inputMap: { Area_Roof: "area__roof", WasteFactor: "waste_factor" }, outputId: "total_material_area" },
    { formulaId: "custom.cati_alani_analyzer_4", inputMap: { Length: "length", Width: "width" }, outputId: "ridge_length" },
    { formulaId: "custom.cati_alani_analyzer_5", inputMap: { MaterialWeight: "material_weight", TotalArea: "total_area" }, outputId: "load__dead" },
    { formulaId: "custom.cati_alani_analyzer_6", inputMap: { GroundSnow: "ground_snow", Exposure: "exposure", Thermal: "thermal", Slope: "slope" }, outputId: "load__snow" },
  ],
  reportTemplate: {
    title: "ÇATI ALANI Report",
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
