import { OlsRegresyonOtokorelasyonDwVeVifDogrulamaCalculator131InputSchema, type OlsRegresyonOtokorelasyonDwVeVifDogrulamaCalculator131Input } from "./ols-regresyon-otokorelasyon-dw-ve-vif-dogrulama-calculator-131-validation";

export const calculateOlsRegresyonOtokorelasyonDwVeVifDogrulamaCalculator131Contract: any = {
  id: "ols-regresyon-otokorelasyon-dw-ve-vif-dogrulama-calculator-131",
  version: "1.0.0",
  category: "cost",
  inputSchema: OlsRegresyonOtokorelasyonDwVeVifDogrulamaCalculator131InputSchema,
  
  execute: async (input: OlsRegresyonOtokorelasyonDwVeVifDogrulamaCalculator131Input) => {
    try {
      const { nSamples, pPredictors, rSquared, maxVifValue, durbinWatsonStat, conditionNumber } = input;

      // Adjusted R Squared: 1 - ((1 - R²) * (n - 1)) / (n - p - 1)
      const denominatorAdjusted = nSamples - pPredictors - 1;
      const adjustedRSquared = denominatorAdjusted > 0 
        ? 1 - ((1 - rSquared) * (nSamples - 1)) / denominatorAdjusted
        : NaN;

      // F Stat Model: (R² / p) / ((1 - R²) / (n - p - 1))
      const denominatorF = nSamples - pPredictors - 1;
      const fStatModel = (denominatorF > 0 && pPredictors > 0 && (1 - rSquared) !== 0)
        ? (rSquared / pPredictors) / ((1 - rSquared) / denominatorF)
        : NaN;

      // Multicollinearity Risk: 1 if VIF > 10 OR Condition Number > 30, else 0
      const multicollinearityRisk = (maxVifValue > 10 || conditionNumber > 30) ? 1 : 0;

      // Autocorrelation Risk: 1 if DW < 1.5 or DW > 2.5, else 0
      const autocorrelationRisk = (durbinWatsonStat < 1.5 || durbinWatsonStat > 2.5) ? 1 : 0;

      return {
        adjustedRSquared: isNaN(adjustedRSquared) ? 0 : adjustedRSquared,
        fStatModel: isNaN(fStatModel) ? 0 : fStatModel,
        multicollinearityRisk,
        autocorrelationRisk
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};