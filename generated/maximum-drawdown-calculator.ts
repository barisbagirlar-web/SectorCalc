// Auto-generated from maximum-drawdown-calculator-schema.json
import * as z from 'zod';

export interface Maximum_drawdown_calculatorInput {
  initialInvestment: number;
  peakValue: number;
  troughValue: number;
  timeToTrough: number;
  recoveryValue: number;
  recoveryTime: number;
  dataConfidence?: number;
}

export const Maximum_drawdown_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  peakValue: z.number().default(15000),
  troughValue: z.number().default(8000),
  timeToTrough: z.number().default(6),
  recoveryValue: z.number().default(15000),
  recoveryTime: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Maximum_drawdown_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.peakValue - input.troughValue) / input.peakValue) * 100; results["maxDrawdownPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxDrawdownPercent"] = Number.NaN; }
  try { const v = input.peakValue - input.troughValue; results["absoluteDrawdown"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["absoluteDrawdown"] = Number.NaN; }
  try { const v = ((input.initialInvestment - input.troughValue) / input.initialInvestment) * 100; results["lossFromInitialPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossFromInitialPercent"] = Number.NaN; }
  try { const v = (input.peakValue / input.troughValue - 1) * 100; results["requiredRecoveryGainPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredRecoveryGainPercent"] = Number.NaN; }
  try { const v = input.recoveryValue > 0 ? ((input.recoveryValue - input.troughValue) / input.troughValue) * 100 : 0; results["actualRecoveryGainPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualRecoveryGainPercent"] = Number.NaN; }
  return results;
}


export function calculateMaximum_drawdown_calculator(input: Maximum_drawdown_calculatorInput): Maximum_drawdown_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxDrawdownPercent"]);
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


export interface Maximum_drawdown_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
