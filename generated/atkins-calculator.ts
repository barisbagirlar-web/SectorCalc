// Auto-generated from atkins-calculator-schema.json
import * as z from 'zod';

export interface Atkins_calculatorInput {
  powerInput: number;
  massFlow: number;
  specificHeat: number;
  deltaTemp: number;
  efficiencyFactor: number;
}

export const Atkins_calculatorInputSchema = z.object({
  powerInput: z.number().default(100),
  massFlow: z.number().default(2),
  specificHeat: z.number().default(4.18),
  deltaTemp: z.number().default(10),
  efficiencyFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Atkins_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massFlow * input.specificHeat * input.deltaTemp * input.efficiencyFactor; results["actualThermalPower"] = Number.isFinite(v) ? v : 0; } catch { results["actualThermalPower"] = 0; }
  try { const v = input.powerInput / (results["actualThermalPower"] ?? 0); results["atkinsIndex"] = Number.isFinite(v) ? v : 0; } catch { results["atkinsIndex"] = 0; }
  return results;
}


export function calculateAtkins_calculator(input: Atkins_calculatorInput): Atkins_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["atkinsIndex"] ?? 0;
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


export interface Atkins_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
