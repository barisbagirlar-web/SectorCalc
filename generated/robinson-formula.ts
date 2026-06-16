// Auto-generated from robinson-formula-schema.json
import * as z from 'zod';

export interface Robinson_formulaInput {
  walkingSpeed: number;
  distanceBetweenPicks: number;
  timePerPick: number;
  availableMinutesPerHour: number;
}

export const Robinson_formulaInputSchema = z.object({
  walkingSpeed: z.number().default(80),
  distanceBetweenPicks: z.number().default(2),
  timePerPick: z.number().default(0.3),
  availableMinutesPerHour: z.number().default(50),
});

function evaluateAllFormulas(input: Robinson_formulaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distanceBetweenPicks / input.walkingSpeed; results["walkingTimePerPick"] = Number.isFinite(v) ? v : 0; } catch { results["walkingTimePerPick"] = 0; }
  try { const v = input.timePerPick + (results["walkingTimePerPick"] ?? 0); results["totalTimePerPick"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimePerPick"] = 0; }
  try { const v = input.availableMinutesPerHour / (results["totalTimePerPick"] ?? 0); results["linesPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["linesPerHour"] = 0; }
  return results;
}


export function calculateRobinson_formula(input: Robinson_formulaInput): Robinson_formulaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["linesPerHour"] ?? 0;
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


export interface Robinson_formulaOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
