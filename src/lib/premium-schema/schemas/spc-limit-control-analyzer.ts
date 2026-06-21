/**
 * Tool #58 — SPC Limit
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SPC_LIMIT_SCHEMA: PremiumCalculatorSchema = {
  id: "spc-limit-control-analyzer", legacyPaidSlug: "spc-limit-control-analyzer",
  name: "İstatistiksel Proses Kontrol (SPC) Limit Analizi", name_i18n: {"en":"İstatistiksel Proses Kontrol (SPC) Limit Analizi","tr":"İstatistiksel Proses Kontrol (SPC) Limit Analizi"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "SPC kontrol limitleri (X̿, R̄, UCL, LCL) ve Cp hesaplanmadan proses kontrolü ve kapasite analizi yapılamaz.", painStatement_i18n: {"en":"SPC kontrol limitleri (X̿, R̄, UCL, LCL) ve Cp hesaplanmadan proses kontrolü ve kapasite analizi yapılamaz.","tr":"SPC kontrol limitleri (X̿, R̄, UCL, LCL) ve Cp hesaplanmadan proses kontrolü ve kapasite analizi yapılamaz."},
  inputs: [
    { id: "subgroupMeans", label: "Alt Grup Ortalamaları (virgülle)", label_i18n: {"en":"Alt Grup Ortalamaları (virgülle)","tr":"Alt Grup Ortalamaları (virgülle)"}, type: "number", unit: "", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Subgroup means", expertMeaning_i18n: {"en":"Subgroup means","tr":"Subgroup means"} },
    { id: "subgroupRanges", label: "Alt Grup Aralıkları (virgülle)", label_i18n: {"en":"Alt Grup Aralıkları (virgülle)","tr":"Alt Grup Aralıkları (virgülle)"}, type: "number", unit: "", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Subgroup ranges", expertMeaning_i18n: {"en":"Subgroup ranges","tr":"Subgroup ranges"} },
    { id: "subgroupSize", label: "Alt Grup Büyüklüğü (n)", label_i18n: {"en":"Alt Grup Büyüklüğü (n)","tr":"Alt Grup Büyüklüğü (n)"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 2, max: 15 }, helper: "", expertMeaning: "Number per subgroup", expertMeaning_i18n: {"en":"Number per subgroup","tr":"Number per subgroup"} },
    { id: "usl", label: "Üst Spesifikasyon Limiti", label_i18n: {"en":"Üst Spesifikasyon Limiti","tr":"Üst Spesifikasyon Limiti"}, type: "number", unit: "", required: true, smartDefault: 10.05, validation: { min: 0 }, helper: "", expertMeaning: "Upper spec limit", expertMeaning_i18n: {"en":"Upper spec limit","tr":"Upper spec limit"} },
    { id: "lsl", label: "Alt Spesifikasyon Limiti", label_i18n: {"en":"Alt Spesifikasyon Limiti","tr":"Alt Spesifikasyon Limiti"}, type: "number", unit: "", required: true, smartDefault: 9.95, validation: { min: 0 }, helper: "", expertMeaning: "Lower spec limit", expertMeaning_i18n: {"en":"Lower spec limit","tr":"Lower spec limit"} },
  ],
  outputs: [
    { id: "xBarAvg", label: "X̿ (Genel Ortalama)", label_i18n: {"en":"X̿ (Genel Ortalama)","tr":"X̿ (Genel Ortalama)"}, unit: "", format: "number" },
    { id: "rBar", label: "R̄ (Ortalama Aralık)", label_i18n: {"en":"R̄ (Ortalama Aralık)","tr":"R̄ (Ortalama Aralık)"}, unit: "", format: "number" },
    { id: "uclX", label: "UCL_X", label_i18n: {"en":"UCL_X","tr":"UCL_X"}, unit: "", format: "number" },
    { id: "lclX", label: "LCL_X", label_i18n: {"en":"LCL_X","tr":"LCL_X"}, unit: "", format: "number" },
    { id: "sigmaEstimate", label: "σ̂ (Sigma Tahmini)", label_i18n: {"en":"σ̂ (Sigma Tahmini)","tr":"σ̂ (Sigma Tahmini)"}, unit: "", format: "number" },
    { id: "cp", label: "Cp (Proses Yeterlilik)", label_i18n: {"en":"Cp (Proses Yeterlilik)","tr":"Cp (Proses Yeterlilik)"}, unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "cp", warning: 1.33, critical: 1.0, direction: "lower_is_bad", warningMessage: "Cp < 1.33 — proses yeterliliği sınırda.", warningMessage_i18n: {"en":"Cp < 1.33 — proses yeterliliği sınırda.","tr":"Cp < 1.33 — proses yeterliliği sınırda."}, criticalMessage: "Cp < 1.0 — proses yetersiz.", criticalMessage_i18n: {"en":"Cp < 1.0 — proses yetersiz.","tr":"Cp < 1.0 — proses yetersiz."} }],
  formulaPipeline: [
    { formulaId: "measurement.spc_x_bar_avg", inputMap: { subgroupMeans: "subgroupMeans" }, outputId: "xBarAvg" },
    { formulaId: "measurement.spc_r_bar", inputMap: { subgroupRanges: "subgroupRanges" }, outputId: "rBar" },
    { formulaId: "measurement.spc_ucl_x", inputMap: { xBarAvg: "xBarAvg", a2Const: "subgroupSize", rBar: "rBar" }, outputId: "uclX" },
    { formulaId: "measurement.spc_lcl_x", inputMap: { xBarAvg: "xBarAvg", a2Const: "subgroupSize", rBar: "rBar" }, outputId: "lclX" },
    { formulaId: "measurement.spc_sigma_estimate", inputMap: { rBar: "rBar", d2Const: "subgroupSize" }, outputId: "sigmaEstimate" },
    { formulaId: "measurement.spc_cp", inputMap: { usl: "usl", lsl: "lsl", sigmaEstimate: "sigmaEstimate" }, outputId: "cp" },
  ],
  reportTemplate: { title: "SPC Control Limit Report", title_i18n: {"en":"SPC Control Limit Report","tr":"SPC Control Limit Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["X̿ = AVG(Means). R̄ = AVG(Ranges).", "UCL_X = X̿+A2×R̄. LCL_X = X̿-A2×R̄.", "σ̂ = R̄/d2. Cp = (USL-LSL)/(6×σ̂).", "A2, d3, d4 constants based on subgroup size n."],assumptionNotes_i18n:[{"en":"X̿ = AVG(Means). R̄ = AVG(Ranges).","tr":"X̿ = AVG(Means). R̄ = AVG(Ranges)."},{"en":"UCL_X = X̿+A2×R̄. LCL_X = X̿-A2×R̄.","tr":"UCL_X = X̿+A2×R̄. LCL_X = X̿-A2×R̄."},{"en":"σ̂ = R̄/d2. Cp = (USL-LSL)/(6×σ̂).","tr":"σ̂ = R̄/d2. Cp = (USL-LSL)/(6×σ̂)."},{"en":"A2, d3, d4 constants based on subgroup size n.","tr":"A2, d3, d4 constants based on subgroup size n."}] },
};
