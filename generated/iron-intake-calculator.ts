// Auto-generated from iron-intake-calculator-schema.json
import * as z from 'zod';

export interface Iron_intake_calculatorInput {
  oreMass: number;
  ironConcentration: number;
  moistureContent: number;
  recoveryRate: number;
}

export const Iron_intake_calculatorInputSchema = z.object({
  oreMass: z.number().default(100),
  ironConcentration: z.number().default(62),
  moistureContent: z.number().default(8),
  recoveryRate: z.number().default(95),
});

function evaluateAllFormulas(input: Iron_intake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oreMass * (1 - input.moistureContent / 100); results["dryMass"] = Number.isFinite(v) ? v : 0; } catch { results["dryMass"] = 0; }
  try { const v = (results["dryMass"] ?? 0) * (input.ironConcentration / 100); results["ironMass"] = Number.isFinite(v) ? v : 0; } catch { results["ironMass"] = 0; }
  try { const v = (results["ironMass"] ?? 0) * (input.recoveryRate / 100); results["netIron"] = Number.isFinite(v) ? v : 0; } catch { results["netIron"] = 0; }
  return results;
}


export function calculateIron_intake_calculator(input: Iron_intake_calculatorInput): Iron_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netIron"] ?? 0;
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


export interface Iron_intake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
