import { LittleYasasiWipThCtVeDarbogazAnalysisCalculator54InputSchema } from "./little-yasasi-wip-th-ct-ve-darbogaz-analysis-calculator-54-validation";

export const calculateLittleYasasiWipThCtVeDarbogazAnalysisCalculator54Contract: any = {
  id: "little-yasasi-wip-th-ct-ve-darbogaz-analysis-calculator-54",
  version: "1.0.0",
  category: "cost",
  inputSchema: LittleYasasiWipThCtVeDarbogazAnalysisCalculator54InputSchema,
  
  execute: async (input: any) => {
    try {
      const { knownVariable, throughput, cycleTime, bottleneckTh } = input;

      // Little's Law: WIP = TH * CT
      // Validate inputs to avoid division by zero or NaN
      const safeThroughput = Number(throughput) || 0;
      const safeCycleTime = Number(cycleTime) || 0;
      const safeBottleneckTh = Number(bottleneckTh) || 0.001; // Prevent division by zero

      let calcWIP: number;
      let calcTH: number;
      let calcCT: number;

      // Determine which variable is unknown and calculate accordingly
      switch (knownVariable) {
        case "WIP (Süreç İçi Stok)":
          calcWIP = safeThroughput * safeCycleTime;
          calcTH = safeThroughput;
          calcCT = safeCycleTime;
          break;
        case "Throughput (Üretim Hızı)":
          calcWIP = Number(input.wip) || 0;
          calcTH = calcWIP / (safeCycleTime || 0.001);
          calcCT = safeCycleTime;
          break;
        case "Cycle Time (Çevrim Süresi)":
          calcWIP = Number(input.wip) || 0;
          calcTH = safeThroughput;
          calcCT = calcWIP / (safeThroughput || 0.001);
          break;
        default:
          // Default behavior: assume all provided are known, calculate everything
          calcWIP = safeThroughput * safeCycleTime;
          calcTH = safeThroughput;
          calcCT = safeCycleTime;
      }

      // System Efficiency = (Actual TH / Bottleneck TH) * 100
      const systemEfficiency = safeBottleneckTh > 0 
        ? (calcTH / safeBottleneckTh) * 100 
        : 0;

      // Best Case Cycle Time Theoretical = 1 / Bottleneck TH (hours per unit)
      const bestCaseCTTheoretical = safeBottleneckTh > 0 
        ? 1 / safeBottleneckTh 
        : 0;

      return {
        calcWIP: Math.round(calcWIP * 100) / 100,
        calcTH: Math.round(calcTH * 100) / 100,
        calcCT: Math.round(calcCT * 100) / 100,
        systemEfficiency: Math.round(systemEfficiency * 100) / 100,
        bestCaseCTTheoretical: Math.round(bestCaseCTTheoretical * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};