import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const ICI_WELD_PWHT_SCHEMA: PremiumCalculatorSchema = {
  id: "ici-weld-pwht",
  name: "Post-Weld Heat Treatment Release Calculator",
  sectorSlug: "industrial",
  category: "industrial",
  legacyPaidSlug: "ici-weld-pwht",
  painStatement: "Quantify whether an irreversible industrial, infrastructure, or process CAPEX decision should be committed now, delayed, redesigned, released, held, or abandoned under uncertainty.",
  
  inputs: [
    { id: "expectedValue", label: "expected PWHT adequacy margin", type: "number", required: true, unit: "unit", helper: "Enter expected PWHT adequacy margin", expertMeaning: "expected PWHT adequacy margin" },
    { id: "uncertaintySigma", label: "hardness risk uncertainty", type: "number", required: true, unit: "unit", helper: "Enter hardness risk uncertainty", expertMeaning: "hardness risk uncertainty" },
    { id: "downsideLoss", label: "rework and field failure exposure", type: "number", required: true, unit: "unit", helper: "Enter rework and field failure exposure", expertMeaning: "rework and field failure exposure" },
    { id: "delayCost", label: "cost of holding for NDT", type: "number", required: true, unit: "unit", helper: "Enter cost of holding for NDT", expertMeaning: "cost of holding for NDT" },
    { id: "irreversibleCapex", label: "release and assembly cost", type: "number", required: true, unit: "unit", helper: "Enter release and assembly cost", expertMeaning: "release and assembly cost" },
    { id: "recoveryValue", label: "recoveryValue", type: "number", required: true, unit: "unit", helper: "Enter recoveryValue", expertMeaning: "recoveryValue" },
    { id: "confidenceLevel", label: "confidenceLevel", type: "number", required: true, unit: "unit", helper: "Enter confidenceLevel", expertMeaning: "confidenceLevel" },
    { id: "decisionHorizon", label: "decisionHorizon", type: "number", required: true, unit: "unit", helper: "Enter decisionHorizon", expertMeaning: "decisionHorizon" },
    { id: "regulatoryOrSafetyCriticality", label: "regulatoryOrSafetyCriticality", type: "number", required: true, unit: "unit", helper: "Enter regulatoryOrSafetyCriticality", expertMeaning: "regulatoryOrSafetyCriticality" },
    { id: "operatingMarginBuffer", label: "operatingMarginBuffer", type: "number", required: true, unit: "unit", helper: "Enter operatingMarginBuffer", expertMeaning: "operatingMarginBuffer" }
  ],

  outputs: [
    { id: "decisionVerdict", label: "decisionVerdict", unit: "unit", format: "number" },
    { id: "uncertaintyBand", label: "uncertaintyBand", unit: "unit", format: "number" },
    { id: "irreversibilityPenalty", label: "irreversibilityPenalty", unit: "unit", format: "number" },
    { id: "waitOptionValue", label: "waitOptionValue", unit: "unit", format: "number" },
    { id: "survivalProbability", label: "survivalProbability", unit: "unit", format: "number" },
    { id: "commitmentThreshold", label: "commitmentThreshold", unit: "unit", format: "number" }
  ],

  formulaPipeline: [
    {
      formulaId: "calculateUncertaintyBand",
      outputId: "uncertaintyBand",
      inputMap: { expectedValue: "expectedValue", uncertaintySigma: "uncertaintySigma", confidenceLevel: "confidenceLevel" }
    },
    {
      formulaId: "calculateDownsideExposure",
      outputId: "downsideExposure_out",
      inputMap: { expectedValue: "expectedValue", uncertaintySigma: "uncertaintySigma", downsideLoss: "downsideLoss", operatingMarginBuffer: "operatingMarginBuffer" }
    },
    {
      formulaId: "calculateIrreversibilityPenalty",
      outputId: "irreversibilityPenalty",
      inputMap: { irreversibleCapex: "irreversibleCapex", recoveryValue: "recoveryValue", downsideLoss: "downsideLoss", regulatoryOrSafetyCriticality: "regulatoryOrSafetyCriticality" }
    },
    {
      formulaId: "calculateWaitOptionValue",
      outputId: "waitOptionValue",
      inputMap: { delayCost: "delayCost", uncertaintySigma: "uncertaintySigma", decisionHorizon: "decisionHorizon", irreversibleCapex: "irreversibleCapex" }
    },
    {
      formulaId: "calculateSurvivalProbability",
      outputId: "survivalProbability",
      inputMap: { downsideExposure: "downsideExposure_out", operatingMarginBuffer: "operatingMarginBuffer", regulatoryOrSafetyCriticality: "regulatoryOrSafetyCriticality" }
    },
    {
      formulaId: "calculateCommitmentThreshold",
      outputId: "commitmentThreshold",
      inputMap: { irreversibilityPenalty: "irreversibilityPenalty", waitOptionValue: "waitOptionValue", survivalProbability: "survivalProbability", delayCost: "delayCost" }
    },
    {
      formulaId: "calculateDecisionVerdict",
      outputId: "decisionVerdict",
      inputMap: { commitmentThreshold: "commitmentThreshold", survivalProbability: "survivalProbability", irreversibilityPenalty: "irreversibilityPenalty", waitOptionValue: "waitOptionValue" }
    }
  ],

  thresholds: [
    {
      fieldId: "decisionVerdict",
      warning: 2,
      critical: 5,
      direction: "higher_is_bad",
      warningMessage: "Warning verdict",
      criticalMessage: "Critical verdict"
    }
  ],

  reportTemplate: {
    title: "Post-Weld Heat Treatment Release Calculator Report",
    sections: ["executive_summary"],
    exportFormats: ["pdf"]
  },

  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Engineering Disclaimer: This tool uses deterministic engineering-decision scoring. Verify before compliance decisions."]
  }
};
