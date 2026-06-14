import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AndonSistemiDurusVeTepkiSuresiMaliyetCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator",
  name: "Andon Sistemi Durus Ve Tepki Suresi Maliyet",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Lean manufacturing cost accounting and downtime costing",

  inputs: [
    {
      id: "directMaterialCost",
      label: "Direct material cost per batch",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Direct material cost per batch",
    },
    {
      id: "directLaborCost",
      label: "Direct labor cost per batch",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 300,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Direct labor cost per batch",
    },
    {
      id: "machineOrEquipmentCost",
      label: "Machine/equipment cost per batch",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 200,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Machine/equipment cost per batch",
    },
    {
      id: "overheadPercent",
      label: "Overhead percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Overhead percentage",
    },
    {
      id: "contingencyPercent",
      label: "Contingency percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Contingency percentage",
    },
    {
      id: "targetGrossMarginPercent",
      label: "Target gross margin percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 25,
      validation: { min: 1, max: 85, step: 0.1 },
      helper: "Percent between 1 and 85",
      expertMeaning: "Target gross margin percentage",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "directMaterialCost",
        "b": "directLaborCost",
        "c": "machineOrEquipmentCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "directMaterialCost",
        "target": "directLaborCost"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total stop cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per minute of stop",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "All costs are per batch and consistent",
      "Cycle time is constant per unit",
      "Stop duration is continuous and fully unproductive",
    ],
  },
};
