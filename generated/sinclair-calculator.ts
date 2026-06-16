// Auto-generated from sinclair-calculator-schema.json
import * as z from 'zod';

export interface Sinclair_calculatorInput {
  bodyweight: number;
  snatch: number;
  cleanAndJerk: number;
  gender: number;
}

export const Sinclair_calculatorInputSchema = z.object({
  bodyweight: z.number().default(80),
  snatch: z.number().default(120),
  cleanAndJerk: z.number().default(150),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Sinclair_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.snatch + input.cleanAndJerk; results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = input.gender === 0 ? 0.784780654 : 0.933700289; results["A"] = Number.isFinite(v) ? v : 0; } catch { results["A"] = 0; }
  try { const v = input.gender === 0 ? 193.609 : 153.655; results["b"] = Number.isFinite(v) ? v : 0; } catch { results["b"] = 0; }
  try { const v = Math.log10(input.bodyweight / (results["b"] ?? 0)); results["X"] = Number.isFinite(v) ? v : 0; } catch { results["X"] = 0; }
  try { const v = Math.pow(10, (results["A"] ?? 0) * Math.pow((results["X"] ?? 0), 2)); results["coefficient"] = Number.isFinite(v) ? v : 0; } catch { results["coefficient"] = 0; }
  try { const v = (results["total"] ?? 0) * (results["coefficient"] ?? 0); results["sinclairTotal"] = Number.isFinite(v) ? v : 0; } catch { results["sinclairTotal"] = 0; }
  return results;
}


export function calculateSinclair_calculator(input: Sinclair_calculatorInput): Sinclair_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sinclairTotal"] ?? 0;
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


export interface Sinclair_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
