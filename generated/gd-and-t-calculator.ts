// Auto-generated from gd-and-t-calculator-schema.json
import * as z from 'zod';

export interface Gd_and_t_calculatorInput {
  basicX: number;
  basicY: number;
  actualX: number;
  actualY: number;
  holeDiaNom: number;
  holeDiaTolLower: number;
  holeDiaActual: number;
  positionTol: number;
  dataConfidence?: number;
}

export const Gd_and_t_calculatorInputSchema = z.object({
  basicX: z.number().default(0),
  basicY: z.number().default(0),
  actualX: z.number().default(0),
  actualY: z.number().default(0),
  holeDiaNom: z.number().default(10),
  holeDiaTolLower: z.number().default(0.1),
  holeDiaActual: z.number().default(9.95),
  positionTol: z.number().default(0.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gd_and_t_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actualX - input.basicX; results["dx"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dx"] = Number.NaN; }
  try { const v = input.actualY - input.basicY; results["dy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dy"] = Number.NaN; }
  try { const v = input.holeDiaNom - input.holeDiaTolLower; results["MMC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MMC"] = Number.NaN; }
  try { const v = input.holeDiaActual - (toNumericFormulaValue(results["MMC"])); results["bonus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bonus"] = Number.NaN; }
  try { const v = input.positionTol + (toNumericFormulaValue(results["bonus"])); results["totalTol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTol"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bonus"])); results["bonusMsg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bonusMsg"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTol"])); results["totalTolMsg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTolMsg"] = Number.NaN; }
  return results;
}


export function calculateGd_and_t_calculator(input: Gd_and_t_calculatorInput): Gd_and_t_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTolMsg"]);
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


export interface Gd_and_t_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
