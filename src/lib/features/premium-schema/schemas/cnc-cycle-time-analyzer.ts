/**
 * Tool #22 — CNC Çevrim Süresi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CNC_CYCLE_TIME_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-cycle-time-analyzer", legacyPaidSlug: "cnc-cycle-time-analyzer",
  name: "CNC Çevrim Süresi & OEE Analizi", name_i18n: {"en":"CNC Cycle Time & OEE Analysis","tr":"CNC Çevrim Süresi & OEE Analizi"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "CNC çevrim süresini doğru hesaplamadan yapılan maliyetlendirme ve kapasite planlaması hatalı olur. OEE kaybı görünmez.", painStatement_i18n: {"en":"Costing and capacity planning without accurate CNC cycle time calculation is incorrect. OEE loss remains invisible.","tr":"CNC çevrim süresini doğru hesaplamadan yapılan maliyetlendirme ve kapasite planlaması hatalı olur. OEE kaybı görünmez."},
  inputs: [
    { id: "cuttingSpeed", label: "Kesme Hızı (Vc)", label_i18n: {"en":"Cutting Speed (Vc)","tr":"Kesme Hızı (Vc)"}, type: "number", unit: "m/dak", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed", expertMeaning_i18n: {"en":"Cutting speed","tr":"Kesme hızı"} },
    { id: "chipLoad", label: "Diş Başına Talaş (fz)", label_i18n: {"en":"Chip Load (fz)","tr":"Diş Başına Talaş (fz)"}, type: "number", unit: "mm/diş", required: true, smartDefault: 0.12, validation: { min: 0.001 }, helper: "", expertMeaning: "Chip load per tooth", expertMeaning_i18n: {"en":"Chip load per tooth","tr":"Diş başına talaş"} },
    { id: "toothCount", label: "Diş Sayısı (z)", label_i18n: {"en":"Number of Teeth (z)","tr":"Diş Sayısı (z)"}, type: "number", unit: "", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of teeth", expertMeaning_i18n: {"en":"Number of teeth","tr":"Diş sayısı"} },
    { id: "depthOfCut", label: "Talaş Derinliği (ap)", label_i18n: {"en":"Depth of Cut (ap)","tr":"Talaş Derinliği (ap)"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Depth of cut", expertMeaning_i18n: {"en":"Depth of cut","tr":"Talaş derinliği"} },
    { id: "toolDiameter", label: "Takım Çapı (D_tool)", label_i18n: {"en":"Tool Diameter (D_tool)","tr":"Takım Çapı (D_tool)"}, type: "number", unit: "mm", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Tool diameter", expertMeaning_i18n: {"en":"Tool diameter","tr":"Takım çapı"} },
    { id: "cutLength", label: "Kesme Boyu (L)", label_i18n: {"en":"Cutting Length (L)","tr":"Kesme Boyu (L)"}, type: "number", unit: "mm", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Cutting path length", expertMeaning_i18n: {"en":"Cutting path length","tr":"Kesme yolu uzunluğu"} },
    { id: "rapidDistance", label: "Hızlı Mesafe", label_i18n: {"en":"Rapid Distance","tr":"Hızlı Mesafe"}, type: "number", unit: "mm", required: false, smartDefault: 300, validation: { min: 0 }, helper: "", expertMeaning: "Rapid traverse distance", expertMeaning_i18n: {"en":"Rapid traverse distance","tr":"Hızlı hareket mesafesi"} },
    { id: "rapidSpeed", label: "Hızlı Hareket Hızı", label_i18n: {"en":"Rapid Traverse Speed","tr":"Hızlı Hareket Hızı"}, type: "number", unit: "mm/dak", required: false, smartDefault: 15000, validation: { min: 1 }, helper: "", expertMeaning: "Rapid traverse speed", expertMeaning_i18n: {"en":"Rapid traverse speed","tr":"Hızlı hareket hızı"} },
    { id: "toolChanges", label: "Takım Değişim Sayısı", label_i18n: {"en":"Number of Tool Changes","tr":"Takım Değişim Sayısı"}, type: "number", unit: "", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Number of tool changes", expertMeaning_i18n: {"en":"Number of tool changes","tr":"Takım değişim sayısı"} },
    { id: "timePerChange", label: "Değişim Başına Süre", label_i18n: {"en":"Time Per Change","tr":"Değişim Başına Süre"}, type: "number", unit: "dak", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Time per tool change", expertMeaning_i18n: {"en":"Time per tool change","tr":"Takım değişimi başına süre"} },
    { id: "nonCuttingTime", label: "Kesme Dışı Süre", label_i18n: {"en":"Non-Cutting Time","tr":"Kesme Dışı Süre"}, type: "number", unit: "dak", required: false, smartDefault: 0.3, validation: { min: 0 }, helper: "", expertMeaning: "Manual reposition etc.", expertMeaning_i18n: {"en":"Manual reposition etc.","tr":"Manuel yeniden konumlandırma vb."} },
    { id: "loadUnloadTime", label: "Yükleme/Boşaltma", label_i18n: {"en":"Load/Unload","tr":"Yükleme/Boşaltma"}, type: "number", unit: "dak", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Part load/unload", expertMeaning_i18n: {"en":"Part load/unload","tr":"Parça yükleme/boşaltma"} },
    { id: "plannedTime", label: "Planlanan Üretim Süresi", label_i18n: {"en":"Planned Production Time","tr":"Planlanan Üretim Süresi"}, type: "number", unit: "dak", required: false, smartDefault: 480, validation: { min: 0 }, helper: "", expertMeaning: "Planned production time", expertMeaning_i18n: {"en":"Planned production time","tr":"Planlı üretim süresi"} },
    { id: "downtime", label: "Plansız Duruş", label_i18n: {"en":"Unplanned Downtime","tr":"Plansız Duruş"}, type: "number", unit: "dak", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Unplanned downtime", expertMeaning_i18n: {"en":"Unplanned downtime","tr":"Plansız duruş"} },
    { id: "totalParts", label: "Toplam Parça", label_i18n: {"en":"Total Parts","tr":"Toplam Parça"}, type: "number", unit: "adet", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Total parts produced", expertMeaning_i18n: {"en":"Total parts produced","tr":"Üretilen toplam parça"} },
  ],
  outputs: [
    { id: "cutTime", label: "Kesme Süresi (T_cut)", label_i18n: {"en":"Cutting Time (T_cut)","tr":"Kesme Süresi (T_cut)"}, unit: "dak", format: "number" },
    { id: "totalCycleTime", label: "Toplam Çevrim Süresi", label_i18n: {"en":"Toplam Cevrim Suresi","tr":"Toplam Çevrim Süresi"}, unit: "dak", format: "number" },
    { id: "cyclePerPart", label: "Parça Başına Süre", label_i18n: {"en":"Parca Basna Sure","tr":"Parça Başına Süre"}, unit: "dak/adet", format: "number" },
    { id: "oeeAvailability", label: "OEE Kullanılabilirlik", label_i18n: {"en":"OEE Kullanlabilirlik","tr":"OEE Kullanılabilirlik"}, unit: "%", format: "percentage" },
    { id: "dailyCapacity", label: "Günlük Kapasite", label_i18n: {"en":"Gunluk Kapasite","tr":"Günlük Kapasite"}, unit: "adet", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "oeeAvailability", warning: 85, critical: 70, direction: "lower_is_bad", warningMessage: "OEE < %85 — duruş analizi önerilir.", warningMessage_i18n: {"en":"OEE < 85% — downtime analysis recommended.","tr":"OEE < %85 — duruş analizi önerilir."}, criticalMessage: "OEE < %70 — TPM programı başlatılmalı.", criticalMessage_i18n: {"en":"OEE < 70% — initiate TPM program.","tr":"OEE < %70 — TPM programı başlatılmalı."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cnc_rpm", inputMap: { cuttingSpeed: "cuttingSpeed", toolDiameter: "toolDiameter" }, outputId: "rpm" },
    { formulaId: "measurement.cnc_feed_speed", inputMap: {
        rpm: "rpm",
        feedPerTooth: "chipLoad",
        teeth: "toothCount"
      }, outputId: "feedSpeed" },
    { formulaId: "measurement.cnc_cut_time", inputMap: {
        feedSpeed: "feedSpeed",
        length: "cutLength",
        depth: "depthOfCut"
      ,
        axialDepth: "axialDepth"}, outputId: "cutTime" },
    { formulaId: "measurement.cnc_rapid_time", inputMap: { rapidDistance: "rapidDistance", rapidSpeed: "rapidSpeed" }, outputId: "rapidTime" },
    { formulaId: "measurement.cnc_tool_change_time", inputMap: {
        timePerChange: "timePerChange",
        changeCount: "toolChanges"
      }, outputId: "toolChangeTime" },
    { formulaId: "measurement.cnc_total_time", inputMap: { cutTime: "cutTime", rapidTime: "rapidTime", toolChangeTime: "toolChangeTime", nonCuttingTime: "nonCuttingTime", loadUnloadTime: "loadUnloadTime" }, outputId: "totalCycleTime" },
    { formulaId: "measurement.cnc_oee_availability", inputMap: { plannedTime: "plannedTime", downtime: "downtime" }, outputId: "oeeAvailability" },
  ],
  reportTemplate: { title: "CNC Cycle Time Report", title_i18n: {"en":"CNC Cycle Time Report","tr":"CNC Cycle Time Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["RPM = (1000×Vc)/(π×D). Vf = fz×z×n.", "T_cut = (L×ap)/Vf. Rapid time = Dist/V_rapid.", "OEE Availability = Planned/(Planned+Downtime)."],assumptionNotes_i18n:[{"en":"RPM = (1000×Vc)/(π×D). Vf = fz×z×n.","tr":"RPM = (1000×Vc)/(π×D). Vf = fz×z×n."},{"en":"T_cut = (L×ap)/Vf. Rapid time = Dist/V_rapid.","tr":"T_cut = (L×ap)/Vf. Rapid time = Dist/V_rapid."},{"en":"OEE Availability = Planned/(Planned+Downtime).","tr":"OEE Availability = Planned/(Planned+Downtime)."}]},
};
