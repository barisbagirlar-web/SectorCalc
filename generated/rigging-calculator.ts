// Auto-generated from rigging-calculator-schema.json
import * as z from 'zod';

export interface Rigging_calculatorInput {
  loadWeight: number;
  slingAngle: number;
  numberOfLegs: number;
  safetyFactor: number;
}

export const Rigging_calculatorInputSchema = z.object({
  loadWeight: z.number().default(1000),
  slingAngle: z.number().default(60),
  numberOfLegs: z.number().default(2),
  safetyFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Rigging_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sin(input.slingAngle * Math.PI / 180); results["sinAngle"] = Number.isFinite(v) ? v : 0; } catch { results["sinAngle"] = 0; }
  try { const v = input.loadWeight / (input.numberOfLegs * (results["sinAngle"] ?? 0)); results["tensionGross"] = Number.isFinite(v) ? v : 0; } catch { results["tensionGross"] = 0; }
  try { const v = (results["tensionGross"] ?? 0) * input.safetyFactor; results["tensionDesign"] = Number.isFinite(v) ? v : 0; } catch { results["tensionDesign"] = 0; }
  results["__tensionGross_toFixed_2___kg"] = 0;
  try { const v = $input.safetyFactor; results["__safetyFactor_"] = Number.isFinite(v) ? v : 0; } catch { results["__safetyFactor_"] = 0; }
  results["__slingAngle__"] = 0;
  results["__sinAngle_toFixed_4__"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateRigging_calculator(input: Rigging_calculatorInput): Rigging_calculatorOutput {
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


export interface Rigging_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
