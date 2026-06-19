// Auto-generated from omad-calculator-schema.json
import * as z from 'zod';

export interface Omad_calculatorInput {
  plannedTime: number;
  unplannedDowntime: number;
  idealCycleTime: number;
  totalUnits: number;
  defectiveUnits: number;
  dataConfidence?: number;
}

export const Omad_calculatorInputSchema = z.object({
  plannedTime: z.number().default(480),
  unplannedDowntime: z.number().default(60),
  idealCycleTime: z.number().default(0.5),
  totalUnits: z.number().default(800),
  defectiveUnits: z.number().default(40),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Omad_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.plannedTime - input.unplannedDowntime) / input.plannedTime; results["availability"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (input.idealCycleTime * input.totalUnits) / (input.plannedTime - input.unplannedDowntime); results["performance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  try { const v = (input.totalUnits - input.defectiveUnits) / input.totalUnits; results["quality"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["quality"] = 0; }
  try { const v = ((input.plannedTime - input.unplannedDowntime) / input.plannedTime) * ((input.idealCycleTime * input.totalUnits) / (input.plannedTime - input.unplannedDowntime)) * ((input.totalUnits - input.defectiveUnits) / input.totalUnits); results["oee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["oee"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOmad_calculator(input: Omad_calculatorInput): Omad_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["oee"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
