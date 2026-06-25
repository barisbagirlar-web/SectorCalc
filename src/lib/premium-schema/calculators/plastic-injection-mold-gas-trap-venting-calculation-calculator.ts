import { PlastikEnjeksiyonKalipIciGazSikismasiVeHavandirmaVentingHesabiCalculator159InputSchema, type PlastikEnjeksiyonKalipIciGazSikismasiVeHavandirmaVentingHesabiCalculator159Input } from "./plastik-enjeksiyon-kalip-ici-gaz-sikismasi-ve-havandirma-venting-hesabi-calculator-159-validation";

export const calculatePlastikEnjeksiyonKalipIciGazSikismasiVeHavandirmaVentingHesabiCalculator159Contract: any = {
  id: "plastik-enjeksiyon-kalip-ici-gaz-sikismasi-ve-havandirma-venting-hesabi-calculator-159",
  version: "1.0.0",
  category: "cost",
  inputSchema: PlastikEnjeksiyonKalipIciGazSikismasiVeHavandirmaVentingHesabiCalculator159InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse input values
      const cavityVolumeCm3 = Number(input.cavityVolumeCm3);
      const injectionTimeSec = Number(input.injectionTimeSec);
      const meltTempK = Number(input.meltTempK);
      const ventDepthUm = Number(input.ventDepthUm);
      const ventWidthMm = Number(input.ventWidthMm);
      const polymerType = Number(input.polymerType);

      // Validate inputs
      if (cavityVolumeCm3 <= 0 || injectionTimeSec <= 0 || meltTempK <= 0 || 
          ventDepthUm <= 0 || ventWidthMm <= 0) {
        throw new Error("All input values must be positive numbers");
      }

      // Formula: Air_Flow_Rate_cm3_s = cavity_volume_cm3 / injection_time_sec
      const airFlowRateCm3S = cavityVolumeCm3 / injectionTimeSec;

      // Formula: Vent_Area_mm2 = (vent_depth_um / 1000) * vent_width_mm
      const ventAreaMm2 = (ventDepthUm / 1000) * ventWidthMm;

      // Formula: Gas_Velocity_m_s = (Air_Flow_Rate_cm3_s * 100) / (Vent_Area_mm2 * 1000)
      const gasVelocityMS = ventAreaMm2 > 0 ? (airFlowRateCm3S * 100) / (ventAreaMm2 * 1000) : 0;

      // Formula: Gas_Density = 1.29 * (melt_temp_k / 273.15)
      const gasDensity = 1.29 * (meltTempK / 273.15);

      // Formula: Dynamic_Pressure_Drop_Bar = (0.5 * Gas_Density * POWER(Gas_Velocity_m_s, 2)) / 100000
      const dynamicPressureDropBar = (0.5 * gasDensity * Math.pow(gasVelocityMS, 2)) / 100000;

      // Formula: Vent_Limit_Um = IF(polymer_type == 'PP/PE (Max 20um)', 20, IF(polymer_type == 'ABS/PS (Max 40um)', 40, 50))
      let ventLimitUm: number;
      if (polymerType <= 20) {
        ventLimitUm = 20; // PP/PE
      } else if (polymerType <= 40) {
        ventLimitUm = 40; // ABS/PS
      } else {
        ventLimitUm = 50; // Other polymers
      }

      // Round results for practical use
      return {
        airFlowRateCm3S: Math.round(airFlowRateCm3S * 100) / 100,
        ventAreaMm2: Math.round(ventAreaMm2 * 1000) / 1000,
        gasVelocityMS: Math.round(gasVelocityMS * 100) / 100,
        gasDensity: Math.round(gasDensity * 1000) / 1000,
        dynamicPressureDropBar: Math.round(dynamicPressureDropBar * 10000) / 10000,
        ventLimitUm: ventLimitUm
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};