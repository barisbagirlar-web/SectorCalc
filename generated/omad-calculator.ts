// Auto-generated from omad-calculator-schema.json
import * as z from 'zod';

export interface Omad_calculatorInput {
  plannedTime: number;
  unplannedDowntime: number;
  idealCycleTime: number;
  totalUnits: number;
  defectiveUnits: number;
}

export const Omad_calculatorInputSchema = z.object({
  plannedTime: z.number().default(480),
  unplannedDowntime: z.number().default(60),
  idealCycleTime: z.number().default(0.5),
  totalUnits: z.number().default(800),
  defectiveUnits: z.number().default(40),
});

function evaluateAllFormulas(input: Omad_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.plannedTime - input.unplannedDowntime) / input.plannedTime; results["availability"] = Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (input.idealCycleTime * input.totalUnits) / (input.plannedTime - input.unplannedDowntime); results["performance"] = Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  try { const v = (input.totalUnits - input.defectiveUnits) / input.totalUnits; results["quality"] = Number.isFinite(v) ? v : 0; } catch { results["quality"] = 0; }
  try { const v = ((input.plannedTime - input.unplannedDowntime) / input.plannedTime) * ((input.idealCycleTime * input.totalUnits) / (input.plannedTime - input.unplannedDowntime)) * ((input.totalUnits - input.defectiveUnits) / input.totalUnits); results["oee"] = Number.isFinite(v) ? v : 0; } catch { results["oee"] = 0; }
  return results;
}


export function calculateOmad_calculator(input: Omad_calculatorInput): Omad_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["oee"] ?? 0;
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


export interface Omad_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
