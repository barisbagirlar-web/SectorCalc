import { IstatistikselProsesKontrolSpcXbarrSinirlariCalculator61InputSchema, type IstatistikselProsesKontrolSpcXbarrSinirlariCalculator61Input } from "./istatistiksel-proses-kontrol-spc-xbarr-sinirlari-calculator-61-validation";

export const calculateIstatistikselProsesKontrolSpcXbarrSinirlariCalculator61Contract: any = {
  id: "istatistiksel-proses-kontrol-spc-xbarr-sinirlari-calculator-61",
  version: "1.0.0",
  category: "cost",
  inputSchema: IstatistikselProsesKontrolSpcXbarrSinirlariCalculator61InputSchema,
  
  execute: async (input: any) => {
    try {
      // Validate input against schema if needed
      const validatedInput = IstatistikselProsesKontrolSpcXbarrSinirlariCalculator61InputSchema.parse(input);
      
      const {
        meanOfMeans,
        meanOfRanges,
        a2Factor,
        d3Factor,
        d4Factor,
        d2Factor,
        usl,
        lsl
      } = validatedInput;

      // X-Bar Chart Control Limits
      const uCLX = meanOfMeans + (a2Factor * meanOfRanges);
      const lCLX = meanOfMeans - (a2Factor * meanOfRanges);

      // R Chart Control Limits
      const uCLR = d4Factor * meanOfRanges;
      const lCLR = Math.max(0, d3Factor * meanOfRanges);

      // Process Sigma Estimation
      const estimatedSigma = meanOfRanges / d2Factor;

      // Process Capability Indices
      const sixSigma = 6 * estimatedSigma;
      const cp = (usl - lsl) / sixSigma;

      const threeSigma = 3 * estimatedSigma;
      const cpkupper = (usl - meanOfMeans) / threeSigma;
      const cpklower = (meanOfMeans - lsl) / threeSigma;
      const cpk = Math.min(cpkupper, cpklower);

      return {
        uCLX,
        lCLX,
        uCLR,
        lCLR,
        estimatedSigma,
        cp,
        cpk
      };
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation failed: ${error.message}`);
      }
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};