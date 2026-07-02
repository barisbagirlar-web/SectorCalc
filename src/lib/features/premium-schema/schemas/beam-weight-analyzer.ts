import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const BEAM_WEIGHT_SCHEMA: PremiumCalculatorSchema = {
  id: "beam-weight-analyzer", legacyPaidSlug: "beam-weight-analyzer",
  name: "Beam Weight Calculation", name_i18n: {"en":"Beam Weight Calculation"}, sectorSlug: "construction", category: "measurement",
  painStatement: "Without calculating steel beam weight and cost, structural design and budget deviations occur.", painStatement_i18n: {"en":"Without calculating steel beam weight and cost, structural design and budget deviations occur."},
  inputs: [
    { id: "profileType", label: "Profile Type", label_i18n: {"en":"Profile Type"}, type: "select", unit: "scalar", enumValues: ["HEA", "HEB", "IPE", "UPN", "kutu"], required: true, smartDefault: "HEA", helper: "", expertMeaning: "Steel profile type", expertMeaning_i18n: {"en":"Steel profile type"} },
    { id: "profileSize", label: "Profile Size", label_i18n: {"en":"Profile Size"}, type: "number", unit: "mm", required: true, smartDefault: 200, validation: { min: 50 }, helper: "", expertMeaning: "Profile nominal size", expertMeaning_i18n: {"en":"Profile nominal size"} },
    { id: "beamLength", label: "Beam Length", label_i18n: {"en":"Beam Length"}, type: "number", unit: "m", required: true, smartDefault: 6, validation: { min: 0.5 }, helper: "", expertMeaning: "Beam length", expertMeaning_i18n: {"en":"Beam length"} },
    { id: "quantity", label: "Quantity", label_i18n: {"en":"Quantity"}, type: "number", unit: "scalar", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of beams", expertMeaning_i18n: {"en":"Number of beams"} },
    { id: "steelDensity", label: "Steel Density", label_i18n: {"en":"Steel Density"}, type: "number", unit: "kg/m³", required: false, smartDefault: 7850, validation: { min: 0 }, helper: "", expertMeaning: "Steel density", expertMeaning_i18n: {"en":"Steel density"} },
    { id: "pricePerTon", label: "Price Per Ton", label_i18n: {"en":"Price Per Ton"}, type: "number", unit: "USD/ton", required: true, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Steel price per ton", expertMeaning_i18n: {"en":"Steel price per ton"} },
    { id: "modulusE", label: "Young's Modulus E", label_i18n: {"en":"Young's Modulus E"}, type: "number", unit: "GPa", required: false, smartDefault: 210, validation: { min: 0 }, helper: "", expertMeaning: "Young's modulus", expertMeaning_i18n: {"en":"Young's modulus"} },
    { id: "uniformLoad", label: "Uniform Load w", label_i18n: {"en":"Uniform Load w"}, type: "number", unit: "kN/m", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Uniform distributed load", expertMeaning_i18n: {"en":"Uniform distributed load"} },
  ],
  outputs: [
    { id: "totalWeight", label: "Total Weight", label_i18n: {"en":"Total Weight"}, unit: "ton", format: "number" },
    { id: "materialCost", label: "Material Cost", label_i18n: {"en":"Material Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "materialCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Material > $50K - alternative profile should be evaluated.", warningMessage_i18n: {"en":"Material > $50K - alternative profile should be evaluated."}, criticalMessage: "material > $150K - budget revizyonu gerekli.", criticalMessage_i18n: {"en":"material > $150K - budget revizyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "cost.beam_material", inputMap: {
        beamLength: "beamLength",
        beamWeightPerM: "profileSize",
        materialPricePerKg: "quantity",
        steelDensity: "steelDensity",
        pricePerTon: "pricePerTon"
      }, outputId: "totalWeight" },
  ],
  reportTemplate: { title: "Beam Weight Report", title_i18n: {"en":"Beam Weight Report"}, sections: ["executive_summary", "thresholds", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: [],assumptionNotes_i18n:[{"en":"Weight = Section × Length × Quantity × Density."},{"en":"Section area from lookup table by profile type."}]},
};
