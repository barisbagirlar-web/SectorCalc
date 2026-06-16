// Auto-generated from stucco-siding-calculator-schema.json
import * as z from 'zod';

export interface Stucco_siding_calculatorInput {
  wallArea: number;
  thickness: number;
  cementBagsPerCubicYard: number;
  wasteFactor: number;
  laborRate: number;
  productivity: number;
  cementCostPerBag: number;
  sandCostPerTon: number;
}

export const Stucco_siding_calculatorInputSchema = z.object({
  wallArea: z.number().default(1000),
  thickness: z.number().default(0.75),
  cementBagsPerCubicYard: z.number().default(6.5),
  wasteFactor: z.number().default(5),
  laborRate: z.number().default(50),
  productivity: z.number().default(25),
  cementCostPerBag: z.number().default(15),
  sandCostPerTon: z.number().default(30),
});

function evaluateAllFormulas(input: Stucco_siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallArea * (input.thickness / 12); results["volumeCuft"] = Number.isFinite(v) ? v : 0; } catch { results["volumeCuft"] = 0; }
  try { const v = (results["volumeCuft"] ?? 0) / 27; results["volumeCuyd"] = Number.isFinite(v) ? v : 0; } catch { results["volumeCuyd"] = 0; }
  try { const v = (results["volumeCuyd"] ?? 0) * input.cementBagsPerCubicYard; results["cementBags"] = Number.isFinite(v) ? v : 0; } catch { results["cementBags"] = 0; }
  try { const v = (results["volumeCuyd"] ?? 0) * 0.75; results["sandVolumeCuyd"] = Number.isFinite(v) ? v : 0; } catch { results["sandVolumeCuyd"] = 0; }
  try { const v = 1 + input.wasteFactor / 100; results["wasteMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["wasteMultiplier"] = 0; }
  try { const v = (results["cementBags"] ?? 0) * (results["wasteMultiplier"] ?? 0); results["cementBagsWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["cementBagsWithWaste"] = 0; }
  try { const v = (results["sandVolumeCuyd"] ?? 0) * 1.3 * (results["wasteMultiplier"] ?? 0); results["sandWeightTonsWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["sandWeightTonsWithWaste"] = 0; }
  try { const v = (results["cementBagsWithWaste"] ?? 0) * input.cementCostPerBag; results["cementCost"] = Number.isFinite(v) ? v : 0; } catch { results["cementCost"] = 0; }
  try { const v = (results["sandWeightTonsWithWaste"] ?? 0) * input.sandCostPerTon; results["sandCost"] = Number.isFinite(v) ? v : 0; } catch { results["sandCost"] = 0; }
  try { const v = (input.wallArea / input.productivity) * input.laborRate; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (results["cementCost"] ?? 0) + (results["sandCost"] ?? 0) + (results["laborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["cementCost"] ?? 0) + (results["sandCost"] ?? 0) - ((results["cementBags"] ?? 0) * input.cementCostPerBag + (results["sandVolumeCuyd"] ?? 0) * 1.3 * input.sandCostPerTon); results["wasteCost"] = Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  return results;
}


export function calculateStucco_siding_calculator(input: Stucco_siding_calculatorInput): Stucco_siding_calculatorOutput {
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


export interface Stucco_siding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
