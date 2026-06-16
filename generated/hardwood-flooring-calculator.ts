// Auto-generated from hardwood-flooring-calculator-schema.json
import * as z from 'zod';

export interface Hardwood_flooring_calculatorInput {
  roomLength: number;
  roomWidth: number;
  plankLength: number;
  plankWidth: number;
  pricePerSqFt: number;
  wasteFactor: number;
}

export const Hardwood_flooring_calculatorInputSchema = z.object({
  roomLength: z.number().default(15),
  roomWidth: z.number().default(12),
  plankLength: z.number().default(48),
  plankWidth: z.number().default(6),
  pricePerSqFt: z.number().default(5),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Hardwood_flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["roomArea"] = Number.isFinite(v) ? v : 0; } catch { results["roomArea"] = 0; }
  try { const v = (input.plankLength * input.plankWidth) / 144; results["plankAreaSqFt"] = Number.isFinite(v) ? v : 0; } catch { results["plankAreaSqFt"] = 0; }
  try { const v = Math.ceil((results["roomArea"] ?? 0) * (1 + input.wasteFactor / 100) / (results["plankAreaSqFt"] ?? 0)); results["totalPlanks"] = Number.isFinite(v) ? v : 0; } catch { results["totalPlanks"] = 0; }
  try { const v = (results["totalPlanks"] ?? 0) * (results["plankAreaSqFt"] ?? 0); results["totalMaterialArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialArea"] = 0; }
  try { const v = (results["totalMaterialArea"] ?? 0) * input.pricePerSqFt; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateHardwood_flooring_calculator(input: Hardwood_flooring_calculatorInput): Hardwood_flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Hardwood_flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
