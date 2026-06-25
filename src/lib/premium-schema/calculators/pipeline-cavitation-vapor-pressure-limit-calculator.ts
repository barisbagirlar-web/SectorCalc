import { BoruHatlarindaKavitasyonVeBuharlasmaBasinciSinirAnalysisCalculator161InputSchema, type BoruHatlarindaKavitasyonVeBuharlasmaBasinciSinirAnalysisCalculator161Input } from "./boru-hatlarinda-kavitasyon-ve-buharlasma-basinci-sinir-analysis-calculator-161-validation";

export const calculateBoruHatlarindaKavitasyonVeBuharlasmaBasinciSinirAnalysisCalculator161Contract: any = {
  id: "boru-hatlarinda-kavitasyon-ve-buharlasma-basinci-sinir-analysis-calculator-161",
  version: "1.0.0",
  category: "cost",
  inputSchema: BoruHatlarindaKavitasyonVeBuharlasmaBasinciSinirAnalysisCalculator161InputSchema,
  
  execute: async (input: any) => {
    try {
      const staticPressureBar = input.staticPressureBar;
      const fluidVelocityMS = input.fluidVelocityMS;
      const fluidTempC = input.fluidTempC;
      const densityKgM3 = input.densityKgM3;
      const vaporPressureBar = input.vaporPressureBar;

      // Convert pressure from bar to pascal (1 bar = 100,000 Pa)
      const pStaticPa = staticPressureBar * 100000;
      const pVaporPa = vaporPressureBar * 100000;

      // Dynamic pressure calculation: 0.5 * density * velocity^2
      const dynamicPressurePa = 0.5 * densityKgM3 * Math.pow(fluidVelocityMS, 2);

      // Total pressure is static + dynamic
      const totalPressurePa = pStaticPa + dynamicPressurePa;

      // Cavitation index (sigma) = (Static Pressure - Vapor Pressure) / Dynamic Pressure
      const cavitationIndexSigma = (pStaticPa - pVaporPa) / dynamicPressurePa;

      // Minimum allowed pressure drop in bar = (Static Pressure - Vapor Pressure) in Pa converted to bar
      const minPressureDropAllowedBar = (pStaticPa - pVaporPa) / 100000;

      return {
        pStaticPa,
        pVaporPa,
        dynamicPressurePa,
        totalPressurePa,
        cavitationIndexSigma,
        minPressureDropAllowedBar
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};