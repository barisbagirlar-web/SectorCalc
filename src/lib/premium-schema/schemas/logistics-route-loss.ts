import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const LOGISTICS_ROUTE_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "logistics-route-loss",
  name: "Logistics Route & Deadhead Loss Report",
  sectorSlug: "logistics-transport",
  category: "route",
  legacyPaidSlug: "route-optimization-analyzer",
  painStatement:
    "Empty miles, fuel variance and delay erode freight margin before the load is accepted.",

  inputs: [
    {
      id: "distanceKm",
      label: "Distance",
      type: "number",
      unit: "km",
      required: true,
      smartDefault: 500,
      validation: { min: 1 },
      helper: "One-way loaded distance.",
      expertMeaning: "Primary haul length for cost stack.",
    },
    {
      id: "costPerKm",
      label: "Cost per km",
      type: "number",
      unit: "$/km",
      required: true,
      smartDefault: 0.35,
      validation: { min: 0, step: 0.01 },
      helper: "Fuel + wear per km all-in.",
      expertMeaning: "Fully loaded km cost.",
    },
    {
      id: "emptyReturnPercent",
      label: "Empty return",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 40,
      validation: { min: 0, max: 100 },
      helper: "Unpaid return miles as percent of loaded distance.",
      expertMeaning: "Deadhead exposure on the lane.",
    },
    {
      id: "driverHours",
      label: "Driver hours",
      type: "number",
      unit: "h",
      required: true,
      smartDefault: 8,
      validation: { min: 0.1 },
      helper: "Total driving + waiting on lane.",
      expertMeaning: "Labor time tied to the trip.",
    },
    {
      id: "driverRate",
      label: "Driver rate",
      type: "number",
      unit: "$/h",
      required: true,
      smartDefault: 28,
      validation: { min: 0 },
      helper: "Fully loaded driver cost per hour.",
      expertMeaning: "Labor rate including burden.",
    },
    {
      id: "tolls",
      label: "Tolls",
      type: "number",
      unit: "$",
      required: true,
      smartDefault: 40,
      validation: { min: 0 },
      helper: "Road and bridge tolls for the lane.",
      expertMeaning: "Fixed route fees.",
    },
    {
      id: "quotedFreightPrice",
      label: "Quoted freight price",
      type: "number",
      unit: "$",
      required: false,
      smartDefault: 1200,
      validation: { min: 0 },
      helper: "Price offered for the load.",
      expertMeaning: "Verdict comparison price.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "route.deadhead_cost",
      inputMap: {
        distanceKm: "distanceKm",
        costPerKm: "costPerKm",
        emptyReturnPercent: "emptyReturnPercent",
      },
      outputId: "deadheadCost",
    },
    {
      formulaId: "loss.time_cost",
      formulaFamily: "time",
      inputMap: { hourlyCost: "driverRate", lossHours: "driverHours" },
      outputId: "driverCost",
    },
    {
      formulaId: "energy.kwh_cost",
      formulaFamily: "energy",
      inputMap: {
        kwh: "distanceKm",
        rate: "costPerKm",
      },
      outputId: "fuelCost",
    },
    {
      formulaId: "route.total_freight_cost",
      inputMap: {
        fuelCost: "fuelCost",
        driverCost: "driverCost",
        tolls: "tolls",
        deadheadCost: "deadheadCost",
      },
      outputId: "totalFreightCost",
    },
    {
      formulaId: "loss.total_exposure",
      formulaFamily: "scrap",
      inputMap: {
        baseCost: "totalFreightCost",
        hiddenMultiplier: "hiddenMultiplierConst",
      },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "deadheadCost",
      label: "Deadhead cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "driverCost",
      label: "Driver cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "totalFreightCost",
      label: "Visible freight cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "totalExposure",
      label: "Total route loss exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
  ],

  thresholds: [
    {
      fieldId: "deadheadCost",
      warning: 80,
      critical: 150,
      direction: "higher_is_bad",
      warningMessage: "Energy and delay exposure are the main risk drivers on this lane.",
      criticalMessage: "High risk — hidden cost may erase the margin. Reprice before accepting this load.",
    },
    {
      fieldId: "totalFreightCost",
      warning: 900,
      critical: 1200,
      direction: "higher_is_bad",
      warningMessage: "Visible cost is approaching typical quote band — check fuel variance.",
      criticalMessage: "Freight cost exceeds safe band — raise price or cut deadhead.",
    },
  ],

  reportTemplate: {
    title: "Route Loss Decision Report",
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
    hiddenLossMultiplier: 1.1,
    volatilityPercent: 23,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Deadhead assumes unpaid return as percent of loaded km.",
      "Delay and fuel variance buffers included in hidden multiplier.",
      "Verify lane-specific detention and toll changes before dispatch.",
    ],
  },
};
