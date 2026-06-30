import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const WAITING_OPPORTUNITY_MODE_OPTIONS = [
  { value: "none", label: "Exclude opportunity cost" },
  { value: "manualHourly", label: "Manual hourly opportunity cost" },
  { value: "derivedThroughput", label: "Derive from planned throughput" },
] as const;

const CURRENCY_CODE_OPTIONS = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "TRY", label: "TRY — Turkish Lira" },
  { value: "CHF", label: "CHF — Swiss Franc" },
  { value: "JPY", label: "JPY — Japanese Yen" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
] as const;

export const SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-501",
  name: "7 Waste (Muda) Hunter Monetary Impact Calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  painStatement:
    "Lean teams see waste categories qualitatively but cannot express each muda type in comparable monetary terms with period context and action priority.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "totalWasteCost",
      warning: 5000,
      critical: 15000,
      direction: "higher_is_bad",
      warningMessage: "Total muda exposure is material — review the highest waste category and recommended action order.",
      criticalMessage: "Total muda exposure is severe — launch focused kaizen on the dominant waste driver.",
    },
  ],

  reportTemplate: {
    title: "7 Muda Monetary Impact Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 8,
    targetMarginPercent: 0,
    assumptionNotes: [
      "All monetary inputs must use the selected currencyCode for the analysis period.",
      "productionUnitsInPeriod is the production volume inside the selected analysis period only.",
      "excessWriteDownCostPerUnit is per excess unit, not a lump-sum write-down total.",
      "inventoryObsolescenceValue is stock write-down outside excess-production write-down.",
      "Hourly labor and machine rates are converted to minute costs inside the engineering calculator.",
      "waitingOpportunityMode controls whether opportunity cost is excluded, manual, or throughput-derived.",
      "Invalid inputs fail validation explicitly; schema smartDefault values must be present in submitted input values.",
    ],
  },
};
