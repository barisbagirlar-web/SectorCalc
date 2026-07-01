/**
 * Tool #47 — HACCP Deviation
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const HACCP_DEVIATION_SCHEMA: PremiumCalculatorSchema = {
  id: "haccp-deviation-cost-analyzer", legacyPaidSlug: "haccp-deviation-cost-analyzer",
  name: "HACCP Deviation Cost & RPN Analyzer", name_i18n: {"en":"HACCP Deviation Cost & RPN Analyzer"}, sectorSlug: "food", category: "cost",
  painStatement: "HACCP sapmalarinin maliyeti (bekletme, test, rework, geri cagirma) hesaplanmazsa gida guvenligi yatirim oncelikleri yanlis belirlenir.", painStatement_i18n: {"en":"If the cost of HACCP deviations (holding, test, rework, return recall) is not calculated, food safety investment priorities are determined incorrectly."},
  inputs: [
    { id: "quarantineVolume", label: "Karantina Hacmi", label_i18n: {"en":"Karantina Volume"}, type: "number", unit: "kg", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Quarantined product volume", expertMeaning_i18n: {"en":"Quarantined product volume"} },
    { id: "holdCostPerUnit", label: "Bekletme Maliyeti", label_i18n: {"en":"holding Cost"}, type: "number", unit: "USD/kg/gun", required: true, smartDefault: 0.1, validation: { min: 0 }, helper: "", expertMeaning: "Cost per unit per day", expertMeaning_i18n: {"en":"Cost per unit per day"} },
    { id: "holdDays", label: "Bekletme Gunu", label_i18n: {"en":"Hold duration"}, type: "number", unit: "gun", required: true, smartDefault: 3, validation: { min: 1 }, helper: "", expertMeaning: "Hold duration", expertMeaning_i18n: {"en":"Hold duration"} },
    { id: "testSamples", label: "Number of test samples", label_i18n: {"en":"Number of test samples"}, type: "number", unit: "adet", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Number of test samples", expertMeaning_i18n: {"en":"Number of test samples"} },
    { id: "labCost", label: "Laboratuvar Maliyeti", label_i18n: {"en":"Laboratuvar Cost"}, type: "number", unit: "USD/ornek", required: true, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Lab cost per sample", expertMeaning_i18n: {"en":"Lab cost per sample"} },
    { id: "deviationVolume", label: "Sapma Hacmi", label_i18n: {"en":"Deviation Volume"}, type: "number", unit: "kg", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Volume requiring rework", expertMeaning_i18n: {"en":"Volume requiring rework"} },
    { id: "reworkCost", label: "Rework Maliyeti", label_i18n: {"en":"Rework Cost"}, type: "number", unit: "USD/kg", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Rework cost per kg", expertMeaning_i18n: {"en":"Rework cost per kg"} },
    { id: "condemnedVolume", label: "Condemned volume", label_i18n: {"en":"Condemned volume"}, type: "number", unit: "kg", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Condemned volume", expertMeaning_i18n: {"en":"Condemned volume"} },
    { id: "disposalCost", label: "Bertaraf Maliyeti", label_i18n: {"en":"disposal Cost"}, type: "number", unit: "USD/kg", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Disposal cost per kg", expertMeaning_i18n: {"en":"Disposal cost per kg"} },
    { id: "lostMaterial", label: "Lost material cost", label_i18n: {"en":"Lost material cost"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Lost material cost", expertMeaning_i18n: {"en":"Lost material cost"} },
    { id: "notificationCost", label: "Bildirim Maliyeti", label_i18n: {"en":"Bildirim Cost"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Notification cost", expertMeaning_i18n: {"en":"Notification cost"} },
    { id: "logisticsRecall", label: "Recall logistics cost", label_i18n: {"en":"Recall logistics cost"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Recall logistics cost", expertMeaning_i18n: {"en":"Recall logistics cost"} },
    { id: "retailPenalty", label: "Retailer penalty", label_i18n: {"en":"Retailer penalty"}, type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Retailer penalty", expertMeaning_i18n: {"en":"Retailer penalty"} },
    { id: "brandDamage", label: "Brand damage cost", label_i18n: {"en":"Brand damage cost"}, type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Brand damage cost", expertMeaning_i18n: {"en":"Brand damage cost"} },
    { id: "probDetection", label: "Regulatory detection probability", label_i18n: {"en":"Regulatory detection probability"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Regulatory detection probability", expertMeaning_i18n: {"en":"Regulatory detection probability"} },
    { id: "fineAmount", label: "Maximum regulatory fine", label_i18n: {"en":"Maximum regulatory fine"}, type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Maximum regulatory fine", expertMeaning_i18n: {"en":"Maximum regulatory fine"} },
  ],
  outputs: [
    { id: "totalHaccpCost", label: "Toplam HACCP Sapma Maliyeti", label_i18n: {"en":"Total HACCP Deviation Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalHaccpCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Maliyet > $50K — HACCP plani gozden gecirilmeli.", warningMessage_i18n: {"en":"Cost > $50K — HACCP plan should be reviewed."}, criticalMessage: "Maliyet > $150K — tesis denetimi ve duzeltici faaliyet acil.", criticalMessage_i18n: {"en":"Cost > $150K — facility denetimi ve corrective activity acil."} }],
  formulaPipeline: [
    { formulaId: "cost.haccp_hold", inputMap: {
        quarVol: "quarantineVolume",
        holdCost: "holdCostPerUnit",
        days: "holdDays"
      }, outputId: "holdCost" },
    { formulaId: "cost.haccp_test", inputMap: {
        labCost: "labCost",
        samples: "testSamples"
      }, outputId: "testCost" },
    { formulaId: "cost.haccp_rework", inputMap: {
        reworkCost: "reworkCost",
        devVol: "deviationVolume"
      }, outputId: "reworkCost" },
    { formulaId: "cost.haccp_disposal", inputMap: {
        condVol: "condemnedVolume",
        dispCost: "disposalCost",
        lostMat: "lostMaterial"
      }, outputId: "disposalCost" },
    { formulaId: "cost.haccp_recall", inputMap: {
        notif: "notificationCost",
        logRev: "logisticsRecall",
        retailPen: "retailPenalty",
        brand: "brandDamage"
      }, outputId: "recallCost" },
    { formulaId: "cost.haccp_fine", inputMap: {
        probDet: "probDetection",
        fineAmt: "fineAmount"
      }, outputId: "fine" },
    { formulaId: "cost.haccp_total", inputMap: {
        holdCost: "holdCost",
        testCost: "testCost",
        reworkCost: "reworkCost",
        recallCost: "recallCost",
        dispCost: "disposalCost",
        fineRisk: "fine"
      }, outputId: "totalHaccpCost" },
  ],
  reportTemplate: { title: "HACCP Deviation Cost Report", title_i18n: {"en":"HACCP Deviation Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Hold = Vol×Cost×Days. Test = Samples×LabCost.", "Rework = Vol×ReworkCost. Disp = CondVol×DispCost+LostMat.", "Recall = Notif+Log+RetailPen+Brand. Fine = Prob×Fine."],assumptionNotes_i18n:[{"en":"Hold = Vol×Cost×Days. Test = Samples×LabCost."},{"en":"Rework = Vol×ReworkCost. Disp = CondVol×DispCost+LostMat."},{"en":"Recall = Notif+Log+RetailPen+Brand. Fine = Prob×Fine."}] },
};
