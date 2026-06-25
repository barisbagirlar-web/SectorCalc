import { PnomatikSilindirHavaTuketimiIso4414Calculator115InputSchema, type PnomatikSilindirHavaTuketimiIso4414Calculator115Input } from "./pnomatik-silindir-hava-tuketimi-iso-4414-calculator-115-validation";

export const calculatePnomatikSilindirHavaTuketimiIso4414Calculator115Contract: any = {
  id: "pnomatik-silindir-hava-tuketimi-iso-4414-calculator-115",
  version: "1.0.0",
  category: "cost",
  inputSchema: PnomatikSilindirHavaTuketimiIso4414Calculator115InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse input values
      const boreDia = Number(input.boreDia);
      const stroke = Number(input.stroke);
      const cyclesPerMin = Number(input.cyclesPerMin);
      const workingPressure = Number(input.workingPressure);
      const deadVolumePct = Number(input.deadVolumePct);
      const specificPower = Number(input.specificPower);
      const elecRate = Number(input.elecRate);
      const annualHours = Number(input.annualHours);

      // Validate inputs to prevent NaN issues
      if (isNaN(boreDia) || isNaN(stroke) || isNaN(cyclesPerMin) || isNaN(workingPressure) || 
          isNaN(deadVolumePct) || isNaN(specificPower) || isNaN(elecRate) || isNaN(annualHours)) {
        throw new Error("Invalid input: all values must be valid numbers");
      }

      if (boreDia <= 0 || stroke <= 0 || cyclesPerMin <= 0 || workingPressure < 0) {
        throw new Error("Invalid input: boreDia, stroke, and cyclesPerMin must be positive; workingPressure must be non-negative");
      }

      // Formula: Area_cm2 = (PI / 4) * POWER(bore_dia / 10, 2)
      const boreDiaCm = boreDia / 10; // Convert mm to cm
      const areaCm2 = (Math.PI / 4) * Math.pow(boreDiaCm, 2);

      // Formula: Vol_Per_Stroke_Liters = Area_cm2 * (stroke / 10) / 1000
      const strokeCm = stroke / 10; // Convert mm to cm
      const volPerStrokeLiters = (areaCm2 * strokeCm) / 1000;

      // Formula: Compression_Ratio = (working_pressure + 1.013) / 1.013
      const compressionRatio = (workingPressure + 1.013) / 1.013;

      // Formula: Free_Air_Per_Cycle_Liters = (Vol_Per_Stroke_Liters * 2) * Compression_Ratio * (1 + (dead_volume_pct / 100))
      // * 2 accounts for both extension and retraction strokes in one cycle
      const freeAirPerCycleLiters = (volPerStrokeLiters * 2) * compressionRatio * (1 + (deadVolumePct / 100));

      // Formula: Air_Consumption_m3_min = (Free_Air_Per_Cycle_Liters * cycles_per_min) / 1000
      const airConsumptionM3Min = (freeAirPerCycleLiters * cyclesPerMin) / 1000;

      // Formula: Power_Required_kW = Air_Consumption_m3_min * specific_power
      const powerRequiredKW = airConsumptionM3Min * specificPower;

      // Formula: Annual_Energy_Cost = Power_Required_kW * annual_hours * elec_rate
      const annualEnergyCost = powerRequiredKW * annualHours * elecRate;

      return {
        areaCm2: Math.round(areaCm2 * 100) / 100, // Round to 2 decimal places
        volPerStrokeLiters: Math.round(volPerStrokeLiters * 100000) / 100000, // Round to 5 decimal places
        compressionRatio: Math.round(compressionRatio * 100) / 100, // Round to 2 decimal places
        freeAirPerCycleLiters: Math.round(freeAirPerCycleLiters * 1000) / 1000, // Round to 3 decimal places
        airConsumptionM3Min: Math.round(airConsumptionM3Min * 1000) / 1000, // Round to 3 decimal places
        powerRequiredKW: Math.round(powerRequiredKW * 1000) / 1000, // Round to 3 decimal places
        annualEnergyCost: Math.round(annualEnergyCost * 100) / 100 // Round to 2 decimal places
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};