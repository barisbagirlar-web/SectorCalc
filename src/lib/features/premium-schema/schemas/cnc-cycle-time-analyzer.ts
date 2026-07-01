/**
 * Tool #22 — CNC Cevrim Suresi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CNC_CYCLE_TIME_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-cycle-time-analyzer", legacyPaidSlug: "cnc-cycle-time-analyzer",
  name: "CNC Cycle Time & OEE Analysis", name_i18n: {"en":"CNC Cycle Time & OEE Analysis"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Costing and capacity planning without accurate CNC cycle time calculation is incorrect. OEE loss remains invisible.", painStatement_i18n: {"en":"Costing and capacity planning without accurate CNC cycle time calculation is incorrect. OEE loss remains invisible."},
  inputs: [
    { id: "cuttingSpeed", label: "Cutting Speed (Vc)", label_i18n: {"en":"Cutting Speed (Vc)"}, type: "number", unit: "m/dak", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed", expertMeaning_i18n: {"en":"Cutting speed"} },
    { id: "chipLoad", label: "Chip Load (fz)", label_i18n: {"en":"Chip Load (fz)"}, type: "number", unit: "mm/dis", required: true, smartDefault: 0.12, validation: { min: 0.001 }, helper: "", expertMeaning: "Chip load per tooth", expertMeaning_i18n: {"en":"Chip load per tooth"} },
    { id: "toothCount", label: "Number of Teeth (z)", label_i18n: {"en":"Number of Teeth (z)"}, type: "number", unit: "", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of teeth", expertMeaning_i18n: {"en":"Number of teeth"} },
    { id: "depthOfCut", label: "Depth of Cut (ap)", label_i18n: {"en":"Depth of Cut (ap)"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Depth of cut", expertMeaning_i18n: {"en":"Depth of cut"} },
    { id: "toolDiameter", label: "Tool Diameter (D_tool)", label_i18n: {"en":"Tool Diameter (D_tool)"}, type: "number", unit: "mm", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Tool diameter", expertMeaning_i18n: {"en":"Tool diameter"} },
    { id: "cutLength", label: "Kesme Boyu (L)", label_i18n: {"en":"Cutting Length (L)"}, type: "number", unit: "mm", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Cutting path length", expertMeaning_i18n: {"en":"Cutting path length"} },
    { id: "rapidDistance", label: "Rapid Distance", label_i18n: {"en":"Rapid Distance"}, type: "number", unit: "mm", required: false, smartDefault: 300, validation: { min: 0 }, helper: "", expertMeaning: "Rapid traverse distance", expertMeaning_i18n: {"en":"Rapid traverse distance"} },
    { id: "rapidSpeed", label: "Rapid Traverse Speed", label_i18n: {"en":"Rapid Traverse Speed"}, type: "number", unit: "mm/dak", required: false, smartDefault: 15000, validation: { min: 1 }, helper: "", expertMeaning: "Rapid traverse speed", expertMeaning_i18n: {"en":"Rapid traverse speed"} },
    { id: "toolChanges", label: "Number of Tool Changes", label_i18n: {"en":"Number of Tool Changes"}, type: "number", unit: "", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Number of tool changes", expertMeaning_i18n: {"en":"Number of tool changes"} },
    { id: "timePerChange", label: "Time Per Change", label_i18n: {"en":"Time Per Change"}, type: "number", unit: "dak", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Time per tool change", expertMeaning_i18n: {"en":"Time per tool change"} },
    { id: "nonCuttingTime", label: "Non-Cutting Time", label_i18n: {"en":"Non-Cutting Time"}, type: "number", unit: "dak", required: false, smartDefault: 0.3, validation: { min: 0 }, helper: "", expertMeaning: "Manual reposition etc.", expertMeaning_i18n: {"en":"Manual reposition etc."} },
    { id: "loadUnloadTime", label: "Load/Unload", label_i18n: {"en":"Load/Unload"}, type: "number", unit: "dak", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Part load/unload", expertMeaning_i18n: {"en":"Part load/unload"} },
    { id: "plannedTime", label: "Planlanan Uretim Suresi", label_i18n: {"en":"Planned Production Time"}, type: "number", unit: "dak", required: false, smartDefault: 480, validation: { min: 0 }, helper: "", expertMeaning: "Planned production time", expertMeaning_i18n: {"en":"Planned production time"} },
    { id: "downtime", label: "Unplanned Downtime", label_i18n: {"en":"Unplanned Downtime"}, type: "number", unit: "dak", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Unplanned downtime", expertMeaning_i18n: {"en":"Unplanned downtime"} },
    { id: "totalParts", label: "Total Parts", label_i18n: {"en":"Total Parts"}, type: "number", unit: "adet", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Total parts produced", expertMeaning_i18n: {"en":"Total parts produced"} },
  ],
  outputs: [
    { id: "cutTime", label: "Kesme Suresi (T_cut)", label_i18n: {"en":"Cutting Time (T_cut)"}, unit: "dak", format: "number" },
    { id: "totalCycleTime", label: "Total Cycle Time", label_i18n: {"en":"Total Cycle Time"}, unit: "dak", format: "number" },
    { id: "cyclePerPart", label: "Time Per Part", label_i18n: {"en":"Time Per Part"}, unit: "dak/adet", format: "number" },
    { id: "oeeAvailability", label: "OEE Kullanlabilirlik", label_i18n: {"en":"OEE Kullanlabilirlik"}, unit: "%", format: "percentage" },
    { id: "dailyCapacity", label: "Gunluk Kapasite", label_i18n: {"en":"Daily Capacity"}, unit: "adet", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "oeeAvailability", warning: 85, critical: 70, direction: "lower_is_bad", warningMessage: "OEE < 85% — downtime analysis recommended.", warningMessage_i18n: {"en":"OEE < 85% — downtime analysis recommended."}, criticalMessage: "OEE < 70% — initiate TPM program.", criticalMessage_i18n: {"en":"OEE < 70% — initiate TPM program."} },
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
  reportTemplate: { title: "CNC Cycle Time Report", title_i18n: {"en":"CNC Cycle Time Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["RPM = (1000×Vc)/(π×D). Vf = fz×z×n.", "T_cut = (L×ap)/Vf. Rapid time = Dist/V_rapid.", "OEE Availability = Planned/(Planned+Downtime)."],assumptionNotes_i18n:[{"en":"RPM = (1000×Vc)/(π×D). Vf = fz×z×n."},{"en":"T_cut = (L×ap)/Vf. Rapid time = Dist/V_rapid."},{"en":"OEE Availability = Planned/(Planned+Downtime)."}]},
};
