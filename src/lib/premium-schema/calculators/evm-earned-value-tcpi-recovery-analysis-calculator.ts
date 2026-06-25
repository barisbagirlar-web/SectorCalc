import { EvmKazanilmisDegerVeTcpiKurtarmaAnalysisCalculator35InputSchema, type EvmKazanilmisDegerVeTcpiKurtarmaAnalysisCalculator35Input } from "./evm-kazanilmis-deger-ve-tcpi-kurtarma-analysis-calculator-35-validation";

export const calculateEvmKazanilmisDegerVeTcpiKurtarmaAnalysisCalculator35Contract: any = {
  id: "evm-kazanilmis-deger-ve-tcpi-kurtarma-analysis-calculator-35",
  version: "1.0.0",
  category: "cost",
  inputSchema: EvmKazanilmisDegerVeTcpiKurtarmaAnalysisCalculator35InputSchema,
  
  execute: async (input: any) => {
    try {
      const { bac, pv, ev, ac, managementReserve } = input;

      // Calculate core EVM metrics
      const sPI = pv !== 0 ? ev / pv : 0;
      const cPI = ac !== 0 ? ev / ac : 0;
      const costVarianceCV = ev - ac;
      const scheduleVarianceSV = ev - pv;
      
      // Estimate at Completion using CPI-based formula (most common)
      const estimateAtCompletionEAC = cPI !== 0 ? bac / cPI : bac;
      
      // Estimate to Complete
      const estimateToCompleteETC = estimateAtCompletionEAC - ac;
      
      // Variance at Completion
      const varianceAtCompletionVAC = bac - estimateAtCompletionEAC;
      
      // TCPI to BAC (To Complete Performance Index)
      const remainingBudget = bac - ev;
      const remainingCost = bac - ac;
      const tCPIToBAC = remainingCost !== 0 ? remainingBudget / remainingCost : 0;
      
      // Net Financial Position
      const netFinancialPosition = varianceAtCompletionVAC + managementReserve;

      return {
        sPI: Math.round(sPI * 100) / 100,
        cPI: Math.round(cPI * 100) / 100,
        costVarianceCV: Math.round(costVarianceCV * 100) / 100,
        scheduleVarianceSV: Math.round(scheduleVarianceSV * 100) / 100,
        estimateAtCompletionEAC: Math.round(estimateAtCompletionEAC * 100) / 100,
        estimateToCompleteETC: Math.round(estimateToCompleteETC * 100) / 100,
        varianceAtCompletionVAC: Math.round(varianceAtCompletionVAC * 100) / 100,
        tCPIToBAC: Math.round(tCPIToBAC * 100) / 100,
        netFinancialPosition: Math.round(netFinancialPosition * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};