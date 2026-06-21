/**
 * Tool #20 — MTBF/MTTR Finansal Etki
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const MTBF_MTTR_FINANCIAL_SCHEMA: PremiumCalculatorSchema = {
  id: "mtbf-mttr-financial-analyzer", legacyPaidSlug: "mtbf-mttr-financial-analyzer",
  name: "MTBF/MTTR Finansal Etki Analizi", name_i18n: {"en":"MTBF/MTTR Finansal Etki Analizi","tr":"MTBF/MTTR Finansal Etki Analizi"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "MTBF ve MTTR verileri finansal risk olarak hesaplanmazsa bakım yatırımları önceliklendirilemez.", painStatement_i18n: {"en":"MTBF ve MTTR verileri finansal risk olarak hesaplanmazsa bakım yatırımları önceliklendirilemez.","tr":"MTBF ve MTTR verileri finansal risk olarak hesaplanmazsa bakım yatırımları önceliklendirilemez."},
  inputs: [
    { id: "mtbfHours", label: "MTBF (Arıza Arası Ortalama Süre)", label_i18n: {"en":"MTBF (Arıza Arası Ortalama Süre)","tr":"MTBF (Arıza Arası Ortalama Süre)"}, type: "number", unit: "saat", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Mean time between failures", expertMeaning_i18n: {"en":"Mean time between failures","tr":"Mean time between failures"} },
    { id: "mttrHours", label: "MTTR (Ortalama Onarım Süresi)", label_i18n: {"en":"MTTR (Ortalama Onarım Süresi)","tr":"MTTR (Ortalama Onarım Süresi)"}, type: "number", unit: "saat", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "", expertMeaning: "Mean time to repair", expertMeaning_i18n: {"en":"Mean time to repair","tr":"Mean time to repair"} },
    { id: "operatingHours", label: "Yıllık Çalışma Saati", label_i18n: {"en":"Yıllık Çalışma Saati","tr":"Yıllık Çalışma Saati"}, type: "number", unit: "saat/yıl", required: true, smartDefault: 8000, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours","tr":"Annual operating hours"} },
    { id: "machineHourlyCost", label: "Makine Saatlik Maliyeti", label_i18n: {"en":"Makine Saatlik Maliyeti","tr":"Makine Saatlik Maliyeti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 150, validation: { min: 0.01 }, helper: "", expertMeaning: "Machine cost per hour", expertMeaning_i18n: {"en":"Machine cost per hour","tr":"Machine cost per hour"} },
    { id: "numMachines", label: "Makine Sayısı", label_i18n: {"en":"Makine Sayısı","tr":"Makine Sayısı"}, type: "number", unit: "adet", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of machines", expertMeaning_i18n: {"en":"Number of machines","tr":"Number of machines"} },
    { id: "improvedMtbf", label: "İyileştirilmiş MTBF (opsiyonel)", label_i18n: {"en":"İyileştirilmiş MTBF (opsiyonel)","tr":"İyileştirilmiş MTBF (opsiyonel)"}, type: "number", unit: "saat", required: false, smartDefault: 800, validation: { min: 1 }, helper: "", expertMeaning: "Target MTBF after improvement", expertMeaning_i18n: {"en":"Target MTBF after improvement","tr":"Target MTBF after improvement"} },
  ],
  outputs: [
    { id: "availability", label: "Kullanılabilirlik Oranı", label_i18n: {"en":"Kullanılabilirlik Oranı","tr":"Kullanılabilirlik Oranı"}, unit: "%", format: "number" },
    { id: "expectedDowntime", label: "Beklenen Durma Süresi", label_i18n: {"en":"Beklenen Durma Süresi","tr":"Beklenen Durma Süresi"}, unit: "saat/yıl", format: "number" },
    { id: "downtimeCost", label: "Durma Maliyeti", label_i18n: {"en":"Durma Maliyeti","tr":"Durma Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "totalReliabilityCost", label: "Toplam Güvenilirlik Maliyeti", label_i18n: {"en":"Toplam Güvenilirlik Maliyeti","tr":"Toplam Güvenilirlik Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "roiPercent", label: "ROI (İyileştirme)", label_i18n: {"en":"ROI (İyileştirme)","tr":"ROI (İyileştirme)"}, unit: "%", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "downtimeCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Durma maliyeti > $50K — bakım programı gözden geçirilmeli.", warningMessage_i18n: {"en":"Durma maliyeti > $50K — bakım programı gözden geçirilmeli.","tr":"Durma maliyeti > $50K — bakım programı gözden geçirilmeli."}, criticalMessage: "Durma maliyeti > $150K — acil güvenilirlik iyileştirme programı başlatılmalı.", criticalMessage_i18n: {"en":"Durma maliyeti > $150K — acil güvenilirlik iyileştirme programı başlatılmalı.","tr":"Durma maliyeti > $150K — acil güvenilirlik iyileştirme programı başlatılmalı."} }],
  formulaPipeline: [
    { formulaId: "measurement.availability_mtbf", inputMap: { mtbfHours: "mtbfHours", mttrHours: "mttrHours" }, outputId: "availability" },
    { formulaId: "measurement.expected_downtime", inputMap: { mttrHours: "mttrHours", mtbfHours: "mtbfHours", operatingHours: "operatingHours" }, outputId: "expectedDowntime" },
    { formulaId: "cost.downtime_cost_mtbf", inputMap: { expectedDowntime: "expectedDowntime", machineHourlyCost: "machineHourlyCost", numMachines: "numMachines" }, outputId: "downtimeCost" },
    { formulaId: "cost.reliability_total_cost", inputMap: { downtimeCost: "downtimeCost", numMachines: "numMachines" }, outputId: "totalReliabilityCost" },
    { formulaId: "cost.reliability_roi", inputMap: { mtbfHours: "mtbfHours", improvedMtbf: "improvedMtbf", downtimeCost: "downtimeCost" }, outputId: "roiPercent" },
  ],
  reportTemplate: { title: "MTBF/MTTR Financial Impact Report", title_i18n: {"en":"MTBF/MTTR Financial Impact Report","tr":"MTBF/MTTR Financial Impact Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Faydalı ömür = MTBF + MTTR.", "Kullanılabilirlik = MTBF/(MTBF+MTTR).", "Yıllık durma süresi = (1−A)×çalışma saati."],assumptionNotes_i18n:[{"en":"Faydalı ömür = MTBF + MTTR.","tr":"Faydalı ömür = MTBF + MTTR."},{"en":"Kullanılabilirlik = MTBF/(MTBF+MTTR).","tr":"Kullanılabilirlik = MTBF/(MTBF+MTTR)."},{"en":"Yıllık durma süresi = (1−A)×çalışma saati.","tr":"Yıllık durma süresi = (1−A)×çalışma saati."}] },
};
