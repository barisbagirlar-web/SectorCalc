// Auto-generated from monopoly-probability-schema.json
import * as z from 'zod';

export interface Monopoly_probabilityInput {
  numPlayers: number;
  diceSides: number;
  numDice: number;
  boardSpaces: number;
  targetSpace: number;
  turns: number;
  dataConfidence?: number;
}

export const Monopoly_probabilityInputSchema = z.object({
  numPlayers: z.number().default(4),
  diceSides: z.number().default(6),
  numDice: z.number().default(2),
  boardSpaces: z.number().default(40),
  targetSpace: z.number().default(10),
  turns: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Monopoly_probabilityInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numDice * (input.diceSides + 1) / 2; results["meanRoll"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meanRoll"] = Number.NaN; }
  try { const v = 1 / input.boardSpaces; results["probLandOnTargetOneTurn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["probLandOnTargetOneTurn"] = Number.NaN; }
  try { const v = 1 - (toNumericFormulaValue(results["probLandOnTargetOneTurn"])); results["probNotLandOnTargetOneTurn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["probNotLandOnTargetOneTurn"] = Number.NaN; }
  try { const v = input.turns / input.boardSpaces; results["expectedLandings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedLandings"] = Number.NaN; }
  return results;
}


export function calculateMonopoly_probability(input: Monopoly_probabilityInput): Monopoly_probabilityOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanRoll"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Monopoly_probabilityOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
