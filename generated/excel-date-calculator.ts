// Auto-generated from excel-date-calculator-schema.json
import * as z from 'zod';

export interface Excel_date_calculatorInput {
  startSerial: number;
  endSerial: number;
  daysOffset: number;
  adjustStart: number;
}

export const Excel_date_calculatorInputSchema = z.object({
  startSerial: z.number().default(44927),
  endSerial: z.number().default(44927),
  daysOffset: z.number().default(0),
  adjustStart: z.number().default(0),
});

function evaluateAllFormulas(input: Excel_date_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endSerial - input.startSerial + input.adjustStart; results["daysDifference"] = Number.isFinite(v) ? v : 0; } catch { results["daysDifference"] = 0; }
  try { const v = input.startSerial + input.daysOffset; results["projectedDateSerial"] = Number.isFinite(v) ? v : 0; } catch { results["projectedDateSerial"] = 0; }
  try { const v = input.endSerial - input.startSerial; results["rawDifference"] = Number.isFinite(v) ? v : 0; } catch { results["rawDifference"] = 0; }
  return results;
}


export function calculateExcel_date_calculator(input: Excel_date_calculatorInput): Excel_date_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["daysDifference"] ?? 0;
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


export interface Excel_date_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
