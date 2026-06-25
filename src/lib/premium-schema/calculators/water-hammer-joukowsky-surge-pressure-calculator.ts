import { SuKocuDarbesiWaterHammerJoukowskySokBasinciCalculator142InputSchema, type SuKocuDarbesiWaterHammerJoukowskySokBasinciCalculator142Input } from "./su-kocu-darbesi-water-hammer-joukowsky-sok-basinci-calculator-142-validation";

export const calculateSuKocuDarbesiWaterHammerJoukowskySokBasinciCalculator142Contract: any = {
  id: "su-kocu-darbesi-water-hammer-joukowsky-sok-basinci-calculator-142",
  version: "1.0.0",
  category: "cost",
  inputSchema: SuKocuDarbesiWaterHammerJoukowskySokBasinciCalculator142InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        fluidDensity,
        bulkModulusK,
        pipeE,
        pipeDiaD,
        pipeThicknessT,
        fluidVelocityV,
        pipeLengthL,
        valveCloseTimeTc,
        staticPressure
      } = input;

      // Wave Celerity a = sqrt((K / ρ) / (1 + (K * D) / (E * t)))
      const waveCelerityA = Math.sqrt(
        (bulkModulusK / fluidDensity) / 
        (1 + (bulkModulusK * pipeDiaD / 1000) / (pipeE * pipeThicknessT / 1000))
      );

      // Critical Time tc_crit = (2 * L) / a
      const criticalTimeTcCrit = (2 * pipeLengthL) / waveCelerityA;

      // Closure Type: 1 for Sudden, 2 for Gradual (numeric representation)
      const closureType = valveCloseTimeTc <= criticalTimeTcCrit ? 1 : 2;

      // Delta P Joukowsky Pa = ρ * a * V
      const deltaPJoukowskyPa = fluidDensity * waveCelerityA * fluidVelocityV;

      // Delta P Gradual Pa = ΔP_Joukowsky * (tc_crit / tc)
      const deltaPGradualPa = deltaPJoukowskyPa * (criticalTimeTcCrit / valveCloseTimeTc);

      // Actual Surge Pressure Pa = Sudden or Gradual based on closure type
      const actualSurgePressurePa = closureType === 1 ? deltaPJoukowskyPa : deltaPGradualPa;

      // Surge Pressure Bar = Pa / 100000
      const surgePressureBar = actualSurgePressurePa / 100000;

      // Total Max Pressure Bar = static_pressure + surge_pressure
      const totalMaxPressureBar = staticPressure + surgePressureBar;

      return {
        waveCelerityA: Math.round(waveCelerityA * 100) / 100,
        criticalTimeTcCrit: Math.round(criticalTimeTcCrit * 100) / 100,
        closureType,
        deltaPJoukowskyPa: Math.round(deltaPJoukowskyPa * 100) / 100,
        deltaPGradualPa: Math.round(deltaPGradualPa * 100) / 100,
        actualSurgePressurePa: Math.round(actualSurgePressurePa * 100) / 100,
        surgePressureBar: Math.round(surgePressureBar * 100) / 100,
        totalMaxPressureBar: Math.round(totalMaxPressureBar * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};