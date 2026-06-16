// Auto-generated from barrels-to-liters-schema.json
import * as z from 'zod';

export interface Barrels_to_litersInput {
  barrels: number;
  barrelType: number;
}

export const Barrels_to_litersInputSchema = z.object({
  barrels: z.number().default(1),
  barrelType: z.number().default(1),
});

function evaluateAllFormulas(input: Barrels_to_litersInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.barrels * (input.barrelType === 1 ? 158.987294928 : input.barrelType === 2 ? 119.240471196 : 163.65924); results["liters"] = Number.isFinite(v) ? v : 0; } catch { results["liters"] = 0; }
  try { const v = input.barrels * (input.barrelType === 1 ? 42 : input.barrelType === 2 ? 31.5 : 36); results["gallons"] = Number.isFinite(v) ? v : 0; } catch { results["gallons"] = 0; }
  try { const v = (results["liters"] ?? 0) / 1000; results["cubicMeters"] = Number.isFinite(v) ? v : 0; } catch { results["cubicMeters"] = 0; }
  return results;
}


export function calculateBarrels_to_liters(input: Barrels_to_litersInput): Barrels_to_litersOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["liters"] ?? 0;
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


export interface Barrels_to_litersOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
