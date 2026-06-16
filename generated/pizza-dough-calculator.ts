// Auto-generated from pizza-dough-calculator-schema.json
import * as z from 'zod';

export interface Pizza_dough_calculatorInput {
  numPizzas: number;
  doughBallWeight: number;
  hydrationPercent: number;
  yeastPercent: number;
  saltPercent: number;
  oilPercent: number;
}

export const Pizza_dough_calculatorInputSchema = z.object({
  numPizzas: z.number().default(4),
  doughBallWeight: z.number().default(250),
  hydrationPercent: z.number().default(65),
  yeastPercent: z.number().default(1),
  saltPercent: z.number().default(2),
  oilPercent: z.number().default(2),
});

function evaluateAllFormulas(input: Pizza_dough_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numPizzas * input.doughBallWeight; results["totalDough"] = Number.isFinite(v) ? v : 0; } catch { results["totalDough"] = 0; }
  try { const v = 100 + input.hydrationPercent + input.yeastPercent + input.saltPercent + input.oilPercent; results["totalPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["totalPercentage"] = 0; }
  try { const v = (results["totalDough"] ?? 0) / ((results["totalPercentage"] ?? 0) / 100); results["flourWeight"] = Number.isFinite(v) ? v : 0; } catch { results["flourWeight"] = 0; }
  try { const v = (results["flourWeight"] ?? 0) * input.hydrationPercent / 100; results["waterWeight"] = Number.isFinite(v) ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = (results["flourWeight"] ?? 0) * input.yeastPercent / 100; results["yeastWeight"] = Number.isFinite(v) ? v : 0; } catch { results["yeastWeight"] = 0; }
  try { const v = (results["flourWeight"] ?? 0) * input.saltPercent / 100; results["saltWeight"] = Number.isFinite(v) ? v : 0; } catch { results["saltWeight"] = 0; }
  try { const v = (results["flourWeight"] ?? 0) * input.oilPercent / 100; results["oilWeight"] = Number.isFinite(v) ? v : 0; } catch { results["oilWeight"] = 0; }
  return results;
}


export function calculatePizza_dough_calculator(input: Pizza_dough_calculatorInput): Pizza_dough_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["flourWeight"] ?? 0;
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


export interface Pizza_dough_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
