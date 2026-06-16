// Auto-generated from build-calculator-schema.json
import * as z from 'zod';

export interface Build_calculatorInput {
  length: number;
  width: number;
  height: number;
  density: number;
  wasteFactor: number;
  laborRate: number;
  laborHours: number;
}

export const Build_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  height: z.number().default(3),
  density: z.number().default(2400),
  wasteFactor: z.number().default(5),
  laborRate: z.number().default(25),
  laborHours: z.number().default(40),
});

function evaluateAllFormulas(input: Build_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.height; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (results["volume"] ?? 0) * input.density; results["materialMass"] = Number.isFinite(v) ? v : 0; } catch { results["materialMass"] = 0; }
  try { const v = (results["materialMass"] ?? 0) * (input.wasteFactor / 100); results["wasteMass"] = Number.isFinite(v) ? v : 0; } catch { results["wasteMass"] = 0; }
  try { const v = (results["materialMass"] ?? 0) + (results["wasteMass"] ?? 0); results["totalMaterialMass"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialMass"] = 0; }
  try { const v = input.laborRate * input.laborHours; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (results["totalMaterialMass"] ?? 0) * 0.5 + (results["laborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateBuild_calculator(input: Build_calculatorInput): Build_calculatorOutput {
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


export interface Build_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
