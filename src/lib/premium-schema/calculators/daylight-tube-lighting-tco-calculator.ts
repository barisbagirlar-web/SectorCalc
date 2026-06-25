import { GunesTupuDaylightTubeAydinlatmaVeTcoCalculator51InputSchema } from "./gunes-tupu-daylight-tube-aydinlatma-ve-tco-calculator-51-validation";

export const calculateGunesTupuDaylightTubeAydinlatmaVeTcoCalculator51Contract: any = {
  id: "gunes-tupu-daylight-tube-aydinlatma-ve-tco-calculator-51",
  version: "1.0.0",
  category: "cost",
  inputSchema: GunesTupuDaylightTubeAydinlatmaVeTcoCalculator51InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        roomArea,
        targetLux,
        tubeOutputLm,
        tunnelLen,
        roofPitch,
        currentLightingKw,
        daylightHours,
        elecRate,
        installedCostPerTube
      } = input;

      // Formula: Pitch_Rad = (roof_pitch * PI) / 180
      const pitchRad = (roofPitch * Math.PI) / 180;

      // Formula: Tunnel_Efficiency = POWER(0.99, tunnel_len * 10)
      const tunnelEfficiency = Math.pow(0.99, tunnelLen * 10);

      // Formula: Actual_Lumen_Per_Tube = tube_output_lm * COS(Pitch_Rad) * Tunnel_Efficiency
      const actualLumenPerTube = tubeOutputLm * Math.cos(pitchRad) * tunnelEfficiency;

      // Formula: Required_Total_Lumen = room_area * target_lux
      const requiredTotalLumen = roomArea * targetLux;

      // Formula: Required_Tubes = CEILING(Required_Total_Lumen / Actual_Lumen_Per_Tube)
      const requiredTubes = Math.ceil(requiredTotalLumen / actualLumenPerTube);

      // Formula: Annual_Savings_kWh = current_lighting_kw * daylight_hours * 365
      const annualSavingsKWh = currentLightingKw * daylightHours * 365;

      // Formula: Annual_Savings_USD = Annual_Savings_kWh * elec_rate
      const annualSavingsUSD = annualSavingsKWh * elecRate;

      // Formula: Total_Investment = Required_Tubes * installed_cost_per_tube
      const totalInvestment = requiredTubes * installedCostPerTube;

      // Formula: Payback_Years = Total_Investment / Annual_Savings_USD
      const paybackYears = annualSavingsUSD > 0 ? totalInvestment / annualSavingsUSD : 0;

      // Formula: CO2_Reduction_Ton = (Annual_Savings_kWh * 0.5) / 1000
      const cO2ReductionTon = (annualSavingsKWh * 0.5) / 1000;

      return {
        pitchRad,
        tunnelEfficiency,
        actualLumenPerTube,
        requiredTotalLumen,
        requiredTubes,
        annualSavingsKWh,
        annualSavingsUSD,
        totalInvestment,
        paybackYears,
        cO2ReductionTon
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};