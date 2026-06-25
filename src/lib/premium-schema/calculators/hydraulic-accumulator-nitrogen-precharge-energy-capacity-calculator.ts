import { HidrolikAkumulatorAzotOnDolumVeEnerjiKapasitesiCalculator170InputSchema, type HidrolikAkumulatorAzotOnDolumVeEnerjiKapasitesiCalculator170Input } from "./hidrolik-akumulator-azot-on-dolum-ve-enerji-kapasitesi-calculator-170-validation";

export const calculateHidrolikAkumulatorAzotOnDolumVeEnerjiKapasitesiCalculator170Contract: any = {
  id: "hidrolik-akumulator-azot-on-dolum-ve-enerji-kapasitesi-calculator-170",
  version: "1.0.0",
  category: "cost",
  inputSchema: HidrolikAkumulatorAzotOnDolumVeEnerjiKapasitesiCalculator170InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        maxSysPressure,
        minSysPressure,
        gasPrechargeP0,
        requiredStoredVol,
        polytropicExponent
      } = input;

      if (maxSysPressure <= 0 || minSysPressure <= 0 || gasPrechargeP0 <= 0 || requiredStoredVol <= 0 || polytropicExponent <= 0) {
        throw new Error("All input values must be greater than zero.");
      }

      if (gasPrechargeP0 >= minSysPressure) {
        throw new Error("Azot ön dolum basıncı (P0), sistem minimum çalışma basıncından (P1) küçük olmalıdır.");
      }

      if (minSysPressure >= maxSysPressure) {
        throw new Error("Sistem minimum çalışma basıncı (P1), maksimum çalışma basıncından (P2) küçük olmalıdır.");
      }

      // Convert gauge pressures to absolute pressures (adding 1.013 bar for atmospheric pressure)
      const p0Abs = gasPrechargeP0 + 1.013;
      const p1Abs = minSysPressure + 1.013;
      const p2Abs = maxSysPressure + 1.013;

      const n = polytropicExponent;

      // Calculate accumulator size V0 (gas volume at precharge pressure)
      const p0OverP1 = p0Abs / p1Abs;
      const p0OverP2 = p0Abs / p2Abs;
      
      const p0OverP1Term = Math.pow(p0OverP1, 1 / n);
      const p0OverP2Term = Math.pow(p0OverP2, 1 / n);
      
      const accumulatorSizeV0 = requiredStoredVol / (p0OverP1Term - p0OverP2Term);

      // Calculate gas volumes at min and max system pressures
      const v1GasVol = accumulatorSizeV0 * p0OverP1Term;
      const v2GasVol = accumulatorSizeV0 * p0OverP2Term;

      // Calculate kinetic energy stored in Joules
      const p1InHectopascals = p1Abs * 100; // Convert bar to hPa (1 bar = 100 hPa)
      const v1InCubicMeters = v1GasVol / 1000; // Convert liters to cubic meters
      
      const pressureTerm = (p1InHectopascals * v1InCubicMeters) / (n - 1);
      const polytropicRatio = (n - 1) / n;
      const pressureRatioTerm = 1 - Math.pow(p2Abs / p1Abs, polytropicRatio);
      
      const kineticEnergyStoredJ = pressureTerm * pressureRatioTerm * 100; // Convert from hPa*m³ to Joules (1 hPa*m³ = 100 J)

      return {
        p0Abs,
        p1Abs,
        p2Abs,
        accumulatorSizeV0,
        v1GasVol,
        v2GasVol,
        kineticEnergyStoredJ
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};