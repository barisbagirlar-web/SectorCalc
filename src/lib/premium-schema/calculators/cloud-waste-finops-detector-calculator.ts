import { BulutIsrafCloudWasteFinopsDedektoruCalculator19InputSchema, type BulutIsrafCloudWasteFinopsDedektoruCalculator19Input } from "./bulut-israf-cloud-waste-finops-dedektoru-calculator-19-validation";

export const calculateBulutIsrafCloudWasteFinopsDedektoruCalculator19Contract: any = {
  id: "bulut-israf-cloud-waste-finops-dedektoru-calculator-19",
  version: "1.0.0",
  category: "cost",
  inputSchema: BulutIsrafCloudWasteFinopsDedektoruCalculator19InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        vcMMin,
        fzMmTooth,
        toolDiaMm,
        flutesZ,
        cutLengthMm,
        rapidDistMm,
        rapidVelMmMin,
        toolChanges,
        tcTimeSec,
        loadUnloadMin
      } = input;

      // Formula: RPM = (vc_m_min * 1000) / (PI * tool_dia_mm)
      const rPM = (vcMMin * 1000) / (Math.PI * toolDiaMm);

      // Formula: FeedRate = fz_mm_tooth * flutes_z * RPM
      const feedRate = fzMmTooth * flutesZ * rPM;

      // Formula: T_cut_min = cut_length_mm / FeedRate
      const tCutMin = feedRate > 0 ? cutLengthMm / feedRate : 0;

      // Formula: T_rapid_min = rapid_dist_mm / rapid_vel_mm_min
      const tRapidMin = rapidVelMmMin > 0 ? rapidDistMm / rapidVelMmMin : 0;

      // Formula: T_toolchange_min = (tool_changes * tc_time_sec) / 60
      const tToolchangeMin = (toolChanges * tcTimeSec) / 60;

      // Formula: Total_CycleTime = T_cut_min + T_rapid_min + T_toolchange_min + load_unload_min
      const totalCycleTime = tCutMin + tRapidMin + tToolchangeMin + loadUnloadMin;

      // Formula: Spindle_Utilization = (T_cut_min / Total_CycleTime) * 100
      const spindleUtilization = totalCycleTime > 0 ? (tCutMin / totalCycleTime) * 100 : 0;

      return {
        rPM: Math.round(rPM * 100) / 100,
        feedRate: Math.round(feedRate * 100) / 100,
        tCutMin: Math.round(tCutMin * 100) / 100,
        tRapidMin: Math.round(tRapidMin * 100) / 100,
        tToolchangeMin: Math.round(tToolchangeMin * 100) / 100,
        totalCycleTime: Math.round(totalCycleTime * 100) / 100,
        spindleUtilization: Math.round(spindleUtilization * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};