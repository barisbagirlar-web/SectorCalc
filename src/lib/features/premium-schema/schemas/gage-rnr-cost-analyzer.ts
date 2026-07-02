
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const GAGE_RNR_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "gage-rnr-cost-analyzer", legacyPaidSlug: "gage-rnr-cost-analyzer",
  name: "Gage R&R & Measurement Error Cost Analyzer", name_i18n: {"en":"Gage R&R & Measurement Error Cost Analyzer"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "If the measurement system R&R value is high, incorrect accept/reject decisions lead to serious cost losses.", painStatement_i18n: {"en":"If the measurement system R&R value is high, incorrect accept/reject decisions lead to serious cost losses."},
  inputs: [
    { id: "ev", label: "Equipment variation", label_i18n: {"en":"Equipment variation"}, type: "number", unit: "scalar", required: true, smartDefault: 0.005, validation: { min: 0 }, helper: "", expertMeaning: "Equipment variation", expertMeaning_i18n: {"en":"Equipment variation"} },
    { id: "av", label: "Appraiser variation", label_i18n: {"en":"Appraiser variation"}, type: "number", unit: "scalar", required: true, smartDefault: 0.004, validation: { min: 0 }, helper: "", expertMeaning: "Appraiser variation", expertMeaning_i18n: {"en":"Appraiser variation"} },
    { id: "tv", label: "TV (Total Varyans)", label_i18n: {"en":"TV (Total Varyans)"}, type: "number", unit: "scalar", required: true, smartDefault: 0.015, validation: { min: 0.001 }, helper: "", expertMeaning: "Total variation", expertMeaning_i18n: {"en":"Total variation"} },
    { id: "falseAccept", label: "False acceptance count", label_i18n: {"en":"False acceptance count"}, type: "number", unit: "units/year", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "False acceptance count", expertMeaning_i18n: {"en":"False acceptance count"} },
    { id: "escapeCost", label: "Cost per escaped defect", label_i18n: {"en":"Cost per escaped defect"}, type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Cost per escaped defect", expertMeaning_i18n: {"en":"Cost per escaped defect"} },
    { id: "falseReject", label: "False rejection count", label_i18n: {"en":"False rejection count"}, type: "number", unit: "units/year", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "False rejection count", expertMeaning_i18n: {"en":"False rejection count"} },
    { id: "scrapCost", label: "Scrap Cost/Unit", label_i18n: {"en":"Scrap Cost/Unit"}, type: "number", unit: "USD", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Scrap cost per rejected good part", expertMeaning_i18n: {"en":"Scrap cost per rejected good part"} },
  ],
  outputs: [
    { id: "grr", label: "GRR (Birlesik)", label_i18n: {"en":"GRR (Birlesik)"}, unit: "scalar", format: "number" },
    { id: "pctGrr", label: "%GRR", label_i18n: {"en":"%GRR"}, unit: "%", format: "percentage" },
    { id: "costError", label: "Olcum Error Cost", label_i18n: {"en":"Olcum Error Cost"}, unit: "USD/year", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "pctGrr", warning: 20, critical: 30, direction: "higher_is_bad", warningMessage: "%GRR > %20 — measurement system should be improved.", warningMessage_i18n: {"en":"%GRR > %20 — measurement system should be improved."}, criticalMessage: "%GRR > %30 — measurement system is inadequate.", criticalMessage_i18n: {"en":"%GRR > %30 — measurement system is inadequate."} }],
  formulaPipeline: [
    { formulaId: "measurement.grr_combined", inputMap: { ev: "ev", av: "av" }, outputId: "grr" },
    { formulaId: "measurement.grr_pct", inputMap: { grr: "grr", tv: "tv" }, outputId: "pctGrr" },
    { formulaId: "cost.grr_cost_error", inputMap: {
        escapeCost: "escapeCost",
        scrapCost: "scrapCost",
        falseAcc: "falseAccept",
        falseRej: "falseReject"
      }, outputId: "costError" },
  ],
  reportTemplate: { title: "Gage R&R Cost Report", title_i18n: {"en":"Gage R&R Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["GRR = √(EV²+AV²). %GRR = (GRR/TV)×100.", "If %GRR < 10%: acceptable. 10-30%: marginal. >30%: unacceptable.", "Cost = FalseAcc×EscapeCost + FalseRej×ScrapCost."],assumptionNotes_i18n:[{"en":"GRR = √(EV²+AV²). %GRR = (GRR/TV)×100."},{"en":"If %GRR < 10%: acceptable. 10-30%: marginal. >30%: unacceptable."},{"en":"Cost = FalseAcc×EscapeCost + FalseRej×ScrapCost."}] },
};
