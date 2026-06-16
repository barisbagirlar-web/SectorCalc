// Auto-generated from hra-calculator-schema.json
import * as z from 'zod';

export interface Hra_calculatorInput {
  basicSalary: number;
  da: number;
  hraReceived: number;
  rentPaid: number;
  cityType: number;
}

export const Hra_calculatorInputSchema = z.object({
  basicSalary: z.number().default(0),
  da: z.number().default(0),
  hraReceived: z.number().default(0),
  rentPaid: z.number().default(0),
  cityType: z.number().default(1),
});

function evaluateAllFormulas(input: Hra_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(input.hraReceived, (input.basicSalary + input.da) * (0.4 + 0.1 * input.cityType), input.rentPaid - 0.1 * (input.basicSalary + input.da)); results["exemption"] = Number.isFinite(v) ? v : 0; } catch { results["exemption"] = 0; }
  try { const v = Math.max(0, input.hraReceived - (results["exemption"] ?? 0)); results["taxableHRA"] = Number.isFinite(v) ? v : 0; } catch { results["taxableHRA"] = 0; }
  try { const v = (results["taxableHRA"] ?? 0) * 12; results["annualTaxableHRA"] = Number.isFinite(v) ? v : 0; } catch { results["annualTaxableHRA"] = 0; }
  return results;
}


export function calculateHra_calculator(input: Hra_calculatorInput): Hra_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["taxableHRA"] ?? 0;
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


export interface Hra_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
