// Auto-generated from tree-calculator-schema.json
import * as z from 'zod';

export interface Tree_calculatorInput {
  treeHeight: number;
  dbh: number;
  woodDensity: number;
  carbonFraction: number;
  formFactor: number;
  branchFactor: number;
}

export const Tree_calculatorInputSchema = z.object({
  treeHeight: z.number().default(15),
  dbh: z.number().default(30),
  woodDensity: z.number().default(600),
  carbonFraction: z.number().default(0.5),
  formFactor: z.number().default(0.5),
  branchFactor: z.number().default(0.3),
});

function evaluateAllFormulas(input: Tree_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.formFactor * (Math.PI * (input.dbh/100)**2 / 4) * input.treeHeight; results["volumeTrunk"] = Number.isFinite(v) ? v : 0; } catch { results["volumeTrunk"] = 0; }
  try { const v = (results["volumeTrunk"] ?? 0) * input.woodDensity; results["biomassTrunk"] = Number.isFinite(v) ? v : 0; } catch { results["biomassTrunk"] = 0; }
  try { const v = (results["biomassTrunk"] ?? 0) * input.branchFactor; results["biomassBranches"] = Number.isFinite(v) ? v : 0; } catch { results["biomassBranches"] = 0; }
  try { const v = (results["biomassTrunk"] ?? 0) + (results["biomassBranches"] ?? 0); results["totalBiomass"] = Number.isFinite(v) ? v : 0; } catch { results["totalBiomass"] = 0; }
  try { const v = (results["totalBiomass"] ?? 0) * input.carbonFraction; results["totalCarbon"] = Number.isFinite(v) ? v : 0; } catch { results["totalCarbon"] = 0; }
  return results;
}


export function calculateTree_calculator(input: Tree_calculatorInput): Tree_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCarbon"] ?? 0;
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


export interface Tree_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
