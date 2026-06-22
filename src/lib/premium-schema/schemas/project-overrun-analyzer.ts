/**
 * Tool #37 — Proje Aşım Riski Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PROJECT_OVERRUN_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "project-overrun-analyzer", legacyPaidSlug: "project-overrun-analyzer",
  name: "Proje Aşım Riski ve Kazanılmış Değer", name_i18n: {"en":"Project Overrun Risk & Earned Value","tr":"Proje Aşım Riski ve Kazanılmış Değer"}, sectorSlug: "construction", category: "cost",
  painStatement: "Proje aşımları erken tespit edilmezse bütçe şişer, teslimat gecikir ve taahhüt cezaları devreye girer.", painStatement_i18n: {"en":"If project overruns are not detected early, budget swells, delivery is delayed, and commitment penalties kick in.","tr":"Proje aşımları erken tespit edilmezse bütçe şişer, teslimat gecikir ve taahhüt cezaları devreye girer."},
  inputs: [
    { id: "plannedValue", label: "Planlanan Değer (PV)", label_i18n: {"en":"Planned Value (PV)","tr":"Planlanan Değer (PV)"}, type: "number", unit: "USD", required: true, smartDefault: 1000000, validation: { min: 1 }, helper: "", expertMeaning: "Planned Value (budget)", expertMeaning_i18n: {"en":"Planned Value (budget)","tr":"Planlanan Değer (bütçe)"} },
    { id: "earnedValue", label: "Kazanılan Değer (EV)", label_i18n: {"en":"Earned Value (EV)","tr":"Kazanılan Değer (EV)"}, type: "number", unit: "USD", required: true, smartDefault: 750000, validation: { min: 0 }, helper: "", expertMeaning: "Earned Value (work completed)", expertMeaning_i18n: {"en":"Earned Value (work completed)","tr":"Kazanılan Değer (tamamlanan iş)"} },
    { id: "actualCost", label: "Gerçekleşen Maliyet (AC)", label_i18n: {"en":"Actual Cost (AC)","tr":"Gerçekleşen Maliyet (AC)"}, type: "number", unit: "USD", required: true, smartDefault: 800000, validation: { min: 0 }, helper: "", expertMeaning: "Actual Cost incurred", expertMeaning_i18n: {"en":"Actual Cost incurred","tr":"Gerçekleşen Maliyet"} },
    { id: "scheduleDays", label: "Planlanan Süre", label_i18n: {"en":"Planned Duration","tr":"Planlanan Süre"}, type: "number", unit: "gün", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned schedule duration", expertMeaning_i18n: {"en":"Planned schedule duration","tr":"Planlanan takvim süresi"} },
    { id: "actualDays", label: "Gerçekleşen Süre", label_i18n: {"en":"Actual Duration","tr":"Gerçekleşen Süre"}, type: "number", unit: "gün", required: false, smartDefault: 160, validation: { min: 0 }, helper: "", expertMeaning: "Actual elapsed days", expertMeaning_i18n: {"en":"Actual elapsed days","tr":"Gerçekleşen gün sayısı"} },
    { id: "riskProbability", label: "Risk Olasılığı", label_i18n: {"en":"Risk Probability","tr":"Risk Olasılığı"}, type: "number", unit: "%", required: false, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Probability of risk events", expertMeaning_i18n: {"en":"Probability of risk events","tr":"Risk olaylarının olasılığı"} },
    { id: "riskImpact", label: "Risk Etkisi", label_i18n: {"en":"Risk Impact","tr":"Risk Etkisi"}, type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Financial impact of risks", expertMeaning_i18n: {"en":"Financial impact of risks","tr":"Risklerin finansal etkisi"} },
    { id: "mitigationCost", label: "Azaltma Maliyeti", label_i18n: {"en":"Mitigation Cost","tr":"Azaltma Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Cost to mitigate risks", expertMeaning_i18n: {"en":"Cost to mitigate risks","tr":"Risk azaltma maliyeti"} },
  ],
  outputs: [
    { id: "spi", label: "Program Performans Endeksi (SPI)", label_i18n: {"en":"Program Performans Endeksi (SPI)","tr":"Program Performans Endeksi (SPI)"}, unit: "", format: "number" },
    { id: "cpi", label: "Maliyet Performans Endeksi (CPI)", label_i18n: {"en":"Maliyet Performans Endeksi (CPI)","tr":"Maliyet Performans Endeksi (CPI)"}, unit: "", format: "number" },
    { id: "eac", label: "Tahmini Tamamlanma Maliyeti (EAC)", label_i18n: {"en":"Tahmini Tamamlanma Maliyeti (EAC)","tr":"Tahmini Tamamlanma Maliyeti (EAC)"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "expectedOverrun", label: "Beklenen Aşım", label_i18n: {"en":"Beklenen Aşım","tr":"Beklenen Aşım"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "scheduleDelay", label: "Program Gecikmesi", label_i18n: {"en":"Program Gecikmesi","tr":"Program Gecikmesi"}, unit: "gün", format: "number" },
    { id: "riskExposure", label: "Risk Maruziyeti", label_i18n: {"en":"Risk Maruziyeti","tr":"Risk Maruziyeti"}, unit: "USD", format: "currency" },
    { id: "mitigationCost", label: "Azaltma Maliyeti", label_i18n: {"en":"Mitigation Cost","tr":"Azaltma Maliyeti"}, unit: "USD", format: "currency" },
    { id: "netRisk", label: "Net Risk", label_i18n: {"en":"Net Risk","tr":"Net Risk"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "cpi", warning: 0.95, critical: 0.85, direction: "lower_is_bad", warningMessage: "CPI < 0.95 — maliyet aşımı sinyali.", warningMessage_i18n: {"en":"CPI < 0.95 — cost overrun signal.","tr":"CPI < 0.95 — maliyet aşımı sinyali."}, criticalMessage: "CPI < 0.85 — acil maliyet düzeltici aksiyon.", criticalMessage_i18n: {"en":"CPI < 0.85 — urgent cost corrective action.","tr":"CPI < 0.85 — acil maliyet düzeltici aksiyon."} }],
  formulaPipeline: [
    { formulaId: "measurement.spi", inputMap: { earnedValue: "earnedValue", plannedValue: "plannedValue" }, outputId: "spi" },
    { formulaId: "measurement.cpi", inputMap: { earnedValue: "earnedValue", actualCost: "actualCost" }, outputId: "cpi" },
    { formulaId: "cost.eac", inputMap: { plannedValue: "plannedValue", cpi: "cpi" }, outputId: "eac" },
    { formulaId: "cost.expected_overrun", inputMap: { eac: "eac", plannedValue: "plannedValue" }, outputId: "expectedOverrun" },
    { formulaId: "measurement.schedule_delay", inputMap: { actualDays: "actualDays", scheduleDays: "scheduleDays", spi: "spi" }, outputId: "scheduleDelay" },
    { formulaId: "cost.risk_exposure", inputMap: { riskProbability: "riskProbability", riskImpact: "riskImpact" }, outputId: "riskExposure" },
    { formulaId: "cost.mitigation_cost", inputMap: { mitigationCost: "mitigationCost" }, outputId: "mitigationCost" },
    { formulaId: "cost.net_risk", inputMap: { riskExposure: "riskExposure", mitigationCost: "mitigationCost" }, outputId: "netRisk" },
  ],
  reportTemplate: { title: "Project Overrun Risk Report", title_i18n: {"en":"Project Overrun Risk Report","tr":"Project Overrun Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 15, targetMarginPercent: 15, assumptionNotes: ["SPI = EV/PV, CPI = EV/AC.", "EAC = BAC/CPI (base varsayımı).", "Beklenen aşım = EAC - BAC.", "Net risk = risk maruziyeti - azaltma maliyeti."],assumptionNotes_i18n:[{"en":"SPI = EV/PV, CPI = EV/AC.","tr":"SPI = EV/PV, CPI = EV/AC."},{"en":"EAC = BAC/CPI (base assumption).","tr":"EAC = BAC/CPI (base varsayımı)."},{"en":"Expected overrun = EAC - BAC.","tr":"Beklenen aşım = EAC - BAC."},{"en":"Net risk = risk exposure - mitigation cost.","tr":"Net risk = risk maruziyeti - azaltma maliyeti."}]},
};
