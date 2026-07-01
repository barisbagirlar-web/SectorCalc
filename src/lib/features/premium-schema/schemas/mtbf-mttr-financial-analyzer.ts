/**
 * Tool #20 — MTBF/MTTR Finansal Etki
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const MTBF_MTTR_FINANCIAL_SCHEMA: PremiumCalculatorSchema = {
  id: "mtbf-mttr-financial-analyzer", legacyPaidSlug: "mtbf-mttr-financial-analyzer",
  name: "MTBF/MTTR Financial Impact Analyzer", name_i18n: {"en":"MTBF/MTTR Financial Impact Analyzer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "MTBF ve MTTR verileri finansal risk olarak hesaplanmazsa bakim yatirimlari onceliklendirilemez.", painStatement_i18n: {"en":"If MTBF and MTTR data are not calculated as financial risk, maintenance investments cannot be prioritized."},
  inputs: [
    { id: "mtbfHours", label: "Mean time between failures", label_i18n: {"en":"Mean time between failures"}, type: "number", unit: "saat", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Mean time between failures", expertMeaning_i18n: {"en":"Mean time between failures"} },
    { id: "mttrHours", label: "Mean time to repair", label_i18n: {"en":"Mean time to repair"}, type: "number", unit: "saat", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "", expertMeaning: "Mean time to repair", expertMeaning_i18n: {"en":"Mean time to repair"} },
    { id: "operatingHours", label: "Annual operating hours", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "saat/yil", required: true, smartDefault: 8000, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours"} },
    { id: "machineHourlyCost", label: "Makine Saatlik Maliyeti", label_i18n: {"en":"Makine Hourly Cost"}, type: "number", unit: "USD/saat", required: true, smartDefault: 150, validation: { min: 0.01 }, helper: "", expertMeaning: "Machine cost per hour", expertMeaning_i18n: {"en":"Machine cost per hour"} },
    { id: "numMachines", label: "Number of machines", label_i18n: {"en":"Number of machines"}, type: "number", unit: "adet", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of machines", expertMeaning_i18n: {"en":"Number of machines"} },
    { id: "improvedMtbf", label: "Target MTBF after improvement", label_i18n: {"en":"Target MTBF after improvement"}, type: "number", unit: "saat", required: false, smartDefault: 800, validation: { min: 1 }, helper: "", expertMeaning: "Target MTBF after improvement", expertMeaning_i18n: {"en":"Target MTBF after improvement"} },
  ],
  outputs: [
    { id: "availability", label: "Kullanlabilirlik Oran", label_i18n: {"en":"Kullanlabilirlik Rate"}, unit: "%", format: "number" },
    { id: "expectedDowntime", label: "Beklenen Durma Suresi", label_i18n: {"en":"Expected Durma Duration"}, unit: "saat/yil", format: "number" },
    { id: "downtimeCost", label: "Durma Maliyeti", label_i18n: {"en":"Durma Cost"}, unit: "USD/yil", format: "currency" },
    { id: "totalReliabilityCost", label: "Toplam Guvenilirlik Maliyeti", label_i18n: {"en":"Total Guvenilirlik Cost"}, unit: "USD/yil", format: "currency" },
    { id: "roiPercent", label: "ROI (Iyilestirme)", label_i18n: {"en":"ROI (improvement)"}, unit: "%", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "downtimeCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Durma maliyeti > $50K — bakim programi gozden gecirilmeli.", warningMessage_i18n: {"en":"Downtime cost > $50K — maintenance schedule should be reviewed."}, criticalMessage: "Durma maliyeti > $150K — acil guvenilirlik iyilestirme programi baslatilmali.", criticalMessage_i18n: {"en":"Downtime cost > $150K — urgent reliability improvement program should be initiated."} }],
  formulaPipeline: [
    { formulaId: "measurement.availability_mtbf", inputMap: { mtbfHours: "mtbfHours", mttrHours: "mttrHours" ,
        mtbf: "mtbf",
        mttr: "mttr"}, outputId: "availability" },
    { formulaId: "measurement.expected_downtime", inputMap: { mttrHours: "mttrHours", mtbfHours: "mtbfHours", operatingHours: "operatingHours" ,
        availability: "availability"}, outputId: "expectedDowntime" },
    { formulaId: "cost.downtime_cost_mtbf", inputMap: { expectedDowntime: "expectedDowntime", machineHourlyCost: "machineHourlyCost", numMachines: "numMachines" ,
        costPerDowntimeHour: "costPerDowntimeHour"}, outputId: "downtimeCost" },
    { formulaId: "cost.reliability_total_cost", inputMap: { downtimeCost: "downtimeCost", numMachines: "numMachines" ,
        repairCost: "repairCost",
        lostProduction: "lostProduction"}, outputId: "totalReliabilityCost" },
    { formulaId: "cost.reliability_roi", inputMap: { mtbfHours: "mtbfHours", improvedMtbf: "improvedMtbf", downtimeCost: "downtimeCost" ,
        currentCost: "currentCost",
        improvedCost: "improvedCost",
        improvementInvestment: "improvementInvestment"}, outputId: "roiPercent" },
  ],
  reportTemplate: { title: "MTBF/MTTR Financial Impact Report", title_i18n: {"en":"MTBF/MTTR Financial Impact Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Faydali omur = MTBF + MTTR.", "Kullanilabilirlik = MTBF/(MTBF+MTTR).", "Yillik durma suresi = (1−A)×calisma saati."],assumptionNotes_i18n:[{"en":"Useful life = MTBF + MTTR."},{"en":"Availability = MTBF/(MTBF+MTTR)."},{"en":"Annual downtime = (1−A)×operating hours."}] },
};
