// Auto-generated from sugar-recovery-calculator-schema.json
import * as z from 'zod';

export interface Sugar_recovery_calculatorInput {
  caneWeight: number;
  polCane: number;
  extractionEfficiency: number;
  boilingHouseEfficiency: number;
  dataConfidence?: number;
}

export const Sugar_recovery_calculatorInputSchema = z.object({
  caneWeight: z.number().default(1000),
  polCane: z.number().default(14),
  extractionEfficiency: z.number().default(95),
  boilingHouseEfficiency: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sugar_recovery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.caneWeight * input.polCane / 100; results["totalSugar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSugar"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSugar"])) * input.extractionEfficiency / 100; results["extractedSugar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["extractedSugar"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["extractedSugar"])) * input.boilingHouseEfficiency / 100; results["recoveredSugar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recoveredSugar"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSugar"])) - (toNumericFormulaValue(results["extractedSugar"])); results["extractionLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["extractionLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["extractedSugar"])) - (toNumericFormulaValue(results["recoveredSugar"])); results["boilingLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["boilingLoss"] = Number.NaN; }
  return results;
}


export function calculateSugar_recovery_calculator(input: Sugar_recovery_calculatorInput): Sugar_recovery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recoveredSugar"]);
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


export interface Sugar_recovery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
