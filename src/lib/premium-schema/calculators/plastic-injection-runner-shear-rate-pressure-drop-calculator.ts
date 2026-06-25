import { PlastikEnjeksiyonYollukKesmeHiziShearRateVeBasincDusumuCalculator183InputSchema, type PlastikEnjeksiyonYollukKesmeHiziShearRateVeBasincDusumuCalculator183Input } from "./plastik-enjeksiyon-yolluk-kesme-hizi-shear-rate-ve-basinc-dusumu-calculator-183-validation";

export const calculatePlastikEnjeksiyonYollukKesmeHiziShearRateVeBasincDusumuCalculator183Contract: any = {
  id: "plastik-enjeksiyon-yolluk-kesme-hizi-shear-rate-ve-basinc-dusumu-calculator-183",
  version: "1.0.0",
  category: "cost",
  inputSchema: PlastikEnjeksiyonYollukKesmeHiziShearRateVeBasincDusumuCalculator183InputSchema,
  
  execute: async (input: any) => {
    try {
      const runnerDiameterMm = input.runnerDiameterMm;
      const flowRateCm3S = input.flowRateCm3S;
      const meltViscosityPas = input.meltViscosityPas;
      const runnerLengthMm = input.runnerLengthMm;

      // Calculate radius in meters: R_m = (runner_diameter_mm / 2) / 1000
      const rM = (runnerDiameterMm / 2) / 1000;

      // Convert flow rate to m³/s: Q_m3_s = flow_rate_cm3_s / 1000000
      const qM3S = flowRateCm3S / 1000000;

      // Calculate shear rate: Shear_Rate_1_s = (4 * Q_m3_s) / (PI * R_m^3)
      const shearRate1S = (4 * qM3S) / (Math.PI * Math.pow(rM, 3));

      // Convert length to meters: L_m = runner_length_mm / 1000
      const lM = runnerLengthMm / 1000;

      // Calculate pressure drop in Pascals: Pressure_Drop_Pa = (8 * melt_viscosity_pas * L_m * Q_m3_s) / (PI * R_m^4)
      const pressureDropPa = (8 * meltViscosityPas * lM * qM3S) / (Math.PI * Math.pow(rM, 4));

      // Convert to Bar: Pressure_Drop_Bar = Pressure_Drop_Pa / 100000
      const pressureDropBar = pressureDropPa / 100000;

      return {
        rM,
        qM3S,
        shearRate1S,
        lM,
        pressureDropPa,
        pressureDropBar
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};