
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CNC_MACHINING_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-machining-cost-analyzer", legacyPaidSlug: "cnc-machining-cost-analyzer",
  name: "CNC Machining Unit Cost Analysis", name_i18n: {"en":"CNC Machining Unit Cost Analysis"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Pricing without breaking down CNC part cost into material, machining, tooling, energy, and overhead leads to margin loss.", painStatement_i18n: {"en":"Pricing without breaking down CNC part cost into material, machining, tooling, energy, and overhead leads to margin loss."},
  inputs: [
    { id: "rawVolume", label: "Raw Material Volume", label_i18n: {"en":"Raw Material Volume"}, type: "number", unit: "cm³", required: true, smartDefault: 500, validation: { min: 0.1 }, helper: "", expertMeaning: "Raw material volume per part", expertMeaning_i18n: {"en":"Raw material volume per part"} },
    { id: "density", label: "Material Density", label_i18n: {"en":"Material Density"}, type: "number", unit: "g/cm³", required: true, smartDefault: 7.85, validation: { min: 0.1 }, helper: "", expertMeaning: "Material density", expertMeaning_i18n: {"en":"Material density"} },
    { id: "pricePerKg", label: "Material Unit Price", label_i18n: {"en":"Material Unit Price"}, type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Material price per kg", expertMeaning_i18n: {"en":"Material price per kg"} },
    { id: "scrapRate", label: "Scrap Rate", label_i18n: {"en":"Scrap Rate"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material scrap rate", expertMeaning_i18n: {"en":"Material scrap rate"} },
    { id: "totalTime", label: "Total Machining Time", label_i18n: {"en":"Total Machining Time"}, type: "number", unit: "dak", required: true, smartDefault: 5, validation: { min: 0.1 }, helper: "", expertMeaning: "Total machining time per part", expertMeaning_i18n: {"en":"Total machining time per part"} },
    { id: "machineRate", label: "Machine Hourly Rate", label_i18n: {"en":"Machine Hourly Rate"}, type: "number", unit: "USD/hour", required: true, smartDefault: 85, validation: { min: 1 }, helper: "", expertMeaning: "Machine hourly rate", expertMeaning_i18n: {"en":"Machine hourly rate"} },
    { id: "cutTime", label: "Cutting Time (T_cut)", label_i18n: {"en":"Cutting Time (T_cut)"}, type: "number", unit: "dak", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Actual cutting time", expertMeaning_i18n: {"en":"Actual cutting time"} },
    { id: "toolLife", label: "Tool Life", label_i18n: {"en":"Tool Life"}, type: "number", unit: "dak", required: false, smartDefault: 60, validation: { min: 0 }, helper: "", expertMeaning: "Tool life in minutes", expertMeaning_i18n: {"en":"Tool life in minutes"} },
    { id: "toolCost", label: "Tool Cost", label_i18n: {"en":"Tool Cost"}, type: "number", unit: "USD", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Cost per cutting edge", expertMeaning_i18n: {"en":"Cost per cutting edge"} },
    { id: "machinePower", label: "Machine Power", label_i18n: {"en":"Machine Power"}, type: "number", unit: "kW", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Machine spindle power", expertMeaning_i18n: {"en":"Machine spindle power"} },
    { id: "elecRate", label: "Electricity Rate", label_i18n: {"en":"Electricity Rate"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity unit cost", expertMeaning_i18n: {"en":"Electricity unit cost"} },
    { id: "overheadRate", label: "Overhead Rate", label_i18n: {"en":"Overhead Rate"}, type: "number", unit: "USD/hour", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Overhead allocation rate", expertMeaning_i18n: {"en":"Overhead allocation rate"} },
    { id: "qualityCost", label: "Quality Cost", label_i18n: {"en":"Quality Cost"}, type: "number", unit: "USD", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Inspection/rework per part", expertMeaning_i18n: {"en":"Inspection/rework per part"} },
  ],
  outputs: [
    { id: "materialCost", label: "Material Cost", label_i18n: {"en":"Material Cost"}, unit: "USD", format: "currency" },
    { id: "machiningCost", label: "Machining Cost", label_i18n: {"en":"Machining Cost"}, unit: "USD", format: "currency" },
    { id: "toolingCost", label: "Tool Cost", label_i18n: {"en":"Tool Cost"}, unit: "USD", format: "currency" },
    { id: "energyCost", label: "Energy Cost", label_i18n: {"en":"Energy Cost"}, unit: "USD", format: "currency" },
    { id: "overheadCost", label: "Genel Expense", label_i18n: {"en":"Genel Expense"}, unit: "USD", format: "currency" },
    { id: "totalUnitCost", label: "Total Unit Cost", label_i18n: {"en":"Total Unit Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalUnitCost", warning: 15, critical: 30, direction: "higher_is_bad", warningMessage: "Unit cost > $15 — evaluate cost optimization.", warningMessage_i18n: {"en":"Unit cost > $15 — evaluate cost optimization."}, criticalMessage: "Unit cost > $30 — consider alternative process/material.", criticalMessage_i18n: {"en":"Unit cost > $30 — consider alternative process/material."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.cnc_material", inputMap: { rawVolume: "rawVolume", density: "density", pricePerKg: "pricePerKg", scrapRate: "scrapRate" }, outputId: "materialCost" },
    { formulaId: "cost.cnc_machining", inputMap: {
        machineRate: "machineRate",
        totalCycleTime: "totalTime"
      }, outputId: "machiningCost" },
    { formulaId: "cost.cnc_tooling", inputMap: { cutTime: "cutTime", toolLife: "toolLife", toolCost: "toolCost" }, outputId: "toolingCost" },
    { formulaId: "cost.cnc_energy", inputMap: {
        elecRate: "elecRate",
        power: "machinePower",
        totalCycleTime: "totalTime"
      }, outputId: "energyCost" },
    { formulaId: "cost.cnc_overhead", inputMap: {
        overheadRate: "overheadRate",
        totalCycleTime: "totalTime"
      }, outputId: "overheadCost" },
    { formulaId: "cost.cnc_total_unit", inputMap: { materialCost: "materialCost", machiningCost: "machiningCost", toolingCost: "toolingCost", energyCost: "energyCost", overheadCost: "overheadCost", qualityCost: "qualityCost" }, outputId: "totalUnitCost" },
  ],
  reportTemplate: { title: "CNC Machining Cost Report", title_i18n: {"en":"CNC Machining Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Mat = Vol×Density×Price×(1+Scrap%).", "Machining = T_total×MachineRate/60. Tooling = (T_cut/ToolLife)×ToolCost.", "Energy = Power×T_total/60×ElecRate."],assumptionNotes_i18n:[{"en":"Mat = Vol×Density×Price×(1+Scrap%)."},{"en":"Machining = T_total×MachineRate/60. Tooling = (T_cut/ToolLife)×ToolCost."},{"en":"Energy = Power×T_total/60×ElecRate."}]},
};
