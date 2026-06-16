// Auto-generated from siding-calculator-schema.json
import * as z from 'zod';

export interface Siding_calculatorInput {
  wallLength: number;
  wallHeight: number;
  windowCount: number;
  windowArea: number;
  doorCount: number;
  doorArea: number;
  sidingCoverage: number;
  wasteFactor: number;
}

export const Siding_calculatorInputSchema = z.object({
  wallLength: z.number().default(20),
  wallHeight: z.number().default(3),
  windowCount: z.number().default(2),
  windowArea: z.number().default(1.5),
  doorCount: z.number().default(1),
  doorArea: z.number().default(2),
  sidingCoverage: z.number().default(1),
  wasteFactor: z.number().default(0.1),
});

function evaluateAllFormulas(input: Siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight; results["totalWallArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalWallArea"] = 0; }
  try { const v = input.windowCount * input.windowArea; results["windowOpeningsArea"] = Number.isFinite(v) ? v : 0; } catch { results["windowOpeningsArea"] = 0; }
  try { const v = input.doorCount * input.doorArea; results["doorOpeningsArea"] = Number.isFinite(v) ? v : 0; } catch { results["doorOpeningsArea"] = 0; }
  try { const v = (results["totalWallArea"] ?? 0) - ((results["windowOpeningsArea"] ?? 0) + (results["doorOpeningsArea"] ?? 0)); results["netWallArea"] = Number.isFinite(v) ? v : 0; } catch { results["netWallArea"] = 0; }
  try { const v = (results["netWallArea"] ?? 0) / input.sidingCoverage; results["panelsWithoutWaste"] = Number.isFinite(v) ? v : 0; } catch { results["panelsWithoutWaste"] = 0; }
  try { const v = (results["panelsWithoutWaste"] ?? 0) * input.wasteFactor; results["wastePanels"] = Number.isFinite(v) ? v : 0; } catch { results["wastePanels"] = 0; }
  try { const v = (results["panelsWithoutWaste"] ?? 0) + (results["wastePanels"] ?? 0); results["panelsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["panelsNeeded"] = 0; }
  return results;
}


export function calculateSiding_calculator(input: Siding_calculatorInput): Siding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["panelsNeeded"] ?? 0;
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


export interface Siding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
