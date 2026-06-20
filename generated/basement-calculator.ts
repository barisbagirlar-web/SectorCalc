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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Basement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["floorArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["floorArea"] = Number.NaN; }
  try { const v = 2 * (input.length + input.width) * input.depth; results["wallArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallArea"])) * (input.wallThickness / 100); results["wallConcreteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallConcreteVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["floorArea"])) * (input.floorThickness / 100); results["floorConcreteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["floorConcreteVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallConcreteVolume"])) + (toNumericFormulaValue(results["floorConcreteVolume"])); results["totalConcreteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalConcreteVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["floorArea"])) + (toNumericFormulaValue(results["wallArea"])); results["waterproofingArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterproofingArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalConcreteVolume"])) * input.concreteCost; results["concreteCostAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["concreteCostAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["waterproofingArea"])) * input.waterproofingCost; results["waterproofingCostAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterproofingCostAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["concreteCostAmount"])) + (toNumericFormulaValue(results["waterproofingCostAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateBasement_calculator(input: Basement_calculatorInput): Basement_calculatorOutput {
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


export interface Basement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
