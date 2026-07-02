import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const ICI_WELL_SCHEMA: PremiumCalculatorSchema = {
  id: "ici-well",
  name: "Well Completion Commitment Calculator",
  sectorSlug: "industrial",
  category: "industrial",
  legacyPaidSlug: "ici-well",
  painStatement: "Quantify whether an irreversible industrial, infrastructure, or process CAPEX decision should be committed now, delayed, redesigned, released, held, or abandoned under uncertainty.",
  
  inputs: [
    { id: "expectedValue", label: "expected reservoir flow", type: "number", required: true, unit: "unit", helper: "Enter expected reservoir flow", expertMeaning: "expected reservoir flow" },
    { id: "uncertaintySigma", label: "decline curve uncertainty", type: "number", required: true, unit: "unit", helper: "Enter decline curve uncertainty", expertMeaning: "decline curve uncertainty" },
    { id: "downsideLoss", label: "dry hole or poor flow exposure", type: "number", required: true, unit: "unit", helper: "Enter dry hole or poor flow exposure", expertMeaning: "dry hole or poor flow exposure" },
    { id: "delayCost", label: "cost of rig delay", type: "number", required: true, unit: "unit", helper: "Enter cost of rig delay", expertMeaning: "cost of rig delay" },
    { id: "irreversibleCapex", label: "completion CAPEX locked", type: "number", required: true, unit: "unit", helper: "Enter completion CAPEX locked", expertMeaning: "completion CAPEX locked" },
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
    title: "Well Completion Commitment Calculator Report",
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
