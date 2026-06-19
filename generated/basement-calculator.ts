// Auto-generated from basement-calculator-schema.json
import * as z from 'zod';

export interface Basement_calculatorInput {
  length: number;
  width: number;
  depth: number;
  wallThickness: number;
  floorThickness: number;
  concreteCost: number;
  waterproofingCost: number;
  dataConfidence?: number;
}

export const Basement_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(8),
  depth: z.number().default(3),
  wallThickness: z.number().default(25),
  floorThickness: z.number().default(20),
  concreteCost: z.number().default(1200),
  waterproofingCost: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Basement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["floorArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["floorArea"] = 0; }
  try { const v = 2 * (input.length + input.width) * input.depth; results["wallArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = (asFormulaNumber(results["wallArea"])) * (input.wallThickness / 100); results["wallConcreteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallConcreteVolume"] = 0; }
  try { const v = (asFormulaNumber(results["floorArea"])) * (input.floorThickness / 100); results["floorConcreteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["floorConcreteVolume"] = 0; }
  try { const v = (asFormulaNumber(results["wallConcreteVolume"])) + (asFormulaNumber(results["floorConcreteVolume"])); results["totalConcreteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalConcreteVolume"] = 0; }
  try { const v = (asFormulaNumber(results["floorArea"])) + (asFormulaNumber(results["wallArea"])); results["waterproofingArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waterproofingArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalConcreteVolume"])) * input.concreteCost; results["concreteCostAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["concreteCostAmount"] = 0; }
  try { const v = (asFormulaNumber(results["waterproofingArea"])) * input.waterproofingCost; results["waterproofingCostAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waterproofingCostAmount"] = 0; }
  try { const v = (asFormulaNumber(results["concreteCostAmount"])) + (asFormulaNumber(results["waterproofingCostAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBasement_calculator(input: Basement_calculatorInput): Basement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Basement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
