import { PlastikEnjeksiyonKapamaKuvvetiClampingForceVeSogumaDurationCalculator150InputSchema, type PlastikEnjeksiyonKapamaKuvvetiClampingForceVeSogumaDurationCalculator150Input } from "./plastik-enjeksiyon-kapama-kuvveti-clamping-force-ve-soguma-duration-calculator-150-validation";

export const calculatePlastikEnjeksiyonKapamaKuvvetiClampingForceVeSogumaDurationCalculator150Contract: any = {
  id: "plastik-enjeksiyon-kapama-kuvveti-clamping-force-ve-soguma-duration-calculator-150",
  version: "1.0.0",
  category: "cost",
  inputSchema: PlastikEnjeksiyonKapamaKuvvetiClampingForceVeSogumaDurationCalculator150InputSchema,
  
  execute: async (input: any) => {
    try {
      // Extract input values
      const projectedArea = input.projectedArea as number;
      const cavityPressure = input.cavityPressure as number;
      const wallThickness = input.wallThickness as number;
      const meltTemp = input.meltTemp as number;
      const moldTemp = input.moldTemp as number;
      const ejectionTemp = input.ejectionTemp as number;
      const thermalDiffusivity = input.thermalDiffusivity as number;
      const machineClampLimit = input.machineClampLimit as number;

      // Validate inputs are positive numbers
      if (projectedArea <= 0 || cavityPressure <= 0 || wallThickness <= 0 || 
          meltTemp <= 0 || moldTemp <= 0 || ejectionTemp <= 0 || 
          thermalDiffusivity <= 0 || machineClampLimit <= 0) {
        throw new Error("All input values must be positive numbers");
      }

      // Ensure ejection temp is between mold temp and melt temp
      if (ejectionTemp <= moldTemp || ejectionTemp >= meltTemp) {
        throw new Error("Ejection temperature must be between mold temperature and melt temperature");
      }

      // Formula: Clamping_Force_N = (projected_area / 10000) * (cavity_pressure * 100000)
      // projected_area in cm2, convert to m2 by dividing by 10000
      // cavity_pressure in Bar, convert to Pa (1 Bar = 100000 Pa)
      const clampingForceN = (projectedArea / 10000) * (cavityPressure * 100000);

      // Formula: Clamping_Force_Ton = Clamping_Force_N / 9810
      const clampingForceTon = clampingForceN / 9810;

      // Formula: Required_Machine_Ton = Clamping_Force_Ton * 1.20 (safety factor of 20%)
      const requiredMachineTon = clampingForceTon * 1.20;

      // Formula: Cooling_Time_sec = (POWER(wall_thickness, 2) / (PI * PI * thermal_diffusivity)) * LOG((4 / PI) * ((melt_temp - mold_temp) / (ejection_temp - mold_temp)))
      // wall_thickness in mm, thermal_diffusivity in mm2/s
      const coolingTimeSec = (Math.pow(wallThickness, 2) / (Math.PI * Math.PI * thermalDiffusivity)) * 
        Math.log((4 / Math.PI) * ((meltTemp - moldTemp) / (ejectionTemp - moldTemp)));

      // Formula: Capacity_Utilization_Pct = (Required_Machine_Ton / machine_clamp_limit) * 100
      const capacityUtilizationPct = (requiredMachineTon / machineClampLimit) * 100;

      // Validate cooling time is positive (logarithm argument must be > 1)
      if (coolingTimeSec <= 0 || !isFinite(coolingTimeSec)) {
        throw new Error("Invalid cooling time calculation - check temperature values");
      }

      return {
        clampingForceN: Math.round(clampingForceN * 100) / 100,
        clampingForceTon: Math.round(clampingForceTon * 100) / 100,
        requiredMachineTon: Math.round(requiredMachineTon * 100) / 100,
        coolingTimeSec: Math.round(coolingTimeSec * 100) / 100,
        capacityUtilizationPct: Math.round(capacityUtilizationPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};