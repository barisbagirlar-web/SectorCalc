import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_SCHEMA: PremiumCalculatorSchema = {
  id: "doviz-pozisyonu-kur-farki-riski-hesabi",
  name: "Döviz Pozisyonu — Kur Farkı Riski Calculation",
  sectorSlug: "logistics-transport",
  category: "route",
  legacyPaidSlug: "doviz-pozisyonu-kur-farki-riski-hesabi",
  painStatement:
    "Döviz Pozisyonu — Kur Farkı Riski Calculation — free browser calculator with instant results.",

  inputs: [
    {
      id: "plannedDistanceKm",
      label: "Planned distance",
      type: "number",
      unit: "km",
      required: true,
      smartDefault: 520,
      validation: { min: 0 },
      helper: "Baseline route distance from plan.",
      expertMeaning: "Quoted or scheduled distance envelope.",
    },
    {
      id: "actualDistanceKm",
      label: "Actual distance",
      type: "number",
      unit: "km",
      required: true,
      smartDefault: 575,
      validation: { min: 0 },
      helper: "Observed or projected distance driven.",
      expertMeaning: "Actual km including detours and deadhead.",
    },
    {
      id: "fuelCostPerKm",
      label: "Fuel cost per km",
      type: "number",
      unit: "USD/km",
      required: true,
      smartDefault: 0.42,
      validation: { min: 0 },
      helper: "Fully loaded fuel cost per kilometer.",
      expertMeaning: "Fuel and road cost rate applied to drift km.",
    },
    {
      id: "idleHours",
      label: "Idle hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 5,
      validation: { min: 0 },
      helper: "Waiting, loading or idle engine hours.",
      expertMeaning: "Non-productive time priced at hourly cost.",
    },
    {
      id: "hourlyCost",
      label: "Hourly cost",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 28,
      validation: { min: 0 },
      helper: "Driver and equipment cost per idle hour.",
      expertMeaning: "Loaded hourly burn for idle exposure.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "route.distance_drift_cost",
      inputMap: {
        plannedDistanceKm: "plannedDistanceKm",
        actualDistanceKm: "actualDistanceKm",
        fuelCostPerKm: "fuelCostPerKm",
      },
      outputId: "distanceDriftCost",
    },
    {
      formulaId: "time.labor_cost",
      inputMap: {
        hourlyCost: "hourlyCost",
        lossHours: "idleHours",
      },
      outputId: "idleCost",
    },
    {
      formulaId: "cost.sum2",
      inputMap: {
        a: "distanceDriftCost",
        b: "idleCost",
      },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total route drift exposure",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "distanceDriftCost",
      label: "Distance drift cost",
      unit: "USD",
      format: "currency",
    },
    {
      id: "idleCost",
      label: "Idle cost",
      unit: "USD",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "idleHours",
      warning: 3,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage:
        "Idle hours are above plan — route sequencing or loading windows may need adjustment.",
      criticalMessage:
        "Critical idle exposure — fuel and labor drift may erase route margin.",
    },
  ],

  reportTemplate: {
    title: "Fuel and Route Drift Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.07,
    volatilityPercent: 15,
    targetMarginPercent: 14,
    assumptionNotes: [
      "Distance drift cost = max(actual km − planned km, 0) × fuel cost per km.",
      "Idle cost = idle hours × hourly cost.",
      "Total exposure sums distance drift and idle cost.",
    ],
  },
};
