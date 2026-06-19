// Auto-generated from e-waste-calculator-schema.json
import * as z from 'zod';

export interface E_waste_calculatorInput {
  deviceCount: number;
  avgWeight: number;
  recyclablePercent: number;
  recoveryRate: number;
  dataConfidence?: number;
}

export const E_waste_calculatorInputSchema = z.object({
  deviceCount: z.number().default(100),
  avgWeight: z.number().default(2.5),
  recyclablePercent: z.number().default(60),
  recoveryRate: z.number().default(80),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: E_waste_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deviceCount * input.avgWeight; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) * (input.recyclablePercent / 100); results["recyclableWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recyclableWeight"] = 0; }
  try { const v = (asFormulaNumber(results["recyclableWeight"])) * (input.recoveryRate / 100); results["recoveredWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recoveredWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateE_waste_calculator(input: E_waste_calculatorInput): E_waste_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recoveredWeight"]);
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


export interface E_waste_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
