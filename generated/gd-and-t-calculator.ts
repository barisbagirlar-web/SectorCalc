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

function evaluateAllFormulas(input: Gd_and_t_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * Math.sqrt((input.actualX - input.basicX)**2 + (input.actualY - input.basicY)**2); results["posError"] = Number.isFinite(v) ? v : 0; } catch { results["posError"] = 0; }
  try { const v = input.holeDiaNom - input.holeDiaTolLower; results["MMC"] = Number.isFinite(v) ? v : 0; } catch { results["MMC"] = 0; }
  try { const v = Math.max(0, input.holeDiaActual - (results["MMC"] ?? 0)); results["bonus"] = Number.isFinite(v) ? v : 0; } catch { results["bonus"] = 0; }
  try { const v = input.positionTol + (results["bonus"] ?? 0); results["totalTol"] = Number.isFinite(v) ? v : 0; } catch { results["totalTol"] = 0; }
  try { const v = (results["posError"] ?? 0) <= (results["totalTol"] ?? 0) ? 'Acceptable' : 'Not Acceptable'; results["isOk"] = Number.isFinite(v) ? v : 0; } catch { results["isOk"] = 0; }
  try { const v = 'Position Error: ' + (results["posError"] ?? 0).toFixed(3) + ' mm'; results["posErrMsg"] = Number.isFinite(v) ? v : 0; } catch { results["posErrMsg"] = 0; }
  try { const v = 'Bonus Tolerance: ' + (results["bonus"] ?? 0).toFixed(3) + ' mm'; results["bonusMsg"] = Number.isFinite(v) ? v : 0; } catch { results["bonusMsg"] = 0; }
  try { const v = 'Total Allowable: ' + (results["totalTol"] ?? 0).toFixed(3) + ' mm'; results["totalTolMsg"] = Number.isFinite(v) ? v : 0; } catch { results["totalTolMsg"] = 0; }
  return results;
}


export function calculateGd_and_t_calculator(input: Gd_and_t_calculatorInput): Gd_and_t_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["isOk"] ?? 0;
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


export interface Gd_and_t_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
