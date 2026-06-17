// Auto-generated from burnout-calculator-schema.json
import * as z from 'zod';

export interface Burnout_calculatorInput {
  motorRatedPower: number;
  actualLoad: number;
  ambientTemperature: number;
  maxInsulationTemp: number;
  ratedAmbient: number;
  thermalTimeConstant: number;
  dutyCycle: number;
}

export const Burnout_calculatorInputSchema = z.object({
  motorRatedPower: z.number().default(10),
  actualLoad: z.number().default(12),
  ambientTemperature: z.number().default(25),
  maxInsulationTemp: z.number().default(130),
  ratedAmbient: z.number().default(40),
  thermalTimeConstant: z.number().default(30),
  dutyCycle: z.number().default(1),
});

function evaluateAllFormulas(input: Burnout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actualLoad / input.motorRatedPower; results["loadFactor"] = Number.isFinite(v) ? v : 0; } catch { results["loadFactor"] = 0; }
  try { const v = input.maxInsulationTemp - input.ratedAmbient; results["deltaTRated"] = Number.isFinite(v) ? v : 0; } catch { results["deltaTRated"] = 0; }
  try { const v = (results["deltaTRated"] ?? 0) * Math.pow((results["loadFactor"] ?? 0), 2) * input.dutyCycle; results["ultimateTempRise"] = Number.isFinite(v) ? v : 0; } catch { results["ultimateTempRise"] = 0; }
  try { const v = input.ambientTemperature + (results["ultimateTempRise"] ?? 0); results["motorTemperature"] = Number.isFinite(v) ? v : 0; } catch { results["motorTemperature"] = 0; }
  try { const v = input.maxInsulationTemp - (results["motorTemperature"] ?? 0); results["temperatureMargin"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureMargin"] = 0; }
  try { const v = (results["motorTemperature"] ?? 0) > input.maxInsulationTemp ? 0 : ((results["ultimateTempRise"] ?? 0) > (input.maxInsulationTemp - input.ambientTemperature) ? -input.thermalTimeConstant * Math.log(1 - (input.maxInsulationTemp - input.ambientTemperature) / (results["ultimateTempRise"] ?? 0)) : Infinity); results["timeToBurnout"] = Number.isFinite(v) ? v : 0; } catch { results["timeToBurnout"] = 0; }
  try { const v = (results["loadFactor"] ?? 0).toFixed(3); results["loadFactor_toFixed_3_"] = Number.isFinite(v) ? v : 0; } catch { results["loadFactor_toFixed_3_"] = 0; }
  try { const v = (results["ultimateTempRise"] ?? 0).toFixed(1) + ' °C'; results["ultimateTempRise_toFixed_1_______C_"] = Number.isFinite(v) ? v : 0; } catch { results["ultimateTempRise_toFixed_1_______C_"] = 0; }
  try { const v = (results["motorTemperature"] ?? 0).toFixed(1) + ' °C'; results["motorTemperature_toFixed_1_______C_"] = Number.isFinite(v) ? v : 0; } catch { results["motorTemperature_toFixed_1_______C_"] = 0; }
  try { const v = (results["temperatureMargin"] ?? 0).toFixed(1) + ' °C'; results["temperatureMargin_toFixed_1_______C_"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureMargin_toFixed_1_______C_"] = 0; }
  try { const v = (results["timeToBurnout"] ?? 0) === Infinity ? 'Motor Safe' : (results["timeToBurnout"] ?? 0).toFixed(1) + ' minutes'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateBurnout_calculator(input: Burnout_calculatorInput): Burnout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Burnout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
