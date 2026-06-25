import { StandartZamanEtuduVeOrneklemGecerlilikAnalysisCalculator127InputSchema, type StandartZamanEtuduVeOrneklemGecerlilikAnalysisCalculator127Input } from "./standart-zaman-etudu-ve-orneklem-gecerlilik-analysis-calculator-127-validation";

export const calculateStandartZamanEtuduVeOrneklemGecerlilikAnalysisCalculator127Contract: any = {
  id: "standart-zaman-etudu-ve-orneklem-gecerlilik-analysis-calculator-127",
  version: "1.0.0",
  category: "cost",
  inputSchema: StandartZamanEtuduVeOrneklemGecerlilikAnalysisCalculator127InputSchema,
  
  execute: async (input: any) => {
    try {
      const { observedTimes, performanceRating, allowancePfd, zScore, accuracyMargin } = input;

      // Parse observedTimes as an array of numbers
      const observedTimesArray: number[] = Array.isArray(observedTimes) ? observedTimes.map(Number) : [Number(observedTimes)];
      
      // N observations
      const nObservations = observedTimesArray.length;
      
      // Mean Observed Time
      const sumObservedTimes = observedTimesArray.reduce((acc, val) => acc + val, 0);
      const meanObservedTime = nObservations > 0 ? sumObservedTimes / nObservations : 0;
      
      // Standard Deviation (sample standard deviation)
      let stdDev = 0;
      if (nObservations > 1) {
        const squaredDiffs = observedTimesArray.map(time => Math.pow(time - meanObservedTime, 2));
        const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);
        stdDev = Math.sqrt(sumSquaredDiffs / (nObservations - 1));
      }
      
      // Required Sample Size (using formula: n = (z * s / (e * x̄))²)
      const requiredSampleSize = (meanObservedTime !== 0 && stdDev !== 0) 
        ? Math.pow((zScore * stdDev) / (accuracyMargin * meanObservedTime), 2) 
        : 0;
      
      // Normal Time = Mean Observed Time * Performance Rating
      const normalTime = meanObservedTime * performanceRating;
      
      // Standard Time = Normal Time * (1 + Allowance % / 100)
      const standardTime = normalTime * (1 + (allowancePfd / 100));
      
      // Pieces Per Hour = 60 / Standard Time (when standardTime is in minutes)
      const piecesPerHour = standardTime !== 0 ? 60 / standardTime : 0;

      return {
        nObservations,
        meanObservedTime,
        stdDev,
        requiredSampleSize,
        normalTime,
        standardTime,
        piecesPerHour
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};