import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HVAC_PROJECT_MARGIN_GUARD_SCHEMA: PremiumCalculatorSchema = {
  id: "hvac-project-margin-guard",
  name: "HVAC Project Margin Guard",
  sectorSlug: "hvac",
  category: "cost",
  legacyPaidSlug: "hvac-project-margin-guard",
  painStatement:
    "Find minimum HVAC project price with equipment, ductwork, callback and commissioning risk included.",

  inputs: [
    {
      id: "equipmentCost",
      label: "Equipment Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Total cost of HVAC equipment including units, condensers and accessories",
      expertMeaning: "Equipment cost including condensing units, air handlers, line sets, refrigerant and accessories",
    },
    {
      id: "ductworkCost",
      label: "Ductwork & Material Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Cost of ductwork, fittings, flex ducts and insulation",
      expertMeaning: "Ductwork material including sheet metal, flex duct, fittings, dampers and insulation",
    },
    {
      id: "laborHours",
      label: "Labor Hours",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0 },
      helper: "Estimated installation labor hours",
      expertMeaning: "Installation labor hours including equipment placement, ductwork, refrigerant lines and controls",
    },
    {
      id: "laborRate",
      label: "Hourly Labor Rate",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Fully loaded hourly rate for HVAC technicians",
      expertMeaning: "Labor rate including wages, burden, certification costs and truck overhead",
    },
    {
      id: "commissioningCost",
      label: "Commissioning Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Cost for startup, testing, balancing and controls programming",
      expertMeaning: "Commissioning cost including TAB, controls programming, startup labor and permit fees",
    },
    {
      id: "callbackRiskPercent",
      label: "Callback Risk (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Estimated probability of callback for adjustments or warranty work",
      expertMeaning: "Historical or estimated callback rate for commissioning issues, control errors or refrigerant leaks",
    },
    {
      id: "targetMargin",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum margin target for this HVAC project",
      expertMeaning: "Target gross margin used to compute minimum safe HVAC project price",
    },
  ],

  outputs: [
    { id: "minimumSafePrice", label: "Minimum Safe Price", unit: "currency", format: "currency", isBigNumber: true },
    { id: "quoteVerdict", label: "Quote Verdict", unit: "text", format: "number" },
    { id: "p90Cost", label: "P90 Cost Estimate", unit: "currency", format: "currency", isBigNumber: true },
    { id: "baseCost", label: "Base Cost", unit: "currency", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "callbackRiskPercent",
      warning: 3,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage: "Callback risk is elevated — verify commissioning and duct assumptions.",
      criticalMessage: "Critical callback exposure — reprice before accepting similar HVAC work.",
    },
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is building on this project envelope.",
      criticalMessage: "Critical margin pressure — hidden callback cost may erase profit.",
    },
  ],

  reportTemplate: {
    title: "HVAC Callback Margin Risk Decision Report",
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
    hiddenLossMultiplier: 1.11,
    volatilityPercent: 17,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Commissioning cost = commissioning hours × labor rate.",
      "Callback risk = project revenue × callback risk percent.",
      "Margin pressure = total exposure ÷ project revenue.",
    ],
  },
};
