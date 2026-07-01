/**
 * Tool #59 — İşleme Stratejisi Süre
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const MACHINING_STRATEGY_SCHEMA: PremiumCalculatorSchema = {
  id: "machining-strategy-analyzer", legacyPaidSlug: "machining-strategy-analyzer",
  name: "İşleme Stratejisi & Takım Ömrü Optimizasyonu", name_i18n: {"en":"Machining Strategy & Tool Life Optimization","tr":"İşleme Stratejisi & Takım Ömrü Optimizasyonu"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Kesme parametreleri (Vc, f, ap) ve Taylor takım ömrü modeli kullanılmadan yapılan işleme stratejisi ne optimum ne de güvenlidir.", painStatement_i18n: {"en":"A machining strategy without cutting parameters (Vc, f, ap) and Taylor tool life model is neither optimal nor reliable.","tr":"Kesme parametreleri (Vc, f, ap) ve Taylor takım ömrü modeli kullanılmadan yapılan işleme stratejisi ne optimum ne de güvenlidir."},
  inputs: [
    { id: "cuttingSpeed", label: "Kesme Hızı (Vc)", label_i18n: {"en":"Cutting Speed (Vc)","tr":"Kesme Hızı (Vc)"}, type: "number", unit: "m/dak", required: true, smartDefault: 180, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed", expertMeaning_i18n: {"en":"Cutting speed","tr":"Kesme hızı"} },
    { id: "feedPerRev", label: "İlerleme (f)", label_i18n: {"en":"Feed (f)","tr":"İlerleme (f)"}, type: "number", unit: "mm/dev", required: true, smartDefault: 0.15, validation: { min: 0.001 }, helper: "", expertMeaning: "Feed per revolution", expertMeaning_i18n: {"en":"Feed per revolution","tr":"Devir başına ilerleme"} },
    { id: "depthOfCut", label: "Talaş Derinliği (ap)", label_i18n: {"en":"Depth of Cut (ap)","tr":"Talaş Derinliği (ap)"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Depth of cut", expertMeaning_i18n: {"en":"Depth of cut","tr":"Talaş derinliği"} },
    { id: "taylorC", label: "Taylor C Sabiti", label_i18n: {"en":"Taylor Constant C","tr":"Taylor C Sabiti"}, type: "number", unit: "", required: true, smartDefault: 300, validation: { min: 1 }, helper: "", expertMeaning: "Taylor tool life constant", expertMeaning_i18n: {"en":"Taylor tool life constant","tr":"Taylor takım ömrü sabiti"} },
    { id: "taylorN", label: "Taylor n (Vc üssü)", label_i18n: {"en":"Taylor n (Vc exponent)","tr":"Taylor n (Vc üssü)"}, type: "number", unit: "", required: true, smartDefault: 0.25, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent for speed", expertMeaning_i18n: {"en":"Taylor exponent for speed","tr":"Hız için Taylor üssü"} },
    { id: "taylorM", label: "Taylor m (f üssü)", label_i18n: {"en":"Taylor m (f exponent)","tr":"Taylor m (f üssü)"}, type: "number", unit: "", required: false, smartDefault: 0.5, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent for feed", expertMeaning_i18n: {"en":"Taylor exponent for feed","tr":"İlerleme için Taylor üssü"} },
    { id: "specificEnergy", label: "Özgül Kesme Enerjisi", label_i18n: {"en":"Specific Cutting Energy","tr":"Özgül Kesme Enerjisi"}, type: "number", unit: "W-s/mm³", required: false, smartDefault: 2.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Specific cutting energy", expertMeaning_i18n: {"en":"Specific cutting energy","tr":"Özgül kesme enerjisi"} },
    { id: "maxPower", label: "Maksimum Güç", label_i18n: {"en":"Maximum Power","tr":"Maksimum Güç"}, type: "number", unit: "kW", required: false, smartDefault: 22, validation: { min: 0.1 }, helper: "", expertMeaning: "Maximum spindle power", expertMeaning_i18n: {"en":"Maximum spindle power","tr":"Maksimum iş mili gücü"} },
    { id: "noseRadius", label: "Uç Radyüsü (rε)", label_i18n: {"en":"Nose Radius (rε)","tr":"Uç Radyüsü (rε)"}, type: "number", unit: "mm", required: false, smartDefault: 0.8, validation: { min: 0.05 }, helper: "", expertMeaning: "Tool nose radius", expertMeaning_i18n: {"en":"Tool nose radius","tr":"Uç radyüsü"} },
    { id: "roughnessTol", label: "Pürüzlülük Toleransı (Ra)", label_i18n: {"en":"Roughness Tolerance (Ra)","tr":"Pürüzlülük Toleransı (Ra)"}, type: "number", unit: "µm", required: false, smartDefault: 3.2, validation: { min: 0.1 }, helper: "", expertMeaning: "Surface roughness limit", expertMeaning_i18n: {"en":"Surface roughness limit","tr":"Yüzey pürüzlülük limiti"} },
  ],
  outputs: [
    { id: "mrr", label: "MRR (Talaş Kaldırma Oranı)", label_i18n: {"en":"MRR (Talas Kaldrma Oran)","tr":"MRR (Talaş Kaldırma Oranı)"}, unit: "cm³/dak", format: "number" },
    { id: "powerRequired", label: "Güç İhtiyacı", label_i18n: {"en":"Guc Ihtiyac","tr":"Güç İhtiyacı"}, unit: "kW", format: "number" },
    { id: "toolLife", label: "Takım Ömrü", label_i18n: {"en":"Tool Life","tr":"Takım Ömrü"}, unit: "dak", format: "number" },
    { id: "constraintPass", label: "Kısıt Kontrolü (1=Geçer)", label_i18n: {"en":"Kst Kontrolu (1=Gecer)","tr":"Kısıt Kontrolü (1=Geçer)"}, unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "constraintPass", warning: 1, critical: 0, direction: "lower_is_bad", warningMessage: "Kısıtlar sağlanmıyor (güç/pürüzlülük) — parametreler düşürülmeli.", warningMessage_i18n: {"en":"Constraints not met (power/roughness) — reduce parameters.","tr":"Kısıtlar sağlanmıyor (güç/pürüzlülük) — parametreler düşürülmeli."}, criticalMessage: "Kısıt hatası — mevcut parametreler kullanılamaz.", criticalMessage_i18n: {"en":"Constraint error — current parameters unusable.","tr":"Kısıt hatası — mevcut parametreler kullanılamaz."} }],
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
  reportTemplate: { title: "Machining Strategy Report", title_i18n: {"en":"Machining Strategy Report","tr":"Machining Strategy Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["MRR = Vc×f×ap. Power = MRR×SpecEnergy/60.", "ToolLife = C/(Vcⁿ×fᵐ). Ra = f²/(8×rε).", "Check: Power ≤ MaxPower AND Ra ≤ Tolerance."],assumptionNotes_i18n:[{"en":"MRR = Vc×f×ap. Power = MRR×SpecEnergy/60.","tr":"MRR = Vc×f×ap. Power = MRR×SpecEnergy/60."},{"en":"ToolLife = C/(Vcⁿ×fᵐ). Ra = f²/(8×rε).","tr":"ToolLife = C/(Vcⁿ×fᵐ). Ra = f²/(8×rε)."},{"en":"Check: Power ≤ MaxPower AND Ra ≤ Tolerance.","tr":"Check: Power ≤ MaxPower AND Ra ≤ Tolerance."}]},
};
