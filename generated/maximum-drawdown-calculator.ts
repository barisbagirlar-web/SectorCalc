// @ts-nocheck
// Auto-generated from maximum-drawdown-calculator-schema.json
import * as z from 'zod';

export interface Maximum_drawdown_calculatorInput {
  initialInvestment: number;
  peakValue: number;
  troughValue: number;
  timeToTrough: number;
  recoveryValue: number;
  recoveryTime: number;
}

export const Maximum_drawdown_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  peakValue: z.number().default(15000),
  troughValue: z.number().default(8000),
  timeToTrough: z.number().default(6),
  recoveryValue: z.number().default(15000),
  recoveryTime: z.number().default(12),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Maximum_drawdown_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.peakValue - input.troughValue) / input.peakValue) * 100; results["maxDrawdownPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxDrawdownPercent"] = 0; }
  try { const v = input.peakValue - input.troughValue; results["absoluteDrawdown"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["absoluteDrawdown"] = 0; }
  try { const v = ((input.initialInvestment - input.troughValue) / input.initialInvestment) * 100; results["lossFromInitialPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lossFromInitialPercent"] = 0; }
  try { const v = (input.peakValue / input.troughValue - 1) * 100; results["requiredRecoveryGainPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["requiredRecoveryGainPercent"] = 0; }
  try { const v = input.recoveryValue > 0 ? ((input.recoveryValue - input.troughValue) / input.troughValue) * 100 : 0; results["actualRecoveryGainPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualRecoveryGainPercent"] = 0; }
  results["recoveryStatus"] = 0;
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMaximum_drawdown_calculator(input: Maximum_drawdown_calculatorInput): Maximum_drawdown_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxDrawdownPercent"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
