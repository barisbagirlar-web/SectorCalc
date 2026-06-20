/**
 * Tool #37 — Proje Aşım Riski Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PROJECT_OVERRUN_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "project-overrun-analyzer", legacyPaidSlug: "project-overrun-analyzer",
  name: "Proje Aşım Riski ve Kazanılmış Değer", sectorSlug: "construction", category: "cost",
  painStatement: "Proje aşımları erken tespit edilmezse bütçe şişer, teslimat gecikir ve taahhüt cezaları devreye girer.",
  inputs: [
    { id: "plannedValue", label: "Planlanan Değer (PV)", type: "number", unit: "USD", required: true, smartDefault: 1000000, validation: { min: 1 }, helper: "", expertMeaning: "Planned Value (budget)" },
    { id: "earnedValue", label: "Kazanılan Değer (EV)", type: "number", unit: "USD", required: true, smartDefault: 750000, validation: { min: 0 }, helper: "", expertMeaning: "Earned Value (work completed)" },
    { id: "actualCost", label: "Gerçekleşen Maliyet (AC)", type: "number", unit: "USD", required: true, smartDefault: 800000, validation: { min: 0 }, helper: "", expertMeaning: "Actual Cost incurred" },
    { id: "scheduleDays", label: "Planlanan Süre", type: "number", unit: "gün", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned schedule duration" },
    { id: "actualDays", label: "Gerçekleşen Süre", type: "number", unit: "gün", required: false, smartDefault: 160, validation: { min: 0 }, helper: "", expertMeaning: "Actual elapsed days" },
    { id: "riskProbability", label: "Risk Olasılığı", type: "number", unit: "%", required: false, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Probability of risk events" },
    { id: "riskImpact", label: "Risk Etkisi", type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Financial impact of risks" },
    { id: "mitigationCost", label: "Azaltma Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Cost to mitigate risks" },
  ],
  outputs: [
    { id: "spi", label: "Program Performans Endeksi (SPI)", unit: "", format: "number" },
    { id: "cpi", label: "Maliyet Performans Endeksi (CPI)", unit: "", format: "number" },
    { id: "eac", label: "Tahmini Tamamlanma Maliyeti (EAC)", unit: "USD", format: "currency", isBigNumber: true },
    { id: "expectedOverrun", label: "Beklenen Aşım", unit: "USD", format: "currency", isBigNumber: true },
    { id: "scheduleDelay", label: "Program Gecikmesi", unit: "gün", format: "number" },
    { id: "riskExposure", label: "Risk Maruziyeti", unit: "USD", format: "currency" },
    { id: "mitigationCost", label: "Azaltma Maliyeti", unit: "USD", format: "currency" },
    { id: "netRisk", label: "Net Risk", unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "cpi", warning: 0.95, critical: 0.85, direction: "lower_is_bad", warningMessage: "CPI < 0.95 — maliyet aşımı sinyali.", criticalMessage: "CPI < 0.85 — acil maliyet düzeltici aksiyon." }],
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
  reportTemplate: { title: "Project Overrun Risk Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 15, targetMarginPercent: 15, assumptionNotes: ["SPI = EV/PV, CPI = EV/AC.", "EAC = BAC/CPI (base varsayımı).", "Beklenen aşım = EAC - BAC.", "Net risk = risk maruziyeti - azaltma maliyeti."] },
};
