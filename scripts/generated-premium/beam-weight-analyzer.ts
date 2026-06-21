/**
 * Kiriş Ağırlığı — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BEAMWEIGHT_SCHEMA: PremiumCalculatorSchema = {
  id: "beam-weight-analyzer",
  legacyPaidSlug: "beam-weight-analyzer",
  name: "Kiriş Ağırlığı",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kiriş Ağırlığı — premium analysis tool.",
  inputs: [
    { id: "profil_tipiboyutu", label: "Profil Tipi/Boyutu", type: "text", required: true },
    { id: "uzunluk", label: "Uzunluk", type: "number", required: true },
    { id: "adet", label: "Adet", type: "number", required: true },
    { id: "celik_yogunlugu", label: "Çelik Yoğunluğu", type: "number", required: true },
    { id: "elastisite_modulu_e", label: "Elastisite Modülü E", type: "number", required: true },
    { id: "ton_fiyati", label: "Ton Fiyatı", type: "number", required: true },
    { id: "boyayalitim_m2_maliyeti", label: "Boya/Yalıtım m2 Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "area__cross", label: "Area_ Cross", unit: "currency", format: "currency" },
    { id: "weight__per_meter", label: "Weight_ Per Meter", unit: "currency", format: "currency" },
    { id: "total_weight", label: "Total Weight", unit: "currency", format: "currency" },
    { id: "cost__material", label: "Cost_ Material", unit: "currency", format: "currency" },
    { id: "paint_area", label: "Paint Area", unit: "currency", format: "currency" },
    { id: "fireproofing_area", label: "Fireproofing Area", unit: "currency", format: "currency" },
    { id: "deflection__max", label: "Deflection_ Max", unit: "currency", format: "currency" },
    { id: "moment__max", label: "Moment_ Max", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kiris_agirligi_analyzer_0", inputMap: { LookupArea: "lookup_area", ProfileType: "profile_type", Size: "size" }, outputId: "area__cross" },
    { formulaId: "custom.kiris_agirligi_analyzer_1", inputMap: { Area_Cross: "area__cross", Density_Steel: "density__steel" }, outputId: "weight__per_meter" },
    { formulaId: "custom.kiris_agirligi_analyzer_2", inputMap: { Weight_PerMeter: "weight__per_meter", Length: "length", Quantity: "quantity" }, outputId: "total_weight" },
    { formulaId: "custom.kiris_agirligi_analyzer_3", inputMap: { TotalWeight: "total_weight", PricePerTon: "price_per_ton" }, outputId: "cost__material" },
    { formulaId: "custom.kiris_agirligi_analyzer_4", inputMap: { Perimeter: "perimeter", Length: "length" }, outputId: "paint_area" },
    { formulaId: "custom.kiris_agirligi_analyzer_5", inputMap: { PaintArea: "paint_area" }, outputId: "fireproofing_area" },
    { formulaId: "custom.kiris_agirligi_analyzer_6", inputMap: {  }, outputId: "deflection__max" },
    { formulaId: "custom.kiris_agirligi_analyzer_7", inputMap: {  }, outputId: "moment__max" },
  ],
  reportTemplate: {
    title: "Kiriş Ağırlığı Report",
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
