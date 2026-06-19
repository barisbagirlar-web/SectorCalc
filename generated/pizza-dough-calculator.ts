// Auto-generated from pizza-dough-calculator-schema.json
import * as z from 'zod';

export interface Pizza_dough_calculatorInput {
  numPizzas: number;
  doughBallWeight: number;
  hydrationPercent: number;
  yeastPercent: number;
  saltPercent: number;
  oilPercent: number;
  dataConfidence?: number;
}

export const Pizza_dough_calculatorInputSchema = z.object({
  numPizzas: z.number().default(4),
  doughBallWeight: z.number().default(250),
  hydrationPercent: z.number().default(65),
  yeastPercent: z.number().default(1),
  saltPercent: z.number().default(2),
  oilPercent: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pizza_dough_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numPizzas * input.doughBallWeight; results["totalDough"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDough"] = 0; }
  try { const v = 100 + input.hydrationPercent + input.yeastPercent + input.saltPercent + input.oilPercent; results["totalPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPercentage"] = 0; }
  try { const v = (asFormulaNumber(results["totalDough"])) / ((asFormulaNumber(results["totalPercentage"])) / 100); results["flourWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["flourWeight"] = 0; }
  try { const v = (asFormulaNumber(results["flourWeight"])) * input.hydrationPercent / 100; results["waterWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = (asFormulaNumber(results["flourWeight"])) * input.yeastPercent / 100; results["yeastWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yeastWeight"] = 0; }
  try { const v = (asFormulaNumber(results["flourWeight"])) * input.saltPercent / 100; results["saltWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["saltWeight"] = 0; }
  try { const v = (asFormulaNumber(results["flourWeight"])) * input.oilPercent / 100; results["oilWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["oilWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePizza_dough_calculator(input: Pizza_dough_calculatorInput): Pizza_dough_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["flourWeight"]));
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


export interface Pizza_dough_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
