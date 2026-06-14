import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator",
  name: "Kazanilmis Deger Yonetimi Evm Tamamlanma Maliyet Tahmin",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Project Management Institute (PMI) EVM standard; industrial engineering cost accounting",

  inputs: [
    {
      id: "budgetAtCompletion",
      label: "Budget at Completion (BAC)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100000,
      validation: { min: 0.01, max: 1000000000 },
      helper: "Must be positive currency amount",
      expertMeaning: "Budget at Completion (BAC)",
    },
    {
      id: "plannedValue",
      label: "Planned Value (PV)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency; should be <= BAC",
      expertMeaning: "Planned Value (PV)",
    },
    {
      id: "earnedValue",
      label: "Earned Value (EV)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 40000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency; should be <= BAC",
      expertMeaning: "Earned Value (EV)",
    },
    {
      id: "actualCost",
      label: "Actual Cost (AC)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 45000,
      validation: { min: 0.01, max: 1000000000 },
      helper: "Must be positive currency amount",
      expertMeaning: "Actual Cost (AC)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "budgetAtCompletion",
        "b": "plannedValue",
        "c": "earnedValue"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "budgetAtCompletion",
        "target": "plannedValue"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Estimate at Completion (EAC)",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost Performance Index (CPI)",
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
      "All costs are in the same currency",
      "Work is measured in consistent units (e.g., hours, dollars)",
      "CPI and SPI are representative of future performance",
    ],
  },
};
