/**
 * Tool — Steam Trap
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const STEAM_TRAP_ENERGY_LOSS_ANALYZER: PremiumCalculatorSchema = {
  id: "steam-trap-energy-loss-analyzer", legacyPaidSlug: "steam-trap-energy-loss-analyzer",
  name: "Steam Trap Energy Loss Analysis", name_i18n: {"en":"Steam Trap Energy Loss Analysis"}, sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Faulty steam traps cause significant energy loss unnoticed, and if these losses are not measured, energy efficiency suffers.", painStatement_i18n: {"en":"Faulty steam traps cause significant energy loss unnoticed, and if these losses are not measured, energy efficiency suffers."},
  inputs: [
    { id: "steamPressure", label: "Steam Pressure", label_i18n: {"en":"Steam Pressure"}, type: "number", unit: "bar", required: true, smartDefault: 7, validation: { min: 0.1 }, helper: "", expertMeaning: "Steam pressure in bar", expertMeaning_i18n: {"en":"Steam pressure in bar"} },
    { id: "holeDiameter", label: "Leak Diameter", label_i18n: {"en":"Leak Diameter"}, type: "number", unit: "mm", required: true, smartDefault: 3, validation: { min: 0.1 }, helper: "", expertMeaning: "Orifice diameter in mm", expertMeaning_i18n: {"en":"Orifice diameter in mm"} },
    { id: "operatingHoursPerYear", label: "Annual Operating Hours", label_i18n: {"en":"Annual Operating Hours"}, type: "number", unit: "saat/yil", required: true, smartDefault: 8000, validation: { min: 1 }, helper: "", expertMeaning: "Operating hours per year", expertMeaning_i18n: {"en":"Operating hours per year"} },
    { id: "steamCost", label: "Steam Cost", label_i18n: {"en":"Steam Cost"}, type: "number", unit: "USD/ton", required: true, smartDefault: 25, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per ton of steam", expertMeaning_i18n: {"en":"Cost per ton of steam"} },
    { id: "faultyTraps", label: "Number of Faulty Traps", label_i18n: {"en":"Number of Faulty Traps"}, type: "number", unit: "units", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of failed traps", expertMeaning_i18n: {"en":"Number of failed traps"} },
    { id: "replacementCost", label: "Replacement Cost", label_i18n: {"en":"Replacement Cost"}, type: "number", unit: "USD/unit", required: false, smartDefault: 350, validation: { min: 1 }, helper: "", expertMeaning: "Replacement cost per trap", expertMeaning_i18n: {"en":"Replacement cost per trap"} },
  ],
  outputs: [
    { id: "steamLossRate", label: "Steam Leak Rate", label_i18n: {"en":"Steam Leak Rate"}, unit: "ton/saat", format: "number" },
    { id: "annualLoss", label: "Annual Energy Loss", label_i18n: {"en":"Annual Energy Loss"}, unit: "USD/year", format: "currency", isBigNumber: true },
    { id: "roi", label: "Repair Investment Return", label_i18n: {"en":"Repair Investment Return"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "annualLoss", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "Annual loss >$10K — identify faulty traps.", warningMessage_i18n: {"en":"Annual loss >$10K — identify faulty traps."}, criticalMessage: "Annual loss >$50K — initiate urgent steam trap maintenance program.", criticalMessage_i18n: {"en":"Annual loss >$50K — initiate urgent steam trap maintenance program."} }],
  formulaPipeline: [
    { formulaId: "measurement.steam_loss_rate", inputMap: {
        steamPressure: "steamPressure",
        holeDiameter: "holeDiameter"
      ,
        orificeArea: "orificeArea",
        deltaPressure: "deltaPressure",
        steamDensity: "steamDensity"}, outputId: "steamLossRate" },
    { formulaId: "cost.steam_trap_annual_loss", inputMap: { steamLossRate: "steamLossRate", operatingHoursPerYear: "operatingHoursPerYear", steamCost: "steamCost", faultyTraps: "faultyTraps" ,
        steamLoss: "steamLoss",
        operatingHours: "operatingHours"}, outputId: "annualLoss" },
    { formulaId: "cost.steam_trap_roi", inputMap: { annualLoss: "annualLoss", faultyTraps: "faultyTraps", replacementCost: "replacementCost" ,
        systemLoss: "systemLoss",
        trapCost: "trapCost",
        laborCost: "laborCost"}, outputId: "roi" },
  ],
  reportTemplate: { title: "Steam Trap Energy Loss Report", title_i18n: {"en":"Steam Trap Energy Loss Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Steam leak rate is calculated using Napier's formula: Q = 0.525 × d² × P.", "Annual loss = leak rate × hours × cost × number of traps.", "Repair ROI = (annual loss − replacement) / replacement × 100."],assumptionNotes_i18n:[{"en":"Steam leak rate is calculated using Napier's formula: Q = 0.525 × d² × P."},{"en":"Annual loss = leak rate × hours × cost × number of traps."},{"en":"Repair ROI = (annual loss − replacement) / replacement × 100."}] },
};
