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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stucco_siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallArea * (input.thickness / 12); results["volumeCuft"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeCuft"] = 0; }
  try { const v = (asFormulaNumber(results["volumeCuft"])) / 27; results["volumeCuyd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeCuyd"] = 0; }
  try { const v = (asFormulaNumber(results["volumeCuyd"])) * input.cementBagsPerCubicYard; results["cementBags"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cementBags"] = 0; }
  try { const v = (asFormulaNumber(results["volumeCuyd"])) * 0.75; results["sandVolumeCuyd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sandVolumeCuyd"] = 0; }
  try { const v = 1 + input.wasteFactor / 100; results["wasteMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteMultiplier"] = 0; }
  try { const v = (asFormulaNumber(results["cementBags"])) * (asFormulaNumber(results["wasteMultiplier"])); results["cementBagsWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cementBagsWithWaste"] = 0; }
  try { const v = (asFormulaNumber(results["sandVolumeCuyd"])) * 1.3 * (asFormulaNumber(results["wasteMultiplier"])); results["sandWeightTonsWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sandWeightTonsWithWaste"] = 0; }
  try { const v = (asFormulaNumber(results["cementBagsWithWaste"])) * input.cementCostPerBag; results["cementCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cementCost"] = 0; }
  try { const v = (asFormulaNumber(results["sandWeightTonsWithWaste"])) * input.sandCostPerTon; results["sandCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sandCost"] = 0; }
  try { const v = (input.wallArea / input.productivity) * input.laborRate; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (asFormulaNumber(results["cementCost"])) + (asFormulaNumber(results["sandCost"])) + (asFormulaNumber(results["laborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["cementCost"])) + (asFormulaNumber(results["sandCost"])) - ((asFormulaNumber(results["cementBags"])) * input.cementCostPerBag + (asFormulaNumber(results["sandVolumeCuyd"])) * 1.3 * input.sandCostPerTon); results["wasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStucco_siding_calculator(input: Stucco_siding_calculatorInput): Stucco_siding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Stucco_siding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
