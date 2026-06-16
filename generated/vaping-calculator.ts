// Auto-generated from vaping-calculator-schema.json
import * as z from 'zod';

export interface Vaping_calculatorInput {
  wireDiameter: number;
  innerDiameter: number;
  numberOfWraps: number;
  legLength: number;
  resistivity: number;
  voltage: number;
}

export const Vaping_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(0.4),
  innerDiameter: z.number().default(3),
  numberOfWraps: z.number().default(6),
  legLength: z.number().default(5),
  resistivity: z.number().default(0.00000145),
  voltage: z.number().default(4.2),
});

function evaluateAllFormulas(input: Vaping_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resistivity * ((input.numberOfWraps * Math.PI * (input.innerDiameter + input.wireDiameter) + 2 * input.legLength) / 1000) / (Math.PI * Math.pow(input.wireDiameter / 2, 2) * 0.000001); results["resistance"] = Number.isFinite(v) ? v : 0; } catch { results["resistance"] = 0; }
  try { const v = input.voltage / (results["resistance"] ?? 0); results["current"] = Number.isFinite(v) ? v : 0; } catch { results["current"] = 0; }
  try { const v = input.voltage * input.voltage / (results["resistance"] ?? 0); results["power"] = Number.isFinite(v) ? v : 0; } catch { results["power"] = 0; }
  return results;
}


export function calculateVaping_calculator(input: Vaping_calculatorInput): Vaping_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["resistance"] ?? 0;
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


export interface Vaping_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
