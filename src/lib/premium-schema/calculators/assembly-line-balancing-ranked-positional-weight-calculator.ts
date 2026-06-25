import { MontajHattiDengelemeRankedPositionalWeightRpwCalculator126InputSchema, type MontajHattiDengelemeRankedPositionalWeightRpwCalculator126Input } from "./montaj-hatti-dengeleme-ranked-positional-weight-rpw-calculator-126-validation";

export const calculateMontajHattiDengelemeRankedPositionalWeightRpwCalculator126Contract: any = {
  id: "montaj-hatti-dengeleme-ranked-positional-weight-rpw-calculator-126",
  version: "1.0.0",
  category: "cost",
  inputSchema: MontajHattiDengelemeRankedPositionalWeightRpwCalculator126InputSchema,
  
  execute: async (input: any) => {
    try {
      const taskTimes: number[] = Array.isArray(input.taskTimes) ? input.taskTimes : [];
      const precedenceMatrix: number[] = Array.isArray(input.precedenceMatrix) ? input.precedenceMatrix : [];
      const taktTime: number = Number(input.taktTime) || 0;
      const actualStations: number = Number(input.actualStations) || 0;

      if (taskTimes.length === 0 || precedenceMatrix.length === 0 || taktTime <= 0 || actualStations <= 0) {
        return {
          rPWI: 0,
          totalWorkContent: 0,
          minTheoreticalStations: 0,
          maxStationTimeAllowed: 0,
          lineEfficiencyPct: 0,
          balanceDelayPct: 0
        };
      }

      // RPW_i = task_times_i + precedence_matrix_i
      const rPWI: number[] = taskTimes.map((time, index) => {
        const precedenceValue = precedenceMatrix[index] || 0;
        return time + precedenceValue;
      });

      // Total_Work_Content = SUM(task_times)
      const totalWorkContent: number = taskTimes.reduce((sum, time) => sum + time, 0);

      // Min_Theoretical_Stations = CEILING(Total_Work_Content / takt_time)
      const minTheoreticalStations: number = Math.ceil(totalWorkContent / taktTime);

      // Max_Station_Time_Allowed = MAX(task_times)
      const maxStationTimeAllowed: number = Math.max(...taskTimes);

      // Line_Efficiency_Pct = (Total_Work_Content / (actual_stations * takt_time)) * 100
      const lineEfficiencyPct: number = ((totalWorkContent / (actualStations * taktTime)) * 100);

      // Balance_Delay_Pct = 100 - Line_Efficiency_Pct
      const balanceDelayPct: number = 100 - lineEfficiencyPct;

      return {
        rPWI,
        totalWorkContent,
        minTheoreticalStations,
        maxStationTimeAllowed,
        lineEfficiencyPct,
        balanceDelayPct
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};