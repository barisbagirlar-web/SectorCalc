/**
 * Tool #37 — Proje Aşım Riski Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PROJECT_OVERRUN_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "project-overrun-analyzer", legacyPaidSlug: "project-overrun-analyzer",
  name: "Project Overrun Risk & Earned Value", name_i18n: {"en":"Project Overrun Risk & Earned Value"}, sectorSlug: "construction", category: "cost",
  painStatement: "If project overruns are not detected early, budget swells, delivery is delayed, and commitment penalties kick in.", painStatement_i18n: {"en":"If project overruns are not detected early, budget swells, delivery is delayed, and commitment penalties kick in."},
  inputs: [
    { id: "plannedValue", label: "Planned Value (PV)", label_i18n: {"en":"Planned Value (PV)"}, type: "number", unit: "USD", required: true, smartDefault: 1000000, validation: { min: 1 }, helper: "", expertMeaning: "Planned Value (budget)", expertMeaning_i18n: {"en":"Planned Value (budget)"} },
    { id: "earnedValue", label: "Earned Value (EV)", label_i18n: {"en":"Earned Value (EV)"}, type: "number", unit: "USD", required: true, smartDefault: 750000, validation: { min: 0 }, helper: "", expertMeaning: "Earned Value (work completed)", expertMeaning_i18n: {"en":"Earned Value (work completed)"} },
    { id: "actualCost", label: "Actual Cost (AC)", label_i18n: {"en":"Actual Cost (AC)"}, type: "number", unit: "USD", required: true, smartDefault: 800000, validation: { min: 0 }, helper: "", expertMeaning: "Actual Cost incurred", expertMeaning_i18n: {"en":"Actual Cost incurred"} },
    { id: "scheduleDays", label: "Planlanan Süre", label_i18n: {"en":"Planned Duration"}, type: "number", unit: "gün", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned schedule duration", expertMeaning_i18n: {"en":"Planned schedule duration"} },
    { id: "actualDays", label: "Actual Duration", label_i18n: {"en":"Actual Duration"}, type: "number", unit: "gün", required: false, smartDefault: 160, validation: { min: 0 }, helper: "", expertMeaning: "Actual elapsed days", expertMeaning_i18n: {"en":"Actual elapsed days"} },
    { id: "riskProbability", label: "Risk Probability", label_i18n: {"en":"Risk Probability"}, type: "number", unit: "%", required: false, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Probability of risk events", expertMeaning_i18n: {"en":"Probability of risk events"} },
    { id: "riskImpact", label: "Risk Etkisi", label_i18n: {"en":"Risk Impact"}, type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Financial impact of risks", expertMeaning_i18n: {"en":"Financial impact of risks"} },
    { id: "mitigationCost", label: "Azaltma Maliyeti", label_i18n: {"en":"Mitigation Cost"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Cost to mitigate risks", expertMeaning_i18n: {"en":"Cost to mitigate risks"} },
  ],
  outputs: [
    { id: "spi", label: "Program Performans Endeksi (SPI)", label_i18n: {"en":"Program Performans Endeksi (SPI)"}, unit: "", format: "number" },
    { id: "cpi", label: "Maliyet Performans Endeksi (CPI)", label_i18n: {"en":"Cost Performans Endeksi (CPI)"}, unit: "", format: "number" },
    { id: "eac", label: "Estimated Completion Cost (EAC)", label_i18n: {"en":"Estimated Completion Cost (EAC)"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "expectedOverrun", label: "Beklenen Asm", label_i18n: {"en":"Expected Asm"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "scheduleDelay", label: "Program Gecikmesi", label_i18n: {"en":"Program Gecikmesi"}, unit: "gün", format: "number" },
    { id: "riskExposure", label: "Risk Maruziyeti", label_i18n: {"en":"Risk Maruziyeti"}, unit: "USD", format: "currency" },
    { id: "mitigationCost", label: "Azaltma Maliyeti", label_i18n: {"en":"Mitigation Cost"}, unit: "USD", format: "currency" },
    { id: "netRisk", label: "Net Risk", label_i18n: {"en":"Net Risk"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "cpi", warning: 0.95, critical: 0.85, direction: "lower_is_bad", warningMessage: "CPI < 0.95 — cost overrun signal.", warningMessage_i18n: {"en":"CPI < 0.95 — cost overrun signal."}, criticalMessage: "CPI < 0.85 — acil maliyet düzeltici aksiyon.", criticalMessage_i18n: {"en":"CPI < 0.85 — urgent cost corrective action."} }],
  formulaPipeline: [
    { formulaId: "measurement.spi", inputMap: { earnedValue: "earnedValue", plannedValue: "plannedValue" }, outputId: "spi" },
    { formulaId: "measurement.cpi", inputMap: { earnedValue: "earnedValue", actualCost: "actualCost" }, outputId: "cpi" },
    { formulaId: "cost.eac", inputMap: { plannedValue: "plannedValue", cpi: "cpi" ,
        budgetAtCompletion: "budgetAtCompletion"}, outputId: "eac" },
    { formulaId: "cost.expected_overrun", inputMap: { eac: "eac", plannedValue: "plannedValue" ,
        budgetAtCompletion: "budgetAtCompletion"}, outputId: "expectedOverrun" },
    { formulaId: "measurement.schedule_delay", inputMap: { actualDays: "actualDays", scheduleDays: "scheduleDays", spi: "spi" ,
        plannedDuration: "plannedDuration",
        earnedValue: "earnedValue",
        budgetAtCompletion: "budgetAtCompletion"}, outputId: "scheduleDelay" },
    { formulaId: "cost.risk_exposure", inputMap: { riskProbability: "riskProbability", riskImpact: "riskImpact" ,
        probability: "probability",
        impact: "impact"}, outputId: "riskExposure" },
    { formulaId: "cost.mitigation_cost", inputMap: {
        mitigationLabor: "mitigationCost"
      ,
        mitigationMaterial: "mitigationMaterial",
        mitigationEquipment: "mitigationEquipment"}, outputId: "mitigationCost" },
    { formulaId: "cost.net_risk", inputMap: { riskExposure: "riskExposure", mitigationCost: "mitigationCost" }, outputId: "netRisk" },
  ],
  reportTemplate: { title: "Project Overrun Risk Report", title_i18n: {"en":"Project Overrun Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 15, targetMarginPercent: 15, assumptionNotes: ["SPI = EV/PV, CPI = EV/AC.", "EAC = BAC/CPI (base assumption).", "Expected overrun = EAC - BAC.", "Net risk = risk maruziyeti - azaltma maliyeti."],assumptionNotes_i18n:[{"en":"SPI = EV/PV, CPI = EV/AC."},{"en":"EAC = BAC/CPI (base assumption)."},{"en":"Expected overrun = EAC - BAC."},{"en":"Net risk = risk exposure - mitigation cost."}]},
};
