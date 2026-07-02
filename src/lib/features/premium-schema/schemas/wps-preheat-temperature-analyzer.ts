
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const WPS_PREHEAT_SCHEMA: PremiumCalculatorSchema = {
  id: "wps-preheat-temperature-analyzer", legacyPaidSlug: "wps-preheat-temperature-analyzer",
  name: "WPS Preheat Temperature Analyzer", name_i18n: {"en":"WPS Preheat Temperature Analyzer"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "If pre-heating temperature before resource is not accurately calculated, cracking risk increases and energy Cost rises. Optimum Temperature must be determined based on carbon equivalent and material thickness.", painStatement_i18n: {"en":"If pre-heating temperature before resource is not accurately calculated, cracking risk increases and energy Cost rises. Optimum Temperature must be determined based on carbon equivalent and material thickness."},
  inputs: [
    {
      id: "cuPct",
      label: "Cu Pct",
      label_i18n: { en: "Cu Pct" },
      type: "number",
      unit: "—",

      group: "General"
    },
    {
      id: "vPct",
      label: "V Pct",
      label_i18n: { en: "V Pct" },
      type: "number",
      unit: "—",

      group: "General"
    },
    { id: "carbonContent", label: "Carbon percentage in material", label_i18n: {"en":"Carbon percentage in material"}, type: "number", unit: "%", required: true, smartDefault: 0.2, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Carbon percentage in material", expertMeaning_i18n: {"en":"Carbon percentage in material"} },
    { id: "manganeseContent", label: "Manganese percentage", label_i18n: {"en":"Manganese percentage"}, type: "number", unit: "%", required: true, smartDefault: 1.2, validation: { min: 0, max: 5 }, helper: "", expertMeaning: "Manganese percentage", expertMeaning_i18n: {"en":"Manganese percentage"} },
    { id: "chromiumContent", label: "Chromium percentage", label_i18n: {"en":"Chromium percentage"}, type: "number", unit: "%", required: false, smartDefault: 0.5, validation: { min: 0, max: 10 }, helper: "", expertMeaning: "Chromium percentage", expertMeaning_i18n: {"en":"Chromium percentage"} },
    { id: "molybdenumContent", label: "Molybdenum percentage", label_i18n: {"en":"Molybdenum percentage"}, type: "number", unit: "%", required: false, smartDefault: 0.1, validation: { min: 0, max: 5 }, helper: "", expertMeaning: "Molybdenum percentage", expertMeaning_i18n: {"en":"Molybdenum percentage"} },
    { id: "nickelContent", label: "Nickel percentage", label_i18n: {"en":"Nickel percentage"}, type: "number", unit: "%", required: false, smartDefault: 0.3, validation: { min: 0, max: 10 }, helper: "", expertMeaning: "Nickel percentage", expertMeaning_i18n: {"en":"Nickel percentage"} },
    { id: "materialThickness", label: "Material thickness", label_i18n: {"en":"Material thickness"}, type: "number", unit: "mm", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Material thickness", expertMeaning_i18n: {"en":"Material thickness"} },
    { id: "energyCostPerKwh", label: "Energy Unit Cost", label_i18n: {"en":"Energy Unit Cost"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per kWh for preheat", expertMeaning_i18n: {"en":"Cost per kWh for preheat"} },
    { id: "weldLength", label: "Total weld length", label_i18n: {"en":"Total weld length"}, type: "number", unit: "m", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Total weld length", expertMeaning_i18n: {"en":"Total weld length"} },
  ],
  outputs: [
    { id: "carbonEquivalent", label: "Carbon Esdegeri (CEV)", label_i18n: {"en":"Carbon Esdegeri (CEV)"}, unit: "%", format: "number" },
    { id: "preheatRequired", label: "required pre Istma Scaklg", label_i18n: {"en":"required pre Istma Scaklg"}, unit: "°C", format: "number" },
    { id: "preheatEnergyCost", label: "pre Istma energy Cost", label_i18n: {"en":"pre Istma energy Cost"}, unit: "USD", format: "currency" },
    { id: "crackRisk", label: "Catlama Riski", label_i18n: {"en":"Catlama Riski"}, unit: "puan", format: "score" },
  ],
  thresholds: [
    { fieldId: "carbonEquivalent", warning: 0.4, critical: 0.55, direction: "higher_is_bad", warningMessage: "CEV > 0.4 — Pre-heating is required, hydrogen control must be performed.", warningMessage_i18n: {"en":"CEV > 0.4 — Pre-heating is required, hydrogen control must be performed."}, criticalMessage: "CEV > 0.55 — High cracking risk, resource procedure must be reviewed.", criticalMessage_i18n: {"en":"CEV > 0.55 — High cracking risk, resource procedure must be reviewed."} },
    { fieldId: "preheatEnergyCost", warning: 500, critical: 1500, direction: "higher_is_bad", warningMessage: "Pre-heating Cost > $500 — Energy efficiency should be evaluated.", warningMessage_i18n: {"en":"Pre-heating Cost > $500 — Energy efficiency should be evaluated."}, criticalMessage: "Pre-heating Cost > $1,500 — Alternative resource methods should be investigated.", criticalMessage_i18n: {"en":"Pre-heating Cost > $1,500 — Alternative resource methods should be investigated."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.carbon_equivalent", inputMap: {
        carbonContent: "carbonContent",
        manganeseContent: "manganeseContent",
        chromiumContent: "chromiumContent",
        molybdenumContent: "molybdenumContent",
        nickelContent: "nickelContent"
      ,
        carbonPct: "carbonPct",
        mnPct: "mnPct",
        crPct: "crPct",
        moPct: "moPct",
        vPct: "vPct",
        niPct: "niPct",
        cuPct: "cuPct"}, outputId: "carbonEquivalent" },
    { formulaId: "measurement.preheat_required", inputMap: { carbonEquivalent: "carbonEquivalent", materialThickness: "materialThickness" ,
        thresholdCe: "thresholdCe"}, outputId: "preheatRequired" },
    { formulaId: "cost.preheat_energy_cost", inputMap: { preheatRequired: "preheatRequired", materialThickness: "materialThickness", energyCostPerKwh: "energyCostPerKwh", weldLength: "weldLength" ,
        preheatHours: "preheatHours",
        energyRate: "energyRate",
        preheatPower: "preheatPower"}, outputId: "preheatEnergyCost" },
    { formulaId: "measurement.crack_risk_score", inputMap: { carbonEquivalent: "carbonEquivalent", materialThickness: "materialThickness" ,
        thresholdCe: "thresholdCe"}, outputId: "crackRisk" },
  ],
  reportTemplate: { title: "WPS Pre-heating Temperature Analysis Report", title_i18n: {"en":"WPS Pre-heating Temperature Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: [],assumptionNotes_i18n:[{"en":"CEV is calculated using the formula: CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15."},{"en":"Pre-heating temperature is based on IIW standard according to CEV and thickness."},{"en":"Energy cost is estimated and varies according to regional tariffs."}] },
};
