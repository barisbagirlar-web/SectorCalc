/**
 * Tool #4 - Arac Amortismani (Vehicle Depreciation & TCO)
 * SL → DB → TCO → TaxShield
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const DEPRECIATION_METHOD_OPTIONS = [
  { value: "SL", label: "Straight-Line (SL)", label_i18n: {"en":"Straight-Line (SL)"} },
  { value: "DB", label: "Double-Declining (DB)", label_i18n: {"en":"Double-Declining (DB)"} },
  { value: "MACRS", label: "MACRS (ABD)", label_i18n: {"en":"MACRS (ABD)"} },
  { value: "UoP", label: "Units of Production (UoP)", label_i18n: {"en":"Units of Production (UoP)"} },
] as const;

const TAX_COUNTRY_OPTIONS = [
  { value: "US", label: "United States", label_i18n: {"en":"United States"} }, { value: "EU", label: "European Union", label_i18n: {"en":"European Union"} },
  { value: "TR", label: "Turkiye", label_i18n: {"en":"Turkiye"} }, { value: "UK", label: "United Kingdom", label_i18n: {"en":"United Kingdom"} },
] as const;

export const VEHICLE_DEPRECIATION_SCHEMA: PremiumCalculatorSchema = {
  id: "vehicle-depreciation-tco-analyzer", legacyPaidSlug: "vehicle-depreciation-tco-analyzer",
  name: "Vehicle Depreciation & TCO Analyzer", name_i18n: {"en":"Vehicle Depreciation & TCO Analyzer"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "If depreciation method selection and TCO calculation are not performed in fleet investments, tax advantage is missed and cash flow is incorrectly modeled.", painStatement_i18n: {"en":"If depreciation method selection and TCO calculation are not performed in fleet investments, tax advantage is missed and cash flow is incorrectly modeled."},
  inputs: [
    { id: "acquisitionCost", label: "Edinme Bedeli", label_i18n: {"en":"Edinme Bedeli"}, type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Purchase price incl. taxes", expertMeaning_i18n: {"en":"Purchase price incl. taxes"} },
    { id: "salvageValue", label: "Residual value at end of life", label_i18n: {"en":"Residual value at end of life"}, type: "number", unit: "USD", required: true, smartDefault: 10000, validation: { min: 0 }, helper: "Estimated value of the asset at the end of its economic life.", helper_i18n: {"en":"Estimated value of the asset at the end of its economic life."}, expertMeaning: "Residual value at end of life", expertMeaning_i18n: {"en":"Residual value at end of life"} },
    { id: "usefulLife", label: "Depreciation period", label_i18n: {"en":"Depreciation period"}, type: "number", unit: "years", required: true, smartDefault: 5, validation: { min: 1, max: 30 }, helper: "", expertMeaning: "Depreciation period", expertMeaning_i18n: {"en":"Depreciation period"} },
    { id: "annualKm", label: "For UoP method", label_i18n: {"en":"For UoP method"}, type: "number", unit: "km/yil", required: false, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "For UoP method", expertMeaning_i18n: {"en":"For UoP method"} },
    { id: "totalExpectedKm", label: "Total Expected Km", label_i18n: {"en":"Total Expected Km"}, type: "number", unit: "km", required: false, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Total useful life in km (UoP)", expertMeaning_i18n: {"en":"Total useful life in km (UoP)"} },
    { id: "depreciationMethod", label: "SL, DB, MACRS or UoP", label_i18n: {"en":"SL, DB, MACRS or UoP"}, type: "select", unit: "scalar", required: true, smartDefault: "SL", options: [...DEPRECIATION_METHOD_OPTIONS], helper: "", expertMeaning: "SL, DB, MACRS or UoP", expertMeaning_i18n: {"en":"SL, DB, MACRS or UoP"} },
    { id: "taxRate", label: "Kurumlar Vergisi", label_i18n: {"en":"Kurumlar Vergisi"}, type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Corporate tax rate", expertMeaning_i18n: {"en":"Corporate tax rate"} },
    { id: "wacc", label: "Discount rate for PV", label_i18n: {"en":"Discount rate for PV"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for PV", expertMeaning_i18n: {"en":"Discount rate for PV"} },
    { id: "annualOpCost", label: "Insurance, registration, tires", label_i18n: {"en":"Insurance, registration, tires"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Insurance, registration, tires", expertMeaning_i18n: {"en":"Insurance, registration, tires"} },
    { id: "annualMaintCost", label: "Repairs, maintenance", label_i18n: {"en":"Repairs, maintenance"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Repairs, maintenance", expertMeaning_i18n: {"en":"Repairs, maintenance"} },
  ],
  outputs: [
    { id: "slAnnual", label: "SL Annual Depreciation", label_i18n: {"en":"SL Annual Depreciation"}, unit: "USD", format: "currency" },
    { id: "slMonthly", label: "SL Monthly Depreciation", label_i18n: {"en":"SL Monthly Depreciation"}, unit: "USD", format: "currency" },
    { id: "dbRate", label: "DB Annual Rate", label_i18n: {"en":"DB Annual Rate"}, unit: "%", format: "percentage" },
    { id: "taxShieldAnnual", label: "Annual tax Kalkan", label_i18n: {"en":"Annual tax Kalkan"}, unit: "USD", format: "currency" },
    { id: "tco", label: "TCO (Total Sahip Olma Cost)", label_i18n: {"en":"TCO (Total Sahip Olma Cost)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "tco", warning: 75000, critical: 100000, direction: "higher_is_bad", warningMessage: "TCO > $75K - Evaluate cost optimization.", warningMessage_i18n: {"en":"TCO > $75K - Evaluate cost optimization."}, criticalMessage: "TCO > $100K - Alternative vehicle/financing models must be reviewed.", criticalMessage_i18n: {"en":"TCO > $100K - Alternative vehicle/financing models must be reviewed."} },
  ],
  formulaPipeline: [
    { formulaId: "depreciation.sl_annual", inputMap: { cost: "acquisitionCost", residualValue: "salvageValue", usefulLife: "usefulLife" }, outputId: "slAnnual" },
    { formulaId: "depreciation.db_rate", inputMap: { usefulLife: "usefulLife" }, outputId: "dbRate" },
    { formulaId: "depreciation.tco", inputMap: { acquisitionCost: "acquisitionCost", annualOpCost: "annualOpCost", annualMaintCost: "annualMaintCost", fuelCostPerYear: "annualOpCost", residualValue: "salvageValue", discountRate: "wacc", usefulLife: "usefulLife" }, outputId: "tco" },
    { formulaId: "depreciation.tax_shield", inputMap: { annualDepreciation: "slAnnual", taxRate: "taxRate" }, outputId: "taxShieldAnnual" },
  ],
  reportTemplate: { title: "Vehicle Depreciation & TCO Report", title_i18n: {"en":"Vehicle Depreciation & TCO Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["SL = (Cost - Salvage) / Life. DB = 2/Life % of remaining book value.", "TCO = Acquisition + PV(Operating + Maintenance) - PV(Salvage).", "Tax shield = Depreciation × TaxRate. PV at WACC.", "MACRS and UoP methods require additional asset class data."],assumptionNotes_i18n:[{"en":"SL = (Cost - Salvage) / Life. DB = 2/Life % of remaining book value."},{"en":"TCO = Acquisition + PV(Operating + Maintenance) - PV(Salvage)."},{"en":"Tax shield = Depreciation × TaxRate. PV at WACC."},{"en":"MACRS and UoP methods require additional asset class data."}] },
};
