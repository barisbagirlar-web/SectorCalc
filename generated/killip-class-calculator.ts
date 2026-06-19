// Auto-generated from killip-class-calculator-schema.json
import * as z from 'zod';

export interface Killip_class_calculatorInput {
  rales_extent: number;
  s3_gallop: number;
  systolic_bp: number;
  hypoperfusion: number;
  dataConfidence?: number;
}

export const Killip_class_calculatorInputSchema = z.object({
  rales_extent: z.number().default(0),
  s3_gallop: z.number().default(0),
  systolic_bp: z.number().default(120),
  hypoperfusion: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Killip_class_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hypoperfusion === 1 && input.systolic_bp < 90) ? 4 : (input.rales_extent > 50 ? 3 : ((input.rales_extent > 0 || input.s3_gallop === 1) ? 2 : 1)); results["killipClass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["killipClass"] = 0; }
  try { const v = (input.hypoperfusion === 1 && input.systolic_bp < 90) ? 81 : (input.rales_extent > 50 ? 38 : ((input.rales_extent > 0 || input.s3_gallop === 1) ? 17 : 6)); results["mortalityRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mortalityRisk"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKillip_class_calculator(input: Killip_class_calculatorInput): Killip_class_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["killipClass"]);
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


export interface Killip_class_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
