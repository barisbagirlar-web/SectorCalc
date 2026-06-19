// Auto-generated from tree-calculator-schema.json
import * as z from 'zod';

export interface Tree_calculatorInput {
  treeHeight: number;
  dbh: number;
  woodDensity: number;
  carbonFraction: number;
  formFactor: number;
  branchFactor: number;
  dataConfidence?: number;
}

export const Tree_calculatorInputSchema = z.object({
  treeHeight: z.number().default(15),
  dbh: z.number().default(30),
  woodDensity: z.number().default(600),
  carbonFraction: z.number().default(0.5),
  formFactor: z.number().default(0.5),
  branchFactor: z.number().default(0.3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tree_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.formFactor * (Math.PI * (input.dbh/100)**2 / 4) * input.treeHeight; results["volumeTrunk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeTrunk"] = 0; }
  try { const v = (asFormulaNumber(results["volumeTrunk"])) * input.woodDensity; results["biomassTrunk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["biomassTrunk"] = 0; }
  try { const v = (asFormulaNumber(results["biomassTrunk"])) * input.branchFactor; results["biomassBranches"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["biomassBranches"] = 0; }
  try { const v = (asFormulaNumber(results["biomassTrunk"])) + (asFormulaNumber(results["biomassBranches"])); results["totalBiomass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBiomass"] = 0; }
  try { const v = (asFormulaNumber(results["totalBiomass"])) * input.carbonFraction; results["totalCarbon"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCarbon"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTree_calculator(input: Tree_calculatorInput): Tree_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCarbon"]));
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


export interface Tree_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
