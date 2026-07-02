
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ENERGY_CONSUMPTION_SCHEMA: PremiumCalculatorSchema = {
  id: "energy-consumption-report-analyzer", legacyPaidSlug: "energy-consumption-report-analyzer",
  name: "Energy Consumption Report & PF Analyzer", name_i18n: {"en":"Energy Consumption Report & PF Analyzer"}, sectorSlug: "sheet-metal", category: "energy",
  painStatement: "If reactive penalty, demand charge, and carbon cost in the energy bill are not analyzed, the operation makes unnecessary payments.", painStatement_i18n: {"en":"If reactive penalty, demand charge, and carbon cost in the energy bill are not analyzed, the operation makes unnecessary payments."},
  inputs: [
    { id: "activeKwh", label: "Active energy consumption", label_i18n: {"en":"Active energy consumption"}, type: "number", unit: "kWh", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Active energy consumption", expertMeaning_i18n: {"en":"Active energy consumption"} },
    { id: "reactiveKvarh", label: "Reactive energy consumption", label_i18n: {"en":"Reactive energy consumption"}, type: "number", unit: "kVArh", required: true, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "Reactive energy consumption", expertMeaning_i18n: {"en":"Reactive energy consumption"} },
    { id: "peakKw", label: "demand (Peak kW)", label_i18n: {"en":"demand (Peak kW)"}, type: "number", unit: "kW", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Peak demand in kW", expertMeaning_i18n: {"en":"Peak demand in kW"} },
    { id: "pfThreshold", label: "Power factor threshold", label_i18n: {"en":"Power factor threshold"}, type: "number", unit: "%", required: false, smartDefault: 95, validation: { min: 50, max: 100 }, helper: "", expertMeaning: "Power factor threshold", expertMeaning_i18n: {"en":"Power factor threshold"} },
    { id: "reactiveTariff", label: "Reaktif penalty Tarifesi", label_i18n: {"en":"Reaktif penalty Tarifesi"}, type: "number", unit: "USD/kVArh", required: false, smartDefault: 0.03, validation: { min: 0 }, helper: "", expertMeaning: "Reactive energy tariff", expertMeaning_i18n: {"en":"Reactive energy tariff"} },
    { id: "demandRate", label: "Demand charge rate", label_i18n: {"en":"Demand charge rate"}, type: "number", unit: "USD/kW", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Demand charge rate", expertMeaning_i18n: {"en":"Demand charge rate"} },
    { id: "baseAmount", label: "Base Tutar", label_i18n: {"en":"Base Tutar"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Base electricity amount", expertMeaning_i18n: {"en":"Base electricity amount"} },
    { id: "touAmount", label: "TOU (Time Period)", label_i18n: {"en":"TOU (Time Period)"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Time-of-use charges", expertMeaning_i18n: {"en":"Time-of-use charges"} },
    { id: "taxAmount", label: "tax & Fonlar", label_i18n: {"en":"tax & Fonlar"}, type: "number", unit: "USD", required: false, smartDefault: 1500, validation: { min: 0 }, helper: "", expertMeaning: "Taxes and surcharges", expertMeaning_i18n: {"en":"Taxes and surcharges"} },
    { id: "emisFactor", label: "CO2 emission factor", label_i18n: {"en":"CO2 emission factor"}, type: "number", unit: "kgCO₂/kWh", required: false, smartDefault: 0.4, validation: { min: 0 }, helper: "", expertMeaning: "CO2 emission factor", expertMeaning_i18n: {"en":"CO2 emission factor"} },
    { id: "carbonPrice", label: "Carbon price per ton", label_i18n: {"en":"Carbon price per ton"}, type: "number", unit: "USD/ton", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Carbon price per ton", expertMeaning_i18n: {"en":"Carbon price per ton"} },
  ],
  outputs: [
    { id: "powerFactor", label: "Power Faktoru (PF)", label_i18n: {"en":"Power Faktoru (PF)"}, unit: "scalar", format: "percentage" },
    { id: "reactivePenalty", label: "Reaktif penalty", label_i18n: {"en":"Reaktif penalty"}, unit: "USD", format: "currency" },
    { id: "totalBill", label: "Total Bill", label_i18n: {"en":"Total Bill"}, unit: "USD", format: "currency" },
    { id: "carbonFootprint", label: "Carbon Cost", label_i18n: {"en":"Carbon Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "powerFactor", warning: 90, critical: 85, direction: "lower_is_bad", warningMessage: "PF < 90% — compensation should be improved.", warningMessage_i18n: {"en":"PF < 90% — compensation should be improved."}, criticalMessage: "PF < 85% — reactive penalty risk is high.", criticalMessage_i18n: {"en":"PF < 85% — reactive penalty risk is high."} }],
  formulaPipeline: [
    { formulaId: "energy.power_factor", inputMap: {
        active: "activeKwh",
        reactive: "reactiveKvarh"
      }, outputId: "powerFactor" },
    { formulaId: "energy.reactive_penalty", inputMap: {
        pf: "powerFactor",
        pfThresh: "pfThreshold",
        reactive: "activeKwh",
        active: "reactiveKvarh",
        tariff: "reactiveTariff"
      }, outputId: "reactivePenalty" },
    { formulaId: "energy.demand_charge", inputMap: { peakKw: "peakKw", demandRate: "demandRate" }, outputId: "demandCharge" },
    { formulaId: "energy.energy_total_bill", inputMap: {
        demandCharge: "demandCharge",
        reactivePenalty: "reactivePenalty",
        baseCharge: "baseAmount",
        touCharge: "touAmount",
        tax: "taxAmount"
      }, outputId: "totalBill" },
    { formulaId: "energy.energy_carbon_footprint", inputMap: {
        emisFactor: "emisFactor",
        active: "activeKwh",
        carbonPrice: "carbonPrice"
      }, outputId: "carbonFootprint" },
  ],
  reportTemplate: { title: "Energy Consumption Report", title_i18n: {"en":"Energy Consumption Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["PF = Active/√(Active²+Reactive²).", "Reactive penalty if PF < threshold.", "Carbon cost = kWh×EmisFactor×CarbonPrice/1000."],assumptionNotes_i18n:[{"en":"PF = Active/√(Active²+Reactive²)."},{"en":"Reactive penalty if PF < threshold."},{"en":"Carbon cost = kWh×EmisFactor×CarbonPrice/1000."}] },
};
