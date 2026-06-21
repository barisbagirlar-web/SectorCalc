/**
 * BETON HACMİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CONCRETEVOLUMECOST_SCHEMA: PremiumCalculatorSchema = {
  id: "concrete-volume-cost-analyzer",
  legacyPaidSlug: "concrete-volume-cost-analyzer",
  name: "BETON HACMİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "BETON HACMİ — premium analysis tool.",
  inputs: [
    { id: "doseme_uzunlukgenislikkalinlik", label: "Döşeme Uzunluk/Genişlik/Kalınlık", type: "number", required: true },
    { id: "temelkolon_sayisi", label: "Temel/Kolon Sayısı", type: "number", required: true },
    { id: "beton_sinifi", label: "Beton Sınıfı", type: "text", required: true },
    { id: "yogunluk", label: "Yoğunluk", type: "number", required: true },
    { id: "fire_orani", label: "Fire Oranı", type: "number", required: true },
    { id: "birim_fiyat", label: "Birim Fiyat", type: "number", required: true },
  ],
  outputs: [
    { id: "v_slab", label: "V_slab", unit: "currency", format: "currency" },
    { id: "v_footing", label: "V_footing", unit: "currency", format: "currency" },
    { id: "v_column", label: "V_column", unit: "currency", format: "currency" },
    { id: "v_wall", label: "V_wall", unit: "currency", format: "currency" },
    { id: "v_total", label: "V_total", unit: "currency", format: "currency" },
    { id: "weight", label: "Weight", unit: "currency", format: "currency" },
    { id: "truck_loads", label: "Truck Loads", unit: "currency", format: "currency" },
    { id: "total_cost", label: "Total Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.beton_hacmi_analyzer_0", inputMap: { Length: "length", Width: "width", Thickness: "thickness" }, outputId: "v_slab" },
    { formulaId: "custom.beton_hacmi_analyzer_1", inputMap: { Length: "length", Width: "width", Depth: "depth", Count: "count" }, outputId: "v_footing" },
    { formulaId: "custom.beton_hacmi_analyzer_2", inputMap: { Diameter: "diameter", Height: "height", Count: "count" }, outputId: "v_column" },
    { formulaId: "custom.beton_hacmi_analyzer_3", inputMap: { Length: "length", Height: "height", Thickness: "thickness" }, outputId: "v_wall" },
    { formulaId: "custom.beton_hacmi_analyzer_4", inputMap: { V_geometric: "v_geometric", WasteFactor: "waste_factor" }, outputId: "v_total" },
    { formulaId: "custom.beton_hacmi_analyzer_5", inputMap: { V_total: "v_total", Density: "density" }, outputId: "weight" },
    { formulaId: "custom.beton_hacmi_analyzer_6", inputMap: { V_total: "v_total", TruckCapacity: "truck_capacity" }, outputId: "truck_loads" },
    { formulaId: "custom.beton_hacmi_analyzer_7", inputMap: { V_total: "v_total", UnitPrice: "unit_price", PumpCost: "pump_cost" }, outputId: "total_cost" },
  ],
  reportTemplate: {
    title: "BETON HACMİ Report",
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
