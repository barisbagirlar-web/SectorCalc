// Auto-generated from critical-path-calculator-schema.json
import * as z from 'zod';

export interface Critical_path_calculatorInput {
  durationA: number;
  durationB: number;
  durationC: number;
  durationD: number;
  durationE: number;
}

export const Critical_path_calculatorInputSchema = z.object({
  durationA: z.number().default(1),
  durationB: z.number().default(1),
  durationC: z.number().default(1),
  durationD: z.number().default(1),
  durationE: z.number().default(1),
});

function evaluateAllFormulas(input: Critical_path_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(input.durationA+input.durationC+input.durationD, input.durationA+input.durationC+input.durationE, input.durationB+input.durationC+input.durationD, input.durationB+input.durationC+input.durationE); results["criticalPathDuration"] = Number.isFinite(v) ? v : 0; } catch { results["criticalPathDuration"] = 0; }
  try { const v = (input.durationA+input.durationC+input.durationD >= input.durationA+input.durationC+input.durationE && input.durationA+input.durationC+input.durationD >= input.durationB+input.durationC+input.durationD && input.durationA+input.durationC+input.durationD >= input.durationB+input.durationC+input.durationE) ? 'A-C-D' : (input.durationA+input.durationC+input.durationE >= input.durationB+input.durationC+input.durationD && input.durationA+input.durationC+input.durationE >= input.durationB+input.durationC+input.durationE) ? 'A-C-E' : (input.durationB+input.durationC+input.durationD >= input.durationB+input.durationC+input.durationE) ? 'B-C-D' : 'B-C-E'; results["criticalPath"] = Number.isFinite(v) ? v : 0; } catch { results["criticalPath"] = 0; }
  try { const v = 'A-C-D: ' + (input.durationA+input.durationC+input.durationD) + ' gün, A-C-E: ' + (input.durationA+input.durationC+input.durationE) + ' gün, B-C-D: ' + (input.durationB+input.durationC+input.durationD) + ' gün, B-C-E: ' + (input.durationB+input.durationC+input.durationE) + ' gün'; results["pathDurations"] = Number.isFinite(v) ? v : 0; } catch { results["pathDurations"] = 0; }
  return results;
}


export function calculateCritical_path_calculator(input: Critical_path_calculatorInput): Critical_path_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["criticalPathDuration"] ?? 0;
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


export interface Critical_path_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
