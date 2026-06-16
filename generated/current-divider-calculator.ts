// Auto-generated from current-divider-calculator-schema.json
import * as z from 'zod';

export interface Current_divider_calculatorInput {
  I_total: number;
  R1: number;
  R2: number;
  R3: number;
  R4: number;
}

export const Current_divider_calculatorInputSchema = z.object({
  I_total: z.number().default(10),
  R1: z.number().default(100),
  R2: z.number().default(200),
  R3: z.number().default(0),
  R4: z.number().default(0),
});

function evaluateAllFormulas(input: Current_divider_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.R1 > 0 ? input.I_total * (1/input.R1) / ((input.R1>0?1/input.R1:0) + (input.R2>0?1/input.R2:0) + (input.R3>0?1/input.R3:0) + (input.R4>0?1/input.R4:0)) : 0; results["I1"] = Number.isFinite(v) ? v : 0; } catch { results["I1"] = 0; }
  try { const v = input.R2 > 0 ? input.I_total * (1/input.R2) / ((input.R1>0?1/input.R1:0) + (input.R2>0?1/input.R2:0) + (input.R3>0?1/input.R3:0) + (input.R4>0?1/input.R4:0)) : 0; results["I2"] = Number.isFinite(v) ? v : 0; } catch { results["I2"] = 0; }
  try { const v = input.R3 > 0 ? input.I_total * (1/input.R3) / ((input.R1>0?1/input.R1:0) + (input.R2>0?1/input.R2:0) + (input.R3>0?1/input.R3:0) + (input.R4>0?1/input.R4:0)) : 0; results["I3"] = Number.isFinite(v) ? v : 0; } catch { results["I3"] = 0; }
  try { const v = input.R4 > 0 ? input.I_total * (1/input.R4) / ((input.R1>0?1/input.R1:0) + (input.R2>0?1/input.R2:0) + (input.R3>0?1/input.R3:0) + (input.R4>0?1/input.R4:0)) : 0; results["I4"] = Number.isFinite(v) ? v : 0; } catch { results["I4"] = 0; }
  return results;
}


export function calculateCurrent_divider_calculator(input: Current_divider_calculatorInput): Current_divider_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["I1"] ?? 0;
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


export interface Current_divider_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
