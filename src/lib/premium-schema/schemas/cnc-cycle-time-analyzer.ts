/**
 * Tool #22 — CNC Çevrim Süresi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CNC_CYCLE_TIME_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-cycle-time-analyzer", legacyPaidSlug: "cnc-cycle-time-analyzer",
  name: "CNC Çevrim Süresi & OEE Analizi", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "CNC çevrim süresini doğru hesaplamadan yapılan maliyetlendirme ve kapasite planlaması hatalı olur. OEE kaybı görünmez.",
  inputs: [
    { id: "cuttingSpeed", label: "Kesme Hızı (Vc)", type: "number", unit: "m/dak", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed" },
    { id: "chipLoad", label: "Diş Başına Talaş (fz)", type: "number", unit: "mm/diş", required: true, smartDefault: 0.12, validation: { min: 0.001 }, helper: "", expertMeaning: "Chip load per tooth" },
    { id: "toothCount", label: "Diş Sayısı (z)", type: "number", unit: "", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of teeth" },
    { id: "depthOfCut", label: "Talaş Derinliği (ap)", type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Depth of cut" },
    { id: "toolDiameter", label: "Takım Çapı (D_tool)", type: "number", unit: "mm", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Tool diameter" },
    { id: "cutLength", label: "Kesme Boyu (L)", type: "number", unit: "mm", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Cutting path length" },
    { id: "rapidDistance", label: "Hızlı Mesafe", type: "number", unit: "mm", required: false, smartDefault: 300, validation: { min: 0 }, helper: "", expertMeaning: "Rapid traverse distance" },
    { id: "rapidSpeed", label: "Hızlı Hareket Hızı", type: "number", unit: "mm/dak", required: false, smartDefault: 15000, validation: { min: 1 }, helper: "", expertMeaning: "Rapid traverse speed" },
    { id: "toolChanges", label: "Takım Değişim Sayısı", type: "number", unit: "", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Number of tool changes" },
    { id: "timePerChange", label: "Değişim Başına Süre", type: "number", unit: "dak", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Time per tool change" },
    { id: "nonCuttingTime", label: "Kesme Dışı Süre", type: "number", unit: "dak", required: false, smartDefault: 0.3, validation: { min: 0 }, helper: "", expertMeaning: "Manual reposition etc." },
    { id: "loadUnloadTime", label: "Yükleme/Boşaltma", type: "number", unit: "dak", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Part load/unload" },
    { id: "plannedTime", label: "Planlanan Üretim Süresi", type: "number", unit: "dak", required: false, smartDefault: 480, validation: { min: 0 }, helper: "", expertMeaning: "Planned production time" },
    { id: "downtime", label: "Plansız Duruş", type: "number", unit: "dak", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Unplanned downtime" },
    { id: "totalParts", label: "Toplam Parça", type: "number", unit: "adet", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Total parts produced" },
  ],
  outputs: [
    { id: "cutTime", label: "Kesme Süresi (T_cut)", unit: "dak", format: "number" },
    { id: "totalCycleTime", label: "Toplam Çevrim Süresi", unit: "dak", format: "number" },
    { id: "cyclePerPart", label: "Parça Başına Süre", unit: "dak/adet", format: "number" },
    { id: "oeeAvailability", label: "OEE Kullanılabilirlik", unit: "%", format: "percentage" },
    { id: "dailyCapacity", label: "Günlük Kapasite", unit: "adet", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "oeeAvailability", warning: 85, critical: 70, direction: "lower_is_bad", warningMessage: "OEE < %85 — duruş analizi önerilir.", criticalMessage: "OEE < %70 — TPM programı başlatılmalı." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cnc_rpm", inputMap: { cuttingSpeed: "cuttingSpeed", toolDiameter: "toolDiameter" }, outputId: "rpm" },
    { formulaId: "measurement.cnc_feed_speed", inputMap: { chipLoad: "chipLoad", toothCount: "toothCount", rpm: "rpm" }, outputId: "feedSpeed" },
    { formulaId: "measurement.cnc_cut_time", inputMap: { cutLength: "cutLength", depthOfCut: "depthOfCut", feedSpeed: "feedSpeed" }, outputId: "cutTime" },
    { formulaId: "measurement.cnc_rapid_time", inputMap: { rapidDistance: "rapidDistance", rapidSpeed: "rapidSpeed" }, outputId: "rapidTime" },
    { formulaId: "measurement.cnc_tool_change_time", inputMap: { toolChanges: "toolChanges", timePerChange: "timePerChange" }, outputId: "toolChangeTime" },
    { formulaId: "measurement.cnc_total_time", inputMap: { cutTime: "cutTime", rapidTime: "rapidTime", toolChangeTime: "toolChangeTime", nonCuttingTime: "nonCuttingTime", loadUnloadTime: "loadUnloadTime" }, outputId: "totalCycleTime" },
    { formulaId: "measurement.cnc_oee_availability", inputMap: { plannedTime: "plannedTime", downtime: "downtime" }, outputId: "oeeAvailability" },
  ],
  reportTemplate: { title: "CNC Cycle Time Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["RPM = (1000×Vc)/(π×D). Vf = fz×z×n.", "T_cut = (L×ap)/Vf. Rapid time = Dist/V_rapid.", "OEE Availability = Planned/(Planned+Downtime)."] },
};
