/**
 * Tool #20 — MTBF/MTTR Finansal Etki
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const MTBF_MTTR_FINANCIAL_SCHEMA: PremiumCalculatorSchema = {
  id: "mtbf-mttr-financial-analyzer", legacyPaidSlug: "mtbf-mttr-financial-analyzer",
  name: "MTBF/MTTR Finansal Etki Analizi", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "MTBF ve MTTR verileri finansal risk olarak hesaplanmazsa bakım yatırımları önceliklendirilemez.",
  inputs: [
    { id: "mtbfHours", label: "MTBF (Arıza Arası Ortalama Süre)", type: "number", unit: "saat", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Mean time between failures" },
    { id: "mttrHours", label: "MTTR (Ortalama Onarım Süresi)", type: "number", unit: "saat", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "", expertMeaning: "Mean time to repair" },
    { id: "operatingHours", label: "Yıllık Çalışma Saati", type: "number", unit: "saat/yıl", required: true, smartDefault: 8000, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating hours" },
    { id: "machineHourlyCost", label: "Makine Saatlik Maliyeti", type: "number", unit: "USD/saat", required: true, smartDefault: 150, validation: { min: 0.01 }, helper: "", expertMeaning: "Machine cost per hour" },
    { id: "numMachines", label: "Makine Sayısı", type: "number", unit: "adet", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of machines" },
    { id: "improvedMtbf", label: "İyileştirilmiş MTBF (opsiyonel)", type: "number", unit: "saat", required: false, smartDefault: 800, validation: { min: 1 }, helper: "", expertMeaning: "Target MTBF after improvement" },
  ],
  outputs: [
    { id: "availability", label: "Kullanılabilirlik Oranı", unit: "%", format: "number" },
    { id: "expectedDowntime", label: "Beklenen Durma Süresi", unit: "saat/yıl", format: "number" },
    { id: "downtimeCost", label: "Durma Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "totalReliabilityCost", label: "Toplam Güvenilirlik Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "roiPercent", label: "ROI (İyileştirme)", unit: "%", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "downtimeCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Durma maliyeti > $50K — bakım programı gözden geçirilmeli.", criticalMessage: "Durma maliyeti > $150K — acil güvenilirlik iyileştirme programı başlatılmalı." }],
  formulaPipeline: [
    { formulaId: "measurement.availability_mtbf", inputMap: { mtbfHours: "mtbfHours", mttrHours: "mttrHours" }, outputId: "availability" },
    { formulaId: "measurement.expected_downtime", inputMap: { mttrHours: "mttrHours", mtbfHours: "mtbfHours", operatingHours: "operatingHours" }, outputId: "expectedDowntime" },
    { formulaId: "cost.downtime_cost_mtbf", inputMap: { expectedDowntime: "expectedDowntime", machineHourlyCost: "machineHourlyCost", numMachines: "numMachines" }, outputId: "downtimeCost" },
    { formulaId: "cost.reliability_total_cost", inputMap: { downtimeCost: "downtimeCost", numMachines: "numMachines" }, outputId: "totalReliabilityCost" },
    { formulaId: "cost.reliability_roi", inputMap: { mtbfHours: "mtbfHours", improvedMtbf: "improvedMtbf", downtimeCost: "downtimeCost" }, outputId: "roiPercent" },
  ],
  reportTemplate: { title: "MTBF/MTTR Financial Impact Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Faydalı ömür = MTBF + MTTR.", "Kullanılabilirlik = MTBF/(MTBF+MTTR).", "Yıllık durma süresi = (1−A)×çalışma saati."] },
};
