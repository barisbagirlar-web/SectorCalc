import { YanginHidrantiAkisVeSebekeBasincAnalysisNfpa291Calculator90InputSchema, type YanginHidrantiAkisVeSebekeBasincAnalysisNfpa291Calculator90Input } from "./yangin-hidranti-akis-ve-sebeke-basinc-analysis-nfpa-291-calculator-90-validation";

export const calculateYanginHidrantiAkisVeSebekeBasincAnalysisNfpa291Calculator90Contract: any = {
  id: "yangin-hidranti-akis-ve-sebeke-basinc-analysis-nfpa-291-calculator-90",
  version: "1.0.0",
  category: "cost",
  inputSchema: YanginHidrantiAkisVeSebekeBasincAnalysisNfpa291Calculator90InputSchema,
  
  execute: async (input: any) => {
    try {
      // Extract inputs with defaults
      const hydrantDia = input.hydrantDia ?? 0;
      const pitotP = input.pitotP ?? 0;
      const staticP = input.staticP ?? 0;
      const residualP = input.residualP ?? 0;
      const cd = input.cd ?? 0.9;
      const requiredFlow = input.requiredFlow ?? 0;

      // FlowRate_gpm = 29.83 * cd * (hydrant_dia)^2 * sqrt(pitot_p)
      const flowRateGpm = 29.83 * cd * Math.pow(hydrantDia, 2) * Math.sqrt(pitotP);

      // Flow_At_20psi = FlowRate_gpm * ((staticP - 20) / (staticP - residualP))^0.54
      const pressureDifference = staticP - residualP;
      let flowAt20psi = 0;
      if (pressureDifference !== 0) {
        const ratio = (staticP - 20) / pressureDifference;
        if (ratio > 0) {
          flowAt20psi = flowRateGpm * Math.pow(ratio, 0.54);
        }
      }

      return {
        flowRateGpm: Math.round(flowRateGpm * 100) / 100,
        flowAt20psi: Math.round(flowAt20psi * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};