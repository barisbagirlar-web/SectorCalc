import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const IotSensorVeOngorucuBakimYatirimGeriDonusCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator",
  name: "Iot Sensor Ve Ongorucu Bakim Yatirim Geri Donus",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Total cost of ownership and reliability engineering",

  inputs: [
    {
      id: "downtimeMinutes",
      label: "Annual unplanned downtime",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 5000,
      validation: { min: 0, max: 525600 },
      helper: "Non-negative minutes",
      expertMeaning: "Annual unplanned downtime",
    },
    {
      id: "machineHourlyRate",
      label: "Machine hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 150,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative rate",
      expertMeaning: "Machine hourly rate",
    },
    {
      id: "laborHourlyRate",
      label: "Labor hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 500 },
      helper: "Non-negative rate",
      expertMeaning: "Labor hourly rate",
    },
    {
      id: "lostProductionUnits",
      label: "Lost production units per year",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative integer",
      expertMeaning: "Lost production units per year",
    },
    {
      id: "contributionMarginPerUnit",
      label: "Contribution margin per unit",
      type: "number",
      unit: "USD/unit",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative margin",
      expertMeaning: "Contribution margin per unit",
    },
    {
      id: "repairCost",
      label: "Average repair cost per failure",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative cost",
      expertMeaning: "Average repair cost per failure",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "downtimeMinutes",
        "b": "machineHourlyRate",
        "c": "laborHourlyRate"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "downtimeMinutes",
        "target": "machineHourlyRate"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual savings after IoT",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Return on investment (ROI)",
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
      "IoT sensors reduce unplanned downtime by 30%",
      "IoT sensors reduce repair cost by 30%",
      "All failures are independent and identically distributed",
    ],
  },
};
