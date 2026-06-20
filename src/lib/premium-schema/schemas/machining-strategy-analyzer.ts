/**
 * Tool #59 — İşleme Stratejisi Süre
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const MACHINING_STRATEGY_SCHEMA: PremiumCalculatorSchema = {
  id: "machining-strategy-analyzer", legacyPaidSlug: "machining-strategy-analyzer",
  name: "İşleme Stratejisi & Takım Ömrü Optimizasyonu", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Kesme parametreleri (Vc, f, ap) ve Taylor takım ömrü modeli kullanılmadan yapılan işleme stratejisi ne optimum ne de güvenlidir.",
  inputs: [
    { id: "cuttingSpeed", label: "Kesme Hızı (Vc)", type: "number", unit: "m/dak", required: true, smartDefault: 180, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed" },
    { id: "feedPerRev", label: "İlerleme (f)", type: "number", unit: "mm/dev", required: true, smartDefault: 0.15, validation: { min: 0.001 }, helper: "", expertMeaning: "Feed per revolution" },
    { id: "depthOfCut", label: "Talaş Derinliği (ap)", type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Depth of cut" },
    { id: "taylorC", label: "Taylor C Sabiti", type: "number", unit: "", required: true, smartDefault: 300, validation: { min: 1 }, helper: "", expertMeaning: "Taylor tool life constant" },
    { id: "taylorN", label: "Taylor n (Vc üssü)", type: "number", unit: "", required: true, smartDefault: 0.25, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent for speed" },
    { id: "taylorM", label: "Taylor m (f üssü)", type: "number", unit: "", required: false, smartDefault: 0.5, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent for feed" },
    { id: "specificEnergy", label: "Özgül Kesme Enerjisi", type: "number", unit: "W-s/mm³", required: false, smartDefault: 2.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Specific cutting energy" },
    { id: "maxPower", label: "Maksimum Güç", type: "number", unit: "kW", required: false, smartDefault: 22, validation: { min: 0.1 }, helper: "", expertMeaning: "Maximum spindle power" },
    { id: "noseRadius", label: "Uç Radyüsü (rε)", type: "number", unit: "mm", required: false, smartDefault: 0.8, validation: { min: 0.05 }, helper: "", expertMeaning: "Tool nose radius" },
    { id: "roughnessTol", label: "Pürüzlülük Toleransı (Ra)", type: "number", unit: "µm", required: false, smartDefault: 3.2, validation: { min: 0.1 }, helper: "", expertMeaning: "Surface roughness limit" },
  ],
  outputs: [
    { id: "mrr", label: "MRR (Talaş Kaldırma Oranı)", unit: "cm³/dak", format: "number" },
    { id: "powerRequired", label: "Güç İhtiyacı", unit: "kW", format: "number" },
    { id: "toolLife", label: "Takım Ömrü", unit: "dak", format: "number" },
    { id: "constraintPass", label: "Kısıt Kontrolü (1=Geçer)", unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "constraintPass", warning: 1, critical: 0, direction: "lower_is_bad", warningMessage: "Kısıtlar sağlanmıyor (güç/pürüzlülük) — parametreler düşürülmeli.", criticalMessage: "Kısıt hatası — mevcut parametreler kullanılamaz." }],
  formulaPipeline: [
    { formulaId: "measurement.machining_mrr", inputMap: { cuttingSpeed: "cuttingSpeed", feedPerRev: "feedPerRev", depthOfCut: "depthOfCut" }, outputId: "mrr" },
    { formulaId: "measurement.machining_tool_life", inputMap: { cuttingSpeed: "cuttingSpeed", feedPerRev: "feedPerRev", taylorC: "taylorC", taylorN: "taylorN", taylorM: "taylorM" }, outputId: "toolLife" },
    { formulaId: "measurement.machining_strategy_check", inputMap: { mrr: "mrr", specificEnergy: "specificEnergy", maxPower: "maxPower", feedPerRev: "feedPerRev", noseRadius: "noseRadius", roughnessTol: "roughnessTol" }, outputId: "constraintPass" },
  ],
  reportTemplate: { title: "Machining Strategy Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["MRR = Vc×f×ap. Power = MRR×SpecEnergy/60.", "ToolLife = C/(Vcⁿ×fᵐ). Ra = f²/(8×rε).", "Check: Power ≤ MaxPower AND Ra ≤ Tolerance."] },
};
