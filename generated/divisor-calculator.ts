// Auto-generated from divisor-calculator-schema.json
import * as z from 'zod';

export interface Divisor_calculatorInput {
  gear1Teeth: number;
  gear2Teeth: number;
  gear3Teeth: number;
  gear4Teeth: number;
  gear5Teeth: number;
  gear6Teeth: number;
  dataConfidence?: number;
}

export const Divisor_calculatorInputSchema = z.object({
  gear1Teeth: z.number().default(20),
  gear2Teeth: z.number().default(40),
  gear3Teeth: z.number().default(20),
  gear4Teeth: z.number().default(60),
  gear5Teeth: z.number().default(20),
  gear6Teeth: z.number().default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Divisor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gear2Teeth * input.gear4Teeth * input.gear6Teeth) / (input.gear1Teeth * input.gear3Teeth * input.gear5Teeth); results["overallGearRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallGearRatio"] = Number.NaN; }
  try { const v = input.gear2Teeth / input.gear1Teeth; results["stage1Ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stage1Ratio"] = Number.NaN; }
  try { const v = input.gear4Teeth / input.gear3Teeth; results["stage2Ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stage2Ratio"] = Number.NaN; }
  try { const v = input.gear6Teeth / input.gear5Teeth; results["stage3Ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stage3Ratio"] = Number.NaN; }
  return results;
}


export function calculateDivisor_calculator(input: Divisor_calculatorInput): Divisor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallGearRatio"]);
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


export interface Divisor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
