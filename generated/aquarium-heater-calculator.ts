// Auto-generated from aquarium-heater-calculator-schema.json
import * as z from 'zod';

export interface Aquarium_heater_calculatorInput {
  volume: number;
  targetTemp: number;
  roomTemp: number;
  heatingTime: number;
  efficiency: number;
  safetyMargin: number;
  dataConfidence?: number;
}

export const Aquarium_heater_calculatorInputSchema = z.object({
  volume: z.number().default(100),
  targetTemp: z.number().default(26),
  roomTemp: z.number().default(20),
  heatingTime: z.number().default(24),
  efficiency: z.number().default(85),
  safetyMargin: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Aquarium_heater_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.targetTemp - input.roomTemp; results["tempRise"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tempRise"] = Number.NaN; }
  try { const v = (input.volume * 4.186 * (toNumericFormulaValue(results["tempRise"]))) / 3600; results["heatEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heatEnergy"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["heatEnergy"])) * 1000) / (input.heatingTime * (input.efficiency / 100)); results["requiredWattage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredWattage"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["requiredWattage"])) * (1 + input.safetyMargin / 100); results["recommendedWattage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedWattage"] = Number.NaN; }
  return results;
}


export function calculateAquarium_heater_calculator(input: Aquarium_heater_calculatorInput): Aquarium_heater_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recommendedWattage"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Aquarium_heater_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
