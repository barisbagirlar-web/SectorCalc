import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "oee-equipment-effectiveness-calculator",
  name: "OEE Calculator",
  sectorSlug: "manufacturing",
  category: "oee",
  painStatement:
    "Without OEE tracking, chronic downtime and quality loss stay invisible.",

  inputs: [
    { id: "plannedProductionTime", label: "Planned Production Time", type: "number", unit: "min", required: true, smartDefault: 480 },
    { id: "downtime", label: "Downtime", type: "number", unit: "min", required: true, smartDefault: 60 },
    { id: "idealCycleTime", label: "Ideal Cycle Time", type: "number", unit: "min", required: true, smartDefault: 1 },
    { id: "totalCount", label: "Total Parts Produced", type: "number", unit: "units", required: true, smartDefault: 400 },
    { id: "goodCount", label: "Good Parts Produced", type: "number", unit: "units", required: true, smartDefault: 380 }
  ],

  outputs: [
    { id: "operatingTime", label: "Operating Time", unit: "dak", format: "decimal" },
    { id: "availability", label: "Availability", unit: "percent", format: "decimal" },
    { id: "performance", label: "Performance", unit: "percent", format: "decimal" },
    { id: "quality", label: "Quality", unit: "percent", format: "decimal" },
    { id: "oee", label: "OEE Score", unit: "percent", format: "decimal", isBigNumber: true }
  ],

  thresholds: [
    {
      fieldId: "oee",
      warning: 65,
      critical: 50,
      direction: "lower_is_bad",
      warningMessage: "OEE is below world-class band — investigate downtime and quality losses.",
      criticalMessage: "OEE is critically low — margin may be lost before quotes are repriced.",
    },
  ],

  formulaPipeline: [
    { formulaId: "math.subtract", inputMap: { a: "plannedProductionTime", b: "downtime" }, outputId: "operatingTime" },
    { formulaId: "measurement.oee_availability", inputMap: { plannedProdTime: "plannedProductionTime", operatingTime: "operatingTime" }, outputId: "availability" },
    { formulaId: "measurement.oee_performance", inputMap: { idealCycleTime: "idealCycleTime", totalParts: "totalCount", operatingTime: "operatingTime" }, outputId: "performance" },
    { formulaId: "measurement.oee_quality", inputMap: { goodParts: "goodCount", totalParts: "totalCount" }, outputId: "quality" },
    { formulaId: "measurement.oee_score", inputMap: { oeeAvailability: "availability", oeePerformance: "performance", oeeQuality: "quality" }, outputId: "oee" }
  ],

  reportTemplate: {
    title: "OEE Equipment Effectiveness Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "OEE = availability × performance × quality.",
      "Availability loss cost uses machine rate and downtime hours.",
    ],
  },
};
