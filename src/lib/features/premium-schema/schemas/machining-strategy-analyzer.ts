/**
 * Tool #59 — İşleme Stratejisi Süre
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const MACHINING_STRATEGY_SCHEMA: PremiumCalculatorSchema = {
  id: "machining-strategy-analyzer", legacyPaidSlug: "machining-strategy-analyzer",
  name: "Machining Strategy & Tool Life Optimization", name_i18n: {"en":"Machining Strategy & Tool Life Optimization"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "A machining strategy without cutting parameters (Vc, f, ap) and Taylor tool life model is neither optimal nor reliable.", painStatement_i18n: {"en":"A machining strategy without cutting parameters (Vc, f, ap) and Taylor tool life model is neither optimal nor reliable."},
  inputs: [
    { id: "cuttingSpeed", label: "Cutting Speed (Vc)", label_i18n: {"en":"Cutting Speed (Vc)"}, type: "number", unit: "m/dak", required: true, smartDefault: 180, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed", expertMeaning_i18n: {"en":"Cutting speed"} },
    { id: "feedPerRev", label: "Feed (f)", label_i18n: {"en":"Feed (f)"}, type: "number", unit: "mm/dev", required: true, smartDefault: 0.15, validation: { min: 0.001 }, helper: "", expertMeaning: "Feed per revolution", expertMeaning_i18n: {"en":"Feed per revolution"} },
    { id: "depthOfCut", label: "Depth of Cut (ap)", label_i18n: {"en":"Depth of Cut (ap)"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Depth of cut", expertMeaning_i18n: {"en":"Depth of cut"} },
    { id: "taylorC", label: "Taylor C Sabiti", label_i18n: {"en":"Taylor Constant C"}, type: "number", unit: "", required: true, smartDefault: 300, validation: { min: 1 }, helper: "", expertMeaning: "Taylor tool life constant", expertMeaning_i18n: {"en":"Taylor tool life constant"} },
    { id: "taylorN", label: "Taylor n (Vc üssü)", label_i18n: {"en":"Taylor n (Vc exponent)"}, type: "number", unit: "", required: true, smartDefault: 0.25, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent for speed", expertMeaning_i18n: {"en":"Taylor exponent for speed"} },
    { id: "taylorM", label: "Taylor m (f üssü)", label_i18n: {"en":"Taylor m (f exponent)"}, type: "number", unit: "", required: false, smartDefault: 0.5, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent for feed", expertMeaning_i18n: {"en":"Taylor exponent for feed"} },
    { id: "specificEnergy", label: "Özgül Kesme Enerjisi", label_i18n: {"en":"Specific Cutting Energy"}, type: "number", unit: "W-s/mm³", required: false, smartDefault: 2.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Specific cutting energy", expertMeaning_i18n: {"en":"Specific cutting energy"} },
    { id: "maxPower", label: "Maximum Power", label_i18n: {"en":"Maximum Power"}, type: "number", unit: "kW", required: false, smartDefault: 22, validation: { min: 0.1 }, helper: "", expertMeaning: "Maximum spindle power", expertMeaning_i18n: {"en":"Maximum spindle power"} },
    { id: "noseRadius", label: "Nose Radius (rε)", label_i18n: {"en":"Nose Radius (rε)"}, type: "number", unit: "mm", required: false, smartDefault: 0.8, validation: { min: 0.05 }, helper: "", expertMeaning: "Tool nose radius", expertMeaning_i18n: {"en":"Tool nose radius"} },
    { id: "roughnessTol", label: "Roughness Tolerance (Ra)", label_i18n: {"en":"Roughness Tolerance (Ra)"}, type: "number", unit: "µm", required: false, smartDefault: 3.2, validation: { min: 0.1 }, helper: "", expertMeaning: "Surface roughness limit", expertMeaning_i18n: {"en":"Surface roughness limit"} },
  ],
  outputs: [
    { id: "mrr", label: "MRR (Talas Kaldrma Oran)", label_i18n: {"en":"MRR (Talas Kaldrma Rate)"}, unit: "cm³/dak", format: "number" },
    { id: "powerRequired", label: "Guc Ihtiyac", label_i18n: {"en":"Power Ihtiyac"}, unit: "kW", format: "number" },
    { id: "toolLife", label: "Tool Life", label_i18n: {"en":"Tool Life"}, unit: "dak", format: "number" },
    { id: "constraintPass", label: "Kst Kontrolu (1=Gecer)", label_i18n: {"en":"Constraint Kontrolu (1=Gecer)"}, unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "constraintPass", warning: 1, critical: 0, direction: "lower_is_bad", warningMessage: "Constraints not met (power/roughness) — reduce parameters.", warningMessage_i18n: {"en":"Constraints not met (power/roughness) — reduce parameters."}, criticalMessage: "Constraint error — current parameters unusable.", criticalMessage_i18n: {"en":"Constraint error — current parameters unusable."} }],
  formulaPipeline: [
    { formulaId: "measurement.machining_mrr", inputMap: { cuttingSpeed: "cuttingSpeed", feedPerRev: "feedPerRev", depthOfCut: "depthOfCut" ,
        vc: "vc",
        feed: "feed",
        ap: "ap"}, outputId: "mrr" },
    { formulaId: "measurement.machining_tool_life", inputMap: { cuttingSpeed: "cuttingSpeed", feedPerRev: "feedPerRev", taylorC: "taylorC", taylorN: "taylorN", taylorM: "taylorM" ,
        cTaylor: "cTaylor",
        vc: "vc",
        nTaylor: "nTaylor",
        feed: "feed",
        mTaylor: "mTaylor"}, outputId: "toolLife" },
    { formulaId: "measurement.machining_strategy_check", inputMap: { mrr: "mrr", specificEnergy: "specificEnergy", maxPower: "maxPower", feedPerRev: "feedPerRev", noseRadius: "noseRadius", roughnessTol: "roughnessTol" ,
        power: "power",
        ra: "ra",
        tol: "tol"}, outputId: "constraintPass" },
  ],
  reportTemplate: { title: "Machining Strategy Report", title_i18n: {"en":"Machining Strategy Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["MRR = Vc×f×ap. Power = MRR×SpecEnergy/60.", "ToolLife = C/(Vcⁿ×fᵐ). Ra = f²/(8×rε).", "Check: Power ≤ MaxPower AND Ra ≤ Tolerance."],assumptionNotes_i18n:[{"en":"MRR = Vc×f×ap. Power = MRR×SpecEnergy/60."},{"en":"ToolLife = C/(Vcⁿ×fᵐ). Ra = f²/(8×rε)."},{"en":"Check: Power ≤ MaxPower AND Ra ≤ Tolerance."}]},
};
