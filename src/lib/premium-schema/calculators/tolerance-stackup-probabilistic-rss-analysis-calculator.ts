import { ToleransYigilmasiToleranceStackupOlasiliksalRssAnalysisCalculator153InputSchema, type ToleransYigilmasiToleranceStackupOlasiliksalRssAnalysisCalculator153Input } from "./tolerans-yigilmasi-tolerance-stackup-olasiliksal-rss-analysis-calculator-153-validation";

export const calculateToleransYigilmasiToleranceStackupOlasiliksalRssAnalysisCalculator153Contract: any = {
  id: "tolerans-yigilmasi-tolerance-stackup-olasiliksal-rss-analysis-calculator-153",
  version: "1.0.0",
  category: "cost",
  inputSchema: ToleransYigilmasiToleranceStackupOlasiliksalRssAnalysisCalculator153InputSchema,
  
  execute: async (input: any) => {
    try {
      const tolArray = Number(input.tolArray);
      const gapNominal = Number(input.gapNominal);
      const processCpk = Number(input.processCpk);
      const assemblyVolume = Number(input.assemblyVolume);
      const costPerScrap = Number(input.costPerScrap);

      // Worst Case Stack Max = tolArray (since it's a single tolerance value)
      const worstCaseStackMax = tolArray;

      // Squared Tols = tolArray^2
      const squaredTols = Math.pow(tolArray, 2);

      // RSS Statistical Stack = sqrt(squaredTols)
      const rSSStatisticalStack = Math.sqrt(squaredTols);

      // Sigma Assembly = RSS_Statistical_Stack / (3 * process_cpk)
      const sigmaAssembly = processCpk > 0 ? rSSStatisticalStack / (3 * processCpk) : 0;

      // Z Score Gap = gap_nominal / Sigma_Assembly
      const zScoreGap = sigmaAssembly > 0 ? gapNominal / sigmaAssembly : 0;

      // Defect Prob Pct = (1 - NORMSDIST(Z_Score_Gap)) * 100
      // Standard normal CDF approximation using the Abromowitz & Stegun formula
      const absZ = Math.abs(zScoreGap);
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const t = 1 / (1 + p * absZ);
      const erfApprox = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);
      const normalCdf = 0.5 * (1 + (zScoreGap >= 0 ? erfApprox : -erfApprox));
      
      const defectProbPct = (1 - normalCdf) * 100;

      // Expected Defect Units = assembly_volume * (Defect_Prob_Pct / 100)
      const expectedDefectUnits = assemblyVolume * (defectProbPct / 100);

      // Expected Failure Cost = Expected_Defect_Units * cost_per_scrap
      const expectedFailureCost = expectedDefectUnits * costPerScrap;

      return {
        worstCaseStackMax,
        squaredTols,
        rSSStatisticalStack,
        sigmaAssembly,
        zScoreGap,
        defectProbPct,
        expectedDefectUnits,
        expectedFailureCost
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};