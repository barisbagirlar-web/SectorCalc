import { HeliselBaskiYayiYorulmaGoodmanVeRezonansAnalysisCalculator129InputSchema, type HeliselBaskiYayiYorulmaGoodmanVeRezonansAnalysisCalculator129Input } from "./helisel-baski-yayi-yorulma-goodman-ve-rezonans-analysis-calculator-129-validation";

export const calculateHeliselBaskiYayiYorulmaGoodmanVeRezonansAnalysisCalculator129Contract: any = {
  id: "helisel-baski-yayi-yorulma-goodman-ve-rezonans-analysis-calculator-129",
  version: "1.0.0",
  category: "cost",
  inputSchema: HeliselBaskiYayiYorulmaGoodmanVeRezonansAnalysisCalculator129InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        wireDiaD,
        coilDiaD,
        activeCoilsN,
        fMax,
        fMin,
        shearModulusG,
        density,
        utsShear,
        fatigueLimit,
        safetyFactor,
        opFreqHz
      } = input;

      // Validate required inputs
      if (!wireDiaD || !coilDiaD || !activeCoilsN || !fMax || !fMin || !shearModulusG || !density || !utsShear || !fatigueLimit || !safetyFactor || !opFreqHz) {
        throw new Error("All input fields are required");
      }

      // Spring Index C = coil_dia_D / wire_dia_d
      const springIndexC = coilDiaD / wireDiaD;

      // Wahl Factor K = ((4 * C - 1) / (4 * C - 4)) + (0.615 / C)
      const wahlFactorK = ((4 * springIndexC - 1) / (4 * springIndexC - 4)) + (0.615 / springIndexC);

      // Tau Max = (8 * F_max * D * K) / (PI * d^3)
      const tauMax = (8 * fMax * coilDiaD * wahlFactorK) / (Math.PI * Math.pow(wireDiaD, 3));

      // Tau Min = (8 * F_min * D * K) / (PI * d^3)
      const tauMin = (8 * fMin * coilDiaD * wahlFactorK) / (Math.PI * Math.pow(wireDiaD, 3));

      // Tau Mean = (Tau_Max + Tau_Min) / 2
      const tauMean = (tauMax + tauMin) / 2;

      // Tau Amp = (Tau_Max - Tau_Min) / 2
      const tauAmp = (tauMax - tauMin) / 2;

      // Goodman Ratio = (Tau_Amp / Fatigue_Limit) + (Tau_Mean / UTS_Shear)
      const goodmanRatio = (tauAmp / fatigueLimit) + (tauMean / utsShear);

      // Actual Safety Factor = 1 / Goodman Ratio
      const actualSafetyFactor = 1 / goodmanRatio;

      // Spring Rate k = (G * d^4) / (8 * D^3 * N)
      const springRateK = (shearModulusG * Math.pow(wireDiaD, 4)) / (8 * Math.pow(coilDiaD, 3) * activeCoilsN);

      // Surge Frequency Hz = (d / (PI * D^2 * N)) * SQRT((G * 10^6) / (2 * density))
      // Note: shearModulusG is in MPa, convert to Pa (N/m^2) by multiplying by 10^6
      const surgeFreqHz = (wireDiaD / (Math.PI * Math.pow(coilDiaD, 2) * activeCoilsN)) * 
        Math.sqrt((shearModulusG * 1000000) / (2 * density));

      return {
        springIndexC: Math.round(springIndexC * 100) / 100,
        wahlFactorK: Math.round(wahlFactorK * 100) / 100,
        tauMax: Math.round(tauMax * 100) / 100,
        tauMin: Math.round(tauMin * 100) / 100,
        tauMean: Math.round(tauMean * 100) / 100,
        tauAmp: Math.round(tauAmp * 100) / 100,
        goodmanRatio: Math.round(goodmanRatio * 100) / 100,
        actualSafetyFactor: Math.round(actualSafetyFactor * 100) / 100,
        springRateK: Math.round(springRateK * 100) / 100,
        surgeFreqHz: Math.round(surgeFreqHz * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};