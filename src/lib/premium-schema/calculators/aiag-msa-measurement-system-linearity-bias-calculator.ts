import { AiagMsaOlcumSistemiDogrusallikLinearityVeYanlilikAnalysisCalculator181InputSchema, type AiagMsaOlcumSistemiDogrusallikLinearityVeYanlilikAnalysisCalculator181Input } from "./aiag-msa-olcum-sistemi-dogrusallik-linearity-ve-yanlilik-analysis-calculator-181-validation";

export const calculateAiagMsaOlcumSistemiDogrusallikLinearityVeYanlilikAnalysisCalculator181Contract: any = {
  id: "aiag-msa-olcum-sistemi-dogrusallik-linearity-ve-yanlilik-analysis-calculator-181",
  version: "1.0.0",
  category: "cost",
  inputSchema: AiagMsaOlcumSistemiDogrusallikLinearityVeYanlilikAnalysisCalculator181InputSchema,
  
  execute: async (input: any) => {
    try {
      const { 
        referenceValues, 
        observedMeans, 
        stdDevRepeatability, 
        toleranceBand 
      } = input;

      // Validate and parse inputs
      const refArr = typeof referenceValues === 'string' ? JSON.parse(referenceValues) : referenceValues;
      const obsArr = typeof observedMeans === 'string' ? JSON.parse(observedMeans) : observedMeans;
      const rptStdDev = Number(stdDevRepeatability) || 0;
      const tolBand = Number(toleranceBand) || 0;

      if (!Array.isArray(refArr) || !Array.isArray(obsArr) || refArr.length !== obsArr.length || refArr.length === 0) {
        throw new Error("Invalid input arrays: referenceValues and observedMeans must be arrays of equal length");
      }

      if (tolBand <= 0) {
        throw new Error("Tolerance band must be greater than zero");
      }

      const n = refArr.length;

      // Step 1: Calculate Bias Array
      const biasArray = obsArr.map((obs: number, i: number) => Number(obs) - Number(refArr[i]));

      // Step 2: Calculate Linear Regression (SLOPE and INTERCEPT) for Bias vs Reference Values
      // Using least squares method
      const meanX = refArr.reduce((sum: number, val: number) => sum + Number(val), 0) / n;
      const meanY = biasArray.reduce((sum: number, val: number) => sum + Number(val), 0) / n;

      let numerator = 0;
      let denominator = 0;
      for (let i = 0; i < n; i++) {
        const x = Number(refArr[i]);
        const y = Number(biasArray[i]);
        numerator += (x - meanX) * (y - meanY);
        denominator += (x - meanX) * (x - meanX);
      }

      const linearitySlope = denominator !== 0 ? numerator / denominator : 0;
      const linearityIntercept = meanY - linearitySlope * meanX;

      // Step 3: Calculate Linearity Value
      const linearityValue = Math.abs(linearitySlope) * tolBand;

      // Step 4: Calculate Percent Linearity
      const pctLinearity = tolBand !== 0 ? (linearityValue / tolBand) * 100 : 0;

      // Step 5: Calculate Max Bias
      const maxBias = Math.max(...biasArray.map((bias: number) => Math.abs(Number(bias))));

      // Step 6: Calculate Percent Bias
      const pctBias = tolBand !== 0 ? (maxBias / tolBand) * 100 : 0;

      return {
        biasArray,
        linearitySlope,
        linearityIntercept,
        linearityValue,
        pctLinearity,
        maxBias,
        pctBias
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};