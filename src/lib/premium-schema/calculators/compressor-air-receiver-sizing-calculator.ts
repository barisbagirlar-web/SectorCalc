import { KompresorHavaTankiReceiverBoyutlandirmaCalculator71InputSchema, type KompresorHavaTankiReceiverBoyutlandirmaCalculator71Input } from "./kompresor-hava-tanki-receiver-boyutlandirma-calculator-71-validation";

export const calculateKompresorHavaTankiReceiverBoyutlandirmaCalculator71Contract: any = {
  id: "kompresor-hava-tanki-receiver-boyutlandirma-calculator-71",
  version: "1.0.0",
  category: "cost",
  inputSchema: KompresorHavaTankiReceiverBoyutlandirmaCalculator71InputSchema,
  
  execute: async (input: any) => {
    try {
      // Extract input values
      const compressorFlow = input.compressorFlow;
      const pMax = input.pMax;
      const pMin = input.pMin;
      const maxMotorStarts = input.maxMotorStarts;
      const surgeDemand = input.surgeDemand;
      const surgeDuration = input.surgeDuration;

      // Validate inputs to avoid division by zero or negative values
      const validatedPmax = pMax > 0 ? pMax : 0.001;
      const validatedPmin = pMin >= 0 ? pMin : 0;
      const pressureDifference = validatedPmax - validatedPmin;
      const validatedPressureDiff = pressureDifference > 0 ? pressureDifference : 0.001;
      
      const validatedCompressorFlow = compressorFlow > 0 ? compressorFlow : 0.001;
      const validatedMaxMotorStarts = maxMotorStarts > 0 ? maxMotorStarts : 1;
      const validatedSurgeDemand = surgeDemand > 0 ? surgeDemand : 0;
      const validatedSurgeDuration = surgeDuration > 0 ? surgeDuration : 0;

      // Standard atmospheric pressure factor (1.01325 bar) to convert to free air delivery
      const atmosphericPressure = 1.01325;

      // Formula: V_starts_Liters = (compressor_flow * 1.01325) / (4 * max_motor_starts * (p_max - p_min)) * 60
      const vStartsLiters = (validatedCompressorFlow * atmosphericPressure) / (4 * validatedMaxMotorStarts * validatedPressureDiff) * 60;

      // Formula: V_surge_Liters = ((surge_demand - compressor_flow) * surge_duration * 1.01325) / (p_max - p_min)
      const vSurgeLiters = Math.max(0, ((validatedSurgeDemand - validatedCompressorFlow) * validatedSurgeDuration * atmosphericPressure) / validatedPressureDiff);

      // Formula: Required_Tank_Volume = MAX(V_starts_Liters, V_surge_Liters)
      const requiredTankVolume = Math.max(vStartsLiters, vSurgeLiters);

      // Formula: Cycle_Time_Mins = (Required_Tank_Volume * (p_max - p_min)) / (compressor_flow * 1.01325)
      const cycleTimeMins = requiredTankVolume > 0 ? (requiredTankVolume * validatedPressureDiff) / (validatedCompressorFlow * atmosphericPressure) : 0;

      // Formula: Actual_Motor_Starts_Per_Hr = 60 / Cycle_Time_Mins
      const actualMotorStartsPerHr = cycleTimeMins > 0 ? 60 / cycleTimeMins : 0;

      // Return calculated values with proper rounding for practical engineering use
      return {
        vStartsLiters: Math.round(vStartsLiters * 100) / 100,
        vSurgeLiters: Math.round(vSurgeLiters * 100) / 100,
        requiredTankVolume: Math.round(requiredTankVolume * 100) / 100,
        cycleTimeMins: Math.round(cycleTimeMins * 100) / 100,
        actualMotorStartsPerHr: Math.round(actualMotorStartsPerHr * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};