// Auto-generated from wrestling-weight-class-calculator-schema.json
import * as z from 'zod';

export interface Wrestling_weight_class_calculatorInput {
  gender: number;
  weight: number;
  height: number;
  age: number;
  bodyFat: number;
}

export const Wrestling_weight_class_calculatorInputSchema = z.object({
  gender: z.number().default(1),
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(25),
  bodyFat: z.number().default(15),
});

function evaluateAllFormulas(input: Wrestling_weight_class_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = Number.isFinite(v) ? v : 0; } catch { results["leanBodyMass"] = 0; }
  try { const v = (input.gender === 0 ? (input.weight <= 50 ? '50 kg' : input.weight <= 53 ? '53 kg' : input.weight <= 57 ? '57 kg' : input.weight <= 62 ? '62 kg' : input.weight <= 68 ? '68 kg' : input.weight <= 76 ? '76 kg' : '76+ kg') : (input.weight <= 57 ? '57 kg' : input.weight <= 65 ? '65 kg' : input.weight <= 74 ? '74 kg' : input.weight <= 86 ? '86 kg' : input.weight <= 97 ? '97 kg' : input.weight <= 125 ? '125 kg' : '125+ kg')); results["weightClass"] = Number.isFinite(v) ? v : 0; } catch { results["weightClass"] = 0; }
  return results;
}


export function calculateWrestling_weight_class_calculator(input: Wrestling_weight_class_calculatorInput): Wrestling_weight_class_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weightClass"] ?? 0;
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


export interface Wrestling_weight_class_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
