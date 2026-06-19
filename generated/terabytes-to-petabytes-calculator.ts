// Auto-generated from terabytes-to-petabytes-calculator-schema.json
import * as z from 'zod';

export interface Terabytes_to_petabytes_calculatorInput {
  totalRawTerabytes: number;
  raidUsableMultiplier: number;
  formatOverheadPercent: number;
  conversionFactor: number;
  dataConfidence?: number;
}

export const Terabytes_to_petabytes_calculatorInputSchema = z.object({
  totalRawTerabytes: z.number().default(1),
  raidUsableMultiplier: z.number().default(1),
  formatOverheadPercent: z.number().default(5),
  conversionFactor: z.number().default(1000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Terabytes_to_petabytes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRawTerabytes * input.raidUsableMultiplier * (1 - input.formatOverheadPercent / 100); results["usableTB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["usableTB"] = 0; }
  try { const v = (input.totalRawTerabytes * input.raidUsableMultiplier * (1 - input.formatOverheadPercent / 100)) / input.conversionFactor; results["petabytes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["petabytes"] = 0; }
  try { const v = input.totalRawTerabytes / input.conversionFactor; results["rawPB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawPB"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTerabytes_to_petabytes_calculator(input: Terabytes_to_petabytes_calculatorInput): Terabytes_to_petabytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["petabytes"]);
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


export interface Terabytes_to_petabytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
