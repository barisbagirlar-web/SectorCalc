// Auto-generated from bytes-to-kilobytes-calculator-schema.json
import * as z from 'zod';

export interface Bytes_to_kilobytes_calculatorInput {
  bytes: number;
  precision: number;
  convention: number;
  roundMode: number;
}

export const Bytes_to_kilobytes_calculatorInputSchema = z.object({
  bytes: z.number().default(0),
  precision: z.number().default(2),
  convention: z.number().default(1024),
  roundMode: z.number().default(1),
});

function evaluateAllFormulas(input: Bytes_to_kilobytes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bytes / input.convention; results["exact"] = Number.isFinite(v) ? v : 0; } catch { results["exact"] = 0; }
  try { const v = (() => { const e = exact; const m = Math.pow(10, precision); const rm = roundMode; if (rm === 0) return e; if (rm === 1) return Math.round(e * m) / m; if (rm === 2) return Math.ceil(e * m) / m; return Math.floor(e * m) / m; })(); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  results["__bytes___bytes"] = 0;
  results["__convention___bytes_per_kilobyte"] = 0;
  results["__exact___KB"] = 0;
  results["__result___KB"] = 0;
  return results;
}


export function calculateBytes_to_kilobytes_calculator(input: Bytes_to_kilobytes_calculatorInput): Bytes_to_kilobytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Bytes_to_kilobytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
