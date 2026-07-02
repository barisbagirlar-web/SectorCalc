
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SPC_LIMIT_SCHEMA: PremiumCalculatorSchema = {
  id: "spc-limit-control-analyzer", legacyPaidSlug: "spc-limit-control-analyzer",
  name: "Statistical Process Control (SPC) Limit Analysis", name_i18n: {"en":"Statistical Process Control (SPC) Limit Analysis"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Without SPC control limits (X̿, R̄, UCL, LCL) and Cp calculations, process control and capability analysis cannot be performed.", painStatement_i18n: {"en":"Without SPC control limits (X̿, R̄, UCL, LCL) and Cp calculations, process control and capability analysis cannot be performed."},
  inputs: [
    { id: "subgroupMeans", label: "Subgroup Means (comma-separated)", label_i18n: {"en":"Subgroup Means (comma-separated)"}, type: "number", unit: "scalar", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Subgroup means", expertMeaning_i18n: {"en":"Subgroup means"} },
    { id: "subgroupRanges", label: "Subgroup Ranges (comma-separated)", label_i18n: {"en":"Subgroup Ranges (comma-separated)"}, type: "number", unit: "scalar", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Subgroup ranges", expertMeaning_i18n: {"en":"Subgroup ranges"} },
    { id: "subgroupSize", label: "Subgroup Size (n)", label_i18n: {"en":"Subgroup Size (n)"}, type: "number", unit: "scalar", required: true, smartDefault: 5, validation: { min: 2, max: 15 }, helper: "", expertMeaning: "Number per subgroup", expertMeaning_i18n: {"en":"Number per subgroup"} },
    { id: "usl", label: "Upper Specification Limit", label_i18n: {"en":"Upper Specification Limit"}, type: "number", unit: "scalar", required: true, smartDefault: 10.05, validation: { min: 0 }, helper: "", expertMeaning: "Upper spec limit", expertMeaning_i18n: {"en":"Upper spec limit"} },
    { id: "lsl", label: "Lower Specification Limit", label_i18n: {"en":"Lower Specification Limit"}, type: "number", unit: "scalar", required: true, smartDefault: 9.95, validation: { min: 0 }, helper: "", expertMeaning: "Lower spec limit", expertMeaning_i18n: {"en":"Lower spec limit"} },
  ],
  outputs: [
    { id: "xBarAvg", label: "X̿ (Grand Average)", label_i18n: {"en":"X̿ (Grand Average)"}, unit: "scalar", format: "number" },
    { id: "rBar", label: "R̄ (Average Range)", label_i18n: {"en":"R̄ (Average Range)"}, unit: "scalar", format: "number" },
    { id: "uclX", label: "UCL_X", label_i18n: {"en":"UCL_X"}, unit: "scalar", format: "number" },
    { id: "lclX", label: "LCL_X", label_i18n: {"en":"LCL_X"}, unit: "scalar", format: "number" },
    { id: "sigmaEstimate", label: "σ̂ (Sigma Estimate)", label_i18n: {"en":"σ̂ (Sigma Estimate)"}, unit: "scalar", format: "number" },
    { id: "cp", label: "Cp (Process Capability)", label_i18n: {"en":"Cp (Process Capability)"}, unit: "scalar", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "cp", warning: 1.33, critical: 1.0, direction: "lower_is_bad", warningMessage: "Cp < 1.33 — process capability is borderline.", warningMessage_i18n: {"en":"Cp < 1.33 — process capability is borderline."}, criticalMessage: "Cp < 1.0 — process is incapable.", criticalMessage_i18n: {"en":"Cp < 1.0 — process is incapable."} }],
  formulaPipeline: [
    { formulaId: "measurement.spc_x_bar_avg", inputMap: { data: "subgroupMeans" }, outputId: "xBarAvg" },
    { formulaId: "measurement.spc_r_bar", inputMap: { data: "subgroupRanges" }, outputId: "rBar" },
    { formulaId: "measurement.spc_ucl_x", inputMap: { xBarAvg: "xBarAvg", a2Const: "subgroupSize", rBar: "rBar" }, outputId: "uclX" },
    { formulaId: "measurement.spc_lcl_x", inputMap: { xBarAvg: "xBarAvg", a2Const: "subgroupSize", rBar: "rBar" }, outputId: "lclX" },
    { formulaId: "measurement.spc_sigma_estimate", inputMap: { rBar: "rBar", d2Const: "subgroupSize" }, outputId: "sigmaEstimate" },
    { formulaId: "measurement.spc_cp", inputMap: { usl: "usl", lsl: "lsl", sigmaEstimate: "sigmaEstimate" }, outputId: "cp" },
  ],
  reportTemplate: { title: "SPC Control Limit Report", title_i18n: {"en":"SPC Control Limit Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["X̿ = AVG(Means). R̄ = AVG(Ranges).", "UCL_X = X̿+A2×R̄. LCL_X = X̿-A2×R̄.", "σ̂ = R̄/d2. Cp = (USL-LSL)/(6×σ̂).", "A2, d3, d4 constants based on subgroup size n."],assumptionNotes_i18n:[{"en":"X̿ = AVG(Means). R̄ = AVG(Ranges)."},{"en":"UCL_X = X̿+A2×R̄. LCL_X = X̿-A2×R̄."},{"en":"σ̂ = R̄/d2. Cp = (USL-LSL)/(6×σ̂)."},{"en":"A2, d3, d4 constants based on subgroup size n."}] },
};
