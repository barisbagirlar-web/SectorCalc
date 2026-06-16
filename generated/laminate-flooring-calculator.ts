// Auto-generated from laminate-flooring-calculator-schema.json
import * as z from 'zod';

export interface Laminate_flooring_calculatorInput {
  roomLength: number;
  roomWidth: number;
  plankLength: number;
  plankWidth: number;
  wastePercentage: number;
}

export const Laminate_flooring_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  plankLength: z.number().default(1.29),
  plankWidth: z.number().default(0.192),
  wastePercentage: z.number().default(10),
});

function evaluateAllFormulas(input: Laminate_flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["roomArea"] = Number.isFinite(v) ? v : 0; } catch { results["roomArea"] = 0; }
  try { const v = input.plankLength * input.plankWidth; results["plankArea"] = Number.isFinite(v) ? v : 0; } catch { results["plankArea"] = 0; }
  try { const v = Math.ceil(input.roomWidth / input.plankWidth); results["rows"] = Number.isFinite(v) ? v : 0; } catch { results["rows"] = 0; }
  try { const v = Math.ceil(input.roomLength / input.plankLength); results["planksPerRow"] = Number.isFinite(v) ? v : 0; } catch { results["planksPerRow"] = 0; }
  try { const v = (results["rows"] ?? 0) * (results["planksPerRow"] ?? 0); results["baseTotal"] = Number.isFinite(v) ? v : 0; } catch { results["baseTotal"] = 0; }
  try { const v = Math.ceil((results["baseTotal"] ?? 0) * (1 + input.wastePercentage / 100)); results["totalWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithWaste"] = 0; }
  try { const v = (results["totalWithWaste"] ?? 0) * (results["plankArea"] ?? 0) - (results["roomArea"] ?? 0); results["wasteArea"] = Number.isFinite(v) ? v : 0; } catch { results["wasteArea"] = 0; }
  return results;
}


export function calculateLaminate_flooring_calculator(input: Laminate_flooring_calculatorInput): Laminate_flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWithWaste"] ?? 0;
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


export interface Laminate_flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
