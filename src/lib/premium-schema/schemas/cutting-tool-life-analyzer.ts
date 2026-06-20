import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CUTTING_TOOL_LIFE_SCHEMA: PremiumCalculatorSchema = {
  id: "cutting-tool-life-analyzer", legacyPaidSlug: "cutting-tool-life-analyzer",
  name: "Kesim Parametreleri ve Takım Ömrü", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Taylor takım ömrü ve optimum kesme hızı hesaplanmazsa, takım maliyeti ve duruş süreleri kontrol edilemez.",
  inputs: [
    { id: "cuttingSpeed", label: "Kesme Hızı Vc", type: "number", unit: "m/dk", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed" },
    { id: "feed", label: "İlerleme f", type: "number", unit: "mm/dev", required: true, smartDefault: 0.25, validation: { min: 0.01 }, helper: "", expertMeaning: "Feed per revolution" },
    { id: "depth", label: "Derinlik ap", type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Depth of cut" },
    { id: "taylorC", label: "Taylor Sabiti C", type: "number", unit: "", required: true, smartDefault: 300, validation: { min: 1 }, helper: "", expertMeaning: "Taylor constant C" },
    { id: "taylorN", label: "Taylor Üssü n", type: "number", unit: "", required: true, smartDefault: 0.25, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent n" },
    { id: "taylorM", label: "Taylor Üssü m", type: "number", unit: "", required: false, smartDefault: 0.5, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent m" },
    { id: "taylorK", label: "Taylor Üssü k", type: "number", unit: "", required: false, smartDefault: 0.1, validation: { min: 0.01, max: 1 }, helper: "", expertMeaning: "Taylor exponent k" },
    { id: "toolCost", label: "Takım Ucu Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Tool insert cost" },
    { id: "edges", label: "Kenar Sayısı", type: "number", unit: "", required: false, smartDefault: 4, validation: { min: 1, max: 20 }, helper: "", expertMeaning: "Cutting edges per insert" },
    { id: "toolChangeTime", label: "Takım Değişim Süresi", type: "number", unit: "dk", required: true, smartDefault: 3, validation: { min: 0.1 }, helper: "", expertMeaning: "Tool change time" },
    { id: "machineRate", label: "Makine Saat Ücreti", type: "number", unit: "USD/saat", required: true, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Machine hourly rate" },
    { id: "machiningTime", label: "İşleme Süresi", type: "number", unit: "dk", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Machining time per part" },
  ],
  outputs: [
    { id: "toolLife", label: "Takım Ömrü (Taylor)", unit: "dk", format: "number" },
    { id: "costPerPartTool", label: "Parça Başı Takım Maliyeti", unit: "USD", format: "currency" },
    { id: "optimalToolLife", label: "Optimum Takım Ömrü", unit: "dk", format: "number" },
    { id: "optimalVc", label: "Optimum Kesme Hızı", unit: "m/dk", format: "number" },
    { id: "productionRate", label: "Üretim Hızı", unit: "parça/saat", format: "number" },
  ],
  thresholds: [{ fieldId: "toolLife", warning: 30, critical: 5, direction: "lower_is_bad", warningMessage: "Takım ömrü < 30dk — kesme parametreleri agresif.", criticalMessage: "Takım ömrü < 5dk — acil parametre revizyonu." }],
  formulaPipeline: [
    { formulaId: "measurement.machining_tool_life", inputMap: { cTaylor: "taylorC", vc: "cuttingSpeed", nTaylor: "taylorN", feed: "feed", mTaylor: "taylorM" }, outputId: "toolLife" },
    { formulaId: "cost.cnc_tooling", inputMap: { cutTime: "machiningTime", toolLife: "toolLife", toolCost: "toolCost" }, outputId: "costPerPartTool" },
  ],
  reportTemplate: { title: "Takım Ömrü Raporu", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Taylor T = C / (Vc^n × f^m × ap^k).", "Cost/part = (ToolCost/Edges) × (MachTime/ToolLife)."] },
};
