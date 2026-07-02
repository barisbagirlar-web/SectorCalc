import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FABRIC_CUTTING_SCHEMA: PremiumCalculatorSchema = {
  id: "fabric-cutting-optimizer-analyzer", legacyPaidSlug: "fabric-cutting-optimizer-analyzer",
  name: "Fabric Cutting Optimizer", name_i18n: {"en":"Fabric Cutting Optimizer"}, sectorSlug: "textile", category: "cost",
  painStatement: "Fabric cutting efficiency if not calculated, waste rate and fabric cost cannot be controlled.", painStatement_i18n: {"en":"Fabric cutting efficiency if not calculated, waste rate and fabric cost cannot be controlled."},
  inputs: [
    { id: "fabricWidth", label: "Fabric width", label_i18n: {"en":"Fabric width"}, type: "number", unit: "m", required: true, smartDefault: 1.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Fabric width", expertMeaning_i18n: {"en":"Fabric width"} },
    { id: "markerLength", label: "Pastal Boyu", label_i18n: {"en":"Pastal Boyu"}, type: "number", unit: "m", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Marker length", expertMeaning_i18n: {"en":"Marker length"} },
    { id: "endLoss", label: "Fire/EndLoss", label_i18n: {"en":"Fire/EndLoss"}, type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0, max: 20 }, helper: "", expertMeaning: "End loss percentage", expertMeaning_i18n: {"en":"End loss percentage"} },
    { id: "patternAreas", label: "Pattern piece areas", label_i18n: {"en":"Pattern piece areas"}, type: "number", unit: "m²", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Pattern piece areas", expertMeaning_i18n: {"en":"Pattern piece areas"} },
    { id: "markerEfficiency", label: "Pastal Efficiency", label_i18n: {"en":"Pastal Efficiency"}, type: "number", unit: "%", required: true, smartDefault: 85, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Marker efficiency", expertMeaning_i18n: {"en":"Marker efficiency"} },
    { id: "pricePerMeter", label: "Fabric price per meter", label_i18n: {"en":"Fabric price per meter"}, type: "number", unit: "USD/m", required: true, smartDefault: 12, validation: { min: 0 }, helper: "", expertMeaning: "Fabric price per meter", expertMeaning_i18n: {"en":"Fabric price per meter"} },
    { id: "spliceOverlap", label: "Splicing overlap length", label_i18n: {"en":"Splicing overlap length"}, type: "number", unit: "m", required: false, smartDefault: 0.05, validation: { min: 0 }, helper: "", expertMeaning: "Splicing overlap length", expertMeaning_i18n: {"en":"Splicing overlap length"} },
    { id: "splices", label: "Number of fabric splices", label_i18n: {"en":"Number of fabric splices"}, type: "number", unit: "scalar", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Number of fabric splices", expertMeaning_i18n: {"en":"Number of fabric splices"} },
    { id: "oldEfficiency", label: "Eski Pastal Efficiency", label_i18n: {"en":"Eski Pastal Efficiency"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Previous marker efficiency", expertMeaning_i18n: {"en":"Previous marker efficiency"} },
  ],
  outputs: [
    { id: "cutEfficiency", label: "Kesim Efficiency", label_i18n: {"en":"Kesim Efficiency"}, unit: "%", format: "percentage" },
    { id: "fabricRequired", label: "required Fabric", label_i18n: {"en":"required Fabric"}, unit: "m", format: "number" },
    { id: "fabricCost", label: "Fabric Cost", label_i18n: {"en":"Fabric Cost"}, unit: "USD", format: "currency" },
    { id: "utilGain", label: "Efficiency improvement Gain", label_i18n: {"en":"Efficiency improvement Gain"}, unit: "USD", format: "currency" },
    { id: "totalYardage", label: "Total Pastal Boyu", label_i18n: {"en":"Total Pastal Boyu"}, unit: "m", format: "number" },
  ],
  thresholds: [{ fieldId: "cutEfficiency", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Efficiency < 80% - marker optimization recommended.", warningMessage_i18n: {"en":"Efficiency < 80% - marker optimization recommended."}, criticalMessage: "Efficiency < %70 - urgent improvement gerekli.", criticalMessage_i18n: {"en":"Efficiency < %70 - urgent improvement gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.fabric_marker_eff", inputMap: {
        netArea: "patternAreas",
        grossArea: "markerLength",
        fabricWidth: "fabricWidth"
      }, outputId: "cutEfficiency" },
    { formulaId: "measurement.fabric_required", inputMap: {
        netArea: "patternAreas",
        markerEff: "markerEfficiency",
        endLoss: "endLoss"
      }, outputId: "fabricRequired" },
    { formulaId: "cost.fabric_cost", inputMap: {
        fabricRequired: "fabricRequired",
        pricePerUnit: "pricePerMeter"
      }, outputId: "fabricCost" },
    { formulaId: "cost.fabric_util_gain", inputMap: {
        oldWaste: "oldEfficiency",
        newWaste: "markerEfficiency",
        pricePerUnit: "fabricRequired",
        totalYards: "pricePerMeter"
      }, outputId: "utilGain" },
    { formulaId: "measurement.fabric_total_yardage", inputMap: {
        pieces: "markerLength",
        fabricRequired: "endLoss",
        spliceOverlap: "spliceOverlap",
        splices: "splices"
      }, outputId: "totalYardage" },
  ],
  reportTemplate: { title: "Fabric Cutting Optimization Report", title_i18n: {"en":"Fabric Cutting Optimization Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: [],assumptionNotes_i18n:[{"en":"Yield = Total Part Area / (Marker × Width)."},{"en":"Required Fabric = Area / Yield × (1+Waste)."},{"en":"Improvement = (New - Old) × Fabric × Price."}] },
};
