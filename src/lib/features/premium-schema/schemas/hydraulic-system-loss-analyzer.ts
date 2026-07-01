/**
 * Tool #52 — Hydraulic Sistem Kayip
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const HYDRAULIC_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "hydraulic-system-loss-analyzer", legacyPaidSlug: "hydraulic-system-loss-analyzer",
  name: "Hydraulic System Loss & Efficiency Analyzer", name_i18n: {"en":"Hydraulic System Loss & Efficiency Analyzer"}, sectorSlug: "sheet-metal", category: "energy",
  painStatement: "Hidrolik sistemlerde kacak, surtunme ve vana kayiplari enerji verimini dusurur ve isletme maliyetini artirir.", painStatement_i18n: {"en":"In hydraulic systems, leak, friction, and valve losses reduce energy efficiency and increase operational cost."},
  inputs: [
    { id: "qLeak", label: "Leakage flow rate", label_i18n: {"en":"Leakage flow rate"}, type: "number", unit: "L/dak", required: true, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Leakage flow rate", expertMeaning_i18n: {"en":"Leakage flow rate"} },
    { id: "systemPressure", label: "System pressure", label_i18n: {"en":"System pressure"}, type: "number", unit: "bar", required: true, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "System pressure", expertMeaning_i18n: {"en":"System pressure"} },
    { id: "flowRate", label: "Pompa Debisi", label_i18n: {"en":"Pump Debisi"}, type: "number", unit: "L/dak", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Pump flow rate", expertMeaning_i18n: {"en":"Pump flow rate"} },
    { id: "deltaPipe", label: "Pipe friction loss", label_i18n: {"en":"Pipe friction loss"}, type: "number", unit: "bar", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Pipe friction loss", expertMeaning_i18n: {"en":"Pipe friction loss"} },
    { id: "deltaValve", label: "Valve pressure loss", label_i18n: {"en":"Valve pressure loss"}, type: "number", unit: "bar", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Valve pressure loss", expertMeaning_i18n: {"en":"Valve pressure loss"} },
    { id: "operatingHours", label: "Annual operating hours", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "saat/yil", required: false, smartDefault: 4000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours"} },
    { id: "elecRate", label: "Elektrik Tarifesi", label_i18n: {"en":"Elektrik Tarifesi"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity rate", expertMeaning_i18n: {"en":"Electricity rate"} },
    { id: "powerOut", label: "Output power", label_i18n: {"en":"Output power"}, type: "number", unit: "kW", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Output power", expertMeaning_i18n: {"en":"Output power"} },
    { id: "powerIn", label: "Input power", label_i18n: {"en":"Input power"}, type: "number", unit: "kW", required: false, smartDefault: 40, validation: { min: 0 }, helper: "", expertMeaning: "Input power", expertMeaning_i18n: {"en":"Input power"} },
  ],
  outputs: [
    { id: "leakLoss", label: "Leakage Power Loss", label_i18n: {"en":"Leakage Power Loss"}, unit: "kW", format: "number" },
    { id: "heatLoss", label: "Total Thermal Loss", label_i18n: {"en":"Total Thermal Loss"}, unit: "kW", format: "number" },
    { id: "eff", label: "System Efficiency", label_i18n: {"en":"System Efficiency"}, unit: "%", format: "percentage" },
    { id: "annualEnergyCost", label: "Annual Energy Loss Cost", label_i18n: {"en":"Annual Energy Loss Cost"}, unit: "USD/yil", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "eff", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — kacak ve surtunme kayiplari azaltilmali.", warningMessage_i18n: {"en":"Efficiency < %80 — leak and friction losses should be reduced."}, criticalMessage: "Verim < %70 — sistem revizyonu gerekli.", criticalMessage_i18n: {"en":"Efficiency < %70 — System revizyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "energy.hydraulic_heat_loss", inputMap: {
        qLeak: "qLeak",
        p: "deltaPipe",
        deltaPPipe: "deltaValve"
      ,
        qFlow: "qFlow",
        deltaPValve: "deltaPValve"}, outputId: "heatLoss" },
    { formulaId: "energy.hydraulic_cost", inputMap: {
        elecRate: "elecRate",
        heat: "heatLoss",
        hours: "operatingHours"
      }, outputId: "annualEnergyCost" },
    { formulaId: "energy.hydraulic_eff", inputMap: {
        pOut: "powerOut",
        pIn: "powerIn"
      }, outputId: "eff" },
  ],
  reportTemplate: { title: "Hydraulic System Loss Report", title_i18n: {"en":"Hydraulic System Loss Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Leak loss = Q_Leak×P/600. Friction = ΔP×Q/600.", "Heat = Leak+Friction+Valve. Cost = Heat×Hours×ElecRate.", "Eff = (P_Out/P_In)×100."],assumptionNotes_i18n:[{"en":"Leak loss = Q_Leak×P/600. Friction = ΔP×Q/600."},{"en":"Heat = Leak+Friction+Valve. Cost = Heat×Hours×ElecRate."},{"en":"Eff = (P_Out/P_In)×100."}] },
};
